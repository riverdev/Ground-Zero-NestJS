//book.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
//import * as mongoose from 'mongoose';

import { Document } from 'mongoose';

//* In the following type expression we use a typescript "Intersction-Type".
// Intersection types are closely related to union types, but they are used very differently.
// An intersection type combines multiple types into one.
// This allows you to add together existing types to get a single type that has all the features you need.

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
