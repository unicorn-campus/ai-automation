// build.js — ICTK 부트캠프 7회차 "Cloud LLM API(STT·TTS·VLM) + YouTube 검색" PPT 빌드
"use strict";
const path = require("path");
const K = require(path.join(__dirname, "..", "_lib", "pptkit"));
const { C, FONT, fs16, PAGE_W } = K;
const IMG = (f) => path.join(__dirname, "images", f);
const FOOTER = "ⓒ ICTK · Unicorn — Claude Code 업무 자동화 부트캠프 7회차 · 무단전재 및 배포 금지";

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
  s.addText(title, { x: 0.95, y: 1.05, w: 14.3, h: 0.95, fontFace: FONT, bold: true, fontSize: fs16(titleSize || 38), color: C.white });
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
function cardImageHighlight(s, imgFile, hlText, imgH) {
  // 하단: 좌측 이미지 + 우측 하이라이트
  K.addImage(s, IMG(imgFile), { x: 0.5, y: 5.0, w: 6.5, h: imgH || 1.8, sizing: { type: "contain", w: 6.5, h: imgH || 1.8 } });
  K.highlight(s, hlText, 7.2, 5.0, 8.3, imgH || 1.8, { size: 16, fill: "CCFBF1" });
}

async function createSlide01(pptx) {
  const s = pptx.addSlide({ masterName: "MASTER" });
  titleBand(s, "Claude Code 업무 자동화 부트캠프 · 7회차 / 11회차", "Cloud LLM API(STT·TTS·VLM) + YouTube 검색", "텍스트를 넘어 음성·이미지·영상까지 다루는 자동화 — 외부 AI 기능을 MCP로 감싸 연결");
  infoCards(s, [
    { hd: "대상", col: C.catA, t: "ICTK 임직원 (비개발자 포함 입문자)" },
    { hd: "도구", col: C.catD, t: "Claude Code 데스크톱 앱 — \"Code\" 탭 (GUI)" },
    { hd: "흐름", col: C.catB, t: "6회차 복습 → 7회차 Cloud API·YouTube MCP → 2주 과제 → 8회차 예고" },
  ]);
  K.highlight(s, "오늘의 핵심: STT·TTS·VLM·YouTube 검색 프로그램을 만들어 MCP 서버로 감싸 6회차 산출물에 연결합니다.", 0.5, 5.55, 15, 0.75, { size: 18, bold: true });
  note(s, "7회차 시작. 6회차(Plugin 배포) 상기 → 오늘은 Cloud LLM API(STT/TTS/VLM)·YouTube MCP. 데스크톱 Code 탭. API Key 보안 강조. 출처: https://code.claude.com/docs/en/mcp");
  return s;
}

async function createSlide02(pptx) {
  const s = pptx.addSlide({ masterName: "MASTER" });
  K.headerBar(s, C.green); K.pageHeader(s, "WHY — 텍스트를 넘으면 자동화할 수 있는 일이 커진다", "골든서클: WHY → HOW → WHAT");
  K.card(s, 0.5, 1.7, 7.5, 3.7, "ECFDF5", C.green);
  const gc = [
    { lb: "WHY", tx: "지금까지 자동화는 대부분 글자 중심 — 회의 녹음·EDA 이미지·참고 영상처럼 업무 현실은 텍스트 밖에 더 많음", col: C.step4 },
    { lb: "HOW", tx: "Cloud LLM API(키로 외부 AI 기능을 부르는 통로)로 STT·TTS·VLM을 호출하고, YouTube 검색으로 영상·자막을 가져옴", col: C.step3 },
    { lb: "WHAT", tx: "음성을 글로, 글을 음성으로, 이미지를 설명으로 바꾸고 영상까지 조사 — 6회차 산출물의 쓰임이 넓어짐", col: C.green },
  ];
  let yy = 1.95; for (const g of gc) { K.badge(s, 0.75, yy, 1.3, g.lb, g.col, C.white, 0.5, 16); K.text(s, g.tx, 2.2, yy - 0.02, 5.6, 1.05, { size: 16, color: C.primary }); yy += 1.12; }
  K.table(s, [
    K.headRow(["구분", "6회차", "7회차(오늘)"]),
    ["다루는 자료", "주로 텍스트", "음성·이미지·영상까지"],
    ["새 능력의 출처", "내가 만든 Skill·MCP", "Cloud LLM API + YouTube 검색"],
    ["산출물", "Plugin으로 묶은 자동화", "LLM API 프로그램 + 자작 MCP"],
  ], { x: 8.3, y: 1.7, w: 7.2, colW: [2.0, 2.5, 2.7], rowH: [0.5, 0.92, 0.92, 0.92], fontSize: 16, align: "left" });
  K.highlight(s, "🔒 ICTK: 범위가 넓어질수록 기본기가 중요 — 녹음·이미지 등 민감 데이터의 외부 전송은 신중히, API Key는 코드/파일에 그대로 적지 않기(데이터 격리·사람 최종 승인).", 0.5, 5.7, 15, 0.78, { size: 16, fill: "CCFBF1" });
  note(s, "골든서클. API='키로 외부 AI 기능 부르는 통로'(슬3 상세). 보안: 민감 데이터 외부 전송 주의·키 비하드코딩. 출처: https://code.claude.com/docs/en/mcp");
  return s;
}

