# 프롬프트: PreToolUse SQL 쿼리 안전화 훅 (SQL Safety)

## 사용 목적
Bash 도구로 실행되는 SQL `SELECT` 쿼리에 `LIMIT`가 없을 때 자동으로 추가하는  
`PreToolUse` 훅 스크립트를 작성하고 `plugin.json`에 등록하여 전체 테이블 스캔을 방지함.

---

```text
[목표]
SQL SELECT 쿼리에 LIMIT 절이 없을 때 자동으로 추가하는 PreToolUse 훅 스크립트 작성 및
plugin.json 등록 — 전체 테이블 스캔으로 인한 성능 장애 방지

[역할]
당신은 Claude Code 플러그인·훅 개발 경력 5년의 시니어 Node.js 개발자이자 DB 성능 최적화 전문가입니다.

[맥락]
- 내 상황: AI가 Bash 도구로 실행하는 SQL SELECT 쿼리에 LIMIT가 없으면 대용량 DB에서 전체 테이블
  스캔이 발생해 성능 장애가 생길 수 있어 PreToolUse 훅의 updatedInput으로 자동 보완하고 싶음
- 결과물 독자: Claude Code 플러그인 관리자·DB 운영자·DBA

[입력정보]
- 훅 작성 참조 가이드: references/hook-guide.md
- plugin.json 등록 경로: .claude-plugin/plugin.json
- 훅 스크립트 저장 경로: .claude-plugin/hooks/
- LIMIT 기본값: 100 (환경변수 SQL_LIMIT으로 오버라이드 가능)
- 대상 DB 클라이언트 명령어: sqlite3, psql, mysql, mariadb

[작업방법]
1. references/hook-guide.md 확인 — updatedInput 출력 형식 파악 (§4-4)
2. .claude-plugin/hooks/pre-tool-sql-limit.mjs 작성
   - stdin에서 JSON 파싱: tool_name, tool_input
   - 대상 도구: Bash
   - 처리 로직:
     a. tool_input.command 추출
     b. DB 클라이언트 명령어 포함 여부 확인: /\b(sqlite3|psql|mysql|mariadb)\b/i
     c. SELECT 쿼리 포함 여부 확인: /SELECT\s+/i
     d. LIMIT 절 미포함 여부 확인: !/LIMIT\s+\d+/i
     e. b·c·d 모두 해당 시 — LIMIT 추가
        - 최상위 SELECT에만 적용 (서브쿼리·CTE 내 SELECT 제외)
        - 세미콜론 처리: 쿼리 끝 세미콜론 제거 → LIMIT N 추가 → 세미콜론 재결합
        - LIMIT 값: Number(process.env.SQL_LIMIT) || 100
        - 수정된 command를 updatedInput으로 반환
     f. 조건 미해당 시 → 출력 없이 exit 0 (통과)
   - updatedInput 출력 형식 (hook-guide.md §4-4):
     { hookSpecificOutput: { hookEventName: "PreToolUse", updatedInput: { command: newCmd } } }
3. .claude-plugin/plugin.json의 hooks 필드에 등록
   - 이벤트: PreToolUse
   - matcher: Bash
   - command: node
   - args: ["${CLAUDE_PLUGIN_ROOT}/hooks/pre-tool-sql-limit.mjs"]
   - timeout: 5
4. 동작 검증 (echo 명령으로 stdin 직접 주입하여 확인)
   - LIMIT 없는 SELECT: updatedInput에 LIMIT 100 추가된 command 출력 확인
   - LIMIT 있는 SELECT: 통과 확인 — 출력 없음, exit 0
   - INSERT·UPDATE·DELETE: 통과 확인 — SELECT 아님, exit 0
   - 서브쿼리 포함 SELECT: 최상위에만 LIMIT 추가되는지 확인
- 톤앤매너: 성능·안전 원칙 우선, 자명한 변수명으로 가독성 확보
- 작성 규칙:
  - 훅 스크립트는 .mjs(ES Module) 형식 (import 문법 사용)
  - Windows·macOS·Linux 크로스플랫폼 동작 보장
  - process.stdin을 청크 단위로 읽어 JSON.parse 처리
  - 에러 발생 시 exit 1, stderr에 에러 메시지 출력
  - console.log 사용 금지 — stdout 오염 방지, 디버그 출력은 process.stderr

[출력]
- 훅 스크립트: .claude-plugin/hooks/pre-tool-sql-limit.mjs
- plugin.json: .claude-plugin/plugin.json (PreToolUse Bash hooks 필드 업데이트)

[제약조건]
- MUST:
  - updatedInput을 hookSpecificOutput 래퍼로 감싸서 출력 (hook-guide.md §4-4 형식 준수)
  - 최상위 SELECT에만 LIMIT 추가 (서브쿼리·CTE 내 SELECT 수정 금지)
  - .mjs 확장자 사용
  - SQL_LIMIT 환경변수로 LIMIT 값 오버라이드 지원
- MUST NOT:
  - bash/sh로 스크립트 작성 금지 (Windows 미지원)
  - SELECT 여부와 무관하게 모든 Bash 명령어에 LIMIT 삽입 금지
  - INSERT·UPDATE·DELETE·DROP 등 DML/DDL 쿼리에 LIMIT 삽입 금지
  - console.log 사용 금지 — process.stderr 사용
- 완료조건:
  - .claude-plugin/hooks/pre-tool-sql-limit.mjs 파일 생성 확인
  - plugin.json의 PreToolUse(Bash) hooks에 해당 스크립트 등록 확인
  - echo '{"tool_name":"Bash","tool_input":{"command":"sqlite3 db.sqlite \"SELECT * FROM users;\""}}' |
    node .claude-plugin/hooks/pre-tool-sql-limit.mjs 실행 시
    updatedInput.command에 LIMIT 100 추가된 결과 출력 확인

[예시]
(LIMIT 자동 추가)
입력: { "tool_name": "Bash", "tool_input": { "command": "sqlite3 db.sqlite \"SELECT * FROM orders;\"" } }
출력: {
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "updatedInput": { "command": "sqlite3 db.sqlite \"SELECT * FROM orders LIMIT 100;\"" }
  }
}

(LIMIT 이미 있는 경우 — 통과)
입력: { "tool_name": "Bash", "tool_input": { "command": "psql -c \"SELECT id FROM users LIMIT 10;\"" } }
출력: (없음 — exit 0으로 통과)

(비 SELECT 쿼리 — 통과)
입력: { "tool_name": "Bash",
        "tool_input": { "command": "sqlite3 db.sqlite \"DELETE FROM logs WHERE created_at < '2024-01-01';\"" } }
출력: (없음 — exit 0으로 통과)

(SQL_LIMIT 환경변수 적용)
SQL_LIMIT=50 node pre-tool-sql-limit.mjs 실행 시 → LIMIT 50 삽입
```

---

## 활용 팁
- `SQL_LIMIT=0`으로 설정 시 LIMIT 삽입 비활성화(무제한 허용)하도록 예외 처리 추가 가능
- `matcher`를 `Bash|mcp__db__*`로 확장하면 MCP DB 도구에도 동일 안전화 적용 가능
- psql의 `\copy`, sqlite3의 `.mode` 같은 메타 명령어는 SELECT 정규식에 걸리지 않아 자동 통과
