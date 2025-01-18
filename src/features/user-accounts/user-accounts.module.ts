import { UserAccountConfig } from './config/user-account.config';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './users/domain/user.entity';
import {
  SecurityDevices,
  SecurityDevicesSchema,
} from './security-devices/domain/security-devices.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AuthController } from './auth/api/auth.controller';
import { AuthService } from './auth/application/auth.service';
import { BasicStrategy } from '../../core/strategies/basic.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from '../../core/strategies/jwt.strategy';
import { UuidProvider } from '../../core/helpers/uuid.provider';
import { APP_GUARD } from '@nestjs/core';
import { UsersController } from './users/api/users.controller';
import { SecurityDevicesController } from './security-devices/api/security-devices.controller';
import { UsersService } from './users/application/users.service';
import { UsersRepository } from './users/infrastructure/users.repository';
import { UsersQueryRepository } from './users/infrastructure/users.query-repository';
import { SecurityDevicesService } from './security-devices/application/security-devices.service';
import { SecurityDevicesRepository } from './security-devices/infrastructure/security-devices.repository';
import { SecurityDevicesQueryRepository } from './security-devices/infrastructure/security-devices.query-repository';
import { CryptoService } from './crypto/crypto.service';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([
      { name: SecurityDevices.name, schema: SecurityDevicesSchema },
    ]),
    PassportModule,
    NotificationsModule,
    ThrottlerModule.forRoot([
      {
        ttl: 60,
        limit: 20,
      },
    ]),
  ],
  controllers: [UsersController, AuthController, SecurityDevicesController],
  providers: [
    UserAccountConfig,
    UsersService,
    UsersRepository,
    UsersQueryRepository,
    UuidProvider,
    AuthService,
    BasicStrategy,
    LocalStrategy,
    JwtStrategy,
    SecurityDevicesService,
    SecurityDevicesRepository,
    SecurityDevicesQueryRepository,
    JwtService,
    CryptoService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
  exports: [UsersRepository, SecurityDevicesRepository],
})
export class UserAccountsModule {}
