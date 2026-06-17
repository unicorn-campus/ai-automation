// build.js — ICTK 부트캠프 2회차 "커넥터·루틴·Computer use 활용" PPT 빌드
// ppt-guide.md 6절 준수 / 최소폰트 16pt / Claude Code 데스크톱 앱(Code 탭) 기준
"use strict";
const path = require("path");
const K = require(path.join(__dirname, "..", "_lib", "pptkit"));
const { C, FONT, fs16, MARGIN, CW, PAGE_W } = K;

const IMG = (f) => path.join(__dirname, "images", f);
const FOOTER = "ⓒ ICTK · Unicorn — Claude Code 업무 자동화 부트캠프 2회차 · 무단전재 및 배포 금지";

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

// ── 슬라이드 1 — 타이틀 (F) ─────────────────────────────────────────
async function createSlide01(pptx) {
  const s = pptx.addSlide({ masterName: "MASTER" });
  K.rect(s, 0, 0, PAGE_W, 2.95, C.primary);
  K.rect(s, 0, 0, 0.28, 2.95, C.green);
  s.addText("Claude Code 업무 자동화 부트캠프 · 2회차 / 11회차", { x: 0.95, y: 0.55, w: 13.5, h: 0.5, fontFace: FONT, bold: true, fontSize: fs16(20), color: "7FE7C4" });
  s.addText("커넥터 · 루틴 · Computer use 활용", { x: 0.95, y: 1.05, w: 14.2, h: 1.0, fontFace: FONT, bold: true, fontSize: fs16(40), color: C.white });
  s.addText("외부 도구 연결과 자동 반복으로 자동화 범위 확장  ·  데스크톱 앱 Code 탭(GUI)으로 진행", { x: 0.95, y: 2.18, w: 14, h: 0.5, fontFace: FONT, fontSize: fs16(18), color: "D8D8D8" });

  K.card(s, 0.5, 3.35, 6.7, 3.5);
  sectionTitle(s, "오늘의 안내", 0.75, 3.5, 6, C.teal, 17);
  bullets(s, [
    { t: "대상: ICTK 임직원 (비개발자 포함 입문자)" },
    { t: "도구: Claude Code 데스크톱 앱 — Chat·Cowork·Code 3개 탭 중 \"Code\" 탭" },
    { t: "검은 명령창이 아닌 GUI 화면으로 진행" },
    { t: "흐름: 1회차 복습 → 2회차 신규 → 2주 과제 → 3회차 예고" },
  ], 0.78, 4.0, 6.2, 2.7, { gap: 12, size: 16 });

  K.table(s, [
    K.headRow(["회차", "핵심", "한 줄"]),
    ["1회차(직전)", "설치·기본 사용·프롬프트 5요소", "Claude에게 \"말\"로 시키기"],
    [{ text: "2회차(오늘)", options: { bold: true, color: C.primary, fontFace: FONT, fontSize: fs16(16) } },
     { text: "커넥터·루틴·Computer use", options: { bold: true, color: C.primary, fontFace: FONT, fontSize: fs16(16) } },
     { text: "외부 도구 연결 + 자동 반복", options: { bold: true, color: C.green, fontFace: FONT, fontSize: fs16(16) } }],
    ["3회차(예고)", "Skill 기초", "반복 작업을 재사용 가능하게"],
  ], { x: 7.6, y: 3.6, w: 7.9, colW: [1.9, 3.2, 2.8], rowH: [0.5, 0.95, 0.95, 0.95], fontSize: 16, align: "left" });

  note(s, "2회차 시작. 1회차(데스크톱 앱 설치·프롬프트 5요소로 '말'로 시키기) 상기 → 오늘은 외부 도구 연결(커넥터)·자동 반복(루틴)·화면 조작(Computer use)으로 확장. 데스크톱 앱 Code 탭(GUI), 터미널 아님. 유료 계정(Pro·Max·Team·Enterprise) 필요, 무료 불가. 출처: https://code.claude.com/docs/en/desktop");
  return s;
}

