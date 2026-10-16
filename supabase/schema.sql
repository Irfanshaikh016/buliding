-- =============================================================================
-- BuildSmart AI — Supabase Database Schema & Row Level Security Policies
-- =============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    email TEXT,
    company_name TEXT,
    role TEXT DEFAULT 'Project Manager',
    avatar_url TEXT,
    phone TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    project_type TEXT NOT NULL CHECK (project_type IN ('residential', 'commercial', 'industrial', 'infrastructure')),
    location TEXT NOT NULL,
    built_up_area NUMERIC NOT NULL CHECK (built_up_area > 0),
    floors INTEGER NOT NULL DEFAULT 1 CHECK (floors > 0),
    budget NUMERIC NOT NULL CHECK (budget >= 0),
    start_date DATE NOT NULL,
    expected_completion_date DATE NOT NULL,
    finish_level TEXT NOT NULL CHECK (finish_level IN ('Economy', 'Standard', 'Premium', 'Luxury')),
    description TEXT,
    status TEXT NOT NULL DEFAULT 'Planning' CHECK (status IN ('Planning', 'In Progress', 'Completed', 'On Hold')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. COST ESTIMATES TABLE
CREATE TABLE IF NOT EXISTS public.cost_estimates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    project_type TEXT NOT NULL,
    location TEXT NOT NULL,
    built_up_area NUMERIC NOT NULL,
    floors INTEGER NOT NULL,
    finish_level TEXT NOT NULL,
    base_rate NUMERIC NOT NULL,
    estimated_total NUMERIC NOT NULL,
    breakdown JSONB NOT NULL,
    assumptions JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. MATERIAL RECOMMENDATIONS TABLE
CREATE TABLE IF NOT EXISTS public.material_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    category TEXT NOT NULL,
    material_type TEXT NOT NULL,
    reasons TEXT NOT NULL,
    advantages TEXT[] DEFAULT '{}',
    disadvantages TEXT[] DEFAULT '{}',
    budget_suitability TEXT NOT NULL,
    important_considerations TEXT,
    supplier_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. PROJECT TASKS TABLE
CREATE TABLE IF NOT EXISTS public.project_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    phase TEXT NOT NULL,
    description TEXT,
    duration_days INTEGER NOT NULL DEFAULT 1 CHECK (duration_days > 0),
    start_date DATE,
    due_date DATE,
    status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'In Progress', 'Completed')),
    priority TEXT NOT NULL DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High', 'Urgent')),
    progress_percentage INTEGER NOT NULL DEFAULT 0 CHECK (progress_percentage BETWEEN 0 AND 100),
    notes TEXT,
    is_milestone BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. PROGRESS UPDATES TABLE
CREATE TABLE IF NOT EXISTS public.progress_updates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    notes TEXT,
    completion_percentage INTEGER NOT NULL CHECK (completion_percentage BETWEEN 0 AND 100),
    logged_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. CHAT HISTORY TABLE
CREATE TABLE IF NOT EXISTS public.chat_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- INDEXES FOR PERFORMANCE
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON public.projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON public.project_tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON public.project_tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON public.project_tasks(status);
CREATE INDEX IF NOT EXISTS idx_estimates_project_id ON public.cost_estimates(project_id);
CREATE INDEX IF NOT EXISTS idx_materials_project_id ON public.material_recommendations(project_id);
CREATE INDEX IF NOT EXISTS idx_progress_project_id ON public.progress_updates(project_id);
CREATE INDEX IF NOT EXISTS idx_chat_project_id ON public.chat_history(project_id);
CREATE INDEX IF NOT EXISTS idx_chat_user_id ON public.chat_history(user_id);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cost_estimates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.material_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_history ENABLE ROW LEVEL SECURITY;

-- PROFILES Policies
CREATE POLICY "Users can view own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- PROJECTS Policies
CREATE POLICY "Users can view own projects"
    ON public.projects FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own projects"
    ON public.projects FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects"
    ON public.projects FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects"
    ON public.projects FOR DELETE
    USING (auth.uid() = user_id);

-- COST ESTIMATES Policies
CREATE POLICY "Users can view own estimates"
    ON public.cost_estimates FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own estimates"
    ON public.cost_estimates FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own estimates"
    ON public.cost_estimates FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own estimates"
    ON public.cost_estimates FOR DELETE
    USING (auth.uid() = user_id);

-- MATERIAL RECOMMENDATIONS Policies
CREATE POLICY "Users can view own recommendations"
    ON public.material_recommendations FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own recommendations"
    ON public.material_recommendations FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own recommendations"
    ON public.material_recommendations FOR DELETE
    USING (auth.uid() = user_id);

-- PROJECT TASKS Policies
CREATE POLICY "Users can view own tasks"
    ON public.project_tasks FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tasks"
    ON public.project_tasks FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tasks"
    ON public.project_tasks FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own tasks"
    ON public.project_tasks FOR DELETE
    USING (auth.uid() = user_id);

-- PROGRESS UPDATES Policies
CREATE POLICY "Users can view own progress updates"
    ON public.progress_updates FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress updates"
    ON public.progress_updates FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- CHAT HISTORY Policies
CREATE POLICY "Users can view own chat messages"
    ON public.chat_history FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own chat messages"
    ON public.chat_history FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- =============================================================================
-- AUTO PROFILE TRIGGER ON USER REGISTRATION
-- =============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, email, role, avatar_url)
    VALUES (
        new.id,
        COALESCE(new.raw_user_meta_data->>'full_name', 'Construction Manager'),
        new.email,
        'Project Manager',
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists, then attach to auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
