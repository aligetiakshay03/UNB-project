export interface ContactEnquiryEmailData {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  enquiryType: string;
  message: string;
  createdAt: Date | string;
}

export interface JobApplicationEmailData {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  coverMessage?: string | null;
  hasCv: boolean;
  cvFileName?: string | null;
  jobTitle: string;
  jobSlug: string;
  createdAt: Date | string;
}

export interface SendEmailOptions {
  to: string;
  from?: string;
  subject: string;
  text: string;
  html: string;
}

export interface EmailProvider {
  name: string;
  sendEmail(options: SendEmailOptions): Promise<{ success: boolean; messageId?: string; error?: string }>;
}
