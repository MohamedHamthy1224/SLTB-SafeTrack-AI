import { z } from 'zod';

export const passwordSchema = z
  .object({
    current_password: z.string().min(1, 'Current password is required.'),
    new_password: z
      .string()
      .min(8, 'New password must be at least 8 characters long.')
      .max(128, 'New password cannot exceed 128 characters.')
      .regex(/[A-Z]/, 'New password must contain at least one uppercase letter.')
      .regex(/[a-z]/, 'New password must contain at least one lowercase letter.')
      .regex(/[0-9]/, 'New password must contain at least one number.')
      .regex(
        /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/,
        'New password must contain at least one special character.'
      ),
    confirm_password: z.string().min(1, 'Please confirm your new password.')
  })
  .refine((data) => data.new_password !== data.current_password, {
    message: 'New password must differ from current password.',
    path: ['new_password']
  })
  .refine((data) => data.confirm_password === data.new_password, {
    message: 'New password and confirm password do not match.',
    path: ['confirm_password']
  });
