import { z } from 'zod';

export const addDriverSchema = z.object({
  full_name: z
    .string()
    .min(1, 'Full Name is required')
    .max(100, 'Full Name cannot exceed 100 characters'),
  nic: z
    .string()
    .max(20, 'NIC Number cannot exceed 20 characters')
    .optional()
    .or(z.literal('')),
  date_of_birth: z
    .string()
    .optional()
    .or(z.literal('')),
  gender: z
    .enum(['Male', 'Female', ''], { invalid_type_error: 'Gender must be Male or Female' })
    .optional()
    .or(z.literal('')),
  address: z
    .string()
    .max(500, 'Address cannot exceed 500 characters')
    .optional()
    .or(z.literal('')),
  phone: z
    .string()
    .max(20, 'Phone Number cannot exceed 20 characters')
    .optional()
    .or(z.literal('')),
  alternative_phone_number: z
    .string()
    .max(20, 'Alternative Phone Number cannot exceed 20 characters')
    .optional()
    .or(z.literal('')),
  email_address: z
    .string()
    .email('Invalid email address format')
    .max(100, 'Email address cannot exceed 100 characters')
    .optional()
    .or(z.literal('')),
  license_number: z
    .string()
    .min(1, 'Driving License Number is required')
    .max(50, 'License Number cannot exceed 50 characters'),
  issue_date: z
    .string()
    .optional()
    .or(z.literal('')),
  expiry_date: z
    .string()
    .optional()
    .or(z.literal('')),
  join_date: z
    .string()
    .optional()
    .or(z.literal('')),
  experience_years: z
    .coerce
    .number({ invalid_type_error: 'Experience years must be a number' })
    .min(0, 'Experience years cannot be negative')
    .default(0),
  status: z
    .enum(['Active', 'Inactive'])
    .default('Active')
}).refine(data => {
  if (data.phone && data.alternative_phone_number && data.phone === data.alternative_phone_number) {
    return false;
  }
  return true;
}, {
  message: 'Alternative phone number cannot equal primary phone number',
  path: ['alternative_phone_number']
}).refine(data => {
  if (data.issue_date && data.expiry_date) {
    return new Date(data.expiry_date) > new Date(data.issue_date);
  }
  return true;
}, {
  message: 'Expiry date must be after issue date',
  path: ['expiry_date']
});

export const editDriverSchema = addDriverSchema.extend({
  bus_id: z
    .string()
    .optional()
    .or(z.literal('')),
  route_id: z
    .string()
    .optional()
    .or(z.literal(''))
}).refine(data => {
  if ((data.bus_id && !data.route_id) || (!data.bus_id && data.route_id)) {
    return false;
  }
  return true;
}, {
  message: 'Both Bus and Route must be selected together, or both left empty',
  path: ['route_id']
});