// ── 슬라이드 2 — WHY (F) ────────────────────────────────────────────
async function createSlide02(pptx) {
  const s = pptx.addSlide({ masterName: "MASTER" });
  K.headerBar(s, C.green);
  K.pageHeader(s, "WHY — \"말\"에서 \"연결·자동화\"로", "골든서클: WHY → HOW → WHAT");

  K.card(s, 0.5, 1.7, 7.4, 3.7, "ECFDF5", C.green);
  const gc = [
    { lb: "WHY", tx: "1회차는 프롬프트로 \"말\"만 했음. 매번 사람이 데이터를 복붙하고 직접 실행", col: C.step4 },
    { lb: "HOW", tx: "① 외부 도구 연결(커넥터)  ② 정해진 시각에 자동 반복(루틴)  ③ 화면 직접 조작(Computer use)", col: C.step3 },
    { lb: "WHAT", tx: "GitHub·지도·캘린더에 연결하고, 매일 아침 뉴스레터를 자동으로 받는 자동화", col: C.green },
  ];
  let yy = 1.95;
  for (const g of gc) {
    K.badge(s, 0.75, yy, 1.3, g.lb, g.col, C.white, 0.5, 16);
    K.text(s, g.tx, 2.2, yy - 0.02, 5.5, 1.0, { size: 16, color: C.primary, valign: "top" });
    yy += 1.12;
  }

  K.table(s, [
    K.headRow(["구분", "1회차", "2회차(오늘)"]),
    ["일하는 방식", "사람이 복붙 후 지시", "Claude가 도구에 직접 접근"],
    ["실행 시점", "사람이 그때그때", "정해진 시각 자동 실행"],
    ["범위", "내 폴더 안 파일", "외부 서비스·화면까지"],
  ], { x: 8.2, y: 1.7, w: 7.3, colW: [1.9, 2.5, 2.9], rowH: [0.5, 0.92, 0.92, 0.92], fontSize: 16, align: "left" });

  K.highlight(s, "오늘의 기대치: 3가지는 \"맛보기\"까지 — 산출물은 커넥터 1건 연결 + 루틴 1건 생성. Computer use는 직접 하지 않고 관찰만.", 0.5, 5.7, 15, 0.75, { size: 17 });

  note(s, "골든서클로 동기 부여. '다른 도구 데이터를 채팅에 복붙하고 있다면 그때가 커넥터를 연결할 시점'. 비개발자가 3개 개념을 한 번에 도약하는 부담을 낮추려 기대치 조정(맛보기·산출물 2건·Computer use 관찰만). 출처: https://code.claude.com/docs/en/mcp , https://code.claude.com/docs/en/desktop");
  return s;
}

