import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import mongoose from 'mongoose';
import { appSettings } from '../../../../settings/config';

@Schema({ collection: appSettings.getCollectionNames().BLOGS })
export class Blog {
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  _id: mongoose.Types.ObjectId;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: String, required: true })
  websiteUrl: string;

  @Prop({ type: Date, default: new Date() })
  createdAt: Date;

  @Prop({ type: Boolean, required: true })
  isMembership: boolean;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
export type BlogDocument = HydratedDocument<Blog>;
export type BlogModelType = Model<BlogDocument>;
