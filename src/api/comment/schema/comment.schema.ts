import { type HydratedDocument, Types } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { User } from 'src/api/user/schema/user.schema';
import { Article } from 'src/api/article/schema/article.schema';

@Schema({
  timestamps: true,
  id: true,
  toJSON: { versionKey: false },
  toObject: { versionKey: false },
})
export class Comment {
  @Prop({ required: true })
  content: string;

  @Prop({ default: false })
  isEdited: boolean;

  @Prop({ required: true, ref: Article.name })
  article: Types.ObjectId;

  @Prop({ required: true, ref: User.name })
  author: Types.ObjectId;

  @Prop({ ref: Comment.name })
  responseTo: Types.ObjectId;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

export type CommentDocument = HydratedDocument<Comment>;
