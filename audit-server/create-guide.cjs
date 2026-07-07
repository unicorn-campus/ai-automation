const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, ImageRun,
  HeadingLevel, AlignmentType, BorderStyle, WidthType, ShadingType,
  TabStopType, TabStopPosition, PageNumber, Header, Footer, PageBreak,
  ExternalHyperlink, LevelFormat
} = require('docx')
const fs = require('fs')
const path = require('path')

const BASE = __dirname
const OUT  = path.join(BASE, 'Audit Server 셋업 가이드.docx')

// ── 이미지 로드 및 치수 계산 ──────────────────────────────
const imgArch   = fs.readFileSync(path.join(BASE, 'img-architecture.png'))
const imgAdmin  = fs.readFileSync(path.join(BASE, 'img-step2-admin.png'))
const imgDialog = fs.readFileSync(path.join(BASE, 'img-step3-dialog.png'))

function pngSize(buf) {
  return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) }
}
const TW = 520
const arc = pngSize(imgArch);  const arcH = Math.round(TW * arc.h / arc.w)
const adm = pngSize(imgAdmin);  const admH = Math.round(TW * adm.h / adm.w)
const dlg = pngSize(imgDialog); const dlgH = Math.round(TW * dlg.h / dlg.w)

// ── 색상 ─────────────────────────────────────────────────
const C = { blue: '2563EB', dark: '111827', gray: '6B7280',
            lgray: 'F3F4F6', dblue: '1E3A5F', lblue: 'DBEAFE',
            red: 'FEF2F2', rborder: 'FCA5A5', codebg: '1E293B',
            green: 'F0FDF4', gborder: '86EFAC', yellow: 'FFFBEB', yborder: 'FCD34D' }

// ── 헬퍼 ─────────────────────────────────────────────────
const sp   = (b = 0, a = 0) => ({ spacing: { before: b, after: a } })
const run  = (text, opts = {}) =>
  new TextRun({ text, font: 'Arial', size: 22, color: C.dark, ...opts })
const mono = (text, opts = {}) =>
  new TextRun({ text, font: 'Courier New', size: 20, color: '94A3B8', ...opts })

function hLine(color = C.blue, size = 6) {
  return { bottom: { style: BorderStyle.SINGLE, size, color, space: 1 } }
}
function p(children, opts = {}) {
  return new Paragraph({ children: Array.isArray(children) ? children : [children], ...opts })
}
function box(children, bgColor, borderColor = 'CCCCCC', colW = 9026) {
  const bd = { style: BorderStyle.SINGLE, size: 4, color: borderColor }
  return new Table({
    width: { size: colW, type: WidthType.DXA }, columnWidths: [colW],
    rows: [new TableRow({ children: [new TableCell({
      width: { size: colW, type: WidthType.DXA },
      shading: { fill: bgColor, type: ShadingType.CLEAR },
      margins: { top: 140, bottom: 140, left: 200, right: 200 },
      borders: { top: bd, bottom: bd, left: bd, right: bd },
      children: Array.isArray(children) ? children : [children]
    })] })]
  })
}
function code(lines) {
  return box(
    lines.map(l => p(
      l.startsWith('#')
        ? mono(l, { color: '64748B' })
        : l.startsWith('$') || l.startsWith('fly') || l.startsWith('curl') || l.startsWith('node')
          ? mono(l, { color: 'A3E635' })
          : mono(l),
      sp(0, 0)
    )),
    C.codebg, '374151'
  )
}
function stepLabel(n, title) {
  return p([
    run(`Step ${n}  `, { bold: true, size: 28, color: C.blue }),
    run(title,        { bold: true, size: 28 })
  ], { ...sp(360, 160), border: hLine(C.blue, 4) })
}
function hr() {
  return p('', { border: hLine('D1D5DB', 2), ...sp(200, 200) })
}
function img(data, w, h, type = 'png') {
  return p(new ImageRun({ type, data, transformation: { width: w, height: h },
    altText: { title: 'screenshot', description: 'screenshot', name: 'screenshot' }
  }), sp(120, 120))
}
function mkRow(col1, col2, isHeader = false) {
  const bd = { style: BorderStyle.SINGLE, size: 2, color: 'D1D5DB' }
  const borders = { top: bd, bottom: bd, left: bd, right: bd }
  const bg = isHeader ? '1E3A5F' : 'FFFFFF'
  const fc = isHeader ? 'FFFFFF' : C.dark
  return new TableRow({ children: [
    new TableCell({
      width: { size: 0, type: WidthType.AUTO }, borders,
      shading: { fill: bg, type: ShadingType.CLEAR },
      margins: { top: 80, bottom: 80, left: 120, right: 120 },
      children: [p(run(col1, { bold: isHeader, color: fc, font: isHeader ? 'Arial' : 'Courier New', size: isHeader ? 20 : 18 }), sp(0, 0))]
    }),
    new TableCell({
      width: { size: 0, type: WidthType.AUTO }, borders,
      shading: { fill: bg, type: ShadingType.CLEAR },
      margins: { top: 80, bottom: 80, left: 120, right: 120 },
      children: [p(run(col2, { bold: isHeader, color: fc }), sp(0, 0))]
    })
  ]})
}

