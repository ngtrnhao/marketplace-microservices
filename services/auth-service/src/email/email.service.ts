import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('SMTP_HOST'),
      port: this.configService.get('SMTP_PORT'),
      auth: {
        user: this.configService.get('SMTP_USER'),
        pass: this.configService.get('SMTP_PASS'),
      },
    });
  }

  async sendVerificationEmail(to: string, token: string) {
    const verifyUrl = `${this.configService.get('APP_URL')}/auth/verify-email?token=${token}`;

    await this.transporter.sendMail({
      to,
      subject: 'Xác thực email của bạn',
      html: `
        <h3>Xin chào!</h3>
        <p>Vui lòng click vào link dưới đây để xác thực email của bạn:</p>
        <a href="${verifyUrl}">Xác thực email</a>
      `,
    });
  }
}
