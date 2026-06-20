[목표]
Claude Code managed hook 기반 사용자 프롬프트 감사 로그 시스템 구축 —  
UserPromptSubmit 훅 설정(managed-settings.json)과 PostgreSQL 기반 컨테이너 로그 서버를 함께 제공

[역할]
당신은 엔터프라이즈 보안·컴플라이언스 시스템 구축 7년 경력의 백엔드 개발자입니다.

[맥락]
- 내 상황: Claude Code Team/Enterprise plan 관리자로, 조직 내 모든 사용자의 프롬프트 사용 내역을  
  중앙에서 수집·감사해야 하는 컴플라이언스 요건 충족이 필요함
- 결과물 독자: 시스템 관리자 및 보안 담당자

[입력정보]
- Claude Code Hooks 공식 문서: https://code.claude.com/docs/en/hooks
- Claude Code Settings 공식 문서: https://code.claude.com/docs/en/settings
- 기술 스택: Node.js(Express v5) + PostgreSQL(pg) + Docker

[작업방법]
1. `audit-server/` 디렉토리 구조 생성:
   - `migrations/001_create_audit_logs.sql`: 감사 로그 테이블 스키마
   - `src/db.js`: PostgreSQL 연결 풀 (pg Pool)
   - `src/middleware/auth.js`: X-API-Key 인증 미들웨어
   - `src/routes/audit.js`: 감사 로그 수신(POST) + 조회(GET) 라우트
   - `src/server.js`: Express 서버 진입점
   - `Dockerfile`: Node.js 22 Alpine 기반 컨테이너 빌드
   - `docker-compose.yml`: PostgreSQL 16 + audit-server 통합 실행
   - `.env.example`: 환경변수 템플릿
   - `package.json`: ESM 모듈, Express v5, pg 의존성
2. `managed-settings-example.json` 작성 (프로젝트 루트):
   - UserPromptSubmit 훅: async HTTP POST → audit-server
   - SessionStart 훅: 세션 시작 이벤트 수집
   - `allowManagedHooksOnly: true` 포함
   - X-API-Key 헤더를 `allowedEnvVars`로 주입
3. 조회 API에 user_email·session_id·from·to 날짜 범위·limit·offset 필터 지원
- 출력파일: `audit-server/` (프로젝트 루트), `managed-settings-example.json`
- 톤앤매너: 실무 배포 가능한 수준. 주석은 핵심 WHY만 기재
- 작성 규칙:
  - ESM 모듈(`"type": "module"`) 사용
  - 민감정보는 환경변수로만 주입 (`.env`)
  - SQL은 파라미터화 쿼리만 사용 ($1, $2 — SQL 인젝션 방지)
  - 컨테이너 헬스체크 포함 (db: pg_isready, server: /health 엔드포인트)

[출력]
- `audit-server/` 전체 소스 (하위 파일 모두 생성)
- `managed-settings-example.json` (프로젝트 루트)

[제약조건]
- MUST:
  - use context7
  - 개발 중 추가정보나 의사결정이 필요하면 사용자에게 반드시 질문
  - SQL은 파라미터화 쿼리($1, $2) 사용
  - `docker-compose up --build` 한 번으로 전체 스택 실행 가능
  - `.env.example`에 모든 환경변수 용도 설명 포함
- MUST NOT:
  - API Key·DB 비밀번호 하드코딩 금지
  - 훅 수신 시 프롬프트 내용을 가공 없이 로그에 저장하는 것 권고하지 않음 (PII 마스킹 고려)
- 완료조건:
  - `audit-server/` 내 명시된 파일 모두 생성 확인
  - `docker-compose up --build` 실행 후 db·server 컨테이너 2개 기동 확인
  - `curl -X POST http://localhost:3000/api/audit` 호출 → 200 응답 + DB 저장 확인
  - `curl http://localhost:3000/api/audit` 호출 → 로그 목록 JSON 반환 확인

[예시]
(훅 수신 POST)
curl -X POST http://localhost:3000/api/audit \
  -H "X-API-Key: your-api-key" \
  -H "Content-Type: application/json" \
  -d '{"session_id":"abc123","hook_event_name":"UserPromptSubmit","prompt":"테스트 프롬프트",
       "cwd":"/home/user/project","model":"claude-sonnet-4-6",
       "env":{"CLAUDE_USER_EMAIL":"john@company.com","COMPUTERNAME":"JOHN-PC-001"}}'

(로그 조회 GET)
curl "http://localhost:3000/api/audit?user_email=john@company.com&limit=20" \
  -H "X-API-Key: your-api-key"

(조회 응답)
{
  "total": 42,
  "limit": 20,
  "offset": 0,
  "data": [
    {
      "id": 1,
      "session_id": "abc123",
      "user_email": "john@company.com",
      "machine_name": "JOHN-PC-001",
      "prompt_text": "테스트 프롬프트",
      "cwd": "/home/user/project",
      "model": "claude-sonnet-4-6",
      "hook_event": "UserPromptSubmit",
      "created_at": "2026-06-20T10:00:00.000Z"
    }
  ]
}
