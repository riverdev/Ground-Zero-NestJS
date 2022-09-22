import { IsNumber, IsString } from 'class-validator';

export class CreateBookDto {
  @IsString()
  title: string;

  @IsString()
  desc: string;

  @IsNumber()
  price: number;
}
