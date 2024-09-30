import { ApiSettings } from './api-settings';
import { DatabaseSettings } from './database-settings';
import process from 'process';
import { EnvironmentSettings } from './env-settings';
import { ValidateNested, validateSync } from 'class-validator';

export type EnvironmentVariable = { [key: string]: string };
export type ConfigurationType = Configuration;
export type ApiSettingsType = ConfigurationType['apiSettings'];
export type DatabaseSettingsType = ConfigurationType['databaseSettings'];
export type EnvironmentSettingsType = ConfigurationType['environmentSettings'];

export class Configuration {
  @ValidateNested()
  apiSettings: ApiSettings;
  @ValidateNested()
  databaseSettings: DatabaseSettings;
  @ValidateNested()
  environmentSettings: EnvironmentSettings;

  private constructor(configuration: Configuration) {
    Object.assign(this, configuration);
  }
  static createConfig(
    environmentVariables: Record<string, string>,
  ): Configuration {
    return new this({
      apiSettings: new ApiSettings(environmentVariables),
      databaseSettings: new DatabaseSettings(environmentVariables),
      environmentSettings: new EnvironmentSettings(environmentVariables),
    });
  }
}

export function validate(environmentVariables: Record<string, string>) {
  const config = Configuration.createConfig(environmentVariables);
  const errors = validateSync(config, { skipMissingProperties: false });
  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return config;
}

export default () => {
  const environmentVariables = process.env as EnvironmentVariable;
  return Configuration.createConfig(environmentVariables);
};
