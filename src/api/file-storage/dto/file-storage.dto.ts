import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class FileStorageDto {
  @IsNotEmpty({ message: 'Field fileKey is required' })
  @IsString({ message: 'Field fileKey should be a string' })
  @MaxLength(100, {
    message: 'Field fileKey should not exceed 100 characters',
  })
  fileKey: string;
}
