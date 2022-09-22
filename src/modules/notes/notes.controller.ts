//* notes.controller.ts

import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Logger,
  NotFoundException,
  Param,
  Patch,
  Post,
  RequestTimeoutException,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBasicAuth,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { string } from 'joi';

import { CreateNoteDto } from './dtos/create-note.dto';
import { UpdateNoteDto } from './dtos/update-note.dto';
import { NotesService } from './notes.service';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}
  private readonly logger = new Logger(NotesController.name);

  //  The Notes Home
  @Get()
  homeNotes(): string {
    this.logger.verbose(`>> Flow: Notes Homepage >> `);

    // This next throw demos the custom exception , you can choose from all the HTTP codes
    // not just the error codes.
    // Link to list of all HTTP codes:   https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
    //throw new HttpException('My custom exception', HttpStatus.INTERNAL_SERVER_ERROR);

    // This next throw demos the Nest built-in exceptions
    //throw new RequestTimeoutException('Hello guys');

    return this.notesService.noteHomepageWelcome();
  }

  //  The Notes Home
  @Get('error')
  errorNotes(): string {
    this.logger.verbose(`>> Flow: Notes error example >> `);

    //Following is throwing a nest-built-in error
    //throw new RequestTimeoutException('Just triggering an error');
    //throw new BadRequestException('Just triggering an error');

    throw new NotFoundException(`Could not find the thing.`);

    // The following is a way to throw any error, not just nest-built-in
    //throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);

    return this.notesService.noteHomepageWelcome();
  }

  //  The List Notes Route
  @ApiBasicAuth()
  @Get('list')
  listNotes(): string {
    this.logger.verbose(`>> Flow: List all Notes >> `);
    return 'List of all the notes';
  }

  /**
   *
   * LALALA  =========  This is a swagger plugin test
   *
   * @param id
   * @param input
   * @returns
   */
  @Post(':id')
  @ApiBadRequestResponse({ description: 'Bad request here' })
  @ApiOkResponse({ description: 'All OK' })
  postNote(@Param('id') id: string, @Body() input: CreateNoteDto) {
    this.logger.verbose(
      `>> Flow: Post a Note >> Posted note with id="${id}" and content : `,
    );
    //    console.log(`Posted note with id="${id}" and content : `);

    return input;
  }

  @Patch(':id')
  patchNote(@Param('id') id: string, @Body() input: UpdateNoteDto) {
    this.logger.verbose(
      `>> Flow: Patch a Note >> Patched a note with id="${id}".`,
    );
    //console.log(`Patched a note with id="${id}". `);

    return input;
  }

  @Delete(':id')
  @HttpCode(204) //Status code 204 means "No content"
  @ApiNoContentResponse({ description: 'No content ' })
  @ApiTags('======= The example Delete endpoint =======')
  @ApiOperation({ summary: 'Example of summary text for DELETE path' })
  deleteNote(@Param('id') id: string) {
    this.logger.verbose(
      `>> Flow: Delete a Note >> Note with id=${id} deleted.`,
    );
    //console.log(`Note with id=${id} deleted.`);
  }
}
