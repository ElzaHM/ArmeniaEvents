import { z } from 'zod';

export const eventCreateSchema = z.object({
  title: z.string().trim().min(2),
  description: z.string().trim().optional().nullable(),
  image_url: z.string().trim().optional().nullable(),
  venue: z.string().trim().optional().nullable(),
  address: z.string().trim().optional().nullable(),
  start_date: z.iso.datetime(),
  end_date: z.iso.datetime().optional().nullable(),
  ticket_url: z.string().url().optional().nullable(),
  category_id: z.string().uuid().optional().nullable(),
  organizer_id: z.string().uuid().optional().nullable(),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  views: z.number().int().default(0),
  source: z.string().optional(),
  external_id: z.string().optional(),
});

export const eventUpdateSchema = eventCreateSchema.partial();

export type EventCreateInput = z.infer<typeof eventCreateSchema>;
export type EventUpdateInput = z.infer<typeof eventUpdateSchema>;
