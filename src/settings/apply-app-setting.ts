import { INestApplication, ValidationPipe } from '@nestjs/common';

const APP_PREFIX = '/';

export const applyAppSetting = (app: INestApplication) => {
  setAppPrefix(app);
  setAppPipes(app);
};

const setAppPrefix = (app: INestApplication) => {
  app.setGlobalPrefix(APP_PREFIX);
};

const setAppPipes = (app: INestApplication) => {
  app.useGlobalPipes(new ValidationPipe());
};
