// build.js — ICTK 부트캠프 6회차 "Plugin 개발 및 배포" PPT 빌드
"use strict";
const path = require("path");
const K = require(path.join(__dirname, "..", "_lib", "pptkit"));
const { C, FONT, fs16, PAGE_W } = K;
const IMG = (f) => path.join(__dirname, "images", f);
const FOOTER = "ⓒ ICTK · Unicorn — Claude Code 업무 자동화 부트캠프 6회차 · 무단전재 및 배포 금지";

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
  titleBand(s, "Claude Code 업무 자동화 부트캠프 · 6회차 / 11회차", "Plugin 개발 및 배포", "검증된 자동화를 '한 번에 설치되는 꾸러미'로 — 스킬·에이전트·MCP·훅을 묶어 팀에 배포");
  infoCards(s, [
    { hd: "대상", col: C.catA, t: "ICTK 임직원 (비개발자 포함 입문자)" },
    { hd: "도구", col: C.catD, t: "Claude Code 데스크톱 앱 — \"Code\" 탭 (GUI)" },
    { hd: "흐름", col: C.catB, t: "5회차 복습 → 6회차 Plugin → 2주 과제 → 7회차 예고" },
  ]);
  K.highlight(s, "오늘의 핵심: 검증된 스킬·에이전트·MCP·훅을 하나의 Plugin 꾸러미로 묶어 마켓플레이스로 배포·설치합니다.", 0.5, 5.55, 15, 0.75, { size: 18, bold: true });
  note(s, "6회차 시작. 5회차(Skill+Agent 다단계) 상기 → 오늘은 Plugin으로 묶어 팀 배포 + Hook. 데스크톱 Code 탭. 출처: https://code.claude.com/docs/en/plugins , https://code.claude.com/docs/en/discover-plugins");
  return s;
}

async function createSlide02(pptx) {
  const s = pptx.addSlide({ masterName: "MASTER" });
  K.headerBar(s, C.green); K.pageHeader(s, "WHY — 좋은 자동화를 '나 혼자'에서 '우리 팀'으로", "골든서클: WHY → HOW → WHAT");
  K.card(s, 0.5, 1.7, 7.5, 3.7, "ECFDF5", C.green);
  const gc = [
    { lb: "WHY", tx: "잘 만든 스킬·에이전트를 동료에게 주려면 폴더 복사·설정 설명이 필요 — 공유가 번거롭고 버전이 제각각", col: C.step4 },
    { lb: "HOW", tx: "관련 스킬·에이전트·MCP·훅을 한 폴더(Plugin)로 묶고 마켓플레이스에 올리면 클릭 한 번으로 설치", col: C.step3 },
    { lb: "WHAT", tx: "사내 표준 자동화를 버전과 함께 배포·업데이트 — 누구 PC에서나 같은 결과", col: C.green },
  ];
  let yy = 1.95; for (const g of gc) { K.badge(s, 0.75, yy, 1.3, g.lb, g.col, C.white, 0.5, 16); K.text(s, g.tx, 2.2, yy - 0.02, 5.6, 1.05, { size: 16, color: C.primary }); yy += 1.12; }
  K.table(s, [
    K.headRow(["구분", "5회차(개인)", "6회차(팀)"]),
    ["공유 방법", "폴더 복사·설정 설명", "마켓플레이스 클릭 설치"],
    ["보관 형태", "흩어진 SKILL.md·설정", "하나의 Plugin 꾸러미"],
    ["버전 관리", "사람이 수동 동기화", "version으로 자동 업데이트"],
  ], { x: 8.3, y: 1.7, w: 7.2, colW: [1.8, 2.7, 2.7], rowH: [0.5, 0.92, 0.92, 0.92], fontSize: 16, align: "left" });
  K.highlight(s, "오늘의 기대치: 5회차에서 만든 자동화를 동작하는 Plugin 1개로 패키징 — 동료가 설치해 바로 쓸 수 있는 상태로 완성.", 0.5, 5.7, 15, 0.75, { size: 17 });
  note(s, "골든서클. 공식 'Use plugins when you want to share... version control... marketplace'. 5회차(개인)→6회차(팀 배포) 대비. 출처: https://code.claude.com/docs/en/plugins");
  return s;
}

