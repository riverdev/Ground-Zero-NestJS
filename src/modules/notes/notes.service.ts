import { Injectable, Logger } from '@nestjs/common';
import { AppController } from '../../app.controller';

@Injectable()
export class NotesService {
  private readonly logger = new Logger(AppController.name);

  noteHomepageWelcome(): string {
    this.logger.verbose(`>> Flow: >>  Service Note Homepage Welcome`);

    return 'This is the home page of notes.';
  }
}
