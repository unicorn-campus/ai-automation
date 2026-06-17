// build.js — ICTK 부트캠프 3회차 "Skill 기초" PPT 빌드
// ppt-guide.md 6절 준수 / 최소폰트 16pt / Claude Code 데스크톱 앱(Code 탭) 기준
"use strict";
const path = require("path");
const K = require(path.join(__dirname, "..", "_lib", "pptkit"));
const { C, FONT, fs16, MARGIN, CW, PAGE_W } = K;

const IMG = (f) => path.join(__dirname, "images", f);
const FOOTER = "ⓒ ICTK · Unicorn — Claude Code 업무 자동화 부트캠프 3회차 · 무단전재 및 배포 금지";

function bullets(slide, items, x, y, w, h, opts = {}) {
  const runs = items.map((it) => ({
    text: it.t !== undefined ? it.t : it,
    options: {
      fontFace: FONT, fontSize: fs16(it.size || opts.size || 16), bold: !!it.bold,
      color: it.color || opts.color || C.body,
      bullet: it.bullet === false ? false : { code: "2022", indent: 14 },
      breakLine: true, paraSpaceAfter: opts.gap !== undefined ? opts.gap : 7, indentLevel: it.lvl || 0,
    },
  }));
  slide.addText(runs, { x, y, w, h, align: "left", valign: "top", lineSpacingMultiple: opts.lsm || 1.05 });
}
function sectionTitle(slide, str, x, y, w, color = C.primary, size = 17) {
  slide.addText(str, { x, y, w, h: 0.4, align: "left", valign: "middle", fontFace: FONT, bold: true, fontSize: fs16(size), color });
}
function note(slide, txt) { slide.addNotes(txt); }
// 색상 헤더 카드
function headerCard(slide, x, y, w, h, hd, col, lines) {
  K.card(slide, x, y, w, h);
  K.roundRect(slide, x, y, w, 0.55, col, { radius: 0.08 });
  slide.addText(hd, { x, y, w, h: 0.55, align: "center", valign: "middle", fontFace: FONT, bold: true, fontSize: fs16(16), color: C.white });
  bullets(slide, lines.map(t => (typeof t === "string" ? { t, color: C.body } : t)), x + 0.22, y + 0.68, w - 0.44, h - 0.8, { gap: 8, size: 16 });
}

// ── 슬라이드 1 — 타이틀 (F) ─────────────────────────────────────────
async function createSlide01(pptx) {
  const s = pptx.addSlide({ masterName: "MASTER" });
  K.rect(s, 0, 0, PAGE_W, 3.05, C.primary);
  K.rect(s, 0, 0, 0.28, 3.05, C.green);
  s.addText("Claude Code 업무 자동화 부트캠프 · 3회차 / 11회차", { x: 0.95, y: 0.55, w: 13.5, h: 0.5, fontFace: FONT, bold: true, fontSize: fs16(20), color: "7FE7C4" });
  s.addText("Skill 기초", { x: 0.95, y: 1.05, w: 14.2, h: 0.95, fontFace: FONT, bold: true, fontSize: fs16(42), color: C.white });
  s.addText("반복 작업을 \"나만의 자동화 레시피\"로 — 매번 다시 적던 프롬프트를 한 번 만들어 재사용", { x: 0.95, y: 2.18, w: 14.2, h: 0.6, fontFace: FONT, fontSize: fs16(18), color: "D8D8D8" });

  const info = [
    { hd: "대상", col: C.catA, t: "ICTK 임직원 (비개발자 포함 입문자)" },
    { hd: "도구", col: C.catD, t: "Claude Code 데스크톱 앱 — Chat·Cowork·Code 중 \"Code\" 탭 (GUI)" },
    { hd: "흐름", col: C.catB, t: "2회차 복습 → 3회차 Skill → 2주 과제 → 4회차 예고" },
  ];
  const cw = 4.85, gap = 0.22; let x = 0.5;
  for (const c of info) {
    K.card(s, x, 3.45, cw, 1.75);
    K.roundRect(s, x, 3.45, cw, 0.5, c.col, { radius: 0.08 });
    s.addText(c.hd, { x, y: 3.45, w: cw, h: 0.5, align: "center", valign: "middle", fontFace: FONT, bold: true, fontSize: fs16(16), color: C.white });
    K.text(s, c.t, x + 0.2, 4.05, cw - 0.4, 1.05, { size: 16, color: C.body });
    x += cw + gap;
  }

  K.highlight(s, "오늘의 약속: 같은 지시를 매번 다시 적지 않습니다. SKILL.md 한 개로 \"나만의 자동화 레시피\"를 만들어 재사용합니다.", 0.5, 5.55, 15, 0.75, { size: 18, bold: true });

  note(s, "3회차 시작. 2회차(커넥터·루틴·Computer use) 상기 → 오늘은 반복 프롬프트/작업을 SKILL.md로 승격해 재사용하는 Skill을 배움. 데스크톱 앱 Code 탭(GUI), 터미널 아님. 유료 계정 필요. 회차 비교표는 슬라이드 11로 이동. 출처: https://code.claude.com/docs/en/skills , https://code.claude.com/docs/en/desktop");
  return s;
}

