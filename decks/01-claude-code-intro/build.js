// build.js — ICTK 부트캠프 1회차 "Claude Code 입문 + 프롬프트 기초" PPT 빌드
// ppt-guide.md 6절 준수 / 최소폰트 16pt / Desktop 앱 기준
"use strict";
const path = require("path");
const K = require(path.join(__dirname, "..", "_lib", "pptkit"));
const { C, FONT, fs16, MARGIN, CW, PAGE_W } = K;

const IMG = (f) => path.join(__dirname, "images", f);
const FOOTER = "ⓒ ICTK · Unicorn — Claude Code 업무 자동화 부트캠프 1회차 · 무단전재 및 배포 금지";

// ── 공용 작은 헬퍼 ──────────────────────────────────────────────────
function bullets(slide, items, x, y, w, h, opts = {}) {
  const runs = items.map((it, i) => ({
    text: it.t !== undefined ? it.t : it,
    options: {
      fontFace: FONT, fontSize: fs16(it.size || opts.size || 16),
      bold: !!it.bold, color: it.color || opts.color || C.body,
      bullet: it.bullet === false ? false : { code: "2022", indent: 14 },
      breakLine: true, paraSpaceAfter: opts.gap !== undefined ? opts.gap : 6,
      indentLevel: it.lvl || 0,
    },
  }));
  slide.addText(runs, { x, y, w, h, align: "left", valign: "top", lineSpacingMultiple: opts.lsm || 1.05 });
}
function sectionTitle(slide, str, x, y, w, color = C.primary, size = 18) {
  slide.addText(str, { x, y, w, h: 0.4, align: "left", valign: "middle", fontFace: FONT, bold: true, fontSize: fs16(size), color });
}
function note(slide, txt) { slide.addNotes(txt); }

// ════════════════════════════════════════════════════════════════════
// 슬라이드 1 — 타이틀 (패턴 A)
// ════════════════════════════════════════════════════════════════════
async function createSlide01(pptx) {
  const s = pptx.addSlide({ masterName: "MASTER" });
  // 상단 컬러 밴드
  K.rect(s, 0, 0, PAGE_W, 2.95, C.primary);
  K.rect(s, 0, 0, 0.28, 2.95, C.green);
  s.addText("입문자 과정 · 1회차 / 11회차", { x: 0.95, y: 0.55, w: 13, h: 0.5, fontFace: FONT, bold: true, fontSize: fs16(20), color: "7FE7C4" });
  s.addText("Claude Code 업무 자동화 부트캠프", { x: 0.95, y: 1.05, w: 14.2, h: 1.05, fontFace: FONT, bold: true, fontSize: fs16(42), color: C.white });
  s.addText("ICTK 임직원을 위한 실습 중심 부트캠프 (비개발자 포함)", { x: 0.95, y: 2.2, w: 14, h: 0.5, fontFace: FONT, fontSize: fs16(19), color: "D8D8D8" });

  // 좌측 정보 표
  K.table(s, [
    K.headRow(["구분", "내용"]),
    ["학습 골격", "Prompt 단계 (1~2회차)"],
    ["1회차 주제", "Claude Code 설치·기본 사용·업무 자동화 프롬프트"],
    ["운영 방식", "1회 3시간 · 격주 진행"],
    ["선수지식", "없음 (설치부터 함께 시작)"],
    ["의뢰", "ICTK — VIA PUF 기반 보안 IC 팹리스"],
  ], { x: 0.5, y: 3.35, w: 7.7, colW: [2.0, 5.7], rowH: [0.5, 0.55, 0.78, 0.55, 0.55, 0.55], fontSize: 16, align: "left" });

  // 우측 표지 이미지
  K.addImage(s, IMG("s1_cover.png"), { x: 8.7, y: 3.35, w: 6.8, h: 3.55, sizing: { type: "contain", w: 6.8, h: 3.55 } });

  // 하단 핵심 메시지
  K.highlight(s, "코딩 경험이 없어도 됩니다. 오늘 설치부터 시작해 \"내 업무를 도와주는 AI 비서\"를 손에 넣습니다.", 0.5, 7.45, 15, 0.7, { size: 18, bold: true });

  note(s, "핵심 메시지: 코딩 경험이 없어도 됩니다. 오늘 설치부터 시작해 '내 업무를 도와주는 AI 비서'를 손에 넣습니다.\n\n[발표] '입문자 과정'임을 명확히 안내해 비개발자의 부담을 낮춘다. ICTK가 보안 IC 팹리스 기업임을 언급하되, 오늘은 누구나 따라올 수 있는 기초임을 강조. 11회차 중 1회차, 격주 3시간 운영. 이번 회차는 검은 명령창(터미널)이 아니라 친숙한 데스크톱 앱 화면으로 진행함을 미리 안내. 출처: 의뢰 커리큘럼(내부 자료).");
  return s;
}

