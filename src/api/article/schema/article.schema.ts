import { type HydratedDocument, Types } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { User } from 'src/api/user/schema/user.schema';

@Schema({ timestamps: true, id: true })
export class Article {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ default: [] })
  tags: string[];

  @Prop({ default: 0 })
  viewsCount: number;

  @Prop({ required: true, ref: User.name })
  author: Types.ObjectId;

  @Prop({ nullable: true })
  imageUrl: string;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);

export type ArticleDocument = HydratedDocument<Article>;