async function createSlide03(pptx) {
  const s = pptx.addSlide({ masterName: "MASTER" });
  K.headerBar(s, C.step2); K.pageHeader(s, "LLM API란? — 키로 외부 AI 기능을 불러 쓰기", "키로 신원, 요청(보냄) → 응답(받음)");
  sectionTitle(s, "호출 흐름", 0.5, 1.7, 7, C.primary, 16);
  const steps = [
    ["① 준비 — API Key를 환경변수·비밀관리에 보관(코드에 직접 X)", C.step1],
    ["② 요청 — 입력(음성·문장·이미지)을 정해진 형식으로 보냄", C.step2],
    ["③ 응답 — AI가 처리한 결과(텍스트·음성·설명)를 받음", C.step3],
    ["④ 활용 — 받은 결과를 회의록·메일 등 다음 단계에 사용", C.green],
  ];
  let y = 2.15; for (const [l, col] of steps) { K.flowStep(s, 0.5, y, 7.2, 0.72, l, col, 16); y += 0.84; }
  K.codeBlock(s, "# ❌ 위험 — 키를 코드에 그대로 적음\napi_key = \"sk-실제키값...\"\n\n# ✅ 안전 — 환경변수에서 읽음\nimport os\napi_key = os.environ[\"LLM_API_KEY\"]", 8.0, 2.15, 7.5, 1.95, 16);
  K.addImage(s, IMG("s3_api_request_response.png"), { x: 8.0, y: 4.25, w: 7.5, h: 1.45, sizing: { type: "contain", w: 7.5, h: 1.45 } });
  K.highlight(s, "핵심: 요청·응답 코드는 Claude가 쓰고 설명함. 내가 정할 것은 \"어떤 입력을 넣어 무엇을 받을지\". API Key는 환경변수·비밀관리로 — 코드·SKILL.md·커밋에 노출 금지.", 0.5, 5.95, 15, 0.8, { size: 16, fill: "CCFBF1" });
  note(s, "API=외부 기능 부르는 창구, 키=신원증. 흐름: 준비→요청→응답→활용. 키 하드코딩 금지/환경변수. 벤더·모델·가격 단정 금지. 출처: https://code.claude.com/docs/en/mcp");
  return s;
}

