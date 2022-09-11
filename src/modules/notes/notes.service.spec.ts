import { Test, TestingModule } from '@nestjs/testing';
import { NotesService } from './notes.service';

describe('NotesService', () => {
  let service: NotesService;

  const HOME_MESSAGE: string = 'This is the home page of notes.';
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotesService],
    }).compile();

    service = module.get<NotesService>(NotesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should have home message', async () => {
    expect(service.noteHomepageWelcome()).toEqual(HOME_MESSAGE);
  });
});
