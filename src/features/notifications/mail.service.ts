import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { EmailTemplateService } from './email-template.service';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly emailTemplateService: EmailTemplateService,
  ) {}
  sendEmail(
    email: string,
    code: string,
    templateType: 'registration' | 'passwordRecovery',
  ) {
    let htmlContent;
    if (templateType === 'registration') {
      htmlContent = this.emailTemplateService.registrationEmail(code);
    }
    if (templateType === 'passwordRecovery') {
      htmlContent = this.emailTemplateService.passwordRecoveryEmail(code);
    }
    this.mailerService.sendMail({
      to: email,
      subject: 'Your code is here',
      html: htmlContent,
    });
  }
}
