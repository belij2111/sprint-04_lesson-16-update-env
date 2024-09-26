import {
  BadRequestException,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
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
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      stopAtFirstError: true,
      exceptionFactory: (errors) => {
        const customErrors: { message: string; field: string }[] = [];
        errors.forEach((err) => {
          const constrainKeys = Object.keys(err.constraints || {});
          constrainKeys.forEach((cKey, index) => {
            if (index >= 1) return;
            const msg = err.constraints?.[cKey] as any;
            customErrors.push({
              message: msg,
              field: err.property,
            });
          });
        });
        throw new BadRequestException(customErrors);
      },
    }),
  );
};

const setAppExceptionsFilters = (app: INestApplication) => {
  app.useGlobalFilters(new HttpExceptionFilter());
};
