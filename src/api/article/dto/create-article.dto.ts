import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

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

  @IsString({ message: 'Field coverImage should be string' })
  @MaxLength(200, {
    message: 'Field coverImage should not exceed 200 characters',
  })
  @IsOptional()
  readonly coverImage?: string;
}
