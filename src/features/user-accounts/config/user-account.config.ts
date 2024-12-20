import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IsNumber, IsString } from 'class-validator';
import { configValidationUtility } from '../../../setup/config-validation.utility';

@Injectable()
export class UserAccountConfig {
  @IsString({
    message: 'Set Env variable ACCESS_TOKEN_SECRET, dangerous for security!',
  })
  ACCESS_TOKEN_SECRET: string = this.configService.get('ACCESS_TOKEN_SECRET');
  @IsString({
    message: 'Set Env variable ACCESS_TOKEN_EXPIRATION',
  })
  ACCESS_TOKEN_EXPIRATION: string = this.configService.get(
    'ACCESS_TOKEN_EXPIRATION',
  );
  @IsString({
    message: 'Set Env variable REFRESH_TOKEN_SECRET, dangerous for security!',
  })
  REFRESH_TOKEN_SECRET: string = this.configService.get('REFRESH_TOKEN_SECRET');
  @IsString({
    message: 'Set Env variable REFRESH_TOKEN_EXPIRATION',
  })
  REFRESH_TOKEN_EXPIRATION: string = this.configService.get(
    'REFRESH_TOKEN_EXPIRATION',
  );
  @IsNumber(
    {},
    {
      message:
        'Set Env variable CONFIRMATION_CODE_EXPIRATION, dangerous for security!',
    },
  )
  CONFIRMATION_CODE_EXPIRATION: number = Number(
    this.configService.get('CONFIRMATION_CODE_EXPIRATION'),
  );

  constructor(private configService: ConfigService<any, true>) {
    configValidationUtility.validateConfig(this);
  }
}
