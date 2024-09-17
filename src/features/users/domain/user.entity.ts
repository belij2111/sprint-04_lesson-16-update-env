import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model, ObjectId } from 'mongoose';
import { appSettings } from '../../../settings/config';
import * as mongoose from 'mongoose';

@Schema({ collection: appSettings.getCollectionNames().USERS })
export class User {
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  _id: ObjectId;

  @Prop({ type: String, required: true })
  login: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: String, required: true })
  email: string;

  @Prop({ type: Date, default: new Date() })
  createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
export type UserDocument = HydratedDocument<User>;
export type UserModelType = Model<UserDocument>;
