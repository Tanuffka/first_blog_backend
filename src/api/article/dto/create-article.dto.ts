import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

import { CoverCroppedImageDto, CoverImageDto } from './cover-image.dto';

export class CreateArticleDto {
  @IsNotEmpty({ message: 'Field title is required' })
  @MaxLength(100, { message: 'Field title should not exceed 100 characters' })
  readonly title: string;

  @IsNotEmpty({ message: 'Field content is required' })
  @MaxLength(1000, {
    message: 'Field content should not exceed 1000 characters',
  })
  readonly content: string;

  @IsNotEmpty({ message: 'Field tags is required' })
  @IsArray({ message: 'Field tags should be an array' })
  readonly tags: string[];

  @Type(() => CoverImageDto)
  @IsOptional()
  readonly coverImage?: CoverImageDto;

  @Type(() => CoverCroppedImageDto)
  @IsOptional()
  readonly coverCroppedImage?: CoverCroppedImageDto;
}