// ════════════════════════════════════════════════════════════════════
// 슬라이드 2 — WHY 왜 업무 자동화인가 (패턴 B)
// ════════════════════════════════════════════════════════════════════
async function createSlide02(pptx) {
  const s = pptx.addSlide({ masterName: "MASTER" });
  K.headerBar(s, C.green);
  K.pageHeader(s, "WHY — 왜 업무 자동화인가", "반복 작업은 AI에게, 사람은 판단에 집중");
  K.highlight(s, "반복 작업이 하루를 갉아먹습니다. AI에게 맡기고, 사람은 판단에 집중합니다.", 0.5, 1.65, 15, 0.6, { size: 18, bold: true });

  // 좌측: 매일 반복되는 일
  K.card(s, 0.5, 2.5, 4.6, 3.6);
  K.badge(s, 0.75, 2.7, 2.4, "매일 반복되는 일", C.darkBadge, C.white, 0.45, 16);
  bullets(s, [
    "긴 자료를 읽고 핵심만 추리기",
    "회의 메모를 보고서 형식으로 정리하기",
    "같은 형식의 문서를 매번 새로 작성하기",
  ], 0.8, 3.35, 4.1, 2.6, { gap: 12, size: 17 });

  // 화살표
  s.addText("▶", { x: 5.2, y: 4.0, w: 0.6, h: 0.6, align: "center", valign: "middle", fontFace: FONT, fontSize: fs16(28), color: C.green });

  // 중앙: Claude Code에게 요청 (역할 분담)
  K.card(s, 5.9, 2.5, 4.3, 3.6, "ECFDF5", C.green);
  K.badge(s, 6.15, 2.7, 3.4, "Claude Code에게 자연어로 요청", C.green, C.white, 0.45, 16);
  bullets(s, [
    { t: "사람: \"무엇을·왜\"를 정함 (판단)", bold: true, color: C.primary },
    { t: "AI: \"어떻게\"를 빠르게 실행 (작업)", bold: true, color: C.primary },
    { t: "사람: 결과를 최종 확인·승인 (게이트)", bold: true, color: C.primary },
  ], 6.2, 3.35, 3.8, 2.6, { gap: 14, size: 17 });

  // 우측: 이미지
  K.addImage(s, IMG("s2_why_automation.png"), { x: 10.5, y: 2.5, w: 5.0, h: 3.35, sizing: { type: "contain", w: 5.0, h: 3.35 } });

  K.highlight(s, "자동화의 목적은 \"사람을 대체\"가 아니라 \"사람이 더 중요한 일에 집중\"하게 만드는 것입니다.", 0.5, 6.4, 15, 0.7, { size: 17, fill: "CCFBF1" });

  note(s, "핵심 메시지: 자동화의 목적은 '사람 대체'가 아니라 '사람이 더 중요한 일에 집중'.\n\n[발표] 골든서클 WHY. 청중에게 '내 업무 중 매번 반복하는 일'을 떠올리게 함(2주 과제 복선). 자동화는 일자리 위협이 아니라 단순 반복에서 벗어나 판단·창의에 집중하는 도구. 보안 IC 기업 특성상 '사람 최종 승인'이 기본 전제임을 미리 암시. 출처: https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices");
  return s;
}

