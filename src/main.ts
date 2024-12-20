import { CoreConfig } from './core/core.config';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { initAppModule } from './init-app-module';

import { appSetup } from './setup/app.setup';

async function bootstrap() {
  const dynamicAppModule = await initAppModule();
  const app = await NestFactory.create(dynamicAppModule);
  app.use(cookieParser());

  const coreConfig = app.get<CoreConfig>(CoreConfig);

  await appSetup(app, coreConfig);

  const port = coreConfig.port;

  await app.listen(port, () => {
    console.log('App starting listen port:', port);
    console.log('NODE_ENV:', coreConfig.env);
  });
}
bootstrap();