// ── 슬라이드 2 — WHY (F) ────────────────────────────────────────────
async function createSlide02(pptx) {
  const s = pptx.addSlide({ masterName: "MASTER" });
  K.headerBar(s, C.green);
  K.pageHeader(s, "WHY — 같은 프롬프트를 다시 적지 마세요", "골든서클: WHY → HOW → WHAT");

  K.card(s, 0.5, 1.7, 7.5, 3.7, "ECFDF5", C.green);
  const gc = [
    { lb: "WHY", tx: "같은 지시·체크리스트·여러 단계 절차를 채팅에 반복해서 붙여넣고 있다면, 바로 그때가 Skill로 만들 시점", col: C.step4 },
    { lb: "HOW", tx: "그 절차를 SKILL.md 파일 하나에 자연어로 적어두면, Claude가 자기 \"도구함\"에 추가", col: C.step3 },
    { lb: "WHAT", tx: "이후엔 한 번 만든 자동화를 자동으로(요청이 맞으면) 또는 \"/이름\"으로 바로 재사용", col: C.green },
  ];
  let yy = 1.95;
  for (const g of gc) {
    K.badge(s, 0.75, yy, 1.3, g.lb, g.col, C.white, 0.5, 16);
    K.text(s, g.tx, 2.2, yy - 0.02, 5.6, 1.05, { size: 16, color: C.primary });
    yy += 1.12;
  }

  K.table(s, [
    K.headRow(["구분", "1~2회차", "3회차(오늘)"]),
    ["지시 방식", "매번 같은 프롬프트 재입력", "한 번 만들어 재사용"],
    ["보관 형태", "사람 머릿속·메모장", "SKILL.md 파일로 저장"],
    ["호출", "그때그때 타이핑", "자동 트리거 또는 /스킬이름"],
  ], { x: 8.3, y: 1.7, w: 7.2, colW: [1.7, 2.6, 2.9], rowH: [0.5, 0.92, 0.92, 0.92], fontSize: 16, align: "left" });

  K.highlight(s, "오늘의 기대치: 외부 도구 없이 자연어 지침만으로 동작하는 Skill을 만듦 — 산출물은 SKILL.md 1개(문서 초안 생성용)", 0.5, 5.7, 15, 0.7, { size: 17 });

  note(s, "골든서클. 공식 메시지 '같은 지시·체크리스트·다단계 절차를 반복 붙여넣을 때, CLAUDE.md 한 섹션이 절차로 커졌을 때 스킬로'. 오늘은 외부 도구 없이 지침만, 산출물 SKILL.md 1개. 출처: https://code.claude.com/docs/en/skills");
  return s;
}

