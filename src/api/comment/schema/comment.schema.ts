import { type HydratedDocument, Types } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

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

  @Prop({ required: true, ref: 'Article' })
  article: Types.ObjectId;

  @Prop({ required: true, ref: 'User' })
  author: Types.ObjectId;

  @Prop({ ref: Comment.name })
  responseTo: Types.ObjectId;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

export type CommentDocument = HydratedDocument<Comment>;
