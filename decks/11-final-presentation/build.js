// build.js — ICTK 부트캠프 11회차(최종) "최종 발표" PPT 빌드 (10장)
"use strict";
const path = require("path");
const K = require(path.join(__dirname, "..", "_lib", "pptkit"));
const { C, FONT, fs16, PAGE_W } = K;
const IMG = (f) => path.join(__dirname, "images", f);
const FOOTER = "ⓒ ICTK · Unicorn — Claude Code 업무 자동화 부트캠프 11회차 · 무단전재 및 배포 금지";

function bullets(slide, items, x, y, w, h, opts = {}) {
  const runs = items.map((it) => ({ text: it.t !== undefined ? it.t : it,
    options: { fontFace: FONT, fontSize: fs16(it.size || opts.size || 16), bold: !!it.bold, color: it.color || opts.color || C.body,
      bullet: it.bullet === false ? false : { code: "2022", indent: 14 }, breakLine: true, paraSpaceAfter: opts.gap !== undefined ? opts.gap : 7, indentLevel: it.lvl || 0 } }));
  slide.addText(runs, { x, y, w, h, align: "left", valign: "top", lineSpacingMultiple: opts.lsm || 1.05 });
}
function sectionTitle(slide, str, x, y, w, color = C.primary, size = 17) { slide.addText(str, { x, y, w, h: 0.4, align: "left", valign: "middle", fontFace: FONT, bold: true, fontSize: fs16(size), color }); }
function note(slide, txt) { slide.addNotes(txt); }
function headerCard(slide, x, y, w, h, hd, col, lines) {
  K.card(slide, x, y, w, h); K.roundRect(slide, x, y, w, 0.55, col, { radius: 0.08 });
  slide.addText(hd, { x, y, w, h: 0.55, align: "center", valign: "middle", fontFace: FONT, bold: true, fontSize: fs16(16), color: C.white });
  bullets(slide, lines.map(t => (typeof t === "string" ? { t, color: C.body } : t)), x + 0.22, y + 0.68, w - 0.44, h - 0.8, { gap: 6, size: 16 });
}
function titleBand(s, kicker, title, subtitle, titleSize) {
  K.rect(s, 0, 0, PAGE_W, 3.05, C.primary); K.rect(s, 0, 0, 0.28, 3.05, C.green);
  s.addText(kicker, { x: 0.95, y: 0.55, w: 13.8, h: 0.5, fontFace: FONT, bold: true, fontSize: fs16(20), color: "7FE7C4" });
  s.addText(title, { x: 0.95, y: 1.05, w: 14.3, h: 0.95, fontFace: FONT, bold: true, fontSize: fs16(titleSize || 42), color: C.white });
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
  titleBand(s, "Claude Code 업무 자동화 부트캠프 · 11회차(최종) / 11회차", "최종 발표", "33시간의 여정을 \"동작하는 자동화\"로 증명 — 조별·개인별 플러그인 발표로 마무리");
  infoCards(s, [
    { hd: "대상", col: C.catA, t: "ICTK 임직원 (비개발자 포함 입문자)" },
    { hd: "도구", col: C.catD, t: "Claude Code 데스크톱 앱 — \"Code\" 탭 (GUI)" },
    { hd: "흐름", col: C.catB, t: "PoC 회고 → [pw·컴퓨터유즈] 마무리·패키징 → 발표·평가 → 수료·현업 적용" },
  ]);
  K.highlight(s, "오늘의 핵심: 9~11회차 PoC와 검증 워크플로우를 하나의 Plugin으로 묶어 조별·개인별로 발표하고, 30/60/90일 현업 적용 계획으로 수료합니다.", 0.5, 5.55, 15, 0.75, { size: 17, bold: true });
  note(s, "11회차(최종) 캡스톤. [pw·컴퓨터유즈] 개발 + 9~11 PoC·검증 워크플로우 Plugin 패키징 + 발표·평가·수료. 출처: curriculum-plan.md 2장·3-11절·4절");
  return s;
}

