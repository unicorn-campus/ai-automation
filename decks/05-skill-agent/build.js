// build.js — ICTK 부트캠프 5회차 "Skill + Agent 개발" PPT 빌드
"use strict";
const path = require("path");
const K = require(path.join(__dirname, "..", "_lib", "pptkit"));
const { C, FONT, fs16, PAGE_W } = K;
const IMG = (f) => path.join(__dirname, "images", f);
const FOOTER = "ⓒ ICTK · Unicorn — Claude Code 업무 자동화 부트캠프 5회차 · 무단전재 및 배포 금지";

function bullets(slide, items, x, y, w, h, opts = {}) {
  const runs = items.map((it) => ({ text: it.t !== undefined ? it.t : it,
    options: { fontFace: FONT, fontSize: fs16(it.size || opts.size || 16), bold: !!it.bold, color: it.color || opts.color || C.body,
      bullet: it.bullet === false ? false : { code: "2022", indent: 14 }, breakLine: true, paraSpaceAfter: opts.gap !== undefined ? opts.gap : 7, indentLevel: it.lvl || 0 } }));
  slide.addText(runs, { x, y, w, h, align: "left", valign: "top", lineSpacingMultiple: opts.lsm || 1.05 });
}
function sectionTitle(slide, str, x, y, w, color = C.primary, size = 17) {
  slide.addText(str, { x, y, w, h: 0.4, align: "left", valign: "middle", fontFace: FONT, bold: true, fontSize: fs16(size), color });
}
function note(slide, txt) { slide.addNotes(txt); }
function headerCard(slide, x, y, w, h, hd, col, lines) {
  K.card(slide, x, y, w, h); K.roundRect(slide, x, y, w, 0.55, col, { radius: 0.08 });
  slide.addText(hd, { x, y, w, h: 0.55, align: "center", valign: "middle", fontFace: FONT, bold: true, fontSize: fs16(16), color: C.white });
  bullets(slide, lines.map(t => (typeof t === "string" ? { t, color: C.body } : t)), x + 0.22, y + 0.68, w - 0.44, h - 0.8, { gap: 8, size: 16 });
}
function titleBand(s, kicker, title, subtitle, titleSize) {
  K.rect(s, 0, 0, PAGE_W, 3.05, C.primary); K.rect(s, 0, 0, 0.28, 3.05, C.green);
  s.addText(kicker, { x: 0.95, y: 0.55, w: 13.8, h: 0.5, fontFace: FONT, bold: true, fontSize: fs16(20), color: "7FE7C4" });
  s.addText(title, { x: 0.95, y: 1.05, w: 14.3, h: 0.95, fontFace: FONT, bold: true, fontSize: fs16(titleSize || 40), color: C.white });
  s.addText(subtitle, { x: 0.95, y: 2.18, w: 14.3, h: 0.6, fontFace: FONT, fontSize: fs16(18), color: "D8D8D8" });
}
function infoCards(s, items) {
  const cw = 4.85, gap = 0.22; let x = 0.5;
  for (const c of items) {
    K.card(s, x, 3.45, cw, 1.75); K.roundRect(s, x, 3.45, cw, 0.5, c.col, { radius: 0.08 });
    s.addText(c.hd, { x, y: 3.45, w: cw, h: 0.5, align: "center", valign: "middle", fontFace: FONT, bold: true, fontSize: fs16(16), color: C.white });
    K.text(s, c.t, x + 0.2, 4.05, cw - 0.4, 1.05, { size: 16, color: C.body }); x += cw + gap;
  }
}

