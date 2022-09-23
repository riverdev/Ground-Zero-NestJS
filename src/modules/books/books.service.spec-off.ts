import { InjectModel } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { BooksModule } from './books.module';
import { BooksService } from './books.service';
import { Book, BookSchema } from './schemas/book.schema';

describe('BooksService', () => {
  let service: BooksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [BooksService],
    }).compile();

    service = module.get<BooksService>(BooksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
