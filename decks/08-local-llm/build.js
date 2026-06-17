// build.js — ICTK 부트캠프 8회차 "Local LLM 연동" PPT 빌드 (10장)
"use strict";
const path = require("path");
const K = require(path.join(__dirname, "..", "_lib", "pptkit"));
const { C, FONT, fs16, PAGE_W } = K;
const IMG = (f) => path.join(__dirname, "images", f);
const FOOTER = "ⓒ ICTK · Unicorn — Claude Code 업무 자동화 부트캠프 8회차 · 무단전재 및 배포 금지";

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
  titleBand(s, "Claude Code 업무 자동화 부트캠프 · 8회차 / 11회차", "Local LLM 연동", "데이터를 밖으로 내보내지 않는 AI 자동화 — 내 PC/온프레미스 경량 모델을 MCP로 연결");
  infoCards(s, [
    { hd: "대상", col: C.catA, t: "ICTK 임직원 (비개발자 포함 입문자)" },
    { hd: "도구", col: C.catD, t: "Claude Code 데스크톱 앱 — \"Code\" 탭 (GUI)" },
    { hd: "흐름", col: C.catB, t: "7회차 복습 → 8회차 Local LLM(MCP) → 2주 과제 → 9회차 예고" },
  ]);
  K.highlight(s, "오늘의 핵심: EXAONE·Docling·Whisper+pyannote·Qwen3-VL을 로컬에서 돌려 MCP로 감싸 연결 — 데이터가 밖으로 안 나갑니다. 보안 IC(PUF) 기업 ICTK에 특히 적합.", 0.5, 5.55, 15, 0.75, { size: 17, bold: true });
  note(s, "8회차. 7회차(Cloud API) 정반대 관점 — Local LLM(데이터 외부 전송 없음). 4종을 MCP로 감쌈. 코드는 Claude가 생성. 출처: https://code.claude.com/docs/en/mcp , https://code.claude.com/docs/en/desktop");
  return s;
}

async function createSlide02(pptx) {
  const s = pptx.addSlide({ masterName: "MASTER" });
  K.headerBar(s, C.green); K.pageHeader(s, "WHY — 민감한 데이터는 밖으로 내보내지 않는다", "골든서클: WHY → HOW → WHAT");
  K.card(s, 0.5, 1.65, 7.5, 3.05, "ECFDF5", C.green);
  const gc = [
    { lb: "WHY", tx: "영업비밀·설계자료·고객정보처럼 밖으로 나가면 안 되는 데이터가 있음 — Cloud API는 외부 서버로 전송됨", col: C.step4 },
    { lb: "HOW", tx: "Local LLM(내 PC·회사 서버 안에서만 도는 경량 AI)으로 처리하면 데이터가 장비 밖으로 안 나감", col: C.step3 },
    { lb: "WHAT", tx: "Local LLM을 MCP 서버로 감싸 Claude에 연결 → 외부 전송 없이 요약·PDF변환·받아쓰기·이미지 분석", col: C.green },
  ];
  let yy = 1.88; for (const g of gc) { K.badge(s, 0.75, yy, 1.3, g.lb, g.col, C.white, 0.46, 16); K.text(s, g.tx, 2.2, yy - 0.02, 5.6, 0.95, { size: 16, color: C.primary }); yy += 0.95; }
  K.table(s, [
    K.headRow(["구분", "7회차(Cloud)", "8회차(Local)"]),
    ["모델 위치", "외부 클라우드 서버", "내 PC / 온프레미스"],
    ["데이터 이동", "외부로 전송", "장비 밖으로 안 나감"],
    ["강점", "편의·성능·최신", "데이터 격리·오프라인·비용 0"],
  ], { x: 8.3, y: 1.65, w: 7.2, colW: [1.7, 2.6, 2.9], rowH: [0.5, 0.78, 0.78, 0.78], fontSize: 16, align: "left" });
  K.addImage(s, IMG("s2_data_stays_local.png"), { x: 8.3, y: 4.5, w: 7.2, h: 1.55, sizing: { type: "contain", w: 7.2, h: 1.55 } });
  K.highlight(s, "🔒 ICTK: 보안 IC(PUF) 기업에 특히 적합 — 민감 자료를 외부 클라우드에 보내지 않고 온프레미스에서 처리. Local LLM은 보통 내 데이터를 학습에 쓰지 않음(비학습)이라 데이터 주권을 지킴.", 0.5, 4.95, 7.5, 1.1, { size: 16, fill: "CCFBF1" });
  note(s, "골든서클. Cloud(외부 전송) vs Local(장비 안). 온프레미스·비학습. ICTK 보안 IC 적합. 비학습은 일반 원리로(제품 정책 단정 회피). 출처: https://code.claude.com/docs/en/mcp");
  return s;
}