async function createSlide02(pptx) {
  const s = pptx.addSlide({ masterName: "MASTER" });
  K.headerBar(s, C.green); K.pageHeader(s, "전체 여정 회고 — Prompt에서 ICTK PoC까지", "단계마다 만들 수 있는 자동화 범위가 넓어졌다");
  K.table(s, [
    K.headRow(["학습 골격 단계", "회차", "무엇을 할 수 있게 됐나"]),
    ["① Prompt", "1~2", "5요소 프롬프트 / 커넥터·루틴·Computer use 맛보기"],
    ["② Skill", "3~4", "반복 작업을 SKILL.md로 승격 / 웹·자작 MCP 결합"],
    ["③ Skill+Agent", "5", "작성자→검토자 다단계 워크플로우"],
    ["④ Plugin", "6", "검증된 워크플로우를 묶어 사내 표준 배포"],
    ["확장 → ⑤ ICTK PoC", "7~8 / 9~11", "파이썬·LLM API·자작 MCP / 자사 실제 업무 PoC·발표"],
  ], { x: 0.5, y: 1.75, w: 9.3, colW: [2.7, 1.3, 5.3], rowH: [0.5, 0.62, 0.62, 0.62, 0.62, 0.78], fontSize: 16, align: "left" });
  K.addImage(s, IMG("s2_journey_roadmap.png"), { x: 10.1, y: 1.85, w: 5.4, h: 4.4, sizing: { type: "contain", w: 5.4, h: 4.4 } });
  note(s, "캡스톤 회고. 학습 골격(Prompt→Skill→Skill+Agent→Plugin→확장→ICTK PoC)을 curriculum-plan 2장 로드맵 그대로. 수치 임의 창작 금지. 출처: curriculum-plan.md 2장, _xlsx_dump.txt 커리큘럼");
  return s;
}

async function createSlide03(pptx) {
  const s = pptx.addSlide({ masterName: "MASTER" });
  K.headerBar(s, C.step4); K.pageHeader(s, "[pw·컴퓨터유즈] 마무리 — \"공식 길\"부터, 사람이 게이트", "화면을 흉내 내기 전에 더 안전한 길을 먼저");
  sectionTitle(s, "자동화 수단 우선순위 (위가 더 안전)", 0.5, 1.7, 7, C.primary, 16);
  const steps = [
    ["① 공식 Export·Open API — 있으면 무조건 우선", C.step1],
    ["② 웹 자동 조작(Playwright MCP) — 로그인·최종 제출은 사람", C.step2],
    ["③ Computer use(화면 직접 조작) — 둘 다 불가할 때만 최후 수단", C.step4],
    ["④ 고위험 단계는 제외 — 사인오프·인증서 발급·전표 입력", C.arrow],
  ];
  let y = 2.15; for (const [l, col] of steps) { K.flowStep(s, 0.5, y, 7.5, 0.78, l, col, 16); y += 0.9; }
  K.card(s, 8.3, 2.15, 7.2, 3.1, "FEF2F2", "DC2626");
  sectionTitle(s, "⚠ 착수 전 차단 게이트 (시작 전 검토)", 8.5, 2.27, 6.8, "DC2626", 16);
  bullets(s, [
    { t: "약관(ToS) 위반 여부", color: C.primary, bold: true },
    { t: "로봇 정책(robots) 허용 여부", color: C.primary, bold: true },
    { t: "인증(2FA·공동인증서) 리스크", color: C.primary, bold: true },
  ], 8.5, 2.8, 6.8, 2.3, { gap: 12, size: 16 });
  K.highlight(s, "핵심: 로그인·최종 제출·발급·전표 입력처럼 되돌리기 어려운 행위는 반드시 사람이 직접. Computer use는 잔여 범위에만, 고위험 단계는 아예 제외.", 0.5, 5.5, 15, 0.8, { size: 16, fill: "CCFBF1" });
  note(s, "curriculum 3-11 ICTK 전제. 공식 길 우선→사람 게이트→Computer use 최후 수단→고위험 제외. 착수 전 차단(ToS·robots·2FA/공동인증서). 출처: curriculum-plan.md 3-11절·1-4절");
  return s;
}

