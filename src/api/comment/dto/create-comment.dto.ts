import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty({ message: 'Field content is required' })
  @MaxLength(500, {
    message: 'Field content should not exceed 500 characters',
  })
  content: string;

  @IsString({ message: 'Field article should be a valid article ID' })
  article: string;

  @IsString({ message: 'Field responseTo should be a valid article ID' })
  @IsOptional()
  responseTo: string;
}
