import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  //Matches,  //Used for regex logic
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserFiledbDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  @MinLength(3)
  loginName: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  @MinLength(3)
  //Using regex to add rules to password:
  //todo The regex rules dont need to be used for the hash but should be used
  //todo in the frontend to make sure user types in password by the rules
  //todo @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {message: 'Password is weak'})
  //Passwords will contain at least 1 upper case letter
  //Passwords will contain at least 1 lower case letter
  //Passwords will contain at least 1 number or special character
  //There is no length validation (min, max) in this regex!
  passwordHash: string;

  @IsOptional()
  roles: string[];

  @IsNotEmpty()
  @IsEmail()
  @IsOptional()
  //todo:  Must validate in the createUser function that the emailAddress is unique in the db
  //! Must validate in the createUser function that the emailAddress is unique in the db
  emailAddress: string;

  @IsOptional()
  @IsString()
  hashRefreshToken: string;
}
