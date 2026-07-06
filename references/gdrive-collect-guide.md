# 구글 드라이브 제출물 수집 가이드 (gdrive-collect-guide)

## 0. 개요

공유 드라이브의 **사용자별 폴더**를 빠짐없이 순회하여 제출 파일을 찾아 읽고, 과제별로 정규화된  
**수집 매니페스트**로 정리하기 위한 표준 절차임. 숙제 평가·제출물 취합 등 "사용자 폴더 → 파일 수집"  
작업의 공용 참고 문서로 사용함.  
본 가이드의 쿼리·동작은 실제 과제 폴더(수강생 26명)에서 검증한 결과를 기준으로 기술함.

**핵심 원리**: Google Drive MCP `search_files`의 **`parentId = '{folderId}'` 쿼리**로 폴더 트리를  
계층적으로 내려가며 탐색함. 키워드(`fullText`) 검색은 누락·오매칭이 많으므로 폴더 순회를 우선함.

---

## 1. 전제조건

- **Google Drive MCP 연결**: 도구 `search_files` / `get_file_metadata` / `read_file_content` /
  `download_file_content` / `get_file_permissions` 사용 가능 상태  
  - 미연결 시 claude.ai 커넥터 설정 또는 `claude mcp`(대화형 세션)에서 인증 필요
- **접근 권한**: 대상 공유 폴더가 MCP 인증 계정에 공유되어 있어야 함(뷰어 이상)  
  - 권한 없으면 `search_files`가 빈 결과를 반환하므로, 빈 결과 시 미제출과 권한오류를 구분할 것
- **루트 폴더 ID 확보**: 공유 URL `https://drive.google.com/drive/folders/{FOLDER_ID}`에서 `{FOLDER_ID}` 추출  
  - 예: `.../folders/1ILB3sAfU4A5I3tB0tOMZ5EqMhvHAg3Z5` → ID = `1ILB3sAfU4A5I3tB0tOMZ5EqMhvHAg3Z5`

---

## 2. 수집 절차

### 2.1 사용자 폴더 목록화 (1단계)

루트 폴더 바로 아래의 **하위 폴더 = 사용자 1명**으로 간주하고 전원 목록화함.

```text
search_files(
  query: "parentId = '{ROOT_FOLDER_ID}' and mimeType = 'application/vnd.google-apps.folder'",
  pageSize: 100,
  excludeContentSnippets: true
)
```

- 반환 각 항목의 `title`(사용자명), `id`(폴더 ID), `owner`(제출 계정 이메일)를 사용자 명부로 기록함
- **루트 직속 파일도 점검**: 일부 사용자는 개인 폴더 없이 루트에 직접 업로드함  
  - `query: "parentId = '{ROOT_FOLDER_ID}' and mimeType != 'application/vnd.google-apps.folder'"`로 확인
- **페이지네이션**: 응답에 `next_page_token`이 있으면 `pageToken`으로 다음 페이지를 끝까지 수집함  
  (인원 100명 초과 등 대규모 시 필수. 빈 응답이 종료 신호)

### 2.2 사용자 폴더 재귀 탐색 (2단계)

**폴더 구조는 사용자마다 제각각**임(2.5 실측 편차 참조). 평면 파일·과제별 하위폴더·다단계 중첩이  
섞여 있으므로 반드시 **재귀(BFS/DFS)로 하위 폴더를 끝까지** 내려가며 파일을 수집함.

```text
# 각 사용자 폴더에 대해
search_files(query: "parentId = '{USER_FOLDER_ID}'", pageSize: 100, excludeContentSnippets: true)
# 반환 항목 중 mimeType == 'application/vnd.google-apps.folder' 인 것은 큐에 넣어 재귀 탐색
```

- **최대 깊이 3~4단계** 권장(예: `사용자 / 1. summary / prompts / *.txt`)  
- **노이즈 폴더 처리**: `output`·`outputs`·`resources`·`.git` 등은 제출 프롬프트가 아닌 산출물/부속물이므로  
  - 원칙: 탐색하되 그 안의 파일은 "프롬프트 후보"에서 제외하고 "참고(산출물)"로만 분류  
  - 단, 사용자가 프롬프트를 산출물 폴더에 잘못 넣었을 수 있으므로 파일명·내용으로 최종 판별
