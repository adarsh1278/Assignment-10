import { z } from 'zod';
import { parseDateString } from '../utils/date.utils';

const dateStringSchema = z.string().refine(
  (val) => parseDateString(val) !== null,
  { message: 'Invalid date. Must be a real calendar date in YYYY-MM-DD format' }
);

export const createDayStatusSchema = z.object({
  date: dateStringSchema,
  status: z.string().min(1, 'Status is required').max(255, 'Status must be at most 255 characters').trim(),
});

export const updateDayStatusSchema = z.object({
  status: z.string().min(1, 'Status is required').max(255, 'Status must be at most 255 characters').trim(),
});

export const yearQuerySchema = z.object({
  year: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : new Date().getFullYear()))
    .refine((val) => Number.isInteger(val) && val >= 1900 && val <= 2100, {
      message: 'Year must be between 1900 and 2100',
    }),
});

export type CreateDayStatusInput = z.infer<typeof createDayStatusSchema>;
export type UpdateDayStatusInput = z.infer<typeof updateDayStatusSchema>;
