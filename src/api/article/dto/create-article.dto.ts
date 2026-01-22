import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsUrl,
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

  @IsArray({ message: 'Field tags should be an array' })
  @IsOptional()
  readonly tags: string[];

  @IsUrl(undefined, { message: 'Field imageUrl should be a valid URL' })
  @IsOptional()
  readonly imageUrl: string;
}
