import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { configValidationUtility } from '../setup/config-validation.utility';

export enum Environments {
  DEVELOPMENT = 'development',
  TESTING = 'testing',
  STAGING = 'staging',
  PRODUCTION = 'production',
}

@Injectable()
export class CoreConfig {
  @IsNumber({}, { message: 'Set Env variable PORT, example: 3000' })
  port: number = Number(this.configService.get('PORT'));
  @IsNotEmpty({
    message:
      'Set Env variable MONGO_URI, example: mongodb://localhost:27017/my-app-local-db',
  })
  mongoURI: string = this.configService.get('MONGO_URI');

  @IsString({
    message: 'Set Env variable ADMIN_LOGIN, dangerous for security!',
  })
  ADMIN_LOGIN: string = this.configService.get('ADMIN_LOGIN');

  @IsString({
    message: 'Set Env variable ADMIN_PASSWORD, dangerous for security!',
  })
  ADMIN_PASSWORD: string = this.configService.get('ADMIN_PASSWORD');

  @IsString({
    message: 'Set Env variable MAIL_SERVICE',
  })
  MAIL_SERVICE: string = this.configService.get('MAIL_SERVICE');
  @IsString({
    message: 'Set Env variable MAIL_USER, dangerous for security!',
  })
  MAIL_USER: string = this.configService.get('MAIL_USER');
  @IsString({
    message: 'Set Env variable MAIL_PASS, dangerous for security!',
  })
  MAIL_PASS: string = this.configService.get('MAIL_PASS');

  @IsEnum(Environments, {
    message:
      'Ser correct NODE_ENV value, available values: ' +
      configValidationUtility.getEnumValues(Environments).join(', '),
  })
  env: string = this.configService.get('NODE_ENV');

  @IsBoolean({
    message:
      'Set Env variable INCLUDE_TESTING_MODULE to enable/disable, available values: true, false, 1, 0, dangerous for security!',
  })
  includeTestingModule: boolean = configValidationUtility.convertToBoolean(
    this.configService.get('INCLUDE_TESTING_MODULE'),
  ) as boolean;

  @IsBoolean({
    message:
      'Set Env variable IS_SWAGGER_ENABLED to enable/disable, available values: true, false, 1, 0, dangerous for security!',
  })
  isSwaggerEnabled = configValidationUtility.convertToBoolean(
    this.configService.get('IS_SWAGGER_ENABLED'),
  ) as boolean;

  constructor(private configService: ConfigService<any, true>) {
    configValidationUtility.validateConfig(this);
  }
}
