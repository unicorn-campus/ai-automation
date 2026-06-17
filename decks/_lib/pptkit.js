// pptkit.js — ICTK 부트캠프 교재 공용 PPT 빌드 헬퍼 (ppt-guide.md 6절 준수)
// 단위: inch (pptxgenjs 기본). 페이지 16" x 9". 최소 폰트 16pt (사용자 지정).
"use strict";
const fs = require("fs");
const pptxgen = require("pptxgenjs");

// ── 최소 폰트 강제 (사용자 요구: 16pt) ──────────────────────────────
const MIN_FONT = 16;
const fs16 = (size) => {
  if (size < MIN_FONT) {
    throw new Error(`fontSize ${size} < ${MIN_FONT}pt 금지! 슬라이드를 분리하거나 정보량을 줄일 것`);
  }
  return size;
};

const FONT = "Pretendard";

// ── 컬러 팔레트 (ppt-guide 1절) ─────────────────────────────────────
const C = {
  primary: "2C2926",     // Dark Brown — 헤더/제목/주요 텍스트
  green: "059669",       // Sub — 강조 배지, 플로우 시작/끝
  teal: "0D9488",        // Accent — 키워드 라벨
  body: "505060",        // 본문
  sub: "59636E",         // 설명
  meta: "6B6B7B",        // 캡션
  white: "FFFFFF",
  // 플로우 스텝
  step1: "059669", step2: "0284C7", step3: "D97706", step4: "DC2626", step5: "7C3AED",
  // 카드 헤더
  catA: "3776AB", catB: "1A6E36", catC: "C0530A", catD: "1A5E7E", catE: "8B1A1A",
  // 보조
  cardBg: "F5F5F7", codeBg: "F5F5F7", highlight: "CCFBF1",
  divider: "E2E8F0", cardBorder: "DDDDE0", arrow: "9CA3AF",
  tableHeader: "E2EEF9", darkBadge: "404155",
  // accent
  a1: "4472C4", a2: "ED7D31", a3: "A5A5A5", a4: "FFC000", a5: "5B9BD5", a6: "70AD47",
};

// ── 레이아웃 상수 ───────────────────────────────────────────────────
const PAGE_W = 16, PAGE_H = 9;
const MARGIN = 0.5;
const CW = PAGE_W - MARGIN * 2;   // 콘텐츠 폭 15"
const HEADER_Y = 0.45;
const BODY_TOP = 1.55;            // 헤더 아래 콘텐츠 시작 y
const FOOTER_Y = 8.55;            // 푸터 구분선 근처

function newDeck() {
  const pptx = new pptxgen();
  pptx.defineLayout({ name: "CUSTOM", width: PAGE_W, height: PAGE_H });
  pptx.layout = "CUSTOM";
  pptx.theme = { headFontFace: FONT, bodyFontFace: FONT };
  return pptx;
}

function defineMaster(pptx, footerText) {
  pptx.defineSlideMaster({
    title: "MASTER",
    background: { color: C.white },
    objects: [
      { line: { x: MARGIN, y: FOOTER_Y, w: CW, h: 0, line: { color: C.divider, width: 1 } } },
      { text: { text: footerText || "ⓒ ICTK · Unicorn — 무단전재 및 배포 금지", options: {
        x: MARGIN, y: FOOTER_Y + 0.05, w: CW * 0.7, h: 0.3, align: "left",
        fontFace: FONT, fontSize: fs16(16), color: C.meta } } },
    ],
    slideNumber: { x: PAGE_W - 1.1, y: FOOTER_Y + 0.05, w: 0.6, h: 0.3, fontFace: FONT, fontSize: fs16(16), color: C.meta, align: "right" },
  });
}

function addSlide(pptx) {
  return pptx.addSlide({ masterName: "MASTER" });
}

// ── 페이지 헤더 (제목 + 부제) ───────────────────────────────────────
function pageHeader(slide, title, subtitle, opts = {}) {
  slide.addText(title, {
    x: MARGIN, y: HEADER_Y, w: CW, h: 0.7, align: "left", valign: "middle",
    fontFace: FONT, bold: true, fontSize: fs16(opts.titleSize || 32), color: C.primary,
  });
  if (subtitle) {
    slide.addText(subtitle, {
      x: MARGIN, y: HEADER_Y + 0.72, w: CW, h: 0.4, align: "left", valign: "middle",
      fontFace: FONT, bold: true, fontSize: fs16(opts.subSize || 20), color: C.teal,
    });
  }
}

