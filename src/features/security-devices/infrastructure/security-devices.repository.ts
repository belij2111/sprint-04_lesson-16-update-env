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

  async update(deviceId: string, iatDate: string): Promise<boolean> {
    const result = await this.SecurityDevicesModel.updateOne(
      { deviceId: deviceId },
      { $set: { iatDate: iatDate } },
    );
    return result.modifiedCount !== 0;
  }

  async delete(currentUserId: string, currentDeviceId: string) {
    await this.SecurityDevicesModel.deleteMany({
      currentUserId,
      deviceId: { $ne: currentDeviceId },
    });
    return true;
  }

  async deleteById(deviceId: string) {
    const deletionResult = await this.SecurityDevicesModel.deleteOne({
      deviceId,
    });
    return deletionResult.deletedCount === 1;
  }
}
