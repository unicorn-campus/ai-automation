# Daily 감사 로그 대시보드 생성 프롬프트

> Claude Code 루틴으로 실행. 매일 당일 감사 로그를 수집하여 Cowork 라이브 아티팩트 대시보드를 갱신함.

---

```
[목표]
unicorn 감사 서버에서 당일(KST 기준) Claude Code 사용 로그를 수집하여  
사용자별·시간대별·이벤트별 통계를 담은 HTML 대시보드를 Cowork 라이브 아티팩트로 생성·갱신함

[역할]
당신은 운영 로그 분석과 데이터 시각화에 5년 이상 경험을 가진 DevOps 엔지니어입니다.

[맥락]
- 내 상황: unicorn 조직에서 Claude Code 일일 사용 현황을 매일 모니터링하는 체계 필요.  
  관리자 콘솔만으로는 사용자별·시간대별 세부 통계 확인 불가.
- 결과물 독자: 조직 IT 관리자 및 팀 리더 (기술 수준 보통)
- 실행 환경: Claude Code 루틴 (`/schedule` — daily 자동 실행)

[입력정보]
- 감사 서버 API: https://unicorn-audit.fly.dev/api/audit
- 인증 헤더: X-API-Key (환경변수 AUDIT_API_KEY 참조)
- 지원 쿼리 파라미터: from, to (ISO 8601), limit (최대 500), offset
- 아티팩트 URL 저장 파일: `audit-server/dashboard-artifact.url`  
  (최초 실행 시 신규 생성, 이후 동일 URL 재배포에 사용)

[작업방법]
1. 당일 날짜 범위 계산 (KST = UTC+9)
   - from: {YYYY-MM-DD}T00:00:00+09:00
   - to:   {YYYY-MM-DD}T23:59:59+09:00
   - Bash로 계산: `date -u -d "+9 hours" "+%Y-%m-%d"` (Linux/Mac)  
     PowerShell: `(Get-Date).ToUniversalTime().AddHours(9).ToString("yyyy-MM-dd")`

2. 감사 로그 전체 수집 (페이징)
   - limit=500, offset=0 부터 시작
   - 응답 `total > collected` 이면 offset += 500 반복
   - Bash 예시:
     ```bash
     curl -s "https://unicorn-audit.fly.dev/api/audit?from={from}&to={to}&limit=500" \
       -H "X-API-Key: $AUDIT_API_KEY"
     ```

3. 수집 데이터 집계 (JavaScript 또는 Bash/Python)
   - 총 이벤트 수: UserPromptSubmit / SessionStart 분리 집계
   - 활성 사용자 수: user_email distinct 카운트
   - 사용자별 프롬프트 횟수: 상위 10명 정렬
   - 시간대별 이벤트 수: 0~23시, KST 변환 후 집계
   - 기기별(machine_name) 분포: 상위 5개

4. 아티팩트 URL 확인
   - `audit-server/dashboard-artifact.url` 파일 존재 여부 확인
   - 있으면 URL 읽어서 Artifact 도구의 `url` 파라미터로 전달 (기존 URL 재배포)
   - 없으면 신규 생성 후 URL을 해당 파일에 저장

5. HTML 대시보드 생성 — 완전 자급적(self-contained), 외부 CDN 사용 금지
   - CSS: 인라인 스타일로 전체 포함
   - 차트: 순수 SVG로 구현 (외부 라이브러리 불가)
     - 시간대별 막대 그래프 (SVG `<rect>`)
     - 사용자별 수평 막대 그래프 (SVG `<rect>`)
   - 구성 요소:
     a) 헤더: "Claude Code Audit Dashboard — {YYYY-MM-DD} (KST)"
     b) KPI 카드 4개:
        - 총 이벤트 수
        - 활성 사용자 수
        - 최다 사용자 (user_email + 횟수)
        - 피크 시간 (KST 기준, 가장 많은 시간대)
     c) 시간대별 이벤트 SVG 막대 그래프 (0~23시)
     d) 사용자별 프롬프트 횟수 SVG 수평 막대 그래프 (상위 10명)
     e) 최근 프롬프트 10건 테이블
        - 컬럼: 사용자, 이벤트, 시각(KST), 프롬프트(앞 60자)
   - 디자인: 어두운 배경(#0f172a), 카드 방식, 파란색 계열 강조색
   - 페이지 하단: "마지막 갱신: {실행 시각 KST}"

6. Artifact 도구 호출
   - HTML을 `{스크래치패드}/dashboard.html`에 저장 후 Artifact 도구 실행
   - `favicon`: "📊"
   - `label`: "{YYYY-MM-DD} 일일 감사 대시보드"

7. 결과 콘솔 출력
   - 수집 완료: {total}건 / 활성 사용자 {n}명
   - 대시보드 URL: {artifact_url}

- 작성 규칙:
  - HTML 파일은 모든 CSS/JS 인라인 포함, `<title>` 태그 포함
  - 한국어 레이블 사용 (예: "총 이벤트", "활성 사용자")
  - prompt_text는 앞 60자만 표시 (개인정보 최소화)

[출력]
- Cowork 라이브 아티팩트 URL (claude.ai Artifact로 공유 가능한 HTML 대시보드)
- 콘솔 출력: 수집 건수 / 활성 사용자 수 / 아티팩트 URL

[제약조건]
- MUST:
  - KST 기준 당일 데이터만 수집 (from/to 파라미터 필수 — 누락 시 전체 로그 조회됨)
  - API 키를 환경변수 AUDIT_API_KEY로 참조 (프롬프트/코드에 값 하드코딩 금지)
  - HTML 아티팩트는 self-contained — 외부 CDN 불가 (CSP 차단)
  - `audit-server/dashboard-artifact.url` 파일에 URL 저장하여 매일 동일 URL 재배포
- MUST NOT:
  - limit=500 초과 단건 요청 금지 (offset 페이징 사용)
  - prompt_text 전문 노출 금지 (앞 60자 자름)
  - 신규 아티팩트를 매 실행마다 생성하지 않음 (URL 파일 확인 후 재배포)
- 완료조건:
  - API 호출 HTTP 200 응답 및 수집 건수 콘솔 확인
  - Artifact 도구가 URL 반환 확인
  - 해당 URL로 브라우저 접근 시 KPI 카드·차트·테이블 정상 렌더링 확인

[예시]
(콘솔 출력 예시)
수집 완료: 47건 / 활성 사용자 5명
대시보드 URL: https://claude.ai/artifacts/abc123def456

(KPI 카드 예시)
┌──────────────┬──────────────┬──────────────────┬──────────┐
│ 총 이벤트 47  │ 활성 사용자 5 │ 최다: hiond (23) │ 피크: 14시│
└──────────────┴──────────────┴──────────────────┴──────────┘

(최근 프롬프트 테이블 예시)
| 사용자 | 이벤트           | 시각 (KST)        | 프롬프트 앞 60자              |
|--------|------------------|-------------------|-------------------------------|
| hiond  | UserPromptSubmit | 2026-06-21 14:32  | "audit 서버 아키텍처 그림 만들..."  |
| jlee   | SessionStart     | 2026-06-21 09:15  | (없음)                        |
```

---

## 루틴 등록 방법

```bash
# Claude Code 루틴으로 등록 (daily 실행)
/schedule 0 9 * * * AUDIT_API_KEY=c1a72c28c9aed0f0bc156dc2c4a0df79392c40a32a48c61a 위 프롬프트 실행
```

> **참고**: `/schedule` 스킬 또는 `/schedule` 명령어로 cron 표현식과 함께 등록.  
> 환경변수 `AUDIT_API_KEY`는 루틴 실행 시 주입 (settings.json의 `env` 섹션에 등록 권장).

## 관련 파일

| 파일 | 설명 |
|------|------|
| `audit-server/src/routes/audit.js` | GET `/api/audit` — from/to/limit/offset 파라미터 지원 |
| `audit-server/dashboard-artifact.url` | 생성된 아티팩트 URL 저장 (루틴이 자동 생성) |
| `prompts/6회차/audit-server/managed-settings.json` | Hook 설정 JSON |
