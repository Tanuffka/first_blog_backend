import { Model, MongooseError } from 'mongoose';

import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { hashPassword } from 'src/shared/utils/password.util';
import { FileService } from 'src/api/file/file.service';

import {
  PUBLIC_USER_FIELDS,
  PublicUserData,
  User,
  UserDocument,
} from './schema/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PatchUserDto } from './dto/patch-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly fileService: FileService,
  ) {}

  async create(user: CreateUserDto): Promise<PublicUserData> {
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

  async findAll(): Promise<PublicUserData[]> {
    return await this.userModel
      .find()
      .select(PUBLIC_USER_FIELDS)
      .orFail()
      .exec();
  }

  async findById(
    id: string,
    fields: (keyof UserDocument)[] = PUBLIC_USER_FIELDS,
  ): Promise<UserDocument> {
    return this.userModel
      .findById(id)
      .select(fields)
      .orFail(new NotFoundException('User not found')) // WARN: need for auth client validation
      .exec();
  }

  async findOne(
    email: string,
    fields: (keyof UserDocument)[] = PUBLIC_USER_FIELDS,
  ): Promise<UserDocument | null | undefined> {
    return this.userModel.findOne({ email }).select(fields).exec();
  }

  async update(id: string, user: UpdateUserDto): Promise<PublicUserData> {
    return await this.userModel
      .findByIdAndUpdate(id, user, { new: true })
      .select(PUBLIC_USER_FIELDS)
      .orFail()
      .exec();
  }

  /** NOTE: method written only for example */
  async updatePartially(
    id: string,
    user: PatchUserDto,
  ): Promise<PublicUserData> {
    const query = Object.entries(user).reduce(
      (result, [key, value]) => {
        if (!value) return result;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        result.$set[key] = value;
        return result;
      },
      {
        $set: {},
      },
    );

    return await this.userModel
      .findByIdAndUpdate(id, query, { new: true })
      .select(PUBLIC_USER_FIELDS)
      .orFail()
      .exec();
  }

  async updateAvatar(
    id: string,
    avatarUrl: string,
  ): Promise<Pick<PublicUserData, 'avatarUrl'>> {
    /** WARN: { new: false } - will return user before update, do not change */
    const userDataBeforeUpdate = await this.userModel
      .findByIdAndUpdate(id, { avatarUrl }, { new: false })
      .select('avatarUrl')
      .orFail()
      .exec();

    /** NOTE: delete previous file if it exists */
    if (userDataBeforeUpdate.avatarUrl) {
      this.fileService.deleteFile(userDataBeforeUpdate.avatarUrl);
    }

    return { avatarUrl };
  }

  async deleteAvatar(id: string): Promise<PublicUserData> {
    const user = await this.userModel
      .findById(id)
      .select(PUBLIC_USER_FIELDS)
      .orFail()
      .exec();

    const { avatarUrl } = user;

    user.avatarUrl = undefined;

    await user.save();

    if (avatarUrl) {
      this.fileService.deleteFile(avatarUrl);
    }

    return user;
  }

  async delete(id: string): Promise<PublicUserData> {
    return await this.userModel
      .findByIdAndDelete(id, { returnOriginal: true })
      .select('id')
      .orFail()
      .exec();
  }
}
