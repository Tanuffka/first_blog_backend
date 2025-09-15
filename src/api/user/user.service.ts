import { Model, MongooseError } from 'mongoose';

import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { hashPassword } from 'src/utils/password.util';

import { User, UserDocument } from './schema/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(user: CreateUserDto): Promise<UserDocument> {
    const foundUser = await this.findOne(user.email);

    if (foundUser) {
      throw new ConflictException('User with this email already exists');
    }

    try {
      const newUser = new this.userModel(user);

      newUser.passwordHash = await hashPassword(user.password);
      newUser.email = user.email.toLowerCase();
      newUser.firstname = user.firstname.trim();
      newUser.lastname = user.lastname.trim();

      return await newUser.save({ safe: true });
    } catch (error) {
      const err = error as MongooseError;
      throw new ConflictException('Error creating user: ' + err.message);
    }
  }

  async findAll(): Promise<UserDocument[]> {
    return await this.userModel.find().select('-passwordHash').exec();
  }

  async findById(
    id: string,
    fields: (keyof UserDocument)[] = [
      'id',
      'email',
      'firstname',
      'lastname',
      'bio',
    ],
  ): Promise<UserDocument> {
    return this.userModel
      .findById(id)
      .select(fields)
      .orFail(new NotFoundException('User not found')) // !important: need for auth validate
      .exec();
  }

  async findOne(
    email: string,
    fields: (keyof UserDocument)[] = [
      'id',
      'email',
      'firstname',
      'lastname',
      'bio',
    ],
  ): Promise<UserDocument | null | undefined> {
    return this.userModel.findOne({ email }).select(fields).exec();
  }

  async update(id: string, user: UpdateUserDto): Promise<UserDocument> {
    return await this.userModel
      .findByIdAndUpdate(id, user, { new: true })
      .select('id email firstname lastname bio')
      .orFail()
      .exec();
  }

  async delete(id: string): Promise<UserDocument> {
    return await this.userModel
      .findByIdAndDelete(id, { returnOriginal: true })
      .select('id')
      .orFail()
      .exec();
  }
}
