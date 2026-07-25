import { z } from 'zod';

export const routeFormSchema = z.object({
  route_number: z
    .string()
    .trim()
    .min(1, 'Route number is required')
    .max(20, 'Route number cannot exceed 20 characters'),
  route_name: z
    .string()
    .trim()
    .min(1, 'Route name is required')
    .max(150, 'Route name cannot exceed 150 characters'),
  start_location: z
    .string()
    .trim()
    .min(1, 'Start location is required')
    .max(100, 'Start location cannot exceed 100 characters'),
  end_location: z
    .string()
    .trim()
    .min(1, 'End location is required')
    .max(100, 'End location cannot exceed 100 characters'),
  distance_km: z.union([z.string(), z.number()]).refine(
    (val) => {
      const num = Number(val);
      return !isNaN(num) && num > 0 && num <= 9999.99;
    },
    { message: 'Distance must be a positive number greater than 0' }
  ),
  estimated_duration: z.union([z.string(), z.number()]).refine(
    (val) => {
      const num = Number(val);
      return !isNaN(num) && Number.isInteger(num) && num > 0;
    },
    { message: 'Estimated duration must be a positive integer in minutes' }
  ),
  status: z.enum(['Active', 'Inactive'], {
    required_error: 'Status is required'
  })
}).refine(
  (data) => {
    if (!data.start_location || !data.end_location) return true;
    return data.start_location.trim().toLowerCase() !== data.end_location.trim().toLowerCase();
  },
  {
    message: 'Start location and end location cannot be identical',
    path: ['end_location']
  }
);
