const pptxgen = require("pptxgenjs");

const FONT = "Pretendard";
const MIN_FONT = 12;
const fs12 = (size) => {
  if (size < MIN_FONT) throw new Error(`fontSize ${size} < ${MIN_FONT}pt 금지`);
  return size;
};

const C = {
  dark:        "2C2926",
  green:       "059669",
  teal:        "0D9488",
  body:        "505060",
  slate:       "59636E",
  bgCard:      "F5F5F7",
  border:      "DDDDE0",
  highlight:   "CCFBF1",
  darkBadge:   "404155",
  tableHdr:    "E2EEF9",
  red:         "DC2626",
  amber:       "D97706",
  blue:        "1A5E7E",
  darkGreen:   "1A6E36",
  darkRed:     "8B1A1A",
  darkOrange:  "C0530A",
  cyan:        "00BBFF",
  white:       "FFFFFF",
  gray:        "9CA3AF",
};

// ── 슬라이드 1: 표지 ─────────────────────────────────────────────
async function createSlide01(pptx) {
  const slide = pptx.addSlide();

  // 배경 (청록색 상단 영역)
  slide.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 16, h: 6.2, fill: { color: C.cyan }, line: { type: "none" } });
  // 하단 다크 영역
  slide.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 6.2, w: 16, h: 2.8, fill: { color: C.dark }, line: { type: "none" } });

  // 상단 배지
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.6, y: 0.4, w: 2.0, h: 0.5, fill: { color: C.green }, line: { type: "none" }, rectRadius: 0.05 });
  slide.addText("ICTK 코스닥 456010", { x: 0.6, y: 0.4, w: 2.0, h: 0.5, color: C.white, fontSize: fs12(13), bold: true, fontFace: FONT, align: "center", valign: "middle" });

  // 메인 제목
  slide.addText("기업 정보조사 레포트", { x: 0.6, y: 1.2, w: 13, h: 1.4, color: C.dark, fontSize: fs12(36), bold: true, fontFace: FONT });

  // 기업명
  slide.addText("아이씨티케이 주식회사", { x: 0.6, y: 2.7, w: 13, h: 0.9, color: C.dark, fontSize: fs12(26), bold: true, fontFace: FONT });

  // 부제
  slide.addText("세계 최초 VIA PUF™ 기반 보안칩 양산 · 양자보안(PQC·HRoT) 전문 반도체 설계기업", {
    x: 0.6, y: 3.7, w: 13, h: 0.6, color: C.darkBadge, fontSize: fs12(15), fontFace: FONT
  });

  // 구분선
  slide.addShape(pptx.shapes.RECTANGLE, { x: 0.6, y: 4.5, w: 6, h: 0.04, fill: { color: C.darkBadge }, line: { type: "none" } });

  // 태그 뱃지 3개
  const tags = ["Security IP", "Security Chips", "PQC Services"];
  tags.forEach((tag, i) => {
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 0.6 + i * 2.4, y: 4.8, w: 2.2, h: 0.45,
      fill: { color: C.darkBadge }, line: { type: "none" }, rectRadius: 0.08
    });
    slide.addText(tag, {
      x: 0.6 + i * 2.4, y: 4.8, w: 2.2, h: 0.45,
      color: C.white, fontSize: fs12(13), bold: true, fontFace: FONT, align: "center", valign: "middle"
    });
  });

  // 하단 정보
  slide.addText("조사기준일: 2026-06-17", { x: 0.6, y: 6.5, w: 6, h: 0.4, color: C.gray, fontSize: fs12(13), fontFace: FONT });
  slide.addText("데이터 출처: DART 전자공시, 아이씨티케이 홈페이지(www.ictk.com)", {
    x: 0.6, y: 7.0, w: 14, h: 0.4, color: C.gray, fontSize: fs12(12), fontFace: FONT
  });
  slide.addText("아이씨티케이 주식회사 (ICTK Co., Ltd.)  |  서울 강남구 강남대로84길 16", {
    x: 0.6, y: 7.5, w: 14, h: 0.35, color: C.gray, fontSize: fs12(12), fontFace: FONT
  });

  return slide;
}

