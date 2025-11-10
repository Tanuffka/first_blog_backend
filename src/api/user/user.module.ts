import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { FileModule } from 'src/api/file/file.module';

import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User, UserSchema } from './schema/user.schema';

const UserMongooseModule = MongooseModule.forFeature([
  { name: User.name, schema: UserSchema },
]);

@Module({
  imports: [UserMongooseModule, FileModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserMongooseModule, UserService],
})
export class UserModule {}
