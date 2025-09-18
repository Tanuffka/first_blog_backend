import { type HydratedDocument } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true, id: true })
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  firstname: string;

  @Prop({ required: true })
  lastname: string;

  @Prop({ required: false })
  bio?: string;

  @Prop({ required: false })
  avatarUrl?: string;

  @Prop({ required: true })
  passwordHash: string;
}

export const PUBLIC_USER_FIELDS: (keyof UserDocument)[] = [
  'id',
  'email',
  'firstname',
  'lastname',
  'bio',
  'avatarUrl',
];

export const UserSchema = SchemaFactory.createForClass(User);

export type UserDocument = HydratedDocument<User>;
export type PublicUserData = Omit<UserDocument, 'passwordHash'>;
