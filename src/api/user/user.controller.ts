import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  UploadedFile,
} from '@nestjs/common';

import { WithJWT } from 'src/api/auth/decorators/with-jwt.decorator';
import { AuthorizedUser } from 'src/api/auth/decorators/authorized-user.decorator';
import { WithFileUpload } from 'src/api/file/with-file-upload.decorator';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PatchUserDto } from './dto/patch-user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @WithJWT()
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createUser(@Body() user: CreateUserDto) {
    return await this.userService.create(user);
  }

  @WithJWT()
  @HttpCode(HttpStatus.OK)
  @Get()
  async fetchAll() {
    return await this.userService.findAll();
  }

  @WithJWT()
  @HttpCode(HttpStatus.OK)
  @Get('/me')
  async getMe(@AuthorizedUser('id') userId: string) {
    return await this.userService.findById(userId);
  }

  @WithJWT()
  @WithFileUpload()
  @HttpCode(HttpStatus.OK)
  @Put('/me/avatar')
  async updateAvatar(
    @AuthorizedUser('id') userId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.userService.updateAvatar(
      userId,
      `/storage/users/${userId}/${file.filename}`,
    );
  }

  @WithJWT()
  @HttpCode(HttpStatus.OK)
  @Delete('/me/avatar')
  async deleteAvatar(@AuthorizedUser('id') userId: string) {
    return await this.userService.deleteAvatar(userId);
  }

  @WithJWT()
  @HttpCode(HttpStatus.OK)
  @Get('/:id')
  async findOne(@Param('id') id: string) {
    return await this.userService.findById(id);
  }

  @WithJWT()
  @HttpCode(HttpStatus.OK)
  @Put('/:id')
  async update(@Param('id') id: string, @Body() user: UpdateUserDto) {
    return await this.userService.update(id, user);
  }

  /** NOTE: method written only for example */
  @WithJWT()
  @HttpCode(HttpStatus.OK)
  @Patch('/:id')
  async updatePartially(@Param('id') id: string, @Body() user: PatchUserDto) {
    return await this.userService.updatePartially(id, user);
  }

  @WithJWT()
  @HttpCode(HttpStatus.OK)
  @Delete('/:id')
  async delete(@Param('id') id: string) {
    return await this.userService.delete(id);
  }
}
