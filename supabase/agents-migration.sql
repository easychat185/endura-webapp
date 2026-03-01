-- ENDURA Agent System — Migration
-- Run in Supabase SQL Editor
-- No RLS — admin-only access via service role key

-- ============================================================
-- AGENT RUNS (execution log)
-- ============================================================
CREATE TABLE IF NOT EXISTS agent_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','running','completed','failed')),
  params JSONB DEFAULT '{}',
  input_tokens INTEGER DEFAULT 0,
  output_tokens INTEGER DEFAULT 0,
  total_tokens INTEGER DEFAULT 0,
  cost_usd NUMERIC(10,6) DEFAULT 0,
  duration_ms INTEGER DEFAULT 0,
  error TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX idx_agent_runs_type_created ON agent_runs(agent_type, created_at DESC);
CREATE INDEX idx_agent_runs_status ON agent_runs(status);

-- ============================================================
-- AGENT REPORTS (full JSONB output per run)
-- ============================================================
CREATE TABLE IF NOT EXISTS agent_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id UUID REFERENCES agent_runs(id) ON DELETE CASCADE NOT NULL,
  agent_type TEXT NOT NULL,
  report JSONB NOT NULL,
  summary TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_agent_reports_type_created ON agent_reports(agent_type, created_at DESC);
CREATE INDEX idx_agent_reports_run ON agent_reports(run_id);

-- ============================================================
-- AGENT ACTION ITEMS (extracted actionable items)
-- ============================================================
CREATE TABLE IF NOT EXISTS agent_action_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID REFERENCES agent_reports(id) ON DELETE CASCADE NOT NULL,
  agent_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  priority INTEGER NOT NULL CHECK (priority BETWEEN 1 AND 10),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open','in_progress','completed','dismissed')),
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_agent_action_items_status ON agent_action_items(status, priority DESC);
CREATE INDEX idx_agent_action_items_type ON agent_action_items(agent_type, created_at DESC);
CREATE INDEX idx_agent_action_items_report ON agent_action_items(report_id);

-- ============================================================
-- AGENT DAILY SUMMARIES (master coordinator synthesis)
-- ============================================================
CREATE TABLE IF NOT EXISTS agent_daily_summaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  summary_date DATE NOT NULL UNIQUE,
  executive_summary TEXT NOT NULL,
  cross_cutting_patterns JSONB DEFAULT '[]',
  top_priorities JSONB DEFAULT '[]',
  conflicts JSONB DEFAULT '[]',
  gaps JSONB DEFAULT '[]',
  strategic_recommendations JSONB DEFAULT '[]',
  agent_run_ids JSONB DEFAULT '[]',
  total_cost_usd NUMERIC(10,6) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_agent_daily_summaries_date ON agent_daily_summaries(summary_date DESC);
