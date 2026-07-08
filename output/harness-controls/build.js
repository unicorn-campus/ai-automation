/*
 * 하네스 적용 방안 PPT 빌드 스크립트 (비용·성능·보안 3장)
 * - ppt-guide.md 6절 규칙 준수
 * - 사용자 요청에 따라 최소 폰트 14pt 강제 (fs14)
 * - 첨부 이미지 포맷: 상단 제목 → 핵심 관점 → 3개 위험유형 컬럼(해결책/Skill예시/Agent예시/△) → 설계 포인트 → 제외(❌) → 범례
 */
const pptxgen = require("C:/Users/hiond/.claude/plugins/cache/courseware/courseware/1.0.2/node_modules/pptxgenjs");

const FONT = "Pretendard";
const MIN_FONT = 14; // 사용자 요청으로 12 → 14 상향
const fs14 = (size) => {
  if (size < MIN_FONT) throw new Error(`fontSize ${size} < ${MIN_FONT}pt 금지! 슬라이드를 분리하거나 텍스트를 압축할 것`);
  return size;
};

// 색상
const C = {
  ink: "2C2926", body: "505060", sub: "59636E", meta: "6B6B7B",
  green: "059669", teal: "0D9488", amber: "D97706", red: "B91C1C", gray: "9CA3AF",
  cardBg: "FFFFFF", cardBorder: "DDDDE0", insightBg: "CCFBF1", panelBg: "F5F5F7", divider: "E2E8F0",
  catA: "3776AB", catB: "1A6E36", catC: "C0530A", catD: "1A5E7E", catE: "8B1A1A",
};

