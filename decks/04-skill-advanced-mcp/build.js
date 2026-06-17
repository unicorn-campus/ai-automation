// build.js — ICTK 부트캠프 4회차 "Skill 심화 + 웹브라우저 MCP + MCP 개발" PPT 빌드
"use strict";
const path = require("path");
const K = require(path.join(__dirname, "..", "_lib", "pptkit"));
const { C, FONT, fs16, PAGE_W } = K;
const IMG = (f) => path.join(__dirname, "images", f);
const FOOTER = "ⓒ ICTK · Unicorn — Claude Code 업무 자동화 부트캠프 4회차 · 무단전재 및 배포 금지";

function bullets(slide, items, x, y, w, h, opts = {}) {
  const runs = items.map((it) => ({
    text: it.t !== undefined ? it.t : it,
    options: { fontFace: FONT, fontSize: fs16(it.size || opts.size || 16), bold: !!it.bold,
      color: it.color || opts.color || C.body, bullet: it.bullet === false ? false : { code: "2022", indent: 14 },
      breakLine: true, paraSpaceAfter: opts.gap !== undefined ? opts.gap : 7, indentLevel: it.lvl || 0 },
  }));
  slide.addText(runs, { x, y, w, h, align: "left", valign: "top", lineSpacingMultiple: opts.lsm || 1.05 });
}
function sectionTitle(slide, str, x, y, w, color = C.primary, size = 17) {
  slide.addText(str, { x, y, w, h: 0.4, align: "left", valign: "middle", fontFace: FONT, bold: true, fontSize: fs16(size), color });
}
function note(slide, txt) { slide.addNotes(txt); }
function headerCard(slide, x, y, w, h, hd, col, lines) {
  K.card(slide, x, y, w, h);
  K.roundRect(slide, x, y, w, 0.55, col, { radius: 0.08 });
  slide.addText(hd, { x, y, w, h: 0.55, align: "center", valign: "middle", fontFace: FONT, bold: true, fontSize: fs16(16), color: C.white });
  bullets(slide, lines.map(t => (typeof t === "string" ? { t, color: C.body } : t)), x + 0.22, y + 0.68, w - 0.44, h - 0.8, { gap: 8, size: 16 });
}

async function createSlide01(pptx) {
  const s = pptx.addSlide({ masterName: "MASTER" });
  K.rect(s, 0, 0, PAGE_W, 3.05, C.primary); K.rect(s, 0, 0, 0.28, 3.05, C.green);
  s.addText("Claude Code 업무 자동화 부트캠프 · 4회차 / 11회차", { x: 0.95, y: 0.55, w: 13.5, h: 0.5, fontFace: FONT, bold: true, fontSize: fs16(20), color: "7FE7C4" });
  s.addText("Skill 심화 + 웹브라우저 MCP + MCP 개발", { x: 0.95, y: 1.05, w: 14.3, h: 0.95, fontFace: FONT, bold: true, fontSize: fs16(38), color: C.white });
  s.addText("지침만의 Skill에 \"웹·외부·자작 도구\"를 결합해 할 수 있는 일의 범위를 넓힘", { x: 0.95, y: 2.18, w: 14.3, h: 0.6, fontFace: FONT, fontSize: fs16(18), color: "D8D8D8" });
  const info = [
    { hd: "대상", col: C.catA, t: "ICTK 임직원 (비개발자 포함 입문자)" },
    { hd: "도구", col: C.catD, t: "Claude Code 데스크톱 앱 — \"Code\" 탭 (GUI)" },
    { hd: "흐름", col: C.catB, t: "3회차 복습 → 4회차 웹·MCP → 2주 과제 → 5회차 예고" },
  ];
  const cw = 4.85, gap = 0.22; let x = 0.5;
  for (const c of info) {
    K.card(s, x, 3.45, cw, 1.75); K.roundRect(s, x, 3.45, cw, 0.5, c.col, { radius: 0.08 });
    s.addText(c.hd, { x, y: 3.45, w: cw, h: 0.5, align: "center", valign: "middle", fontFace: FONT, bold: true, fontSize: fs16(16), color: C.white });
    K.text(s, c.t, x + 0.2, 4.05, cw - 0.4, 1.05, { size: 16, color: C.body });
    x += cw + gap;
  }
  K.highlight(s, "오늘의 핵심: MCP(외부 도구를 잇는 표준 콘센트)로 웹브라우저·도우미·자작 도구를 Skill에 꽂아 확장합니다.", 0.5, 5.55, 15, 0.75, { size: 18, bold: true });
  note(s, "4회차 시작. 3회차(SKILL.md 재사용) 상기 → 오늘은 MCP로 웹브라우저·도우미·자작 도구를 결합. 데스크톱 앱 Code 탭(GUI). 유료 계정 필요. 출처: https://code.claude.com/docs/en/mcp , https://code.claude.com/docs/en/chrome");
  return s;
}

