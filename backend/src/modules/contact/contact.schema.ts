import { z } from 'zod';

export const contactMessageSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  email: z.string().trim().toLowerCase().email('Valid email is required'),
  message: z.string().trim().min(1, 'Message is required'),
});

export type ContactMessageInput = z.infer<typeof contactMessageSchema>;
