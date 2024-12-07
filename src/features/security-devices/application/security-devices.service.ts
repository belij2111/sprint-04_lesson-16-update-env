import { Injectable } from '@nestjs/common';
import { SecurityDevicesRepository } from '../infrastructure/security-devices.repository';

@Injectable()
export class SecurityDevicesService {
  constructor(
    private readonly securityDevicesRepository: SecurityDevicesRepository,
  ) {}

  async delete(
    currentUserId: string,
    currentDeviceId: string,
  ): Promise<boolean> {
    return this.securityDevicesRepository.delete(
      currentUserId,
      currentDeviceId,
    );
  }
}