// ── 슬라이드 3 — 커넥터·MCP란? (A) ──────────────────────────────────
async function createSlide03(pptx) {
  const s = pptx.addSlide({ masterName: "MASTER" });
  K.headerBar(s, C.teal);
  K.pageHeader(s, "커넥터·MCP란?", "외부 도구를 잇는 표준 통로");
  K.highlight(s, "커넥터 = 클릭으로 외부 도구를 잇는 통로 — 검은 명령창 없이 Claude에 연결", 0.5, 1.65, 15, 0.6, { size: 18, bold: true });

  const cards = [
    { hd: "커넥터 (Connector)", col: C.catA, lines: ["화면 클릭만으로 외부 도구를 잇는 통로", "코드·터미널 불필요 — 그래픽 설정 흐름"] },
    { hd: "MCP", col: C.catD, lines: ["통로의 기술 표준 이름", "공식 비유 \"AI를 위한 USB-C 포트\" — 어떤 도구든 같은 방식으로 꽂음"] },
    { hd: "MCP 서버", col: C.catB, lines: ["연결되는 도구 하나하나(단위)", "Claude에 도구·데이터 접근을 줌 (예: GitHub, 지도, Gmail)"] },
  ];
  const cw = 4.85, gap = 0.22; let x = 0.5;
  for (const c of cards) {
    K.card(s, x, 2.45, cw, 2.5);
    K.roundRect(s, x, 2.45, cw, 0.55, c.col, { radius: 0.08 });
    s.addText(c.hd, { x, y: 2.45, w: cw, h: 0.55, align: "center", valign: "middle", fontFace: FONT, bold: true, fontSize: fs16(16), color: C.white });
    bullets(s, c.lines.map(t => ({ t, color: C.body })), x + 0.22, 3.15, cw - 0.44, 1.7, { gap: 8, size: 16 });
    x += cw + gap;
  }

  K.text(s, "연결하면 Claude가 캘린더 읽기, 메시지 전송, 이슈 생성 등 도구를 직접 다룰 수 있습니다.", 0.5, 5.2, 9.4, 1.5, { size: 16, color: C.primary, bold: true, valign: "top" });
  K.addImage(s, IMG("s3_mcp_usbc.png"), { x: 10.1, y: 5.05, w: 5.4, h: 2.6, sizing: { type: "contain", w: 5.4, h: 2.6 } });

  note(s, "핵심 개념. 용어 3종(커넥터/MCP/MCP서버)을 카드 3개로. MCP = modelcontextprotocol.io 'USB-C port for AI applications' 비유. 커넥터 = GUI 설정 흐름을 갖춘 MCP 서버. 연결 후엔 보통 서버 이름을 안 불러도 Claude가 알아서 도구를 고름(슬6에서 재언급). 출처: https://modelcontextprotocol.io/ , https://code.claude.com/docs/en/desktop , https://code.claude.com/docs/en/mcp-quickstart");
  return s;
}

// ── 슬라이드 4 — 커넥터 연결 방법 (C) ───────────────────────────────
async function createSlide04(pptx) {
  const s = pptx.addSlide({ masterName: "MASTER" });
  K.headerBar(s, C.green);
  K.pageHeader(s, "커넥터 연결 방법", "'+' 버튼과 ⚙️ Settings");
  K.highlight(s, "Code 탭에서 외부 도구 연결하기 (Google Calendar·Slack·GitHub·Linear·Notion 등)", 0.5, 1.65, 15, 0.6, { size: 18, bold: true });

  sectionTitle(s, "연결 플로우 (GUI)", 0.5, 2.45, 7, C.primary, 17);
  const steps = [
    ["① 프롬프트 박스 옆 '+' 버튼 → Connectors\n(세션 시작 전·중 언제든 가능)", C.step1],
    ["② 추가할 통합 선택\n(Google Calendar, Slack, GitHub, Linear, Notion 등)", C.step2],
    ["③ 브라우저 로그인 창에서 연결 승인(OAuth)\n토큰은 안전 저장·자동 갱신", C.step3],
    ["④ 연결 완료 → Claude가 그 도구를 직접 사용", C.green],
  ];
  let y = 2.95;
  for (const [label, col] of steps) { K.flowStep(s, 0.5, y, 7.3, 0.82, label, col, 16); y += 0.96; }

  sectionTitle(s, "어디서 하나", 8.2, 2.45, 7, C.primary, 17);
  K.table(s, [
    K.headRow(["항목", "위치 / 방법"]),
    ["연결 추가", "프롬프트 박스 옆 '+' → Connectors\n(파일·스킬·커넥터·플러그인 진입점)"],
    ["관리·해제", "⚙️ Settings → Connectors,\n또는 사이드바 Customize"],
  ], { x: 8.2, y: 2.95, w: 7.3, colW: [1.7, 5.6], rowH: [0.5, 1.0, 1.0], fontSize: 16, align: "left" });
  K.highlight(s, "OAuth(오어스): 비밀번호를 Claude에 직접 주지 않고, 서비스 로그인 창에서 \"연결 허용\"만 누르는 안전한 인증 방식", 8.2, 5.7, 7.3, 1.0, { size: 16, fill: "CCFBF1" });

  note(s, "GUI 동선. '+' 버튼이 핵심 진입점(파일·스킬·커넥터·플러그인). 대표 커넥터 목록·순서는 공식 문서(Google Calendar, Slack, GitHub, Linear, Notion). OAuth는 '비밀번호 안 주고 허용만 누르는 방식'. 출처: https://code.claude.com/docs/en/desktop , https://code.claude.com/docs/en/mcp , https://code.claude.com/docs/en/mcp-quickstart");
  return s;
}

