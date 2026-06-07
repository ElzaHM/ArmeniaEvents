import { z } from 'zod';

export const registerSchema = z
  .object({
    fullName: z.string().trim().min(2, 'Full name must be at least 2 characters'),
    email: z.email('Invalid email format'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(128, 'Password is too long'),
    confirmPassword: z.string(),
  })
  .refine((payload) => payload.password === payload.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const loginSchema = z.object({
  email: z.email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export const forgotPasswordSchema = z.object({
  email: z.email('Invalid email format'),
});

export const resetPasswordSchema = z
  .object({
    accessToken: z.string().min(1, 'Reset token is required'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(128, 'Password is too long'),
    confirmPassword: z.string(),
  })
  .refine((payload) => payload.password === payload.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const googleLoginSchema = z.object({
  credential: z.string().min(1, 'Google credential is required'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type GoogleLoginInput = z.infer<typeof googleLoginSchema>;
