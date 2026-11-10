-- ==============================================================================
-- Migration: Initial Schema for Disaster Preparedness & Management Education System
-- Description: Creates institutions, profiles, modules, lessons, progress,
--              quizzes, drills, alerts, and emergency contacts with RLS and indexes.
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Institutions Table
CREATE TABLE IF NOT EXISTS public.institutions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    state TEXT NOT NULL,
    district TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. Profiles Table (Linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('student', 'admin')) DEFAULT 'student',
    institution_id UUID REFERENCES public.institutions(id) ON DELETE SET NULL,
    points INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. Learning Modules Table
CREATE TABLE IF NOT EXISTS public.modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    disaster_type TEXT NOT NULL CHECK (disaster_type IN ('earthquake', 'flood', 'fire', 'cyclone', 'general')),
    description TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. Lessons Table
CREATE TABLE IF NOT EXISTS public.lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    image_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. Lesson Progress Table
CREATE TABLE IF NOT EXISTS public.lesson_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_user_lesson UNIQUE (user_id, lesson_id)
);

-- 7. Quiz Questions Table
CREATE TABLE IF NOT EXISTS public.quiz_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    options JSONB NOT NULL,
    correct_answer TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 8. Quiz Attempts Table
CREATE TABLE IF NOT EXISTS public.quiz_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    module_id UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
    score NUMERIC NOT NULL CHECK (score >= 0 AND score <= 100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 9. Drill Scenarios Table
CREATE TABLE IF NOT EXISTS public.drill_scenarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    steps JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 10. Drill Attempts Table
CREATE TABLE IF NOT EXISTS public.drill_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    scenario_id UUID NOT NULL REFERENCES public.drill_scenarios(id) ON DELETE CASCADE,
    score NUMERIC NOT NULL CHECK (score >= 0 AND score <= 100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 11. Alerts Table
CREATE TABLE IF NOT EXISTS public.alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    severity TEXT NOT NULL CHECK (severity IN ('info', 'warning', 'critical')) DEFAULT 'info',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 12. Emergency Contacts Table (National contacts have institution_id = NULL)
CREATE TABLE IF NOT EXISTS public.emergency_contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID REFERENCES public.institutions(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- Performance Indexes
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_profiles_institution_id ON public.profiles(institution_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_points ON public.profiles(points DESC);
CREATE INDEX IF NOT EXISTS idx_lessons_module_id ON public.lessons(module_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_user_id ON public.lesson_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_lesson_id ON public.lesson_progress(lesson_id);
CREATE INDEX IF NOT EXISTS idx_quiz_questions_module_id ON public.quiz_questions(module_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user_id ON public.quiz_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_module_id ON public.quiz_attempts(module_id);
CREATE INDEX IF NOT EXISTS idx_drill_attempts_user_id ON public.drill_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_drill_attempts_scenario_id ON public.drill_attempts(scenario_id);
CREATE INDEX IF NOT EXISTS idx_alerts_institution_id ON public.alerts(institution_id);
CREATE INDEX IF NOT EXISTS idx_emergency_contacts_institution_id ON public.emergency_contacts(institution_id);

-- ==============================================================================
-- Automatic Profile Creation Trigger for Supabase Auth
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, role, institution_id, points)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User'),
        COALESCE(NEW.raw_user_meta_data->>'role', 'student'),
        CASE 
            WHEN NEW.raw_user_meta_data->>'institution_id' IS NOT NULL 
            THEN (NEW.raw_user_meta_data->>'institution_id')::UUID 
            ELSE NULL 
        END,
        0
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- Row Level Security (RLS) Configuration
-- ==============================================================================
ALTER TABLE public.institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.drill_scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.drill_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_contacts ENABLE ROW LEVEL SECURITY;

-- Helper function to fetch current user's profile
CREATE OR REPLACE FUNCTION public.get_current_user_profile()
RETURNS TABLE (institution_id UUID, role TEXT) AS $$
    SELECT institution_id, role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- 1. Institutions Policies
CREATE POLICY "Institutions viewable by authenticated users"
    ON public.institutions FOR SELECT
    TO authenticated
    USING (true);

-- 2. Profiles Policies
CREATE POLICY "Users can view profiles in their institution"
    ON public.profiles FOR SELECT
    TO authenticated
    USING (
        id = auth.uid() OR
        institution_id = (SELECT institution_id FROM public.get_current_user_profile())
    );

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    TO authenticated
    USING (id = auth.uid())
    WITH CHECK (id = auth.uid());

CREATE POLICY "Users can insert own profile"
    ON public.profiles FOR INSERT
    TO authenticated
    WITH CHECK (id = auth.uid());

-- 3. Modules Policies
CREATE POLICY "Modules viewable by authenticated users"
    ON public.modules FOR SELECT
    TO authenticated
    USING (true);

-- 4. Lessons Policies
CREATE POLICY "Lessons viewable by authenticated users"
    ON public.lessons FOR SELECT
    TO authenticated
    USING (true);

-- 5. Lesson Progress Policies
CREATE POLICY "Users can view own lesson progress"
    ON public.lesson_progress FOR SELECT
    TO authenticated
    USING (
        user_id = auth.uid() OR
        (SELECT role FROM public.get_current_user_profile()) = 'admin'
    );

CREATE POLICY "Users can insert own lesson progress"
    ON public.lesson_progress FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid());

-- 6. Quiz Questions Policies
CREATE POLICY "Quiz questions viewable by authenticated users"
    ON public.quiz_questions FOR SELECT
    TO authenticated
    USING (true);

-- 7. Quiz Attempts Policies
CREATE POLICY "Users can view own quiz attempts"
    ON public.quiz_attempts FOR SELECT
    TO authenticated
    USING (
        user_id = auth.uid() OR
        (SELECT role FROM public.get_current_user_profile()) = 'admin'
    );

CREATE POLICY "Users can insert own quiz attempts"
    ON public.quiz_attempts FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid());

-- 8. Drill Scenarios Policies
CREATE POLICY "Drill scenarios viewable by authenticated users"
    ON public.drill_scenarios FOR SELECT
    TO authenticated
    USING (true);

-- 9. Drill Attempts Policies
CREATE POLICY "Users can view own drill attempts"
    ON public.drill_attempts FOR SELECT
    TO authenticated
    USING (
        user_id = auth.uid() OR
        (SELECT role FROM public.get_current_user_profile()) = 'admin'
    );

CREATE POLICY "Users can insert own drill attempts"
    ON public.drill_attempts FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid());

-- 10. Alerts Policies
CREATE POLICY "Users can view alerts for their institution"
    ON public.alerts FOR SELECT
    TO authenticated
    USING (
        institution_id = (SELECT institution_id FROM public.get_current_user_profile())
    );

CREATE POLICY "Admins can create alerts for their institution"
    ON public.alerts FOR INSERT
    TO authenticated
    WITH CHECK (
        (SELECT role FROM public.get_current_user_profile()) = 'admin' AND
        institution_id = (SELECT institution_id FROM public.get_current_user_profile())
    );

-- 11. Emergency Contacts Policies
CREATE POLICY "Users can view national and institution emergency contacts"
    ON public.emergency_contacts FOR SELECT
    TO authenticated
    USING (
        institution_id IS NULL OR
        institution_id = (SELECT institution_id FROM public.get_current_user_profile())
    );

CREATE POLICY "Admins can insert emergency contacts for their institution"
    ON public.emergency_contacts FOR INSERT
    TO authenticated
    WITH CHECK (
        (SELECT role FROM public.get_current_user_profile()) = 'admin' AND
        institution_id = (SELECT institution_id FROM public.get_current_user_profile())
    );