// ── 슬라이드 5 — 연결 후 (D) ────────────────────────────────────────
async function createSlide05(pptx) {
  const s = pptx.addSlide({ masterName: "MASTER" });
  K.headerBar(s, C.step2);
  K.pageHeader(s, "연결 후 — 무엇을 시킬 수 있나", "예외 · 권한까지");
  K.highlight(s, "연결하면 자연어로 바로 지시 (비개발자 친화 예시 중심)", 0.5, 1.65, 15, 0.6, { size: 18, bold: true });

  K.table(s, [
    K.headRow(["무엇을 시키나", "자연어 지시 예"]),
    ["지도 (경로·맛집)", "\"○○역에서 △△까지 경로와 주변 맛집 추천\""],
    ["캘린더", "\"오늘 내 일정 정리해서 보여줘\""],
    ["메신저 (Slack)", "\"이 요약을 팀 채널에 보내줘\""],
    ["GitHub (개발 직군 보조)", "\"PR #456 리뷰\", \"내게 할당된 열린 PR 보여줘\""],
  ], { x: 0.5, y: 2.45, w: 15, colW: [4.0, 11.0], rowH: [0.5, 0.62, 0.62, 0.62, 0.62], fontSize: 16, align: "left" });

  bullets(s, [
    { t: "연결 예외: Gmail·Google Calendar·Microsoft 365는 Claude Code 로컬 연결 불가 → claude.ai의 Settings → Connectors에서 연결하면 Claude Code에 자동 표시", color: C.body },
    { t: "첫 호출 권한: Claude가 도구를 처음 쓸 때 권한을 물음 → 사람이 승인해야 진행 (사람 최종 승인)", bold: true, color: C.primary },
    { t: "연결 후엔 보통 서버 이름을 부를 필요 없이 Claude가 알아서 관련 도구를 고름", color: C.body },
  ], 0.55, 5.35, 15, 1.9, { gap: 10, size: 16 });

  note(s, "활용 예시를 비개발자 친화(지도·캘린더·메신저)로, GitHub는 개발 직군 보조. Gmail/Calendar/MS365는 claude.ai에서 연결해야 Code에 자동 노출. 첫 도구 호출 시 권한 질문 → ICTK 사람 최종 승인 기조와 연결. 출처: https://code.claude.com/docs/en/mcp , https://code.claude.com/docs/en/desktop");
  return s;
}

// ── 슬라이드 6 — MCP 검색·상태 (D) ──────────────────────────────────
async function createSlide06(pptx) {
  const s = pptx.addSlide({ masterName: "MASTER" });
  K.headerBar(s, C.step3);
  K.pageHeader(s, "MCP 검색·상태 확인", "도구를 찾고 연결 상태 읽기");

  K.card(s, 0.5, 1.7, 7.5, 4.0);
  sectionTitle(s, "도구를 어디서 찾나", 0.75, 1.85, 7, C.teal, 17);
  bullets(s, [
    { t: "검증된 커넥터 찾기: Anthropic Directory(claude.ai/directory)에서 둘러보기 — 신뢰할 수 있는 서버 목록(마켓)" },
    { t: "claude.ai에서 추가한 커넥터는 같은 계정 로그인 시 Claude Code에 자동으로 나타남" },
    { t: "역할 분리 — '+' 버튼 = 추가 / /mcp = 연결 상태 확인하는 점검창(각 서버 옆 도구 개수 표시)" },
  ], 0.78, 2.35, 7.0, 3.2, { gap: 12, size: 16 });

  sectionTitle(s, "/mcp 상태 읽기", 8.3, 1.7, 7, C.primary, 17);
  K.table(s, [
    K.headRow(["상태", "입문자 행동"]),
    ["✓ 연결됨 (Connected)", "사용 준비 완료"],
    ["! 로그인 필요", "브라우저 로그인·토큰 인증"],
    ["✗ 연결 안 됨", "잠시 후 재시도·강사 문의"],
  ], { x: 8.3, y: 2.2, w: 7.2, colW: [3.2, 4.0], rowH: [0.5, 0.78, 0.78, 0.78], fontSize: 16, align: "left" });
  K.text(s, "(/mcp 는 데스크톱 Code 탭에서 사용 가능. /permissions·/config·/agents·/doctor만 Code 탭 미지원)", 8.3, 5.15, 7.2, 0.6, { size: 16, color: C.meta });

  note(s, "'원하는 도구를 어디서 찾나'에 답. Anthropic Directory = 신뢰 서버 목록. /mcp 상태는 공식 5종(Connected, Needs authentication, Failed to connect, Connection error, Pending approval)을 행동할 3종으로 축약. '+버튼=추가, /mcp=상태확인' 역할 분리. 출처: https://code.claude.com/docs/en/mcp , https://code.claude.com/docs/en/mcp-quickstart , https://code.claude.com/docs/en/desktop");
  return s;
}