async function createSlide03(pptx) {
  const s = pptx.addSlide({ masterName: "MASTER" });
  K.headerBar(s, C.step2); K.pageHeader(s, "Cloud vs Local — 언제 어느 쪽? 한눈에", "데이터 민감도와 필요한 성능으로 고름");
  K.table(s, [
    K.headRow(["비교 축", "Cloud LLM (7회차)", "Local LLM (오늘)"]),
    ["데이터 격리", "외부 서버로 전송됨", "장비 밖으로 안 나감"],
    ["성능·모델 크기", "최신·대형 모델 가능", "경량 모델 위주(용도 특화)"],
    ["비용", "호출량만큼 과금", "호출 비용 없음(장비·전기만)"],
    ["인터넷", "항상 연결 필요", "오프라인도 가능"],
    ["준비", "키 발급하면 바로", "모델 내려받기·장비 사양 필요"],
  ], { x: 0.5, y: 1.75, w: 15, colW: [3.0, 6.0, 6.0], rowH: [0.5, 0.55, 0.55, 0.55, 0.55, 0.55], fontSize: 16, align: "left" });
  bullets(s, [
    { t: "Local의 강점: 데이터가 안 나감 · 호출 비용 없음 · 망 분리/오프라인 환경에서도 동작", color: C.body },
    { t: "Cloud의 강점: 가장 크고 똑똑한 모델 · 설치·장비 부담 없음 · 빠른 시작", color: C.body },
  ], 0.55, 5.35, 15, 1.0, { gap: 8, size: 16 });
  K.highlight(s, "요점: 민감 데이터 → Local, 편의·최고 성능 → Cloud. (선택 기준은 슬라이드 8에서 재정리 — 오늘은 \"민감 데이터\" 쪽에 집중)", 0.5, 6.45, 15, 0.7, { size: 17, fill: "CCFBF1" });
  note(s, "Cloud/Local 5축 대비. 균형 메시지(데이터 민감도+성능으로 선택). Local 단점도 솔직히. 사양·속도 단정 회피. 출처: https://code.claude.com/docs/en/mcp");
  return s;
}

