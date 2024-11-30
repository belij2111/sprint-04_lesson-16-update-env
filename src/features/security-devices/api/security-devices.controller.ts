import { Controller } from '@nestjs/common';
import { SecurityDevicesService } from '../application/security-devices.service';
import { SecurityDevicesQueryRepository } from '../infrastructure/security-devices.query-repository';

@Controller('/devices')
export class SecurityDevicesController {
  constructor(
    private readonly securityDevicesService: SecurityDevicesService,
    private readonly securityDevicesQueryRepository: SecurityDevicesQueryRepository,
  ) {}
}