async function createSlide04(pptx) {
  const s = pptx.addSlide({ masterName: "MASTER" });
  K.headerBar(s, C.step5); K.pageHeader(s, "STT·TTS·VLM 한눈에 — 음성·이미지를 다루는 3가지 AI", "입력과 출력이 무엇인지로 구분");
  const cards = [
    { hd: "① STT · 음성 → 텍스트", col: C.catA, lines: ["Speech-to-Text. 녹음 파일을 받아 글로 받아써 줌(전사)", "예: 회의 녹음 → 회의록 재료"] },
    { hd: "② TTS · 텍스트 → 음성", col: C.catB, lines: ["Text-to-Speech. 문장을 받아 사람이 말하듯 읽어 줌", "예: 공지·요약문을 음성 안내로"] },
    { hd: "③ VLM · 이미지 → 설명", col: C.catD, lines: ["Vision-Language Model. 이미지를 이해해 묻는 말에 답함", "예: EDA 이미지 이상 부위·내용 설명"] },
  ];
  const cw = 4.85, gap = 0.22; let x = 0.5;
  for (const c of cards) { headerCard(s, x, 2.0, cw, 2.75, c.hd, c.col, c.lines); x += cw + gap; }
  cardImageHighlight(s, "s4_stt_tts_vlm.png", "요점: 셋 다 \"입력(음성/문장/이미지)을 보내면 → 결과(텍스트/음성/설명)를 받는\" 같은 API 호출 구조 — 한 번 익히면 나머지도 같은 방식.", 1.8);
  note(s, "STT/TTS/VLM 입력→출력 정의. 동일 API 호출 구조. 벤더 모델명·정확도 단정 금지. 출처: https://code.claude.com/docs/en/mcp");
  return s;
}

async function createSlide05(pptx) {
  const s = pptx.addSlide({ masterName: "MASTER" });
  K.headerBar(s, C.step3); K.pageHeader(s, "내 프로그램을 MCP 서버로 — Claude·Plugin에 연결", "4회차 패턴 재활용");
  sectionTitle(s, "전환 흐름", 0.5, 1.7, 7, C.primary, 16);
  const steps = [
    ["① 프로그램 — STT/TTS/VLM·YouTube 기능을 먼저 완성(API 호출)", C.step1],
    ["② 감싸기 — 그 기능을 MCP 도구(Tool)로 노출하는 작은 서버로", C.step2],
    ["③ 연결 — 데스크톱 Code 탭에 등록 → 사람 승인 후 사용", C.step3],
    ["④ 결합 — 6회차 Plugin·기존 Skill에서 이 도구를 호출", C.green],
  ];
  let y = 2.15; for (const [l, col] of steps) { K.flowStep(s, 0.5, y, 7.2, 0.72, l, col, 16); y += 0.84; }
  K.codeBlock(s, "MCP 서버가 노출하는 도구(Tools) 예\n(Claude가 호출, 사람 승인 후 실행)\n\n  transcribe_audio(녹음 → 텍스트)\n  describe_image(이미지 → 설명)\n  search_youtube(영상 검색)", 8.0, 2.15, 7.5, 1.95, 16);
  K.addImage(s, IMG("s5_program_to_mcp.png"), { x: 8.0, y: 4.25, w: 7.5, h: 1.45, sizing: { type: "contain", w: 7.5, h: 1.45 } });
  K.highlight(s, "핵심: \"프로그램 만들기 → MCP로 감싸기 → 연결\"은 모든 자작 도구에 동일 — 비개발자도 가능(코드는 Claude가). 프로젝트 MCP는 승인(approval) 후에만 사용.", 0.5, 5.95, 15, 0.8, { size: 16, fill: "CCFBF1" });
  note(s, "MCP 서버화(4회차 재활용). Tool=사람 승인 후 실행. 프로젝트 MCP는 .mcp.json 승인 후 사용. 출처: https://code.claude.com/docs/en/mcp");
  return s;
}

async function createSlide06(pptx) {
  const s = pptx.addSlide({ masterName: "MASTER" });
  K.headerBar(s, C.step2); K.pageHeader(s, "YouTube 검색 + 자막 검색 — 영상까지 조사하는 도구", "영상·자막을 가져와 MCP로 감싸 정보조사에 연결");
  headerCard(s, 0.5, 2.0, 7.4, 2.75, "① 영상 검색 · YouTube Data API", C.catA, [
    { t: "키워드로 관련 영상 목록(제목·채널·링크)을 가져오는 공개 API", color: C.body },
    { t: "예: \"반도체 보안\" 관련 영상 상위 N개를 표로 정리", color: C.primary },
  ]);
  headerCard(s, 8.1, 2.0, 7.4, 2.75, "② 자막 검색 · 영상 자막 텍스트", C.catD, [
    { t: "영상의 자막(스크립트)을 텍스트로 가져와 검색·요약", color: C.body },
    { t: "예: 긴 발표 영상에서 \"PUF\" 언급 구간만 추려 요약", color: C.primary },
  ]);
  cardImageHighlight(s, "s6_youtube_search.png", "요점: 영상 목록은 YouTube Data API(공개 API)로, 자막은 텍스트로 받아 검색·요약 — 둘 다 MCP 서버로 감싸 6회차 정보조사 Plugin에 추가.", 1.8);
  note(s, "YouTube Data API='영상·자막 검색 공개 API'(쿼터·요금 단정 금지). MCP로 감싸 정보조사 Plugin에 추가. 약관·API 정책 준수, 키 환경변수. 출처: https://code.claude.com/docs/en/mcp");
  return s;
}