async function createSlide01(pptx) {
  const s = pptx.addSlide({ masterName: "MASTER" });
  titleBand(s, "Claude Code 업무 자동화 부트캠프 · 5회차 / 11회차", "Skill + Agent 개발", "혼자 다 하던 스킬에 '역할 분담'을 더하다 — 오케스트레이터가 서브에이전트를 부르는 다단계 자동화");
  infoCards(s, [
    { hd: "대상", col: C.catA, t: "ICTK 임직원 (비개발자 포함 입문자)" },
    { hd: "도구", col: C.catD, t: "Claude Code 데스크톱 앱 — \"Code\" 탭 (GUI)" },
    { hd: "흐름", col: C.catB, t: "4회차 복습 → 5회차 Skill+Agent → 2주 과제 → 6회차 예고" },
  ]);
  K.highlight(s, "오늘의 핵심: 한 스킬이 여러 보조 AI(서브에이전트)에게 일을 나눠 맡기고 결과를 모으는 다단계 자동화를 만듭니다.", 0.5, 5.55, 15, 0.75, { size: 18, bold: true });
  note(s, "5회차 시작. 4회차(MCP 연결) 상기 → 오늘은 오케스트레이터 스킬이 서브에이전트(작성자·검토자)를 부르는 다단계. 데스크톱 Code 탭. 출처: https://code.claude.com/docs/en/sub-agents , https://code.claude.com/docs/en/skills");
  return s;
}

async function createSlide02(pptx) {
  const s = pptx.addSlide({ masterName: "MASTER" });
  K.headerBar(s, C.green); K.pageHeader(s, "WHY — 혼자 다 하면 빠뜨리고, 나눠 맡기면 꼼꼼해진다", "골든서클: WHY → HOW → WHAT");
  K.card(s, 0.5, 1.7, 7.5, 3.7, "ECFDF5", C.green);
  const gc = [
    { lb: "WHY", tx: "한 명이 글도 쓰고 검토도 하면 자기 실수를 못 봄 — 작성과 점검을 다른 역할이 맡으면 품질↑", col: C.step4 },
    { lb: "HOW", tx: "일을 잘게 나눠 '작성자'·'검토자' 같은 보조 AI(서브에이전트)에게 맡기고, 메인이 결과를 종합", col: C.step3 },
    { lb: "WHAT", tx: "오케스트레이터 스킬 하나로 여러 단계가 자동으로 굴러감(작성 → 검토 → 보고)", col: C.green },
  ];
  let yy = 1.95; for (const g of gc) { K.badge(s, 0.75, yy, 1.3, g.lb, g.col, C.white, 0.5, 16); K.text(s, g.tx, 2.2, yy - 0.02, 5.6, 1.05, { size: 16, color: C.primary }); yy += 1.12; }
  K.table(s, [
    K.headRow(["구분", "3~4회차", "5회차(오늘)"]),
    ["일하는 방식", "한 스킬이 혼자 처음부터 끝까지", "메인이 나눠 맡기고 종합"],
    ["품질 점검", "같은 맥락 자가 점검", "다른 역할(검토자)이 별도 점검"],
    ["속도", "단계 길면 한 줄로 느림", "독립 작업은 동시에(병렬)"],
  ], { x: 8.3, y: 1.7, w: 7.2, colW: [1.8, 2.6, 2.8], rowH: [0.5, 0.92, 0.92, 0.92], fontSize: 16, align: "left" });
  K.highlight(s, "오늘의 기대치: 작성자 → 검토자처럼 역할을 나눈 다단계 스킬을 만들고, 비용·성능·보안까지 고려해 조율(하네스 엔지니어링).", 0.5, 5.7, 15, 0.75, { size: 17 });
  note(s, "골든서클. 서브에이전트=specialized AI assistants, 독립 컨텍스트·요약만 반환·병렬 가능. 출처: https://code.claude.com/docs/en/sub-agents");
  return s;
}

