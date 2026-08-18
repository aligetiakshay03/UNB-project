import { apiRequest } from './apiClient';

export interface ContactEnquiryPayload {
  name: string;
  email: string;
  phone?: string;
  enquiryType: string;
  message: string;
}

export const contactService = {
  /**
   * Submit contact form enquiry
   */
  async submitEnquiry(payload: ContactEnquiryPayload): Promise<{ message: string; id?: string }> {
    return apiRequest<{ message: string; id?: string }>('contact', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};