async function createSlide02(pptx) {
  const s = pptx.addSlide({ masterName: "MASTER" });
  K.headerBar(s, C.green); K.pageHeader(s, "WHY — Skill에 \"손과 눈\"을 달면", "골든서클: WHY → HOW → WHAT");
  K.card(s, 0.5, 1.7, 7.5, 3.7, "ECFDF5", C.green);
  const gc = [
    { lb: "WHY", tx: "3회차 Skill은 \"지침\"만 있어 내 PC 폴더 안에서만 동작 — 웹 정보·최신 문서·없는 기능은 못 씀", col: C.step4 },
    { lb: "HOW", tx: "MCP(Claude에 외부 도구를 잇는 \"표준 콘센트\")로 웹브라우저·문서조회·자작 도구를 꽂아 줌", col: C.step3 },
    { lb: "WHAT", tx: "Skill이 웹을 조회·조작하고, 최신 공식문서를 참고하고, 나만의 기능(이미지 생성)까지 호출", col: C.green },
  ];
  let yy = 1.95;
  for (const g of gc) { K.badge(s, 0.75, yy, 1.3, g.lb, g.col, C.white, 0.5, 16); K.text(s, g.tx, 2.2, yy - 0.02, 5.6, 1.05, { size: 16, color: C.primary }); yy += 1.12; }
  K.table(s, [
    K.headRow(["구분", "3회차", "4회차(오늘)"]),
    ["Skill이 쓰는 도구", "지침(자연어)만", "지침 + MCP로 연결한 외부 도구"],
    ["닿는 범위", "내 PC 폴더 안", "웹·외부 서비스·자작 도구까지"],
    ["산출물", "지침만 SKILL.md", "MCP 연동 Skill + 웹 조회 Skill"],
  ], { x: 8.3, y: 1.7, w: 7.2, colW: [2.2, 2.2, 2.8], rowH: [0.5, 0.92, 0.92, 0.92], fontSize: 16, align: "left" });
  K.highlight(s, "🔒 ICTK: 범위가 넓어질수록 기본기가 중요 — Claude는 내가 고른 폴더 안에서만 작업하고, 웹 조작·편집·실행은 사람이 diff로 Accept/Reject 후에만 진행(데이터 격리·사람 최종 승인).", 0.5, 5.7, 15, 0.78, { size: 16, fill: "CCFBF1" });
  note(s, "골든서클. MCP 공식 정의(open standard for AI-tool integrations)를 '표준 콘센트' 비유로. 보안 메시지(폴더 격리·사람 승인). 출처: https://code.claude.com/docs/en/mcp");
  return s;
}

