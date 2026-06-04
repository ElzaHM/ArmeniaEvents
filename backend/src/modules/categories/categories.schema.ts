import { z } from 'zod';

export const categoryCreateSchema = z.object({
  name: z.string().trim().min(2),
  slug: z.string().trim().min(2),
  description: z.string().trim().optional().nullable(),
  icon: z.string().trim().optional().nullable(),
  event_count: z.number().int().min(0).optional(),
  is_active: z.boolean().optional(),
});

export const categoryUpdateSchema = categoryCreateSchema.partial();

export type CategoryCreateInput = z.infer<typeof categoryCreateSchema>;
export type CategoryUpdateInput = z.infer<typeof categoryUpdateSchema>;