// ── 슬라이드 데이터 ───────────────────────────────────────────────
const SLIDES = [
  {
    eyebrow: "비용 · Cost 하네스 적용 방안",
    title: "무한 루프·토큰 누수·Agent 폭주를 호출 시점마다 한도·중단 규칙으로 자동 차단한다",
    insight: "Cost 리스크는 실행이 길어지거나, 컨텍스트가 비대해지거나, Agent 호출이 통제되지 않을 때 커짐. 하네스는 호출·완료 시점에서 규칙으로 자동 강제(✓)하되, 생성 도중 제어가 필요한 항목(△)은 보완 관행과 함께 설계함.",
    columns: [
      {
        no: "①", name: "무한 루프", sub: "실행이 끝나지 않아 과금 누적", color: C.catA,
        solvedLabel: "✓ 해결책",
        solved: [
          "최대 반복 횟수 (Stop 완료 게이트)",
          "반복 패턴 감지 (PreToolUse deny)",
          "부분 결과 반환 (Stop: 미완 시 block)",
        ],
        skill: "웹 검색 Skill — 재시도 2회 제한, 같은 쿼리 반복 시 즉시 종료·마지막 성공 결과 반환.",
        agent: "리서치 Agent — 계획→검색→요약 루프 3회 제한, 반복 시 Stop 게이트가 중단·요약 보존.",
        partialNone: true,
      },
      {
        no: "②", name: "토큰 누수", sub: "컨텍스트 비대화로 토큰 과금 증가", color: C.catB,
        solvedLabel: "✓ 해결책",
        solved: [
          "입력 절삭 (PreToolUse updatedInput)",
          "핸드오프 요약 전달 (최종 요약만 반환)",
          "요청별 사용량 측정 (PostToolUse usage)",
        ],
        skill: "문서 요약 Skill — 핵심 단락만 입력, 결과는 5줄 요약+핵심 키워드만 반환.",
        agent: "상담 Agent — 요약 메모리만 다음 단계로 전달, 요청별 토큰 기록·모니터링.",
        partialCaption: "",
        partial: [
          "이력 요약 (PreCompact 보존·아카이브, 품질 강제 불가) → 보완: 요약 프롬프트 품질관리",
        ],
      },
      {
        no: "③", name: "Agent 폭주", sub: "Agent 호출 미통제로 비용 급증", color: C.catC,
        solvedLabel: "✓ 해결책",
        solved: [
          "호출 수 제한 (카운터 + 상한 초과 시 PreToolUse deny)",
        ],
        skill: "번역 Skill — 외부 API 1회·병렬 2개 제한, 카운터 초과 시 PreToolUse deny.",
        agent: "여행 Agent — 하위 Agent 도구 미부여로 깊이 제한, 폭주 시 Kill-switch로 차단.",
        partialCaption: "호출 경계만 가능, 생성 중 절단 불가",
        partial: [
          "Budget 한도 → 보완: 예산 대시보드·알람",
          "Kill-switch → 보완: 운영자 수동 중단",
          "동시 실행 제한 → 보완: 오케스트레이션 큐",
          "깊이 제한 → 보완: Agent 깊이 명시 설계",
        ],
      },
    ],
    design: [
      "Skill 설계 = 입력·출력·토큰·재시도 한도를 명확히 정의 (PreToolUse/Stop 게이트)",
      "Agent 설계 = 예산·호출 수·중단 조건·로그를 함께 설계 (PostToolUse 적재 + PreToolUse deny)",
      "운영 원칙 = 비용은 사후 정산이 아니라 호출 시점마다 규칙으로 자동 차단, 생성 중은 SDK·운영 보완",
    ],
    excluded: "단계별 타임아웃·컨텍스트 하드캡 (wall-clock 타임아웃·런타임 자동 압축 — SDK/워치독 영역)",
    notes:
      "[강사 메모] 슬라이드 △ 항목은 압축본임. △는 '하네스가 막아준다'가 아니라 '호출 경계에서만 근사 통제'이며 생성 중 토큰 절단은 불가함을 반드시 구두로 못박을 것. 수강생이 △를 ✓로 오인하면 잘못된 안전감이 생김.\n" +
      "· 이력 요약: PreCompact로 압축 직전 핵심 이력 보존·아카이브는 가능하나 요약 품질 강제는 불가(soft) → 보완: 요약 프롬프트 품질 관리\n" +
      "· Budget 한도: 누적 토큰 적재 후 초과 시 후속 호출만 deny, 생성 중 토큰 절단 불가 → 보완: 예산 대시보드·알람\n" +
      "· Kill-switch: 폭주 플래그 시 고비용 도구 일괄 deny, 진행 중 토큰 절단 불가 → 보완: 운영자 수동 중단 절차\n" +
      "· 동시 실행 제한: flock in-flight 카운터로 동시성 상한 근사만, 완전 강제 불가 → 보완: 오케스트레이션 큐\n" +
      "· 깊이 제한: 서브에이전트 tools에서 Agent 제거로 추가 스폰 차단, 임의 숫자 깊이는 런타임 고정 → 보완: Agent 설계 시 깊이 명시\n" +
      "[제외] 단계별 타임아웃·컨텍스트 하드캡은 hook 범위 밖(wall-clock·런타임 자동 압축) → SDK 타임아웃·외부 워치독으로 해결.",
  },

  {
    eyebrow: "성능 · Performance 하네스 적용 방안",
    title: "장애 전파·품질 저하·지연을 도구 실행·완료 시점의 검사로 자동 차단한다",
    insight: "성능 리스크는 실패가 연쇄될 때, 검증 없는 출력이 흐를 때, 직렬·중복 실행으로 지연될 때 커짐. 하네스는 도구 실행·완료 시점에서 실패와 품질을 차단(✓)하되, 응답 시간·전송 계층은 SDK/인프라에 위임함.",
    columns: [
      {
        no: "①", name: "장애 전파", sub: "한 단계 실패가 전체로 번져 시스템 마비", color: C.catE,
        solvedLabel: "✓ 해결책",
        solved: [
          "Circuit Breaker (PostToolUseFailure 임계 초과 시 일정시간 deny)",
        ],
        skill: "외부 API Skill — 연속 실패 임계 초과 시 일정시간 차단·캐시 결과로 대체 응답.",
        agent: "수집 Agent — 고부하 작업을 서브에이전트로 격리, 실패 시 대체 경로 지침 주입.",
        partialCaption: "",
        partial: [
          "리소스 격리 (컨텍스트 격리, 인프라 격리 불가) → 보완: 컨테이너 배포",
          "Graceful Degradation (대체 지침 주입, 내용 강제 soft) → 보완: 폴백 템플릿 표준화",
        ],
      },
      {
        no: "②", name: "품질 저하", sub: "검증 없는 잘못된 출력이 다음 단계로 전파", color: C.catD,
        solvedLabel: "✓ 해결책 (검증 게이트 3종)",
        solved: [
          "스키마 검증 (위반 시 PostToolUse/Stop block)",
          "교차 검증 (다중 검증자 비교·불일치 차단)",
          "검증 실패 차단 (근거·테스트 실패 시 block)",
        ],
        skill: "분류 Skill — 결과를 고정 JSON 스키마로 받고, 위반 시 Stop hook가 block.",
        agent: "분석 Agent — 두 검증자 비교·불일치 차단, 미검증 출력은 다음 단계로 미전달.",
        partialCaption: "",
        partial: [
          "Grounding (근거 존재 검증, 정확성 강제 soft) → 보완: 사람 사실검증·인용 검수",
        ],
      },
      {
        no: "③", name: "지연·낭비", sub: "직렬 실행·중복 조회로 응답 지연", color: C.catC,
        solvedLabel: "✓ 해결책",
        solved: [
          "병렬 실행 (독립 읽기전용 조회 readOnlyHint 병렬 호출)",
        ],
        skill: "멀티소스 Skill — 독립 읽기 작업 병렬 호출, 동일 질의는 MCP 캐시 재사용.",
        agent: "리서치 Agent — 독립 검색 병렬 수행으로 대기 단축, 잦은 조회는 캐시 우선.",
        partialCaption: "",
        partial: [
          "캐싱 (결과 캐시·재사용, 프롬프트 캐시 자동제어 불가) → 보완: 캐시 TTL·무효화 정책",
        ],
      },
    ],
    design: [
      "Skill 설계 = 출력 스키마·근거 검증 게이트를 명확히 정의 (PostToolUse/Stop block)",
      "Agent 설계 = 실패 차단·교차 검증·리소스 격리를 함께 설계 (PostToolUseFailure + 서브에이전트)",
      "운영 원칙 = 성능은 사후 튜닝이 아니라 실패·품질을 그 시점에서 즉시 차단, 타임아웃은 인프라 보완",
    ],
    excluded: "계층적 타임아웃·스트리밍 응답·Backpressure (wall-clock·전송·인프라 계층 — SDK/게이트웨이 영역)",
    notes:
      "[강사 메모] △는 경계 근사이며 한계를 명시할 것.\n" +
      "· 리소스 격리: 서브에이전트로 컨텍스트 격리는 가능하나 인프라(CPU·메모리) 격리는 불가 → 보완: 컨테이너 배포\n" +
      "· Graceful Degradation: PostToolUseFailure+additionalContext로 대체 응답 지침 주입은 가능하나 폴백 내용 강제는 soft → 보완: 폴백 응답 템플릿 표준화\n" +
      "· Grounding: 근거·출처 존재 검증은 가능하나 정확성 강제는 soft → 보완: 사람 사실검증·인용 검수\n" +
      "[제외] 계층적 타임아웃·스트리밍 응답·Backpressure는 wall-clock·전송·인프라 계층 → SDK maxTurns+외부 타임아웃·게이트웨이로 해결.",
  },

  {
    eyebrow: "보안 · Security 하네스 적용 방안",
    title: "프롬프트 인젝션·데이터 유출·권한 오남용을 입력·전송·도구 경계에서 차단한다",
    insight: "보안 리스크는 외부 입력이 에이전트를 조종할 때, 민감정보가 유출될 때, 고위험 도구가 무통제로 실행될 때 커짐. 하네스는 입력·전송·도구 경계에서 결정론적으로 차단(✓)하되, 프로세스 격리는 OS·인프라에 위임함.",
    columns: [
      {
        no: "①", name: "프롬프트 인젝션", sub: "외부 입력·문서가 에이전트 행동을 조종", color: C.catA,
        solvedLabel: "✓ 해결책",
        solved: [
          "입력 필터링 (UserPromptSubmit 악성 패턴 block)",
          "불신 데이터 표시 (외부 본문 신뢰/불신 분리·태그)",
        ],
        skill: "웹 요약 Skill — 외부 텍스트를 불신 태그로 분리, 악성 패턴은 UserPromptSubmit 차단.",
        agent: "메일 Agent — 외부 본문을 불신 컨텍스트로 표시, 명령 미해석·신뢰 지시와 분리.",
        partialCaption: "",
        partial: [
          "역할 분리 (신뢰/불신 분리·사실형 주입, 주입 저항 soft) → 보완: 시스템 프롬프트 가드·정기 레드팀",
        ],
      },
      {
        no: "②", name: "데이터 유출", sub: "민감정보가 외부로 전송·노출", color: C.catE,
        solvedLabel: "✓ 해결책",
        solved: [
          "DLP 필터 (주민·카드번호 탐지 시 PreToolUse deny)",
          "민감정보 마스킹 (전송 전·표시 전 치환)",
          "감사 로그 (PostToolUse 전수 기록)",
        ],
        skill: "전송 Skill — 전송 직전 민감정보 탐지 시 deny, 통과분 마스킹·전 호출 감사 로그.",
        agent: "응대 Agent — 외부 전송 전 DLP 차단, 허용 도메인 외 호출은 화이트리스트로 차단.",
        partialCaption: "",
        partial: [
          "네트워크 화이트리스트 (URL 외 deny, 패킷·난독화 불가) → 보완: 단일 egress MCP 경유 시 ✓ 승격",
        ],
      },
      {
        no: "③", name: "권한 오남용", sub: "고위험 도구가 통제 없이 실행", color: C.catB,
        solvedLabel: "✓ 해결책",
        solved: [
          "최소 권한 (tools·disallowedTools로 필요 도구만)",
          "도구 화이트리스트 (허용 외 도구·인자 deny)",
          "HITL 승인 (고위험 작업 PreToolUse ask)",
          "시간·작업 기반 권한 (분류 후 조건부 deny/ask)",
        ],
        skill: "정리 Skill — 삭제·외부전송은 disallowedTools 제외, 위험 작업은 ask 승인.",
        agent: "운영 Agent — 시간 외·대량 삭제는 deny/ask, 최소 권한으로 필요 도구만 부여.",
        partialNone: true,
      },
    ],
    design: [
      "Skill 설계 = 최소 권한·도구 화이트리스트·DLP를 명확히 정의 (PreToolUse deny/ask)",
      "Agent 설계 = 불신 데이터 분리·감사 로그·HITL 승인을 함께 설계 (UserPromptSubmit + PostToolUse)",
      "운영 원칙 = 보안은 사후 탐지가 아니라 입력·전송·도구 경계의 사전 차단, 격리는 인프라 보완",
    ],
    excluded: "OS 샌드박스 (deny는 접근 차단일 뿐 프로세스·리소스 격리가 아님 — 컨테이너·격리 VM 영역)",
    notes:
      "[강사 메모] △ 1건의 한계를 명확히 할 것.\n" +
      "· 네트워크 화이트리스트: WebFetch·Bash(curl) URL 화이트리스트 외 deny는 앱 레벨이며, 패킷 레벨·Bash 난독화 차단은 불가 → 보완: 모든 외부 전송을 단일 egress MCP로 경유시키면 도구 내부에서 도메인 화이트리스트를 강제해 ✓로 승격 가능(harness-checker 0-2장 승격 규칙).\n" +
      "[제외] OS 샌드박스는 deny가 접근 차단일 뿐 프로세스·리소스 격리가 아님 → 컨테이너·격리 VM 배포로 해결.",
  },
];

