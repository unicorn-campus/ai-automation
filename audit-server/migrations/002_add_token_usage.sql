-- 토큰·비용 사용량 (OTLP metrics 수신용)
-- 누적(cumulative) 카운터를 수신 — 보고 쿼리에서 session별 최댓값 사용
CREATE TABLE IF NOT EXISTS token_usage (
  id                    BIGSERIAL PRIMARY KEY,
  session_id            TEXT,
  user_email            TEXT,
  model                 TEXT,
  input_tokens          BIGINT        NOT NULL DEFAULT 0,
  output_tokens         BIGINT        NOT NULL DEFAULT 0,
  cache_read_tokens     BIGINT        NOT NULL DEFAULT 0,
  cache_creation_tokens BIGINT        NOT NULL DEFAULT 0,
  cost_usd              NUMERIC(14,8) NOT NULL DEFAULT 0,
  recorded_at           TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_token_user_email  ON token_usage (user_email);
CREATE INDEX IF NOT EXISTS idx_token_recorded_at ON token_usage (recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_token_session_id  ON token_usage (session_id);
