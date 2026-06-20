import { Router } from 'express'
import pool from '../db.js'

const router = Router()

// Windows/Linux/Mac 경로에서 사용자명 추출
// "C:\Users\hiond\..." → "hiond" / "/home/hiond/..." → "hiond"
function extractUsername(cwd, transcriptPath) {
  for (const p of [cwd, transcriptPath]) {
    if (!p) continue
    const m = p.match(/[/\\](?:Users|home)[/\\]([^/\\]+)/)
    if (m) return m[1]
  }
  return null
}

// POST /api/audit — Claude hook에서 이벤트 수신
router.post('/', async (req, res, next) => {
  try {
    const {
      session_id,
      prompt,
      cwd,
      model,
      hook_event_name = 'UserPromptSubmit',
      transcript_path,
      env = {},
    } = req.body

    // allowedEnvVars는 현재 버전에서 미지원 → cwd/transcript_path에서 사용자명 추출
    const user_email   = env.CLAUDE_USER_EMAIL ?? extractUsername(cwd, transcript_path)
    const machine_name = env.COMPUTERNAME ?? env.HOSTNAME ?? null

    await pool.query(
      `INSERT INTO audit_logs
         (session_id, user_email, machine_name, prompt_text, cwd, model, hook_event)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [session_id, user_email, machine_name, prompt ?? null, cwd ?? null, model ?? null, hook_event_name],
    )

    res.status(200).json({ ok: true })
  } catch (err) {
    next(err)
  }
})

// GET /api/audit — 감사 로그 조회 (필터: user_email, session_id, from, to, limit, offset)
router.get('/', async (req, res, next) => {
  try {
    const {
      user_email,
      session_id,
      from,
      to,
      limit  = 50,
      offset = 0,
    } = req.query

    const conditions = []
    const params     = []
    let   idx        = 1

    if (user_email) { conditions.push(`user_email  = $${idx++}`); params.push(user_email)  }
    if (session_id) { conditions.push(`session_id  = $${idx++}`); params.push(session_id)  }
    if (from)       { conditions.push(`created_at >= $${idx++}`); params.push(from)         }
    if (to)         { conditions.push(`created_at <= $${idx++}`); params.push(to)           }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''

    const countRes = await pool.query(
      `SELECT COUNT(*) FROM audit_logs ${where}`,
      params,
    )

    const dataRes = await pool.query(
      `SELECT id, session_id, user_email, machine_name, prompt_text,
              cwd, model, hook_event, created_at
       FROM audit_logs
       ${where}
       ORDER BY created_at DESC
       LIMIT $${idx++} OFFSET $${idx}`,
      [...params, parseInt(limit), parseInt(offset)],
    )

    res.json({
      total:  parseInt(countRes.rows[0].count),
      limit:  parseInt(limit),
      offset: parseInt(offset),
      data:   dataRes.rows,
    })
  } catch (err) {
    next(err)
  }
})

export default router
