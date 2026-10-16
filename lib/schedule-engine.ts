import { ProjectTask, SchedulePhase, TaskPriority, TaskStatus } from './types';

export interface ScheduleGeneratorParams {
  projectId: string;
  startDate: string; // YYYY-MM-DD
  builtUpArea: number; // sq.ft
  floors: number;
  speedPriority?: 'standard' | 'fast_track' | 'relaxed';
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

/**
 * Deterministic construction schedule duration calculator
 * Based on built-up area and floor counts according to standard civil engineering work study benchmarks
 */
export function generateConstructionSchedule(params: ScheduleGeneratorParams): {
  phases: SchedulePhase[];
  tasks: Omit<ProjectTask, 'id' | 'created_at'>[];
  totalWorkingDays: number;
  projectStartDate: string;
  projectEndDate: string;
} {
  const { projectId, startDate, builtUpArea, floors, speedPriority = 'standard' } = params;

  // Scale factor based on area (baseline is 2,000 sq.ft)
  const areaRatio = Math.max(0.6, Math.min(3.5, Math.sqrt(builtUpArea / 2000)));
  
  // Speed multiplier
  const speedFactor = speedPriority === 'fast_track' ? 0.8 : speedPriority === 'relaxed' ? 1.25 : 1.0;

  // Base phase durations (in calendar days)
  const sitePrepDuration = Math.round(14 * speedFactor);
  const approvalsDuration = Math.round(30 * speedFactor);
  const foundationDuration = Math.round(25 * areaRatio * speedFactor);
  // Structure duration scales with floors: ~21 days per slab/floor
  const structureDuration = Math.round((20 * floors + 10) * areaRatio * speedFactor);
  const masonryDuration = Math.round((18 * floors) * areaRatio * speedFactor);
  const mepDuration = Math.round((22 * floors) * areaRatio * speedFactor);
  const finishesDuration = Math.round((35 * areaRatio) * speedFactor);
  const handoverDuration = Math.round(15 * speedFactor);

  let currentOffset = 0;

  interface RawPhase {
    name: string;
    description: string;
    duration: number;
    tasks: { title: string; durationPct: number; priority: TaskPriority; isMilestone?: boolean }[];
  }

  const rawPhases: RawPhase[] = [
    {
      name: 'Pre-Construction & Approvals',
      description: 'Site surveying, soil testing (SBC), architectural drawings, and municipal plan sanctions',
      duration: approvalsDuration,
      tasks: [
        { title: 'Topographical Survey & Soil Investigation (Borehole)', durationPct: 0.25, priority: 'High', isMilestone: false },
        { title: 'Architectural & Structural Drawings Finalisation', durationPct: 0.35, priority: 'Urgent', isMilestone: false },
        { title: 'Municipal Plan Sanction & NOC Approvals', durationPct: 0.40, priority: 'Urgent', isMilestone: true },
      ],
    },
    {
      name: 'Site Mobilisation & Earthwork',
      description: 'Temporary water/power connections, site fencing, clearing, and foundation excavation',
      duration: sitePrepDuration + foundationDuration,
      tasks: [
        { title: 'Site Clearing, Barricading & Temporary Utilities Set up', durationPct: 0.20, priority: 'Medium', isMilestone: false },
        { title: 'Bulk Excavation to Formation Level & Anti-Termite Treatment', durationPct: 0.35, priority: 'High', isMilestone: false },
        { title: 'PCC Bedding & Isolated/Raft Footings Concreting', durationPct: 0.45, priority: 'Urgent', isMilestone: true },
      ],
    },
    {
      name: 'Structural RCC Frame',
      description: `Columns, beams, and roof slabs casting up to ${floors} floor level(s)`,
      duration: structureDuration,
      tasks: [
        { title: 'Plinth Beam Shuttering, Rebar & Concreting', durationPct: 0.20, priority: 'High', isMilestone: false },
        { title: `Staging, Rebar Tying & Casting of Ground to ${floors}th Floor Slabs`, durationPct: 0.65, priority: 'Urgent', isMilestone: true },
        { title: 'Parapet Walls, Water Tank Slab & Deshuttering Curing Period', durationPct: 0.15, priority: 'High', isMilestone: false },
      ],
    },
    {
      name: 'Masonry & Envelope',
      description: 'Exterior perimeter walls, internal room partitions, and lintel band casting',
      duration: masonryDuration,
      tasks: [
        { title: 'AAC Blockwork / Brickwork with Polymer Mortar up to Lintel Level', durationPct: 0.55, priority: 'Medium', isMilestone: false },
        { title: 'Internal Sand-Face Plastering & External Waterproof Plaster', durationPct: 0.45, priority: 'High', isMilestone: true },
      ],
    },
    {
      name: 'MEP (Electrical & Plumbing) First-Fix',
      description: 'Concealed conduit chases, wiring pulls, drainage drop lines, and pressure testing',
      duration: mepDuration,
      tasks: [
        { title: 'Electrical Wall Chasing, Conduiting & Distribution Box Embedment', durationPct: 0.40, priority: 'High', isMilestone: false },
        { title: 'Plumbing Supply Line Concealment, SWR Down-takes & Hydro-testing', durationPct: 0.40, priority: 'High', isMilestone: false },
        { title: 'Submersible Pump, Main Panel & Earthing Inspection', durationPct: 0.20, priority: 'Medium', isMilestone: true },
      ],
    },
    {
      name: 'Finishing & Joinery',
      description: 'Waterproofing, floor tiling, door frame fixtures, wall putty, and painting',
      duration: finishesDuration,
      tasks: [
        { title: 'Bathroom & Balcony Polyurethane Waterproofing Pond Testing', durationPct: 0.20, priority: 'Urgent', isMilestone: true },
        { title: 'Vitrified Floor Tiling, Granite Sills & Wall Dado', durationPct: 0.40, priority: 'Medium', isMilestone: false },
        { title: 'Door Frames, Sliding Windows & 3-Coat Paint Application', durationPct: 0.40, priority: 'Medium', isMilestone: false },
      ],
    },
    {
      name: 'Testing, Inspection & Handover',
      description: 'Electrical load test, plumbing snag list clearance, final deep cleaning, and client sign-off',
      duration: handoverDuration,
      tasks: [
        { title: 'MEP Fixtures Fitting (Switches, Sanitaryware & Geysers)', durationPct: 0.45, priority: 'Medium', isMilestone: false },
        { title: 'Comprehensive Pre-Handover Snagging Inspection & Rectification', durationPct: 0.35, priority: 'High', isMilestone: false },
        { title: 'Key Handover, As-Built Drawings & Completion Certificate', durationPct: 0.20, priority: 'Urgent', isMilestone: true },
      ],
    },
  ];

  const phases: SchedulePhase[] = [];
  const tasks: Omit<ProjectTask, 'id' | 'created_at'>[] = [];

  let rollingDate = startDate;

  rawPhases.forEach((phase, pIdx) => {
    const phaseStart = rollingDate;
    const phaseEnd = addDays(phaseStart, Math.max(1, phase.duration - 1));
    const prevPhaseName = pIdx > 0 ? [rawPhases[pIdx - 1].name] : [];

    const computedPhaseTasks = phase.tasks.map((t, tIdx) => {
      const taskDays = Math.max(2, Math.round(phase.duration * t.durationPct));
      return {
        title: t.title,
        durationDays: taskDays,
        startDayOffset: Math.round(tIdx * (phase.duration / phase.tasks.length)),
        priority: t.priority,
      };
    });

    phases.push({
      name: phase.name,
      description: phase.description,
      durationDays: phase.duration,
      startDate: phaseStart,
      endDate: phaseEnd,
      dependencies: prevPhaseName,
      tasks: computedPhaseTasks,
    });

    // Generate individual task records
    let taskRollingDate = phaseStart;
    phase.tasks.forEach((t, tIdx) => {
      const taskDuration = Math.max(2, Math.round(phase.duration * t.durationPct));
      const taskEnd = addDays(taskRollingDate, Math.max(1, taskDuration - 1));

      tasks.push({
        project_id: projectId,
        title: t.title,
        phase: phase.name,
        description: `Construction activity under ${phase.name}. Preliminary automated timeline.`,
        duration_days: taskDuration,
        start_date: taskRollingDate,
        due_date: taskEnd,
        status: pIdx === 0 && tIdx === 0 ? 'In Progress' : 'Pending',
        priority: t.priority,
        progress_percentage: pIdx === 0 && tIdx === 0 ? 35 : 0,
        is_milestone: !!t.isMilestone,
        sort_order: tasks.length + 1,
      });

      // Stagger slightly inside the phase
      taskRollingDate = addDays(taskRollingDate, Math.round(taskDuration * 0.7));
    });

    // Advance rolling date for next phase
    rollingDate = addDays(phaseEnd, 1);
  });

  const totalWorkingDays = phases.reduce((acc, p) => acc + p.durationDays, 0);
  const projectEndDate = phases[phases.length - 1].endDate;

  return {
    phases,
    tasks,
    totalWorkingDays,
    projectStartDate: startDate,
    projectEndDate,
  };
}
