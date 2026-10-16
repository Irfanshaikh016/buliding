import { describe, it, expect } from 'vitest';
import { generateConstructionSchedule } from '@/lib/schedule-engine';

describe('Construction Schedule & Critical Path Engine', () => {
  it('should generate all critical construction phases sequentially', () => {
    const res = generateConstructionSchedule({
      projectId: 'proj_test_01',
      startDate: '2026-01-01',
      builtUpArea: 4000,
      floors: 3,
    });

    expect(res.phases.length).toBe(7);
    expect(res.totalWorkingDays).toBeGreaterThan(100);
    expect(res.tasks.length).toBeGreaterThanOrEqual(15);

    // Verify critical civil phases exist in proper order
    expect(res.phases[0].name).toContain('Pre-Construction');
    expect(res.phases[1].name).toContain('Mobilisation & Earthwork');
    expect(res.phases[2].name).toContain('Structural RCC Frame');
    expect(res.phases[6].name).toContain('Handover');

    // End date must follow start date
    expect(new Date(res.projectEndDate).getTime()).toBeGreaterThan(new Date(res.projectStartDate).getTime());
  });

  it('should scale duration with fast_track speed multiplier', () => {
    const standard = generateConstructionSchedule({
      projectId: 'proj_std',
      startDate: '2026-01-01',
      builtUpArea: 3000,
      floors: 2,
      speedPriority: 'standard',
    });

    const fastTrack = generateConstructionSchedule({
      projectId: 'proj_fast',
      startDate: '2026-01-01',
      builtUpArea: 3000,
      floors: 2,
      speedPriority: 'fast_track',
    });

    expect(fastTrack.totalWorkingDays).toBeLessThan(standard.totalWorkingDays);
  });
});