// ── 슬라이드 7 — 루틴 (C) ───────────────────────────────────────────
async function createSlide07(pptx) {
  const s = pptx.addSlide({ masterName: "MASTER" });
  K.headerBar(s, C.step4);
  K.pageHeader(s, "루틴(Routine) — 정해진 시각에 자동 실행", "한 번 묶어 두면 알아서 돌아감");
  K.highlight(s, "루틴 = 프롬프트 + (저장소) + 커넥터를 한 번 묶어, 정해진 시각에 자동으로 실행하는 단위", 0.5, 1.65, 15, 0.6, { size: 17, bold: true });

  K.text(s, "만드는 흐름(GUI): 좌측 사이드바 Routines → New routine → Remote/Local 선택 → 이름·프롬프트·주기 입력 → Run now로 시험 실행",
    0.5, 2.4, 15, 0.5, { size: 16, color: C.primary, bold: true });

  sectionTitle(s, "둘 중 무엇을 고를까 — 단 2가지 질문", 0.5, 3.0, 9, C.primary, 17);
  K.table(s, [
    K.headRow(["내 상황", "선택"]),
    ["컴퓨터를 꺼도 자동으로 돌아야 한다", "Remote (클라우드 루틴)"],
    ["내 PC 안의 파일을 직접 다뤄야 한다", "Local (데스크톱 예약 작업)"],
  ], { x: 0.5, y: 3.5, w: 8.6, colW: [5.6, 3.0], rowH: [0.5, 0.7, 0.7], fontSize: 16, align: "left" });
  bullets(s, [
    { t: "활용 예: \"아침 캘린더·받은편지함 브리핑\"(로컬 파일 접근)=Local / \"주간 PR·백로그 요약\"=Remote" },
    { t: "필요 플랜: Pro·Max·Team·Enterprise (클라우드 루틴은 'Claude Code on the web' 필요), 무료 불가 · 현재 research preview", color: C.sub },
  ], 0.55, 5.6, 8.6, 1.7, { gap: 10, size: 16 });

  K.card(s, 9.4, 3.0, 6.1, 3.5, "FEF2F2", "DC2626");
  K.badge(s, 9.62, 3.2, 3.5, "⚠ 안전 박스", C.step4, C.white, 0.45, 16);
  bullets(s, [
    { t: "클라우드 루틴(Remote)은 실행 중 승인 프롬프트 없이 자율 실행됨", bold: true, color: C.primary },
    { t: "→ ICTK 기준: 미리 승인한 신뢰 작업만, 커넥터 범위는 최소로 설정해 사용", color: C.body },
    { t: "데스크톱 루틴(Local)은 작업별 권한 모드(Ask 시 승인 대기)를 따름", color: C.body },
  ], 9.66, 3.85, 5.6, 2.5, { gap: 12, size: 16 });

  note(s, "입문자가 고를 2가지 질문(꺼도 돌아야 하면 Remote / 내 PC 파일 다루면 Local)으로 압축. 자율 실행(승인 없음)은 '사람 최종 승인' 원칙과 충돌하므로 별도 안전 박스로 분리해 '신뢰 작업만·범위 최소'. 주기 디테일(Remote 최소 1시간 등)은 생략. 출처: https://code.claude.com/docs/en/routines , https://code.claude.com/docs/en/desktop-scheduled-tasks");
  return s;
}