// ── 레이아웃 상수 (단위: inch, 16x9) ─────────────────────────────
const PW = 16, PH = 9, MX = 0.4, CW = PW - 2 * MX;
const COL_GAP = 0.25;
const COL_W = (CW - 2 * COL_GAP) / 3;
const COL_X = [MX, MX + COL_W + COL_GAP, MX + 2 * (COL_W + COL_GAP)];
const COL_Y = 2.06, COL_TOTAL_H = 4.74;
const HEAD_H = 0.62, BODY_H = COL_TOTAL_H - HEAD_H;

function richLine(text, opts, brk = true) {
  return { text, options: Object.assign({ fontFace: FONT, fontSize: fs14(14), color: C.body, breakLine: brk }, opts) };
}

function buildCardBody(col) {
  const R = [];
  // 해결책 라벨
  R.push(richLine(col.solvedLabel, { bold: true, color: C.green }));
  // ✅ 항목
  col.solved.forEach((s) => R.push(richLine("✓ " + s, { color: C.ink })));
  // Skill 예시 (라벨 인라인 + 본문)
  R.push(richLine("Skill 예시  ", { bold: true, color: C.teal }, false));
  R.push(richLine(col.skill, { color: C.sub }));
  // Agent 예시
  R.push(richLine("Agent 예시  ", { bold: true, color: C.catC }, false));
  R.push(richLine(col.agent, { color: C.sub }));
  // △ 일부 적용
  if (col.partialNone) {
    R.push(richLine("△ 일부 적용: 없음 — ✓로 전수 통제", { bold: true, color: C.gray }));
  } else {
    let plabel = "△ 일부 적용";
    if (col.partialCaption) plabel += " (" + col.partialCaption + ")";
    R.push(richLine(plabel, { bold: true, color: C.amber }));
    col.partial.forEach((p) => R.push(richLine("△ " + p, { color: C.meta })));
  }
  return R;
}

