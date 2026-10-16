import { describe, it, expect } from 'vitest';
import { projectSchema, costEstimateInputSchema, taskSchema } from '@/lib/validations';

describe('Zod Form Validation Schemas', () => {
  it('should accept valid project data', () => {
    const valid = {
      name: 'Skyline Heights',
      project_type: 'residential',
      location: 'Hyderabad',
      built_up_area: 5000,
      floors: 4,
      budget: 12000000,
      start_date: '2026-03-01',
      expected_completion_date: '2026-12-31',
      finish_level: 'Premium',
      description: 'RCC residential frame',
      status: 'In Progress',
    };

    const result = projectSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it('should reject invalid project with completion date before start date', () => {
    const invalidDates = {
      name: 'Skyline Heights',
      project_type: 'residential',
      location: 'Hyderabad',
      built_up_area: 5000,
      floors: 4,
      budget: 12000000,
      start_date: '2026-05-01',
      expected_completion_date: '2026-03-01', // Invalid: Before start
      finish_level: 'Standard',
      status: 'Planning',
    };

    const result = projectSchema.safeParse(invalidDates);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].message).toContain('Expected completion date must be on or after start date');
    }
  });

  it('should reject non-positive built-up area and zero floors', () => {
    const invalidMetrics = {
      name: 'Alpha Tower',
      project_type: 'commercial',
      location: 'Delhi',
      built_up_area: -50, // Invalid
      floors: 0, // Invalid: min 1
      budget: 5000000,
      start_date: '2026-01-01',
      expected_completion_date: '2026-08-01',
      finish_level: 'Standard',
      status: 'Planning',
    };

    const result = projectSchema.safeParse(invalidMetrics);
    expect(result.success).toBe(false);
  });

  it('should validate task creation schema', () => {
    const validTask = {
      title: 'Excavation of Column Footings',
      phase: 'Sub-structure',
      duration_days: 10,
      start_date: '2026-02-01',
      due_date: '2026-02-11',
      status: 'In Progress',
      priority: 'Urgent',
      progress_percentage: 40,
    };

    const res = taskSchema.safeParse(validTask);
    expect(res.success).toBe(true);
  });
});
