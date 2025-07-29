import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { UserDocument } from 'src/api/user/schema/user.schema';
import { UserService } from 'src/api/user/user.service';
import { comparePassword } from 'src/utils/password.util';

import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtPayload } from './interfaces/jwt.interface';

import type { Request, Response } from 'express';

@Injectable()
export class AuthService {
  private readonly COOKIE_DOMAIN: string;
  private readonly JWT_ACCESS_TOKEN_TTL: string;
  private readonly JWT_REFRESH_TOKEN_TTL: string;

  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.COOKIE_DOMAIN = configService.getOrThrow<string>('COOKIE_DOMAIN');
    this.JWT_ACCESS_TOKEN_TTL = configService.getOrThrow<string>(
      'JWT_ACCESS_TOKEN_TTL',
    );
    this.JWT_REFRESH_TOKEN_TTL = configService.getOrThrow<string>(
      'JWT_REFRESH_TOKEN_TTL',
    );
  }

  async validate(id: string): Promise<UserDocument> {
    return await this.usersService.findById(id);
  }

  async login(res: Response, credentials: LoginDto) {
    const user = await this.usersService.findOne(credentials.email, [
      '_id',
      'firstname',
      'lastname',
      'passwordHash',
    ]);

    const INVALID_CREDENTIALS_ERROR = 'Invalid credentials';

    if (!user) {
      throw new NotFoundException(INVALID_CREDENTIALS_ERROR);
    }

    const isPasswordValid = await comparePassword(
      credentials.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new NotFoundException(INVALID_CREDENTIALS_ERROR);
    }

    return this.authenticate(res, user);
  }

  async register({ email, password, firstname, lastname }: RegisterDto) {
    const user = await this.usersService.create({
      email,
      password,
      firstname,
      lastname,
    });

    return user._id;
  }

  async refreshToken(req: Request, res: Response) {
    const refreshToken = req.cookies['refresh_token'] as string;

    if (!refreshToken) {
      throw new NotFoundException('Refresh token not found');
    }

    const payload = this.jwtService.verify<JwtPayload>(refreshToken, {
      secret: this.configService.getOrThrow<string>('JWT_REFRESH_TOKEN_SECRET'),
    });

    if (!payload) {
      throw new NotFoundException('Invalid refresh token');
    }

    const user = await this.usersService.findById(payload.sub, [
      '_id',
      'firstname',
      'lastname',
    ]);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.authenticate(res, user);
  }

  logout(res: Response) {
    res.clearCookie('refresh_token', {
      httpOnly: true,
      domain: this.COOKIE_DOMAIN,
      // secure: process.env.NODE_ENV === 'production',
      sameSite: 'none', // Adjust as needed to 'Lax' or 'Strict'
    });

    return { message: 'Logged out successfully' };
  }

  private authenticate(res: Response, user: UserDocument) {
    const { access_token, refresh_token } = this.generateJwtToken(user);

    this.setCookie(res, refresh_token, this.JWT_REFRESH_TOKEN_TTL);

    return {
      access_token,
    };
  }

  private generateJwtToken(user: UserDocument) {
    const payload: JwtPayload = {
      sub: user.id as string,
      firstname: user.firstname,
      lastname: user.lastname,
    };

    const access_token = this.jwtService.sign(payload, {
      expiresIn: this.JWT_ACCESS_TOKEN_TTL,
    });

    const refresh_token = this.jwtService.sign(payload, {
      expiresIn: this.JWT_REFRESH_TOKEN_TTL,
    });

    return {
      access_token,
      refresh_token,
    };
  }

  private setCookie(res: Response, value: string, expiresIn: string) {
    res.cookie('refresh_token', value, {
      httpOnly: true,
      domain: this.COOKIE_DOMAIN,
      // secure: process.env.NODE_ENV === 'production',
      maxAge: parseInt(expiresIn, 10) * 1000, // Convert seconds to milliseconds
      sameSite: 'none', // Adjust as needed to 'Lax' or 'Strict'
    });
  }
}