- **무한루프 방지**: 방문한 폴더 ID를 집합으로 관리하여 재방문 차단, 방문 폴더 수 상한 설정

### 2.3 파일 분류 (3단계)

수집된 파일을 3종으로 분류함.

| 분류 | 판별 기준 | 처리 |
|------|----------|------|
| 프롬프트(제출물) | `.txt`/`.md`/문서형이며 프롬프트 내용(섹션/페르소나/지시문) 포함 | 평가 대상 |
| 설정/부속 | `AGENTS.md`·`CLAUDE.md`·`README`·`resources/` 내 자료 | 참고용, 평가 제외 |
| 산출물(결과) | `output(s)/` 하위, 실행 결과 문서 | 참고용, 평가 제외 |

- `AGENTS.md`/`CLAUDE.md`는 팀 구성 정의 파일임 — 제출 프롬프트로 오인하지 말 것  
  (단, 과제 성격상 팀 정의 자체가 제출물인 경우는 별도 판단)

### 2.4 파일 내용 읽기 (4단계)

```text
read_file_content(fileId: '{FILE_ID}')          # 자연어 텍스트 표현(권장, 파싱 쉬움)
download_file_content(fileId, exportMimeType)    # 원본 바이트(base64). read 미지원 형식 폴백
```

- **지원 형식(실측)**: `text/plain`·`text/markdown`은 공식 지원 목록에 없으나 `read_file_content`로  
  **정상 판독됨**. 이 외 Google Docs/Sheets/Slides, PDF, DOC(X)/XLS(X)/PPT(X), ODF, PNG/JPG 지원
