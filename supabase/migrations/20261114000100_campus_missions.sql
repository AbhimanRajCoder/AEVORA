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

CREATE TABLE IF NOT EXISTS public.mission_checks (
  mission_id uuid NOT NULL REFERENCES public.campus_missions(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  task_index integer NOT NULL CHECK (task_index BETWEEN 0 AND 11),
  checked_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (mission_id, student_id, task_index)
);
ALTER TABLE public.mission_checks ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.mission_checks FROM anon, authenticated;
GRANT SELECT, INSERT, DELETE ON public.mission_checks TO service_role;
CREATE INDEX IF NOT EXISTS mission_checks_student ON public.mission_checks(student_id, mission_id);

CREATE OR REPLACE FUNCTION public.mission_participation(campus uuid)
RETURNS TABLE(mission_id uuid, started bigint, finished bigint, enrolled bigint)
LANGUAGE sql STABLE SECURITY INVOKER SET search_path = '' AS $$
  WITH students AS (
    SELECT id FROM public.profiles WHERE institution_id = campus AND role = 'student'
  ), progress AS (
    SELECT c.mission_id, c.student_id, count(*) AS checked FROM public.mission_checks c
    JOIN students s ON s.id = c.student_id
    JOIN public.campus_missions m ON m.id = c.mission_id AND m.institution_id = campus
    GROUP BY c.mission_id, c.student_id
  )
  SELECT m.id, count(p.student_id), count(p.student_id) FILTER (WHERE p.checked = cardinality(m.tasks)),
         (SELECT count(*) FROM students)
  FROM public.campus_missions m LEFT JOIN progress p ON p.mission_id = m.id
  WHERE m.institution_id = campus GROUP BY m.id;
$$;
REVOKE ALL ON FUNCTION public.mission_participation(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.mission_participation(uuid) TO service_role;
