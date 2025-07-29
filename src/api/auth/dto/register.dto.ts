import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    description: 'User email address',
    example: 'username@email.com',
  })
  @IsEmail(undefined, { message: 'Field email should be valid' })
  @IsNotEmpty({ message: 'Field email is required' })
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'password12345',
  })
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
  password: string;

  @ApiProperty({
    description: 'User firstname',
    example: 'John',
  })
  @IsNotEmpty({ message: 'Field firstname is required' })
  firstname: string;

  @ApiProperty({
    description: 'User lastname',
    example: 'Doe',
  })
  @IsNotEmpty({ message: 'Field lastname is required' })
  lastname: string;
}
