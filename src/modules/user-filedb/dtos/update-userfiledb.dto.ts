//* update-user.dto.ts

import { IsString, IsNumber, MaxLength, IsOptional } from 'class-validator';

export class UpdateUserFiledbDto {
  @IsString()
  id: string;

  // @IsOptional()
  // @IsNumber()
  // orderCount: number;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  loginName: string;

  @IsOptional()
  @IsString()
  passwordHash: string;

  @IsOptional()
  roles: string[];

  @IsOptional()
  @IsString()
  @MaxLength(50)
  emailAddress: string;

  @IsOptional()
  @IsString()
  passwordSalt: string;

  @IsOptional()
  @IsString()
  hashAlgorithm: string;

  @IsOptional()
  @IsString()
  confirmationToken: string;

  @IsOptional()
  @IsString()
  hashRefreshToken: string;

  @IsOptional()
  @IsString()
  tokenGenerationTime: string;

  @IsOptional()
  @IsString()
  tokenExpirationTime: string;

  @IsOptional()
  @IsString()
  emailValidationStatus: string;
}