// ── 슬라이드 3 — Skill이란? (B) ─────────────────────────────────────
async function createSlide03(pptx) {
  const s = pptx.addSlide({ masterName: "MASTER" });
  K.headerBar(s, C.teal);
  K.pageHeader(s, "Skill이란? — 나만의 자동화 레시피", "SKILL.md로 Claude의 능력을 넓히기");
  K.highlight(s, "Skill = SKILL.md에 지침을 적어 Claude의 능력을 넓히는 것 — 만들면 Claude의 \"도구함\"에 추가됩니다.", 0.5, 1.65, 15, 0.6, { size: 17, bold: true });

  const cards = [
    { hd: "전문가화 (Specialize)", col: C.catA, t: "범용 Claude에 \"우리 회사 방식·체크리스트\"를 입혀 그 일에 능숙한 전문가로" },
    { hd: "반복 제거 (Reduce repetition)", col: C.catB, t: "한 번 만들면 관련 상황에서 알아서 재사용 — 매번 설명할 필요 없음" },
    { hd: "조합 (Compose)", col: C.catD, t: "여러 Skill을 이어 붙여 복잡한 업무 흐름을 구성" },
  ];
  let y = 2.4;
  for (const c of cards) {
    K.card(s, 0.5, y, 8.6, 1.32);
    K.roundRect(s, 0.5, y, 0.16, 1.32, c.col, { radius: 0.04 });
    s.addText(c.hd, { x: 0.85, y: y + 0.12, w: 8.0, h: 0.4, fontFace: FONT, bold: true, fontSize: fs16(17), color: c.col });
    K.text(s, c.t, 0.85, y + 0.55, w0(8.0), 0.7, { size: 16, color: C.body });
    y += 1.42;
  }
  function w0(v) { return v; }

  K.addImage(s, IMG("s3_skill_recipe.png"), { x: 9.4, y: 2.4, w: 6.1, h: 4.0, sizing: { type: "contain", w: 6.1, h: 4.0 } });
  K.highlight(s, "쉬운 비유: Skill은 요리 레시피 — 한 번 적어두면 매번 같은 결과를 빠르게 재현합니다.", 0.5, 6.75, 8.6, 0.6, { size: 16, fill: "CCFBF1" });

  note(s, "핵심 개념. 공식 'Skills extend what Claude can do. Create a SKILL.md file with instructions, and Claude adds it to its toolkit.' 3대 이점(Specialize/Reduce repetition/Compose)=overview Key benefits. 레시피 비유. 출처: https://code.claude.com/docs/en/skills , https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview");
  return s;
}

// ── 슬라이드 4 — SKILL.md 구조 (C변형) ──────────────────────────────
async function createSlide04(pptx) {
  const s = pptx.addSlide({ masterName: "MASTER" });
  K.headerBar(s, C.green);
  K.pageHeader(s, "SKILL.md 구조 — 1회차 5요소의 확장", "① 설정 칸(언제 쓸지) ② 본문(어떻게 할지)");

  sectionTitle(s, "위에서 아래로 읽는 구조", 0.5, 1.75, 7, C.primary, 17);
  const steps = [
    ["① 설정 칸 시작 (---)\nname(스킬 이름) · description(무엇을·언제)", C.step1],
    ["② 설정 칸 끝 (---)", C.step3],
    ["③ 본문(자연어 지침)\n= 1회차 5요소(역할·맥락·입력·작업방법·출력·제약)", C.green],
  ];
  let y = 2.25;
  for (const [label, col] of steps) { K.flowStep(s, 0.5, y, 7.3, 0.85, label, col, 16); y += 1.0; }

  sectionTitle(s, "본문 = 5요소의 확장", 8.3, 1.75, 7, C.primary, 17);
  K.table(s, [
    K.headRow(["본문 섹션", "적는 내용"]),
    ["목표·역할·맥락", "무엇을 위해, 어떤 역할로, 어떤 상황에서"],
    ["입력·작업방법", "받을 정보 / 따라야 할 단계·체크리스트"],
    ["출력·제약", "결과 형식 / 하지 말아야 할 것"],
  ], { x: 8.3, y: 2.25, w: 7.2, colW: [2.2, 5.0], rowH: [0.5, 0.78, 0.78, 0.78], fontSize: 16, align: "left" });

  K.highlight(s, "꼭 필요한 건 둘뿐 — 이름표 한 개(name) + 설명 한 줄(description: 무엇+언제). 본문은 짧게(권장 500줄 이하): 한 번 불려오면 대화 내내 남아 길수록 매번 비용이 듭니다.", 0.5, 5.85, 15, 0.85, { size: 16, fill: "CCFBF1" });

  note(s, "'YAML 프런트매터'를 '파일 맨 위 설정 칸'으로 풀어씀. 필수 필드 name·description 둘뿐(Claude Code는 description만 권장). 본문 간결(세션 내내 컨텍스트 잔존→토큰 비용, 500줄 이하 권장). name 제약(소문자·숫자·하이픈·64자·예약어 금지)은 구두 보충. 출처: https://code.claude.com/docs/en/skills , https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices");
  return s;
}