// ── 슬라이드 2: 기업 개요 + 재무 분석 (패턴 D) ─────────────────
async function createSlide02(pptx) {
  const slide = pptx.addSlide();

  // 흰색 배경
  slide.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 16, h: 9, fill: { color: C.white }, line: { type: "none" } });

  // 헤더 바
  slide.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 16, h: 0.9, fill: { color: C.dark }, line: { type: "none" } });
  slide.addText("기업 개요 및 재무 분석", {
    x: 0.5, y: 0.1, w: 12, h: 0.7, color: C.white, fontSize: fs12(22), bold: true, fontFace: FONT, valign: "middle"
  });
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 13.2, y: 0.15, w: 2.3, h: 0.55, fill: { color: C.green }, line: { type: "none" }, rectRadius: 0.06
  });
  slide.addText("DART 전자공시", {
    x: 13.2, y: 0.15, w: 2.3, h: 0.55, color: C.white, fontSize: fs12(12), bold: true, fontFace: FONT, align: "center", valign: "middle"
  });

  // 섹션 배지: 기업 개요
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.5, y: 1.1, w: 2.0, h: 0.38, fill: { color: C.darkBadge }, line: { type: "none" }, rectRadius: 0.05 });
  slide.addText("기업 기본정보", { x: 0.5, y: 1.1, w: 2.0, h: 0.38, color: C.white, fontSize: fs12(12), bold: true, fontFace: FONT, align: "center", valign: "middle" });

  // 기업 개요 테이블 (7행)
  const infoRows = [
    [{ text: "항목", options: { bold: true, fill: { color: C.tableHdr }, color: C.dark } }, { text: "내용", options: { bold: true, fill: { color: C.tableHdr }, color: C.dark } }],
    ["기업명", "아이씨티케이 주식회사 (ICTK Co., Ltd.)"],
    ["업종", "반도체 설계 (업종코드 261, 코스닥 456010)"],
    ["대표이사", "이정원 (설립: 2017.10.18 / 결산월: 12월)"],
    ["직원수", "62명 (연구직 36명, 사무직 26명) | 출처: DART 전자공시, 2024년"],
    ["핵심기술", "VIA PUF™ (세계 최초 양산), PQC(양자내성암호), HRoT"],
    ["주요사업", "Security IP · 보안칩 · 보안모듈 · VPN 솔루션 · PQC Services"],
    ["본사", "서울 강남구 강남대로84길 16 제이스타워 | www.ictk.com"],
  ];
  slide.addTable(infoRows, {
    x: 0.5, y: 1.55, w: 15, colW: [2.5, 12.5],
    fontSize: fs12(13), fontFace: FONT,
    rowH: 0.46,
    border: { type: "solid", color: C.border, pt: 0.5 },
    color: C.body,
  });

  // 섹션 배지: 재무 분석
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.5, y: 5.25, w: 2.2, h: 0.38, fill: { color: C.darkBadge }, line: { type: "none" }, rectRadius: 0.05 });
  slide.addText("재무 분석 (억원)", { x: 0.5, y: 5.25, w: 2.2, h: 0.38, color: C.white, fontSize: fs12(12), bold: true, fontFace: FONT, align: "center", valign: "middle" });

  // 재무 테이블 (5행)
  const finRows = [
    [
      { text: "항목", options: { bold: true, fill: { color: C.tableHdr }, color: C.dark } },
      { text: "2022년", options: { bold: true, fill: { color: C.tableHdr }, color: C.dark, align: "center" } },
      { text: "2023년", options: { bold: true, fill: { color: C.tableHdr }, color: C.dark, align: "center" } },
      { text: "2024년", options: { bold: true, fill: { color: C.tableHdr }, color: C.dark, align: "center" } },
      { text: "비고", options: { bold: true, fill: { color: C.tableHdr }, color: C.dark, align: "center" } },
    ],
    [
      { text: "매출액", options: { bold: true } },
      { text: "25.7", options: { align: "center" } },
      { text: "61.9", options: { align: "center" } },
      { text: "66.8", options: { align: "center", color: C.green, bold: true } },
      { text: "YoY +8% 성장", options: { align: "center" } },
    ],
    [
      { text: "영업이익(손실)", options: { bold: true } },
      { text: "-33.3", options: { align: "center", color: C.red } },
      { text: "-23.6", options: { align: "center", color: C.red } },
      { text: "-66.9", options: { align: "center", color: C.red, bold: true } },
      { text: "판관비 96.9억 과중", options: { align: "center" } },
    ],
    [
      { text: "당기순이익(손실)", options: { bold: true } },
      { text: "-107.7", options: { align: "center", color: C.red } },
      { text: "-90.3", options: { align: "center", color: C.red } },
      { text: "-58.2", options: { align: "center", color: C.amber, bold: true } },
      { text: "손실 축소 추세", options: { align: "center" } },
    ],
    [
      { text: "자산총계", options: { bold: true } },
      { text: "98.4", options: { align: "center" } },
      { text: "104.1", options: { align: "center" } },
      { text: "457.9", options: { align: "center", color: C.green, bold: true } },
      { text: "2024 코스닥 IPO 자금 유입", options: { align: "center" } },
    ],
    [
      { text: "부채비율 / 자기자본비율", options: { bold: true } },
      { text: "416.9% / -", options: { align: "center", color: C.red } },
      { text: "10.7% / 90.4%", options: { align: "center" } },
      { text: "6.5% / 93.9%", options: { align: "center", color: C.green, bold: true } },
      { text: "재무구조 대폭 개선", options: { align: "center" } },
    ],
  ];
  slide.addTable(finRows, {
    x: 0.5, y: 5.68, w: 15, colW: [3.2, 2.2, 2.2, 2.2, 5.2],
    fontSize: fs12(12), fontFace: FONT,
    rowH: 0.46,
    border: { type: "solid", color: C.border, pt: 0.5 },
    color: C.body,
  });

  // 출처 주석
  slide.addText("※ 출처: DART 전자공시 2024년 사업보고서 (연결재무제표 기준, 억원 단위)", {
    x: 0.5, y: 8.55, w: 15, h: 0.3, color: C.gray, fontSize: fs12(12), fontFace: FONT
  });

  return slide;
}

