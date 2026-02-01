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

  @Prop({
    ref: 'Tag',
    default: [],
  })
  tags: Types.ObjectId[];

  @Prop({ nullable: true, type: Object })
  coverCroppedImage: {
    fileKey: string;
    fileDownloadUrl: string;
  } | null;

  @Prop({ nullable: true, type: Object })
  coverImage: {
    fileKey: string;
    fileDownloadUrl: string;
    cropOptions: {
      x: number;
      y: number;
      width: number;
      height: number;
      zoom: number;
    };
  } | null;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);

export type ArticleDocument = HydratedDocument<Article>;
