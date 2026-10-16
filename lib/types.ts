export type ProjectType = 'residential' | 'commercial' | 'industrial' | 'infrastructure';

export type FinishLevel = 'Economy' | 'Standard' | 'Premium' | 'Luxury';

export type ProjectStatus = 'Planning' | 'In Progress' | 'Completed' | 'On Hold';

export type TaskStatus = 'Pending' | 'In Progress' | 'Completed';

export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  company_name?: string;
  role: string;
  avatar_url?: string;
  phone?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Project {
  id: string;
  user_id: string;
  name: string;
  project_type: ProjectType;
  location: string;
  built_up_area: number; // in sq.ft
  floors: number;
  budget: number; // in INR
  start_date: string; // YYYY-MM-DD
  expected_completion_date: string; // YYYY-MM-DD
  finish_level: FinishLevel;
  description?: string;
  status: ProjectStatus;
  created_at: string;
  updated_at?: string;
}

export interface CostBreakdownItem {
  category: string;
  name: string;
  percentage: number;
  ratePerSqFt: number;
  amount: number;
  description: string;
  units: string;
}

export interface CostEstimate {
  id: string;
  project_id?: string;
  user_id?: string;
  project_type: ProjectType;
  location: string;
  built_up_area: number;
  floors: number;
  finish_level: FinishLevel;
  base_rate: number; // INR per sqft
  estimated_total: number;
  breakdown: CostBreakdownItem[];
  assumptions: {
    locationFactor: number;
    floorFactor: number;
    finishMultiplier: number;
    rateSource: 'user_provided' | 'configured_benchmark' | 'market_indexed';
    contingencyPercent: number;
    notes: string[];
  };
  created_at: string;
}

export interface MaterialRecommendation {
  id: string;
  project_id?: string;
  user_id?: string;
  category: string;
  material_type: string;
  reasons: string;
  advantages: string[];
  disadvantages: string[];
  budget_suitability: 'Economy' | 'Moderate' | 'Premium' | 'All Budgets';
  important_considerations: string;
  supplier_notes?: string;
  standard_spec?: string; // e.g. IS 456, IS 1786
  created_at?: string;
}

export interface ProjectTask {
  id: string;
  project_id: string;
  user_id?: string;
  title: string;
  phase: string;
  description?: string;
  duration_days: number;
  start_date: string;
  due_date: string;
  status: TaskStatus;
  priority: TaskPriority;
  progress_percentage: number;
  notes?: string;
  is_milestone?: boolean;
  sort_order?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ProgressUpdate {
  id: string;
  project_id: string;
  user_id?: string;
  title: string;
  notes?: string;
  completion_percentage: number;
  logged_date: string;
  created_at?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  created_at: string;
  project_id?: string;
}

export interface SchedulePhase {
  name: string;
  description: string;
  durationDays: number;
  startDate: string;
  endDate: string;
  dependencies: string[];
  tasks: {
    title: string;
    durationDays: number;
    startDayOffset: number;
    priority: TaskPriority;
  }[];
}
