// books.service.ts

import { Injectable, Logger, NotFoundException } from '@nestjs/common';
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
    const myBook = await this.findABook(id);

    const nicelyFormatedSingleBook = {
      id: myBook._id,
      title: myBook.title,
      description: myBook.desc,
      price: myBook.price,
    };

    return nicelyFormatedSingleBook;
  }

  async updateBook(
    id: string,
    updateBookDto: UpdateBookDto,
  ): Promise<BookDocument> {
    //const myBook = await this.findABook(id);
    const myBook = await this.bookModel.findById(id).exec();

    if (updateBookDto.title) {
      myBook.title = updateBookDto.title;
    }

    if (updateBookDto.desc) {
      myBook.desc = updateBookDto.desc;
    }

    if (updateBookDto.price) {
      myBook.price = updateBookDto.price;
    }

    myBook.save();
    return myBook;
  }

  async deleteBook(targetId: string) {
    try {
      await this.bookModel.deleteOne({ _id: targetId }).exec();
    } catch (error) {
      throw new NotFoundException(
        `Could not find a book to delete with id = ${targetId}`,
      );
    }

    return `This action removes a #${targetId} book`;
  }

  //---------------------Utility private methods

  private async findABook(id: string): Promise<BookDocument> {
    let bookFound: BookDocument;
    try {
      bookFound = await this.bookModel.findById(id).exec();
    } catch (error) {
      throw new NotFoundException(`Could not find the book with id = ${id}`);
    }
    return bookFound;
  }
}
