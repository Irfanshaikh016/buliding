'use client';

import { CostEstimate, MaterialRecommendation, Project, ProjectTask, ProgressUpdate, UserProfile } from './types';
import { DEMO_USER, INITIAL_ESTIMATES, INITIAL_PROJECTS, INITIAL_TASKS, INITIAL_PROGRESS_UPDATES } from './demo-data';
import { COMPREHENSIVE_MATERIALS_DATABASE } from './materials-data';
import { createClient, isSupabaseConfigured } from './supabase/client';

const STORAGE_KEYS = {
  PROJECTS: 'buildsmart_projects',
  TASKS: 'buildsmart_tasks',
  ESTIMATES: 'buildsmart_estimates',
  PROGRESS: 'buildsmart_progress',
  MATERIALS: 'buildsmart_materials',
  USER: 'buildsmart_user',
};

// Initialize local storage with demo data if empty
export function initLocalStore() {
  if (typeof window === 'undefined') return;

  if (!localStorage.getItem(STORAGE_KEYS.PROJECTS)) {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(INITIAL_PROJECTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.TASKS)) {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(INITIAL_TASKS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ESTIMATES)) {
    localStorage.setItem(STORAGE_KEYS.ESTIMATES, JSON.stringify(INITIAL_ESTIMATES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.PROGRESS)) {
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(INITIAL_PROGRESS_UPDATES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.MATERIALS)) {
    localStorage.setItem(STORAGE_KEYS.MATERIALS, JSON.stringify(COMPREHENSIVE_MATERIALS_DATABASE));
  }
  if (!localStorage.getItem(STORAGE_KEYS.USER)) {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(DEMO_USER));
  }
}

// -------------------------------------------------------------
// PROJECTS REPOSITORY
// -------------------------------------------------------------
export async function getProjects(): Promise<Project[]> {
  const supabase = createClient();
  if (supabase && isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) return data as Project[];
    } catch {
      // Fallback to local storage if network or DB table not set up
    }
  }

  if (typeof window === 'undefined') return INITIAL_PROJECTS;
  initLocalStore();
  const raw = localStorage.getItem(STORAGE_KEYS.PROJECTS);
  return raw ? JSON.parse(raw) : INITIAL_PROJECTS;
}

export async function getProjectById(id: string): Promise<Project | null> {
  const projects = await getProjects();
  return projects.find(p => p.id === id) || null;
}

export async function saveProject(project: Omit<Project, 'id' | 'created_at'> & { id?: string }): Promise<Project> {
  const supabase = createClient();
  const newId = project.id || `proj_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const timestamp = new Date().toISOString();

  const fullProject: Project = {
    ...project,
    id: newId,
    user_id: project.user_id || DEMO_USER.id,
    created_at: timestamp,
    updated_at: timestamp,
  };

  if (supabase && isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase.from('projects').upsert([fullProject]).select().single();
      if (!error && data) return data as Project;
    } catch {
      // Continue to local storage sync
    }
  }

  if (typeof window !== 'undefined') {
    initLocalStore();
    const existing = await getProjects();
    const index = existing.findIndex(p => p.id === newId);
    let updated: Project[];
    if (index >= 0) {
      updated = [...existing];
      updated[index] = { ...updated[index], ...fullProject, updated_at: timestamp };
    } else {
      updated = [fullProject, ...existing];
    }
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(updated));
  }

  return fullProject;
}

export async function deleteProject(id: string): Promise<boolean> {
  const supabase = createClient();
  if (supabase && isSupabaseConfigured()) {
    try {
      await supabase.from('projects').delete().eq('id', id);
    } catch {
      // Local sync
    }
  }

  if (typeof window !== 'undefined') {
    initLocalStore();
    const existing = await getProjects();
    const filtered = existing.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(filtered));

    // Also remove associated tasks and estimates
    const allTasks = await getTasks();
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(allTasks.filter(t => t.project_id !== id)));
  }

  return true;
}

// -------------------------------------------------------------
// TASKS REPOSITORY
// -------------------------------------------------------------
export async function getTasks(projectId?: string): Promise<ProjectTask[]> {
  const supabase = createClient();
  if (supabase && isSupabaseConfigured()) {
    try {
      let query = supabase.from('project_tasks').select('*').order('sort_order', { ascending: true });
      if (projectId) query = query.eq('project_id', projectId);
      const { data, error } = await query;
      if (!error && data && data.length > 0) return data as ProjectTask[];
    } catch {
      // Fallback
    }
  }

  if (typeof window === 'undefined') {
    return projectId ? INITIAL_TASKS.filter(t => t.project_id === projectId) : INITIAL_TASKS;
  }
  initLocalStore();
  const raw = localStorage.getItem(STORAGE_KEYS.TASKS);
  const tasks: ProjectTask[] = raw ? JSON.parse(raw) : INITIAL_TASKS;
  return projectId ? tasks.filter(t => t.project_id === projectId) : tasks;
}

export async function saveTask(task: Omit<ProjectTask, 'id'> & { id?: string }): Promise<ProjectTask> {
  const id = task.id || `tsk_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const fullTask: ProjectTask = {
    ...task,
    id,
    created_at: task.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const supabase = createClient();
  if (supabase && isSupabaseConfigured()) {
    try {
      await supabase.from('project_tasks').upsert([fullTask]);
    } catch {
      // Fallback
    }
  }

  if (typeof window !== 'undefined') {
    initLocalStore();
    const existing = await getTasks();
    const index = existing.findIndex(t => t.id === id);
    let updated: ProjectTask[];
    if (index >= 0) {
      updated = [...existing];
      updated[index] = fullTask;
    } else {
      updated = [...existing, fullTask];
    }
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(updated));
  }

  return fullTask;
}

