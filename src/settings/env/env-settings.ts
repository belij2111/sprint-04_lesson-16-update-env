import { EnvironmentVariable } from './configuration';
import { IsEnum } from 'class-validator';

export enum Environments {
  DEVELOPMENT = 'DEVELOPMENT',
  TESTING = 'TESTING',
  STAGING = 'STAGING',
  PRODUCTION = 'PRODUCTION',
}

export class EnvironmentSettings {
  constructor(private environmentVariables: EnvironmentVariable) {}
  @IsEnum(Environments)
  private ENV = this.environmentVariables.ENV;

  get isDevelopment() {
    return this.environmentVariables.ENV === Environments.DEVELOPMENT;
  }
  get isTesting() {
    return this.environmentVariables.ENV === Environments.TESTING;
  }
  get isStaging() {
    return this.environmentVariables.ENV === Environments.STAGING;
  }
  get isProduction() {
    return this.environmentVariables.ENV === Environments.PRODUCTION;
  }
  get currentEnv() {
    return this.ENV;
  }
}
