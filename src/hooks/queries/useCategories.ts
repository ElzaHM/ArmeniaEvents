import { useQuery } from '@tanstack/react-query';

import { categoriesService } from '../../services/categories.service';

export const categoriesKeys = {
  all: ['categories'] as const,
  footer: ['categories', 'footer'] as const,
};

export function useCategories() {
  return useQuery({
    queryKey: categoriesKeys.all,
    queryFn: () => categoriesService.getCategories(),
  });
}

export function useFooterCategories() {
  return useQuery({
    queryKey: categoriesKeys.footer,
    queryFn: () => categoriesService.getFooterCategories(),
  });
}
