import { Test, TestingModuleBuilder } from '@nestjs/testing';
import { Connection } from 'mongoose';
import { getConnectionToken } from '@nestjs/mongoose';
import { appSetup } from '../../src/setup/app.setup';
import { CoreConfig } from '../../src/core/core.config';
import { initAppModule } from '../../src/init-app-module';

export const initSettings = async (
  service?: any,
  serviceMock?: any,
  addSettingsToModuleBuilder?: (moduleBuilder: TestingModuleBuilder) => void,
) => {
  const dynamicAppModule = await initAppModule();
  const testingModuleBuilder: TestingModuleBuilder = Test.createTestingModule({
    imports: [dynamicAppModule],
  })
    .overrideProvider(service)
    .useValue(serviceMock);

  if (addSettingsToModuleBuilder) {
    addSettingsToModuleBuilder(testingModuleBuilder);
  }

  const testingAppModule = await testingModuleBuilder.compile();
  const app = testingAppModule.createNestApplication();
  const coreConfig = app.get<CoreConfig>(CoreConfig);
  await appSetup(app, coreConfig);
  await app.init();

  const databaseConnection = app.get<Connection>(getConnectionToken());
  const httpServer = app.getHttpServer();

  return {
    app,
    databaseConnection,
    httpServer,
  };
};
