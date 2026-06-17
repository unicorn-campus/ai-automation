# Claude Code 내장 스킬 목표 및 수행 내용

> 작성일: 2026-06-16  
> 대상: Claude Code CLI 기본 제공 슬래시 명령(Built-in Skills)  
> 목적: ICTK 업무자동화 부트캠프 학습 참조용

---

## 개요

Claude Code는 설치 시 CLI 바이너리에 내장된 슬래시 명령(Slash Command)을  
기본으로 제공함. 사용자가 별도 설치 없이 즉시 호출 가능하며, 플러그인으로 확장된 커스텀 스킬과  
구분하여 **내장 스킬(Built-in Skills)**로 통칭함.

공식 문서(`/en/commands`)는 내장 명령을 세 가지 유형으로 구분함.

- **내장 명령(Built-in command)**: CLI에 고정 로직으로 구현 (예: `/init`, `/config`, `/review`, `/security-review`)
- **번들 스킬(Bundled Skill)**: 프롬프트 기반으로 Claude가 도구를 활용해 수행 (예: `/code-review`, `/loop`)
- **번들 워크플로우(Bundled Workflow)**: 다수 서브에이전트로 백그라운드 실행 (예: `/deep-research`)

본 문서의 "유형" 항목은 이 분류를 따름.

---

## 빠른 참조 (Quick Reference)