// ════════════════════════════════════════════════════════════════════
// 슬라이드 3 — Claude Code란? HOW (패턴 D)
// ════════════════════════════════════════════════════════════════════
async function createSlide03(pptx) {
  const s = pptx.addSlide({ masterName: "MASTER" });
  K.headerBar(s, C.teal);
  K.pageHeader(s, "Claude Code란? — HOW", "내 컴퓨터에서 일하는 AI 작업 도우미 (에이전틱 코딩 도구)");

  // 정의 카드
  K.card(s, 0.5, 1.75, 15, 1.25);
  K.richText(s, [
    { text: "공식 정의  ", bold: true, color: C.teal, size: 16 },
    { text: "코드베이스를 읽고, 파일을 편집하고, 명령을 실행하며, 개발 도구와 통합되는 도구.", color: C.body, size: 16, breakLine: true },
    { text: "쉽게 말하면  →  ", bold: true, color: C.green, size: 16 },
    { text: "\"내 폴더의 파일을 읽고 정리해 주는, 대화로 일 시키는 AI 비서\"", bold: true, color: C.primary, size: 17 },
  ], 0.75, 1.95, 14.5, 0.9, { lsm: 1.3 });

  // 오늘 쓰는 환경 강조
  K.badge(s, 0.5, 3.25, 6.4, "오늘 우리가 쓰는 것 — Claude Code 데스크톱 앱 (GUI)", C.green, C.white, 0.5, 17);
  K.card(s, 0.5, 3.95, 15, 1.0, "ECFDF5", C.green);
  K.text(s, "Claude 앱을 설치하고 상단의 \"Code\" 탭을 켜서 사용. 검은 명령창 없이 화면으로 클릭·입력하는 가장 친숙한 방식입니다.", 0.75, 4.05, 14.5, 0.8, { size: 17, color: C.primary, valign: "middle" });

  // 두 개의 보조 박스
  K.card(s, 0.5, 5.2, 7.4, 2.05, C.cardBg, C.cardBorder);
  sectionTitle(s, "이런 것도 있어요 (나중에)", 0.75, 5.35, 6.9, C.sub, 16);
  K.text(s, "터미널(명령창), VS Code 같은 편집기 안(IDE), 웹 브라우저에서도 같은 Claude Code를 쓸 수 있습니다. 모두 같은 엔진을 공유하므로, 오늘은 '데스크톱 앱' 하나만 익히면 충분합니다.", 0.75, 5.8, 6.9, 1.35, { size: 16, color: C.body });

  K.card(s, 8.1, 5.2, 7.4, 2.05, "FFF7ED", "ED7D31");
  sectionTitle(s, "용어 — 데스크톱 앱이란?", 8.35, 5.35, 6.9, "C0530A", 16);
  K.text(s, "Anthropic이 제공하는 Claude 프로그램. 대화용 Chat · 클라우드 작업용 Cowork · 내 파일을 다루는 Code 3개 탭으로 구성되며, 이 \"Code\" 탭이 곧 Claude Code입니다.", 8.35, 5.8, 6.9, 1.35, { size: 16, color: C.body });

  note(s, "[발표] '에이전틱(agentic) = 스스로 파일을 찾고 작업을 단계별로 수행'을 한 줄로 풀어준다. 비개발자가 겁먹지 않도록 '코드를 몰라도 자연어로 시키면 된다' + '검은 명령창이 아니라 친숙한 GUI'를 반복 강조. 데스크톱 앱은 별도 빌드가 아니라 Claude 앱(Chat·Cowork·Code)의 Code 탭이며 CLI와 동일 엔진·설정(CLAUDE.md·MCP·skills) 공유. 출처: https://code.claude.com/docs/en/overview, https://code.claude.com/docs/en/desktop-quickstart");
  return s;
}

// ════════════════════════════════════════════════════════════════════
// 슬라이드 4 — 설치하기 (패턴 D)
// ════════════════════════════════════════════════════════════════════
async function createSlide04(pptx) {
  const s = pptx.addSlide({ masterName: "MASTER" });
  K.headerBar(s, C.green);
  K.pageHeader(s, "설치하기 (Windows 기준)", "설치 파일을 내려받아 실행하면 끝");
  K.highlight(s, "검은 명령창은 필요 없습니다. 설치 파일을 내려받아 실행하면 끝입니다.", 0.5, 1.65, 15, 0.6, { size: 18, bold: true });

  // 좌측: 3단계 설치 흐름
  sectionTitle(s, "설치 흐름 (3단계)", 0.5, 2.45, 6.8, C.primary, 17);
  K.flowStep(s, 0.5, 2.95, 6.8, 0.78, "① 공식 다운로드 페이지에서\nWindows용 설치 파일 내려받기", C.step1, 16);
  K.arrowDown(s, 3.7, 3.78);
  K.flowStep(s, 0.5, 4.12, 6.8, 0.78, "② 설치 파일(setup) 더블클릭 실행\n→ 안내대로 설치 (관리자 권한 불필요)", C.step3, 16);
  K.arrowDown(s, 3.7, 4.95);
  K.flowStep(s, 0.5, 5.29, 6.8, 0.78, "③ Windows 시작 메뉴에서\n'Claude' 실행", C.step4, 16);

  // 우측: 정보 표
  K.table(s, [
    K.headRow(["항목", "내용"]),
    ["설치 방식", "다운로드 → 더블클릭 실행 (명령어 입력 없음)"],
    ["선행 준비", "Git for Windows 설치 · 설치 후 앱 재시작"],
    ["별도 설치", "Node.js·CLI 불필요 (앱에 Claude Code 포함)"],
    ["칩셋 안내", "ARM64 PC는 'ARM64 installer' / Windows·Mac 전용"],
  ], { x: 7.7, y: 2.95, w: 7.8, colW: [1.9, 5.9], rowH: [0.5, 0.62, 0.62, 0.62, 0.62], fontSize: 16, align: "left" });

  // 하단 경고
  K.highlight(s, "⚠ 시작 전 확인: 유료 계정(Pro·Max·Team·Enterprise) 필요. 무료 claude.ai 플랜으로는 \"Code\" 탭 사용 불가 — 업그레이드 안내가 뜨면 먼저 유료 구독.", 0.5, 6.55, 15, 0.75, { size: 16, fill: "FEF3C7", color: "92400E" });

  note(s, "[발표] PowerShell 설치 명령(irm install.ps1 등)은 사용하지 않음 — 데스크톱 설치 절차(다운로드→설치 파일 실행→시작 메뉴 실행). '명령어를 입력하지 않는다'가 입문자 최대 안심 포인트. Windows 로컬 세션 동작에 Git for Windows 필수 + 설치 후 앱 재시작 필요(공식 전제). Node.js·CLI 별도 설치 불필요. ARM64 별도 인스톨러, Linux 미지원(데스크톱 앱은 Win·Mac 전용). 무료 플랜 불가·유료 계정 필요. 출처: https://code.claude.com/docs/en/desktop, https://code.claude.com/docs/en/desktop-quickstart");
  return s;
}

