#!/usr/bin/env bash
# Fly.io 감사 서버 최초 배포 스크립트 (Mac/Linux/WSL)
# 사전 조건: flyctl 설치(https://fly.io/docs/hands-on/install-flyctl/) + fly auth login
set -euo pipefail

APP_NAME="unicorn-audit"
PG_NAME="${APP_NAME}-db"
REGION="nrt"

echo "=== Fly.io 감사 서버 배포: ${APP_NAME}.fly.dev ==="
echo ""

# ── 1. API_KEY 자동 생성 ──────────────────────────────────────
API_KEY=$(openssl rand -hex 24)

# ── 2. 앱 생성 ────────────────────────────────────────────────
echo "[1/5] 앱 생성..."
fly apps create "${APP_NAME}" 2>/dev/null \
  && echo "  → 생성 완료" \
  || echo "  → 이미 존재, skip"

# ── 3. PostgreSQL 클러스터 생성 ───────────────────────────────
echo "[2/5] PostgreSQL 생성 (무료 1GB, 공유 CPU)..."
fly postgres create \
  --name "${PG_NAME}" \
  --region "${REGION}" \
  --initial-cluster-size 1 \
  --vm-size shared-cpu-1x \
  --volume-size 1 2>/dev/null \
  && echo "  → 생성 완료" \
  || echo "  → 이미 존재, skip"

# ── 4. PostgreSQL → 앱 연결 (DATABASE_URL 자동 주입) ──────────
echo "[3/5] PostgreSQL 연결 (DATABASE_URL 자동 주입)..."
fly postgres attach "${PG_NAME}" --app "${APP_NAME}" 2>/dev/null \
  && echo "  → 연결 완료" \
  || echo "  → 이미 연결됨, skip"

# ── 5. 시크릿 설정 ────────────────────────────────────────────
echo "[4/5] 시크릿 설정..."
fly secrets set API_KEY="${API_KEY}" --app "${APP_NAME}"

# ── 6. 배포 ───────────────────────────────────────────────────
echo "[5/5] 배포..."
fly deploy --app "${APP_NAME}" --region "${REGION}"

echo ""
echo "==============================="
echo "  ✅ 배포 완료"
echo "  URL    : https://${APP_NAME}.fly.dev"
echo "  API_KEY: ${API_KEY}"
echo ""
echo "  ⚠️  API_KEY를 지금 복사하세요. 이후 확인 불가합니다."
echo "==============================="
echo ""
echo "  헬스체크: curl https://${APP_NAME}.fly.dev/health"
echo "  로그 수신: curl -X POST https://${APP_NAME}.fly.dev/api/audit \\"
echo "               -H 'X-API-Key: ${API_KEY}' \\"
echo "               -H 'Content-Type: application/json' \\"
echo "               -d '{\"session_id\":\"test\",\"hook_event_name\":\"UserPromptSubmit\",\"prompt\":\"hello\"}'"