// ── 슬라이드 5 — description 핵심 (B) ───────────────────────────────
async function createSlide05(pptx) {
  const s = pptx.addSlide({ masterName: "MASTER" });
  K.headerBar(s, C.step2);
  K.pageHeader(s, "description이 핵심 — 자동으로 불려오는 원리", "평소엔 이름·description만, 맞을 때만 본문");

  sectionTitle(s, "자동 트리거 흐름", 0.5, 1.75, 4.6, C.primary, 16);
  const steps = [["① 시작 시 이름·description만 인지", C.step1], ["② 내 요청과 비교", C.step3], ["③ 맞으면 SKILL.md 본문 불러와 실행", C.green]];
  let y = 2.2;
  for (const [label, col] of steps) { K.flowStep(s, 0.5, y, 4.7, 0.78, label, col, 16); y += 0.92; }

  K.card(s, 5.45, 1.95, 4.9, 3.4, C.cardBg, C.cardBorder);
  sectionTitle(s, "좋은 description 원칙", 5.67, 2.1, 4.5, C.teal, 16);
  bullets(s, [
    { t: "무엇 + 언제를 모두, 사용자가 자연스럽게 말할 키워드로", color: C.body },
    { t: "3인칭으로: \"엑셀 파일을 처리하고 보고서를 만듦\"(O) / \"제가 도와드릴게요\"(X)", color: C.primary },
    { t: "\"문서 관련 도움을 줌\" 같은 모호한 표현 금지", color: C.body },
  ], 5.7, 2.6, 4.4, 2.6, { gap: 12, size: 16 });

  K.addImage(s, IMG("s5_progressive_disclosure.png"), { x: 10.6, y: 1.95, w: 4.9, h: 3.4, sizing: { type: "contain", w: 4.9, h: 3.4 } });

  K.highlight(s, "한 줄 요점: 평소엔 이름표(약 100토큰 = AI가 읽는 글자 분량)만, 쓸 때만 본문을 읽음 → 스킬을 많이 만들어도 평소 부담이 거의 없습니다.", 0.5, 5.75, 15, 0.8, { size: 16 });

  note(s, "자동 트리거 원리: 시작 시 name·description만 시스템 프롬프트에, 요청 매칭 시 본문 로드(progressive disclosure L1 이름표~100토큰→L2 본문→L3 첨부). description 3인칭 필수(공식 best-practices). 출처: https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices , https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview");
  return s;
}