// ════════════════════════════════════════════════════════════════════
// 슬라이드 5 — 로그인과 Code 탭 열기 (패턴 C)
// ════════════════════════════════════════════════════════════════════
async function createSlide05(pptx) {
  const s = pptx.addSlide({ masterName: "MASTER" });
  K.headerBar(s, C.step2);
  K.pageHeader(s, "로그인과 Code 탭 열기", "계정으로 로그인하고 \"Code\" 탭만 누르면 준비 완료");
  K.highlight(s, "로그인은 처음 한 번이면 끝. 앱에서 계정으로 로그인하고 \"Code\" 탭을 누르면 준비 완료입니다.", 0.5, 1.65, 15, 0.6, { size: 18, bold: true });

  // 좌측: 로그인 4단계
  sectionTitle(s, "로그인 흐름", 0.5, 2.45, 6.8, C.primary, 17);
  const steps = [
    ["① 시작 메뉴에서 Claude 앱 실행", C.step1],
    ["② Anthropic 계정으로 로그인 (Sign in)", C.step2],
    ["③ 상단 중앙 \"Code\" 탭 클릭 → 세션 시작", C.step4],
    ["④ 업그레이드/재로그인 안내 시 → 구독·로그인 후 앱 재시작", C.step5],
  ];
  let y = 2.95;
  for (const [label, col] of steps) { K.flowStep(s, 0.5, y, 6.9, 0.62, label, col, 16); y += 0.78; }

  // 우측: 3개 탭 표
  sectionTitle(s, "Claude 앱의 3개 탭", 7.8, 2.45, 7.7, C.primary, 17);
  K.table(s, [
    K.headRow(["탭", "역할"]),
    ["Chat", "파일 접근 없는 일반 대화 (claude.ai와 유사)"],
    ["Cowork", "클라우드에서 자율로 도는 백그라운드 작업"],
    [{ text: "Code", options: { bold: true, color: C.green, fontFace: FONT, fontSize: fs16(16) } },
     { text: "내 PC 파일을 직접 다루는 코딩 보조  ← 오늘 사용", options: { bold: true, color: C.primary, fontFace: FONT, fontSize: fs16(16) } }],
  ], { x: 7.8, y: 2.95, w: 7.7, colW: [1.7, 6.0], rowH: [0.5, 0.78, 0.78, 0.92], fontSize: 16, align: "left" });

  K.highlight(s, "로그인은 앱이 기억하므로 매번 다시 할 필요 없음. 오늘 모든 실습은 \"Code\" 탭에서 진행합니다. (\"Chat\"은 파일을 건드리지 않는 일반 대화용)", 0.5, 6.6, 15, 0.7, { size: 16, fill: "CCFBF1" });

  note(s, "[발표] 터미널의 'c키로 URL 복사' 흐름 대신 데스크톱 앱 계정 로그인. Claude 앱이 Chat·Cowork·Code 3개 탭으로 구성되며 오늘 쓰는 것은 Code 탭임을 명확히(입문자가 Chat과 혼동 금지). 무료 플랜 불가는 슬라이드 4에서 강조했으므로 여기서는 업그레이드/재로그인 분기만. 출처: https://code.claude.com/docs/en/desktop-quickstart");
  return s;
}