async function createSlide03(pptx) {
  const s = pptx.addSlide({ masterName: "MASTER" });
  K.headerBar(s, C.teal); K.pageHeader(s, "웹 자동화 2종 — Playwright MCP vs Claude in Chrome", "같은 \"웹\"이지만 브라우저가 다름");
  K.table(s, [
    K.headRow(["구분", "Playwright MCP", "Claude in Chrome"]),
    ["어떤 브라우저?", "Claude가 제어하는 별도 자동화 브라우저", "내가 쓰는 실제 Chrome/Edge"],
    ["내 로그인 상태", "분리(깨끗) — 내 세션과 별개", "공유 — 이미 로그인한 사이트 접근"],
    ["잘 맞는 일", "공개 웹 정보 조회·정리", "로그인이 필요한 내 계정 작업"],
    ["상태", "안정(설치형)", "beta — 별도 Anthropic 플랜 필요"],
  ], { x: 0.5, y: 1.75, w: 15, colW: [3.0, 6.0, 6.0], rowH: [0.5, 0.62, 0.62, 0.62, 0.62], fontSize: 16, align: "left" });
  bullets(s, [
    { t: "Playwright MCP(웹브라우저 자동 조작): 화면 그림이 아니라 페이지 구조(접근성 트리)를 읽어 클릭·입력·이동 → 빠르고 안정적", color: C.body },
    { t: "Claude in Chrome(내 브라우저에 붙는 Claude): 로그인·CAPTCHA가 나오면 멈추고 사람에게 처리해 달라고 물음", color: C.body },
  ], 0.55, 5.0, 15, 1.0, { gap: 8, size: 16 });
  K.highlight(s, "공통 안전선: 둘 다 사이트 이용약관(ToS)·로봇 정책을 지키고, 로그인은 사람이, 외부 페이지의 숨은 지시(프롬프트 인젝션)를 경계.", 0.5, 6.2, 15, 0.7, { size: 16, fill: "CCFBF1" });
  note(s, "핵심 분기점. Playwright MCP=별도 자동화 브라우저(접근성 트리 기반, 계정 불필요), Claude in Chrome=실제 브라우저 공유(beta, Chrome/Edge, 직접 Anthropic 플랜). 출처: https://github.com/microsoft/playwright-mcp , https://code.claude.com/docs/en/chrome");
  return s;
}

async function createSlide04(pptx) {
  const s = pptx.addSlide({ masterName: "MASTER" });
  K.headerBar(s, C.step2); K.pageHeader(s, "Playwright MCP — 웹 조회·조작을 자동으로", "별도 자동화 브라우저로 공개 웹 수집");
  K.text(s, "Claude가 별도 자동화 브라우저를 띄워 페이지를 읽고 클릭·입력·이동하는 MCP — 공개 웹 정보 수집에 적합", 0.5, 1.6, 15, 0.5, { size: 17, bold: true, color: C.primary });
  sectionTitle(s, "동작 흐름", 0.5, 2.25, 7, C.primary, 16);
  const steps = [
    ["① 연결: \"playwright MCP를 추가해줘\" → diff Accept", C.step1],
    ["② 지시: \"example.com 을 열고 제목 알려줘\"", C.step2],
    ["③ 실행: 접근성 트리(페이지 구조)를 읽어 이동·클릭·입력", C.step3],
    ["④ 정리: 가져온 정보를 표·요약으로 반환", C.green],
  ];
  let y = 2.7; for (const [l, col] of steps) { K.flowStep(s, 0.5, y, 7.2, 0.72, l, col, 16); y += 0.84; }
  K.codeBlock(s, "{\n  \"mcpServers\": {\n    \"playwright\": {\n      \"command\": \"npx\",\n      \"args\": [\"-y\", \"@playwright/mcp@latest\"]\n    }\n  }\n}", 8.0, 2.7, 7.5, 2.0, 16);
  K.addImage(s, IMG("s4_playwright_structure.png"), { x: 8.0, y: 4.85, w: 7.5, h: 1.45, sizing: { type: "contain", w: 7.5, h: 1.45 } });
  K.highlight(s, "핵심: 화면을 \"보고 누르는\" 방식이 아니라 페이지 구조를 읽는 방식이라 빠르고 일정함 — 계정 없이 공개 웹 조회 가능. 브라우저 창이 떠서 무슨 일을 하는지 눈으로 확인 가능.", 0.5, 6.45, 15, 0.75, { size: 16, fill: "CCFBF1" });
  note(s, "Playwright MCP. 공식 README: accessibility tree 기반(픽셀 아님), 빠르고 deterministic, 계정 불필요, 브라우저 창 보임. 설정 예시는 README config(데스크톱은 프롬프트로 추가 후 diff 승인). Node 18+. 출처: https://github.com/microsoft/playwright-mcp , https://code.claude.com/docs/en/mcp-quickstart");
  return s;
}

