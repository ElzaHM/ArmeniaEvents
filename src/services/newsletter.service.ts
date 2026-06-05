import axios from 'axios';

export type NewsletterSubscribeResponse = {
  success: true;
};

const api = axios.create({
  baseURL: '/api',
});

function toNewsletterError(error: unknown): Error {
  if (axios.isAxiosError(error)) {
    const message =
      (error.response?.data as { message?: string } | undefined)?.message ??
      error.message ??
      'Subscription failed. Please try again.';
    return new Error(message);
  }

  if (error instanceof Error) {
    return error;
  }

  return new Error('Unexpected error');
}

export const newsletterService = {
  async subscribe(email: string): Promise<NewsletterSubscribeResponse> {
    try {
      const { data } = await api.post<NewsletterSubscribeResponse>('/newsletter/subscribe', {
        email: email.trim().toLowerCase(),
      });
      return data;
    } catch (error) {
      throw toNewsletterError(error);
    }
  },
};