// ════════════════════════════════════════════════════════════════════
// 슬라이드 6 — 첫 실행과 기본 사용 흐름 (패턴 C)
// ════════════════════════════════════════════════════════════════════
async function createSlide06(pptx) {
  const s = pptx.addSlide({ masterName: "MASTER" });
  K.headerBar(s, C.step3);
  K.pageHeader(s, "첫 실행과 기본 사용 흐름", "폴더 열기 → 요청 → 확인 → 수정");
  K.highlight(s, "폴더 열기 → 요청 → 결과 확인 → 수정. 이 대화 반복이 전부입니다.", 0.5, 1.65, 15, 0.6, { size: 18, bold: true });

  // 좌측: 4단계 흐름
  sectionTitle(s, "기본 흐름", 0.5, 2.45, 7.0, C.primary, 17);
  const steps = [
    ["① Code 탭에서 작업 폴더(프로젝트) 선택\n(Select folder, 환경 Local)", C.step1],
    ["② 프롬프트 박스에 자연어로 요청\n예: \"이 폴더에 무슨 파일이 있는지 알려줘\"", C.step2],
    ["③ 변경안을 diff 화면에서\nAccept / Reject 로 승인·거절", C.step4],
    ["④ 결과 확인 후 추가 요청으로 다듬기 (반복)\n@로 특정 파일을 대화에 추가", C.step5],
  ];
  let y = 2.95;
  for (const [label, col] of steps) { K.flowStep(s, 0.5, y, 7.1, 0.84, label, col, 16); y += 0.98; }

  // 우측: 슬래시 명령
  sectionTitle(s, "자주 쓰는 슬래시 명령", 8.0, 2.45, 7.5, C.primary, 17);
  K.highlight(s, "외우지 마세요 — 프롬프트 박스에 \"/\"만 누르면 전체 목록이 뜹니다.", 8.0, 2.92, 7.5, 0.55, { size: 16, fill: "CCFBF1" });
  K.table(s, [
    K.headRow(["명령", "역할"]),
    ["/help", "도움말·사용 가능한 명령 보기"],
    ["/clear", "빈 컨텍스트로 새 대화 시작"],
    ["/model", "사용할 AI 모델 전환"],
    ["/compact", "대화를 요약해 컨텍스트 공간 확보"],
  ], { x: 8.0, y: 3.6, w: 7.5, colW: [2.0, 5.5], rowH: [0.48, 0.56, 0.56, 0.56, 0.56], fontSize: 16, align: "left" });

  K.text(s, "종료·설정·권한은 명령어가 아니라 화면으로: 세션은 사이드바에서 닫고, 설정·권한 모드는 우상단 ⚙️ Settings → Claude Code 에서 관리. (/permissions·/config·/agents·/doctor는 Code 탭 미지원)",
    8.0, 6.55, 7.5, 0.9, { size: 16, color: C.sub });

  K.highlight(s, "Claude Code 사용의 본질은 단 하나 — \"요청 → 확인 → 수정\"의 대화 반복입니다.", 0.5, 7.55, 7.1, 0.6, { size: 16, fill: "ECFDF5", color: C.primary });

  note(s, "[발표] '폴더 열기→요청→확인→수정'이 데스크톱 Code 탭 사용의 본질. 터미널 표현(claude 실행·Ctrl+D·/exit) 제거, GUI 흐름(Select folder→프롬프트 박스→diff Accept/Reject). 슬래시 명령표는 Desktop Code 탭에서 실제 동작하는 /help·/clear·/model·/compact만. 종료·설정·권한은 사이드바·Settings UI로. /permissions·/config·/agents·/doctor는 Code 탭 미지원('isn't available in this environment'). 출처: https://code.claude.com/docs/en/desktop, https://code.claude.com/docs/en/desktop-quickstart");
  return s;
}

