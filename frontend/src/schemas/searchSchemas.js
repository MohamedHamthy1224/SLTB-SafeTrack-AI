import { z } from 'zod';

export const searchSchema = z.object({
  query: z
    .string()
    .trim()
    .min(1, 'Search query cannot be empty.')
    .max(100, 'Search query cannot exceed 100 characters.')
});
