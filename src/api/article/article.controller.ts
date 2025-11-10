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
import { CommentService } from 'src/api/comment/comment.service';

import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@Controller('articles')
export class ArticleController {
  constructor(
    private readonly articleService: ArticleService,
    private readonly commentService: CommentService,
  ) {}

  @WithJWT()
  @HttpCode(HttpStatus.CREATED)
  @Post()
  create(
    @Body() createArticleDto: CreateArticleDto,
    @AuthorizedUser('id') userId: string,
  ) {
    return this.articleService.create(createArticleDto, userId);
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  findAll() {
    return this.articleService.findAll();
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.articleService.findById(id);
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id/comments')
  findCommentsForArticle(@Param('id') id: string) {
    return this.commentService.findAllByArticleId(id);
  }

  @WithJWT()
  @HttpCode(HttpStatus.OK)
  @Put(':id')
  update(
    @Param('id') id: string,
    @AuthorizedUser('id') userId: string,
    @Body() updateArticleDto: UpdateArticleDto,
  ) {
    return this.articleService.update(id, userId, updateArticleDto);
  }

  @WithJWT()
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  remove(@Param('id') id: string, @AuthorizedUser('id') userId: string) {
    return this.articleService.remove(id, userId);
  }
}
