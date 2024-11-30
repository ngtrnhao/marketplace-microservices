import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsString,
  IsOptional,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsNotEmpty()
  bio?: string;

  @IsString()
  @IsOptional()
  phoneNumber?: string;
}
