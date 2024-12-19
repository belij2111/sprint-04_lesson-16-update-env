import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
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
  @IsString()
  ADMIN_LOGIN: string = this.configService.get('ADMIN_LOGIN');
  @IsString()
  ADMIN_PASSWORD: string = this.configService.get('ADMIN_PASSWORD');

  @IsString()
  MAIL_SERVICE: string = this.configService.get('MAIL_SERVICE');
  @IsString()
  MAIL_USER: string = this.configService.get('MAIL_USER');
  @IsString()
  MAIL_PASS: string = this.configService.get('MAIL_PASS');

  @IsEnum(Environments, {
    message:
      'Ser correct NODE_ENV value, available values: ' +
      configValidationUtility.getEnumValues(Environments).join(', '),
  })
  env: string = this.configService.get('NODE_ENV');

  includeTestingModule: boolean = configValidationUtility.convertToBoolean(
    this.configService.get('INCLUDE_TESTING_MODULE'),
  ) as boolean;

  constructor(private configService: ConfigService<any, true>) {
    configValidationUtility.validateConfig(this);
  }
}