async function buildSlide(pptx, data) {
  const slide = pptx.addSlide({ masterName: "MASTER" });

  // 1) Eyebrow
  slide.addText(data.eyebrow, {
    x: MX, y: 0.18, w: CW, h: 0.3, align: "center", valign: "middle",
    fontFace: FONT, fontSize: fs14(15), bold: true, color: C.teal,
  });
  // 2) 제목
  slide.addText(data.title, {
    x: MX, y: 0.5, w: CW, h: 0.56, align: "center", valign: "middle",
    fontFace: FONT, fontSize: fs14(22), bold: true, color: C.ink,
  });
  // 3) 핵심 관점 박스
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: MX, y: 1.12, w: CW, h: 0.82, fill: { color: C.insightBg }, line: { type: "none" }, rectRadius: 0.08,
  });
  slide.addText(
    [
      richLine("핵심 관점  ", { bold: true, color: C.teal, fontSize: fs14(15) }, false),
      richLine(data.insight, { color: C.ink, fontSize: fs14(14) }),
    ],
    { x: MX + 0.2, y: 1.14, w: CW - 0.4, h: 0.78, valign: "middle", align: "left", lineSpacingMultiple: 0.96 }
  );

  // 4) 3개 컬럼
  data.columns.forEach((col, i) => {
    const x = COL_X[i];
    // 카드 배경(흰색, 둥근 모서리, 테두리)
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x, y: COL_Y, w: COL_W, h: COL_TOTAL_H, fill: { color: C.cardBg }, line: { color: C.cardBorder, width: 1 }, rectRadius: 0.08,
    });
    // 헤더 바(상단 둥글게 + 하단 사각으로 마감)
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x, y: COL_Y, w: COL_W, h: HEAD_H, fill: { color: col.color }, line: { type: "none" }, rectRadius: 0.08 });
    slide.addShape(pptx.shapes.RECTANGLE, { x, y: COL_Y + HEAD_H - 0.16, w: COL_W, h: 0.16, fill: { color: col.color }, line: { type: "none" } });
    // 헤더 텍스트
    slide.addText(
      [
        richLine(col.no + "  " + col.name, { bold: true, color: "FFFFFF", fontSize: fs14(16) }),
        richLine(col.sub, { color: "FFFFFF", fontSize: fs14(14) }),
      ],
      { x: x + 0.14, y: COL_Y, w: COL_W - 0.28, h: HEAD_H, valign: "middle", align: "left", lineSpacingMultiple: 0.92 }
    );
    // 본문 (줄 간격을 키워 카드 수직 여백을 채움 — 폰트·줄바꿈 불변)
    slide.addText(buildCardBody(col), {
      x: x + 0.13, y: COL_Y + HEAD_H + 0.08, w: COL_W - 0.26, h: BODY_H - 0.16,
      valign: "top", align: "left", lineSpacingMultiple: 1.22, paraSpaceAfter: 3,
    });
  });

  // 5) 설계 포인트 박스
  const dpY = COL_Y + COL_TOTAL_H + 0.1; // 6.9
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: MX, y: dpY, w: CW, h: 0.96, fill: { color: C.panelBg }, line: { color: C.cardBorder, width: 1 }, rectRadius: 0.08,
  });
  const dpRich = [richLine("설계 포인트", { bold: true, color: C.green, fontSize: fs14(15) })];
  data.design.forEach((d) => dpRich.push(richLine("• " + d, { color: C.body, fontSize: fs14(14) })));
  slide.addText(dpRich, {
    x: MX + 0.2, y: dpY + 0.04, w: CW - 0.4, h: 0.88, valign: "middle", align: "left", lineSpacingMultiple: 0.95,
  });

  // 6) 제외(❌) 한 줄
  const exY = dpY + 0.96 + 0.06; // 7.92
  slide.addText(
    [
      richLine("✕ 제외(구조적 불가)  ", { bold: true, color: C.red, fontSize: fs14(14) }, false),
      richLine(data.excluded, { color: C.meta, fontSize: fs14(14) }),
    ],
    { x: MX, y: exY, w: CW, h: 0.3, valign: "middle", align: "left" }
  );

  // 7) 범례
  slide.addText(
    [
      richLine("✓ 적용 가능(결정론적 강제)", { color: C.green, fontSize: fs14(14), bold: true }, false),
      richLine("    △ 일부 적용(경계 근사·보완 관행 병행)", { color: C.amber, fontSize: fs14(14), bold: true }, false),
      richLine("    ✕ 구조적 불가(런타임·인프라 — 제외)", { color: C.meta, fontSize: fs14(14), bold: true }),
    ],
    { x: MX, y: exY + 0.32, w: CW, h: 0.28, valign: "middle", align: "center" }
  );

  // 8) 강사 노트 — 슬라이드는 압축본이므로 △의 '강제 불가 이유 + 보완'을 원문 그대로 보존
  if (data.notes) slide.addNotes(data.notes);

  return slide;
}

