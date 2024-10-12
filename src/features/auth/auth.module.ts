import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { BasicStrategy } from '../../common/strategies/basic.strategy';

@Module({
  imports: [PassportModule],
  controllers: [],
  providers: [BasicStrategy],
})
export class AuthModule {}
