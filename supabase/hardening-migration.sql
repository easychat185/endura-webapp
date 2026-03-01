-- Hardening migration: atomic session number function
-- Run this in Supabase SQL editor

CREATE OR REPLACE FUNCTION next_session_number(p_user_id UUID)
RETURNS INTEGER AS $$
  SELECT COALESCE(MAX(session_number), 0) + 1
  FROM conversations WHERE user_id = p_user_id;
$$ LANGUAGE sql;
