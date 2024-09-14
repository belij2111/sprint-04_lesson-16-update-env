import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { applyAppSetting } from './settings/apply-app-setting';
import { appSettings } from './settings/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  applyAppSetting(app);

  await app.listen(appSettings.getPort(), () => {
    console.log('App starting listen port: ', appSettings.getPort());
  });
}
bootstrap();
