import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEmail,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SignupDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  @MinLength(3)
  // The uniqueness of the userName is up to the app business logic. Doesnt have to be unique regarding the engeneering aspect.
  userName: string;

  //@IsNotEmpty()
  //@IsString()
  @MaxLength(20)
  @MinLength(6)
  //Using regex to add rules to password:
  //todo The regex rules dont need to be used for the hash but should be used
  //todo in the frontend to make sure user types in password by the rules
  //todo @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {message: 'Password is weak'})
  //Passwords will contain at least 1 upper case letter
  //Passwords will contain at least 1 lower case letter
  //Passwords will contain at least 1 number or special character
  //There is no length validation (min, max) in this regex!
  //! This password here is not hashed, it is what the users types in when signing up.
  plainTextSignupPassword: string;

  @IsNotEmpty()
  @IsEmail()
  //! Thee emailAddress has to be unique in the database (it is already unique globally but also the db needs to mandate that it is internally unique in app)
  //todo: So if implementing on real database need to decorate as unique.
  emailAddress: string;
}