async function createSlide04(pptx) {
  const s = pptx.addSlide({ masterName: "MASTER" });
  K.headerBar(s, C.step5); K.pageHeader(s, "오늘의 도구 4종 — 용도별 경량 Local LLM", "만능 1개가 아니라 용도별 4개");
  const cards = [
    { hd: "① EXAONE · 문서 요약·정리", col: C.catA, t: "대표적으로 LG가 공개한 경량 LLM 계열 — 긴 보고서·메일을 로컬에서 요약" },
    { hd: "② Docling · PDF·문서 구조 변환", col: C.catB, t: "PDF·문서를 표·제목·문단 구조를 살린 텍스트(마크다운 등)로 변환 — 후속 요약·검색 입력" },
    { hd: "③ Whisper + pyannote · 받아쓰기+화자분리", col: C.catC, t: "Whisper=음성→텍스트(STT), pyannote=누가 언제 말했는지(화자 분리) → 화자별 회의록" },
    { hd: "④ Qwen3-VL · 이미지 이해(VLM)", col: C.catD, t: "사진·도면·표 이미지를 보고 설명하는 비전-언어 모델 — \"이 이미지에 뭐가 있나?\"에 답" },
  ];
  const cw = 4.55, ch = 1.85; const xs = [0.5, 5.15]; const ys = [2.0, 4.0];
  let i = 0;
  for (const c of cards) {
    const x = xs[i % 2], y = ys[Math.floor(i / 2)];
    K.card(s, x, y, cw, ch); K.roundRect(s, x, y, cw, 0.5, c.col, { radius: 0.08 });
    s.addText(c.hd, { x, y, w: cw, h: 0.5, align: "center", valign: "middle", fontFace: FONT, bold: true, fontSize: fs16(16), color: C.white });
    K.text(s, c.t, x + 0.2, y + 0.6, cw - 0.4, 1.15, { size: 16, color: C.body }); i++;
  }
  K.addImage(s, IMG("s4_four_local_tools.png"), { x: 10.0, y: 2.0, w: 5.5, h: 3.85, sizing: { type: "contain", w: 5.5, h: 3.85 } });
  K.highlight(s, "공통점: 4종 모두 로컬에서 동작 → 데이터가 외부로 안 나감. 각각을 MCP 서버로 감싸 Claude에 연결(슬라이드 5).", 0.5, 6.1, 15, 0.7, { size: 16, fill: "CCFBF1" });
  note(s, "4종 2×2 개요. EXAONE(LG 경량 LLM 계열)·Docling(문서 구조 변환)·Whisper+pyannote(STT+화자분리)·Qwen3-VL(VLM). 버전·벤치마크 단정 회피. 출처: https://modelcontextprotocol.io/docs/develop/build-server , https://code.claude.com/docs/en/mcp");
  return s;
}

async function createSlide05(pptx) {
  const s = pptx.addSlide({ masterName: "MASTER" });
  K.headerBar(s, C.step3); K.pageHeader(s, "핵심 원리 — Local LLM을 \"MCP 서버\"로 감싸 연결", "감싸야 Claude가 도구함에서 부름");
  sectionTitle(s, "연결 흐름", 0.5, 1.7, 7, C.primary, 16);
  const steps = [
    ["① 무엇을 — \"EXAONE으로 문서 요약 기능을 MCP로\" 말로 요청", C.step1],
    ["② 생성 — Claude가 로컬 stdio MCP 서버 코드 작성·설명 → diff Accept", C.step2],
    ["③ 연결 — 데스크톱에서 MCP로 등록 → 도구 확인", C.step3],
    ["④ 사용 — Claude가 호출, 모델이 내 PC에서 돌아 데이터 안 나감", C.green],
  ];
  let y = 2.15; for (const [l, col] of steps) { K.flowStep(s, 0.5, y, 7.2, 0.72, l, col, 16); y += 0.84; }
  K.codeBlock(s, "MCP 서버가 노출하는 것\n\n도구(Tools): Claude가 호출(사람 승인 후 실행)\n  예: summarize_local(텍스트) → 요약문\n실행 위치: 내 PC의 로컬 프로세스(stdio)\n           — 외부 전송 없음", 8.0, 2.15, 7.5, 1.95, 16);
  K.addImage(s, IMG("s5_local_mcp_wrap.png"), { x: 8.0, y: 4.25, w: 7.5, h: 1.45, sizing: { type: "contain", w: 7.5, h: 1.45 } });
  K.highlight(s, "핵심: MCP 서버에는 로컬에서 도는 종류(stdio)가 있음 — \"내 PC의 로컬 프로세스로 직접 시스템에 접근하는 맞춤 스크립트\"에 적합. Local LLM을 감싸기에 딱 맞고, 데이터는 장비 안에 머묾.", 0.5, 5.95, 15, 0.8, { size: 16, fill: "CCFBF1" });
  note(s, "MCP 서버화(4회차 재활용). 공식: stdio servers run as local processes, ideal for direct system access/custom scripts → Local LLM 래핑에 적합. Tool=사람 승인 후 실행. 출처: https://code.claude.com/docs/en/mcp , https://modelcontextprotocol.io/docs/develop/build-server");
  return s;
}

