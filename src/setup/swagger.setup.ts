import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { GLOBAL_PREFIX } from './global-prefix.setup';
import { CoreConfig } from 'src/core/core.config';

export function swaggerSetup(app: INestApplication, coreConfig: CoreConfig) {
  if (coreConfig.isSwaggerEnabled) {
    const config = new DocumentBuilder()
      .setTitle('BLOGGER API')
      .addBearerAuth()
      .setVersion('1.0')
      .addBearerAuth()
      .addBasicAuth(
        {
          type: 'http',
          scheme: 'basic',
        },
        'basicAuth',
      )
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(GLOBAL_PREFIX, app, document, {
      customSiteTitle: 'Blogger Swagger',
    });
  }
}