> **Desktop 지원** 기준: Claude Code Desktop App(macOS/Windows) 채팅 창에서 슬래시 명령 직접 입력 가능 여부  
> ❌ 표시된 명령은 인터랙티브 터미널 패널이 필요하거나 CLI 전용 — Desktop의 Settings UI 또는 CLI에서 사용  
> 출처: [code.claude.com/docs/en/commands](https://code.claude.com/docs/en/commands)

| # | 스킬 | Goal | 주요 용도 | Desktop |
|---|------|------|-----------|---------|
| 1 | `/security-review` | Detect security vulnerabilities | 변경사항 보안 취약점 탐지·보고 (인젝션·인증·데이터노출 등) | ✅ |
| 2 | `/code-review` | Review code quality | 코드 품질 다차원 검토 (ultra 옵션: 멀티에이전트) | ✅ |
| 3 | `/init` | Initialize project | CLAUDE.md 생성, 프로젝트 환경 초기화 | ✅ |
| 4 | `/help` | Show help | 슬래시 명령 목록 및 사용법 안내 | ✅ |
| 5 | `/clear` | Clear context | 대화 컨텍스트 초기화 | ✅ |
| 6 | `/compact` | Compact context | 컨텍스트 요약·압축으로 토큰 공간 확보 | ✅ |
| 7 | `/usage` | Show token cost | 세션 비용·플랜 사용량·활동 통계 표시 (`/cost`, `/stats` 별칭) | ✅ |
| 8 | `/config` | Configure settings | 테마·모델·출력 스타일 등 환경 설정 (`/settings` 별칭) | ❌ CLI 전용¹ |
| 9 | `/permissions` | Manage permissions | 도구 실행 허용/거부 권한 설정 | ❌ CLI 전용¹ |
| 10 | `/doctor` | Diagnose environment | 설치 환경·API 키·MCP 연결 상태 진단 | ❌ CLI 전용¹ |
| 11 | `/hooks` | Configure hooks | 도구 이벤트 발생 시 쉘 명령 자동 실행 | ❌ CLI 전용¹ |
| 12 | `/fast` | Toggle fast mode | Opus 모델 빠른 출력 모드 토글 | ✅ |
| 13 | `/loop` | Run autonomous loop | 프롬프트를 자율 반복 수행하는 루프 모드 | ✅ |
| 14 | `/schedule` | Manage routines | cron 클라우드 루틴 생성·관리 (`/routines` 별칭) | ✅ |
| 15 | `/workflows` | Monitor workflows | 멀티에이전트 워크플로우 현황 모니터링 | ✅ |
| 16 | `/review` | Review pull request | PR을 로컬 세션에서 직접 리뷰 | ✅ |
| 17 | `/goal` | Set a goal | 완료 조건 선언 → 조건 충족까지 턴을 넘어 작업 지속 | ✅ |
| 18 | `/remote-control` | Enable remote control | 현재 세션을 claude.ai에서 원격 제어 (`/rc` 별칭) | ✅ |

> ¹ 인터랙티브 터미널 패널 필요. Desktop에서는 Settings UI(⚙️) 사용

---

## 내장 스킬 목록

### 1. `/security-review`

| 항목 | 내용 |
|------|------|
| **목표** | 현재 브랜치의 대기 중(미커밋·미머지) 변경사항(git diff) 보안 취약점 탐지 및 보고 |
| **유형** | Claude Code 내장 명령 (Built-in command) |

**탐지 대상(OWASP 등 주요 취약점 유형)**

- SQL Injection, XSS, Command Injection 등 인젝션 계열 취약점
- 하드코딩된 시크릿(API 키, 비밀번호, 토큰)
- 안전하지 않은 역직렬화(Insecure Deserialization)
- 취약한 의존성·라이브러리 버전
- 인증·인가(Authentication/Authorization) 결함
- 민감 데이터 평문 노출
- CORS 설정 오류 / CSRF 취약점
- 경로 탐색(Path Traversal) 및 파일 업로드 취약점
- 안전하지 않은 직접 객체 참조(IDOR)

**수행 절차**

1. 현재 브랜치의 대기 중 변경사항(git diff) 스캔
2. 탐지된 취약점별 심각도(`CRITICAL` / `HIGH` / `MEDIUM` / `LOW`) 분류
3. 취약점 위치(파일:줄 번호), 취약 코드 스니펫, 수정 권고안 포함 보고서 생성

**오탐 제외 기준**

- 테스트 코드 내 더미 시크릿(예: `password = "test"`)
- 주석 처리된 취약 패턴
- 이미 보안 처리된 래퍼 함수 내부 코드

**사용 조건**: 보안 취약점 점검, 코드 병합 전 시큐리티 게이트, CTF/교육 목적

---

### 2. `/code-review`

| 항목 | 내용 |
|------|------|
| **목표** | 현재 브랜치의 변경사항(diff)에서 정확성 버그와 정리(cleanup) 기회 검토 |
| **유형** | Claude Code 번들 스킬 (Bundled Skill) |
| **구문** | `/code-review [low\|medium\|high\|xhigh\|max\|ultra] [--fix] [--comment] [target]` |

**수행 내용**

- 정확성 버그 탐지: 논리 결함, 엣지 케이스, 경쟁 조건(Race Condition), Off-by-one 등
- 정리(cleanup) 제안: 기존 헬퍼 재사용, 단순화, 효율성 개선
- effort 레벨(`low`→`max`)로 검토 깊이·범위 조절 (낮을수록 고신뢰 소수, 높을수록 광범위)
- `--fix`: 발견 사항을 작업 트리에 자동 반영
- `--comment`: 발견 사항을 GitHub PR 인라인 코멘트로 게시
- `target`: 특정 경로 또는 PR 참조 지정 가능

**클라우드 확장 옵션**: `/code-review ultra` (권장) — 별칭 `/ultrareview`(deprecated)

- 클라우드 샌드박스에서 멀티에이전트 심층 리뷰 실행
- GitHub PR 지정 가능: `/code-review ultra <PR번호>`
- Pro·Max 플랜 3회 무료, 이후 usage credit 필요(유료·사용자 명시적 호출)

**사용 조건**: PR 머지 전 코드 품질 검토, 리팩터링 완료 후 회귀 점검

---

### 3. `/init`

| 항목 | 내용 |
|------|------|
| **목표** | 새 프로젝트 또는 기존 저장소에 Claude Code 환경 초기화 |

**수행 내용**

- 프로젝트 루트 탐색 및 언어·프레임워크 자동 감지
- `CLAUDE.md` 파일 생성: 프로젝트 컨텍스트·빌드 명령·테스트 명령·코드 스타일 기록
- 기존 문서(`README.md`, `package.json`, `pom.xml` 등)에서 메타데이터 추출·반영
- 향후 모든 대화에서 `CLAUDE.md`를 자동 참조하도록 세션 설정

**사용 조건**: Claude Code를 처음 사용하는 저장소 온보딩 시

---

### 4. `/help`

| 항목 | 내용 |
|------|------|
| **목표** | Claude Code CLI 사용법 및 내장 슬래시 명령 목록 안내 |

**수행 내용**

- 사용 가능한 전체 슬래시 명령 목록 출력
- 각 명령의 간단한 설명 제공
- 버그 리포트·피드백은 `/feedback`(별칭 `/bug`, `/share`)으로 제출

**사용 조건**: 처음 사용하거나 명령을 확인할 때

---

### 5. `/clear`

| 항목 | 내용 |
|------|------|
| **목표** | 현재 대화 컨텍스트(Context Window) 초기화 |

**수행 내용**

- 현재 컨텍스트를 비우고 새 대화 시작(단, `CLAUDE.md`·프로젝트 메모리는 유지)
- 이전 대화는 삭제되지 않고 `/resume` 목록에서 다시 열람 가능
- 같은 대화를 이어가며 컨텍스트만 줄이려면 `/compact` 사용
- 별칭: `/reset`, `/new`

**사용 조건**: 새 작업 시작 전 컨텍스트 정리

---

### 6. `/compact`

| 항목 | 내용 |
|------|------|
| **목표** | 현재 대화 컨텍스트를 요약·압축하여 토큰 공간 확보 |

**수행 내용**

- 이전 대화 내용을 구조화된 요약으로 대체
- 진행 중인 작업 상태·파일 목록·핵심 결정 사항 보존
- 컨텍스트 한도 초과 전 자동 또는 수동 호출

**사용 조건**: 긴 세션 중 컨텍스트 한도 임박 시

---

### 7. `/usage`

| 항목 | 내용 |
|------|------|
| **목표** | 세션 비용·플랜 사용량·활동 통계 표시 |
| **별칭** | `/cost`, `/stats` |

**수행 내용**

- 세션 누적 비용($) 및 입력·출력·캐시 토큰 수 표시
- 플랜 사용량 한도 대비 현황 표시
- Pro·Max·Team·Enterprise 플랜: 스킬·서브에이전트·플러그인·MCP 서버별 사용량 상세 분류
- `/stats` 호출 시 Stats 탭으로 바로 열림

**사용 조건**: 비용 모니터링, 토큰 예산 관리, 플랜 한도 확인

---

### 8. `/config`

| 항목 | 내용 |
|------|------|
| **목표** | 설정(Settings) 인터페이스를 열어 환경 설정 조회·변경 |
| **별칭** | `/settings` |

**수행 내용**

- 테마(Theme) 변경
- 모델 선택(claude-opus-4-8 / claude-sonnet-4-6 등)
- 출력 스타일(Output style)·에디터 모드 등 기타 환경 설정
- (도구 허용/거부 권한은 `/permissions`, 로그인·계정 자격은 `/login`으로 별도 관리)

**Desktop 지원**: ❌ CLI 전용 — 인터랙티브 터미널 패널 필요. Desktop App은 Settings UI(⚙️) 사용.

---

### 9. `/permissions`

| 항목 | 내용 |
|------|------|
| **목표** | 도구 권한의 허용(allow)·질문(ask)·거부(deny) 규칙 관리 |
| **별칭** | `/allowed-tools` |

**수행 내용**

- 파일 읽기/쓰기·Bash 실행·MCP 서버 도구별 allow/ask/deny 규칙 설정
- 작업 디렉토리(Working directory) 관리
- 스코프(프로젝트/사용자/로컬)별 규칙 조회·추가·삭제

**Desktop 지원**: ❌ CLI 전용 — 인터랙티브 터미널 패널 필요. Desktop App은 Settings UI의 Permissions 메뉴 사용.

---

### 10. `/doctor`

| 항목 | 내용 |
|------|------|
| **목표** | Claude Code 환경 상태 진단 |

**수행 내용**

- Claude Code 버전 확인
- API 키 유효성 검증
- MCP 서버 연결 상태 점검
- 필수 의존성(Node.js 등) 설치 여부 확인
- 문제 발견 시 해결 방법 안내

**Desktop 지원**: ❌ CLI 전용 — 인터랙티브 터미널 패널 필요. 설치 직후 또는 오작동 발생 시 CLI에서 실행.

---

### 11. `/hooks`

| 항목 | 내용 |
|------|------|
| **목표** | 도구 호출 이벤트에 반응하는 훅(Hook) 쉘 명령 설정 |

**수행 내용**

- 이벤트 유형 설정: `PreToolUse` / `PostToolUse` / `UserPromptSubmit` 등
- 각 이벤트 발생 시 실행할 쉘 명령 등록
- 훅 실행 결과로 도구 허용·차단·입력 수정 가능

**활용 예시**

- 특정 디렉토리 파일 수정 전 백업 자동 실행
- 코드 변경 후 린터 자동 실행
- 보안 민감 파일 접근 시 알림 발송

**Desktop 지원**: ❌ CLI 전용 — 인터랙티브 터미널 패널 필요. hooks 설정은 `~/.claude/settings.json` 직접 편집으로 대체 가능.

---

### 12. `/fast`

| 항목 | 내용 |
|------|------|
| **목표** | 빠른 출력 모드(Fast Mode) 토글 |

**수행 내용**

- 활성화: Claude Opus 모델을 더 빠른 출력 속도로 실행
- 소형 모델로 다운그레이드하지 않음(동일 모델, 응답 속도 향상)
- 재호출 시 일반 모드로 복귀

**사용 조건**: 응답 속도가 중요한 반복 작업 또는 빠른 탐색 작업

---

### 13. `/loop`

| 항목 | 내용 |
|------|------|
| **목표** | 세션을 유지한 채 프롬프트를 반복 실행하는 루프 |
| **유형** | Claude Code 번들 스킬 (Bundled Skill) |
| **구문** | `/loop [interval] [prompt]` — 별칭 `/proactive` |

**수행 내용**

- 사용자가 제시한 프롬프트(또는 슬래시 명령)를 인터벌마다 반복 실행 (예: `/loop 5m 배포 완료 확인`)
- 인터벌 생략 시 Claude가 이터레이션 간 속도를 자율 조절(self-pace)
- 인터벌 자율 조정 시 내부적으로 `ScheduleWakeup` 도구 사용(60~3,600초로 클램프)
- 프롬프트 생략 시 `.claude/loop.md` 또는 자율 유지보수 점검 실행

**활용 예시**

- 긴 마이그레이션 작업을 이터레이션 단위로 분할 처리
- CI 결과 감시 후 수정 반복
- 코드베이스 전체 리팩터링 자율 수행

---

### 14. `/schedule`

| 항목 | 내용 |
|------|------|
| **목표** | cron 스케줄로 실행되는 클라우드 루틴(Routine) 생성·수정·조회·실행 |
| **별칭** | `/routines` |

**수행 내용**

- Anthropic 관리형 클라우드 인프라에서 자동 실행되는 루틴(예약 클라우드 에이전트) 생성
- 정기(cron) 실행 또는 1회성 예약 모두 지원
- Claude가 대화형으로 스케줄·작업 내용 설정을 안내
- GitHub 미연결 시 `/web-setup`을 자동으로 안내

**사용 조건**: "매일 아침 점검", 정기 리포트 등 반복 클라우드 자동화가 필요할 때

> 참고: `/loop`의 로컬 인터벌 재호출에 쓰이는 `ScheduleWakeup` 도구와는 별개임.  
> `/schedule`은 클라우드에서 독립 실행되는 루틴을 관리함.

---

### 15. `/workflows`

| 항목 | 내용 |
|------|------|
| **목표** | 실행 중인 멀티에이전트 워크플로우 현황 모니터링 |

**수행 내용**

- 현재 실행 중·완료된 워크플로우 목록 표시
- 단계(Phase)별 진행 상태·에이전트 수·토큰 소모 현황 확인
- 실행 중·완료 워크플로우의 감시(watch)·일시중지(pause)·재개(resume)·저장(save) 조작

**사용 조건**: `/code-review ultra` 또는 `Workflow` 도구 실행 후 진행 상황 확인

---

### 16. `/review`

| 항목 | 내용 |
|------|------|
| **목표(Goal)** | Review pull request — PR을 로컬 세션에서 직접 리뷰 |
| **유형** | Claude Code 내장 명령 (Built-in command) |

**수행 내용**

- 현재 브랜치의 PR을 로컬에서 불러와 코드 변경사항 검토
- PR 번호를 인수로 지정 가능: `/review 123`
- 인수 없이 실행 시 현재 브랜치의 열린 PR 자동 감지
- 코드 정확성·버그·품질 관점 리뷰 후 피드백 제공
- 더 깊은 클라우드 기반 리뷰가 필요하면 `/code-review ultra` 사용

**`/code-review`와 차이**

| 구분 | `/review` | `/code-review` |
|------|-----------|----------------|
| 대상 | PR 단위 | 현재 브랜치 diff |
| 수정 적용 | 없음 (리뷰만) | `--fix` 옵션으로 자동 수정 가능 |
| 클라우드 확장 | 없음 | `ultra` 옵션으로 멀티에이전트 가능 |

**Desktop 지원**: ✅ CLI·Desktop 모두 사용 가능  
**사용 조건**: PR 머지 전 로컬 리뷰, `gh` CLI 설치·인증 필요

---

### 17. `/goal`

| 항목 | 내용 |
|------|------|
| **목표(Goal)** | Set a goal — 완료 조건을 선언하면 충족될 때까지 Claude가 턴을 넘어 작업을 지속 |
| **구문** | `/goal [condition\|clear]` |

**수행 내용**

- 완료 조건(condition)을 선언하면 Claude가 조건이 충족될 때까지 여러 턴에 걸쳐 자율적으로 작업을 이어감
- 인수 없이 실행 시 현재(또는 가장 최근 달성한) 목표를 표시
- `clear`/`stop`/`off`/`reset`/`none`/`cancel` 중 하나로 활성 목표를 조기 해제

**활용 예시**

- `/goal 강의계획서 Excel 완성` 선언 후 build.py 작성·디버그·검증까지 조건 충족 시점까지 자동 진행
- 긴 다단계 작업에서 목표 이탈 방지

**사용 조건**: 완료 조건이 명확한 복잡한 다단계 작업을 자율 진행시키고 싶을 때

---

### 18. `/remote-control`

| 항목 | 내용 |
|------|------|
| **목표(Goal)** | Enable remote control — 현재 CLI 세션을 claude.ai 웹에서 원격으로 제어 가능하도록 활성화 |

**수행 내용**

- 현재 로컬 CLI 세션을 `claude.ai/code` 웹 인터페이스와 연결
- 연결 후 브라우저(claude.ai)에서 동일 세션에 메시지 전송·작업 지시 가능
- `/color` 명령 사용 시 세션 색상이 claude.ai/code에도 동기화
- 별칭: `/rc`

**활용 예시**

- 터미널이 없는 환경(모바일·태블릿)에서 브라우저로 로컬 Claude Code 세션 제어
- 원격 서버의 Claude Code 세션을 브라우저에서 모니터링·지시

**Desktop 지원**: ✅ CLI·Desktop 모두 사용 가능  
**출처**: [code.claude.com/docs/en/remote-control](https://code.claude.com/docs/en/remote-control)

---

## 본 문서에 미수록된 주요 내장 명령 (요약)

> 위 18종 외에도 부트캠프에서 자주 쓰는 내장 명령이 있음. 전체 목록은 공식 레퍼런스 참조.

| 명령 | 용도 |
|------|------|
| `/model [model]` | 사용할 모델 전환 및 기본값 저장 |
| `/agents` | 서브에이전트(subagent) 구성 관리 |
| `/mcp` | MCP 서버 연결·OAuth 인증 관리 |
| `/memory` | `CLAUDE.md` 메모리 파일 편집, 자동 메모리 관리 |
| `/context [all]` | 현재 컨텍스트 사용량 시각화 |
| `/plan [description]` | 플랜 모드 진입 |
| `/resume [session]` | 이전 대화 재개 (별칭 `/continue`) |
| `/rewind` | 대화·코드를 이전 체크포인트로 되돌림 (별칭 `/checkpoint`, `/undo`) |
| `/diff` | 미커밋 변경사항·턴별 diff 뷰어 |
| `/add-dir <path>` | 세션에 작업 디렉토리 추가 |
| `/effort [level]` | 모델 추론 강도(effort) 설정 |

---

## 내장 스킬 vs. 플러그인 커스텀 스킬 비교

| 구분 | 내장 스킬 | 플러그인 커스텀 스킬 |
|------|-----------|----------------------|
| **정의 위치** | Claude Code 바이너리 내장 | `skills/{name}/SKILL.md` 파일 |
| **설치** | 별도 설치 불필요 | 플러그인 설치 필요 |
| **호출 방법** | `/명령어` | `/<플러그인>:<스킬명>` |
| **커스터마이징** | 불가 | SKILL.md 수정으로 자유 수정 |
| **예시** | `/security-review`, `/init` | `/courseware:generate-curriculum` |

---

## ICTK 부트캠프 활용 가이드

| 회차 | 활용 내장 스킬 | 학습 목적 |
|------|----------------|-----------|
| 1회차 | `/init`, `/help` | 프로젝트 환경 세팅, 기본 명령 탐색 |
| 3회차 | `/cost` | 토큰 사용량·비용 모니터링 실습 |
| 5회차 | `/code-review` | 생성 코드 품질 검토 |
| 7회차 | `/security-review` | 업무 자동화 스크립트 보안 점검 |
| 9~11회차 | `/workflows`, `/loop` | 멀티에이전트 워크플로우 모니터링 |

---

*본 문서는 Claude Code 공식 명령 레퍼런스([code.claude.com/docs/en/commands](https://code.claude.com/docs/en/commands), 2026-06 확인) 기준.*  
*Claude Code CLI(현재 2.1.x) 업데이트에 따라 명령이 추가·변경될 수 있음.*
