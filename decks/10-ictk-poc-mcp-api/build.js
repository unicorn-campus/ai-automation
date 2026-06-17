// build.js — ICTK 부트캠프 10회차 "ICTK 특화 ② [MCP·API] 연동 플러그인" PPT 빌드 (10장)
"use strict";
const path = require("path");
const K = require(path.join(__dirname, "..", "_lib", "pptkit"));
const { C, FONT, fs16, PAGE_W } = K;
const IMG = (f) => path.join(__dirname, "images", f);
const FOOTER = "ⓒ ICTK · Unicorn — Claude Code 업무 자동화 부트캠프 10회차 · 무단전재 및 배포 금지";

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
  bullets(slide, lines.map(t => (typeof t === "string" ? { t, color: C.body } : t)), x + 0.22, y + 0.68, w - 0.44, h - 0.8, { gap: 7, size: 16 });
}
function titleBand(s, kicker, title, subtitle, titleSize) {
  K.rect(s, 0, 0, PAGE_W, 3.05, C.primary); K.rect(s, 0, 0, 0.28, 3.05, C.green);
  s.addText(kicker, { x: 0.95, y: 0.55, w: 13.8, h: 0.5, fontFace: FONT, bold: true, fontSize: fs16(20), color: "7FE7C4" });
  s.addText(title, { x: 0.95, y: 1.05, w: 14.3, h: 0.95, fontFace: FONT, bold: true, fontSize: fs16(titleSize || 36), color: C.white });
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
  titleBand(s, "Claude Code 업무 자동화 부트캠프 · 10회차 / 11회차", "ICTK 특화 ② — [MCP·API] 연동 플러그인", "9회차 [지침만] PoC에 외부 데이터·시스템을 연결해 '실전 자동화'로");
  infoCards(s, [
    { hd: "대상", col: C.catA, t: "ICTK 임직원 · 본인 소속(또는 관심) 조직 업무로" },
    { hd: "도구", col: C.catD, t: "Claude Code 데스크톱 앱 — \"Code\" 탭 (GUI)" },
    { hd: "흐름", col: C.catB, t: "9회차 복습 → 10회차 [MCP·API] → 2주 과제 → 11회차 예고" },
  ]);
  K.highlight(s, "오늘의 핵심: 9회차 PoC에 OpenDART·법령·GitHub 등 외부 연동을 더해 실시간 데이터까지 다룹니다. 단, ICTK 보안 게이트 충족이 선결 조건.", 0.5, 5.55, 15, 0.75, { size: 17, bold: true });
  note(s, "10회차. 9회차([지침만]) 상기 → 오늘은 [MCP·API] 연동(2·4회차 커넥터/MCP·8회차 자작 MCP 재사용). 보안 게이트 선결. 출처: curriculum-plan.md 2장·3-10절·1-4절");
  return s;
}

async function createSlide02(pptx) {
  const s = pptx.addSlide({ masterName: "MASTER" });
  K.headerBar(s, C.green); K.pageHeader(s, "WHY — 지침만으로는 \"최신 데이터\"를 못 본다", "골든서클: WHY → HOW → WHAT");
  K.card(s, 0.5, 1.7, 7.5, 3.7, "ECFDF5", C.green);
  const gc = [
    { lb: "WHY", tx: "9회차 PoC는 내가 붙여넣은 자료 안에서만 동작 — 공시·시험데이터·이슈처럼 밖에서 바뀌는 정보는 매번 사람이 찾아 붙여야 함", col: C.step4 },
    { lb: "HOW", tx: "Claude Code에 MCP(외부 도구를 잇는 표준 통로) 또는 API(시스템이 주고받는 약속된 창구)를 연결해 데이터를 직접 가져옴", col: C.step3 },
    { lb: "WHAT", tx: "\"최신 공시를 요약해줘\" 한 마디로 실시간 조회 → 정리 → 초안까지 한 흐름으로 자동화", col: C.green },
  ];
  let yy = 1.92; for (const g of gc) { K.badge(s, 0.75, yy, 1.3, g.lb, g.col, C.white, 0.5, 16); K.text(s, g.tx, 2.2, yy - 0.02, 5.6, 1.1, { size: 16, color: C.primary }); yy += 1.15; }
  K.table(s, [
    K.headRow(["구분", "9회차 [지침만]", "10회차 [MCP·API]"]),
    ["다루는 데이터", "붙여넣은 고정 자료", "실시간 최신 데이터"],
    ["외부 시스템", "연결 없음", "OpenDART·GitHub·법령 등"],
    ["사람의 일", "자료 수집·붙여넣기 반복", "연결은 자동, 사람은 검토·확정"],
  ], { x: 8.3, y: 1.7, w: 7.2, colW: [1.8, 2.6, 2.8], rowH: [0.5, 0.92, 0.92, 0.92], fontSize: 16, align: "left" });
  K.highlight(s, "오늘의 기대치: 9회차 PoC에 외부 연동 1건 추가하거나, 본인 조직의 [MCP·API] 1건을 신규 개발 — 산출물은 [MCP·API] 연동 플러그인.", 0.5, 5.7, 15, 0.75, { size: 17 });
  note(s, "골든서클. 9회차 한계(붙여넣은 자료 내)→외부 연동 가치(실시간). MCP/API 한 줄 풀이(2·4회차 재활용). 수치 단정 금지. 출처: curriculum-plan.md 3-9·3-10절");
  return s;
}

