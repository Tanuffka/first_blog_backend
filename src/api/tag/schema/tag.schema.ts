import { Document, type HydratedDocument, Types } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
  toJSON: { versionKey: false },
  toObject: { versionKey: false },
})
export class Tag {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, ref: 'Article' })
  article: Types.ObjectId;
}

export const TagSchema = SchemaFactory.createForClass(Tag);

export type TagDocument = HydratedDocument<Tag>;