async function createSlide07(pptx) {
  const s = pptx.addSlide({ masterName: "MASTER" });
  K.headerBar(s, C.step4); K.pageHeader(s, "실습 ① — 회의록 플러그인(녹음→STT→회의록→메일)", "회의 녹음을 넣으면 회의록을 써서 메일까지 [직접 실습]");
  sectionTitle(s, "자동화 흐름", 0.5, 1.75, 7, C.primary, 16);
  const steps = [
    ["① 녹음 입력 — 회의 녹음 파일 준비", C.step1],
    ["② STT 전사 — STT API로 음성을 텍스트로 받아씀", C.step2],
    ["③ 회의록 작성 — 전사 텍스트를 요약·정리(표준 양식)", C.step3],
    ["④ 메일 발송 — 메일 초안 → 사람 확인 후 발송", C.step4],
  ];
  let y = 2.2; for (const [l, col] of steps) { K.flowStep(s, 0.5, y, 7.3, 0.82, l, col, 16); y += 0.94; }
  K.codeBlock(s, "SKILL.md 본문 — 작업방법\n\n1. 녹음 파일을 STT MCP로 전사\n2. 전사문을 회의록 양식으로 요약·정리\n3. 회의록 메일 초안 작성\n4. 사람이 확인(diff/검토) 후 발송", 8.3, 2.2, 7.2, 2.9, 16);
  K.highlight(s, "핵심: 여러 단계(전사→작성→발송)를 하나의 플러그인 레시피로 묶음 — STT는 MCP 도구로, 메일 발송은 사람 확인 후. 녹음에 민감 정보가 있으면 외부 전송 전 한 번 더 점검.", 0.5, 5.95, 15, 0.8, { size: 16, fill: "CCFBF1" });
  note(s, "회의록 플러그인(대표 실습). 녹음→STT→회의록→메일. STT는 MCP 도구, 메일은 사람 확인 후. 민감 녹음 외부 전송 점검. 출처: https://code.claude.com/docs/en/mcp");
  return s;
}

async function createSlide08(pptx) {
  const s = pptx.addSlide({ masterName: "MASTER" });
  K.headerBar(s, C.step5); K.pageHeader(s, "실습 ②·③ — EDA 이미지 분석(VLM) · YouTube MCP 추가", "오늘의 손으로 해보기 — 나머지 2종");
  headerCard(s, 0.5, 2.0, 7.4, 3.3, "② EDA 이미지 분석 · VLM MCP [직접]", C.catB, [
    { t: "VLM API로 EDA 이미지를 보고 설명하는 기능을 만들고 MCP 서버로 감쌈", color: C.body },
    { t: "예: 도면·검사 이미지를 넣으면 이상 부위·내용을 텍스트로 설명 → 보고서 재료", color: C.primary },
  ]);
  headerCard(s, 8.1, 2.0, 7.4, 3.3, "③ 정보조사 플러그인 확장 · YouTube MCP [직접]", C.catC, [
    { t: "6회차 정보조사 플러그인에 YouTube 영상·자막 검색 MCP를 추가", color: C.body },
    { t: "예: 주제 검색 시 웹 + 관련 영상·자막 요약까지 함께 모음", color: C.primary },
  ]);
  K.highlight(s, "오늘의 산출물: LLM API 프로그램 + 자작 MCP — STT/VLM/YouTube 기능을 MCP로 감싸 회의록·EDA·정보조사에 연결해 완성.", 0.5, 5.6, 15, 0.75, { size: 17 });
  note(s, "실습 ②(EDA VLM MCP)·③(정보조사에 YouTube MCP 추가). 둘 다 직접 실습. 슬7 회의록과 합쳐 3종. 출처: https://code.claude.com/docs/en/mcp");
  return s;
}