async function createSlide03(pptx) {
  const s = pptx.addSlide({ masterName: "MASTER" });
  K.headerBar(s, C.teal); K.pageHeader(s, "[MCP·API]가 더하는 것 — 실시간 데이터·외부 시스템", "사람이 옮겨 나르던 일을 도구가 대신");
  K.highlight(s, "[MCP·API] 연동 = Claude Code가 외부 데이터·시스템에 직접 손을 뻗는 것", 0.5, 1.65, 15, 0.6, { size: 17, bold: true });
  const cards = [
    { hd: "실시간 데이터", col: C.catA, t: "공시·시험결과·이슈·법령처럼 계속 바뀌는 정보를 그 자리에서 조회 — \"지금 기준\" 자료로 작업" },
    { hd: "외부 시스템 연동", col: C.catB, t: "OpenDART·GitHub·Jira·법령 시스템과 이어 붙여 조회·요약·라벨링까지 한 흐름으로" },
    { hd: "산출물 자동 생성", col: C.catD, t: "모은 데이터를 pptx·xlsx·docx 같은 실제 파일로 정리 — 표·문서 초안까지 한 번에" },
  ];
  let y = 2.4;
  for (const c of cards) {
    K.card(s, 0.5, y, 8.6, 1.32); K.roundRect(s, 0.5, y, 0.16, 1.32, c.col, { radius: 0.04 });
    s.addText(c.hd, { x: 0.85, y: y + 0.12, w: 8.0, h: 0.4, fontFace: FONT, bold: true, fontSize: fs16(17), color: c.col });
    K.text(s, c.t, 0.85, y + 0.55, 8.0, 0.7, { size: 16, color: C.body }); y += 1.42;
  }
  K.addImage(s, IMG("s3_mcp_connect.png"), { x: 9.4, y: 2.4, w: 6.1, h: 4.0, sizing: { type: "contain", w: 6.1, h: 4.0 } });
  K.highlight(s, "쉬운 비유: [지침만]이 '레시피'라면, [MCP·API]는 냉장고·시장과 연결된 부엌 — 재료를 직접 가져와 요리.", 0.5, 6.75, 8.6, 0.6, { size: 16, fill: "CCFBF1" });
  note(s, "3대 효과(실시간 데이터/외부 연동/산출물 생성). 도구명은 curriculum 3-10 등장한 것만(OpenDART·GitHub·Jira·법령·pptx·xlsx·docx). 출처: curriculum-plan.md 3-10절");
  return s;
}