async function createSlide06(pptx) {
  const s = pptx.addSlide({ masterName: "MASTER" });
  K.headerBar(s, C.step5); K.pageHeader(s, "실습 1 — 문서 요약(EXAONE) · PDF 변환(Docling) MCP", "둘 다 로컬 실행 → 외부 전송 없음");
  headerCard(s, 0.5, 2.0, 7.4, 3.2, "① 문서 요약 MCP · EXAONE [직접]", C.catA, [
    { t: "EXAONE을 호출하는 문서 요약 MCP 서버를 만들고 등록 → \"이 보고서 요약해줘\"로 호출", color: C.body },
    { t: "긴 사내 문서를 외부로 보내지 않고 로컬에서 요약", color: C.primary },
  ]);
  headerCard(s, 8.1, 2.0, 7.4, 3.2, "② PDF 변환 MCP · Docling [직접]", C.catB, [
    { t: "PDF를 구조 보존 텍스트(마크다운 등)로 바꾸는 변환 MCP 서버를 만듦", color: C.body },
    { t: "변환 결과를 ①의 요약 MCP에 넘기면 \"PDF → 텍스트 → 요약\" 한 줄기로 연결", color: C.primary },
  ]);
  K.highlight(s, "핵심: 코드는 Claude가 생성·설명 — 내가 할 일은 \"어떤 입력을 받아 무엇을 돌려줄지\"를 말로 정의. 두 MCP를 이으면 작은 로컬 문서 파이프라인 완성.", 0.5, 5.5, 15, 0.8, { size: 16, fill: "CCFBF1" });
  note(s, "실습 전반(요약·PDF변환). 둘 다 직접. Docling→EXAONE 연결(파이프라인). 코드는 Claude가 생성. 출처: https://code.claude.com/docs/en/mcp");
  return s;
}

async function createSlide07(pptx) {
  const s = pptx.addSlide({ masterName: "MASTER" });
  K.headerBar(s, C.step4); K.pageHeader(s, "실습 2 — STT+화자분리(Whisper+pyannote) · 이미지 분석(Qwen3-VL)", "음성·이미지도 로컬에서 처리");
  headerCard(s, 0.5, 2.0, 7.4, 3.2, "① STT+화자분리 MCP · Whisper+pyannote [직접]", C.catC, [
    { t: "녹음을 텍스트로 받아쓰고(Whisper), 누가 언제 말했는지 나눠(pyannote) 화자별 회의록 MCP 서버를 만듦", color: C.body },
    { t: "회의 음성을 외부로 보내지 않고 화자별 정리", color: C.primary },
  ]);
  headerCard(s, 8.1, 2.0, 7.4, 3.2, "② 이미지 분석 MCP · Qwen3-VL [직접]", C.catD, [
    { t: "도면·표·사진 이미지를 보고 설명하는 분석 MCP 서버를 만듦", color: C.body },
    { t: "\"이 도면에서 핵심 부품을 짚어줘\" 같은 질문에 로컬 VLM으로 답함", color: C.primary },
  ]);
  K.highlight(s, "🔒 ICTK 포인트: 회의 녹음·설계 도면 같은 민감 자료일수록 로컬 처리의 가치가 큼 — 음성·이미지 원본이 장비 밖으로 나가지 않음.", 0.5, 5.5, 15, 0.8, { size: 16, fill: "CCFBF1" });
  note(s, "실습 후반(STT+화자분리·이미지 분석). 둘 다 직접. Whisper(STT)+pyannote(화자분리)=화자별 회의록, Qwen3-VL=VLM. 민감 원본 로컬 처리. 출처: https://code.claude.com/docs/en/mcp");
  return s;
}