async function createSlide04(pptx) {
  const s = pptx.addSlide({ masterName: "MASTER" });
  K.headerBar(s, C.step2); K.pageHeader(s, "최종 패키징 — 9~11회차 PoC를 하나의 Plugin으로", "흩어진 PoC와 검증 절차를 설치 가능한 Plugin으로");
  K.card(s, 0.5, 1.75, 9.0, 2.0, "ECFDF5", C.green);
  sectionTitle(s, "무엇을 묶나", 0.72, 1.87, 8, "0F766E", 16);
  bullets(s, [
    { t: "9회차 [지침만] + 10회차 [MCP·API] + 11회차 [pw·컴퓨터유즈] PoC", color: C.primary },
    { t: "+ 검증(작성→검토) 워크플로우(5회차) → 하나의 Plugin(스킬+서브에이전트+MCP 묶음)", color: C.primary },
  ], 0.75, 2.35, 8.5, 1.3, { gap: 9, size: 16 });
  K.card(s, 0.5, 3.95, 9.0, 2.4);
  sectionTitle(s, "패키징 체크리스트", 0.72, 4.07, 8, C.teal, 16);
  bullets(s, [
    { t: "구성요소: SKILL.md · 서브에이전트 · 필요한 MCP 설정이 한 폴더에", color: C.body },
    { t: "설치 가이드(README): 무엇을·어떻게 설치·실행하는지(6회차 절차)", color: C.body },
    { t: "검증 단계 내장: \"작성→검토\"로 누락·오류를 한 번 더 걸러 품질 게이트 확보", color: C.body },
  ], 0.75, 4.55, 8.5, 1.7, { gap: 8, size: 16 });
  K.addImage(s, IMG("s4_plugin_packaging.png"), { x: 9.8, y: 1.95, w: 5.7, h: 4.3, sizing: { type: "contain", w: 5.7, h: 4.3 } });
  note(s, "curriculum 3-11 핵심: 9~11 PoC + 검증(작성→검토) 워크플로우를 Plugin으로 패키징(6회차). 검증=5회차 작성자→검토자. 출처: curriculum-plan.md 3-11절·3-5·3-6절");
  return s;
}

async function createSlide05(pptx) {
  const s = pptx.addSlide({ masterName: "MASTER" });
  K.headerBar(s, C.step5); K.pageHeader(s, "발표 구성 — 5단계 스토리라인", "문제에서 시작해 효과로 끝낸다 (5분)");
  sectionTitle(s, "발표 5단계", 0.5, 1.7, 6, C.primary, 16);
  const steps = [["① 문제 — 현업의 반복·비효율", C.step1], ["② 해결 자동화 — 어떤 Skill·Agent·Plugin으로", C.step2], ["③ 데모 — 실제 동작 화면(말보다 시연)", C.step3], ["④ 효과 — 베이스라인 대비 얼마나 줄었나", C.step4], ["⑤ 다음 단계 — 현업 확대·고도화 한 줄", C.step5]];
  let y = 1.95; for (const [l, col] of steps) { K.flowStep(s, 0.5, y, 7.3, 0.66, l, col, 16); y += 0.78; }
  K.card(s, 8.3, 1.95, 7.2, 3.2, C.cardBg, C.cardBorder);
  sectionTitle(s, "단계별 말할 거리", 8.5, 2.07, 6.8, C.teal, 16);
  bullets(s, [
    { t: "문제는 숫자로(주 N건·건당 N분), 효과도 같은 잣대로 비교", color: C.body },
    { t: "데모는 준비된 입력으로 한 번에 — 즉석 입력은 실패 위험", color: C.body },
  ], 8.5, 2.6, 6.8, 2.5, { gap: 14, size: 16 });
  K.highlight(s, "핵심: 효과는 반드시 베이스라인 대비로 — \"빨라졌다\"가 아니라 \"30분→5분\"처럼. 단, 측정값은 본인 PoC로 직접 측정한 내부 수치만 사용(외부 수치 임의 인용 금지).", 0.5, 5.45, 15, 0.8, { size: 16, fill: "CCFBF1" });
  note(s, "발표 5단계(문제→해결→데모→효과→다음). 베이스라인 대비(curriculum 1-4 정직한 측정·3-11 2주 과제). 데모는 준비된 입력. 출처: curriculum-plan.md 3-11절·1-4절");
  return s;
}