// ── 슬라이드 8 — Computer use (B) ───────────────────────────────────
async function createSlide08(pptx) {
  const s = pptx.addSlide({ masterName: "MASTER" });
  K.headerBar(s, C.step5);
  K.pageHeader(s, "Computer use — 화면을 보고 직접 조작", "개념과 왜 조심해야 하나");
  K.text(s, "Claude가 화면을 스크린샷으로 보고 마우스·키보드로 GUI를 조작 — 사람이 하듯 앱을 다룸", 0.5, 1.6, 15, 0.5, { size: 17, bold: true, color: C.primary });

  sectionTitle(s, "동작 방식 (반복 순환)", 0.5, 2.25, 4.6, C.primary, 16);
  const loop = [["① 화면을 본다(스크린샷)", C.step1], ["② 클릭·타이핑", C.step2], ["③ 앱이 실행", C.step3], ["④ 결과 확인 → 반복", C.step5]];
  let y = 2.7;
  for (const [label, col] of loop) { K.flowStep(s, 0.5, y, 4.6, 0.6, label, col, 16); y += 0.74; }

  K.card(s, 5.4, 2.25, 5.0, 3.6, C.cardBg, C.cardBorder);
  sectionTitle(s, "꼭 기억할 3가지", 5.62, 2.4, 4.6, C.teal, 16);
  bullets(s, [
    { t: "사람처럼 화면을 본다: 스크린샷으로 보고 마우스·키보드로 조작", color: C.body },
    { t: "느려서 마지막 수단: 빠르고 정밀한 방법(커넥터)이 먼저 — 그 무엇도 안 될 때만", color: C.body },
    { t: "위험한 건 사람이·언제든 멈춤: 로그인·결제·약관 동의는 사람이, 어디서든 Esc로 즉시 중단", bold: true, color: C.primary },
  ], 5.66, 2.9, 4.5, 2.85, { gap: 12, size: 16 });

  K.addImage(s, IMG("s8_computer_use_loop.png"), { x: 10.7, y: 2.3, w: 4.8, h: 3.5, sizing: { type: "contain", w: 4.8, h: 3.5 } });

  K.highlight(s, "⚠ 현재 연구 프리뷰 · 기본 OFF · Pro·Max 전용(Team·Enterprise 불가). 샌드박스가 아닌 진짜 데스크톱에서 동작 → 고위험 조작은 실습하지 않고 데모·관찰만.", 0.5, 6.1, 15, 0.85, { size: 16, fill: "FEF3C7", color: "92400E" });

  note(s, "전문 도구명(Bash·Chrome 등)은 삭제하고 '빠르고 정밀한 방법이 먼저'만. 핵심 3가지(사람처럼 본다/느려서 최후 수단/로그인·결제는 사람이·Esc 중단). research preview·기본 OFF·Pro·Max 전용·실제 데스크톱·Esc 중단은 정확 팩트. 출처: https://code.claude.com/docs/en/computer-use , https://code.claude.com/docs/en/desktop , https://platform.claude.com/docs/en/agents-and-tools/tool-use/computer-use-tool");
  return s;
}

