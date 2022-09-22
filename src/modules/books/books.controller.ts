import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Logger,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from './schemas/book.schema';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}
  private readonly logger = new Logger(BooksController.name);

  @Post()
  async create(@Body() createBookDto: CreateBookDto): Promise<String> {
    return await this.booksService.create(createBookDto);
  }

  @Get()
  async findAll(): Promise<any> {
    return await this.booksService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<any> {
    return this.booksService.findById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.booksService.update(+id, updateBookDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.booksService.remove(+id);
  }
}