async function createSlide04(pptx) {
  const s = pptx.addSlide({ masterName: "MASTER" });
  K.headerBar(s, C.step2); K.pageHeader(s, "조직별 [MCP·API] 유즈케이스 · 핵심 도구", "내 조직은 무엇을, 어떤 도구로? (실재·전례 도구 중심)");
  K.table(s, [
    K.headRow(["조직", "[MCP·API] 유즈케이스(예)", "핵심 도구"]),
    ["영업·기술마케팅", "기업정보 리서치 / 산출물 생성 / 리드·미팅 협업", "OpenDART MCP · pptx·xlsx·docx · Gmail·Slack"],
    ["경영관리·재무·IR", "공시·재무 수집·요약 / 실적·IR Deck 초안", "OpenDART MCP · pptx·xlsx"],
    ["품질·신뢰성·보안인증", "시험데이터 분석·집계 / 표준·규제 변경 추적", "filesystem MCP · python_repl · brave-search"],
    ["PUF솔루션·SW개발", "GitHub·Jira 이슈·PR 요약·라벨링 / 릴리스노트", "GitHub MCP · Jira API · GitHub Actions"],
    ["칩설계·개발", "오픈소스 EDA 피드백 루프 / 버그 트래커 요약", "filesystem MCP · Bash · GitHub·Jira"],
    ["인사·총무", "급여 발송 검증 / 노동법 영향 점검 보고서", "xlsx · koreanlaw MCP · Sheets"],
  ], { x: 0.5, y: 1.75, w: 15, colW: [2.6, 6.6, 5.8], rowH: [0.5, 0.55, 0.55, 0.55, 0.55, 0.55, 0.55], fontSize: 16, align: "left" });
  K.highlight(s, "고르는 법: 본인 조직 행에서 1건만 선택 — 9회차에 만든 [지침만] PoC와 이어지는 것부터(예: 문서 초안 PoC → 거기에 공시 조회 연동).", 0.5, 5.75, 15, 0.85, { size: 16, fill: "CCFBF1" });
  note(s, "curriculum 3-10 조직별 표(6조직). 도구명은 표에 등장한 것만. 6행이라 수직 단일 표(개념 이미지는 공간상 생략). 9회차 PoC 연속성. 출처: curriculum-plan.md 3-10절");
  return s;
}

async function createSlide05(pptx) {
  const s = pptx.addSlide({ masterName: "MASTER" });
  K.headerBar(s, C.step3); K.pageHeader(s, "개발 흐름 — 9회차 PoC에 연동 추가 또는 신규", "Code 탭에서 부탁하면 Claude가 단계별로 도와줌");
  sectionTitle(s, "개발 흐름 (GUI 4단계)", 0.5, 1.75, 7, C.primary, 16);
  const steps = [
    ["① 주제 선정 — 유즈케이스 1건 확정(무엇을, 어디서, 무엇 위해)", C.step1],
    ["② 프롬프트 제작·테스트 — 채팅에서 연동 동작을 먼저 시험", C.step2],
    ["③ 스킬+에이전트 전환 — SKILL.md + 서브에이전트(작성자·검토자)", C.step3],
    ["④ 플러그인 패키징 — 스킬·에이전트·MCP를 하나로 묶어 배포", C.green],
  ];
  let y = 2.2; for (const [l, col] of steps) { K.flowStep(s, 0.5, y, 7.5, 0.82, l, col, 16); y += 0.94; }
  K.card(s, 8.3, 2.2, 7.2, 3.25, C.cardBg, C.cardBorder);
  sectionTitle(s, "두 갈래", 8.5, 2.32, 6.8, C.teal, 16);
  bullets(s, [
    { t: "(A) 연동 추가: 9회차 [지침만] PoC에 외부 데이터 연결을 얹기 — 가장 빠른 길", color: C.primary, bold: true },
    { t: "(B) 신규 개발: 본인 조직의 [MCP·API] 1건을 새로 만들기", color: C.body },
  ], 8.5, 2.85, 6.8, 2.5, { gap: 14, size: 16 });
  K.highlight(s, "핵심: \"프롬프트로 먼저 검증 → 스킬+에이전트 → 플러그인\"은 5·6회차 흐름 그대로 — 연동(MCP·API)만 새로 끼우는 것.", 0.5, 5.75, 15, 0.8, { size: 16, fill: "CCFBF1" });
  note(s, "개발 4단계(주제→프롬프트 검증→스킬+에이전트→패키징). 두 갈래(A 연동 추가/B 신규). 5·6회차 흐름 재사용. 출처: curriculum-plan.md 3-10절·3-5·3-6절");
  return s;
}

