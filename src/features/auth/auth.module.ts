import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { BasicStrategy } from '../../core/strategies/basic.strategy';
import { UsersModule } from '../users/users.module';
import { AuthController } from './api/auth.controller';
import { AuthService } from './application/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from '../../core/strategies/local.strategy';
import { ConfigService } from '@nestjs/config';
import { ConfigurationType } from '../../settings/env/configuration';
import { JwtStrategy } from '../../core/strategies/jwt.strategy';
import { UuidProvider } from '../../core/helpers/uuid.provider';
import { CryptoModule } from '../../core/crypto/crypto.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailTemplateService } from '../../core/mail/email-template.service';
import { MailService } from '../../core/mail/mail.service';
import { SecurityDevicesModule } from '../security-devices/security-devices.module';

@Module({
  imports: [
    PassportModule,
    UsersModule,
    CryptoModule,
    SecurityDevicesModule,
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
    MailerModule.forRootAsync({
      useFactory: (configService: ConfigService<ConfigurationType, true>) => {
        const apiSettings = configService.get('apiSettings', {
          infer: true,
        });
        return {
          transport: {
            service: apiSettings.MAIL_SERVICE,
            auth: {
              user: apiSettings.MAIL_USER,
              pass: apiSettings.MAIL_PASS,
            },
            tls: {
              rejectUnauthorized: false,
            },
          },
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
    MailService,
    EmailTemplateService,
  ],
})
export class AuthModule {}
