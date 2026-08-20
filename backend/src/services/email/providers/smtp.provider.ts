import nodemailer, { Transporter } from 'nodemailer';
import { EmailProvider, SendEmailOptions } from '../email.types';

export interface SmtpConfig {
  host: string;
  port: number;
  secure?: boolean;
  user?: string;
  password?: string;
  from: string;
}

export class SmtpEmailProvider implements EmailProvider {
  public name = 'smtp';
  private transporter: Transporter;
  private defaultFrom: string;

  constructor(config: SmtpConfig) {
    this.defaultFrom = config.from;
    this.transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure || config.port === 465,
      auth: config.user ? {
        user: config.user,
        pass: config.password,
      } : undefined,
    });
  }

  public async sendEmail(options: SendEmailOptions): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const info = await this.transporter.sendMail({
        from: options.from || this.defaultFrom,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
      });

      console.log(`[EMAIL SMTP SUCCESS] Message sent: ${info.messageId} to ${options.to}`);
      return { success: true, messageId: info.messageId };
    } catch (err) {
      const errMsg = (err as Error).message || 'Unknown SMTP error';
      console.error(`[EMAIL SMTP ERROR] Failed to send email to ${options.to}:`, errMsg);
      return { success: false, error: errMsg };
    }
  }
}
