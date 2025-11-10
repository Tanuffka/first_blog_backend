import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';

import { AuthorizedUser } from 'src/api/auth/decorators/authorized-user.decorator';
import { WithJWT } from 'src/api/auth/decorators/with-jwt.decorator';

import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @WithJWT()
  @HttpCode(HttpStatus.CREATED)
  @Post()
  create(@Body() data: CreateCommentDto, @AuthorizedUser('id') userId: string) {
    return this.commentService.create(data, userId);
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentService.findById(id);
  }

  @WithJWT()
  @HttpCode(HttpStatus.OK)
  @Put(':id')
  update(
    @Param('id') id: string,
    @AuthorizedUser('id') userId: string,
    @Body() updateArticleDto: UpdateCommentDto,
  ) {
    return this.commentService.update(id, userId, updateArticleDto);
  }

  @WithJWT()
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  remove(@Param('id') id: string, @AuthorizedUser('id') userId: string) {
    return this.commentService.remove(id, userId);
  }
}
