# Managed Hook 등록 — 완료 현황

## 전체 진행 상황

- [x] 감사 서버 개발 완료
- [x] Fly.io 배포 완료 (`https://unicorn-audit.fly.dev`)
- [x] API 동작 검증 완료 (health · POST · GET)
- [x] `managed-settings.json` 작성 완료
- [x] Claude.ai 관리자 콘솔 Managed Settings 등록 완료 (2026-06-20)
- [x] 로컬 `C:\Program Files\ClaudeCode\managed-settings.json` 배포 완료
- [x] 시스템 환경변수 `CLAUDE_AUDIT_API_KEY` 등록 완료 (Machine 수준)
- [ ] 조직 멤버 PC 환경변수 MDM 배포 (미완료)

---

## 완료된 작업 상세

### Claude.ai 관리자 콘솔 등록 방법

1. `https://claude.ai/admin-settings/claude-code` 접속 (오너 계정)
2. **관리형 설정 (settings.json)** → **관리** 버튼 클릭
3. 에디터에서 기존 내용 전체 선택(Ctrl+A) 후 JSON 붙여넣기
4. 스키마 경고 발생 시 **"오류가 있어도 추가"** 클릭 (정상 동작)
5. **"✅ 설정 추가됨"** 확인

> **Computer Use 활용**: 관리자 콘솔 에디터(Monaco)에 직접 타이핑하면 JSON이 깨짐.  
> `navigator.clipboard.writeText(json)` + Ctrl+V 방식으로 안전하게 붙여넣기.

### 남은 작업: 조직 멤버 PC 환경변수 배포

```
CLAUDE_AUDIT_API_KEY=c1a72c28c9aed0f0bc156dc2c4a0df79392c40a32a48c61a
```

| OS | 배포 방법 |
|----|----------|
| Windows | Intune / Group Policy → 시스템 환경변수 설정 |
| macOS | JAMF / Kandji → launchd plist 배포 |
| Linux | Ansible → `/etc/environment` 또는 쉘 프로파일 |

---

## 로컬 파일 배포 방식 (관리자 콘솔 없을 때 대안)

Claude Code가 설치된 각 PC에 직접 파일 배포:

```
# Windows
C:\Program Files\ClaudeCode\managed-settings.json

# macOS
/Library/Application Support/ClaudeCode/managed-settings.json

# Linux
/etc/claude-code/managed-settings.json
```

파일 내용: `prompts/6회차/audit-server/managed-settings.json` 동일하게 사용.  
단, `$CLAUDE_AUDIT_API_KEY`는 실제 값으로 대체하거나 환경변수로 주입.

---

## 참고

- Fly.io 로그 확인: `fly logs --app unicorn-audit`
- DB 접속: `fly postgres connect --app unicorn-audit-db`
- API_KEY 재설정: `fly secrets set API_KEY="새값" --app unicorn-audit`
