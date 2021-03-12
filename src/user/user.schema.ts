import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export interface IUser {
  firstName: string;
  lastName: string;
  _createdAt: Date;
  _updatedAt: Date;
}

@Schema({
  timestamps: {
    createdAt: '_createdAt',
    updatedAt: '_updatedAt',
  },
})
export class User extends Document implements IUser {
  _createdAt: Date;
  _updatedAt: Date;

  @Prop({ type: String, required: true })
  firstName: string;

  @Prop({ type: String, required: true })
  lastName: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