async function createSlide08(pptx) {
  const s = pptx.addSlide({ masterName: "MASTER" });
  K.headerBar(s, C.step2); K.pageHeader(s, "언제 Local, 언제 Cloud? — 선택 기준", "섞어 쓰는 게 정답");
  sectionTitle(s, "고르는 흐름", 0.5, 1.75, 7, C.primary, 16);
  const steps = [
    ["① 데이터가 민감한가? → 예: Local 우선(밖으로 안 나감)", C.step4],
    ["② 인터넷·망 분리 환경인가? → 오프라인 필요: Local", C.step1],
    ["③ 가장 크고 똑똑한 성능이 필요한가? → 예: Cloud(7회차)", C.step2],
    ["④ 그 외 가벼운·반복 작업 → Local로 비용 절감", C.green],
  ];
  let y = 2.2; for (const [l, col] of steps) { K.flowStep(s, 0.5, y, 7.5, 0.82, l, col, 16); y += 0.95; }
  K.card(s, 8.3, 2.2, 7.2, 3.6, C.cardBg, C.cardBorder);
  sectionTitle(s, "기준 한눈에", 8.5, 2.32, 6, C.teal, 16);
  bullets(s, [
    { t: "Local 신호: 민감 데이터 · 오프라인/망 분리 · 호출 비용 줄이기 · 단순·반복 작업", color: C.primary, bold: true },
    { t: "Cloud 신호: 최고 성능·대형 모델 · 빠른 시작(설치 부담 X) · 일회성·비민감 작업", color: C.body },
  ], 8.5, 2.85, 6.8, 2.8, { gap: 14, size: 16 });
  K.highlight(s, "요점: \"민감하면 Local, 최고 성능이면 Cloud\" — 단계별 혼합도 가능(예: 로컬에서 민감정보 가린 뒤, 비민감 부분만 Cloud로).", 0.5, 6.1, 15, 0.7, { size: 16, fill: "CCFBF1" });
  note(s, "의사결정. 데이터 민감도→망 환경→성능 순 분기. Local/Cloud는 배타 아님, 단계별 혼합 가능. '신호'로 제시. 출처: https://code.claude.com/docs/en/mcp");
  return s;
}

async function createSlide09(pptx) {
  const s = pptx.addSlide({ masterName: "MASTER" });
  K.headerBar(s, C.step4); K.pageHeader(s, "ICTK 안전 수칙 — 로컬이라도 \"기본기\"는 그대로", "'로컬이라 안전'에 방심하지 않기");
  const cards = [
    { hd: "1. 온프레미스·데이터 격리", col: C.catB, lines: ["Local LLM은 장비 안에서 처리되어 데이터가 안 나가는 게 핵심", "모델·도구도 신뢰 출처(공식·사내)에서만 받음"] },
    { hd: "2. 비학습·민감정보 비기재", col: C.catC, lines: ["로컬 처리라 외부 학습에 데이터가 흘러가지 않음", "단, 비밀번호·핵심 보안 자산을 MCP 설정/스크립트에 그대로 적지 말 것(파일은 공유·커밋될 수 있음)"] },
    { hd: "3. 사람 최종 승인", col: C.catE, lines: ["MCP 도구 실행·편집은 diff를 보고 Accept/Reject", "Claude는 내가 고른 폴더 안에서만 작업"] },
  ];
  const cw = 4.85, gap = 0.22; let x = 0.5;
  for (const c of cards) { headerCard(s, x, 2.3, cw, 3.0, c.hd, c.col, c.lines); x += cw + gap; }
  K.highlight(s, "프롬프트 인젝션(외부 문서·이미지 속 숨은 지시문이 Claude를 속이는 공격)은 로컬에서도 경계 — 신뢰하는 MCP 서버만 연결.", 0.5, 5.55, 15, 0.7, { size: 16, fill: "CCFBF1" });
  note(s, "ICTK 8회차판. 온프레미스·비학습·데이터 격리 + 사람 승인·폴더 격리. '로컬이라 무조건 안전' 오해 방지. 신뢰 출처·민감정보 비기재. 출처: https://code.claude.com/docs/en/mcp");
  return s;
}

