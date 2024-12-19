import { INestApplication } from '@nestjs/common';
import { globalPrefixSetup } from './global-prefix.setup';
import { CoreConfig } from '../core/core.config';
import { pipesSetup } from './pipes.setup';
import { validationConstraintSetup } from './validation-constraint.setup';
import { exceptionFilterSetup } from './exception-filter.setup';
import { enableCorsSetup } from './enable-cors.setup';

export async function appSetup(app: INestApplication, coreConfig: CoreConfig) {
  globalPrefixSetup(app);
  pipesSetup(app);
  exceptionFilterSetup(app);
  await validationConstraintSetup(app, coreConfig);
  enableCorsSetup(app);
}
