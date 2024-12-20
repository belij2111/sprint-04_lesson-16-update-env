import { Module } from '@nestjs/common';
import { CoreConfig } from '../../core/core.config';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './mail.service';
import { EmailTemplateService } from './email-template.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: (coreConfig: CoreConfig) => {
        return {
          transport: {
            service: coreConfig.MAIL_SERVICE,
            auth: {
              user: coreConfig.MAIL_USER,
              pass: coreConfig.MAIL_PASS,
            },
            tls: {
              rejectUnauthorized: false,
            },
          },
        };
      },
      inject: [CoreConfig],
    }),
  ],
  providers: [MailService, EmailTemplateService],
  exports: [MailService],
})
export class NotificationsModule {}