async function main() {
  const pptx = new pptxgen();
  pptx.defineLayout({ name: "CUSTOM", width: PW, height: PH });
  pptx.layout = "CUSTOM";
  pptx.theme = { headFontFace: FONT, bodyFontFace: FONT };

  pptx.defineSlideMaster({
    title: "MASTER",
    background: { color: "FFFFFF" },
    objects: [
      { line: { x: MX, y: 8.64, w: CW, h: 0, line: { color: C.divider, width: 1 } } },
      { text: { text: "ICTK AI 자동화 · 6회차 하네스 엔지니어링", options: { x: MX, y: 8.66, w: 10, h: 0.3, fontFace: FONT, fontSize: fs14(14), color: C.gray, align: "left", valign: "middle" } } },
      { text: { text: "무단전재 및 배포 금지", options: { x: PW - 6.4, y: 8.66, w: 5.2, h: 0.3, fontFace: FONT, fontSize: fs14(14), color: C.gray, align: "right", valign: "middle" } } },
    ],
    slideNumber: { x: PW - 1.0, y: 8.66, w: 0.6, h: 0.3, fontFace: FONT, fontSize: fs14(14), color: C.gray, align: "right" },
  });

  for (const data of SLIDES) {
    await buildSlide(pptx, data);
  }

  await pptx.writeFile({ fileName: "courseware.pptx" });
  console.log("✅ PPT 생성 완료: courseware.pptx (" + SLIDES.length + " slides)");
}

main().catch((e) => {
  console.error("❌ PPT 생성 실패:", e);
  process.exit(1);
});