// 헤더 강조 바 (제목 좌측 세로 바)
function headerBar(slide, color) {
  slide.addShape("rect", { x: MARGIN, y: HEADER_Y + 0.05, w: 0.09, h: 0.6, fill: { color: color || C.green }, line: { type: "none" } });
}

// ── 둥근 카드 ───────────────────────────────────────────────────────
function card(slide, x, y, w, h, fill = C.cardBg, border = C.cardBorder) {
  slide.addShape("roundRect", { x, y, w, h, rectRadius: 0.08, fill: { color: fill }, line: { color: border, width: 1 } });
}

function rect(slide, x, y, w, h, fill, line) {
  slide.addShape("rect", { x, y, w, h, fill: { color: fill }, line: line ? { color: line, width: 1 } : { type: "none" } });
}

function roundRect(slide, x, y, w, h, fill, opts = {}) {
  slide.addShape("roundRect", { x, y, w, h, rectRadius: opts.radius || 0.08,
    fill: { color: fill }, line: opts.line ? { color: opts.line, width: opts.lineW || 1 } : { type: "none" } });
}

// ── 배지 (강조 키워드) ──────────────────────────────────────────────
function badge(slide, x, y, w, text, fill = C.green, fontColor = C.white, h = 0.42, size = 16) {
  slide.addShape("roundRect", { x, y, w, h, rectRadius: 0.06, fill: { color: fill }, line: { type: "none" } });
  slide.addText(text, { x, y, w, h, align: "center", valign: "middle", fontFace: FONT, bold: true, fontSize: fs16(size), color: fontColor });
}

// ── 텍스트 헬퍼 ─────────────────────────────────────────────────────
function text(slide, str, x, y, w, h, opts = {}) {
  slide.addText(str, {
    x, y, w, h, align: opts.align || "left", valign: opts.valign || "top",
    fontFace: FONT, bold: !!opts.bold, fontSize: fs16(opts.size || 16),
    color: opts.color || C.body, lineSpacingMultiple: opts.lsm || 1.08,
    bullet: opts.bullet || false, ...(opts.extra || {}),
  });
}

// rich text array (addText with array of {text, options})
function richText(slide, runs, x, y, w, h, opts = {}) {
  const mapped = runs.map(r => ({ text: r.text, options: { fontFace: FONT, fontSize: fs16(r.size || 16), bold: !!r.bold, color: r.color || C.body, breakLine: r.breakLine, bullet: r.bullet } }));
  slide.addText(mapped, { x, y, w, h, align: opts.align || "left", valign: opts.valign || "top", lineSpacingMultiple: opts.lsm || 1.1, ...(opts.extra || {}) });
}

// ── 코드 블록 (회색 배경) ───────────────────────────────────────────
function codeBlock(slide, codeText, x, y, w, h, size = 16) {
  slide.addShape("roundRect", { x, y, w, h, rectRadius: 0.06, fill: { color: C.codeBg }, line: { color: C.cardBorder, width: 1 } });
  slide.addText(codeText, { x: x + 0.18, y: y + 0.12, w: w - 0.36, h: h - 0.24, align: "left", valign: "top",
    fontFace: "Consolas", fontSize: fs16(size), color: C.primary, lineSpacingMultiple: 1.12 });
}

// ── 하이라이트 박스 ─────────────────────────────────────────────────
function highlight(slide, str, x, y, w, h, opts = {}) {
  slide.addShape("roundRect", { x, y, w, h, rectRadius: 0.08, fill: { color: opts.fill || C.highlight }, line: { type: "none" } });
  slide.addText(str, { x: x + 0.2, y, w: w - 0.4, h, align: opts.align || "left", valign: "middle",
    fontFace: FONT, bold: opts.bold !== false, fontSize: fs16(opts.size || 17), color: opts.color || C.primary, lineSpacingMultiple: 1.05 });
}