async function createSlide03(pptx) {
  const s = pptx.addSlide({ masterName: "MASTER" });
  K.headerBar(s, C.teal); K.pageHeader(s, "에이전트 · 서브에이전트란? — 팀장과 팀원", "스스로 일하는 AI 일꾼 / 특정 역할 보조 AI");
  K.highlight(s, "에이전트 = 스스로 여러 단계를 해내는 AI 일꾼 · 서브에이전트 = 특정 역할만 맡는 보조 AI 일꾼", 0.5, 1.65, 15, 0.6, { size: 17, bold: true });
  const cards = [
    { hd: "팀장 = 메인(오케스트레이터)", col: C.catA, t: "일을 쪼개 누구에게 맡길지 정하고, 결과를 모아 최종 정리" },
    { hd: "팀원 = 서브에이전트", col: C.catB, t: "'작성자'·'검토자'처럼 한 가지 역할만, 자기 책상(독립 작업 공간)에서 처리" },
    { hd: "보고 = 요약만 전달", col: C.catD, t: "잡다한 과정은 자기 선에서 끝내고 결론(요약)만 올림 → 팀장 책상이 깔끔" },
  ];
  let y = 2.4;
  for (const c of cards) {
    K.card(s, 0.5, y, 8.6, 1.32); K.roundRect(s, 0.5, y, 0.16, 1.32, c.col, { radius: 0.04 });
    s.addText(c.hd, { x: 0.85, y: y + 0.12, w: 8.0, h: 0.4, fontFace: FONT, bold: true, fontSize: fs16(17), color: c.col });
    K.text(s, c.t, 0.85, y + 0.55, 8.0, 0.7, { size: 16, color: C.body }); y += 1.42;
  }
  K.addImage(s, IMG("s3_team_metaphor.png"), { x: 9.4, y: 2.4, w: 6.1, h: 4.0, sizing: { type: "contain", w: 6.1, h: 4.0 } });
  K.highlight(s, "왜 따로 두나: 역할마다 쓸 수 있는 도구·권한을 다르게 줄 수 있어 안전하고, 저렴한 모델에 맡겨 비용도 아낌.", 0.5, 6.75, 8.6, 0.6, { size: 16, fill: "CCFBF1" });
  note(s, "팀장-팀원 비유. 서브에이전트=독립 컨텍스트, 요약만 반환(Preserve context), 역할별 도구 제한, 저렴 모델 라우팅. 출처: https://code.claude.com/docs/en/sub-agents");
  return s;
}

async function createSlide04(pptx) {
  const s = pptx.addSlide({ masterName: "MASTER" });
  K.headerBar(s, C.step2); K.pageHeader(s, "오케스트레이션 흐름 — 분배 → 실행 → 종합", "메인이 나눠 맡기고 결과를 종합");
  sectionTitle(s, "세 단계 흐름", 0.5, 1.7, 6, C.primary, 16);
  const steps = [["① 분배(Distribute) — 일을 쪼개 알맞은 서브에이전트에 위임", C.step1], ["② 실행(Run) — 각자 자기 공간에서 독립 실행(안 섞임)", C.step2], ["③ 종합(Synthesize) — 메인이 요약을 모아 최종 정리", C.step5]];
  let y = 2.15; for (const [l, col] of steps) { K.flowStep(s, 0.5, y, 6.3, 0.8, l, col, 16); y += 0.9; }
  K.table(s, [
    K.headRow(["단계", "메인(팀장)", "서브에이전트(팀원)"]),
    ["분배", "요청·역할 맞춰 위임", "(대기)"],
    ["실행", "기다림 / 동시 진행 관리", "자기 역할만 수행 → 요약"],
    ["종합", "요약 합쳐 결론 도출", "(반환 완료)"],
  ], { x: 7.0, y: 2.15, w: 8.5, colW: [1.3, 3.6, 3.6], rowH: [0.5, 0.62, 0.62, 0.62], fontSize: 16, align: "left" });
  K.addImage(s, IMG("s4_orchestration_flow.png"), { x: 0.5, y: 5.05, w: 6.8, h: 1.75, sizing: { type: "contain", w: 6.8, h: 1.75 } });
  K.highlight(s, "핵심: 독립적인 일은 동시에(병렬), 이어지는 일은 차례로(체인). 둘 다 결과는 메인이 모음 — 빠르면서도 한 줄로 꿰어집니다.", 7.5, 5.05, 8.0, 1.75, { size: 16, fill: "CCFBF1" });
  note(s, "오케스트레이션=분배·실행·종합. 병렬(독립 경로)·체인(순차) 패턴. 각 서브에이전트는 fresh isolated context. 출처: https://code.claude.com/docs/en/sub-agents");
  return s;
}