// ════════════════════════════════════════════════════════════════════
// 슬라이드 7 — 작업 폴더·파일·권한 (패턴 B)
// ════════════════════════════════════════════════════════════════════
async function createSlide07(pptx) {
  const s = pptx.addSlide({ masterName: "MASTER" });
  K.headerBar(s, C.step4);
  K.pageHeader(s, "작업 폴더·파일·권한", "선택한 폴더 안에서만, 바꾸기 전 항상 사람에게");
  K.highlight(s, "Claude는 선택한 폴더 안에서만 일하고, 파일을 바꾸기 전 항상 화면으로 사람에게 묻습니다.", 0.5, 1.65, 15, 0.6, { size: 18, bold: true });

  // 좌측 카드: 작동 경계
  K.card(s, 0.5, 2.5, 5.1, 2.85);
  K.badge(s, 0.72, 2.7, 2.3, "작동 경계", C.step2, C.white, 0.45, 16);
  K.text(s, "선택한 폴더가 작업 범위", 3.15, 2.7, 2.3, 0.45, { size: 16, color: C.sub, valign: "middle" });
  bullets(s, [
    "읽기: 선택한 프로젝트 폴더·하위 파일 인식",
    "쓰기: 그 폴더 범위 안에서만 작업 (세션마다 독립)",
    "변경 전 항상 미리보기: diff 화면으로 먼저 확인",
  ], 0.78, 3.35, 4.55, 1.9, { gap: 12, size: 16 });

  // 중앙 카드: 사람 승인 게이트
  K.card(s, 5.8, 2.5, 5.1, 2.85, "FEF2F2", "DC2626");
  K.badge(s, 6.02, 2.7, 4.4, "사람 최종 승인 게이트", C.step4, C.white, 0.45, 16);
  bullets(s, [
    { t: "기본 모드 = Ask permissions(승인형): 편집·실행 전 매번 승인 요청", color: C.primary },
    { t: "변경마다 Accept(수락)/Reject(거절) — 수락 전에는 파일이 바뀌지 않음", color: C.primary },
  ], 6.08, 3.35, 4.55, 1.9, { gap: 14, size: 16 });

  // 우측: 이미지
  K.addImage(s, IMG("s7_human_gate.png"), { x: 11.1, y: 2.5, w: 4.4, h: 2.85, sizing: { type: "contain", w: 4.4, h: 2.85 } });

  // ICTK 안전 메시지
  K.highlight(s, "🔒 ICTK 안전 메시지 — 보안 IC 기업에서는 \"데이터 격리(선택 폴더 안에서만 작업)\"와 \"사람 최종 승인\"이 자동화의 기본기입니다. AI가 시키는 대로 무조건 실행하지 않습니다.", 0.5, 5.55, 15, 0.78, { size: 16, fill: "CCFBF1" });

  K.text(s, "더 알아두면 좋은 것(나중에): 전송 버튼 옆 모드 선택기로 권한 모드 변경(Auto accept edits·Plan 모드 등) · Plan 모드는 변경 없이 계획만 제안 · 세밀한 설정은 ⚙️ Settings · 프로젝트 규칙 메모 CLAUDE.md. — 1회차에서는 위 핵심 2가지만 기억하면 됩니다.",
    0.5, 6.5, 15, 0.85, { size: 16, color: C.sub });

  note(s, "[발표] 제약 요구사항 '사람 최종 승인·데이터 격리'를 충실히 전달. 터미널 단축키(Esc 두 번·Shift+Tab) 제거, 데스크톱 UI 표현(diff Accept/Reject, 전송 버튼 옆 모드 선택기, ⚙️ Settings). 기본 권한 모드 = Ask permissions(승인형, 신규 사용자 권장)이며 수락 전에는 파일이 수정되지 않음. 핵심 2가지(선택 폴더로 범위 한정 + 편집 전 승인)만 크게. 출처: https://code.claude.com/docs/en/desktop, https://code.claude.com/docs/en/desktop-quickstart");
  return s;
}

// ════════════════════════════════════════════════════════════════════
// 슬라이드 8 — 프롬프트가 결과를 좌우한다 (패턴 D)
// ════════════════════════════════════════════════════════════════════
async function createSlide08(pptx) {
  const s = pptx.addSlide({ masterName: "MASTER" });
  K.headerBar(s, C.teal);
  K.pageHeader(s, "프롬프트가 결과를 좌우한다", "같은 일도, 어떻게 요청하느냐에 따라 결과가 달라진다");
  K.highlight(s, "같은 일을 시켜도, 어떻게 요청하느냐에 따라 결과가 완전히 달라집니다.", 0.5, 1.65, 15, 0.6, { size: 18, bold: true });

  K.table(s, [
    K.headRow(["구분", "막연한 프롬프트 (Before)", "구조화된 프롬프트 (After)"]),
    ["요청 예",
      "\"회의 내용 정리해줘\"",
      "\"너는 회의록 담당자야. 아래 메모를 표준 회의록(일시·참석자·결정사항·액션아이템) 형식으로 정리해줘\""],
    ["결과", "형식·길이 제각각, 다시 수정 필요", "원하는 형식 그대로, 재작업 최소"],
    ["이유", "AI가 맥락·기준을 모름", "역할·형식·기준을 명시"],
  ], { x: 0.5, y: 2.45, w: 15, colW: [1.8, 5.7, 7.5], rowH: [0.5, 1.5, 0.7, 0.7], fontSize: 16, align: "left", valign: "middle" });

  K.card(s, 0.5, 6.05, 15, 1.3, "ECFDF5", C.green);
  K.richText(s, [
    { text: "황금률  ", bold: true, color: C.green, size: 17 },
    { text: "\"이 업무를 잘 모르는 동료에게 그대로 시켜 보라. 그가 헷갈리면 AI도 헷갈린다.\"", bold: true, color: C.primary, size: 17, breakLine: true },
    { text: "→ Claude를 \"똑똑하지만 우리 회사 규칙을 전혀 모르는 신입 직원\"처럼 대하세요.", color: C.body, size: 16 },
  ], 0.8, 6.2, 14.4, 1.0, { lsm: 1.25 });

  note(s, "핵심 메시지: 좋은 결과는 좋은 질문에서. 다음 슬라이드 '5요소'가 구조화의 공식.\n\n[발표] Before/After 대비로 '구조화'의 효과를 체감. 공식 비유 '맥락 없는 신입 직원'과 '황금률(동료 테스트)'을 그대로 인용해 신뢰도↑. 실습 3종 중 '막연 vs 구조화 비교'의 도입부. 출처: https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices");
  return s;
}

