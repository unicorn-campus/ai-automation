CREATE TABLE IF NOT EXISTS audit_logs (
  id          BIGSERIAL PRIMARY KEY,
  session_id  TEXT,
  user_email  TEXT,
  machine_name TEXT,
  prompt_text TEXT,
  cwd         TEXT,
  model       TEXT,
  hook_event  TEXT NOT NULL DEFAULT 'UserPromptSubmit',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_user_email  ON audit_logs (user_email);
CREATE INDEX IF NOT EXISTS idx_audit_created_at  ON audit_logs (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_session_id  ON audit_logs (session_id);
