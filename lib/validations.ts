import { z } from 'zod';

export const projectSchema = z.object({
  name: z.string().min(3, 'Project name must be at least 3 characters').max(100, 'Project name too long'),
  project_type: z.enum(['residential', 'commercial', 'industrial', 'infrastructure'], {
    errorMap: () => ({ message: 'Please select a valid project type' }),
  }),
  location: z.string().min(2, 'Location is required'),
  built_up_area: z.coerce.number().positive('Area must be greater than 0 sq.ft').max(10000000, 'Area exceeds limit'),
  floors: z.coerce.number().int().min(1, 'Minimum 1 floor').max(100, 'Floor count exceeds limit'),
  budget: z.coerce.number().min(10000, 'Minimum budget is ₹10,000'),
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be a valid date in YYYY-MM-DD format'),
  expected_completion_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be a valid date in YYYY-MM-DD format'),
  finish_level: z.enum(['Economy', 'Standard', 'Premium', 'Luxury']),
  description: z.string().max(1000, 'Description max 1000 characters').optional().default(''),
  status: z.enum(['Planning', 'In Progress', 'Completed', 'On Hold']).default('Planning'),
}).refine(
  (data) => new Date(data.expected_completion_date) >= new Date(data.start_date),
  {
    message: 'Expected completion date must be on or after start date',
    path: ['expected_completion_date'],
  }
);

export type ProjectFormData = z.infer<typeof projectSchema>;

export const costEstimateInputSchema = z.object({
  project_type: z.enum(['residential', 'commercial', 'industrial', 'infrastructure']),
  location: z.string().min(2, 'Location is required'),
  built_up_area: z.coerce.number().positive('Built-up area must be positive'),
  floors: z.coerce.number().int().min(1, 'Floors must be at least 1'),
  finish_level: z.enum(['Economy', 'Standard', 'Premium', 'Luxury']),
  budget: z.coerce.number().nonnegative().optional(),
  custom_rate_per_sqft: z.coerce.number().positive('Rate must be positive').optional(),
});

export type CostEstimateInput = z.infer<typeof costEstimateInputSchema>;

export const taskSchema = z.object({
  title: z.string().min(2, 'Task title required').max(150),
  phase: z.string().min(2, 'Phase is required'),
  description: z.string().max(500).optional().default(''),
  duration_days: z.coerce.number().int().min(1, 'Duration must be at least 1 day'),
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid start date format'),
  due_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid due date format'),
  status: z.enum(['Pending', 'In Progress', 'Completed']).default('Pending'),
  priority: z.enum(['Low', 'Medium', 'High', 'Urgent']).default('Medium'),
  progress_percentage: z.coerce.number().int().min(0).max(100).default(0),
  notes: z.string().max(500).optional().default(''),
  is_milestone: z.boolean().default(false),
});

export type TaskFormData = z.infer<typeof taskSchema>;

export const materialQuerySchema = z.object({
  project_type: z.string().min(2),
  location: z.string().min(2),
  budget_level: z.enum(['Economy', 'Standard', 'Premium', 'Luxury']),
  durability_priority: z.enum(['Standard', 'High Durability', 'Maximum Longevity']),
  climate_type: z.enum(['Tropical / Coastal', 'Moderate', 'Hot & Arid', 'Cold / Hilly']),
});

export type MaterialQueryInput = z.infer<typeof materialQuerySchema>;