async function createSlide06(pptx) {
  const s = pptx.addSlide({ masterName: "MASTER" });
  K.headerBar(s, C.step3); K.pageHeader(s, "평가 · 수료 기준 — 무엇으로 수료가 결정되나", "시험 점수가 아니라 실습 산출물·적용 노력으로");
  K.table(s, [
    K.headRow(["영역", "비중", "평가 방법"]),
    [{ text: "출석", options: { bold: true, color: C.primary, fontFace: FONT, fontSize: fs16(16) } }, "30%", "11회차 중 80% 이상(9회차 이상) 출석"],
    [{ text: "과제 수행", options: { bold: true, color: C.primary, fontFace: FONT, fontSize: fs16(16) } }, "40%", "2주 과제 제출·실행 기록(10회 중 70% 이상 제출)"],
    [{ text: "최종 PoC", options: { bold: true, color: C.primary, fontFace: FONT, fontSize: fs16(16) } }, "30%", "9~11회차 자사 PoC 개발 + 11회차 발표"],
  ], { x: 0.5, y: 1.8, w: 15, colW: [2.2, 1.5, 11.3], rowH: [0.5, 0.78, 0.78, 0.78], fontSize: 16, align: "left" });
  bullets(s, [
    { t: "수료 기준(셋 다 충족): 출석 80%↑(9회차↑) 그리고 과제 70%↑ 제출 그리고 최종 PoC 발표 완료", bold: true, color: C.primary },
    { t: "최종 PoC는 1개 이상을 동작하는 형태로 구현(Skill·Skill+Agent·Plugin 중 택1 이상)", color: C.body },
  ], 0.55, 4.5, 15, 1.1, { gap: 8, size: 16 });
  K.highlight(s, "가점: 보안 거버넌스(데이터 격리·사람 최종 승인 등) 게이트를 PoC 설계서에 명시하면 가점.", 0.5, 5.85, 15, 0.7, { size: 16, fill: "FEF3C7", color: "92400E" });
  note(s, "평가 비중·수료 기준은 _xlsx_dump '평가 및 교육환경' 시트 정확 일치(출석 0.3·과제 0.4·PoC 0.3). 수료=AND 3조건. 보안 게이트 명시 가점. 출처: _xlsx_dump.txt, curriculum-plan.md 4절");
  return s;
}

async function createSlide07(pptx) {
  const s = pptx.addSlide({ masterName: "MASTER" });
  K.headerBar(s, C.step5); K.pageHeader(s, "우수 플러그인 선정 관점 — 4가지 잣대", "화려함보다 \"실제로 쓸 수 있는가\"");
  const cards = [
    { hd: "① 실현성 · 정말 동작하는가", col: C.catA, t: "데모에서 실제로 돌아가고, 현업 입력에 견디는가" },
    { hd: "② 교육효과 · 배운 걸 잘 녹였는가", col: C.catB, t: "Skill·Agent·Plugin 등 학습 골격을 적절히 활용했는가" },
    { hd: "③ 보안 준수 · 게이트를 지켰는가", col: C.catC, t: "데이터 격리·사람 최종 승인·고위험 제외를 설계에 반영했는가" },
    { hd: "④ 재사용성 · 남도 쓸 수 있는가", col: C.catD, t: "README·구성요소가 정리돼 동료가 설치·재사용 가능한가" },
  ];
  const cw = 7.4, ch = 2.05; const xs = [0.5, 8.1]; const ys = [2.1, 4.35]; let i = 0;
  for (const c of cards) {
    const x = xs[i % 2], y = ys[Math.floor(i / 2)];
    K.card(s, x, y, cw, ch); K.roundRect(s, x, y, cw, 0.52, c.col, { radius: 0.08 });
    s.addText(c.hd, { x, y, w: cw, h: 0.52, align: "center", valign: "middle", fontFace: FONT, bold: true, fontSize: fs16(16), color: C.white });
    K.text(s, c.t, x + 0.25, y + 0.66, cw - 0.5, 1.2, { size: 16, color: C.body }); i++;
  }
  K.highlight(s, "실현성(실제 동작)을 최우선으로 — 발표의 데모와 직결됩니다. 보안 준수는 평가 가점·거버넌스와 연결.", 0.5, 6.6, 15, 0.6, { size: 16, fill: "CCFBF1" });
  note(s, "우수 선정 4관점(실현성·교육효과·보안 준수·재사용성). 실현성 최우선(데모). 보안 준수=가점 연결. 출처: curriculum-plan.md 1-3절·4-2절·3-11절");
  return s;
}

