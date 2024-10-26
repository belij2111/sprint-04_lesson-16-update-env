import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { BasicStrategy } from '../../common/strategies/basic.strategy';
import { UsersModule } from '../users/users.module';
import { AuthController } from './api/auth.controller';
import { AuthService } from './application/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from '../../common/strategies/local.strategy';
import { ConfigService } from '@nestjs/config';
import { ConfigurationType } from '../../settings/env/configuration';
import { JwtStrategy } from '../../common/strategies/jwt.strategy';
import { UuidProvider } from '../../base/helpers/uuid.provider';
import { CryptoModule } from '../../base/crypto.module';

@Module({
  imports: [
    PassportModule,
    UsersModule,
    CryptoModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService<ConfigurationType, true>) => {
        const apiSettings = configService.get('apiSettings', {
          infer: true,
        });
        return {
          secret: apiSettings.ACCESS_TOKEN_SECRET,
          signOptions: { expiresIn: apiSettings.ACCESS_TOKEN_EXPIRATION },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    BasicStrategy,
    LocalStrategy,
    JwtStrategy,
    UuidProvider,
  ],
})
export class AuthModule {}
