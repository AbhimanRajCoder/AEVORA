CREATE TABLE IF NOT EXISTS public.campus_missions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id uuid NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  title text NOT NULL CHECK (length(trim(title)) BETWEEN 1 AND 100),
  brief text NOT NULL CHECK (length(trim(brief)) BETWEEN 1 AND 700),
  due_on date NOT NULL,
  tasks text[] NOT NULL CHECK (cardinality(tasks) BETWEEN 1 AND 12),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS missions_agenda ON public.campus_missions(institution_id, due_on, id);
ALTER TABLE public.campus_missions ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.campus_missions FROM anon, authenticated;
GRANT SELECT, INSERT ON public.campus_missions TO service_role;