// ════════════════════════════════════════════════════════════════════
// 슬라이드 9 — 프롬프트 5요소 (패턴 D)
// ════════════════════════════════════════════════════════════════════
async function createSlide09(pptx) {
  const s = pptx.addSlide({ masterName: "MASTER" });
  K.headerBar(s, C.green);
  K.pageHeader(s, "프롬프트 5요소", "역할 · 맥락 · 입력 · 출력 · 제약");
  K.highlight(s, "좋은 프롬프트의 공식: 이 5가지를 채우면 막연함이 사라집니다.", 0.5, 1.65, 15, 0.6, { size: 18, bold: true });

  K.table(s, [
    K.headRow(["요소", "무엇을 적나", "예시"]),
    ["역할", "AI가 어떤 전문가인지", "\"너는 꼼꼼한 회의록 담당자야\""],
    ["맥락", "왜·어떤 상황인지(이유 포함)", "\"주간 팀회의 메모이고 임원 보고용이야\""],
    ["입력", "처리할 자료", "\"아래 메모를 사용해: [메모 내용]\""],
    ["출력", "원하는 형식·분량", "\"일시·참석자·결정·액션 4개 항목 표로\""],
    ["제약", "지켜야 할 규칙", "\"추측 금지, 메모에 없는 내용은 비워둬\""],
  ], { x: 0.5, y: 2.45, w: 15, colW: [1.6, 5.2, 8.2], rowH: [0.5, 0.6, 0.6, 0.6, 0.6, 0.6], fontSize: 16, align: "left", valign: "middle" });

  K.card(s, 0.5, 6.2, 15, 1.15, "CCFBF1", "0D9488");
  sectionTitle(s, "기억할 팁", 0.75, 6.32, 6, "0F766E", 16);
  bullets(s, [
    "\"하지 마라\"보다 \"이렇게 하라\"로 (긍정형 지시가 더 잘 따름)",
    "이유를 함께 주면 더 정확해짐 (예: \"임원 보고용이니 추측 빼고 메모에 있는 사실만\")",
    "형식이 중요하면 예시 3~5개를 보여주기 (출력 일관성 향상)",
  ], 0.78, 6.72, 14.5, 0.6, { gap: 2, size: 16, color: C.primary });

  note(s, "[발표] 1회차 학습목표의 핵심 산출물. 5요소를 표로, 각 행에 ICTK 직원이 바로 쓸 수 있는 예시. '이유 제공' 예시를 ICTK 맥락('임원 보고용이니 추측 빼고 사실만')으로 교체해 학습 전이↑. '긍정형 지시'와 '이유 제공'은 별개 원칙. 이 5요소가 2주 과제의 작성 틀. 출처: https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices");
  return s;
}

// ════════════════════════════════════════════════════════════════════
// 슬라이드 10 — WHAT 실습 3종 (패턴 F)
// ════════════════════════════════════════════════════════════════════
async function createSlide10(pptx) {
  const s = pptx.addSlide({ masterName: "MASTER" });
  K.headerBar(s, C.step5);
  K.pageHeader(s, "WHAT — 실습 3종 (직접 따라하기)", "배운 흐름과 5요소를 실제 업무 자료로");
  K.highlight(s, "오늘 만드는 결과물: 배운 흐름과 5요소를 실제 업무 자료로 직접 실습합니다.", 0.5, 1.65, 15, 0.6, { size: 18, bold: true });

  const cards = [
    { hd: "실습 1 · 핵심 3줄 요약", col: C.catA, lines: ["긴 자료를 주고\n\"핵심을 3줄로 요약해줘\"", "팁: 긴 자료는 위에,\n요청은 맨 아래에 배치하면 품질↑"] },
    { hd: "실습 2 · 표준 회의록", col: C.catB, lines: ["회의 메모 → 표준 회의록", "5요소 적용: 역할(회의록 담당)\n+ 출력(일시·참석자·결정·액션)\n+ 제약(추측 금지)"] },
    { hd: "실습 3 · 막연 vs 구조화", col: C.catE, lines: ["같은 요청을 ① 막연하게\n② 5요소로 각각 보내고\n결과를 나란히 비교", "\"어디가 달라졌는가\"를\n스스로 확인"] },
  ];
  const cw = 4.85, gap = 0.22; let x = 0.5;
  for (const c of cards) {
    K.card(s, x, 2.5, cw, 3.5);
    K.roundRect(s, x, 2.5, cw, 0.55, c.col, { radius: 0.08 });
    s.addText(c.hd, { x, y: 2.5, w: cw, h: 0.55, align: "center", valign: "middle", fontFace: FONT, bold: true, fontSize: fs16(16), color: C.white });
    bullets(s, c.lines.map(t => ({ t, color: C.body })), x + 0.25, 3.25, cw - 0.5, 2.6, { gap: 12, size: 16 });
    x += cw + gap;
  }

  K.highlight(s, "🔒 실습 공통 안전 수칙(ICTK): 민감/대외비 자료는 사용하지 않음(일반·예시 자료로) · 결과는 사람이 최종 확인 후 사용.", 0.5, 6.3, 15, 0.75, { size: 16, fill: "CCFBF1" });

  note(s, "[발표] 골든서클 WHAT 단계 — WHY(슬2)→HOW(슬3)→WHAT(슬10) 흐름 완결. 강사가 실습 1을 데스크톱 앱 화면으로 먼저 시연 후 참가자가 따라 함. 실습 3은 5요소 효과를 가장 극적으로 보여주므로 시간 충분히. 보안 IC 기업 맥락상 '대외비 미사용·결과 사람 확인' 수칙 명시. 출처: https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices");
  return s;
}

