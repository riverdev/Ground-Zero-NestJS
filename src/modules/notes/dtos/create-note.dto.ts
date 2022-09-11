//* create-note.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, Min, Max, MaxLength } from 'class-validator';

export class CreateNoteDto {
  @ApiProperty({
    description: 'The age of a cat',
    type: String,
    minimum: 1,
    default: 'Hello',
  })
  @IsString()
  @MaxLength(10)
  title: string;

  @ApiProperty()
  @Min(1) // 1 is lowest urgency
  @Max(3) // 3 is highest urgency
  @IsNumber()
  urgency: number;
}