async function createSlide03(pptx) {
  const s = pptx.addSlide({ masterName: "MASTER" });
  K.headerBar(s, C.teal); K.pageHeader(s, "Plugin이란? — 자동화를 묶은 '앱 설치 꾸러미'", "설치하면 그 안의 기능이 한꺼번에 추가");
  K.highlight(s, "Plugin = 스킬·에이전트·MCP·훅을 한 폴더에 묶어 공유·설치하는 패키지", 0.5, 1.65, 15, 0.6, { size: 17, bold: true });
  const cards = [
    { hd: "한 번에 설치 (Bundle)", col: C.catA, t: "여러 스킬·에이전트·설정을 따로 옮길 필요 없이 꾸러미 하나로 설치" },
    { hd: "팀 공유 (Share)", col: C.catB, t: "마켓플레이스에 올리면 동료가 클릭으로 받아 씀 — 사내 표준으로 확산" },
    { hd: "버전·업데이트 (Version)", col: C.catD, t: "버전 번호를 붙여 배포하고, 고치면 업데이트로 전달 — 모두 같은 최신본" },
  ];
  let y = 2.4;
  for (const c of cards) {
    K.card(s, 0.5, y, 8.6, 1.32); K.roundRect(s, 0.5, y, 0.16, 1.32, c.col, { radius: 0.04 });
    s.addText(c.hd, { x: 0.85, y: y + 0.12, w: 8.0, h: 0.4, fontFace: FONT, bold: true, fontSize: fs16(17), color: c.col });
    K.text(s, c.t, 0.85, y + 0.55, 8.0, 0.7, { size: 16, color: C.body }); y += 1.42;
  }
  K.addImage(s, IMG("s3_plugin_bundle.png"), { x: 9.4, y: 2.4, w: 6.1, h: 4.0, sizing: { type: "contain", w: 6.1, h: 4.0 } });
  K.highlight(s, "쉬운 비유: Plugin은 스마트폰 앱 — 앱스토어(마켓플레이스)에서 설치하면 기능이 통째로 추가됩니다.", 0.5, 6.75, 8.6, 0.6, { size: 16, fill: "CCFBF1" });
  note(s, "공식: self-contained directory of components(skills/agents/hooks/MCP...). 입문자용 4종 한정. 비유=스마트폰 앱/앱스토어. 출처: https://code.claude.com/docs/en/plugins , https://code.claude.com/docs/en/plugins-reference");
  return s;
}

async function createSlide04(pptx) {
  const s = pptx.addSlide({ masterName: "MASTER" });
  K.headerBar(s, C.green); K.pageHeader(s, "Plugin 구성요소·디렉토리", "맨 위에 명함(plugin.json), 그 아래 기능별 폴더");
  K.codeBlock(s, "my-plugin/\n├── .claude-plugin/\n│   └── plugin.json   ← 명함(이름·버전·설명)\n├── skills/           ← 스킬들\n├── agents/           ← 에이전트들\n├── hooks/hooks.json  ← 훅(자동 실행)\n└── .mcp.json         ← MCP(외부 도구)", 0.5, 1.75, 7.1, 3.0, 16);
  K.table(s, [
    K.headRow(["구성요소", "위치", "담는 내용"]),
    ["명함(필수)", ".claude-plugin/plugin.json", "이름·버전·설명·작성자"],
    ["스킬", "skills/이름/SKILL.md", "자동화 레시피(3회차)"],
    ["에이전트", "agents/", "전문 역할 일꾼(4·5회차)"],
    ["훅", "hooks/hooks.json", "이벤트 자동 실행 규칙"],
    ["MCP", ".mcp.json", "외부 도구 연결 설정"],
  ], { x: 7.8, y: 1.75, w: 7.7, colW: [1.7, 3.2, 2.8], rowH: [0.48, 0.52, 0.52, 0.52, 0.52, 0.52], fontSize: 16, align: "left" });
  K.highlight(s, "핵심: 명함(plugin.json)에 꼭 필요한 건 이름(name) 하나. 나머지는 있는 것만 자동 인식. 주의: skills·agents·hooks는 폴더 맨 위에 — .claude-plugin/ 안에 넣으면 인식 안 됨.", 0.5, 5.6, 15, 0.85, { size: 16, fill: "CCFBF1" });
  note(s, "공식 'Plugin structure': .claude-plugin/엔 plugin.json만, skills/agents/hooks/.mcp.json은 plugin root. name 필수(네임스페이스). 출처: https://code.claude.com/docs/en/plugins , https://code.claude.com/docs/en/plugins-reference");
  return s;
}

