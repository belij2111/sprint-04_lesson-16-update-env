import {
  BadRequestException,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';

export function pipesSetup(app: INestApplication) {
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
}