// ── 슬라이드 6 — 스코프 (D) ─────────────────────────────────────────
async function createSlide06(pptx) {
  const s = pptx.addSlide({ masterName: "MASTER" });
  K.headerBar(s, C.step3);
  K.pageHeader(s, "어디에 둘까? — 유저 vs 프로젝트 스코프", "저장 위치가 곧 사용 범위(스코프)");

  K.table(s, [
    K.headRow(["스코프", "저장 위치", "적용 범위", "적합한 경우"]),
    [{ text: "유저(개인)", options: { bold: true, color: C.primary, fontFace: FONT, fontSize: fs16(16) } },
     "~/.claude/skills/이름/SKILL.md\n(내 PC의 개인 폴더)", "내 모든 폴더에서 사용", "나 혼자 두루 쓰는 개인 도구"],
    [{ text: "프로젝트", options: { bold: true, color: C.primary, fontFace: FONT, fontSize: fs16(16) } },
     ".claude/skills/이름/SKILL.md\n(이 작업 폴더 안)", "그 폴더에서만", "팀 공유·특정 프로젝트 전용 절차"],
  ], { x: 0.5, y: 1.8, w: 15, colW: [1.9, 5.3, 3.2, 4.6], rowH: [0.5, 1.05, 1.05], fontSize: 16, align: "left" });

  bullets(s, [
    { t: "호출 이름은 폴더 이름에서 옴 — .claude/skills/summarize-changes/ → /summarize-changes", color: C.body },
    { t: "라이브 반영: 만들거나 고치면 보통 재시작 없이 현재 세션에 즉시 적용(SKILL.md 텍스트 기준)", color: C.body },
  ], 0.55, 4.65, 15, 1.0, { gap: 8, size: 16 });

  K.highlight(s, "🔒 ICTK 포인트: 팀 공유용 프로젝트 스킬은 폴더를 신뢰(workspace trust)해야 자동 권한이 적용됨 → 신뢰 전 스킬 내용을 검토하는 것이 \"데이터 격리·사람 최종 승인\" 기본기와 연결됩니다.", 0.5, 5.95, 15, 0.85, { size: 16, fill: "CCFBF1" });

  note(s, "공식 'Where skills live'(개인 ~/.claude/skills/, 프로젝트 .claude/skills/). 호출 이름=폴더 이름. 충돌 우선순위 enterprise>personal>project는 구두 보충. 프로젝트 스킬 allowed-tools는 workspace trust 후 적용 → ICTK 검토 권고. 출처: https://code.claude.com/docs/en/skills");
  return s;
}

// ── 슬라이드 7 — 내장 스킬 (E) ──────────────────────────────────────
async function createSlide07(pptx) {
  const s = pptx.addSlide({ masterName: "MASTER" });
  K.headerBar(s, C.step5);
  K.pageHeader(s, "만들지 말고 바로 쓰기 — Claude 내장 스킬", "프롬프트 박스에 \"/\"만 입력 (설치 불필요)");

  const cards = [
    { hd: "/goal · 목표 끝까지", col: C.catA, lines: ["완료 조건을 선언하면 그 조건이 충족될 때까지 Claude가 턴을 넘어 계속 작업", "(예: \"테스트가 통과할 때까지\")"] },
    { hd: "/code-review · 코드 품질", col: C.catB, lines: ["지금 변경한 코드의 버그·정리할 곳을 점검"] },
    { hd: "/security-review · 보안", col: C.catD, lines: ["변경분을 보안 취약점(인젝션·인증·데이터 노출) 관점에서 분석", "ICTK 같은 보안 기업에 유용"] },
  ];
  const cw = 4.85, gap = 0.22; let x = 0.5;
  for (const c of cards) { headerCard(s, x, 2.4, cw, 2.85, c.hd, c.col, c.lines); x += cw + gap; }

  bullets(s, [
    { t: "이 밖에 /review(PR 리뷰), /loop(반복 실행) 등도 기본 제공", color: C.body },
    { t: "데스크톱 Code 탭 주의: /permissions·/config·/agents·/doctor는 Code 탭 미지원 → ⚙️ Settings로 대체", bold: true, color: C.primary },
  ], 0.55, 5.5, 15, 1.1, { gap: 8, size: 16 });

  note(s, "메시지='만들지 말고 바로 쓰기'. CLI 플래그는 본문 제거, '한 줄 효용 + /명령어'로 통일. 정확 구문(구두): /code-review [low|medium|high|xhigh|max|ultra] [--fix] [--comment] [target] — ultra는 effort 레벨 값, /ultrareview는 alias(여전히 유효, deprecated로 말하지 말 것). Code 탭 미지원 4종은 ⚙️ Settings 대체. 출처: https://code.claude.com/docs/en/commands , https://code.claude.com/docs/en/skills");
  return s;
}