// ── 슬라이드 9 — 실습 3종 (E) ───────────────────────────────────────
async function createSlide09(pptx) {
  const s = pptx.addSlide({ masterName: "MASTER" });
  K.headerBar(s, C.green);
  K.pageHeader(s, "실습 3종 — 연결하고, 자동화하고, 관찰하기", "오늘의 손으로 해보기");

  const cards = [
    { hd: "① 지도 MCP · 경로·맛집", col: C.catA, lines: ["지도 커넥터 연결 후", "\"○○역→△△ 경로와 주변 맛집 추천\"을 자연어로 지시", "→ 커넥터 사용 체감"] },
    { hd: "② 루틴 · 아침 뉴스레터", col: C.catB, lines: ["\"매일 아침 9시에 특정 주제 뉴스 요약을 메일로\" 루틴 생성", "주기 설정 후 Run now로 시험 실행"] },
    { hd: "③ Computer use · 관찰", col: C.catC, lines: ["강사가 예시 데이터로 화면 조작 시연", "학습자는 승인 프롬프트·Esc 중단을 직접 눌러보며 관찰", "(고위험 직접 조작 안 함)"] },
  ];
  const cw = 4.85, gap = 0.22; let x = 0.5;
  for (const c of cards) {
    K.card(s, x, 1.75, cw, 3.55);
    K.roundRect(s, x, 1.75, cw, 0.55, c.col, { radius: 0.08 });
    s.addText(c.hd, { x, y: 1.75, w: cw, h: 0.55, align: "center", valign: "middle", fontFace: FONT, bold: true, fontSize: fs16(16), color: C.white });
    bullets(s, c.lines.map(t => ({ t, color: C.body })), x + 0.22, 2.45, cw - 0.44, 2.7, { gap: 10, size: 16 });
    x += cw + gap;
  }

  K.highlight(s, "오늘의 산출물: 커넥터 1건 연결 + 루틴 1건 생성   ·   모두 \"내가 선택한 폴더 안에서 / 사람이 승인하며\" 진행", 0.5, 5.6, 15, 0.8, { size: 17 });

  note(s, "실습 3종을 색상 헤더 카드로(패턴 E). 산출물 기준(커넥터 1건+루틴 1건). ③ Computer use는 예시 데이터 시연, 학습자는 승인·Esc 중단 관찰. 출처: https://code.claude.com/docs/en/routines , https://code.claude.com/docs/en/computer-use");
  return s;
}

// ── 슬라이드 10 — ICTK 안전 수칙 (A) ────────────────────────────────
async function createSlide10(pptx) {
  const s = pptx.addSlide({ masterName: "MASTER" });
  K.headerBar(s, C.step4);
  K.pageHeader(s, "ICTK 안전 수칙", "데이터 격리 · 최소권한 · 사람 최종 승인");
  K.highlight(s, "보안 IC(PUF) 기업 ICTK의 자동화 기본기 — 외부 연결·자동 반복에도 흔들리지 않는 3원칙", 0.5, 1.65, 15, 0.6, { size: 18, bold: true });

  const cards = [
    { hd: "1. 데이터 격리", col: C.catE, lines: ["작업은 내가 선택한 폴더 안에서만", "추가 폴더는 명시 허용해야 접근", "클라우드 루틴은 선택한 저장소·커넥터 범위로 한정"] },
    { hd: "2. 최소권한", col: C.catC, lines: ["연결 전 그 서버를 신뢰하는지 확인", "(외부 콘텐츠는 프롬프트 인젝션 위험)", "불필요한 커넥터는 제거 · Computer use는 앱별로 좁게 승인"] },
    { hd: "3. 사람 최종 승인", col: C.catB, lines: ["편집·실행·도구 첫 호출은 diff를 보고 Accept/Reject", "로그인·결제·발급·제출 등 고위험은 사람이 직접"] },
  ];
  const cw = 4.85, gap = 0.22; let x = 0.5;
  for (const c of cards) {
    K.card(s, x, 2.45, cw, 2.95);
    K.roundRect(s, x, 2.45, cw, 0.55, c.col, { radius: 0.08 });
    s.addText(c.hd, { x, y: 2.45, w: cw, h: 0.55, align: "center", valign: "middle", fontFace: FONT, bold: true, fontSize: fs16(16), color: C.white });
    bullets(s, c.lines.map(t => ({ t, color: C.body })), x + 0.22, 3.15, cw - 0.44, 2.1, { gap: 9, size: 16 });
    x += cw + gap;
  }

  bullets(s, [
    { t: "프롬프트 인젝션: 외부 문서·화면 속 숨은 지시문이 Claude를 속여 엉뚱한 동작을 시키는 공격 — 신뢰되지 않은 서버 연결을 경계", color: C.body },
    { t: "권장 모드는 Ask permissions: Claude가 변경 전 묻고, 사람이 각 변경을 승인/거부", bold: true, color: C.primary },
  ], 0.55, 5.6, 15, 1.4, { gap: 8, size: 16 });

  note(s, "3원칙(데이터 격리·최소권한·사람 최종 승인)을 색상 카드로(패턴 A). ICTK 보안 메시지 집약. 프롬프트 인젝션을 쉬운 말로. 출처: https://code.claude.com/docs/en/permissions , https://code.claude.com/docs/en/mcp , https://code.claude.com/docs/en/desktop");
  return s;
}

