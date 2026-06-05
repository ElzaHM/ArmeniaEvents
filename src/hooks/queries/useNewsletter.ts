import { useMutation } from '@tanstack/react-query';

import { newsletterService } from '../../services/newsletter.service';

export const newsletterKeys = {
  subscribe: ['newsletter', 'subscribe'] as const,
};

export function useSubscribeNewsletter() {
  return useMutation({
    mutationKey: newsletterKeys.subscribe,
    mutationFn: (email: string) => newsletterService.subscribe(email),
  });
}