// ── 슬라이드 8 — Skill 만들기 (C) ───────────────────────────────────
async function createSlide08(pptx) {
  const s = pptx.addSlide({ masterName: "MASTER" });
  K.headerBar(s, C.step3);
  K.pageHeader(s, "데스크톱 앱에서 Skill 만들기", "Code 탭에 부탁하면 Claude가 파일을 만들어 줌");

  sectionTitle(s, "만드는 흐름 (3단계)", 0.5, 1.75, 6, C.primary, 17);
  const steps = [
    ["① 요청: \"내 변경사항을 요약하는\nsummarize-changes 스킬을 만들어줘\"", C.step1],
    ["② 승인: 폴더·SKILL.md 생성 제안\n→ diff를 보고 Accept/Reject", C.step3],
    ["③ 테스트: \"내가 뭘 바꿨지?\"로 자동 호출\n또는 /summarize-changes 로 직접 실행", C.green],
  ];
  let y = 2.25;
  for (const [label, col] of steps) { K.flowStep(s, 0.5, y, 6.5, 0.9, label, col, 16); y += 1.05; }

  sectionTitle(s, "SKILL.md 최소 예시", 7.3, 1.75, 6, C.primary, 17);
  K.codeBlock(s, "---\nname: summarize-changes\ndescription: Summarizes recent file changes.\n  Use when the user asks what changed.\n---\n# 변경사항 요약\n## 작업방법\n1. 최근 변경 파일을 확인\n2. 변경 요지를 항목으로 정리", 7.3, 2.25, 8.2, 3.05, 16);

  K.highlight(s, "핵심: Claude는 Skill 형식을 이미 알고 있어 별도 도구 없이 만들어 줍니다. 안 불려오면 description에 키워드 보강, 너무 자주 불려오면 description을 더 구체적으로(또는 자동 호출 끄기 설정).", 0.5, 5.75, 15, 0.85, { size: 16 });

  note(s, "공식 'Create your first skill' summarize-changes 튜토리얼(요청→생성→diff 승인→자동/직접 호출). 데스크톱은 프롬프트로 '스킬 폴더와 SKILL.md를 만들어줘' 요청 후 diff Accept(터미널 mkdir 표현 금지). 트러블슈팅: 안 불려오면 키워드/재표현/직접 호출, 너무 자주면 description 구체화·disable-model-invocation:true('자동 호출 끄기'). 출처: https://code.claude.com/docs/en/skills , https://code.claude.com/docs/en/desktop");
  return s;
}