async function createSlide08(pptx) {
  const s = pptx.addSlide({ masterName: "MASTER" });
  K.headerBar(s, C.step4); K.pageHeader(s, "ICTK 보안 거버넌스 최종 점검 — 5대 기본기", "편리해도 흔들리지 않는, 발표 전 마지막 점검");
  const top = [
    { hd: "① 데이터 격리", col: C.catB, lines: ["온프레미스·격리 실행·비학습(학습 안 함) 정책", "핵심 자산은 격리 환경에서만"] },
    { hd: "② 사람 최종 승인", col: C.catC, lines: ["로그인·최종 제출·발급·전표 입력은 사람이 직접(Human-in-the-loop)"] },
    { hd: "③ 최소 권한", col: C.catD, lines: ["도구 권한은 꼭 필요한 만큼만 부여"] },
  ];
  const cw = 4.85, gap = 0.22; let x = 0.5;
  for (const c of top) { headerCard(s, x, 2.05, cw, 2.0, c.hd, c.col, c.lines); x += cw + gap; }
  const bot = [
    { hd: "④ 감사로그", col: C.catE, lines: ["실행 이력을 기록해 추적 가능하게"] },
    { hd: "⑤ 고위험 제외", col: C.catA, lines: ["사인오프·인증서 발급·전표 입력은 자동화 범위에서 제외"] },
  ];
  const cw2 = 7.4; const xs2 = [0.5, 8.1]; let j = 0;
  for (const c of bot) { headerCard(s, xs2[j], 4.2, cw2, 1.5, c.hd, c.col, c.lines); j++; }
  K.highlight(s, "한 줄 점검: 발표할 PoC가 위 5가지 중 무엇을 어떻게 지켰는지 설계서에 한 문장씩 적어두면 슬라이드 6의 가점으로 직결.", 0.5, 5.95, 15, 0.7, { size: 16, fill: "CCFBF1" });
  note(s, "보안 5대 기본기(curriculum 1-4): 데이터 격리·사람 최종 승인·최소 권한·감사로그·고위험 제외. 가점 연결. 출처: curriculum-plan.md 1-4절·3-11절");
  return s;
}

