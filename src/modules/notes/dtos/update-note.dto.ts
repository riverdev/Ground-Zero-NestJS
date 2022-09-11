//* update-note.dto.ts

//For the following import use: npm install @nestjs/mapped-types
import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateNoteDto } from './create-note.dto';

export class UpdateNoteDto extends PartialType(
  OmitType(CreateNoteDto, ['urgency'] as const),
  // Now UpdateNoteDto has every property except "urgency".
  //! A of UpdateNoteDto's properties are marked as optional because we extended PartialType
) {}
