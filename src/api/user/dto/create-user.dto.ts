import {
  IsEmail,
  IsNotEmpty,
  IsStrongPassword,
  MaxLength,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail(undefined, { message: 'Field email should be valid' })
  @IsNotEmpty({ message: 'Field email is required' })
  email: string;

  @IsNotEmpty({ message: 'Field firstname is required' })
  @MaxLength(20, { message: 'Field firstname should not exceed 20 characters' })
  firstname: string;

  @IsNotEmpty({ message: 'Field lastname is required' })
  @MaxLength(20, { message: 'Field lastname should not exceed 20 characters' })
  lastname: string;

  @IsNotEmpty({ message: 'Field password is required' })
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    { message: 'Field password must be strong' },
  )
  @MaxLength(100, {
    message: 'Field password should not exceed 100 characters',
  })
  password: string;
}
