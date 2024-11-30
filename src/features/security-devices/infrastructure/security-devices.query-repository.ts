import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  SecurityDevices,
  SecurityDevicesModelType,
} from '../domain/security-devices.entity';

@Injectable()
export class SecurityDevicesQueryRepository {
  constructor(
    @InjectModel(SecurityDevices.name)
    private readonly SecurityDevicesModel: SecurityDevicesModelType,
  ) {}
}
