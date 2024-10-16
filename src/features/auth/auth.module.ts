import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { BasicStrategy } from '../../common/strategies/basic.strategy';
import { UsersModule } from '../users/users.module';
import { AuthController } from './api/auth.controller';
import { AuthService } from './application/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from '../../common/strategies/local.strategy';
import { BcryptService } from '../../base/bcrypt.service';

@Module({
  imports: [
    PassportModule,
    UsersModule,
    JwtModule.register({
      secret: '123456789',
      signOptions: { expiresIn: '100m' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, BasicStrategy, LocalStrategy, BcryptService],
})
export class AuthModule {}
