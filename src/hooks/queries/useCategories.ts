import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

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

type CategoryCreatePayload = Parameters<typeof categoriesService.createCategory>[0];
type CategoryUpdatePayload = Parameters<typeof categoriesService.updateCategory>[1];

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CategoryCreatePayload) => categoriesService.createCategory(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: categoriesKeys.all });
      void queryClient.invalidateQueries({ queryKey: categoriesKeys.footer });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: CategoryUpdatePayload }) =>
      categoriesService.updateCategory(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: categoriesKeys.all });
      void queryClient.invalidateQueries({ queryKey: categoriesKeys.footer });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => categoriesService.deleteCategory(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: categoriesKeys.all });
      void queryClient.invalidateQueries({ queryKey: categoriesKeys.footer });
    },
  });
}
