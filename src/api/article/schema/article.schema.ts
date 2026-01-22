import { type HydratedDocument, Types } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
  toJSON: { versionKey: false },
  toObject: { versionKey: false },
})
export class Article {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ default: 0 })
  viewsCount: number;

  @Prop({ required: true, ref: 'User' })
  author: Types.ObjectId;

  @Prop({ nullable: true })
  imageUrl: string;

  @Prop({
    ref: 'Tag',
    default: [],
  })
  tags: Types.ObjectId[];
}

export const ArticleSchema = SchemaFactory.createForClass(Article);

export type ArticleDocument = HydratedDocument<Article>;
