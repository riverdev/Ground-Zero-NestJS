import { IsOptional, IsString } from 'class-validator';

export class FilterUserFiledbDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  @IsOptional()
  loginName?: string;

  @IsString()
  @IsOptional()
  passwordHash?: string;

  @IsString()
  @IsOptional()
  emailAddress?: string;
}
