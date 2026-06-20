import express from 'express'
import { readFile } from 'fs/promises'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import pool          from './db.js'
import { apiKeyAuth } from './middleware/auth.js'
import auditRouter   from './routes/audit.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const app       = express()
const PORT      = process.env.PORT || 3000

// 서버 시작 시 마이그레이션 적용 (IF NOT EXISTS — 멱등)
async function migrate() {
  const sql = await readFile(join(__dirname, '../migrations/001_create_audit_logs.sql'), 'utf8')
  await pool.query(sql)
  console.log('[server] migration applied')
}

app.use(express.json())

// 헬스체크 — 인증 없이 접근 (컨테이너 healthcheck 전용)
app.get('/health', (_req, res) => res.json({ status: 'ok' }))

// 감사 로그 API
app.use('/api/audit', apiKeyAuth, auditRouter)

// 중앙 에러 핸들러
app.use((err, _req, res, _next) => {
  console.error('[server]', err.message)
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' })
})

migrate()
  .then(() => app.listen(PORT, () => console.log(`[server] audit server listening on :${PORT}`)))
  .catch((err) => { console.error('[server] migration failed:', err.message); process.exit(1) })
