import { z } from 'zod';

export const preambleRowSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  particulars: z.string().min(1, 'Particulars is required'),
  status: z.enum(['Active', 'Inactive']),
});

export const preambleSchema = z.object({
  heading: z.string().min(1, 'Heading is required'),
  paragraph: z.string().min(1, 'Paragraph is required'),
  subtitle: z.string().min(1, 'Subtitle is required'),
  tableRows: z
    .array(preambleRowSchema)
    .min(1, 'At least one table row is required'),
});

export const addTableRowSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  particulars: z.string().min(1, 'Particulars is required'),
  status: z.enum(['Active', 'Inactive']).default('Active'), // ← ADD THIS
});

export const updateTableRowSchema = z.object({
  id: z.string().min(1, 'Row ID is required'),
  title: z.string().min(1, 'Title is required'),
  particulars: z.string().min(1, 'Particulars is required'),
  status: z.enum(['Active', 'Inactive']), // ← ADD THIS
});

export type PreambleRow = z.infer<typeof preambleRowSchema>;
export type Preamble = z.infer<typeof preambleSchema>;
export type AddTableRow = z.infer<typeof addTableRowSchema>;
export type UpdateTableRow = z.infer<typeof updateTableRowSchema>;
