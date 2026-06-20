# Claude Code 감사 로그 서버 — 작업 현황

## 개요

Claude Code Managed Hook을 이용한 사용자 프롬프트 감사 로그 수집 시스템 구축 작업 정리.

---

## 완료된 작업

### 1. 감사 로그 서버 개발 (`audit-server/`)

| 파일 | 내용 |
|------|------|
| `src/server.js` | Express v5 서버 · `/health` · `/api/audit` (POST/GET) |
| `src/db.js` | pg Pool · DATABASE_URL 자동 감지 (Fly.io용) |
| `src/middleware/auth.js` | X-API-Key 헤더 인증 |
| `src/routes/audit.js` | 감사 로그 수신·저장·조회 라우터 |
| `migrations/001_create_audit_logs.sql` | audit_logs 테이블 · 인덱스 3개 |
| `Dockerfile` | Node 22-alpine · healthcheck |
| `docker-compose.yml` | PostgreSQL 16 + 서버 로컬 실행 구성 |
| `fly.toml` | Fly.io 배포 설정 (nrt 리전 · 256MB) |
| `deploy.sh` | Mac/Linux 배포 자동화 스크립트 |
| `deploy.ps1` | Windows PowerShell 배포 자동화 스크립트 |
| `.env.example` | 환경변수 예시 |

### 2. Fly.io 배포 완료

| 항목 | 값 |
|------|-----|
| **앱 URL** | `https://unicorn-audit.fly.dev` |
| **헬스체크** | `GET /health` → `{"status":"ok"}` ✅ |
| **감사 로그 수신** | `POST /api/audit` ✅ |
| **감사 로그 조회** | `GET /api/audit` ✅ |
| **리전** | nrt (도쿄) |
| **PostgreSQL** | `unicorn-audit-db` (Fly.io Managed Postgres) |
| **DB 연결 방식** | Fly.io 내부 네트워크 (sslmode=disable) |

### 3. 생성된 자격증명

> ⚠️ **보안 주의**: 아래 API_KEY는 Fly.io secrets에 이미 설정됨.  
> 실제 운영 시 관리자에게 별도 전달 필요.

```
API_KEY: c1a72c28c9aed0f0bc156dc2c4a0df79392c40a32a48c61a
```

### 4. 프롬프트 파일

- `prompts/6회차/audit-log-managed-hook.md` — 전체 구축 작업 지시 프롬프트

---

## 완료된 작업 (추가)

### 4. Managed Hook 등록 완료 (2026-06-20)

| 항목 | 내용 |
|------|------|
| **등록 방식** | Claude.ai 관리자 콘솔 (서버 사이드 — 사용자 우회 불가) |
| **등록 URL** | `https://claude.ai/admin-settings/claude-code` |
| **조직** | unicorn |
| **적용 이벤트** | `UserPromptSubmit`, `SessionStart` |
| **훅 유형** | HTTP hook → `https://unicorn-audit.fly.dev/api/audit` |
| **인증** | `X-API-Key` 값을 headers에 직접 하드코딩 (환경변수 불필요) |
| **사용자 우회 방지** | `allowManagedHooksOnly: true` 설정 |
| **보안** | API 키가 서버 사이드 저장 → 사용자 PC에 노출 없음 |

#### 주의 사항

- 스키마 경고 발생: `"async"`, `"allowedEnvVars"` 필드가 공개 스키마 미포함 → **"오류가 있는 상태로 업데이트"** 클릭으로 강제 저장 (실제 동작 정상)
- 훅은 **Claude Code 재시작 후** 활성화됨
- `C:\Program Files\ClaudeCode\managed-settings.json` 로컬 파일 삭제 완료 (관리자 콘솔 등록으로 불필요)

---

## 미완료 작업

### CLAUDE_USER_EMAIL 환경변수 배포 (선택)

사용자 식별이 필요한 경우 각 PC에 배포:

```
CLAUDE_USER_EMAIL=사용자이메일@unicorn.kubepia.com
```

| OS | 배포 방법 |
|----|----------|
| Windows | Intune / Group Policy → 시스템 환경변수 |
| macOS | JAMF / Kandji → launchd plist |
| Linux | Ansible → `/etc/environment` |

> `COMPUTERNAME`(Windows 기본값)으로 머신 식별은 이미 동작. `CLAUDE_USER_EMAIL` 없으면 user_email은 null로 기록됨.

---

## 검증 방법

```bash
# 헬스체크
curl https://unicorn-audit.fly.dev/health

# 감사 로그 전송 테스트
curl -X POST https://unicorn-audit.fly.dev/api/audit \
  -H "X-API-Key: c1a72c28c9aed0f0bc156dc2c4a0df79392c40a32a48c61a" \
  -H "Content-Type: application/json" \
  -d '{"session_id":"test","hook_event_name":"UserPromptSubmit","prompt":"테스트","cwd":"/tmp"}'

# 로그 조회
curl "https://unicorn-audit.fly.dev/api/audit" \
  -H "X-API-Key: c1a72c28c9aed0f0bc156dc2c4a0df79392c40a32a48c61a"
```