async function createSlide05(pptx) {
  const s = pptx.addSlide({ masterName: "MASTER" });
  K.headerBar(s, C.step3); K.pageHeader(s, "역할 분리 설계 — 작성자↔검토자 / 수집자↔요약자", "하나의 서브에이전트는 한 가지 일만");
  headerCard(s, 0.5, 2.0, 7.4, 3.3, "① 작성자 ↔ 검토자 · 만들고 → 점검", C.catB, [
    { t: "작성자: 글·코드를 만드는 데 집중(쓰기 권한 보유)", color: C.body },
    { t: "검토자: 읽기 전용으로 버그·보안만 점검 → 자기 글을 자기가 못 보는 문제 해소", color: C.primary },
  ]);
  headerCard(s, 8.1, 2.0, 7.4, 3.3, "② 수집자 ↔ 요약자 · 모으고 → 추리기", C.catD, [
    { t: "수집자: 흩어진 자료·로그를 폭넓게 긁어모음(많은 출력 흡수)", color: C.body },
    { t: "요약자: 그중 핵심만 골라 메인에 짧게 보고 → 메인 책상이 안 넘침", color: C.primary },
  ]);
  K.highlight(s, "설계 팁: 각 역할의 description(언제 부를지)을 명확히, 도구는 꼭 필요한 것만 — 검토자에겐 '읽기 도구'만 주면 실수로 파일을 고칠 일이 없음.", 0.5, 5.6, 15, 0.75, { size: 16, fill: "CCFBF1" });
  note(s, "공식: code-reviewer는 Read/Grep/Glob만(읽기 전용), debugger는 Edit 포함. each subagent excels at one task, Write detailed descriptions, Limit tool access. 출처: https://code.claude.com/docs/en/sub-agents");
  return s;
}

async function createSlide06(pptx) {
  const s = pptx.addSlide({ masterName: "MASTER" });
  K.headerBar(s, C.step3); K.pageHeader(s, "데스크톱 앱에서 서브에이전트 만들기", ".claude/agents/이름.md — 설정 칸 + 본문(역할 지침)");
  sectionTitle(s, "만드는 흐름", 0.5, 1.75, 7, C.primary, 16);
  const steps = [
    ["① 부탁: \"읽기 전용 코드 검토자 에이전트를 만들어줘\"", C.step1],
    ["② 승인: .claude/agents/code-reviewer.md 생성 제안 → diff Accept", C.step3],
    ["③ 호출: \"방금 변경분을 검토해줘\" → 메인이 자동 위임", C.green],
  ];
  let y = 2.2; for (const [l, col] of steps) { K.flowStep(s, 0.5, y, 7.2, 0.9, l, col, 16); y += 1.02; }
  K.codeBlock(s, "---\nname: code-reviewer\ndescription: Reviews code for quality and best practices\ntools: Read, Glob, Grep\nmodel: sonnet\n---\n당신은 코드 검토자입니다. 변경분의 버그·보안·\n가독성을 점검하고 우선순위별 수정안을 제시하세요.", 8.0, 2.2, 7.5, 3.1, 16);
  K.highlight(s, "핵심: 데스크톱 Code 탭은 /agents 메뉴 미지원 → ⚙️ Settings 또는 .claude/agents 파일로 구성. 꼭 필요한 건 name·description 둘뿐(tools·model은 선택).", 0.5, 5.6, 15, 0.78, { size: 16, fill: "CCFBF1" });
  note(s, "공식 frontmatter: 필수 name·description, 선택 tools(생략 시 전체 상속)·model. 저장: .claude/agents/ 또는 ~/.claude/agents/. 본문=시스템 프롬프트. Code 탭 /agents 미지원→Settings. 파일 직접 추가 시 세션 재시작. 출처: https://code.claude.com/docs/en/sub-agents , https://code.claude.com/docs/en/desktop");
  return s;
}