export async function saveMultipleTasks(tasks: Omit<ProjectTask, 'id'>[]): Promise<ProjectTask[]> {
  const created: ProjectTask[] = [];
  for (const t of tasks) {
    const res = await saveTask(t);
    created.push(res);
  }
  return created;
}

export async function deleteTask(id: string): Promise<boolean> {
  const supabase = createClient();
  if (supabase && isSupabaseConfigured()) {
    try {
      await supabase.from('project_tasks').delete().eq('id', id);
    } catch {
      // Local sync
    }
  }

  if (typeof window !== 'undefined') {
    initLocalStore();
    const existing = await getTasks();
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(existing.filter(t => t.id !== id)));
  }

  return true;
}

// -------------------------------------------------------------
// ESTIMATES REPOSITORY
// -------------------------------------------------------------
export async function getEstimates(projectId?: string): Promise<CostEstimate[]> {
  const supabase = createClient();
  if (supabase && isSupabaseConfigured()) {
    try {
      let q = supabase.from('cost_estimates').select('*').order('created_at', { ascending: false });
      if (projectId) q = q.eq('project_id', projectId);
      const { data, error } = await q;
      if (!error && data && data.length > 0) return data as CostEstimate[];
    } catch {
      // Fallback
    }
  }

  if (typeof window === 'undefined') return INITIAL_ESTIMATES;
  initLocalStore();
  const raw = localStorage.getItem(STORAGE_KEYS.ESTIMATES);
  const estimates: CostEstimate[] = raw ? JSON.parse(raw) : INITIAL_ESTIMATES;
  return projectId ? estimates.filter(e => e.project_id === projectId) : estimates;
}

export async function saveEstimate(estimate: CostEstimate): Promise<CostEstimate> {
  const supabase = createClient();
  if (supabase && isSupabaseConfigured()) {
    try {
      await supabase.from('cost_estimates').upsert([estimate]);
    } catch {
      // Fallback
    }
  }

  if (typeof window !== 'undefined') {
    initLocalStore();
    const existing = await getEstimates();
    const index = existing.findIndex(e => e.id === estimate.id);
    let updated: CostEstimate[];
    if (index >= 0) {
      updated = [...existing];
      updated[index] = estimate;
    } else {
      updated = [estimate, ...existing];
    }
    localStorage.setItem(STORAGE_KEYS.ESTIMATES, JSON.stringify(updated));
  }

  return estimate;
}

// -------------------------------------------------------------
// PROGRESS UPDATES REPOSITORY
// -------------------------------------------------------------
export async function getProgressUpdates(projectId?: string): Promise<ProgressUpdate[]> {
  if (typeof window === 'undefined') return INITIAL_PROGRESS_UPDATES;
  initLocalStore();
  const raw = localStorage.getItem(STORAGE_KEYS.PROGRESS);
  const updates: ProgressUpdate[] = raw ? JSON.parse(raw) : INITIAL_PROGRESS_UPDATES;
  return projectId ? updates.filter(u => u.project_id === projectId) : updates;
}

export async function saveProgressUpdate(update: Omit<ProgressUpdate, 'id'> & { id?: string }): Promise<ProgressUpdate> {
  const id = update.id || `upd_${Date.now()}`;
  const full: ProgressUpdate = {
    ...update,
    id,
    created_at: new Date().toISOString(),
  };

  if (typeof window !== 'undefined') {
    initLocalStore();
    const existing = await getProgressUpdates();
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify([full, ...existing]));
  }
  return full;
}

// -------------------------------------------------------------
// CALCULATION HELPER: Calculate real project progress from tasks
// -------------------------------------------------------------
export function calculateProjectProgressFromTasks(tasks: ProjectTask[]): number {
  if (!tasks || tasks.length === 0) return 0;
  const total = tasks.reduce((acc, t) => acc + (t.progress_percentage || (t.status === 'Completed' ? 100 : t.status === 'In Progress' ? 50 : 0)), 0);
  return Math.round(total / tasks.length);
}
