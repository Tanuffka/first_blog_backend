import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';

import { TagService } from './tag.service';

@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  findAll() {
    return this.tagService.findAll();
  }

  @HttpCode(HttpStatus.OK)
  @Get(':articleId')
  findTagByArticleId(@Param('articleId') articleId: string) {
    return this.tagService.findAllByArticleId(articleId);
  }
}