async function createSlide05(pptx) {
  const s = pptx.addSlide({ masterName: "MASTER" });
  K.headerBar(s, C.step3); K.pageHeader(s, "Claude in Chrome — 내 브라우저에서 조회·요약", "내 로그인 상태 그대로 (beta)");
  K.text(s, "내가 쓰는 실제 Chrome/Edge에 Claude가 붙어, 내가 로그인한 상태 그대로 웹을 다루는 beta 기능", 0.5, 1.6, 15, 0.5, { size: 17, bold: true, color: C.primary });
  sectionTitle(s, "동작 흐름", 0.5, 2.25, 5, C.primary, 16);
  const steps = [["① ⚙️ Settings / /chrome 로 켬", C.step1], ["② 새 탭을 열어 작업(보이는 창, 실시간)", C.step2], ["③ 로그인·CAPTCHA 시 멈추고 사람에게 요청", C.step4], ["④ 결과 요약", C.green]];
  let y = 2.7; for (const [l, col] of steps) { K.flowStep(s, 0.5, y, 5.2, 0.7, l, col, 16); y += 0.82; }
  K.card(s, 5.95, 2.6, 4.5, 3.5, C.cardBg, C.cardBorder);
  sectionTitle(s, "예시 — 반도체 논문 검색·요약", 6.15, 2.72, 4.1, C.teal, 16);
  bullets(s, [
    { t: "논문 사이트 이동 → \"반도체\" 검색", color: C.body },
    { t: "상위 결과의 제목·초록을 추려 한국어 요약", color: C.body },
    { t: "내 브라우저라 이미 로그인한 사이트도 접근(별도 API 불필요)", color: C.body },
  ], 6.18, 3.2, 4.1, 2.8, { gap: 12, size: 16 });
  K.addImage(s, IMG("s5_chrome_overlay.png"), { x: 10.7, y: 2.6, w: 4.8, h: 3.5, sizing: { type: "contain", w: 4.8, h: 3.5 } });
  K.highlight(s, "⚠ ICTK: beta·실제 브라우저라 신뢰 경계가 더 중요 — 사이트별 권한을 좁게, 프롬프트 인젝션 경계, 로그인은 항상 사람이 직접.", 0.5, 6.4, 15, 0.7, { size: 16, fill: "FEF3C7", color: "92400E" });
  note(s, "Claude in Chrome: beta, Chrome/Edge만, 직접 Anthropic 플랜, 내 로그인 공유, login/CAPTCHA 시 사람에게 멈춰 물음, 사이트별 권한. 출처: https://code.claude.com/docs/en/chrome");
  return s;
}

async function createSlide06(pptx) {
  const s = pptx.addSlide({ masterName: "MASTER" });
  K.headerBar(s, C.step5); K.pageHeader(s, "도우미 MCP 2종 — context7 · sequential thinking", "Skill의 품질을 높이는 보조 도구");
  headerCard(s, 0.5, 2.0, 7.4, 3.3, "context7 · 최신 공식문서 조회", C.catA, [
    { t: "라이브러리·프레임워크의 최신·버전별 공식문서와 코드 예시를 실시간으로 프롬프트에 넣어 줌", color: C.body },
    { t: "\"use context7\"라고 덧붙이면 옛 기억이 아닌 지금의 정식 문서 기준으로 답함(오래된·없는 API 환각 감소)", color: C.primary },
  ]);
  headerCard(s, 8.1, 2.0, 7.4, 3.3, "sequential thinking · 단계적 사고", C.catD, [
    { t: "복잡한 문제를 여러 생각 단계로 쪼개고, 필요하면 수정·분기하며 차근차근 풀도록 돕는 표준 MCP 서버", color: C.body },
    { t: "긴 절차·설계처럼 한 번에 답하기 어려운 일의 정확도를 높임", color: C.primary },
  ]);
  K.highlight(s, "요점: 둘 다 \"직접 호출\"보다 Skill/요청 속에서 알아서 쓰이는 보조 도구 — Skill에 붙이면 결과가 더 최신·더 정확해집니다.", 0.5, 5.6, 15, 0.75, { size: 17 });
  note(s, "context7=upstash(최신 버전별 공식문서 주입, 'use context7'), sequential thinking=modelcontextprotocol servers(문제를 단계적 사고로 분해·수정·분기). 출처: https://github.com/upstash/context7 , https://github.com/modelcontextprotocol/servers/tree/main/src/sequentialthinking");
  return s;
}

