import { z } from 'zod';

export const loginSchema = z.object({
  identifier: z
    .string()
    .trim()
    .min(1, 'Username or email address is required.')
    .max(100, 'Maximum 100 characters allowed.'),
  password: z
    .string()
    .min(1, 'Password is required.')
    .max(128, 'Maximum 128 characters allowed.'),
  rememberMe: z.boolean().optional()
});

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email address is required.')
    .email('Please enter a valid email address.')
    .max(100, 'Maximum 100 characters allowed.')
});

export const resetPasswordSchema = z.object({
  new_password: z
    .string()
    .min(8, 'Password must be at least 8 characters long.')
    .max(128, 'Password cannot exceed 128 characters.')
    .regex(/\d/, 'Password must contain at least one number.')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character.'),
  confirm_password: z
    .string()
    .min(1, 'Password confirmation is required.')
}).refine((data) => data.new_password === data.confirm_password, {
  message: 'Passwords do not match.',
  path: ['confirm_password']
});
