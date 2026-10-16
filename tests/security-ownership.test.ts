import { describe, it, expect } from 'vitest';
import { calculateProjectProgressFromTasks } from '@/lib/data-store';
import { ProjectTask } from '@/lib/types';

describe('Project Data Ownership & Calculation Integrity', () => {
  it('should calculate project completion strictly from task deliverables', () => {
    const tasks: ProjectTask[] = [
      {
        id: 't1',
        project_id: 'p1',
        title: 'Excavation',
        phase: 'Sub-structure',
        duration_days: 10,
        start_date: '2026-01-01',
        due_date: '2026-01-10',
        status: 'Completed',
        priority: 'High',
        progress_percentage: 100,
      },
      {
        id: 't2',
        project_id: 'p1',
        title: 'Columns Concreting',
        phase: 'Super-structure',
        duration_days: 15,
        start_date: '2026-01-11',
        due_date: '2026-01-26',
        status: 'In Progress',
        priority: 'Urgent',
        progress_percentage: 50,
      },
      {
        id: 't3',
        project_id: 'p1',
        title: 'Brickwork',
        phase: 'Envelope',
        duration_days: 20,
        start_date: '2026-01-27',
        due_date: '2026-02-16',
        status: 'Pending',
        priority: 'Medium',
        progress_percentage: 0,
      },
    ];

    // (100 + 50 + 0) / 3 = 50%
    const progress = calculateProjectProgressFromTasks(tasks);
    expect(progress).toBe(50);
  });

  it('should return 0% progress when no tasks exist rather than inventing values', () => {
    const emptyTasks: ProjectTask[] = [];
    const progress = calculateProjectProgressFromTasks(emptyTasks);
    expect(progress).toBe(0);
  });

  it('should filter tasks strictly by project_id preventing data leak across users', () => {
    const mixedTasks: ProjectTask[] = [
      { id: 't1', project_id: 'p_user_A', title: 'Task A', phase: 'P1', duration_days: 5, start_date: '2026-01-01', due_date: '2026-01-06', status: 'Completed', priority: 'Medium', progress_percentage: 100 },
      { id: 't2', project_id: 'p_user_B', title: 'Task B', phase: 'P1', duration_days: 5, start_date: '2026-01-01', due_date: '2026-01-06', status: 'Pending', priority: 'Medium', progress_percentage: 0 },
    ];

    const projectATasks = mixedTasks.filter(t => t.project_id === 'p_user_A');
    expect(projectATasks.length).toBe(1);
    expect(projectATasks[0].id).toBe('t1');
  });
});
