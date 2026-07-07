import { Router } from 'express'
import pool from '../db.js'

const router = Router()

// GET /api/token-usage — 사용자별 토큰·비용 집계
// OTLP는 누적 카운터를 전송하므로 session+model별 최신값(MAX)을 기준으로 집계
router.get('/', async (req, res, next) => {
  try {
    const {
      from,
      to,
      user_email,
    } = req.query

    const conditions = []
    const params     = []
    let   idx        = 1

    if (user_email) { conditions.push(`user_email  = $${idx++}`); params.push(user_email) }
    if (from)       { conditions.push(`recorded_at >= $${idx++}`); params.push(from)       }
    if (to)         { conditions.push(`recorded_at <= $${idx++}`); params.push(to)         }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''

    // session+model별 최신 행 → 사용자별 집계
    const byUserRes = await pool.query(
      `SELECT
         user_email,
         SUM(input_tokens)          AS input_tokens,
         SUM(output_tokens)         AS output_tokens,
         SUM(cache_read_tokens)     AS cache_read_tokens,
         SUM(cache_creation_tokens) AS cache_creation_tokens,
         SUM(cost_usd)              AS cost_usd,
         COUNT(DISTINCT session_id) AS session_count
       FROM (
         SELECT DISTINCT ON (session_id, model)
           user_email, session_id, model,
           input_tokens, output_tokens, cache_read_tokens, cache_creation_tokens, cost_usd
         FROM token_usage
         ${where}
         ORDER BY session_id, model, recorded_at DESC
       ) latest
       GROUP BY user_email
       ORDER BY SUM(input_tokens + output_tokens) DESC`,
      params,
    )

    // 전체 합계
    const totalRes = await pool.query(
      `SELECT
         SUM(input_tokens)          AS total_input_tokens,
         SUM(output_tokens)         AS total_output_tokens,
         SUM(cache_read_tokens)     AS total_cache_read_tokens,
         SUM(cache_creation_tokens) AS total_cache_creation_tokens,
         SUM(cost_usd)              AS total_cost_usd,
         COUNT(DISTINCT session_id) AS total_sessions
       FROM (
         SELECT DISTINCT ON (session_id, model)
           session_id, model,
           input_tokens, output_tokens, cache_read_tokens, cache_creation_tokens, cost_usd
         FROM token_usage
         ${where}
         ORDER BY session_id, model, recorded_at DESC
       ) latest`,
      params,
    )

    res.json({
      total:   totalRes.rows[0],
      by_user: byUserRes.rows,
    })
  } catch (err) {
    next(err)
  }
})

export default router