async function createSlide05(pptx) {
  const s = pptx.addSlide({ masterName: "MASTER" });
  K.headerBar(s, C.step2); K.pageHeader(s, "마켓플레이스로 배포·설치 — 추가 → 설치 → 사용", "마켓플레이스 = 플러그인 앱스토어");
  sectionTitle(s, "설치 흐름 (GUI 3단계)", 0.5, 1.75, 7, C.primary, 16);
  const steps = [
    ["① 마켓플레이스 추가 — /plugin → Marketplaces 탭에서 카탈로그 추가", C.step1],
    ["② 플러그인 설치 — Discover 탭에서 선택 → 설치(범위 선택)", C.step3],
    ["③ 사용 — /reload-plugins 적용 → /플러그인:스킬 호출", C.green],
  ];
  let y = 2.2; for (const [l, col] of steps) { K.flowStep(s, 0.5, y, 7.1, 0.85, l, col, 16); y += 0.97; }
  K.codeBlock(s, "/plugin marketplace add 회사/저장소   ← 카탈로그 추가\n/plugin install 이름@마켓플레이스      ← 설치\n/reload-plugins                       ← 재시작 없이 적용", 8.0, 2.2, 7.5, 1.6, 16);
  K.addImage(s, IMG("s5_marketplace_flow.png"), { x: 8.0, y: 3.95, w: 7.5, h: 1.45, sizing: { type: "contain", w: 7.5, h: 1.45 } });
  K.highlight(s, "핵심: 데스크톱은 GUI가 기본 — /plugin 한 번으로 Discover·Installed·Marketplaces·Errors 4탭에서 처리. 설치 전 '무엇이 설치되는지'(스킬·훅·MCP 목록)를 상세 화면에서 확인.", 0.5, 5.6, 15, 0.85, { size: 16, fill: "CCFBF1" });
  note(s, "공식 2단계: marketplace 추가 → plugin 설치. /plugin 4탭. /plugin install name@marketplace, /reload-plugins. 'Will install' 검토. 출처: https://code.claude.com/docs/en/discover-plugins , https://code.claude.com/docs/en/plugins");
  return s;
}

async function createSlide06(pptx) {
  const s = pptx.addSlide({ masterName: "MASTER" });
  K.headerBar(s, C.step3); K.pageHeader(s, "버전 관리·업데이트 — 고치면 모두에게 최신본으로", "version 번호가 '언제 업데이트할지'를 정함");
  K.table(s, [
    K.headRow(["방식", "어떻게", "업데이트 동작", "적합한 경우"]),
    [{ text: "버전 명시", options: { bold: true, color: C.primary, fontFace: FONT, fontSize: fs16(16) } },
     "plugin.json에 \"version\": \"1.2.0\"", "번호를 올릴 때만 전달", "안정 배포 사내 표준"],
    [{ text: "버전 생략", options: { bold: true, color: C.primary, fontFace: FONT, fontSize: fs16(16) } },
     "version 비워 둠(Git 사용 시)", "매 변경마다 새 버전 취급", "빠르게 고치는 개발 중"],
  ], { x: 0.5, y: 1.8, w: 15, colW: [2.0, 5.0, 4.0, 4.0], rowH: [0.5, 0.95, 0.95], fontSize: 16, align: "left" });
  bullets(s, [
    { t: "업데이트 받기: /plugin update 또는 자동 업데이트로 최신본 수령 → 변경 시 /reload-plugins 안내", color: C.body },
    { t: "버전 올리기: MAJOR.MINOR.PATCH — 크게 바뀌면 앞자리, 기능 추가는 가운데, 버그 수정은 끝자리", color: C.body },
  ], 0.55, 4.55, 15, 1.0, { gap: 8, size: 16 });
  K.highlight(s, "🔒 ICTK: 버전을 명시하면 검증·승인된 버전만 팀에 퍼짐 — 무단 전파 방지로 '사람 최종 승인'과 맞음. 변경 이력은 CHANGELOG.md에 남겨 추적성 확보.", 0.5, 5.85, 15, 0.85, { size: 16, fill: "CCFBF1" });
  note(s, "공식: version 설정 시 매번 bump해야 전달(commit만으론 부족). 생략 시 git SHA가 버전. 시맨틱 버저닝. ICTK=검증 버전만 전파. 출처: https://code.claude.com/docs/en/plugins-reference , https://code.claude.com/docs/en/discover-plugins");
  return s;
}

