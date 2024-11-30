import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';

@Schema({ _id: false })
export class SecurityDevices {
  @Prop({ type: String, required: true })
  userId: string;

  @Prop({ type: String, required: true })
  deviceId: string;

  @Prop({ type: String, required: true })
  ip: string;

  @Prop({ type: String, required: true })
  deviceName: string;

  @Prop({ type: Date, required: true })
  iatDate: Date;

  @Prop({ type: Date, required: true })
  expDate: Date;
}

export const SecurityDevicesSchema =
  SchemaFactory.createForClass(SecurityDevices);
export type SecurityDevicesDocument = HydratedDocument<SecurityDevices>;
export type SecurityDevicesModelType = Model<SecurityDevicesDocument>;