// ── 슬라이드 11 — 정리·과제·예고 (F) ────────────────────────────────
async function createSlide11(pptx) {
  const s = pptx.addSlide({ masterName: "MASTER" });
  K.headerBar(s, C.green);
  K.pageHeader(s, "정리 · 2주 과제 · 3회차 예고", "오늘 요약 / 할 일 / 다음 미리보기");

  K.card(s, 0.5, 1.65, 7.4, 2.55, "ECFDF5", C.green);
  sectionTitle(s, "오늘 배운 것", 0.75, 1.78, 6, "0F766E", 17);
  bullets(s, [
    { t: "커넥터/MCP: 화면 클릭으로 외부 도구 연결(\"AI의 USB-C\") · /mcp로 상태 확인", color: C.primary },
    { t: "루틴: 정해진 시각 자동 실행 — Remote(클라우드)/Local(데스크톱)", color: C.primary },
    { t: "Computer use: 화면 보고 직접 조작 — 느린 최후 수단·로그인/결제는 사람이·Esc 중단", color: C.primary },
  ], 0.78, 2.28, 6.9, 1.9, { gap: 9, size: 16 });

  sectionTitle(s, "2주 과제 — 루틴 후보 1개 설계 (3회차 Skill 구현 재료)", 8.2, 1.65, 7.3, C.primary, 17);
  K.table(s, [
    K.headRow(["정의 항목", "적을 내용(예)"]),
    ["트리거", "언제 실행? (매일 아침 9시 / 매주 월요일)"],
    ["입력", "무엇을 받나? (특정 주제·메일함·캘린더)"],
    ["출력", "무엇을 만드나? (요약 메일 1통 / Slack 메시지)"],
  ], { x: 8.2, y: 2.15, w: 7.3, colW: [1.8, 5.5], rowH: [0.5, 0.6, 0.6, 0.6], fontSize: 16, align: "left" });

  K.highlight(s, "3회차 예고 — Skill 기초: 반복 프롬프트·작업을 재사용 가능한 SKILL.md로 승격. 오늘 설계한 루틴 후보가 곧 3회차 Skill의 재료가 됩니다.", 0.5, 5.95, 15, 0.85, { size: 17 });

  note(s, "정리 후 2주 과제(반복 작업 1개를 트리거·입력·출력으로 정의 = 3회차 Skill 재료). 학습 연속성: 1회차(말로 시키기)→2회차(연결·자동반복)→3회차(Skill로 재사용). 출처: https://code.claude.com/docs/en/routines , https://code.claude.com/docs/en/mcp");
  return s;
}

async function main() {
  const pptx = K.newDeck();
  pptx.author = "Unicorn / 이해경"; pptx.company = "ICTK";
  pptx.subject = "Claude Code 업무 자동화 부트캠프 2회차";
  pptx.title = "2회차 — 커넥터·루틴·Computer use 활용";
  K.defineMaster(pptx, FOOTER);
  const slides = [createSlide01, createSlide02, createSlide03, createSlide04, createSlide05, createSlide06,
    createSlide07, createSlide08, createSlide09, createSlide10, createSlide11];
  for (const fn of slides) await fn(pptx);
  const out = path.join(__dirname, "2회차-커넥터-루틴-ComputerUse.pptx");
  await pptx.writeFile({ fileName: out });
  console.log("✅ PPT 생성 완료:", out, "| 슬라이드:", slides.length);
}
main().catch((e) => { console.error("❌ PPT 생성 실패:", e); process.exit(1); });