async function createSlide07(pptx) {
  const s = pptx.addSlide({ masterName: "MASTER" });
  K.headerBar(s, C.step4); K.pageHeader(s, "Hook이란? — 특정 순간에 자동으로 실행되는 규칙", "도구 쓰기 직전 등에 끼어들어 허용·차단·수정");
  sectionTitle(s, "대표 이벤트", 0.5, 1.7, 6, C.primary, 16);
  const ev = [["PreToolUse — 도구 실행 직전: 위험하면 막기", C.step4], ["PostToolUse — 도구 실행 직후: 결과 점검·후처리", C.step2], ["UserPromptSubmit — 내가 프롬프트를 보낼 때", C.step3], ["SessionStart — 세션이 시작될 때", C.step1]];
  let y = 2.15; for (const [l, col] of ev) { K.flowStep(s, 0.5, y, 6.5, 0.6, l, col, 16); y += 0.72; }
  K.codeBlock(s, "hooks/hooks.json — 파일에 쓰기 직전 검사\n{ \"hooks\": { \"PreToolUse\": [\n  { \"matcher\": \"Write|Edit\",\n    \"hooks\": [{ \"type\": \"command\",\n      \"command\": \"비밀번호·키 패턴이면\n        차단(exit 2), 아니면 통과\" }] } ] } }", 7.3, 2.15, 8.2, 2.85, 16);
  K.addImage(s, IMG("s7_hook_gate.png"), { x: 0.5, y: 5.15, w: 6.5, h: 1.65, sizing: { type: "contain", w: 6.5, h: 1.65 } });
  K.highlight(s, "핵심: 훅은 사람이 일일이 검사하지 않아도 규칙대로 자동 작동 → ICTK처럼 민감정보가 새면 안 되는 환경에 강력. 차단(exit 2)뿐 아니라 마스킹(주민번호를 ******로)도 가능.", 7.3, 5.15, 8.2, 1.65, { size: 16, fill: "CCFBF1" });
  note(s, "공식 hooks: PreToolUse(실행 전, 차단 가능)·PostToolUse·UserPromptSubmit·SessionStart 등. exit 2로 차단 또는 JSON permissionDecision. command는 의사코드(실제는 셸). 출처: https://code.claude.com/docs/en/hooks , https://code.claude.com/docs/en/plugins");
  return s;
}

async function createSlide08(pptx) {
  const s = pptx.addSlide({ masterName: "MASTER" });
  K.headerBar(s, C.step5); K.pageHeader(s, "실습 ① — 정보조사 스킬+에이전트를 플러그인으로", "흩어진 자산을 꾸러미로 묶기 [직접 실습]");
  sectionTitle(s, "전환 흐름 (GUI 4단계)", 0.5, 1.7, 7, C.primary, 16);
  const steps = [
    ["① 폴더 만들기 — \"플러그인 폴더 만들어줘\" → plugin.json·skills/·agents/ 생성 제안 → diff Accept", C.step1],
    ["② 기존 자산 복사 — 5회차 SKILL.md·에이전트를 폴더로 이동(Claude가 정리)", C.step2],
    ["③ 로컬 테스트 — /plugin marketplace add ./내폴더 로 불러와 동작 확인", C.step3],
    ["④ 호출 — /내플러그인:정보조사 처럼 네임스페이스 이름으로 실행", C.green],
  ];
  let y = 2.15; for (const [l, col] of steps) { K.flowStep(s, 0.5, y, 7.5, 0.82, l, col, 16); y += 0.94; }
  K.codeBlock(s, ".claude-plugin/plugin.json\n{\n  \"name\": \"info-research\",\n  \"description\": \"주제를 조사해 레포트를 만듦.\n    정보조사가 필요할 때 사용.\",\n  \"version\": \"1.0.0\"\n}", 8.3, 2.15, 7.2, 2.9, 16);
  K.highlight(s, "핵심: Claude는 플러그인 형식을 이미 알고 있어 별도 도구 없이 폴더·명함·구성요소를 만들어 줌. 모든 생성·이동은 diff Accept/Reject로 사람이 최종 승인.", 0.5, 5.95, 15, 0.8, { size: 16, fill: "CCFBF1" });
  note(s, "공식 'Convert configurations to plugins' 흐름을 GUI로(프롬프트+diff Accept). 5회차 다단계 Skill 패키징. 네임스페이스 /plugin:skill. plugin.json name·description(3인칭)·version. 출처: https://code.claude.com/docs/en/plugins , https://code.claude.com/docs/en/discover-plugins");
  return s;
}

