-- Migration: Create smoking_records table
-- Each cigarette is one row, enabling future analytics (time patterns, trends)
-- RLS: users can only see & insert their own records

CREATE TABLE IF NOT EXISTS smoking_records (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Speed up per-user daily queries
CREATE INDEX IF NOT EXISTS idx_smoking_records_user_date
  ON smoking_records (user_id, recorded_at DESC);

-- ── RLS ────────────────────────────────────────────────────
ALTER TABLE smoking_records ENABLE ROW LEVEL SECURITY;

-- Users can read their own records
CREATE POLICY "Users can view their own records"
  ON smoking_records FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own records
CREATE POLICY "Users can insert their own records"
  ON smoking_records FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own records (undo last cigarette)
CREATE POLICY "Users can delete their own records"
  ON smoking_records FOR DELETE
  USING (auth.uid() = user_id);