// ── 본문 ──────────────────────────────────────────────────
const children = [

  // ===== 제목 =====
  p(run('Claude Code', { size: 52, bold: true, color: C.dblue }), sp(0, 0)),
  p(run('Audit Server 셋업 가이드', { size: 52, bold: true, color: C.blue }), sp(0, 80)),
  p(run('관리자용 — 서버 구축부터 조직 등록까지 이 가이드 한 장으로 완료', { size: 20, color: C.gray }), sp(0, 400)),

  // 개요 박스
  box([
    p(run('📋  개요', { bold: true, size: 24, color: C.dblue }), sp(0, 100)),
    p(run('Claude Code 사용자의 세션 시작·프롬프트를 감사 서버에 자동 기록하는 시스템 구축 전 과정.'), sp(0, 60)),
    p([run('• 인프라: ', { bold: true }), run('Fly.io (Tokyo 리전) — Node.js + PostgreSQL')], sp(0, 40)),
    p([run('• 등록 방식: ', { bold: true }), run('Claude.ai 관리자 콘솔 Managed Hook — 사용자 PC 설정 불필요')], sp(0, 40)),
    p([run('• 보안: ', { bold: true }), run('API 키 관리자 콘솔 서버 사이드 저장 → 사용자에게 미노출')], sp(0, 40)),
    p([run('• 예상 소요시간: ', { bold: true }), run('최초 구축 30분 / 재등록 5분')], sp(0, 0)),
  ], C.lblue, '93C5FD'),

  p('', sp(0, 240)),

  // 아키텍처 다이어그램
  p(run('시스템 아키텍처', { bold: true, size: 24, color: C.dblue }), { ...sp(0, 120), border: hLine('BFDBFE', 2) }),
  img(imgArch, TW, arcH),
  p(run('▲ Claude Code → Managed Hook → Fly.io 감사 서버 → PostgreSQL 전체 흐름', { size: 18, color: C.gray, italics: true }),
    { alignment: AlignmentType.CENTER, ...sp(60, 200) }),

  hr(),

  // ===== 사전 준비사항 =====
  p(run('사전 준비사항', { bold: true, size: 28 }), { ...sp(200, 160), border: hLine('D1D5DB', 4) }),
  new Table({
    width: { size: 9026, type: WidthType.DXA }, columnWidths: [2600, 6426],
    rows: [
      mkRow('항목', '내용', true),
      mkRow('Fly.io 계정', 'https://fly.io 가입 및 flyctl CLI 설치 필요'),
      mkRow('Node.js', 'v18 이상 (로컬 개발/배포 스크립트 실행용)'),
      mkRow('Claude.ai 관리자 권한', '조직 Admin 계정 — Managed Settings 편집 가능'),
      mkRow('소스코드 경로', 'audit-server/ (이 저장소 내 포함)'),
    ]
  }),

  p('', sp(0, 80)),
  hr(),

  // ===== Step 1: 서버 개발 구조 =====
  stepLabel(1, '감사 서버 구조 확인'),
  p(run('audit-server/ 디렉토리에 서버 소스가 포함되어 있음. 주요 파일 구조:'), sp(0, 120)),

  code([
    'audit-server/',
    '├── src/',
    '│   ├── server.js          # Express 서버 진입점 (포트 3000)',
    '│   ├── db.js              # PostgreSQL 연결 풀 (pg 모듈)',
    '│   ├── routes/',
    '│   │   └── audit.js       # POST /api/audit  GET /api/audit',
    '│   └── middleware/',
    '│       └── auth.js        # X-API-Key 헤더 인증',
    '├── migrations/',
    '│   └── 001_create_audit_logs.sql   # audit_logs 테이블 스키마',
    '├── Dockerfile             # Node 22-alpine 기반 컨테이너',
    '├── fly.toml               # Fly.io 앱 설정 (nrt 리전, 256MB)',
    '├── deploy.ps1             # Windows 배포 자동화 스크립트',
    '└── deploy.sh              # Mac/Linux 배포 자동화 스크립트',
  ]),

  p('', sp(0, 120)),

  // DB 스키마 박스
  box([
    p(run('audit_logs 테이블 주요 컬럼', { bold: true, size: 20, color: C.dblue }), sp(0, 80)),
    new Table({
      width: { size: 8626, type: WidthType.DXA }, columnWidths: [2000, 1600, 5026],
      rows: [
        mkRow('컬럼', '타입', true),
        mkRow('session_id', 'TEXT', 'Claude Code 세션 식별자'),
        mkRow('user_email', 'TEXT', 'cwd 경로에서 추출한 OS 사용자명'),
        mkRow('prompt_text', 'TEXT', '사용자가 입력한 프롬프트'),
        mkRow('hook_event', 'TEXT', 'UserPromptSubmit / SessionStart'),
        mkRow('cwd', 'TEXT', '작업 디렉토리 경로'),
        mkRow('created_at', 'TIMESTAMPTZ', '수신 시각 (자동 기록)'),
      ].map(r => r)
    }),
  ], C.lgray, 'D1D5DB', 8826),

  p('', sp(0, 80)),
  hr(),

  // ===== Step 2: Fly.io 배포 =====
  p(new PageBreak()),
  stepLabel(2, 'Fly.io에 감사 서버 배포'),
  p(run('flyctl CLI로 Fly.io에 서버와 PostgreSQL DB를 생성·배포함.'), sp(0, 140)),

  // 2-1 flyctl 설치
  p(run('2-1  flyctl 설치 (최초 1회)', { bold: true, color: C.gray }), sp(0, 80)),
  code([
    '# Windows (PowerShell)',
    'iwr https://fly.io/install.ps1 -useb | iex',
    '',
    '# Mac/Linux',
    'curl -L https://fly.io/install.sh | sh',
    '',
    '# 로그인',
    'fly auth login',
  ]),

  p('', sp(0, 120)),

  // 2-2 앱 생성
  p(run('2-2  앱 및 DB 생성 (최초 1회)', { bold: true, color: C.gray }), sp(0, 80)),
  code([
    'cd audit-server',
    '',
    '# 앱 생성 (이름 변경 시 fly.toml의 app 값도 수정)',
    'fly apps create unicorn-audit',
    '',
    '# PostgreSQL DB 생성 (Tokyo 리전, 256MB)',
    'fly postgres create --name unicorn-audit-db --region nrt --vm-size shared-cpu-1x',
    '',
    '# DB를 앱에 연결 (DATABASE_URL 자동 설정)',
    'fly postgres attach unicorn-audit-db --app unicorn-audit',
    '',
    '# API 키 시크릿 등록',
    'fly secrets set API_KEY=c1a72c28c9aed0f0bc156dc2c4a0df79392c40a32a48c61a --app unicorn-audit',
  ]),

  p('', sp(0, 120)),

  // 2-3 배포
  p(run('2-3  배포 실행', { bold: true, color: C.gray }), sp(0, 80)),
  code([
    '# Windows — 자동화 스크립트 사용',
    '.\\deploy.ps1',
    '',
    '# Mac/Linux',
    'chmod +x deploy.sh && ./deploy.sh',
    '',
    '# 또는 직접 실행',
    'fly deploy --app unicorn-audit',
  ]),

  p('', sp(0, 120)),

  // 2-4 배포 확인
  p(run('2-4  배포 상태 확인', { bold: true, color: C.gray }), sp(0, 80)),
  code([
    'fly status --app unicorn-audit',
    '# → ID, State: running, Region: nrt 확인',
    '',
    'fly logs --app unicorn-audit',
    '# → "[server] migration applied"',
    '# → "[server] audit server listening on :3000" 확인',
  ]),

  p('', sp(0, 100)),

  box([
    p(run('⚠  재배포 시 주의사항', { bold: true, color: 'B45309' }), sp(0, 80)),
    p(run('• 앱/DB 생성(2-2)은 최초 1회만 실행. 소스 변경 후엔 2-3(배포)만 재실행.'), sp(0, 40)),
    p(run('• API_KEY는 fly.toml에 포함하지 않음 — secrets에만 저장 (git 노출 방지).'), sp(0, 40)),
    p(run('• fly.toml의 app = "unicorn-audit" 이름이 실제 앱명과 일치해야 함.'), sp(0, 0)),
  ], C.yellow, C.yborder),

  p('', sp(0, 80)),
  hr(),

  // ===== Step 3: 서버 상태 확인 =====
  stepLabel(3, '감사 서버 상태 확인'),
  p(run('배포 후, 관리자 콘솔 등록 전 서버 정상 동작 확인.'), sp(0, 120)),

  p(run('헬스체크', { bold: true, color: C.gray }), sp(0, 60)),
  code([
    'curl https://unicorn-audit.fly.dev/health',
    '# 응답: {"status":"ok"}',
  ]),

  p('', sp(0, 100)),
  p(run('감사 로그 조회 테스트', { bold: true, color: C.gray }), sp(0, 60)),
  code([
    'curl "https://unicorn-audit.fly.dev/api/audit" \\',
    '  -H "X-API-Key: c1a72c28c9aed0f0bc156dc2c4a0df79392c40a32a48c61a"',
    '# 응답: {"total":0, "data":[]}  ← 초기값 0 정상',
  ]),

  p('', sp(0, 80)),
  hr(),

  // ===== Step 4: 관리자 콘솔 =====
  p(new PageBreak()),
  stepLabel(4, '관리자 콘솔 접속'),
  p(run('브라우저에서 아래 URL 접속 → 좌측 메뉴 [제품 > Claude Code] 클릭.'), sp(0, 120)),

  box(
    p([
      run('접속 URL: ', { bold: true }),
      new ExternalHyperlink({
        link: 'https://claude.ai/admin-settings/claude-code',
        children: [run('https://claude.ai/admin-settings/claude-code', { color: C.blue, underline: {} })]
      })
    ], sp(0, 0)),
    C.lgray, 'D1D5DB'
  ),

  p('', sp(0, 140)),
  p(run('관리형 설정 (settings.json) 항목에서 [관리] 버튼 클릭.', { color: C.gray }), sp(0, 100)),

  img(imgAdmin, TW, admH),

  p('', sp(0, 80)),
  hr(),

  // ===== Step 5: settings.json 업데이트 =====
  stepLabel(5, '관리형 설정 JSON 업데이트'),
  p(run('아래 순서로 settings.json 내용을 교체함.'), sp(0, 140)),

  ...[
    '1.  [관리] 버튼 클릭 → 관리형 설정 다이얼로그 오픈',
    '2.  다이얼로그의 JSON 에디터 전체 선택 (Ctrl+A)',
    '3.  아래 파일 내용 전체 복사 후 붙여넣기:',
  ].map(t => p(run(t), sp(0, 60))),

  box(
    p([
      run('파일: ', { bold: true }),
      run('prompts/6회차/audit-server/managed-settings.json', { font: 'Courier New', color: C.blue })
    ], sp(0, 0)),
    C.lblue, '93C5FD'
  ),

  p(run('4.  [오류가 있는 상태로 업데이트] 버튼 클릭'), sp(100, 0)),
  p('', sp(0, 140)),

  img(imgDialog, TW, dlgH),

  p('', sp(0, 120)),

  box([
    p(run('⚠  스키마 경고 안내', { bold: true, color: 'B45309' }), sp(0, 80)),
    p(run('"스키마에서 오류가 감지되었습니다" 경고가 표시됨 — 실제 동작에 영향 없음.'), sp(0, 40)),
    p(run('"async", "allowedEnvVars" 필드가 공개 스키마에 미포함된 것이 원인.'), sp(0, 40)),
    p(run('[오류가 있는 상태로 업데이트] 를 클릭하여 강제 저장 필요.'), sp(0, 0)),
  ], C.yellow, C.yborder),

  p('', sp(0, 80)),
  hr(),

  // ===== Step 6: 검증 =====
  stepLabel(6, 'Claude Code 재시작 및 검증'),
  p(run('설정 적용을 위해 Claude Code를 재시작 후 동작 확인.'), sp(0, 140)),

  p(run('1.  Claude Code 완전 종료 후 재시작 (터미널 또는 데스크톱 앱)'), sp(0, 80)),
  p(run('2.  프롬프트 입력 후 아래 명령으로 로그 수신 확인:'), sp(0, 80)),

  code([
    'curl "https://unicorn-audit.fly.dev/api/audit?limit=5" \\',
    '  -H "X-API-Key: c1a72c28c9aed0f0bc156dc2c4a0df79392c40a32a48c61a"',
    '',
    '# 확인 포인트',
    '# - hook_event: "UserPromptSubmit" 또는 "SessionStart"',
    '# - user_email: OS 사용자명 (Windows: C:\\Users\\{user}\\... 에서 추출)',
    '# - prompt_text: 입력한 프롬프트 내용',
  ]),

  p('', sp(0, 100)),
  box([
    p(run('✅  등록 완료 확인 기준', { bold: true, color: '166534' }), sp(0, 80)),
    p(run('로그 응답에 total > 0 이고 가장 최근 created_at이 방금 입력 시각과 일치하면 정상.'), sp(0, 0)),
  ], C.green, C.gborder),

  p('', sp(0, 80)),
  hr(),

  // ===== 참조 파일 =====
  p(run('참조 파일', { bold: true, size: 28 }), { ...sp(200, 160), border: hLine('D1D5DB', 4) }),
  new Table({
    width: { size: 9026, type: WidthType.DXA }, columnWidths: [3800, 5226],
    rows: [
      mkRow('파일', '설명', true),
      mkRow('prompts/6회차/audit-server/managed-settings.json', 'Step 5에서 붙여넣을 설정 JSON'),
      mkRow('prompts/6회차/audit-server/README.md', '전체 구축 현황 및 자격증명 기록'),
      mkRow('audit-server/src/routes/audit.js', '감사 로그 수신·저장·조회 라우터'),
      mkRow('audit-server/src/middleware/auth.js', 'X-API-Key 인증 미들웨어'),
      mkRow('audit-server/fly.toml', 'Fly.io 앱 설정'),
      mkRow('audit-server/deploy.ps1 / deploy.sh', '배포 자동화 스크립트'),
    ]
  }),
  p('', sp(0, 60)),
  p(run('API 키 변경 시: fly secrets set API_KEY=신규키 --app unicorn-audit 후 fly deploy 재실행.', { color: C.gray, size: 20 }), sp(0, 0)),
]

