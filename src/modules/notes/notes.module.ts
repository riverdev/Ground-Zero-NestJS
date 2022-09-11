import { Module } from '@nestjs/common';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';

console.log();

@Module({
  controllers: [NotesController],
  providers: [NotesService],
})
export class NotesModule {}