async function createSlide09(pptx) {
  const s = pptx.addSlide({ masterName: "MASTER" });
  K.headerBar(s, C.green); K.pageHeader(s, "실습 ② — PR 품질 보고서 플러그인 / Hook 민감정보 마스킹", "실용 기능 + 안전 훅 더하기");
  headerCard(s, 0.5, 2.0, 7.4, 3.3, "① PR 품질 보고서 플러그인 [직접]", C.catB, [
    { t: "변경분을 점검해 PR 품질 보고서를 만드는 스킬+에이전트를 플러그인에 담음", color: C.body },
    { t: "내장 /code-review(3회차)와 묶어, 팀이 같은 기준으로 PR을 점검하는 사내 표준 꾸러미 완성", color: C.primary },
  ]);
  headerCard(s, 8.1, 2.0, 7.4, 3.3, "② Hook 민감정보 마스킹 [데모]", C.catC, [
    { t: "hooks/hooks.json에 PreToolUse 훅 추가 — 파일에 쓰기 직전 비밀번호·키·주민번호 패턴을 찾아 차단 또는 ******로 마스킹", color: C.body },
    { t: "사람이 깜빡해도 규칙이 자동으로 민감정보 유출을 막음", color: C.primary },
  ]);
  K.highlight(s, "오늘의 산출물: 직접 만드는 것은 ①(PR 품질 보고서 플러그인) — plugin.json·skills/·agents/를 갖춘 동작하는 Plugin 1개.", 0.5, 5.6, 15, 0.75, { size: 17 });
  note(s, "실습 2종. ①=PR 품질 보고서 플러그인(직접, /code-review와 묶음). ②=PreToolUse 훅 마스킹(데모). 출처: https://code.claude.com/docs/en/hooks , https://code.claude.com/docs/en/plugins");
  return s;
}

async function createSlide10(pptx) {
  const s = pptx.addSlide({ masterName: "MASTER" });
  K.headerBar(s, C.step4); K.pageHeader(s, "ICTK 안전 수칙 — 플러그인도 '소프트웨어 설치처럼'", "편리해도 흔들리지 않는 3원칙");
  const cards = [
    { hd: "1. 신뢰 출처만", col: C.catB, lines: ["플러그인은 내 PC에서 코드를 실행할 수 있음 — 내가 만들었거나 Anthropic·사내 검증 마켓플레이스만", "설치 전 '무엇이 설치되는지' 확인"] },
    { hd: "2. 훅으로 민감정보 마스킹", col: C.catC, lines: ["PUF·암호 IP 등 핵심 보안 자산이 새지 않도록 PreToolUse 훅으로 쓰기 직전 자동 차단·마스킹", "사람 실수를 시스템이 보완"] },
    { hd: "3. 사람 최종 승인", col: C.catE, lines: ["파일 생성·배포는 diff Accept/Reject로 확인", "버전은 검증된 번호만 올려 무단 전파 차단"] },
  ];
  const cw = 4.85, gap = 0.22; let x = 0.5;
  for (const c of cards) { headerCard(s, x, 2.1, cw, 2.85, c.hd, c.col, c.lines); x += cw + gap; }
  K.addImage(s, IMG("s10_plugin_security.png"), { x: 0.5, y: 5.1, w: 6.4, h: 1.7, sizing: { type: "contain", w: 6.4, h: 1.7 } });
  K.highlight(s, "프롬프트 인젝션(외부 플러그인·문서 속 숨은 지시문이 Claude를 속이는 공격)을 경계 — 신뢰되지 않은 마켓플레이스 추가 금지.", 7.2, 5.1, 8.3, 1.7, { size: 16, fill: "CCFBF1" });
  note(s, "공식 경고: 플러그인·마켓플레이스는 임의 코드 실행 가능, 신뢰 출처만. 훅 마스킹(PUF·암호 IP). diff 승인+버전 명시. 출처: https://code.claude.com/docs/en/discover-plugins , https://code.claude.com/docs/en/plugins , https://code.claude.com/docs/en/hooks");
  return s;
}