// ── 플로우 스텝 바 ──────────────────────────────────────────────────
function flowStep(slide, x, y, w, h, label, color, size = 17) {
  slide.addShape("roundRect", { x, y, w, h, rectRadius: 0.06, fill: { color }, line: { type: "none" } });
  slide.addText(label, { x, y, w, h, align: "center", valign: "middle", fontFace: FONT, bold: true, fontSize: fs16(size), color: C.white });
}

// 화살표 (아래 방향 또는 우측)
function arrowDown(slide, x, y, size = 0.28) {
  slide.addText("▼", { x, y, w: size + 0.2, h: 0.3, align: "center", valign: "middle", fontFace: FONT, fontSize: fs16(16), color: C.arrow });
}
function arrowRight(slide, x, y) {
  slide.addText("▶", { x, y, w: 0.4, h: 0.3, align: "center", valign: "middle", fontFace: FONT, fontSize: fs16(16), color: C.arrow });
}

// ── 안전한 이미지 임베딩 ────────────────────────────────────────────
function addImage(slide, imagePath, opts) {
  if (!fs.existsSync(imagePath)) throw new Error(`이미지 파일 없음: ${imagePath}`);
  slide.addImage({ path: imagePath, ...opts });
}
// 이미지가 없으면 플레이스홀더 카드로 대체 (빌드 중단 방지용 옵션)
function addImageOrPlaceholder(slide, imagePath, opts, label) {
  if (fs.existsSync(imagePath)) { slide.addImage({ path: imagePath, ...opts }); return true; }
  card(slide, opts.x, opts.y, opts.w, opts.h, C.cardBg, C.cardBorder);
  slide.addText(label || "(이미지)", { x: opts.x, y: opts.y, w: opts.w, h: opts.h, align: "center", valign: "middle", fontFace: FONT, fontSize: fs16(16), color: C.meta });
  return false;
}

// ── 표 (addTable 래퍼) ──────────────────────────────────────────────
function table(slide, rows, opts) {
  slide.addTable(rows, { fontFace: FONT, fontSize: fs16(opts.fontSize || 16), color: C.body,
    border: { type: "solid", color: C.cardBorder, pt: 1 }, valign: "middle", autoPage: false, ...opts });
}
function headRow(cells, fill = C.tableHeader, color = C.primary, size = 16) {
  return cells.map(c => ({ text: c, options: { bold: true, fill: { color: fill }, color, fontFace: FONT, fontSize: fs16(size), align: "center" } }));
}

// ── 타이틀 슬라이드 ─────────────────────────────────────────────────
function titleSlide(pptx, opts) {
  const slide = pptx.addSlide({ masterName: "MASTER" });
  rect(slide, 0, 0, PAGE_W, PAGE_H, opts.bg || C.primary);
  // 좌측 강조 바
  rect(slide, 0, 0, 0.25, PAGE_H, opts.accent || C.green);
  slide.addText(opts.kicker || "", { x: 1.0, y: 2.4, w: 13, h: 0.6, fontFace: FONT, bold: true, fontSize: fs16(opts.kickerSize || 22), color: opts.accent || C.green });
  slide.addText(opts.title, { x: 1.0, y: 3.0, w: 14, h: 1.8, fontFace: FONT, bold: true, fontSize: fs16(opts.titleSize || 46), color: C.white, lineSpacingMultiple: 1.05 });
  if (opts.subtitle) slide.addText(opts.subtitle, { x: 1.0, y: 4.9, w: 14, h: 0.8, fontFace: FONT, fontSize: fs16(opts.subSize || 22), color: "D8D8D8" });
  if (opts.footer) slide.addText(opts.footer, { x: 1.0, y: 7.6, w: 14, h: 0.5, fontFace: FONT, fontSize: fs16(16), color: "B8B8B8" });
  return slide;
}

module.exports = {
  pptxgen, fs, MIN_FONT, fs16, FONT, C,
  PAGE_W, PAGE_H, MARGIN, CW, HEADER_Y, BODY_TOP, FOOTER_Y,
  newDeck, defineMaster, addSlide, pageHeader, headerBar,
  card, rect, roundRect, badge, text, richText, codeBlock, highlight,
  flowStep, arrowDown, arrowRight, addImage, addImageOrPlaceholder, table, headRow, titleSlide,
};
