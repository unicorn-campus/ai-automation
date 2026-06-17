// build.js — ICTK 부트캠프 9회차 "ICTK 특화 ① 기본 플러그인 개발([지침만])" PPT 빌드 (10장)
"use strict";
const path = require("path");
const K = require(path.join(__dirname, "..", "_lib", "pptkit"));
const { C, FONT, fs16, PAGE_W } = K;
const IMG = (f) => path.join(__dirname, "images", f);
const FOOTER = "ⓒ ICTK · Unicorn — Claude Code 업무 자동화 부트캠프 9회차 · 무단전재 및 배포 금지";

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
function plainCard(slide, x, y, w, h, hd, col, body) {
  K.card(slide, x, y, w, h); K.roundRect(slide, x, y, 0.16, h, col, { radius: 0.04 });
  slide.addText(hd, { x: x + 0.32, y: y + 0.14, w: w - 0.5, h: 0.4, fontFace: FONT, bold: true, fontSize: fs16(16), color: col });
  K.text(slide, body, x + 0.32, y + 0.58, w - 0.5, h - 0.7, { size: 16, color: C.body });
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

async function createSlide01(pptx) {
  const s = pptx.addSlide({ masterName: "MASTER" });
  titleBand(s, "Claude Code 업무 자동화 부트캠프 · 9회차 / 11회차", "ICTK 특화 ① — 기본 플러그인 개발([지침만])", "1~8회차에서 익힌 것을 우리 회사 실제 업무에 처음 적용 — 외부 도구 없이 지침만으로");
  infoCards(s, [
    { hd: "대상", col: C.catA, t: "ICTK 임직원 (비개발자 포함 입문자)" },
    { hd: "도구", col: C.catD, t: "Claude Code 데스크톱 앱 — \"Code\" 탭 (GUI)" },
    { hd: "흐름", col: C.catB, t: "1~8회차 복습 → 9회차 [지침만] PoC → 2주 과제 → 10회차 예고" },
  ]);
  K.highlight(s, "오늘부터 3개 회차(9~11)는 자사 PoC 단계 — 오늘은 가장 안전한 [지침만]으로 우리 부서 반복 업무 1건을 플러그인으로 만듭니다. (ICTK = VIA PUF 기반 보안 IC 팹리스)", 0.5, 5.55, 15, 0.75, { size: 17, bold: true });
  note(s, "9회차. 1~8회차(연습)→9~11회차(자사 PoC). 오늘은 [지침만](외부 도구·MCP·API 없이 자연어 지침만). '배우는 날이 아니라 만드는 날'. 출처: curriculum-plan.md 2장·3-9절·1-4절");
  return s;
}

async function createSlide02(pptx) {
  const s = pptx.addSlide({ masterName: "MASTER" });
  K.headerBar(s, C.green); K.pageHeader(s, "WHY — 배운 것을 \"우리 회사 진짜 업무\"에 처음 쓴다", "골든서클: WHY → HOW → WHAT");
  K.card(s, 0.5, 1.7, 7.5, 3.7, "ECFDF5", C.green);
  const gc = [
    { lb: "WHY", tx: "1~8회차는 일반 예제로 연습 — 이제 그 능력을 내 책상 위 반복 업무에 적용해야 진짜 가치가 생김", col: C.step4 },
    { lb: "HOW", tx: "1~8회차에서 익힌 Prompt·Skill·Agent·Plugin을 그대로 재사용 — 새 기술이 아니라 \"만드는 날\"", col: C.step3 },
    { lb: "WHAT", tx: "오늘 끝에는 우리 부서가 매번 손으로 하던 업무 1건이 동작하는 [지침만] 플러그인으로 남음", col: C.green },
  ];
  let yy = 1.95; for (const g of gc) { K.badge(s, 0.75, yy, 1.3, g.lb, g.col, C.white, 0.5, 16); K.text(s, g.tx, 2.2, yy - 0.02, 5.6, 1.05, { size: 16, color: C.primary }); yy += 1.12; }
  K.table(s, [
    K.headRow(["구분", "1~8회차", "9회차(오늘)"]),
    ["다루는 업무", "일반 예제(요약·회의록)", "내 조직의 실제 업무 1건"],
    ["목표", "도구 사용법 학습", "현업에 바로 쓸 PoC 제작"],
    ["산출물", "연습용 Skill·Plugin", "조별 [지침만] 플러그인"],
  ], { x: 8.3, y: 1.7, w: 7.2, colW: [1.8, 2.6, 2.8], rowH: [0.5, 0.92, 0.92, 0.92], fontSize: 16, align: "left" });
  K.highlight(s, "오늘의 기대치: 외부 도구·API 없이 지침만으로 동작하는 PoC를 만듦 — 산출물은 조별 [지침만] 플러그인 1개(우리 업무 초안 생성용).", 0.5, 5.7, 15, 0.75, { size: 17 });
  note(s, "골든서클. 9회차=적용/제작 워크숍. 연습→실전. 효과 수치 단정 금지(베이스라인 측정). 출처: curriculum-plan.md 1-2절·2장·3-9절");
  return s;
}

async function createSlide03(pptx) {
  const s = pptx.addSlide({ masterName: "MASTER" });
  K.headerBar(s, C.teal); K.pageHeader(s, "왜 [지침만]이 1번 타자인가", "가장 안전하고 빠른 시작");
  const cards = [
    { hd: "외부 도구 불필요 · 비용 0", col: C.catA, lines: ["MCP·API·웹 연동 없이 자연어 지침만으로 동작", "추가 설치·연결·요금 부담이 사실상 없음"] },
    { hd: "보안 위험 최소", col: C.catB, lines: ["외부와 주고받는 통로가 없어 데이터 유출 경로 자체가 적음", "보안 IC 기업 ICTK에 가장 잘 맞는 출발점"] },
    { hd: "즉시 시작 가능", col: C.catD, lines: ["3·5회차에서 만든 Skill / Skill+Agent를 그대로 재사용", "오늘 바로 손으로 만들 수 있음"] },
  ];
  const cw = 4.85, gap = 0.22; let x = 0.5;
  for (const c of cards) { headerCard(s, x, 2.0, cw, 2.55, c.hd, c.col, c.lines); x += cw + gap; }
  K.addImage(s, IMG("s3_instructions_only.png"), { x: 0.5, y: 4.75, w: 6.5, h: 1.85, sizing: { type: "contain", w: 6.5, h: 1.85 } });
  K.highlight(s, "공통 한계: [지침만] 산출물은 항상 초안 — 사람 검수 게이트를 반드시 거쳐 현업에 반영(슬라이드 9에서 상술). '위험 0'이 아니라 '경로가 적다'.", 7.2, 4.75, 8.3, 1.85, { size: 16, fill: "CCFBF1" });
  note(s, "[지침만] 4이유(외부 불필요·비용 0/보안 최소/즉시 시작/+한계=초안). curriculum-plan 3-3·3-9. 보안 최소=경로가 적다(위험 0 아님). 출처: curriculum-plan.md 3-3절·3-9절·1-4절");
  return s;
}

async function createSlide04(pptx) {
  const s = pptx.addSlide({ masterName: "MASTER" });
  K.headerBar(s, C.step2); K.pageHeader(s, "개발 3단계 — 프롬프트에서 플러그인까지", "1~8회차에서 이미 해본 과정을 이어 붙이기");
  sectionTitle(s, "개발 흐름", 0.5, 1.75, 7, C.primary, 16);
  const steps = [
    ["① 프롬프트 제작·테스트 (1~2회차)\n5요소로 구조화 → 실제 입력으로 동작 확인", C.step1],
    ["② 스킬 + 에이전트 전환 (3·5회차)\nSKILL.md 승격 + 작성자·검토자 역할 분리", C.step3],
    ["③ 플러그인 패키징 (6회차)\n동료가 설치·실행하게 하나로 묶음", C.green],
  ];
  let y = 2.2; for (const [l, col] of steps) { K.flowStep(s, 0.5, y, 7.3, 0.9, l, col, 16); y += 1.05; }
  K.addImage(s, IMG("s4_poc_three_steps.png"), { x: 8.0, y: 2.2, w: 7.5, h: 3.0, sizing: { type: "contain", w: 7.5, h: 3.0 } });
  K.highlight(s, "핵심: 새로 배우는 단계는 없음 — 순서대로 이어 붙이면 우리 업무용 플러그인이 완성됩니다. 막히면 \"초안 → 테스트 → 개선\"을 반복.", 0.5, 5.95, 15, 0.8, { size: 16, fill: "CCFBF1" });
  note(s, "개발 3단계(①프롬프트 1~2회차 ②스킬+에이전트 3·5회차 ③패키징 6회차). 새 기술 없음·조합만. 초안→테스트→개선 반복. 출처: curriculum-plan.md 3-9절·2장");
  return s;
}

async function createSlide05(pptx) {
  const s = pptx.addSlide({ masterName: "MASTER" });
  K.headerBar(s, C.step3); K.pageHeader(s, "조직별 [지침만] 유즈케이스 후보", "본인 소속(또는 관심) 조직의 1건을 선택");
  K.table(s, [
    K.headRow(["조직", "[지침만] 유즈케이스 후보", "구현 형태"]),
    ["영업·기술마케팅", "RFP·제안서 초안 / PUF 다국어 영업자료 변환", "Skill+Subagent(작성자·리스크 검토자)"],
    ["PUF솔루션·SW개발", "보안 SDK 코드리뷰 체크리스트 / 펌웨어 릴리스노트 초안", "Skill(CWE·CERT C 규칙 내장)"],
    ["품질·신뢰성·보안인증", "CC/FIPS 증적문서 초안 / 신뢰성 시험보고서 통합", "Skill(표준 목차·필수항목 매핑)"],
    ["칩설계·개발", "검증계획서·테스트시나리오 초안 / 회귀 실패 로그 Triage", "Skill / Skill+Subagent(커버리지 리뷰어)"],
    ["경영관리·재무·IR", "이사회·경영보고서 템플릿 / 공시·계약 법무 1차 체크리스트", "Skill(표준 구조·few-shot)"],
    ["인사·총무", "채용공고·JD 표준 초안 / 온보딩 체크리스트·안내문", "Skill / Skill+Subagent(직군별 분기)"],
  ], { x: 0.5, y: 1.75, w: 15, colW: [2.7, 7.0, 5.3], rowH: [0.5, 0.55, 0.55, 0.55, 0.55, 0.55, 0.55], fontSize: 16, align: "left" });
  K.highlight(s, "고르는 기준: ① 매번 양식·체크리스트가 정해진 반복 업무 ② 외부 데이터 없이 내 자료·지침만으로 초안이 나오는 일 ③ 효과는 PoC로 베이스라인 측정 후 확인(임의 단정 금지).", 0.5, 5.75, 15, 0.85, { size: 16, fill: "CCFBF1" });
  note(s, "curriculum-plan 3-9절 조직별 [지침만] 표(6조직). 본인 소속·관심 1건 선택. 효과는 베이스라인 측정 후. PUF 자료는 격리 처리(슬9). 출처: curriculum-plan.md 3-9절(usecases.md 3장·5-1)");
  return s;
}

async function createSlide06(pptx) {
  const s = pptx.addSlide({ masterName: "MASTER" });
  K.headerBar(s, C.step5); K.pageHeader(s, "선행 과업 — 우리 지식을 먼저 \"마크다운\"으로 정리", "[지침만] PoC의 재료는 우리가 이미 가진 지식");
  const cards = [
    { hd: "1. 사내 지식베이스", col: C.catA, lines: ["업무 표준·규정·자주 묻는 질문 등 흩어진 노하우를 한 폴더의 마크다운으로 모음"] },
    { hd: "2. 용어집(Glossary)", col: C.catB, lines: ["PUF·CC·FIPS·약어 등 우리 회사·업계 용어 정의를 정리 — Claude가 같은 의미로 이해하게"] },
    { hd: "3. 표준 템플릿", col: C.catD, lines: ["보고서·증적문서·체크리스트 등 자주 쓰는 양식을 마크다운으로 고정 — 초안 품질의 기준"] },
  ];
  const cw = 4.85, gap = 0.22; let x = 0.5;
  for (const c of cards) { headerCard(s, x, 2.1, cw, 2.85, c.hd, c.col, c.lines); x += cw + gap; }
  K.highlight(s, "왜 먼저 하나: [지침만] PoC의 결과 품질은 재료(지식·용어·양식)의 품질에 좌우됨 — 재료가 좋아야 초안이 좋습니다.", 0.5, 5.25, 15, 0.75, { size: 16, fill: "CCFBF1" });
  note(s, "usecases.md 5-2 1단계(사내 지식베이스·용어집·표준 템플릿 마크다운 1차 구축). [지침만]은 입력 재료가 품질 좌우. PUF 자료는 격리. 출처: curriculum-plan.md 3-9절 실습 운영");
  return s;
}

async function createSlide07(pptx) {
  const s = pptx.addSlide({ masterName: "MASTER" });
  K.headerBar(s, C.step4); K.pageHeader(s, "하네스 엔지니어링 적용 — 품질·비용·보안 점검", "만든 뒤 한 번 더 점검");
  const cards = [
    { hd: "① 품질 · 의도대로 나오는가", col: C.catA, lines: ["description에 무엇+언제 키워드를 잘 넣었는지", "본문 지침이 누락 없이 초안을 만드는지 실제 입력으로 확인"] },
    { hd: "② 비용 · 가볍게 도는가", col: C.catB, lines: ["SKILL.md 본문은 짧게(권장 500줄 이하)", "길수록 매번 읽어 비용↑ — 불필요한 설명 제거"] },
    { hd: "③ 보안 · 새는 곳은 없는가", col: C.catD, lines: ["민감정보(비밀번호·고객정보·PUF/암호 IP)를 SKILL.md에 그대로 적지 않기", "파일은 공유·커밋될 수 있음"] },
  ];
  const cw = 4.85, gap = 0.22; let x = 0.5;
  for (const c of cards) { headerCard(s, x, 2.1, cw, 2.95, c.hd, c.col, c.lines); x += cw + gap; }
  K.highlight(s, "점검 리듬: \"돌려보고 → 어긋난 곳 찾고 → 지침 고치고\"를 반복 — 한 번에 완성하려 하지 마세요.", 0.5, 5.3, 15, 0.7, { size: 16, fill: "CCFBF1" });
  note(s, "하네스 엔지니어링='PoC가 잘 돌도록 주변(지침·재료·점검)을 다듬기'. 품질(description)·비용(본문 간결 500줄)·보안(민감정보 비기재). 출처: curriculum-plan.md 3-9절·3-3절");
  return s;
}

async function createSlide08(pptx) {
  const s = pptx.addSlide({ masterName: "MASTER" });
  K.headerBar(s, C.step2); K.pageHeader(s, "조별 실습 진행 방식 · 역할 분담", "한 사람이 다 하지 않고 역할을 나눔");
  sectionTitle(s, "실습 흐름", 0.5, 1.75, 7, C.primary, 16);
  const steps = [
    ["① 주제 선정 — 슬라이드 5 표에서 조의 [지침만] 1건 합의 + 선행 재료 확인", C.step1],
    ["② 분담 개발 — 프롬프트 담당 / 지침·템플릿 담당 / 검토 담당", C.step3],
    ["③ 통합·점검 — SKILL.md(+Agent)로 묶고 하네스 점검 후 짧게 공유", C.green],
  ];
  let y = 2.2; for (const [l, col] of steps) { K.flowStep(s, 0.5, y, 7.5, 0.92, l, col, 16); y += 1.05; }
  K.card(s, 8.3, 2.2, 7.2, 3.25, "FEF3C7", "D97706");
  sectionTitle(s, "역할 3분담 (5회차 역할 분리 연결)", 8.5, 2.32, 6.8, "92400E", 16);
  bullets(s, [
    { t: "프롬프트 담당: 5요소 작성·테스트", color: C.primary },
    { t: "지침/템플릿 담당: 재료·용어집 정리", color: C.primary },
    { t: "검토 담당: 초안 점검·개선점 기록", color: C.primary },
  ], 8.5, 2.85, 6.8, 2.5, { gap: 14, size: 16 });
  K.highlight(s, "핵심: 결과물보다 \"우리 업무가 어디까지 자동화되나\"를 함께 발견하는 것이 목적 — 완벽한 PoC가 아니어도 됩니다. 막히면 강사·동료에게 즉시 질문.", 0.5, 5.75, 15, 0.8, { size: 16, fill: "CCFBF1" });
  note(s, "조별 실습 운영. 3역할(프롬프트/지침·템플릿/검토)은 5회차 역할 분리(사람 협업 차원). 목적=자동화 가능 범위 발견(완벽 PoC 아님). 출처: curriculum-plan.md 3-9절·3-5절");
  return s;
}

async function createSlide09(pptx) {
  const s = pptx.addSlide({ masterName: "MASTER" });
  K.headerBar(s, C.step4); K.pageHeader(s, "ICTK 보안 거버넌스 — PoC에도 흔들리지 않는 기본기", "[지침만]이라도 반드시 지키는 게이트");
  const cards = [
    { hd: "1. 데이터 격리", col: C.catB, lines: ["영업비밀(PUF·암호 IP) 포함 자료는 격리 환경에서만 처리", "외부로 내보내지 않음(온프레미스·비학습 전제)"] },
    { hd: "2. 사람 검수 게이트", col: C.catC, lines: ["PoC 산출물은 모두 초안", "전문가·책임자가 diff로 Accept/Reject 후에만 현업 반영"] },
    { hd: "3. 고위험 단계 제외", col: C.catE, lines: ["테이프아웃 사인오프·인증서 발급·전표 입력 등", "되돌리기 어려운 단계는 자동화 범위에서 의도적으로 제외"] },
  ];
  const cw = 4.85, gap = 0.22; let x = 0.5;
  for (const c of cards) { headerCard(s, x, 2.3, cw, 3.0, c.hd, c.col, c.lines); x += cw + gap; }
  K.highlight(s, "원칙 4 — 정직한 측정: 효과 수치는 방향성 기대치일 뿐, PoC로 내부 베이스라인을 측정한 뒤 확정합니다(임의 단정 금지).", 0.5, 5.55, 15, 0.7, { size: 16, fill: "CCFBF1" });
  note(s, "curriculum-plan 1-4 보안 거버넌스 4원칙: 데이터 격리(온프레미스·비학습)/사람 검수 게이트(초안·diff)/고위험 제외/정직한 측정. CLAUDE.md 정직한 보고와 부합. 출처: curriculum-plan.md 1-4절·3-9절");
  return s;
}

async function createSlide10(pptx) {
  const s = pptx.addSlide({ masterName: "MASTER" });
  K.headerBar(s, C.green); K.pageHeader(s, "정리 · 회차 흐름 · 2주 과제 · 10회차 예고", "오늘 요약 / 흐름 / 할 일 / 다음");
  K.card(s, 0.5, 1.65, 7.4, 2.5, "ECFDF5", C.green);
  sectionTitle(s, "오늘 한 것", 0.75, 1.77, 6, "0F766E", 17);
  bullets(s, [
    { t: "자사 PoC 첫걸음: 1~8회차 역량을 재사용해 우리 부서의 [지침만] 업무 1건을 동작하는 플러그인으로 제작", color: C.primary },
    { t: "3단계(프롬프트→스킬+에이전트→패키징) + 하네스 점검(품질·비용·보안) + 보안 게이트(격리·검수·고위험 제외·정직한 측정)", color: C.primary },
  ], 0.78, 2.27, 6.9, 1.8, { gap: 9, size: 16 });
  sectionTitle(s, "회차 흐름", 8.3, 1.65, 7, C.primary, 17);
  K.table(s, [
    K.headRow(["회차", "핵심", "한 줄"]),
    ["8회차", "Local LLM 연동", "외부 전송 없이 내 장비"],
    [{ text: "9회차(오늘)", options: { bold: true, color: C.primary, fontFace: FONT, fontSize: fs16(16) } },
     { text: "ICTK 특화 ① [지침만] PoC", options: { bold: true, color: C.primary, fontFace: FONT, fontSize: fs16(16) } },
     { text: "배운 것을 우리 업무에 적용", options: { bold: true, color: C.green, fontFace: FONT, fontSize: fs16(16) } }],
    ["10회차(예고)", "ICTK 특화 ② [MCP·API]", "외부 데이터·도구 연동"],
  ], { x: 8.3, y: 2.1, w: 7.2, colW: [1.8, 3.2, 2.2], rowH: [0.5, 0.62, 0.62, 0.62], fontSize: 16, align: "left" });
  K.highlight(s, "2주 과제 — [지침만] PoC를 실전에서 단련: ① 실행(실제 업무 입력으로 3회 돌려보기) → ② 개선(누락·오류 반영) → ③ 베이스라인 기록(소요시간·누락 건수 = 10회차 확장 재료)", 0.5, 4.55, 15, 0.85, { size: 16, fill: "FEF3C7", color: "92400E" });
  K.highlight(s, "10회차 예고 — ICTK 특화 ② [MCP·API]: 오늘 만든 [지침만] PoC에 OpenDART·koreanlaw 등 외부 데이터·도구를 연동해 자동화 범위를 넓힙니다(4·8회차 MCP 역량 적용).", 0.5, 5.6, 15, 0.85, { size: 17 });
  note(s, "정리. 회차 흐름 8→9→10. 2주 과제(curriculum-plan 3-9: PoC 3회 실행·개선·베이스라인 기록). 정직한 측정 실천. 출처: curriculum-plan.md 3-9절·3-10절·2장");
  return s;
}

async function main() {
  const pptx = K.newDeck();
  pptx.author = "Unicorn / 이해경"; pptx.company = "ICTK";
  pptx.subject = "Claude Code 업무 자동화 부트캠프 9회차"; pptx.title = "9회차 — ICTK 특화 ① 기본 플러그인 개발([지침만])";
  K.defineMaster(pptx, FOOTER);
  const slides = [createSlide01, createSlide02, createSlide03, createSlide04, createSlide05, createSlide06, createSlide07, createSlide08, createSlide09, createSlide10];
  for (const fn of slides) await fn(pptx);
  const out = path.join(__dirname, "9회차-ICTK특화1-지침만플러그인.pptx");
  await pptx.writeFile({ fileName: out });
  console.log("✅ PPT 생성 완료:", out, "| 슬라이드:", slides.length);
}
main().catch((e) => { console.error("❌ PPT 생성 실패:", e); process.exit(1); });
