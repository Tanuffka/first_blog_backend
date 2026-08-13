import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
} from '@nestjs/common';

import { SearchQueryDto } from './dto/search-query.dto';
import { TagService } from './tag.service';

@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  findAll(@Query() searchQueryDto: SearchQueryDto) {
    return this.tagService.findAll(searchQueryDto);
  }

  @HttpCode(HttpStatus.OK)
  @Get(':articleId')
  findTagByArticleId(@Param('articleId') articleId: string) {
    return this.tagService.findAllByArticleId(articleId);
  }
}