async function createSlide07(pptx) {
  const s = pptx.addSlide({ masterName: "MASTER" });
  K.headerBar(s, C.step3); K.pageHeader(s, "나만의 MCP 만들기 — 자작 도구를 표준 도구로", "코드는 Claude가 생성·설명");
  K.text(s, "MCP \"서버\" = 내 기능(도구)을 표준 방식으로 노출하는 작은 프로그램 — 만들면 Claude가 \"도구함\"에 넣고 씀", 0.5, 1.6, 15, 0.5, { size: 17, bold: true, color: C.primary });
  sectionTitle(s, "만드는 흐름", 0.5, 2.25, 7, C.primary, 16);
  const steps = [
    ["① 무엇을: \"GPT Image로 그림 만드는 기능을 MCP로\" 말로 설명", C.step1],
    ["② 생성: Claude가 파이썬/노드 SDK 코드를 작성·설명 → diff Accept", C.step3],
    ["③ 연결·확인: MCP로 등록 → 도구가 잘 보이는지 확인 후 사용", C.green],
  ];
  let y = 2.7; for (const [l, col] of steps) { K.flowStep(s, 0.5, y, 7.2, 0.88, l, col, 16); y += 1.0; }
  K.codeBlock(s, "MCP 서버가 노출하는 것\n\n도구(Tools)     : Claude가 호출하는 기능(승인 후 실행)\n리소스(Resources): 읽어올 데이터(파일·API 응답)\n프롬프트(Prompts): 자주 쓰는 작업 템플릿", 8.0, 2.7, 7.5, 1.95, 16);
  K.addImage(s, IMG("s7_custom_mcp.png"), { x: 8.0, y: 4.8, w: 7.5, h: 1.5, sizing: { type: "contain", w: 7.5, h: 1.5 } });
  K.highlight(s, "핵심: 비개발자도 가능 — 코드는 Claude가 쓰고 설명함. 핵심은 \"어떤 기능을, 어떤 입력으로, 무엇을 돌려줄지\"를 내가 말로 정의하는 것.", 0.5, 6.45, 15, 0.75, { size: 16, fill: "CCFBF1" });
  note(s, "MCP 서버 3대 능력: Resources/Tools(사람 승인 후 실행)/Prompts. Python(3.10+, mcp[cli]) 또는 Node SDK. Claude Code가 코드 scaffold/설명. 출처: https://modelcontextprotocol.io/docs/develop/build-server , https://code.claude.com/docs/en/mcp");
  return s;
}

async function createSlide08(pptx) {
  const s = pptx.addSlide({ masterName: "MASTER" });
  K.headerBar(s, C.green); K.pageHeader(s, "Skill + MCP 결합 — 정보조사 스킬에 이미지 생성 더하기", "Skill(절차) + MCP(도구) = 레고 조합");
  K.text(s, "3회차에서 만든 정보조사 스킬에, 7번에서 만든 이미지 생성 MCP를 붙여 기능을 확장", 0.5, 1.6, 15, 0.5, { size: 17, bold: true, color: C.primary });
  sectionTitle(s, "확장 흐름", 0.5, 2.3, 7, C.primary, 16);
  const steps = [
    ["① 기존: 정보조사 스킬 = 검색 → 레포트 → 슬라이드(지침)", C.step1],
    ["② 추가: SKILL.md 본문에 \"표지·삽화는 GPT Image MCP로 생성\" 한 줄 추가", C.step3],
    ["③ 결과: 한 번의 호출로 조사 → 레포트 → 이미지까지 생성", C.green],
  ];
  let y = 2.75; for (const [l, col] of steps) { K.flowStep(s, 0.5, y, 7.3, 0.92, l, col, 16); y += 1.05; }
  sectionTitle(s, "SKILL.md에 추가하는 지침", 8.1, 2.3, 7, C.primary, 16);
  K.codeBlock(s, "## 작업방법(추가)\n4. 레포트 핵심 장면을 그림으로 표현\n5. GPT Image MCP로 표지 이미지 1장 생성\n6. 생성 이미지를 슬라이드에 삽입", 8.1, 2.75, 7.4, 2.0, 16);
  K.highlight(s, "핵심: Skill(절차) + MCP(도구)는 레고처럼 조합 — 같은 방식으로 Playwright MCP를 붙이면 \"웹 조회 Skill\"(다음 실습)이 됩니다.", 0.5, 6.1, 15, 0.75, { size: 16, fill: "CCFBF1" });
  note(s, "Skill+MCP 결합. Skill='절차', MCP='도구'. SKILL.md 본문에 도구 사용 단계를 한 줄 추가하는 것으로 결합(공식 Skill 'Compose'). 출처: https://code.claude.com/docs/en/skills , https://code.claude.com/docs/en/mcp");
  return s;
}

