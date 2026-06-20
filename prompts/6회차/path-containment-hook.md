# 프롬프트: PreToolUse 경로 제한 훅 (Path Containment)

## 사용 목적
파일 I/O 도구(`Read`·`Write`·`Edit`)의 `file_path`를 프로젝트 루트 내로 강제 한정하는  
`PreToolUse` 훅 스크립트를 작성하고 `plugin.json`에 등록하여 경로 탈출 공격을 방어함.

---

```text
[목표]
파일 I/O 도구(Read·Write·Edit)의 file_path를 프로젝트 루트 내로 강제 한정하는
PreToolUse 훅 스크립트 작성 및 plugin.json 등록 — 경로 탈출 공격 방어

[역할]
당신은 Claude Code 플러그인·훅 개발 경력 5년의 시니어 Node.js 보안 개발자입니다.

[맥락]
- 내 상황: AI가 ../../etc/passwd 같은 경로 탈출을 시도할 때 PreToolUse 훅의 updatedInput으로
  경로를 프로젝트 루트 내로 재작성하거나 차단하여 파일시스템 탈출을 방지하고 싶음
- 결과물 독자: Claude Code 플러그인 관리자·보안 담당자

[입력정보]
- 훅 작성 참조 가이드: references/hook-guide.md
- plugin.json 등록 경로: .claude-plugin/plugin.json
- 훅 스크립트 저장 경로: .claude-plugin/hooks/
- PROJECT_ROOT 참조: 환경변수 CLAUDE_PROJECT_DIR 사용

[작업방법]
1. references/hook-guide.md 확인 — updatedInput·block 출력 형식 파악 (§4-1, §4-4)
2. .claude-plugin/hooks/pre-tool-path-containment.mjs 작성
   - stdin에서 JSON 파싱: tool_name, tool_input
   - 대상 도구: Read, Write, Edit
   - 처리 로직:
     a. tool_input.file_path (또는 tool_input.path) 추출
     b. path.resolve()로 절대 경로 변환
     c. PROJECT_ROOT = process.env.CLAUDE_PROJECT_DIR
     d. 경로가 PROJECT_ROOT 외부인 경우:
        - ..  상위 디렉토리 탈출 포함 시 → decision:"block" 반환
        - 단순 외부 경로는 → path.join(PROJECT_ROOT, path.basename(filePath))로 재작성
          → updatedInput으로 수정된 file_path 반환
     e. 경로가 PROJECT_ROOT 내부이면 → 출력 없이 exit 0 (통과)
   - stdout으로 결과 JSON 출력
   - updatedInput 출력 형식 (hook-guide.md §4-4):
     { hookSpecificOutput: { hookEventName: "PreToolUse", updatedInput: { file_path: newPath } } }
   - block 출력 형식 (hook-guide.md §4-1):
     { decision: "block", reason: "...", systemMessage: "..." }
3. .claude-plugin/plugin.json의 hooks 필드에 등록
   - 이벤트: PreToolUse
   - matcher: Read|Write|Edit
   - command: node
   - args: ["${CLAUDE_PLUGIN_ROOT}/hooks/pre-tool-path-containment.mjs"]
   - timeout: 10
4. 동작 검증 (echo 명령으로 stdin 직접 주입하여 확인)
   - 정상 경로(PROJECT_ROOT 내부): 통과 확인 — 출력 없음, exit 0
   - 외부 경로(/tmp/output.txt): 재작성 확인 — updatedInput 출력 확인
   - 경로 탈출(../../etc/passwd): 차단 확인 — decision:block 출력 확인
- 톤앤매너: 보안 원칙 우선, 자명한 변수명으로 가독성 확보
- 작성 규칙:
  - 훅 스크립트는 .mjs(ES Module) 형식 (import 문법 사용)
  - Windows·macOS·Linux 크로스플랫폼 동작 보장
  - process.stdin을 청크 단위로 읽어 JSON.parse 처리
  - 에러 발생 시 exit 1, stderr에 에러 메시지 출력
  - console.log 사용 금지 — stdout 오염 방지, 디버그 출력은 process.stderr

[출력]
- 훅 스크립트: .claude-plugin/hooks/pre-tool-path-containment.mjs
- plugin.json: .claude-plugin/plugin.json (PreToolUse hooks 필드 업데이트)

[제약조건]
- MUST:
  - updatedInput을 hookSpecificOutput 래퍼로 감싸서 출력 (hook-guide.md §4-4 형식 준수)
  - CLAUDE_PROJECT_DIR 환경변수로 PROJECT_ROOT 참조
  - .mjs 확장자 사용
- MUST NOT:
  - bash/sh로 스크립트 작성 금지 (Windows 미지원)
  - .. 포함 경로를 단순 재작성하지 말 것 — 반드시 차단(block)
  - console.log 사용 금지 — process.stderr 사용
- 완료조건:
  - .claude-plugin/hooks/pre-tool-path-containment.mjs 파일 생성 확인
  - plugin.json의 PreToolUse hooks에 해당 스크립트 등록 확인
  - echo '{"tool_name":"Read","tool_input":{"file_path":"../../etc/passwd"}}' |
    node .claude-plugin/hooks/pre-tool-path-containment.mjs 실행 시
    decision:block 포함 JSON 출력 확인

[예시]
(외부 경로 재작성)
입력: { "tool_name": "Write", "tool_input": { "file_path": "/tmp/output.txt" } }
출력: {
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "updatedInput": { "file_path": "/Users/dev/myproject/output.txt" }
  }
}

(경로 탈출 차단)
입력: { "tool_name": "Read", "tool_input": { "file_path": "../../etc/passwd" } }
출력: {
  "decision": "block",
  "reason": "프로젝트 루트 외부 경로 탈출 시도 감지",
  "systemMessage": "file_path에 상위 디렉토리 탈출(..)이 포함되어 Read 도구 실행이 차단됨"
}

(정상 경로 통과)
입력: { "tool_name": "Read", "tool_input": { "file_path": "src/index.ts" } }
출력: (없음 — exit 0으로 통과)
```

---

## 활용 팁
- `CLAUDE_PROJECT_DIR`가 설정되지 않은 환경에서는 `process.cwd()`를 폴백으로 사용 가능
- `matcher`를 `Read|Write|Edit|Glob`으로 확장하면 Glob 도구의 경로도 제한 가능
- 화이트리스트 경로(예: `/tmp/claude-work/`)를 별도 허용하려면 로직 d 앞에 예외 조건 추가
