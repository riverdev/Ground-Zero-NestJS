import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsEmail()
  emailAddress: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  @MinLength(6)
  //! This password here is not hashed, it is what the users types in when signing up.
  plainTextLoginPassword: string;
}
