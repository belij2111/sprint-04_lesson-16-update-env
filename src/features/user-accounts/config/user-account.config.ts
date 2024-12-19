import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IsNumber, IsString } from 'class-validator';
import { configValidationUtility } from '../../../setup/config-validation.utility';

@Injectable()
export class UserAccountConfig {
  @IsString()
  ACCESS_TOKEN_SECRET: string = this.configService.get('ACCESS_TOKEN_SECRET');
  @IsString()
  ACCESS_TOKEN_EXPIRATION: string = this.configService.get(
    'ACCESS_TOKEN_EXPIRATION',
  );
  @IsString()
  REFRESH_TOKEN_SECRET: string = this.configService.get('REFRESH_TOKEN_SECRET');
  @IsString()
  REFRESH_TOKEN_EXPIRATION: string = this.configService.get(
    'REFRESH_TOKEN_EXPIRATION',
  );
  @IsNumber()
  CONFIRMATION_CODE_EXPIRATION: number = Number(
    this.configService.get('CONFIRMATION_CODE_EXPIRATION'),
  );

  constructor(private configService: ConfigService<any, true>) {
    configValidationUtility.validateConfig(this);
  }
}
