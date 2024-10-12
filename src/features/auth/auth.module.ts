import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { BasicStrategy } from '../../common/strategies/basic.strategy';
import { BasicAuthGuard } from '../../common/guards/basic-auth.guard';

@Module({
  imports: [PassportModule],
  controllers: [],
  providers: [BasicAuthGuard, BasicStrategy],
})
export class AuthModule {}
