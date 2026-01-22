import { IsNotEmpty, MaxLength } from 'class-validator';

export class CreateTagDto {
  @IsNotEmpty({ message: 'Field tag is required' })
  @MaxLength(10, {
    message: 'Field tag should not exceed 10 characters',
  })
  readonly name: string;

  @IsNotEmpty({ message: 'Field articleId is required' })
  readonly articleId: string;
}
