import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'Firstname field is required' })
  @MaxLength(20, { message: 'Firstname should not exceed 20 characters' })
  firstname: string;

  @IsString()
  @IsNotEmpty({ message: 'Lastname field is required' })
  @MaxLength(50, { message: 'Lastname should not exceed 50 characters' })
  lastname: string;

  @IsString()
  @IsOptional()
  @MaxLength(100, { message: 'Bio should not exceed 100 characters' })
  bio: string;
}
