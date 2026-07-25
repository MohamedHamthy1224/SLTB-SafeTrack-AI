import { z } from 'zod';

export const busFormSchema = z.object({
  bus_number: z.string().trim().min(1, 'Bus number is required').max(30, 'Bus number cannot exceed 30 characters'),
  registration_number: z.string().trim().min(1, 'Registration number is required').max(20, 'Registration number cannot exceed 20 characters'),
  service_type: z.string().min(1, 'Service type is required'),
  model: z.string().trim().min(1, 'Bus model is required').max(100, 'Model cannot exceed 100 characters'),
  chassis_number: z.string().trim().min(1, 'Chassis number is required').max(50, 'Chassis number cannot exceed 50 characters'),
  engine_number: z.string().trim().min(1, 'Engine number is required').max(50, 'Engine number cannot exceed 50 characters'),
  manufacture_year: z.union([z.string(), z.number()]).refine(val => {
    const num = Number(val);
    const currentYear = new Date().getFullYear();
    return !isNaN(num) && num >= 1950 && num <= currentYear + 1;
  }, { message: 'Enter a valid manufacture year' }),
  capacity: z.union([z.string(), z.number()]).refine(val => {
    const num = Number(val);
    return !isNaN(num) && num > 0;
  }, { message: 'Seating capacity must be greater than 0' }),
  standing_capacity: z.union([z.string(), z.number()]).refine(val => {
    const num = Number(val);
    return !isNaN(num) && num >= 0;
  }, { message: 'Standing capacity must be 0 or greater' }),
  fuel_type: z.string().min(1, 'Fuel type is required'),
  status: z.enum(['Active', 'Maintenance', 'Inactive'], { required_error: 'Status is required' }),

  // Assignment fields
  route_id: z.union([z.string(), z.number()]).refine(val => {
    const num = Number(val);
    return !isNaN(num) && num > 0;
  }, { message: 'Please select a route' }),
  driver_id: z.union([z.string(), z.number()]).refine(val => {
    const num = Number(val);
    return !isNaN(num) && num > 0;
  }, { message: 'Please select a driver' })
});