// ── Document 조립 ─────────────────────────────────────────
const doc = new Document({
  styles: {
    default: { document: { run: { font: 'Arial', size: 22, color: C.dark } } }
  },
  sections: [{
    properties: {
      page: { size: { width: 11906, height: 16838 }, margin: { top: 1260, right: 1260, bottom: 1260, left: 1260 } }
    },
    headers: {
      default: new Header({ children: [
        p([
          run('Claude Code Audit Server 셋업 가이드', { size: 18, color: C.gray }),
          run('\tunicorn 내부용', { size: 18, color: C.gray })
        ], { border: hLine('BFDBFE', 4), tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }], ...sp(0, 0) })
      ]})
    },
    footers: {
      default: new Footer({ children: [
        p([
          run('unicorn | 감사 서버 셋업 가이드', { size: 18, color: C.gray }),
          run('\t', { size: 18 }),
          new TextRun({ children: [PageNumber.CURRENT], size: 18, color: C.gray, font: 'Arial' })
        ], { tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }], ...sp(0, 0) })
      ]})
    },
    children
  }]
})

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(OUT, buf)
  console.log('Created:', OUT)
  console.log('Size:', (buf.length / 1024).toFixed(1), 'KB')
}).catch(e => { console.error(e.message); process.exit(1) })