// ── 슬라이드 3: 시장 포지션 + 경쟁 환경 (패턴 B 2열) ──────────
async function createSlide03(pptx) {
  const slide = pptx.addSlide();

  slide.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 16, h: 9, fill: { color: C.white }, line: { type: "none" } });

  // 헤더 바
  slide.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 16, h: 0.9, fill: { color: C.dark }, line: { type: "none" } });
  slide.addText("시장 포지션 및 경쟁 환경", {
    x: 0.5, y: 0.1, w: 12, h: 0.7, color: C.white, fontSize: fs12(22), bold: true, fontFace: FONT, valign: "middle"
  });
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 13.2, y: 0.15, w: 2.3, h: 0.55, fill: { color: C.teal }, line: { type: "none" }, rectRadius: 0.06 });
  slide.addText("WebSearch 기반", { x: 13.2, y: 0.15, w: 2.3, h: 0.55, color: C.white, fontSize: fs12(12), bold: true, fontFace: FONT, align: "center", valign: "middle" });

  // ── 좌측: 시장 포지션 (x=0.5, w=7.2) ──
  // 섹션 배지
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.5, y: 1.1, w: 2.5, h: 0.38, fill: { color: C.green }, line: { type: "none" }, rectRadius: 0.05 });
  slide.addText("시장 포지션", { x: 0.5, y: 1.1, w: 2.5, h: 0.38, color: C.white, fontSize: fs12(13), bold: true, fontFace: FONT, align: "center", valign: "middle" });

  // 포지션 카드 3개 (세로 배열)
  const posItems = [
    { icon: "①", title: "세계 최초 VIA PUF™ 양산", body: "양자 내성 PUF 기반 보안칩을 세계 최초로 양산한 원천기술 보유 기업", color: C.darkGreen },
    { icon: "②", title: "풀스택 양자보안 포트폴리오", body: "IP → 보안칩 → 보안모듈 → VPN 솔루션 → PQC Services 전 계층 커버", color: C.blue },
    { icon: "③", title: "AI·IoT·자동차·국방 4대 시장 타깃", body: "HRoT 기반 Chain of Trust로 고신뢰 산업 분야 보안 솔루션 공급", color: C.darkOrange },
  ];
  posItems.forEach((item, i) => {
    const y = 1.6 + i * 2.05;
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.5, y, w: 7.2, h: 1.9, fill: { color: C.bgCard }, line: { color: C.border, pt: 0.5 }, rectRadius: 0.1 });
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.5, y, w: 7.2, h: 0.45, fill: { color: item.color }, line: { type: "none" }, rectRadius: 0.1 });
    slide.addShape(pptx.shapes.RECTANGLE, { x: 0.5, y: y + 0.25, w: 7.2, h: 0.2, fill: { color: item.color }, line: { type: "none" } });
    slide.addText(`${item.icon} ${item.title}`, { x: 0.65, y: y + 0.05, w: 7.0, h: 0.38, color: C.white, fontSize: fs12(14), bold: true, fontFace: FONT, valign: "middle" });
    slide.addText(item.body, { x: 0.65, y: y + 0.55, w: 7.0, h: 1.2, color: C.body, fontSize: fs12(13), fontFace: FONT, valign: "top" });
  });

  // ── 우측: 경쟁사 비교 (x=8.1, w=7.4) ──
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 8.1, y: 1.1, w: 2.5, h: 0.38, fill: { color: C.blue }, line: { type: "none" }, rectRadius: 0.05 });
  slide.addText("경쟁사 비교", { x: 8.1, y: 1.1, w: 2.5, h: 0.38, color: C.white, fontSize: fs12(13), bold: true, fontFace: FONT, align: "center", valign: "middle" });

  const compRows = [
    [
      { text: "구분", options: { bold: true, fill: { color: C.tableHdr }, color: C.dark, align: "center" } },
      { text: "아이씨티케이", options: { bold: true, fill: { color: C.tableHdr }, color: C.dark, align: "center" } },
      { text: "Infineon(독)", options: { bold: true, fill: { color: C.tableHdr }, color: C.dark, align: "center" } },
      { text: "NXP(네)", options: { bold: true, fill: { color: C.tableHdr }, color: C.dark, align: "center" } },
    ],
    [
      "핵심기술",
      { text: "VIA PUF™ 원천", options: { color: C.green, bold: true } },
      "SLx 보안칩",
      "SE050 계열",
    ],
    ["양산능력", "팹리스(외주)", "자체 팹 보유", "자체 팹 보유"],
    ["PQC 지원", { text: "풀지원", options: { color: C.green } }, "일부 지원", "일부 지원"],
    ["IoT/차량보안", "전문 집중", "대형 포트폴리오", "대형 포트폴리오"],
    ["규모(매출)", { text: "소규모(66.8억)", options: { color: C.amber } }, "글로벌 대기업", "글로벌 대기업"],
    ["국내 특화", { text: "국방·공공 집중", options: { color: C.green } }, "글로벌 범용", "글로벌 범용"],
  ];
  slide.addTable(compRows, {
    x: 8.1, y: 1.55, w: 7.4, colW: [2.0, 2.0, 1.7, 1.7],
    fontSize: fs12(12), fontFace: FONT,
    rowH: 0.48,
    border: { type: "solid", color: C.border, pt: 0.5 },
    color: C.body,
  });

  // 하이라이트 박스
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 8.1, y: 5.05, w: 7.4, h: 0.9, fill: { color: C.highlight }, line: { color: C.teal, pt: 1 }, rectRadius: 0.08 });
  slide.addText("💡 ICTK 차별점: 글로벌 경쟁사 대비 PUF 원천기술·PQC 풀스택을 보유한 국내 유일 전문기업. 국방·공공 시장 레퍼런스를 기반으로 글로벌 진출 추진 중.", {
    x: 8.2, y: 5.1, w: 7.2, h: 0.8, color: C.dark, fontSize: fs12(12), fontFace: FONT, valign: "middle"
  });

  // 시장 규모 참고
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 8.1, y: 6.1, w: 7.4, h: 1.7, fill: { color: C.bgCard }, line: { color: C.border, pt: 0.5 }, rectRadius: 0.08 });
  slide.addText("글로벌 하드웨어 보안 시장 현황", { x: 8.2, y: 6.15, w: 7.2, h: 0.4, color: C.dark, fontSize: fs12(14), bold: true, fontFace: FONT });
  const mktLines = [
    "• 글로벌 PUF 시장: 연평균 20%+ 성장 전망 (IoT·AI 수요 주도)",
    "• NIST PQC 표준 확정(2024) → PQC 솔루션 수요 가속화",
    "• 한국 정부 양자암호 로드맵: 2030년 핵심 인프라 전면 적용 목표",
  ];
  mktLines.forEach((line, i) => {
    slide.addText(line, { x: 8.2, y: 6.6 + i * 0.36, w: 7.2, h: 0.34, color: C.body, fontSize: fs12(12), fontFace: FONT });
  });

  slide.addText("※ 시장 정보: www.ictk.com 홈페이지 및 공개 자료 기반 (추정 포함)", {
    x: 0.5, y: 8.55, w: 15, h: 0.3, color: C.gray, fontSize: fs12(12), fontFace: FONT
  });

  return slide;
}