- **이스케이프 주의**: `read_file_content`는 마크다운 특수문자를 백슬래시로 이스케이프하여 반환함  
  (`\#`, `\-`, `\[`, `` \`\`\` ``). 섹션 존재 판정 시 `\[목표\]`와 `[목표]`를 **동일 취급**(이스케이프 제거 후 비교)
- **대용량 파일**: 매우 큰 파일은 내용이 잘릴 수 있음 — 판정에 필요한 앞부분 확보 여부 확인
- **읽기 실패**: `read_file_content` 실패 형식은 `download_file_content`로 원본을 받아 처리  
  (Google 네이티브 형식은 `exportMimeType` 지정 필수, 예: `text/plain`)

### 2.5 과제 매핑 (5단계)

각 프롬프트 파일을 **과제 종류로 매핑**함. 파일명 우선, 모호하면 내용으로 확정함.

| 과제 | 파일명 키워드(예) | 내용 키워드(예) |
|------|------------------|-----------------|
| 요약 | `summary`, `요약`, `doc-summary`, `summarizer` | "3줄 요약", "핵심 요약", "TL;DR" |
| 회의록 | `meeting`, `minutes`, `회의록` | "결정 사항", "Action", "안건" |
| 시장조사 | `market`, `research`, `시장조사` | "시장 규모", "경쟁사", "동향" |
| 추가(본인업무) | 위 3종에 해당하지 않는 개인 업무 프롬프트 | 본인 도메인·업무 맥락 |

- 파일명은 표기 편차가 큼(`3-market-research-persona.txt`, `3. market-research`, `시장조사.txt` 등)  
  → 정규화(소문자화·구분자 제거·번호 접두 제거) 후 키워드 매칭
- 매핑 실패·중복(같은 과제 2개)·과잉(4개 초과) 항목은 매니페스트에 그대로 표시하고 임의 배정 금지

### 2.6 수집 매니페스트 작성 (6단계)

평가 이전에 **"누가 무엇을 냈는가"를 정규화한 표**를 먼저 산출함. 이 표가 이후 평가·부정탐지의 입력임.

```text
| 사용자명 | 소유자(이메일) | 요약 | 회의록 | 시장조사 | 추가과제 | 제출수 | 비고(구조/노이즈) |
|----------|----------------|------|--------|----------|----------|--------|--------------------|
| 홍길동   | hong@x.com     | ✅   | ✅     | ✅       | ✅       | 4/4    | 평면(txt)          |
| 김철수   | kim@x.com      | ✅   | ✅     | ✅       | ⛔       | 3/4    | 과제별 하위폴더    |
| 이영희   | lee@x.com      | ⛔   | ⛔     | ⛔       | ⛔       | 0/4    | 빈 폴더(미제출)    |
```

- 각 셀에는 판정 근거로 활용하도록 `fileId`와 `modifiedTime`을 함께 보관(별도 상세표 또는 주석)

---

## 3. 엣지 케이스 처리

| 케이스 | 증상 | 처리 |
|--------|------|------|
| 빈 폴더 | 폴더는 있으나 파일 0개 | "미제출"로 기록. 권한오류와 구분 |
| 권한 없음 | 접근 불가로 빈 결과 | 강사에게 공유 요청 필요로 표시(미제출로 단정 금지) |
| 다단계 중첩 | 프롬프트가 3~4단계 하위에 존재 | 재귀 탐색으로 도달, 노이즈 폴더 구분 |
| 산출물 혼입 | `output/`에 결과물 다수 | 산출물로 분류, 평가 제외 |
| 이름 표기 변형 | 폴더명 공백·번호·영문 혼재 | 정규화 후 매핑, 원문도 보존 |
| 중복 폴더 | 동일인 폴더 2개 | 최신 `modifiedTime` 우선, 둘 다 비고에 기록 |
| 루트 직속 제출 | 개인 폴더 없이 루트 업로드 | 2.1의 루트 직속 파일 점검으로 포착 |
| 대규모 인원 | 100명 초과 | `next_page_token` 페이지네이션 필수 |

---

## 4. MCP 도구 레퍼런스 (검증된 쿼리)

| 목적 | 호출 |
|------|------|
| 하위 폴더 목록 | `search_files(query: "parentId = '{ID}' and mimeType = 'application/vnd.google-apps.folder'")` |
| 폴더 내 전체 항목 | `search_files(query: "parentId = '{ID}'")` |
| 루트 직속 파일 | `search_files(query: "parentId = '{ID}' and mimeType != 'application/vnd.google-apps.folder'")` |
| 파일 메타데이터 | `get_file_metadata(fileId: '{ID}')` |
| 내용 판독(자연어) | `read_file_content(fileId: '{ID}')` |
| 원본 다운로드(폴백) | `download_file_content(fileId: '{ID}', exportMimeType: 'text/plain')` |
| 공유 권한 확인 | `get_file_permissions(fileId: '{ID}')` |

**메타데이터 제공 필드(실측)**: `id`·`title`·`mimeType`·`fileExtension`·`fileSize`·`owner`·  
`createdTime`·`modifiedTime`·`parentId`·`viewUrl`. 이 중 `owner`·`createdTime`·`modifiedTime`은  
부정제출 탐지의 메타데이터 신호로 활용함(제출물 평가 프롬프트 참조).

---

## 5. 실측 구조 편차 (참고 — 동일 과제, 다른 폴더 구조)

수강생 26명 폴더 표본 조사 결과, 아래처럼 구조가 크게 다름 — 평면 가정은 실패함.

| 사용자 | 관찰된 구조 | 파일 형식 |
|--------|-------------|-----------|
| A | 개인폴더 아래 평면 파일 3개(`doc-summary.md` 등) | `text/markdown` |
| B | 개인폴더 아래 `1. summary`·`2. meeting-minutes`·`3. market-research` 하위폴더, 그 안에 다시 `prompts`/`outputs`/`resources` 중첩 | 다단계 |
| C | 개인폴더 아래 파일 3개 + `output` 폴더(결과물) | `text/plain` |
| D | 개인폴더만 있고 파일 0개 | 미제출 |

→ 결론: (1) 재귀 탐색 필수, (2) 노이즈 폴더·산출물 분류 필수, (3) 형식·이름 정규화 필수,  
(4) 빈 폴더=미제출 처리, (5) 최종 매핑은 파일명+내용 병행.

---

## 6. 완료 체크리스트

- [ ] 루트 하위 사용자 폴더 전원 + 루트 직속 파일까지 목록화(페이지네이션 종료 확인)
- [ ] 각 사용자 폴더를 재귀 탐색하여 다단계 중첩 파일까지 수집
- [ ] 프롬프트/설정/산출물 3분류 완료, 노이즈 제외
- [ ] 각 파일 내용 판독 성공(이스케이프 정규화 반영), 실패분은 폴백 처리
- [ ] 과제 매핑 완료, 매핑 실패·중복·미제출 명시
- [ ] 수집 매니페스트 표 산출(각 셀에 fileId·modifiedTime 근거 보관)
