import { type HydratedDocument } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
  toJSON: { versionKey: false },
  toObject: { versionKey: false },
})
export class User {
  @Prop({ required: true, unique: true })
  email!: string;

  @Prop({ required: true })
  firstname!: string;

  @Prop({ required: true })
  lastname!: string;

  @Prop({ required: false })
  bio?: string;

  @Prop({ required: false })
  avatarUrl?: string;

  @Prop({ required: true })
  passwordHash!: string;
}

export const PUBLIC_USER_FIELDS: (keyof UserDocument)[] = [
  '_id',
  'email',
  'firstname',
  'lastname',
  'bio',
  'avatarUrl',
];

export const SOCIAL_USER_FIELDS: (keyof UserDocument)[] = [
  '_id',
  'firstname',
  'lastname',
  'avatarUrl',
];

export const UserSchema = SchemaFactory.createForClass(User);

export type UserDocument = HydratedDocument<User>;
export type PublicUserData = Omit<UserDocument, 'passwordHash'>;
