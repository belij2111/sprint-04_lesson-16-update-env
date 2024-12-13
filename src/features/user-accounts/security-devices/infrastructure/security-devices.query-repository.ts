import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  SecurityDevices,
  SecurityDevicesModelType,
} from '../domain/security-devices.entity';
import { SecurityDevicesViewModel } from '../api/models/view/security-devices.view.model';

@Injectable()
export class SecurityDevicesQueryRepository {
  constructor(
    @InjectModel(SecurityDevices.name)
    private readonly SecurityDevicesModel: SecurityDevicesModelType,
  ) {}

  async getAll(currentUser: string): Promise<SecurityDevicesViewModel[]> {
    const devices = await this.findByUserId(currentUser);
    return devices.map(SecurityDevicesViewModel.mapToView);
  }

  async findByUserId(userId: string) {
    return this.SecurityDevicesModel.find({ userId });
  }
}