async function createSlide09(pptx) {
  const s = pptx.addSlide({ masterName: "MASTER" });
  K.headerBar(s, C.step5); K.pageHeader(s, "실습 3종 — 웹 조회 / 논문 요약 / MCP 제작·연동", "오늘의 손으로 해보기");
  const cards = [
    { hd: "① 웹 조회 Skill [직접]", col: C.catB, lines: ["Playwright MCP로", "공개 웹의 정보 한 가지를 조회·정리하는 Skill을 만듦", "→ /웹조회 로 호출"] },
    { hd: "② 논문 요약 [데모]", col: C.catC, lines: ["Claude in Chrome으로", "아카이브에서 '반도체' 논문 검색 → 제목·초록 요약", "(beta·로그인은 사람)"] },
    { hd: "③ MCP 제작·연동 [직접]", col: C.catE, lines: ["GPT Image 이미지 생성 MCP를 만들고", "3회차 정보조사 스킬에 이미지 생성 기능 추가"] },
  ];
  const cw = 4.85, gap = 0.22; let x = 0.5;
  for (const c of cards) { headerCard(s, x, 2.3, cw, 3.3, c.hd, c.col, c.lines); x += cw + gap; }
  K.highlight(s, "오늘의 산출물: MCP 연동 Skill(③) + 웹 조회 Skill(①) — 둘 다 직접 만들어 완성.", 0.5, 5.85, 15, 0.75, { size: 17 });
  note(s, "실습 3종(커리큘럼 그대로). ①③ 직접 실습(산출물), ② beta·로그인 필요라 데모. 출처: https://github.com/microsoft/playwright-mcp , https://code.claude.com/docs/en/chrome , https://code.claude.com/docs/en/mcp");
  return s;
}

async function createSlide10(pptx) {
  const s = pptx.addSlide({ masterName: "MASTER" });
  K.headerBar(s, C.step4); K.pageHeader(s, "ICTK 안전 수칙 — 웹·외부 도구는 \"경계하며\"", "범위가 넓어져도 흔들리지 않는 3원칙");
  const cards = [
    { hd: "1. 웹 자동화는 규칙 안에서", col: C.catB, lines: ["사이트 이용약관(ToS)·로봇 정책(robots) 준수, 과도한 자동 접근 금지", "로그인·CAPTCHA는 사람이 직접"] },
    { hd: "2. 신뢰된 MCP만 연결", col: C.catC, lines: ["MCP는 새 능력 부여 → 소프트웨어 설치처럼 취급, 출처 신뢰 서버만", "외부 콘텐츠를 가져오는 서버는 프롬프트 인젝션 위험"] },
    { hd: "3. 사람 최종 승인·데이터 격리", col: C.catE, lines: ["편집·실행·웹 조작은 diff Accept/Reject로 사람이 확인", "내가 고른 폴더 안에서만 작업 — 핵심 보안 자산은 외부로 안 내보냄"] },
  ];
  const cw = 4.85, gap = 0.22; let x = 0.5;
  for (const c of cards) { headerCard(s, x, 2.4, cw, 3.0, c.hd, c.col, c.lines); x += cw + gap; }
  K.highlight(s, "프롬프트 인젝션(웹페이지·외부 도구 속 숨은 지시문이 Claude를 속이는 공격)을 항상 경계 — 프로젝트 MCP는 승인(approval) 후에만 사용.", 0.5, 5.65, 15, 0.7, { size: 16, fill: "CCFBF1" });
  note(s, "공식 경고: 연결 전 서버 신뢰 확인, 외부 콘텐츠 서버는 프롬프트 인젝션 위험. 프로젝트 스코프 MCP는 승인 후 사용. ToS·robots·로그인은 사람. 출처: https://code.claude.com/docs/en/mcp , https://code.claude.com/docs/en/chrome");
  return s;
}