async function createSlide06(pptx) {
  const s = pptx.addSlide({ masterName: "MASTER" });
  K.headerBar(s, C.step5); K.pageHeader(s, "실재·전례 있는 도구부터 — 첫발을 안전하게", "검증된 통로로 첫 PoC의 성공 확률을 높임");
  const cards = [
    { hd: "① OpenDART", col: C.catA, t: "금융감독원 공시·재무 데이터 공개 통로 — 기업정보 리서치·공시 요약·IR Deck 초안" },
    { hd: "② koreanlaw", col: C.catB, t: "법령·판례 조회 통로 — 노동법 영향 점검, 공고·계약 1차 검토" },
    { hd: "③ GitHub", col: C.catC, t: "이슈·PR·릴리스 연동 — PR 요약·라벨링·릴리스노트 초안" },
    { hd: "④ Jira", col: C.catD, t: "이슈·결함 추적 연동 — 결함관리·코드리뷰 요약·진행 리포트" },
  ];
  const cw = 4.55, ch = 1.85; const xs = [0.5, 5.15]; const ys = [2.0, 4.0]; let i = 0;
  for (const c of cards) {
    const x = xs[i % 2], y = ys[Math.floor(i / 2)];
    K.card(s, x, y, cw, ch); K.roundRect(s, x, y, cw, 0.5, c.col, { radius: 0.08 });
    s.addText(c.hd, { x, y, w: cw, h: 0.5, align: "center", valign: "middle", fontFace: FONT, bold: true, fontSize: fs16(16), color: C.white });
    K.text(s, c.t, x + 0.2, y + 0.6, cw - 0.4, 1.15, { size: 16, color: C.body }); i++;
  }
  K.card(s, 10.0, 2.0, 5.5, 3.85, "CCFBF1", "0D9488");
  sectionTitle(s, "권장 순서", 10.2, 2.15, 5, "0F766E", 16);
  bullets(s, [
    { t: "공개 데이터·읽기 위주부터 (OpenDART·koreanlaw·GitHub 조회)", color: C.primary },
    { t: "쓰기·발송이 필요한 연동은 나중에 — 권한·승인 설계가 끝난 뒤", color: C.primary },
  ], 10.2, 2.7, 5.1, 3.0, { gap: 16, size: 16 });
  K.highlight(s, "원칙: \"도구가 실재하고 전례가 있는 것\"부터 착수 — 검증된 통로로 시작해 첫 PoC를 성공으로.", 0.5, 6.1, 15, 0.7, { size: 16, fill: "ECFDF5" });
  note(s, "curriculum 3-10 '실재·전례 도구부터'(OpenDART·koreanlaw·GitHub·Jira). 읽기 우선→쓰기 나중(보안 게이트 연결). 출처: curriculum-plan.md 3-10절");
  return s;
}

async function createSlide07(pptx) {
  const s = pptx.addSlide({ masterName: "MASTER" });
  K.headerBar(s, C.step4); K.pageHeader(s, "권한·감사로그 설계 — 최소 권한·실행 이력", "외부에 연결할수록 할 수 있는 일을 좁혀야");
  sectionTitle(s, "권한 설계 흐름", 0.5, 1.7, 6, C.primary, 16);
  const steps = [["① 딱 필요한 도구만 연결 — 안 쓰는 권한은 끄기(쓰기·발송)", C.step1], ["② 읽기 우선 — 조회만으로 되는 일은 조회 권한만", C.step3], ["③ 사람 게이트 — 발송·확정 직전 diff Accept/Reject", C.step4]];
  let y = 2.15; for (const [l, col] of steps) { K.flowStep(s, 0.5, y, 7.0, 0.78, l, col, 16); y += 0.9; }
  K.table(s, [
    K.headRow(["점검 항목", "무엇을 확인"]),
    ["권한 범위", "읽기만인가, 쓰기·발송까지인가"],
    ["최소화", "쓰지 않는 연결·권한은 꺼져 있는가"],
    ["실행 이력", "언제·무엇을·어떤 데이터로 했는지 기록되는가"],
    ["사람 승인", "되돌리기 어려운 행위에 승인 단계가 있는가"],
  ], { x: 7.7, y: 2.15, w: 7.8, colW: [1.9, 5.9], rowH: [0.48, 0.5, 0.5, 0.5, 0.5], fontSize: 16, align: "left" });
  K.addImage(s, IMG("s7_permission_audit.png"), { x: 0.5, y: 5.0, w: 6.5, h: 1.7, sizing: { type: "contain", w: 6.5, h: 1.7 } });
  K.highlight(s, "핵심: 이 점검 항목들이 곧 2주 과제의 \"권한·감사로그 점검표\" — 오늘 설계하고, 2주간 채워서 완성합니다.", 7.2, 5.0, 8.3, 1.7, { size: 16, fill: "CCFBF1" });
  note(s, "최소 권한·감사로그(curriculum 1-4·3-10). 감사로그=실행 이력. 사람 게이트=diff Accept/Reject. 점검 4항목=2주 과제 점검표. 출처: curriculum-plan.md 1-4절·3-10절");
  return s;
}

