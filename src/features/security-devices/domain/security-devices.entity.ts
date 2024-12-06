import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';

@Schema()
export class SecurityDevices {
  @Prop({ type: String, required: true })
  userId: string;

  @Prop({ type: String, required: true })
  deviceId: string;

  @Prop({ type: String, required: true })
  ip: string;

  @Prop({ type: String, required: true })
  deviceName: string;

  @Prop({ type: String, required: true })
  iatDate: string;

  @Prop({ type: String, required: true })
  expDate: string;
}

export const SecurityDevicesSchema =
  SchemaFactory.createForClass(SecurityDevices);
export type SecurityDevicesDocument = HydratedDocument<SecurityDevices>;
export type SecurityDevicesModelType = Model<SecurityDevicesDocument>;