async function createSlide09(pptx) {
  const s = pptx.addSlide({ masterName: "MASTER" });
  K.headerBar(s, C.step3); K.pageHeader(s, "비용·키 보안·사람 검수 — API를 쓸 때 꼭 챙길 3가지", "쓴 만큼 돈이 나가고, 키가 곧 권한");
  K.table(s, [
    K.headRow(["챙길 것", "무엇을", "어떻게"]),
    ["비용", "API는 보통 사용량만큼 과금", "큰 파일·대량 호출 전 규모를 가늠, 불필요한 반복 호출 줄이기"],
    ["키 보안", "키 유출 = 비용·보안 사고", "환경변수·비밀관리에 보관, 코드/SKILL.md/커밋에 노출 금지"],
    ["사람 검수", "AI 결과는 틀릴 수 있음", "STT 전사·회의록·이미지 설명은 사람이 확인 후 사용·발송"],
  ], { x: 0.5, y: 1.8, w: 15, colW: [1.8, 4.4, 8.8], rowH: [0.5, 0.78, 0.78, 0.78], fontSize: 16, align: "left" });
  bullets(s, [
    { t: "STT/VLM의 한계: 전사·이미지 설명이 부정확할 수 있음 → 중요한 수치·이름은 원본과 대조", color: C.body },
    { t: "비용 가늠: 정확한 단가·한도는 서비스마다 다르므로 단정하지 말고 사용 전 공식 안내 확인", color: C.body },
  ], 0.55, 4.75, 15, 1.0, { gap: 8, size: 16 });
  K.highlight(s, "요점: 자동화의 마지막 한 칸은 사람 — 되돌리기 어려운 작업(발송·제출)일수록 사람이 최종 승인.", 0.5, 5.95, 15, 0.7, { size: 17, fill: "CCFBF1" });
  note(s, "운영 주의 3종(비용·키 보안·사람 검수). 비용은 '사용량 과금' 수준(단가 단정 금지). 키 환경변수. STT/VLM 부정확 가능→원본 대조. 출처: https://code.claude.com/docs/en/mcp");
  return s;
}

async function createSlide10(pptx) {
  const s = pptx.addSlide({ masterName: "MASTER" });
  K.headerBar(s, C.step4); K.pageHeader(s, "ICTK 안전 수칙 — Cloud API는 '민감 데이터 경계선'에서", "외부로 나가는 데이터일수록 더 엄격하게");
  const cards = [
    { hd: "1. API Key는 비밀로", col: C.catB, lines: ["키를 코드·SKILL.md·커밋에 그대로 적지 않기", "환경변수·비밀관리로 보관, 유출 시 즉시 폐기·재발급"] },
    { hd: "2. 민감 데이터 외부 전송 주의", col: C.catC, lines: ["회의 녹음·EDA 이미지·핵심 보안 자산을 Cloud로 보내기 전 꼭 보내야 하는지 점검", "외부 전송 금지 자료는 8회차 Local LLM으로"] },
    { hd: "3. 데이터 격리·사람 최종 승인", col: C.catE, lines: ["Claude는 내가 고른 폴더 안에서만 작업, MCP는 승인 후 사용", "발송·제출은 diff/검토 후 사람이 최종 승인"] },
  ];
  const cw = 4.85, gap = 0.22; let x = 0.5;
  for (const c of cards) { headerCard(s, x, 2.4, cw, 3.0, c.hd, c.col, c.lines); x += cw + gap; }
  K.highlight(s, "신뢰 경계: 외부 콘텐츠(영상 자막·웹)를 가져오는 도구는 프롬프트 인젝션(숨은 지시문이 Claude를 속이는 공격) 위험 — 신뢰되는 도구만 연결.", 0.5, 5.65, 15, 0.7, { size: 16, fill: "CCFBF1" });
  note(s, "ICTK 7회차판. 키 비밀·민감 데이터 외부 전송 주의(8회차 Local LLM 예고)·데이터 격리·사람 승인. 외부 콘텐츠 도구는 프롬프트 인젝션 경계. 출처: https://code.claude.com/docs/en/mcp");
  return s;
}