async function createSlide07(pptx) {
  const s = pptx.addSlide({ masterName: "MASTER" });
  K.headerBar(s, C.step5); K.pageHeader(s, "하네스 엔지니어링 — 비용·성능·보안으로 조율", "마구 늘리지 말고 알맞게");
  const cards = [
    { hd: "비용 (Cost)", col: C.catA, lines: ["단순·반복 역할은 저렴·빠른 모델(예: Haiku)에", "서브에이전트가 많을수록 결과가 메인에 모이니 꼭 필요한 만큼만"] },
    { hd: "성능 (Performance)", col: C.catC, lines: ["독립적인 일은 병렬로 동시에", "무거운 출력(로그·검색)은 서브에이전트가 흡수하고 요약만 전달"] },
    { hd: "보안 (Security)", col: C.catE, lines: ["역할별 도구·권한 최소화(검토자=읽기 전용)", "위험 작업은 사람이 diff로 최종 승인"] },
  ];
  const cw = 4.85, gap = 0.22; let x = 0.5;
  for (const c of cards) { headerCard(s, x, 2.0, cw, 2.75, c.hd, c.col, c.lines); x += cw + gap; }
  K.addImage(s, IMG("s7_harness_tuning.png"), { x: 0.5, y: 4.95, w: 6.5, h: 1.85, sizing: { type: "contain", w: 6.5, h: 1.85 } });
  K.highlight(s, "한 줄 요점: \"더 많이\"가 아니라 \"역할마다 알맞은 모델·권한·동시성\" — 같은 일을 더 싸고·빠르고·안전하게.", 7.3, 4.95, 8.2, 1.85, { size: 17, fill: "CCFBF1" });
  note(s, "하네스=비용·성능·보안 조율. 비용(Haiku 라우팅·과다 경고), 성능(병렬·요약 흡수), 보안(도구 제한·diff 승인). 출처: https://code.claude.com/docs/en/sub-agents");
  return s;
}

async function createSlide08(pptx) {
  const s = pptx.addSlide({ masterName: "MASTER" });
  K.headerBar(s, C.green); K.pageHeader(s, "빌트인 활용 — PR 품질·보안 병렬 검토", "검토자를 안 만들어도 내장 스킬이 대신");
  headerCard(s, 0.5, 2.0, 7.4, 2.5, "/code-review · 코드 품질 점검", C.catB, [
    { t: "지금 변경한 코드의 버그·정리할 곳을 점검 — 품질 관점 검토자 역할 대신", color: C.body },
  ]);
  headerCard(s, 8.1, 2.0, 7.4, 2.5, "/security-review · 보안 점검", C.catD, [
    { t: "변경분을 보안 취약점(인젝션·인증 문제·데이터 노출) 관점에서 분석 — ICTK 보안 기업에 특히 유용", color: C.body },
  ]);
  bullets(s, [
    { t: "병렬의 힘: 두 검토를 함께(동시에) 돌리면 품질·보안을 한 번에 — 작성자 스킬과 이어 붙이면 \"작성 → (품질·보안 동시 검토) → 보고\" 완성", bold: true, color: C.primary },
  ], 0.55, 4.7, 15, 0.9, { gap: 6, size: 16 });
  K.highlight(s, "참고: /simplify는 내부적으로 네 개의 검토 에이전트를 병렬로 돌림 — '한 스킬이 여러 보조 AI를 부른다'는 오늘의 개념이 빌트인에 이미 적용된 예.", 0.5, 5.75, 15, 0.75, { size: 16, fill: "CCFBF1" });
  note(s, "CLI 플래그 비노출. /code-review='checks the diff for correctness bugs and cleanups', /security-review=보안 취약점 분석. /simplify=4개 검토 에이전트 병렬. 출처: https://code.claude.com/docs/en/commands");
  return s;
}