// ── 슬라이드 9 — 실습 2종 (E 2열) ───────────────────────────────────
async function createSlide09(pptx) {
  const s = pptx.addSlide({ masterName: "MASTER" });
  K.headerBar(s, C.green);
  K.pageHeader(s, "실습 2종 — 문서 스킬 / 정보조사 스킬", "오늘의 손으로 해보기");

  K.card(s, 0.5, 2.2, 7.4, 3.0);
  K.roundRect(s, 0.5, 2.2, 7.4, 0.55, C.catB, { radius: 0.08 });
  s.addText("① 문서 스킬 — 표준 초안·요약  [직접 실습]", { x: 0.5, y: 2.2, w: 7.4, h: 0.55, align: "center", valign: "middle", fontFace: FONT, bold: true, fontSize: fs16(16), color: C.white });
  bullets(s, [
    { t: "외부 도구 없이 지침만으로 동작", color: C.body },
    { t: "자주 쓰는 보고서·회의록 양식을 SKILL.md에 담아 /문서초안 또는 /문서요약으로 호출", color: C.body },
    { t: "→ 매번 양식을 설명하지 않고 한 번에 표준 초안 생성", color: C.primary, bold: true },
  ], 0.72, 2.95, 7.0, 2.1, { gap: 10, size: 16 });

  K.card(s, 8.1, 2.2, 7.4, 3.0);
  K.roundRect(s, 8.1, 2.2, 7.4, 0.55, C.catC, { radius: 0.08 });
  s.addText("② 정보조사 스킬 — 조사→레포트→슬라이드  [데모]", { x: 8.1, y: 2.2, w: 7.4, h: 0.55, align: "center", valign: "middle", fontFace: FONT, bold: true, fontSize: fs16(16), color: C.white });
  bullets(s, [
    { t: "한 번의 호출로 특정 주제 검색 → 레포트 작성 → 웹페이지 가시화 → PPT 슬라이드까지 단계 실행", color: C.body },
    { t: "→ 여러 단계 절차를 하나의 레시피로 묶는 체험 (웹 검색·PPT 생성 등 도구 연동 포함)", color: C.primary, bold: true },
  ], 8.32, 2.95, 7.0, 2.1, { gap: 10, size: 16 });

  K.highlight(s, "오늘의 산출물: 직접 만드는 것은 ①(SKILL.md 1개, 문서 초안 생성용) — name·description·본문(목표·작업방법·출력)을 갖춰 완성   ·   (선택) 법률 상담 스킬(Korean Law MCP) 데모 관찰", 0.5, 5.5, 15, 0.85, { size: 16 });

  note(s, "실습 2종. 카드①=[직접 실습](지침만), 카드②=[데모](웹검색·PPT 등 도구 연동 포함 → '지침만' 범주 밖). 산출물=SKILL.md 1개(카드①). 선택: 법률상담 스킬(Korean Law MCP) 데모. 출처: https://code.claude.com/docs/en/skills , https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview");
  return s;
}

// ── 슬라이드 10 — ICTK 안전 (E 3열) ─────────────────────────────────
async function createSlide10(pptx) {
  const s = pptx.addSlide({ masterName: "MASTER" });
  K.headerBar(s, C.step4);
  K.pageHeader(s, "ICTK 안전 수칙 — 스킬도 \"소프트웨어처럼\"", "편리해도 흔들리지 않는 3원칙");

  const cards = [
    { hd: "1. 신뢰 출처만", col: C.catB, lines: ["스킬은 새 능력을 부여 → 소프트웨어 설치처럼 취급", "내가 만들었거나 Anthropic 제공한 것만. 외부 스킬은 SKILL.md·스크립트를 전부 감사 후 사용"] },
    { hd: "2. 민감정보 그대로 적지 않기", col: C.catC, lines: ["비밀번호·고객정보·ICTK 핵심 보안 자산 등을 SKILL.md에 그대로 적지 말 것", "파일은 공유·커밋될 수 있음"] },
    { hd: "3. 사람 최종 승인", col: C.catE, lines: ["편집·실행은 diff를 보고 Accept/Reject", "배포·제출처럼 되돌리기 어려운 작업은 자동 호출 끄기 설정으로 막고 사람이 직접 호출"] },
  ];
  const cw = 4.85, gap = 0.22; let x = 0.5;
  for (const c of cards) { headerCard(s, x, 2.4, cw, 3.0, c.hd, c.col, c.lines); x += cw + gap; }

  K.highlight(s, "프롬프트 인젝션(외부 문서·스킬 속 숨은 지시문이 Claude를 속이는 공격)을 경계 — 신뢰되지 않은 스킬 연결 금지.", 0.5, 5.65, 15, 0.7, { size: 16, fill: "CCFBF1" });

  note(s, "공식 'Security considerations': 신뢰 출처만(직접 제작/Anthropic), 외부는 전 파일 감사, '소프트웨어 설치처럼'. 민감정보 비기재(SKILL.md가 git 커밋·팀 공유 대상). diff Accept/Reject + 위험 작업 disable-model-invocation:true. 출처: https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview , https://code.claude.com/docs/en/skills");
  return s;
}