async function createSlide11(pptx) {
  const s = pptx.addSlide({ masterName: "MASTER" });
  K.headerBar(s, C.green); K.pageHeader(s, "정리 · 회차 흐름 · 2주 과제 · 5회차 예고", "오늘 요약 / 흐름 / 할 일 / 다음");
  K.card(s, 0.5, 1.65, 7.4, 2.4, "ECFDF5", C.green);
  sectionTitle(s, "오늘 배운 것", 0.75, 1.77, 6, "0F766E", 17);
  bullets(s, [
    { t: "MCP = Claude에 외부 도구를 잇는 표준 콘센트: 웹브라우저(Playwright·Chrome)·도우미(context7·sequential thinking)·자작 도구까지 연결", color: C.primary },
    { t: "Skill + MCP = 레고 조합: 지침 Skill에 도구를 붙여 웹 조회 Skill / MCP 연동 Skill 완성 — 코드는 Claude가 생성", color: C.primary },
  ], 0.78, 2.27, 6.9, 1.7, { gap: 9, size: 16 });
  sectionTitle(s, "회차 흐름", 8.3, 1.65, 7, C.primary, 17);
  K.table(s, [
    K.headRow(["회차", "핵심", "한 줄"]),
    ["3회차", "Skill 기초(SKILL.md)", "반복 작업 재사용 승격"],
    [{ text: "4회차(오늘)", options: { bold: true, color: C.primary, fontFace: FONT, fontSize: fs16(16) } },
     { text: "Skill 심화 + 웹 MCP + MCP 개발", options: { bold: true, color: C.primary, fontFace: FONT, fontSize: fs16(16) } },
     { text: "외부·자작 도구 결합", options: { bold: true, color: C.green, fontFace: FONT, fontSize: fs16(16) } }],
    ["5회차(예고)", "Skill + Agent", "서브에이전트 다단계 자동화"],
  ], { x: 8.3, y: 2.1, w: 7.2, colW: [1.8, 3.2, 2.2], rowH: [0.5, 0.62, 0.62, 0.62], fontSize: 16, align: "left" });
  K.highlight(s, "2주 과제 — 웹에서 주기적으로 확인하는 정보 1개를 Playwright MCP 조회 Skill로: ① 고르기 → ② 만들기(Playwright MCP 조회 Skill) → ③ 실사용·개선(= 5회차 다단계 워크플로우 재료)", 0.5, 4.55, 15, 0.85, { size: 16, fill: "FEF3C7", color: "92400E" });
  K.highlight(s, "5회차 예고 — Skill + Agent: 오늘 만든 도구 결합 Skill을 여러 역할(작성자·검토자)로 나눠 오케스트레이터가 호출하는 다단계 자동화로 발전시킵니다.", 0.5, 5.6, 15, 0.85, { size: 17 });
  note(s, "종합 정리. 회차 흐름 3→4→5. 2주 과제(웹 주기 정보를 Playwright MCP 조회 Skill로, 5회차 재료). 출처: https://code.claude.com/docs/en/mcp , https://code.claude.com/docs/en/skills");
  return s;
}

async function main() {
  const pptx = K.newDeck();
  pptx.author = "Unicorn / 이해경"; pptx.company = "ICTK";
  pptx.subject = "Claude Code 업무 자동화 부트캠프 4회차"; pptx.title = "4회차 — Skill 심화 + 웹브라우저 MCP + MCP 개발";
  K.defineMaster(pptx, FOOTER);
  const slides = [createSlide01, createSlide02, createSlide03, createSlide04, createSlide05, createSlide06, createSlide07, createSlide08, createSlide09, createSlide10, createSlide11];
  for (const fn of slides) await fn(pptx);
  const out = path.join(__dirname, "4회차-Skill심화-웹MCP-MCP개발.pptx");
  await pptx.writeFile({ fileName: out });
  console.log("✅ PPT 생성 완료:", out, "| 슬라이드:", slides.length);
}
main().catch((e) => { console.error("❌ PPT 생성 실패:", e); process.exit(1); });
