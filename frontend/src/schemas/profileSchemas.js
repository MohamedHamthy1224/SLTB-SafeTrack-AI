import { z } from 'zod';

export const profileSchema = z.object({
  full_name: z
    .string()
    .trim()
    .min(1, 'Full name is required.')
    .max(100, 'Full name cannot exceed 100 characters.'),
  username: z.string().optional(),
  email_address: z
    .string()
    .trim()
    .min(1, 'Email address is required.')
    .email('Invalid email address format.')
    .max(100, 'Email address cannot exceed 100 characters.'),
  employee_id: z
    .string()
    .trim()
    .min(1, 'Employee ID is required.')
    .max(50, 'Employee ID cannot exceed 50 characters.'),
  phone: z
    .string()
    .trim()
    .max(20, 'Phone number cannot exceed 20 characters.')
    .optional()
    .or(z.literal('')),
  department: z
    .string()
    .trim()
    .max(100, 'Department cannot exceed 100 characters.')
    .optional()
    .or(z.literal('')),
  designation: z
    .string()
    .trim()
    .max(100, 'Designation cannot exceed 100 characters.')
    .optional()
    .or(z.literal('')),
  joined_date: z.string().optional().or(z.literal(''))
});
