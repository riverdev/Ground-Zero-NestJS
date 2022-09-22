import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
//import * as mongoose from 'mongoose';

import { Document } from 'mongoose';

export type BookDocument = Book & Document;

@Schema()
export class Book {
  @Prop()
  title: string;

  @Prop()
  desc: string;

  @Prop()
  price: number;
}

export const BookSchema = SchemaFactory.createForClass(Book);