// ── 슬라이드 4: SWOT 종합평가 (패턴 E 2×2) ─────────────────────
async function createSlide04(pptx) {
  const slide = pptx.addSlide();

  slide.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 16, h: 9, fill: { color: C.white }, line: { type: "none" } });

  // 헤더 바
  slide.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 16, h: 0.9, fill: { color: C.dark }, line: { type: "none" } });
  slide.addText("종합 평가 (SWOT)", {
    x: 0.5, y: 0.1, w: 12, h: 0.7, color: C.white, fontSize: fs12(22), bold: true, fontFace: FONT, valign: "middle"
  });

  // SWOT 카드 2×2 그리드
  const cards = [
    {
      title: "S  강점 (Strength)",
      color: C.darkGreen,
      items: [
        "세계 최초 VIA PUF™ 보안칩 양산 원천기술 보유",
        "Security IP→칩→모듈→솔루션 풀스택 포트폴리오",
        "낮은 부채비율(6.5%) / 자기자본비율 93.9%",
        "전 MS Korea 대표이사 등 글로벌 인사 네트워크",
      ]
    },
    {
      title: "W  약점 (Weakness)",
      color: C.darkRed,
      items: [
        "3개년 영업적자 지속 (흑자 전환 미달성)",
        "판관비율 145% — 매출 대비 과중한 비용 구조",
        "전환사채 전환으로 주식 희석 압박 지속",
        "매출 규모 소규모(66.8억) — 대형 고객 부재",
      ]
    },
    {
      title: "O  기회 (Opportunity)",
      color: C.blue,
      items: [
        "NIST PQC 표준 확정 → 양자내성암호 수요 폭증",
        "AI·IoT·자동차·국방 보안 반도체 시장 급성장",
        "한국 정부 양자암호 인프라 로드맵(2030) 수혜",
        "글로벌 반도체 공급망 탈중국화 → 국내 팹리스 기회",
      ]
    },
    {
      title: "T  위협 (Threat)",
      color: C.darkOrange,
      items: [
        "Infineon·NXP 등 글로벌 대기업의 보안칩 역량 강화",
        "R&D 투자 과중 — 자금 소진 및 추가 자금 조달 리스크",
        "기술 표준 변화 속도 대응 부담 (KPQC·NIST 변경)",
        "전환사채·신규 상장 후 주가 변동성 확대",
      ]
    }
  ];

  const positions = [
    { x: 0.5, y: 1.1 },
    { x: 8.25, y: 1.1 },
    { x: 0.5, y: 5.0 },
    { x: 8.25, y: 5.0 },
  ];

  cards.forEach((card, i) => {
    const { x, y } = positions[i];
    const W = 7.25;
    const H = 3.75;

    // 카드 배경
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x, y, w: W, h: H, fill: { color: C.bgCard }, line: { color: C.border, pt: 0.5 }, rectRadius: 0.1 });

    // 카드 헤더 바
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x, y, w: W, h: 0.5, fill: { color: card.color }, line: { type: "none" }, rectRadius: 0.1 });
    slide.addShape(pptx.shapes.RECTANGLE, { x, y: y + 0.28, w: W, h: 0.22, fill: { color: card.color }, line: { type: "none" } });
    slide.addText(card.title, { x: x + 0.15, y, w: W - 0.3, h: 0.5, color: C.white, fontSize: fs12(14), bold: true, fontFace: FONT, valign: "middle" });

    // 항목 텍스트
    card.items.forEach((item, j) => {
      slide.addText(`• ${item}`, {
        x: x + 0.18, y: y + 0.62 + j * 0.72, w: W - 0.35, h: 0.65,
        color: C.slate, fontSize: fs12(13), fontFace: FONT, valign: "top"
      });
    });
  });

  // 총평 하이라이트 박스 (하단)
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.5, y: 8.82,
    w: 15, h: 0,
    line: { color: C.border, pt: 0.5 }
  });

  // 총평 (슬라이드 하단 가로 전체)
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.5, y: 8.78, w: 15, h: 0.0, fill: { color: C.highlight }, line: { color: C.teal, pt: 1 }, rectRadius: 0.06 });
  slide.addShape(pptx.shapes.RECTANGLE, { x: 0.5, y: 8.63, w: 15, h: 0.27, fill: { color: C.highlight }, line: { type: "none" } });
  slide.addText(
    "▶ 총평: PUF 원천기술 기반 양자보안 전문기업으로 선제적 기술 포지셔닝 확보 — 매출 성장세(+8% YoY) 지속이나 판관비 통제·대형 고객 확보를 통한 흑자 전환이 단기 핵심 과제임.",
    { x: 0.65, y: 8.6, w: 14.7, h: 0.32, color: C.dark, fontSize: fs12(12), bold: true, fontFace: FONT, valign: "middle" }
  );

  return slide;
}

// ── main ─────────────────────────────────────────────────────────
async function main() {
  const pptx = new pptxgen();
  pptx.defineLayout({ name: "CUSTOM", width: 16, height: 9 });
  pptx.layout = "CUSTOM";

  for (const fn of [createSlide01, createSlide02, createSlide03, createSlide04]) {
    await fn(pptx);
  }

  const outFile = "prompts/3회차/results/아이씨티케이-report.pptx";
  await pptx.writeFile({ fileName: outFile });
  console.log("✅ PPT 생성 완료:", outFile);
}

main().catch((e) => {
  console.error("❌ PPT 생성 실패:", e.message);
  process.exit(1);
});
