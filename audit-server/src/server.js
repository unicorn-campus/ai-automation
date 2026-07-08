import express from 'express'
import { readFile } from 'fs/promises'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import pool              from './db.js'
import { apiKeyAuth }    from './middleware/auth.js'
import auditRouter       from './routes/audit.js'
import otelRouter        from './routes/otel.js'
import tokenUsageRouter  from './routes/token-usage.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const app       = express()
const PORT      = process.env.PORT || 3000

const MIGRATIONS = [
  '001_create_audit_logs.sql',
  '002_add_token_usage.sql',
]

async function migrate() {
  for (const file of MIGRATIONS) {
    const sql = await readFile(join(__dirname, '../migrations', file), 'utf8')
    await pool.query(sql)
    console.log(`[server] migration applied: ${file}`)
  }
}

app.use(express.json())

// 헬스체크 — 인증 없이 접근 (컨테이너 healthcheck 전용)
app.get('/health', (_req, res) => res.json({ status: 'ok' }))

// 감사 로그 API
app.use('/api/audit', apiKeyAuth, auditRouter)

// 토큰 사용량 API
app.use('/api/token-usage', apiKeyAuth, tokenUsageRouter)

// OTLP HTTP/JSON 수신 엔드포인트 (Claude Code telemetry)
app.use('/v1', apiKeyAuth, otelRouter)

// 중앙 에러 핸들러
app.use((err, _req, res, _next) => {
  console.error('[server]', err.message)
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' })
})

migrate()
  .then(() => app.listen(PORT, () => console.log(`[server] audit server listening on :${PORT}`)))
  .catch((err) => { console.error('[server] migration failed:', err.message); process.exit(1) })
