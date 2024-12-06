import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  SecurityDevices,
  SecurityDevicesSchema,
} from './domain/security-devices.entity';
import { SecurityDevicesController } from './api/security-devices.controller';
import { SecurityDevicesService } from './application/security-devices.service';
import { SecurityDevicesRepository } from './infrastructure/security-devices.repository';
import { SecurityDevicesQueryRepository } from './infrastructure/security-devices.query-repository';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SecurityDevices.name, schema: SecurityDevicesSchema },
    ]),
  ],
  controllers: [SecurityDevicesController],
  providers: [
    SecurityDevicesService,
    SecurityDevicesRepository,
    SecurityDevicesQueryRepository,
    JwtService,
  ],
  exports: [SecurityDevicesRepository],
})
export class SecurityDevicesModule {}