async function createSlide10(pptx) {
  const s = pptx.addSlide({ masterName: "MASTER" });
  K.headerBar(s, C.green); K.pageHeader(s, "정리 · 회차 흐름 · 2주 과제 · 9회차 예고", "오늘 요약 / 흐름 / 할 일 / 다음");
  K.card(s, 0.5, 1.65, 7.4, 2.5, "ECFDF5", C.green);
  sectionTitle(s, "오늘 배운 것", 0.75, 1.77, 6, "0F766E", 17);
  bullets(s, [
    { t: "Local LLM = 내 PC/온프레미스 경량 모델 → 데이터가 밖으로 안 나감: 4종(EXAONE·Docling·Whisper+pyannote·Qwen3-VL)", color: C.primary },
    { t: "연결 = 로컬 MCP 서버로 감싸기(코드는 Claude가 생성) / 민감하면 Local, 최고 성능이면 Cloud", color: C.primary },
  ], 0.78, 2.27, 6.9, 1.8, { gap: 9, size: 16 });
  sectionTitle(s, "회차 흐름", 8.3, 1.65, 7, C.primary, 17);
  K.table(s, [
    K.headRow(["회차", "핵심", "한 줄"]),
    ["7회차", "Cloud LLM API", "외부 클라우드 모델 호출"],
    [{ text: "8회차(오늘)", options: { bold: true, color: C.primary, fontFace: FONT, fontSize: fs16(16) } },
     { text: "Local LLM 연동(MCP)", options: { bold: true, color: C.primary, fontFace: FONT, fontSize: fs16(16) } },
     { text: "외부 전송 없이 내 장비에서", options: { bold: true, color: C.green, fontFace: FONT, fontSize: fs16(16) } }],
    ["9회차(예고)", "ICTK 특화 ①(지침만)", "자사 PoC 시작"],
  ], { x: 8.3, y: 2.1, w: 7.2, colW: [1.8, 3.0, 2.4], rowH: [0.5, 0.62, 0.62, 0.62], fontSize: 16, align: "left" });
  K.highlight(s, "2주 과제 — 6회차 산출물에 Local LLM 연동 MCP 추가: ① 고르기(4종 중 내 업무에 맞는 1개) → ② 만들기(그 모델을 감싼 MCP를 6회차 산출물에 연결) → ③ 실사용·개선(민감 자료로 직접 돌려보고 개선점 기록)", 0.5, 4.55, 15, 0.85, { size: 16, fill: "FEF3C7", color: "92400E" });
  K.highlight(s, "9회차 예고 — ICTK 특화 ①: 외부 MCP/API 없이 순수 지침만으로 자사 업무 플러그인을 개발. 외부·로컬 도구를 잠시 내려놓고 ICTK 자사 PoC를 시작합니다.", 0.5, 5.6, 15, 0.85, { size: 17 });
  note(s, "정리. 회차 흐름 7→8→9(9회차부터 ICTK 자사 PoC). 2주 과제(6회차에 Local LLM MCP 추가). 출처: https://code.claude.com/docs/en/mcp");
  return s;
}

async function main() {
  const pptx = K.newDeck();
  pptx.author = "Unicorn / 이해경"; pptx.company = "ICTK";
  pptx.subject = "Claude Code 업무 자동화 부트캠프 8회차"; pptx.title = "8회차 — Local LLM 연동";
  K.defineMaster(pptx, FOOTER);
  const slides = [createSlide01, createSlide02, createSlide03, createSlide04, createSlide05, createSlide06, createSlide07, createSlide08, createSlide09, createSlide10];
  for (const fn of slides) await fn(pptx);
  const out = path.join(__dirname, "8회차-LocalLLM연동.pptx");
  await pptx.writeFile({ fileName: out });
  console.log("✅ PPT 생성 완료:", out, "| 슬라이드:", slides.length);
}
main().catch((e) => { console.error("❌ PPT 생성 실패:", e); process.exit(1); });