async function createSlide11(pptx) {
  const s = pptx.addSlide({ masterName: "MASTER" });
  K.headerBar(s, C.green); K.pageHeader(s, "정리 · 회차 흐름 · 2주 과제 · 8회차 예고", "오늘 요약 / 흐름 / 할 일 / 다음");
  K.card(s, 0.5, 1.65, 7.4, 2.5, "ECFDF5", C.green);
  sectionTitle(s, "오늘 배운 것", 0.75, 1.77, 6, "0F766E", 17);
  bullets(s, [
    { t: "Cloud LLM API = 키로 부르는 외부 AI 기능: STT·TTS·VLM·YouTube(영상·자막 검색) 호출 — 코드는 Claude가 생성", color: C.primary },
    { t: "완성한 프로그램은 MCP 서버로 감싸 연결: 회의록·EDA·정보조사에 연동 / API Key는 환경변수·비밀관리, 민감 데이터 외부 전송 주의", color: C.primary },
  ], 0.78, 2.27, 6.9, 1.8, { gap: 9, size: 16 });
  sectionTitle(s, "회차 흐름", 8.3, 1.65, 7, C.primary, 17);
  K.table(s, [
    K.headRow(["회차", "핵심", "한 줄"]),
    ["6회차", "Plugin으로 묶어 배포", "여러 자동화를 하나로"],
    [{ text: "7회차(오늘)", options: { bold: true, color: C.primary, fontFace: FONT, fontSize: fs16(16) } },
     { text: "Cloud LLM API + YouTube MCP", options: { bold: true, color: C.primary, fontFace: FONT, fontSize: fs16(16) } },
     { text: "음성·이미지·영상까지", options: { bold: true, color: C.green, fontFace: FONT, fontSize: fs16(16) } }],
    ["8회차(예고)", "Local LLM 연동", "외부 전송 없이 내 PC 모델"],
  ], { x: 8.3, y: 2.1, w: 7.2, colW: [1.8, 3.3, 2.1], rowH: [0.5, 0.62, 0.62, 0.62], fontSize: 16, align: "left" });
  K.highlight(s, "2주 과제 — 6회차 산출물에 Cloud LLM API·YouTube MCP 추가: ① 고르기(음성·이미지·영상이 도움될 곳 1개) → ② 연동(STT/TTS/VLM 또는 YouTube MCP) → ③ 실사용·개선(키 보안·비용·정확도 = 8회차 Local LLM 재료)", 0.5, 4.55, 15, 0.85, { size: 16, fill: "FEF3C7", color: "92400E" });
  K.highlight(s, "8회차 예고 — Local LLM 연동: Cloud로 보내기 어려운 민감 데이터를 위해, 외부 전송 없이 내 PC/온프레미스에서 도는 경량 모델을 MCP로 연결합니다.", 0.5, 5.6, 15, 0.85, { size: 17 });
  note(s, "정리. 회차 흐름 6→7→8. 2주 과제(6회차 산출물에 Cloud API·YouTube MCP, 8회차 Local LLM 재료). 출처: https://code.claude.com/docs/en/mcp");
  return s;
}

async function main() {
  const pptx = K.newDeck();
  pptx.author = "Unicorn / 이해경"; pptx.company = "ICTK";
  pptx.subject = "Claude Code 업무 자동화 부트캠프 7회차"; pptx.title = "7회차 — Cloud LLM API(STT·TTS·VLM) + YouTube 검색";
  K.defineMaster(pptx, FOOTER);
  const slides = [createSlide01, createSlide02, createSlide03, createSlide04, createSlide05, createSlide06, createSlide07, createSlide08, createSlide09, createSlide10, createSlide11];
  for (const fn of slides) await fn(pptx);
  const out = path.join(__dirname, "7회차-CloudLLM-API-YouTube.pptx");
  await pptx.writeFile({ fileName: out });
  console.log("✅ PPT 생성 완료:", out, "| 슬라이드:", slides.length);
}
main().catch((e) => { console.error("❌ PPT 생성 실패:", e); process.exit(1); });
