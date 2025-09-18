import { IsOptional, IsString, MaxLength } from 'class-validator';

export class PatchUserDto {
  @IsString()
  @IsOptional()
  @MaxLength(20, { message: 'Firstname should not exceed 20 characters' })
  firstname: string;

  @IsString()
  @IsOptional()
  @MaxLength(50, { message: 'Lastname should not exceed 50 characters' })
  lastname: string;

  @IsString()
  @IsOptional()
  @MaxLength(100, { message: 'Bio should not exceed 100 characters' })
  bio: string;
}