async function createSlide09(pptx) {
  const s = pptx.addSlide({ masterName: "MASTER" });
  K.headerBar(s, C.step2); K.pageHeader(s, "30 / 60 / 90일 업무 적용 계획 템플릿", "수료가 끝이 아니라 시작");
  K.table(s, [
    K.headRow(["기간", "목표", "핵심 행동(예시)"]),
    [{ text: "30일", options: { bold: true, color: C.primary, fontFace: FONT, fontSize: fs16(16), align: "center" } }, "시범 적용", "발표한 PoC/Plugin을 본인 업무에 1건 실제 적용, 베이스라인(소요시간·누락) 측정"],
    [{ text: "60일", options: { bold: true, color: C.primary, fontFace: FONT, fontSize: fs16(16), align: "center" } }, "개선·확대", "개선점 반영, 소속 팀 동료 1~2명에게 시범 배포·피드백 수집"],
    [{ text: "90일", options: { bold: true, color: C.primary, fontFace: FONT, fontSize: fs16(16), align: "center" } }, "정착·공유", "효과(베이스라인 대비)를 정리·공유, 차기 자동화 후보 1건 발굴"],
  ], { x: 0.5, y: 1.8, w: 15, colW: [1.4, 2.4, 11.2], rowH: [0.5, 0.78, 0.78, 0.78], fontSize: 16, align: "left" });
  bullets(s, [
    { t: "공통 원칙: 모든 단계에서 보안 게이트 유지(데이터 격리·사람 최종 승인) + 효과는 본인 측정값으로", color: C.body },
  ], 0.55, 4.5, 15, 0.6, { gap: 6, size: 16 });
  K.highlight(s, "수료 후 과제: 패키징한 Plugin을 소속 조직에 시범 배포하고 PoC 효과를 측정·공유하는 현업 적용 계획을 실행합니다.", 0.5, 5.4, 15, 0.7, { size: 16, fill: "FEF3C7", color: "92400E" });
  note(s, "30(시범 적용·베이스라인)→60(개선·동료 배포)→90(정착·효과 공유·차기 후보). _xlsx_dump 11회차 30/60/90 계획. 수치는 본인 업무로. 출처: _xlsx_dump.txt, curriculum-plan.md 3-11절·1-4절");
  return s;
}

async function createSlide10(pptx) {
  const s = pptx.addSlide({ masterName: "MASTER" });
  K.headerBar(s, C.green); K.pageHeader(s, "마무리 — 현업에서 계속 자라는 자동화", "여러분은 이제 \"직접 자동화를 만드는 사람\"입니다");
  K.card(s, 0.5, 1.75, 9.0, 4.0, "ECFDF5", C.green);
  bullets(s, [
    { t: "오늘의 결론: 프롬프트 한 줄에서 시작해 동작하는 Plugin까지 만들어 발표함 — 0에서 1을 만든 경험이 가장 큰 자산", color: C.primary, bold: true },
    { t: "계속 자라게 하는 법: ① 작게 현업 1건 적용 → ② 개선점 기록(다음 자동화 재료) → ③ 동료와 공유(사내 표준으로)", color: C.body },
    { t: "변하지 않는 기본기: 어떤 도구를 쓰든 데이터 격리 · 사람 최종 승인 — ICTK의 보안이 곧 신뢰", color: C.primary, bold: true },
  ], 0.78, 2.05, 8.5, 3.5, { gap: 18, size: 17, lsm: 1.15 });
  K.addImage(s, IMG("s10_completion_growth.png"), { x: 9.8, y: 1.9, w: 5.7, h: 4.3, sizing: { type: "contain", w: 5.7, h: 4.3 } });
  K.highlight(s, "다음 한 걸음: 30/60/90일 계획을 이번 주에 30일 항목부터 시작. 막히면 같은 부트캠프 동료가 가장 빠른 도움입니다.", 0.5, 6.0, 15, 0.75, { size: 17 });
  note(s, "캡스톤 마무리. 0→1 경험 강조. 지속 성장 3스텝(슬9 30/60/90과 정합). 데이터 격리·사람 최종 승인으로 닫음. 출처: curriculum-plan.md 1-2절·1-4절·3-11절");
  return s;
}

async function main() {
  const pptx = K.newDeck();
  pptx.author = "Unicorn / 이해경"; pptx.company = "ICTK";
  pptx.subject = "Claude Code 업무 자동화 부트캠프 11회차"; pptx.title = "11회차 — 최종 발표";
  K.defineMaster(pptx, FOOTER);
  const slides = [createSlide01, createSlide02, createSlide03, createSlide04, createSlide05, createSlide06, createSlide07, createSlide08, createSlide09, createSlide10];
  for (const fn of slides) await fn(pptx);
  const out = path.join(__dirname, "11회차-최종발표.pptx");
  await pptx.writeFile({ fileName: out });
  console.log("✅ PPT 생성 완료:", out, "| 슬라이드:", slides.length);
}
main().catch((e) => { console.error("❌ PPT 생성 실패:", e); process.exit(1); });
