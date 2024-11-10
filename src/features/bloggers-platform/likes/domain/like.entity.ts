import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';

export enum LikeStatus {
  None = 'None',
  Like = 'Like',
  Dislike = 'Dislike',
}

@Schema()
export class Like {
  @Prop({ type: Date, required: true, default: new Date() })
  createdAt: Date;

  @Prop({
    type: String,
    enum: LikeStatus,
    default: LikeStatus.None,
    required: true,
  })
  status: string;

  @Prop({ type: String, required: true })
  authorId: string;

  @Prop({ type: String, required: true })
  parentId: string;
}

export const LikeSchema = SchemaFactory.createForClass(Like);
export type LikeDocument = HydratedDocument<Like>;
export type LikeModelType = Model<LikeDocument>;
