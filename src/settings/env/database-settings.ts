import { EnvironmentVariable } from './configuration';
import { IsString } from 'class-validator';

export class DatabaseSettings {
  constructor(private environmentVariables: EnvironmentVariable) {}
  @IsString()
  MONGO_URL: string = this.environmentVariables.MONGO_URL;

  @IsString()
  MONGO_URL_FOR_TESTS: string = this.environmentVariables.MONGO_URL_FOR_TESTS;
}