async function createSlide11(pptx) {
  const s = pptx.addSlide({ masterName: "MASTER" });
  K.headerBar(s, C.green); K.pageHeader(s, "정리 · 회차 흐름 · 2주 과제 · 7회차 예고", "오늘 요약 / 흐름 / 할 일 / 다음");
  K.card(s, 0.5, 1.65, 7.4, 2.5, "ECFDF5", C.green);
  sectionTitle(s, "오늘 배운 것", 0.75, 1.77, 6, "0F766E", 17);
  bullets(s, [
    { t: "Plugin = 자동화를 묶은 앱 설치 꾸러미: 스킬·에이전트·MCP·훅을 한 폴더로 묶어 마켓플레이스 배포·설치 / 버전으로 자동 업데이트", color: C.primary },
    { t: "Hook: 특정 순간(PreToolUse 등) 자동 실행 규칙 — 민감정보 차단·마스킹으로 ICTK 보안 강화", color: C.primary },
  ], 0.78, 2.27, 6.9, 1.8, { gap: 9, size: 16 });
  sectionTitle(s, "회차 흐름", 8.3, 1.65, 7, C.primary, 17);
  K.table(s, [
    K.headRow(["회차", "핵심", "한 줄"]),
    ["5회차", "Skill + Agent 다단계", "여러 단계를 한 번에(개인)"],
    [{ text: "6회차(오늘)", options: { bold: true, color: C.primary, fontFace: FONT, fontSize: fs16(16) } },
     { text: "Plugin 개발·배포 + Hook", options: { bold: true, color: C.primary, fontFace: FONT, fontSize: fs16(16) } },
     { text: "팀 표준 꾸러미로 배포", options: { bold: true, color: C.green, fontFace: FONT, fontSize: fs16(16) } }],
    ["7회차(예고)", "Cloud LLM API 연동", "STT·TTS·VLM + YouTube"],
  ], { x: 8.3, y: 2.1, w: 7.2, colW: [1.8, 3.2, 2.2], rowH: [0.5, 0.62, 0.62, 0.62], fontSize: 16, align: "left" });
  K.highlight(s, "2주 과제 — 5회차 다단계 Skill을 Plugin으로 패키징: ① 묶기(SKILL.md·에이전트를 plugin.json과 함께) → ② 설치 가이드(README) 작성 → ③ 설치 테스트(다른 폴더에서 설치·실행 = 9~11회차 PoC 패키징 사전 연습)", 0.5, 4.55, 15, 0.85, { size: 16, fill: "FEF3C7", color: "92400E" });
  K.highlight(s, "7회차 예고 — Cloud LLM API 연동: 음성을 글로(STT)·글을 음성으로(TTS)·이미지를 이해(VLM)하는 외부 AI API + YouTube 검색을 오늘의 Plugin에 더합니다.", 0.5, 5.6, 15, 0.85, { size: 17 });
  note(s, "정리. 회차 흐름 5→6→7. 2주 과제(5회차 Skill을 Plugin 패키징+README, 공식 'Share your plugins' README 권고). 출처: https://code.claude.com/docs/en/plugins , https://code.claude.com/docs/en/discover-plugins");
  return s;
}

async function main() {
  const pptx = K.newDeck();
  pptx.author = "Unicorn / 이해경"; pptx.company = "ICTK";
  pptx.subject = "Claude Code 업무 자동화 부트캠프 6회차"; pptx.title = "6회차 — Plugin 개발 및 배포";
  K.defineMaster(pptx, FOOTER);
  const slides = [createSlide01, createSlide02, createSlide03, createSlide04, createSlide05, createSlide06, createSlide07, createSlide08, createSlide09, createSlide10, createSlide11];
  for (const fn of slides) await fn(pptx);
  const out = path.join(__dirname, "6회차-Plugin개발-배포.pptx");
  await pptx.writeFile({ fileName: out });
  console.log("✅ PPT 생성 완료:", out, "| 슬라이드:", slides.length);
}
main().catch((e) => { console.error("❌ PPT 생성 실패:", e); process.exit(1); });
