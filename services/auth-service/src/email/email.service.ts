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
    console.log('Verification URL:', verifyUrl);

    await this.transporter.sendMail({
      from: this.configService.get('SMTP_FROM'),
      to,
      subject: 'Xác thực email của bạn',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Xác thực email</title>
          </head>
          <body style="font-family: Arial, sans-serif; padding: 20px;">
            <h3>Xin chào!</h3>
            <p>Vui lòng click vào nút dưới đây để xác thực email của bạn:</p>
            <div style="margin: 20px 0;">
              <a
                href="${verifyUrl}"
                style="
                  background-color: #4CAF50;
                  color: white;
                  padding: 12px 25px;
                  text-decoration: none;
                  border-radius: 4px;
                  display: inline-block;
                "
              >
                Xác thực email
              </a>
            </div>
            <p>Hoặc bạn có thể copy và paste đường link sau vào trình duyệt:</p>
            <p style="color: #666;">${verifyUrl}</p>
          </body>
        </html>
      `,
    });
  }
}