async function createSlide08(pptx) {
  const s = pptx.addSlide({ masterName: "MASTER" });
  K.headerBar(s, C.step5); K.pageHeader(s, "하네스 엔지니어링 — 비용·성능·보안의 균형", "자동화가 잘 돌아가게 둘레를 다듬는 일");
  const cards = [
    { hd: "비용 (Cost)", col: C.catA, lines: ["필요한 데이터만 가져오고, 본문·지침은 짧게", "외부 조회 횟수·처리량을 줄이면 비용·시간이 함께 절감"] },
    { hd: "성능 (Performance)", col: C.catC, lines: ["단계를 나누고 검토 단계를 두어 누락·오류↓", "한 번에 다 시키지 말고 작게 검증하며 진행"] },
    { hd: "보안 (Security)", col: C.catE, lines: ["최소 권한·민감정보 비기재·사람 승인을 둘레에 내장", "편리해도 보안 기본기는 고정"] },
  ];
  const cw = 4.85, gap = 0.22; let x = 0.5;
  for (const c of cards) { headerCard(s, x, 2.1, cw, 2.95, c.hd, c.col, c.lines); x += cw + gap; }
  K.highlight(s, "한 줄 요점: [MCP·API]는 외부와 닿는 만큼 둘레 설계(비용·성능·보안)가 결과 품질을 좌우 — 도구를 끼우는 것만큼 둘레를 다듬는 것이 중요.", 0.5, 5.3, 15, 0.7, { size: 16, fill: "CCFBF1" });
  note(s, "하네스='자동화 둘레 다듬기'. 비용(조회·처리량 절감)·성능(단계 분할·검토 게이트)·보안(최소 권한·비기재·사람 승인). 출처: curriculum-plan.md 1-4절·3-10절");
  return s;
}

async function createSlide09(pptx) {
  const s = pptx.addSlide({ masterName: "MASTER" });
  K.headerBar(s, C.step4); K.pageHeader(s, "ICTK 보안 게이트 — 연결해도 흔들리지 않는 선결 조건", "게이트를 통과해야 PoC 착수");
  const cards = [
    { hd: "1. 데이터 격리·비학습", col: C.catB, lines: ["온프레미스·격리 실행, 외부 학습에 쓰이지 않는 비학습(non-training) 정책 전제", "영업비밀(PUF·암호 IP)은 격리 환경에서만"] },
    { hd: "2. diff 마스킹·최소 권한", col: C.catC, lines: ["변경·전송 내용을 diff로 확인하되 민감 부분은 가림(마스킹)", "도구 권한은 최소화"] },
    { hd: "3. 제안까지만·사람 발송", col: C.catE, lines: ["라벨·답변·제출은 제안(초안)까지만", "실제 발송·확정은 사람이 수행"] },
  ];
  const cw = 4.85, gap = 0.22; let x = 0.5;
  for (const c of cards) { headerCard(s, x, 2.3, cw, 3.0, c.hd, c.col, c.lines); x += cw + gap; }
  K.highlight(s, "착수 원칙: 게이트 충족이 선결 조건 → 충족 후, 실재·전례 있는 도구(OpenDART·koreanlaw 등)부터 시작.", 0.5, 5.55, 15, 0.7, { size: 16, fill: "CCFBF1" });
  note(s, "curriculum 1-4·3-10 ICTK 전제 3게이트: 데이터 격리·비학습 / diff 마스킹·최소 권한 / 제안까지만·사람 발송. 게이트 선결+실재 도구 우선. 출처: curriculum-plan.md 1-4절·3-10절");
  return s;
}

