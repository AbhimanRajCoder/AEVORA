-- Serve newest institution alerts without sorting the whole campus feed.
CREATE INDEX IF NOT EXISTS idx_alerts_campus_feed
ON public.alerts (institution_id, created_at DESC, id);
