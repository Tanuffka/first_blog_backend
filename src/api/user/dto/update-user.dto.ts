import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UpdateUserDto {
  @IsEmail(undefined, { message: 'Email field should be valid' })
  @IsString()
  @IsNotEmpty({ message: 'Email field is required' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Firstname field is required' })
  @MaxLength(20, { message: 'Firstname should not exceed 50 characters' })
  firstname: string;

  @IsString()
  @IsNotEmpty({ message: 'Lastname field is required' })
  @MaxLength(20, { message: 'Lastname should not exceed 50 characters' })
  lastname: string;
}
