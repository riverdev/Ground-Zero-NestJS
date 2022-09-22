import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book, BookDocument } from './schemas/book.schema';

@Injectable()
export class BooksService {
  constructor(@InjectModel(Book.name) private bookModel: Model<BookDocument>) {}
  private readonly logger = new Logger(BooksService.name);

  async create(createBookDto: CreateBookDto): Promise<String> {
    const createdBook = new this.bookModel(createBookDto);
    const result = await createdBook.save();
    //const result
    return result._id as string;
  }

  async findAll(): Promise<any> {
    const allBooks = await this.bookModel.find().exec();
    //console.log(`result = ${jsonPrettify(allBooks)}`);
    const nicelyFormatedBooksObject = allBooks.map((bookItem) => ({
      id: bookItem._id,
      title: bookItem.title,
      description: bookItem.desc,
      price: bookItem.price,
    }));
    return nicelyFormatedBooksObject;
  }

  async findById(id: string) {
    const bookFound = await this.bookModel.findById(id).exec();

    // if (!bookFound) {
    //   throw new NotFoundException(`Could not find the book with id = ${id}`);
    // }

    const nicelyFormatedSingleBook = {
      id: bookFound._id,
      title: bookFound.title,
      description: bookFound.desc,
      price: bookFound.price,
    };

    return nicelyFormatedSingleBook;
  }

  update(id: number, updateBookDto: UpdateBookDto) {
    return `This action updates a #${id} book`;
  }

  remove(id: number) {
    return `This action removes a #${id} book`;
  }
}