// ── 슬라이드 11 — 정리 (F) ──────────────────────────────────────────
async function createSlide11(pptx) {
  const s = pptx.addSlide({ masterName: "MASTER" });
  K.headerBar(s, C.green);
  K.pageHeader(s, "정리 · 회차 흐름 · 2주 과제 · 4회차 예고", "오늘 요약 / 흐름 / 할 일 / 다음");

  K.card(s, 0.5, 1.65, 7.4, 2.35, "ECFDF5", C.green);
  sectionTitle(s, "오늘 배운 것", 0.75, 1.77, 6, "0F766E", 17);
  bullets(s, [
    { t: "Skill = 나만의 자동화 레시피: 반복 작업을 SKILL.md(설정 칸+본문)로 승격 · 필수는 name·description(무엇+언제, 3인칭)", color: C.primary },
    { t: "저장: 유저(내 모든 폴더) vs 프로젝트(그 폴더만) · 내장 스킬(/goal·/code-review·/security-review)은 바로 사용", color: C.primary },
  ], 0.78, 2.25, 6.9, 1.7, { gap: 10, size: 16 });

  sectionTitle(s, "회차 흐름", 8.3, 1.65, 7, C.primary, 17);
  K.table(s, [
    K.headRow(["회차", "핵심", "한 줄"]),
    ["2회차", "커넥터·루틴·Computer use", "외부 도구 연결 + 자동 반복"],
    [{ text: "3회차(오늘)", options: { bold: true, color: C.primary, fontFace: FONT, fontSize: fs16(16) } },
     { text: "Skill 기초(SKILL.md)", options: { bold: true, color: C.primary, fontFace: FONT, fontSize: fs16(16) } },
     { text: "반복 작업을 재사용 가능하게", options: { bold: true, color: C.green, fontFace: FONT, fontSize: fs16(16) } }],
    ["4회차(예고)", "Skill 심화 + 웹브라우저 MCP", "외부 연동 확장 + MCP 개발"],
  ], { x: 8.3, y: 2.1, w: 7.2, colW: [1.8, 3.0, 2.4], rowH: [0.5, 0.62, 0.62, 0.62], fontSize: 16, align: "left" });

  K.highlight(s, "2주 과제 — 2회차에서 설계한 반복 작업을 Skill로: ① 만들기(루틴 후보를 SKILL.md로) → ② 실사용(실제 업무 3회 이상) → ③ 개선(안 불려옴/오작동 등 개선점 기록 = 4회차 재료)", 0.5, 4.55, 15, 0.85, { size: 16, fill: "FEF3C7", color: "92400E" });
  K.highlight(s, "4회차 예고 — Skill 심화 + 웹브라우저 MCP: Playwright·Claude in Chrome로 웹을 다루고 MCP를 직접 개발. 오늘 만든 지침만의 Skill에 외부 연동을 더해 확장합니다.", 0.5, 5.6, 15, 0.85, { size: 17 });

  note(s, "타이틀의 회차 비교표를 흡수. 2주 과제: 2회차 루틴 후보를 Skill로 구현·3회 이상 실사용·개선점 기록(4회차 재료). 학습 연속성: 2회차(연결·자동반복)→3회차(지침만 Skill)→4회차(Skill 심화+웹브라우저 MCP+MCP 개발). 출처: https://code.claude.com/docs/en/skills , https://code.claude.com/docs/en/commands");
  return s;
}

async function main() {
  const pptx = K.newDeck();
  pptx.author = "Unicorn / 이해경"; pptx.company = "ICTK";
  pptx.subject = "Claude Code 업무 자동화 부트캠프 3회차";
  pptx.title = "3회차 — Skill 기초";
  K.defineMaster(pptx, FOOTER);
  const slides = [createSlide01, createSlide02, createSlide03, createSlide04, createSlide05, createSlide06,
    createSlide07, createSlide08, createSlide09, createSlide10, createSlide11];
  for (const fn of slides) await fn(pptx);
  const out = path.join(__dirname, "3회차-Skill기초.pptx");
  await pptx.writeFile({ fileName: out });
  console.log("✅ PPT 생성 완료:", out, "| 슬라이드:", slides.length);
}
main().catch((e) => { console.error("❌ PPT 생성 실패:", e); process.exit(1); });
