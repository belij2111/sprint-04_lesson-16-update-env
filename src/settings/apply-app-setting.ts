import { INestApplication, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from '../common/exeption-filters/http-exeption-filter';

const APP_PREFIX = '/';

export const applyAppSetting = (app: INestApplication) => {
  setAppPrefix(app);
  setAppPipes(app);
  setAppExceptionsFilters(app);
};

const setAppPrefix = (app: INestApplication) => {
  app.setGlobalPrefix(APP_PREFIX);
};

const setAppPipes = (app: INestApplication) => {
  app.useGlobalPipes(new ValidationPipe());
};

const setAppExceptionsFilters = (app: INestApplication) => {
  app.useGlobalFilters(new HttpExceptionFilter());
};
