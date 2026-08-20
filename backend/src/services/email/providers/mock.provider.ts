import { EmailProvider, SendEmailOptions } from '../email.types';

export class MockEmailProvider implements EmailProvider {
  public name = 'mock';

  public async sendEmail(options: SendEmailOptions): Promise<{ success: boolean; messageId?: string }> {
    const messageId = `mock-${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    
    // Log safe operational information without leaking sensitive credentials
    console.log(`[EMAIL MOCK DISPATCH] Message ID: ${messageId}`);
    console.log(`  To: ${options.to}`);
    console.log(`  Subject: ${options.subject}`);
    console.log(`  Preview: ${options.text.substring(0, 120)}...`);

    return { success: true, messageId };
  }
}