// ════════════════════════════════════════════════════════════════════
// 슬라이드 11 — 정리·과제·예고 (패턴 F)
// ════════════════════════════════════════════════════════════════════
async function createSlide11(pptx) {
  const s = pptx.addSlide({ masterName: "MASTER" });
  K.headerBar(s, C.green);
  K.pageHeader(s, "정리 · 2주 과제 · 다음 회차", "오늘 요약 / 할 일 / 2회차 미리보기");

  const cols = [
    { hd: "오늘의 핵심 3가지", col: C.catB, lines: [
      "Claude Code 데스크톱 앱 설치·로그인·기본 사용(폴더 열기→요청→확인→수정)을 익혔다",
      "\"사람 최종 승인·데이터 격리\"가 자동화의 기본기다",
      "좋은 결과는 \"5요소(역할·맥락·입력·출력·제약)\" 구조화에서 나온다",
    ] },
    { hd: "2주 과제 (2회차 재료)", col: C.catC, lines: [
      "본인 업무의 반복 작업 3가지를 고른다",
      "각각을 5요소 구조 프롬프트로 작성한다",
      "막연한 요청과 결과를 비교해 \"무엇이 좋아졌는지\" 메모한다",
    ] },
    { hd: "다음 회차(2회차) 예고", col: C.catA, lines: [
      "Prompt 단계 심화 — 과제로 만든 프롬프트를 함께 개선",
      "더 정확한 결과를 위한 구조화 기법 확장",
    ] },
  ];
  const cw = 4.85, gap = 0.22; let x = 0.5;
  for (const c of cols) {
    K.card(s, x, 1.7, cw, 4.4);
    K.roundRect(s, x, 1.7, cw, 0.6, c.col, { radius: 0.08 });
    s.addText(c.hd, { x, y: 1.7, w: cw, h: 0.6, align: "center", valign: "middle", fontFace: FONT, bold: true, fontSize: fs16(16), color: C.white });
    bullets(s, c.lines.map(t => ({ t, color: C.body })), x + 0.25, 2.55, cw - 0.5, 3.4, { gap: 14, size: 16 });
    x += cw + gap;
  }

  K.highlight(s, "오늘 설치한 도구로, 2주 동안 \"내 업무용 프롬프트 3개\"를 만들어 오세요. 그것이 여러분의 첫 자동화 자산입니다.", 0.5, 6.45, 15, 0.85, { size: 18, bold: true });

  note(s, "[발표] 학습목표 달성 여부를 3가지로 정리해 회수. '설치·로그인·기본 사용'을 데스크톱 앱 기준 표현(폴더 열기→요청→확인→수정)으로. 2주 과제는 2회차 심화의 입력물 — '반복 작업 3가지 × 5요소 × 비교 메모'라는 구체적 산출 기준. 다음 회차가 Prompt 단계 연속임을 안내. 출처: 의뢰 커리큘럼(내부 자료), https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices");
  return s;
}

// ════════════════════════════════════════════════════════════════════
async function main() {
  const pptx = K.newDeck();
  pptx.author = "Unicorn / 이해경";
  pptx.company = "ICTK";
  pptx.subject = "Claude Code 업무 자동화 부트캠프 1회차";
  pptx.title = "1회차 — Claude Code 입문 + 프롬프트 기초";
  K.defineMaster(pptx, FOOTER);

  const slides = [createSlide01, createSlide02, createSlide03, createSlide04, createSlide05, createSlide06,
    createSlide07, createSlide08, createSlide09, createSlide10, createSlide11];
  for (const fn of slides) await fn(pptx);

  const out = path.join(__dirname, "1회차-ClaudeCode입문-프롬프트기초.pptx");
  await pptx.writeFile({ fileName: out });
  console.log("✅ PPT 생성 완료:", out, "| 슬라이드:", slides.length);
}

main().catch((e) => { console.error("❌ PPT 생성 실패:", e); process.exit(1); });