async function createSlide10(pptx) {
  const s = pptx.addSlide({ masterName: "MASTER" });
  K.headerBar(s, C.green); K.pageHeader(s, "정리 · 회차 흐름 · 2주 과제 · 11회차 예고", "오늘 요약 / 흐름 / 할 일 / 다음");
  K.card(s, 0.5, 1.65, 7.4, 2.5, "ECFDF5", C.green);
  sectionTitle(s, "오늘 배운 것", 0.75, 1.77, 6, "0F766E", 17);
  bullets(s, [
    { t: "[MCP·API] 연동 = 외부 데이터·시스템에 직접 연결: 9회차 PoC에 실시간 연동을 더해 실전 자동화로 / 흐름은 주제→프롬프트 검증→스킬+에이전트→플러그인", color: C.primary },
    { t: "실재·전례 도구부터(OpenDART·koreanlaw·GitHub·Jira) · 보안 게이트(격리·비학습·diff 마스킹·최소 권한·제안까지만·사람 발송)는 선결 조건", color: C.primary },
  ], 0.78, 2.27, 6.9, 1.8, { gap: 9, size: 16 });
  sectionTitle(s, "회차 흐름", 8.3, 1.65, 7, C.primary, 17);
  K.table(s, [
    K.headRow(["회차", "핵심", "한 줄"]),
    ["9회차", "ICTK 특화 ① [지침만]", "외부 연동 없이 지침만"],
    [{ text: "10회차(오늘)", options: { bold: true, color: C.primary, fontFace: FONT, fontSize: fs16(16) } },
     { text: "ICTK 특화 ② [MCP·API]", options: { bold: true, color: C.primary, fontFace: FONT, fontSize: fs16(16) } },
     { text: "외부 데이터·시스템 연동", options: { bold: true, color: C.green, fontFace: FONT, fontSize: fs16(16) } }],
    ["11회차(예고)", "특화 ③ [pw·컴퓨터유즈]+발표", "웹 화면 자동화 + 패키징·발표"],
  ], { x: 8.3, y: 2.1, w: 7.2, colW: [1.8, 3.3, 2.1], rowH: [0.5, 0.62, 0.62, 0.62], fontSize: 16, align: "left" });
  K.highlight(s, "2주 과제 — [MCP·API] PoC 다듬기 + 점검표: ① 완성도 다듬기(연동 동작을 실제 업무 입력으로 안정화) → ② 권한·감사로그 점검표 작성(권한 범위·최소화·실행 이력·사람 승인 4항목) → 11회차 패키징·발표 재료", 0.5, 4.55, 15, 0.85, { size: 16, fill: "FEF3C7", color: "92400E" });
  K.highlight(s, "11회차 예고 — [pw·컴퓨터유즈] + Plugin 패키징·발표: Playwright·Computer Use로 웹 화면을 다루고, 9~11회차 PoC를 하나의 Plugin으로 묶어 팀별 현업 적용 계획을 발표합니다.", 0.5, 5.6, 15, 0.85, { size: 17 });
  note(s, "정리. 회차 흐름 9→10→11. 2주 과제(curriculum 3-10: PoC 다듬기 + 권한·감사로그 점검표). 11회차=[pw·컴퓨터유즈]+패키징·발표. 출처: curriculum-plan.md 3-10절·3-11절·1-4절");
  return s;
}

async function main() {
  const pptx = K.newDeck();
  pptx.author = "Unicorn / 이해경"; pptx.company = "ICTK";
  pptx.subject = "Claude Code 업무 자동화 부트캠프 10회차"; pptx.title = "10회차 — ICTK 특화 ② [MCP·API] 연동 플러그인";
  K.defineMaster(pptx, FOOTER);
  const slides = [createSlide01, createSlide02, createSlide03, createSlide04, createSlide05, createSlide06, createSlide07, createSlide08, createSlide09, createSlide10];
  for (const fn of slides) await fn(pptx);
  const out = path.join(__dirname, "10회차-ICTK특화2-MCP-API연동.pptx");
  await pptx.writeFile({ fileName: out });
  console.log("✅ PPT 생성 완료:", out, "| 슬라이드:", slides.length);
}
main().catch((e) => { console.error("❌ PPT 생성 실패:", e); process.exit(1); });
