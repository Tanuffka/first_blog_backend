import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class FileStorageDto {
  @IsNotEmpty({ message: 'Field fileKey is required' })
  @IsString({ message: 'Field fileKey should be a string' })
  @MaxLength(200, {
    message: 'Field fileKey should not exceed 200 characters',
  })
  fileKey: string;
}
