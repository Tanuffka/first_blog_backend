import { ApiProperty } from '@nestjs/swagger';

import { PageOptionsDto } from './page-options.dto';

export interface PageMetaDtoParams {
  pageOptionsDto: PageOptionsDto;
  itemCount: number;
}

export class PageMetaDto {
  @ApiProperty({ description: 'Current page number', example: 1 })
  readonly page: number;

  @ApiProperty({ description: 'Number of items per page', example: 10 })
  readonly limit: number;

  @ApiProperty({ description: 'Total number of items', example: 100 })
  readonly totalItems: number;

  @ApiProperty({ description: 'Total number of pages', example: 10 })
  readonly totalPages: number;

  @ApiProperty({
    description: 'Indicates if there is a previous page',
    example: true,
  })
  readonly hasPreviousPage: boolean;

  @ApiProperty({
    description: 'Indicates if there is a next page',
    example: true,
  })
  readonly hasNextPage: boolean;

  constructor({ pageOptionsDto, itemCount }: PageMetaDtoParams) {
    this.page = pageOptionsDto.page;
    this.limit = pageOptionsDto.limit;
    this.totalItems = itemCount;
    this.totalPages = Math.ceil(itemCount / pageOptionsDto.limit);
    this.hasPreviousPage = pageOptionsDto.page > 1;
    this.hasNextPage = pageOptionsDto.page < this.totalPages;
  }
}
