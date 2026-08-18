import { apiRequest } from './apiClient';

export interface JobApplicationPayload {
  name: string;
  email: string;
  phone?: string;
  coverMessage?: string;
  cv?: File;
}

export const applicationService = {
  /**
   * Submit job application with optional CV file
   */
  async submitApplication(jobId: string, payload: JobApplicationPayload): Promise<{ message: string; id?: string }> {
    const formData = new FormData();
    formData.append('name', payload.name);
    formData.append('email', payload.email);
    if (payload.phone) formData.append('phone', payload.phone);
    if (payload.coverMessage) formData.append('coverMessage', payload.coverMessage);
    if (payload.cv) formData.append('cv', payload.cv);

    return apiRequest<{ message: string; id?: string }>(`jobs/${jobId}/apply`, {
      method: 'POST',
      body: formData,
    });
  },
};
