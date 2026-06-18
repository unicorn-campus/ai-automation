# 프롬프트 예제: GPT Image MCP 서버 개발 (비개발자용)

## 사용 목적
Claude Code에서 "이미지 만들어줘"라는 말 한마디로 OpenAI gpt-image-2가 이미지를 생성·편집하도록  
MCP 플러그인 서버(Claude Code에 기능을 추가하는 확장 프로그램)를 만드는 지시 프롬프트.  
비개발자도 이 프롬프트를 Claude Code에 붙여넣으면 서버 설치부터 테스트까지 자동으로 완료됨.

---

```text
[목표]
"이미지 생성·편집" 기능을 제공하는 MCP 서버 개발

[역할]
당신은 Claude Code 플러그인(MCP 서버) 개발 전문가입니다.  

[맥락]
- 내 상황: Claude Code 대화 중에 "반도체 회로 그림 만들어줘", "이 이미지 배경 흰색으로 바꿔줘"처럼  
  말하면 바로 이미지 파일이 생성되기를 원함. 별도 앱이나 웹사이트를 열지 않아도 됨.
[입력정보]
- 이미지 생성 AI: OpenAI `gpt-image-2` 
  - 할 수 있는 것:
    - 텍스트 설명으로 이미지 새로 만들기
    - 기존 이미지를 설명에 따라 수정하기
    - 여러 이미지를 참고해 새 이미지 합성하기 (gpt-image-2 신기능)
- API 키(OpenAI 접속 비밀번호): `~/.claude/secrets/.env` 파일의 `OPENAI_API_KEY` 값
- 개발 언어: Python

[작업방법]
1. API 키 준비
   - `~/.claude/secrets/.env` 파일에서 `OPENAI_API_KEY` 값 읽기
   - 파일이 없거나 키가 없으면:
     - 사용자에게 OpenAI API 키를 입력해 달라고 안내
     - `~/.claude/secrets/` 폴더 없으면 자동 생성
     - `.env` 파일에 `OPENAI_API_KEY=입력된키` 형태로 저장
     - 이후 실행부터는 이 파일에서 자동으로 읽어 재사용

2. 최신 모델 확인: 공식 사이트 검색해서 `gpt-image-2`보다 더 최신 GPT Image 모델이 있으면 그 모델 사용, 없으면 `gpt-image-2` 고정

3. MCP 서버 만들기 — `~/mcp-servers/gpt-images/server.py`
   - 통신 방식: STDIO 
   - 서버 이름: `gpt-image-mcp`

   - 도구(Tools)
     - 텍스트로 이미지 새로 만들기
     — 기존 이미지 수정하거나 여러 이미지 합성
     
   - 데이터(Resources)
     — 최근 만든 이미지 목록 (최대 20개)
     — 현재 서버 설정값 확인
   
   - 프롬프트(Prompts)
     — 교재·보고서용 일러스트 스타일
     — 기술 다이어그램·설계도 스타일
     — 사진처럼 사실적인 이미지 스타일
   
4. 이미지 저장 관리
   - 저장 폴더: `~/mcp-servers/gpt-images/images/` (없으면 자동으로 폴더 만들기)
   - 파일명: `년월일_시분초_번호.형식` (예: `20260618_143022_1.png`)
   - 이력 파일: `~/mcp-servers/gpt-images/.history.json`
     - 기록 내용: 파일 경로, 만든 시간, 사용한 설명, 작업 종류, 모델명
     - 최대 100개 보관 (초과 시 가장 오래된 항목 자동 삭제)

5. 설치 파일 만들기
   - `requirements.txt`: 필요한 Python 패키지 목록 (버전 명시)
   - `install.sh` (Mac·Linux용): 가상환경 만들고 패키지 설치하는 스크립트
   - `install.bat` (Windows용): Windows에서 동일 작업 수행하는 배치 파일
   - `README.md`: 한국어로 작성된 설치 및 Claude Code 등록 방법 안내  
     (claude_desktop_config.json에 추가할 내용 예시 포함)

6. 테스트 및 버그 Fix

[출력]
- 서버 코드: `~/mcp-servers/gpt-images/server.py`
- 패키지 목록: `~/mcp-servers/gpt-images/requirements.txt`
- 설치 스크립트(Mac·Linux): `~/mcp-servers/gpt-images/install.sh`
- 설치 스크립트(Windows): `~/mcp-servers/gpt-images/install.bat`
- 사용 안내서: `~/mcp-servers/gpt-images/README.md` (한국어, Claude Code 등록 방법 포함)

[제약조건]
- MUST:
  - context7 mcp 사용
  - `~/.claude/secrets/.env`에서 `OPENAI_API_KEY` 읽기  
    (없으면 사용자에게 안내 후 직접 받아 파일에 저장)
  - STDIO 방식으로만 통신 구현 (`stdio_server()`)
  - `gpt-image-2` 이상 최신 모델 사용 (먼저 검색·확인 후 결정)
  - 이미지 저장 폴더 없으면 자동으로 생성
  - 설치 후 실제 이미지 생성 테스트까지 완료 (파일 존재 증거 확인)
  - README는 반드시 한국어로 작성
- MUST NOT:
  - HTTP/SSE 통신 방식 사용 금지 (STDIO만 허용)
  - 이미지 데이터(base64)를 응답에 직접 포함 금지
  - API 키를 코드 파일에 직접 쓰는 것 금지 (반드시 `.env` 파일에서 읽기)
  - 추가로 필요한 정보나 사용자가 의사결정할 것이 있으면 추측하지 말고 물어볼 것 
- 완료조건:
  - 테스트 시 정상 수행 확인
  - 잘못된 API 키 테스트 시 한국어 오류 안내 메시지 반환 확인

```
