import {
  BadRequestException,
  HttpStatus,
  RequestTimeoutException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';

const LIST_NOTES_MESSAGE = 'List of all the notes';

describe('NotesController', () => {
  let controller: NotesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotesController],
      providers: [NotesService],
    }).compile();

    controller = module.get<NotesController>(NotesController);
  });

  describe('root', () => {
    it('should return homepage message', () => {
      expect(controller.homeNotes()).toBe('This is the home page of notes.');
    });

    //todo: For some reason this ignores the error thrown in the controller
    //todo: in route notes/error
    // it('should return error', () => {
    //   expect(controller.errorNotes()).toThrow( BadRequestException );
    // });

    it('should return list of notes message', () => {
      expect(controller.listNotes()).toEqual(LIST_NOTES_MESSAGE);
    });

    it('postNote should be defined', () => {
      expect(controller.postNote).toBeDefined();
    });

    it('patchNote should be defined', () => {
      expect(controller.patchNote).toBeDefined();
    });

    it('deleteNote should be defined', () => {
      expect(controller.deleteNote).toBeDefined();
    });
  });
});
