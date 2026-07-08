import { Router } from 'express'
import pool from '../db.js'

const router = Router()

// OTLP attribute 배열 → 단순 객체 변환
function attrMap(attrs = []) {
  const m = {}
  for (const a of attrs) {
    const v = a.value ?? {}
    m[a.key] = v.stringValue ?? v.intValue ?? v.doubleValue ?? v.boolValue ?? null
  }
  return m
}

// POST /v1/metrics — OTLP HTTP/JSON 수신
router.post('/metrics', async (req, res) => {
  try {
    const { resourceMetrics = [] } = req.body ?? {}

    for (const rm of resourceMetrics) {
      const res0  = attrMap(rm.resource?.attributes)
      const userEmail = res0['user.email'] ?? res0['claudecode.user.email'] ?? null
      const sessionId = res0['session.id'] ?? res0['claudecode.session.id'] ?? null

      // model별 토큰·비용 누적
      const byModel = {}

      for (const sm of (rm.scopeMetrics ?? [])) {
        for (const metric of (sm.metrics ?? [])) {
          const name = (metric.name ?? '').toLowerCase()
          const dps  = metric.sum?.dataPoints ?? metric.gauge?.dataPoints ?? []

          if (name.includes('token')) {
            for (const dp of dps) {
              const a = attrMap(dp.attributes)
              const tokenType = a['token.type'] ?? a['type'] ?? ''
              const model     = a['model'] ?? a['gen_ai.request.model'] ?? ''
              const val       = parseInt(dp.asInt ?? dp.asDouble ?? 0) || 0

              byModel[model] ??= { input: 0, output: 0, cache_read: 0, cache_creation: 0, cost: 0 }
              if (tokenType === 'input')          byModel[model].input          += val
              if (tokenType === 'output')         byModel[model].output         += val
              if (tokenType === 'cache_read')     byModel[model].cache_read     += val
              if (tokenType === 'cache_creation') byModel[model].cache_creation += val
            }
          }

          if (name.includes('cost')) {
            for (const dp of dps) {
              const a   = attrMap(dp.attributes)
              const model = a['model'] ?? a['gen_ai.request.model'] ?? ''
              const val   = parseFloat(dp.asDouble ?? dp.asInt ?? 0) || 0

              byModel[model] ??= { input: 0, output: 0, cache_read: 0, cache_creation: 0, cost: 0 }
              byModel[model].cost += val
            }
          }
        }
      }

      for (const [model, v] of Object.entries(byModel)) {
        if (v.input === 0 && v.output === 0 && v.cost === 0) continue
        await pool.query(
          `INSERT INTO token_usage
             (session_id, user_email, model,
              input_tokens, output_tokens, cache_read_tokens, cache_creation_tokens,
              cost_usd, recorded_at)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,NOW())`,
          [sessionId, userEmail, model,
           v.input, v.output, v.cache_read, v.cache_creation, v.cost],
        )
      }
    }

    res.status(200).json({ partialSuccess: {} })
  } catch (err) {
    console.error('[otel] metrics error:', err.message)
    // 200 반환 — Claude Code telemetry 차단 방지
    res.status(200).json({ partialSuccess: {} })
  }
})

// POST /v1/logs — OTLP HTTP/JSON 수신 (수신만, 별도 저장 없음)
router.post('/logs', (_req, res) => {
  res.status(200).json({ partialSuccess: {} })
})

export default router
