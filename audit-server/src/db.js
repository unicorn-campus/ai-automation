import pg from 'pg'

const { Pool } = pg

// Fly.io postgres attach 시 DATABASE_URL 자동 주입 — 로컬은 개별 변수 사용
const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString:  process.env.DATABASE_URL,  // sslmode=disable 포함 시 SSL 강제 비활성
      max:               10,
      idleTimeoutMillis: 30000,
    })
  : new Pool({
      host:              process.env.DB_HOST     || 'localhost',
      port:              parseInt(process.env.DB_PORT || '5432'),
      database:          process.env.DB_NAME     || 'auditdb',
      user:              process.env.DB_USER     || 'audituser',
      password:          process.env.DB_PASSWORD,
      max:               10,
      idleTimeoutMillis: 30000,
    })

pool.on('error', (err) => {
  console.error('[db] idle client error:', err.message)
})

export default pool
