import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  SecurityDevices,
  SecurityDevicesModelType,
} from '../domain/security-devices.entity';

@Injectable()
export class SecurityDevicesRepository {
  constructor(
    @InjectModel(SecurityDevices.name)
    private readonly SecurityDevicesModel: SecurityDevicesModelType,
  ) {}

  async findById(deviceId: string) {
    return this.SecurityDevicesModel.findOne({ deviceId: deviceId });
  }

  async create(deviceSession: SecurityDevices) {
    const result = await this.SecurityDevicesModel.create(deviceSession);
    return { id: result._id.toString() };
  }
}
