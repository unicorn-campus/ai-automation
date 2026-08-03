# gpt-image-mcp

OpenAI GPT Image 모델(`gpt-image-2`)을 이용해 Claude Code 대화 중 바로 이미지를 생성·편집할 수
있는 STDIO 방식 MCP 서버임.  
"반도체 회로 그림 만들어줘", "이 이미지 배경 흰색으로 바꿔줘" 같은 요청을 대화 중에 하면 별도의
앱이나 웹사이트 없이 로컬 파일로 이미지가 저장됨.

## 주요 기능

- **텍스트 → 이미지 생성**: 설명만으로 새 이미지 생성
- **이미지 편집/합성**: 기존 이미지 1장을 설명대로 수정하거나, 여러 이미지를 참고해 새 이미지로 합성
- **최근 생성 이미지 조회**: 최근 20개 이력을 리소스로 조회
- **서버 설정 조회**: 모델명, 저장 경로 등 현재 설정값을 리소스로 조회
- **스타일 프롬프트 템플릿**: 교재·보고서용 일러스트 / 기술 다이어그램 / 사진처럼 사실적인 스타일
- **API 키 자동 관리**: 최초 1회만 키를 알려주면 `.env`에 저장해 이후 자동 재사용

## 가상환경 설정 및 실행 방법 (PowerShell)

```powershell
# 1. gpt-images 폴더로 이동
cd gpt-images

# 2. 가상환경 생성
python -m venv .venv

# 3. 가상환경 활성화
.\.venv\Scripts\Activate.ps1

# 4. 의존성 설치
pip install -r requirements.txt

# 5. 단독 실행 테스트 (STDIO로 대기 상태 진입, Ctrl+C로 종료)
python server.py
```

> PowerShell 스크립트 실행이 차단된 경우, 관리자 권한으로 아래 명령을 1회 실행:
> `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`

## API 키 설정

- `gpt-images/.env` 파일에 아래와 같이 저장:
  ```
  OPENAI_API_KEY=sk-...
  ```
- `.env` 파일이 없거나 키가 비어 있으면, 도구 호출 시 한국어 안내 메시지가 반환됨.
  이때 Claude에게 API 키를 알려주면 `set_openai_api_key` 도구가 자동으로 `.env`에 저장하고,
  이후 실행부터는 별도 입력 없이 재사용함.
- API 키는 <https://platform.openai.com/api-keys> 에서 발급 가능.

## MCP 서버 설치 방법 (Claude Code)

가상환경의 Python 인터프리터를 직접 지정해 STDIO 서버로 등록함 (경로는 실제 설치 위치에 맞게 수정).

```powershell
claude mcp add gpt-image-mcp -- "C:\Users\hiond\workspace\patent-bot\gpt-images\.venv\Scripts\python.exe" "C:\Users\hiond\workspace\patent-bot\gpt-images\server.py"
```

등록 후 `claude mcp list`로 `gpt-image-mcp`가 정상 등록되었는지 확인.

## 주요 소스 설명 (`server.py`)

| 구분 | 이름 | 설명 |
|---|---|---|
| 도구(Tool) | `set_openai_api_key` | API 키를 `.env`에 저장하고 즉시 환경변수에 반영 |
| 도구(Tool) | `generate_image` | 텍스트 설명으로 새 이미지 생성 (`images.generate`) |
| 도구(Tool) | `edit_image` | 이미지 1장 수정 또는 여러 장 합성 (`images.edit`) |
| 리소스(Resource) | `images://recent` | 최근 이미지 이력 최대 20개(최신순) JSON 반환 |
| 리소스(Resource) | `config://server` | 모델명·저장 경로·이력 개수 등 서버 설정값 JSON 반환 |
| 프롬프트(Prompt) | `textbook_illustration_style` | 교재·보고서용 일러스트 스타일 프롬프트 생성 |
| 프롬프트(Prompt) | `technical_diagram_style` | 기술 다이어그램·설계도 스타일 프롬프트 생성 |
| 프롬프트(Prompt) | `photorealistic_style` | 사진처럼 사실적인 이미지 스타일 프롬프트 생성 |

### 동작 방식

1. 도구 호출 시 `.env`에서 `OPENAI_API_KEY`를 읽어 OpenAI 클라이언트를 생성함.
   키가 없으면 코드 실행 없이 안내 메시지를 반환함.
2. `gpt-image-2` 모델로 이미지를 생성/편집하면 결과가 base64로 반환되는데,
   이를 디코딩해 `images/` 폴더에 `YYYYMMDD_HHMMSS_번호.형식`으로 저장함
   (base64 데이터 자체는 응답에 포함하지 않고 파일 경로만 반환).
3. 저장된 이미지 메타데이터(경로, 생성 시각, 프롬프트, 작업 종류, 모델명)를
   `.history.json`에 append하며, 100개를 초과하면 오래된 항목부터 삭제함.
4. OpenAI API 오류(인증 실패, 잘못된 요청 등)는 종류별로 구분해 한국어 안내 메시지로 변환함.

### 저장 파일

- `images/` — 생성/편집된 이미지 파일 (없으면 서버 시작 시 자동 생성)
- `.history.json` — 최근 이미지 생성 이력 (최대 100개)
- `.env` — OpenAI API 키 (버전관리 대상 아님)

## 테스트 결과

- `generate_image`로 반도체 회로 다이어그램 생성 → 파일 저장 확인 완료
- `edit_image`로 위 이미지의 배경색 변경 → 파일 저장 확인 완료
- 잘못된 API 키로 호출 시 한국어 오류 메시지 반환 확인 완료
- `.env` 미존재 시 한국어 안내 메시지 반환 확인 완료