async function createSlide09(pptx) {
  const s = pptx.addSlide({ masterName: "MASTER" });
  K.headerBar(s, C.step5); K.pageHeader(s, "실습 — 작성자→검토자 2단계 / 주간 기술부채 리포트", "오늘의 손으로 해보기");
  headerCard(s, 0.5, 2.0, 7.4, 3.3, "① 작성자 → 검토자 2단계 [직접]", C.catB, [
    { t: "3회차 정보조사 스킬을 Skill+Agent로 변환 + 하네스 엔지니어링 추가", color: C.body },
    { t: "메인이 작성자에 초안 위임 → 검토자(읽기 전용)가 품질·보안 점검 → 메인 종합", color: C.primary },
    { t: "커밋 전 코드검토를 /code-review·/security-review 병렬로 붙여 체험", color: C.body },
  ]);
  headerCard(s, 8.1, 2.0, 7.4, 3.3, "② 주간 기술부채 리포트 [데모]", C.catC, [
    { t: "지난 7일 머지된 PR 조회 → 각 PR을 병렬로 리뷰 → 팀 주간 리포트 한 번에 생성", color: C.body },
    { t: "여러 PR을 동시에(병렬) 검토하고 결과를 하나의 리포트로 종합하는 다단계 자동화 체험", color: C.primary },
  ]);
  K.highlight(s, "오늘의 산출물: 직접 만드는 것은 ①(Skill + Agent) — 메인 스킬 + 서브에이전트(작성자·검토자) + 하네스(모델·권한·병렬) 적용.", 0.5, 5.6, 15, 0.75, { size: 17 });
  note(s, "실습 2종. ①=3회차 스킬을 Skill+Agent로 변환+하네스(직접). ②=주간 기술부채 리포트(GitHub·다수 PR 병렬, 데모). 출처: https://code.claude.com/docs/en/sub-agents , https://code.claude.com/docs/en/commands");
  return s;
}

async function createSlide10(pptx) {
  const s = pptx.addSlide({ masterName: "MASTER" });
  K.headerBar(s, C.step4); K.pageHeader(s, "ICTK 안전 수칙 — 권한 최소·사람 최종 승인·정보 격리", "여러 일꾼을 부려도 흔들리지 않는 3원칙");
  const cards = [
    { hd: "1. 서브에이전트 권한 최소", col: C.catB, lines: ["역할에 꼭 필요한 도구만 — 검토자는 읽기 전용", "작성자도 폴더 밖은 못 건드림(데이터 격리)"] },
    { hd: "2. 사람 최종 승인", col: C.catC, lines: ["자동으로 굴러가도 편집·실행은 diff Accept/Reject", "되돌리기 어려운 작업(배포·제출)은 사람이 직접"] },
    { hd: "3. 민감정보 격리", col: C.catE, lines: ["비밀번호·고객정보·ICTK 핵심 보안 자산은 에이전트/스킬 파일에 그대로 적지 말 것", "파일은 공유·커밋될 수 있음"] },
  ];
  const cw = 4.85, gap = 0.22; let x = 0.5;
  for (const c of cards) { headerCard(s, x, 2.4, cw, 3.0, c.hd, c.col, c.lines); x += cw + gap; }
  K.highlight(s, "프롬프트 인젝션 경계: 외부 문서·PR 속 숨은 지시문이 서브에이전트를 속일 수 있으니, 신뢰되지 않은 입력은 검토자 단계에서 한 번 더 걸러냄.", 0.5, 5.65, 15, 0.7, { size: 16, fill: "CCFBF1" });
  note(s, "도구 제한·검토자 읽기 전용·diff 승인·민감정보 비기재(.claude/agents·SKILL.md는 커밋 대상). 프롬프트 인젝션은 다단계에서 검토자가 추가 방어선. 출처: https://code.claude.com/docs/en/sub-agents , https://code.claude.com/docs/en/skills");
  return s;
}

