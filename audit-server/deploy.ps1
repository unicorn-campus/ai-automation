# Fly.io 감사 서버 최초 배포 스크립트 (Windows PowerShell)
# 사전 조건: winget install flyctl  +  fly auth login
$ErrorActionPreference = 'Stop'

$AppName = "unicorn-audit"
$PgName  = "$AppName-db"
$Region  = "nrt"

Write-Host "=== Fly.io 감사 서버 배포: $AppName.fly.dev ===" -ForegroundColor Cyan
Write-Host ""

# ── 1. API_KEY 자동 생성 ──────────────────────────────────────
$Bytes  = [byte[]]::new(24)
[System.Security.Cryptography.RandomNumberGenerator]::Fill($Bytes)
$ApiKey = ($Bytes | ForEach-Object { $_.ToString('x2') }) -join ''

# ── 2. 앱 생성 ────────────────────────────────────────────────
Write-Host "[1/5] 앱 생성..."
try   { fly apps create $AppName; Write-Host "  → 생성 완료" }
catch { Write-Host "  → 이미 존재, skip" }

# ── 3. PostgreSQL 클러스터 생성 ───────────────────────────────
Write-Host "[2/5] PostgreSQL 생성 (무료 1GB, 공유 CPU)..."
try {
  fly postgres create --name $PgName --region $Region `
    --initial-cluster-size 1 --vm-size shared-cpu-1x --volume-size 1
  Write-Host "  → 생성 완료"
} catch { Write-Host "  → 이미 존재, skip" }

# ── 4. PostgreSQL → 앱 연결 ───────────────────────────────────
Write-Host "[3/5] PostgreSQL 연결 (DATABASE_URL 자동 주입)..."
try   { fly postgres attach $PgName --app $AppName; Write-Host "  → 연결 완료" }
catch { Write-Host "  → 이미 연결됨, skip" }

# ── 5. 시크릿 설정 ────────────────────────────────────────────
Write-Host "[4/5] 시크릿 설정..."
fly secrets set "API_KEY=$ApiKey" --app $AppName

# ── 6. 배포 ───────────────────────────────────────────────────
Write-Host "[5/5] 배포..."
fly deploy --app $AppName --region $Region

Write-Host ""
Write-Host "===============================" -ForegroundColor Green
Write-Host "  ✅ 배포 완료"                  -ForegroundColor Green
Write-Host "  URL    : https://$AppName.fly.dev" -ForegroundColor Green
Write-Host "  API_KEY: $ApiKey"              -ForegroundColor Yellow
Write-Host ""
Write-Host "  ⚠️  API_KEY를 지금 복사하세요. 이후 확인 불가합니다." -ForegroundColor Red
Write-Host "===============================" -ForegroundColor Green
Write-Host ""
Write-Host "  헬스체크: curl https://$AppName.fly.dev/health"
