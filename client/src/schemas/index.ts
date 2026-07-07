import { z } from 'zod';
import { LEAD_STATUSES, LEAD_SOURCES, LEAD_PRIORITIES } from '../constants';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  remember: z.boolean().optional(),
});

export const leadSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z
    .string()
    .min(10, 'Please enter a valid phone number')
    .regex(/^[+\d\s()-]+$/, 'Invalid phone number format'),
  company: z.string().min(1, 'Company is required'),
  source: z.enum(LEAD_SOURCES as unknown as [string, ...string[]]),
  status: z.enum(LEAD_STATUSES as unknown as [string, ...string[]]),
  priority: z.enum(LEAD_PRIORITIES as unknown as [string, ...string[]]),
  followUpDate: z.string().optional().nullable(),
});

export const noteSchema = z.object({
  text: z.string().min(1, 'Note cannot be empty').max(2000, 'Note is too long'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type LeadFormData = z.infer<typeof leadSchema>;
export type NoteFormData = z.infer<typeof noteSchema>;
