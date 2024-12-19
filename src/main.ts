import { CoreConfig } from './core/core.config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { initAppModule } from './init-app-module';

import { appSetup } from './setup/app.setup';

async function bootstrap() {
  const dynamicAppModule = await initAppModule();
  const app = await NestFactory.create(dynamicAppModule);
  app.use(cookieParser());

  const coreConfig = app.get<CoreConfig>(CoreConfig);

  const config = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('cats')
    .addBasicAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/', app, document);

  await appSetup(app, coreConfig);

  const port = coreConfig.port;

  await app.listen(port, () => {
    console.log('App starting listen port:', port);
    console.log('NODE_ENV:', coreConfig.env);
  });
}
bootstrap();
