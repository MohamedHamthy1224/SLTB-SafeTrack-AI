import { z } from 'zod';

export const assignmentSchema = z.object({
  route_id: z.union([z.string(), z.number()]).refine(val => {
    const num = Number(val);
    return !isNaN(num) && num > 0;
  }, { message: 'Please select a route' }),
  driver_id: z.union([z.string(), z.number()]).refine(val => {
    const num = Number(val);
    return !isNaN(num) && num > 0;
  }, { message: 'Please select a driver' })
});
