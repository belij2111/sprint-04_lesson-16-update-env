import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { EmailTemplateService } from './email-template.service';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly emailTemplateService: EmailTemplateService,
  ) {}
  async sendEmail(email: string, code: string) {
    const htmlContent = this.emailTemplateService.registrationEmail(code);
    await this.mailerService.sendMail({
      to: email,
      subject: 'Your code is here',
      html: htmlContent,
    });
  }
}