async function createSlide11(pptx) {
  const s = pptx.addSlide({ masterName: "MASTER" });
  K.headerBar(s, C.green); K.pageHeader(s, "정리 · 2주 과제 · 6회차(Plugin) 예고", "오늘 요약 / 흐름 / 할 일 / 다음");
  K.card(s, 0.5, 1.65, 7.4, 2.5, "ECFDF5", C.green);
  sectionTitle(s, "오늘 배운 것", 0.75, 1.77, 6, "0F766E", 17);
  bullets(s, [
    { t: "Skill + Agent = 역할 나눈 다단계: 메인이 분배 → 실행 → 종합 / 서브에이전트는 .claude/agents 파일(필수 name·description), 데스크톱은 ⚙️ Settings/파일", color: C.primary },
    { t: "하네스 엔지니어링: 비용(저렴 모델)·성능(병렬·요약)·보안(권한 최소·사람 승인) / 빌트인(/code-review·/security-review) 병렬 활용", color: C.primary },
  ], 0.78, 2.27, 6.9, 1.8, { gap: 9, size: 16 });
  sectionTitle(s, "회차 흐름", 8.3, 1.65, 7, C.primary, 17);
  K.table(s, [
    K.headRow(["회차", "핵심", "한 줄"]),
    ["4회차", "Skill + 웹/외부 MCP", "Claude를 바깥 세계와 연결"],
    [{ text: "5회차(오늘)", options: { bold: true, color: C.primary, fontFace: FONT, fontSize: fs16(16) } },
     { text: "Skill + Agent(다단계)", options: { bold: true, color: C.primary, fontFace: FONT, fontSize: fs16(16) } },
     { text: "역할 나눠 맡기고 종합", options: { bold: true, color: C.green, fontFace: FONT, fontSize: fs16(16) } }],
    ["6회차(예고)", "Plugin", "스킬·에이전트·MCP 묶어 배포"],
  ], { x: 8.3, y: 2.1, w: 7.2, colW: [1.8, 3.0, 2.4], rowH: [0.5, 0.62, 0.62, 0.62], fontSize: 16, align: "left" });
  K.highlight(s, "2주 과제 — 3회차 스킬을 Skill+Agent로: ① 역할 나누기(작성자·검토자 서브에이전트) → ② 하네스 적용(역할별 모델·권한·병렬) → ③ 실사용·개선(= 6회차 Plugin 패키징 재료)", 0.5, 4.55, 15, 0.85, { size: 16, fill: "FEF3C7", color: "92400E" });
  K.highlight(s, "6회차 예고 — Plugin: 오늘 만든 스킬·서브에이전트와 4회차 MCP를 하나의 Plugin으로 묶어 팀·전사에 사내 표준으로 배포합니다.", 0.5, 5.6, 15, 0.85, { size: 17 });
  note(s, "정리. 회차 흐름 4→5→6. 2주 과제(3회차 스킬을 Skill+Agent로, 6회차 재료). 출처: https://code.claude.com/docs/en/sub-agents , https://code.claude.com/docs/en/skills");
  return s;
}

async function main() {
  const pptx = K.newDeck();
  pptx.author = "Unicorn / 이해경"; pptx.company = "ICTK";
  pptx.subject = "Claude Code 업무 자동화 부트캠프 5회차"; pptx.title = "5회차 — Skill + Agent 개발";
  K.defineMaster(pptx, FOOTER);
  const slides = [createSlide01, createSlide02, createSlide03, createSlide04, createSlide05, createSlide06, createSlide07, createSlide08, createSlide09, createSlide10, createSlide11];
  for (const fn of slides) await fn(pptx);
  const out = path.join(__dirname, "5회차-Skill-Agent개발.pptx");
  await pptx.writeFile({ fileName: out });
  console.log("✅ PPT 생성 완료:", out, "| 슬라이드:", slides.length);
}
main().catch((e) => { console.error("❌ PPT 생성 실패:", e); process.exit(1); });
