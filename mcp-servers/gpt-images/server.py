"""gpt-image-mcp: OpenAI GPT Image 모델 기반 이미지 생성·편집 MCP 서버 (STDIO 전용)."""

from __future__ import annotations

import json
import os
from contextlib import ExitStack
from datetime import datetime
from pathlib import Path

from dotenv import load_dotenv, set_key
from mcp.server import MCPServer
from openai import AuthenticationError, BadRequestError, OpenAI, OpenAIError

# ---------------------------------------------------------------------------
# 경로 / 상수
# ---------------------------------------------------------------------------

BASE_DIR = Path(__file__).parent.resolve()
ENV_PATH = BASE_DIR / ".env"
IMAGES_DIR = BASE_DIR / "images"
HISTORY_PATH = BASE_DIR / ".history.json"

IMAGES_DIR.mkdir(parents=True, exist_ok=True)

# 2026-07-16 기준 공식 문서(developers.openai.com/api/docs/models/gpt-image-2) 확인 결과
# gpt-image-2가 최신 GPT Image 모델임 (gpt-image-1, gpt-image-1-mini, gpt-image-1.5 이후 버전).
MODEL_NAME = "gpt-image-2"

MAX_HISTORY = 100
MAX_RECENT_LIST = 20
API_KEY_HELP_URL = "https://platform.openai.com/api-keys"

# mcp>=2.0.0 (2026-07-28 스펙): FastMCP는 MCPServer로 이름이 변경됨. 데코레이터 API는 동일.
mcp = MCPServer("gpt-image-mcp")


# ---------------------------------------------------------------------------
# 공통 유틸리티
# ---------------------------------------------------------------------------


def _load_history() -> list[dict]:
    if not HISTORY_PATH.exists():
        return []
    try:
        return json.loads(HISTORY_PATH.read_text(encoding="utf-8"))
    except (json.JSONDecodeError, OSError):
        return []


def _append_history(entries: list[dict]) -> None:
    history = _load_history()
    history.extend(entries)
    if len(history) > MAX_HISTORY:
        history = history[-MAX_HISTORY:]
    HISTORY_PATH.write_text(
        json.dumps(history, ensure_ascii=False, indent=2), encoding="utf-8"
    )


def _get_client() -> tuple[OpenAI | None, str | None]:
    load_dotenv(ENV_PATH, override=True)
    api_key = os.environ.get("OPENAI_API_KEY", "").strip()
    if not api_key:
        return None, (
            "OpenAI API 키가 설정되어 있지 않습니다. "
            f"{API_KEY_HELP_URL} 에서 API 키를 발급받으신 뒤, "
            "저에게 키를 알려주시면 `set_openai_api_key` 도구로 저장하고 "
            "이후부터는 자동으로 재사용하겠습니다."
        )
    return OpenAI(api_key=api_key), None


def _format_openai_error(exc: Exception) -> str:
    if isinstance(exc, AuthenticationError):
        return (
            "OpenAI API 키가 유효하지 않습니다. 키가 올바른지 확인하신 뒤 "
            "`set_openai_api_key` 도구로 다시 저장해 주세요. "
            f"(발급: {API_KEY_HELP_URL})"
        )
    if isinstance(exc, BadRequestError):
        return f"요청이 올바르지 않습니다: {exc.message if hasattr(exc, 'message') else exc}"
    if isinstance(exc, OpenAIError):
        return f"OpenAI API 호출 중 오류가 발생했습니다: {exc}"
    return f"이미지 처리 중 알 수 없는 오류가 발생했습니다: {exc}"


def _next_free_path(timestamp: str, index: int, ext: str) -> Path:
    candidate = IMAGES_DIR / f"{timestamp}_{index}.{ext}"
    while candidate.exists():
        index += 1
        candidate = IMAGES_DIR / f"{timestamp}_{index}.{ext}"
    return candidate


def _save_images(
    result, output_format: str, prompt: str, operation: str
) -> list[dict]:
    import base64

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    saved: list[dict] = []
    for i, item in enumerate(result.data, start=1):
        image_bytes = base64.b64decode(item.b64_json)
        path = _next_free_path(timestamp, i, output_format)
        path.write_bytes(image_bytes)
        saved.append(
            {
                "file_path": str(path),
                "created_at": datetime.now().isoformat(timespec="seconds"),
                "prompt": prompt,
                "operation": operation,
                "model": MODEL_NAME,
            }
        )
    _append_history(saved)
    return saved


def _format_success(saved: list[dict]) -> str:
    lines = ["이미지 생성이 완료되었습니다."]
    for entry in saved:
        lines.append(f"- {entry['file_path']}")
    return "\n".join(lines)


# ---------------------------------------------------------------------------
# 도구 (Tools)
# ---------------------------------------------------------------------------


@mcp.tool()
def set_openai_api_key(api_key: str) -> str:
    """OpenAI API 키를 .env 파일에 저장하고 즉시 적용합니다. API 키가 없거나 만료된 경우 사용합니다."""
    api_key = api_key.strip()
    if not api_key:
        return "API 키 값이 비어 있습니다. 올바른 OpenAI API 키를 입력해 주세요."
    if not ENV_PATH.exists():
        ENV_PATH.write_text("", encoding="utf-8")
    set_key(str(ENV_PATH), "OPENAI_API_KEY", api_key)
    os.environ["OPENAI_API_KEY"] = api_key
    return "OpenAI API 키가 저장되었습니다. 이제부터 이미지 생성/편집 도구를 바로 사용할 수 있습니다."


@mcp.tool()
def generate_image(
    prompt: str,
    size: str = "auto",
    quality: str = "auto",
    n: int = 1,
    output_format: str = "png",
) -> str:
    """텍스트 설명만으로 새 이미지를 생성합니다.

    Args:
        prompt: 만들고 싶은 이미지에 대한 상세한 설명.
        size: 이미지 크기 (예: "1024x1024", "auto").
        quality: 이미지 품질 ("low", "medium", "high", "auto").
        n: 생성할 이미지 개수 (1~4).
        output_format: 저장 형식 ("png", "webp", "jpeg").
    """
    client, err = _get_client()
    if err:
        return err

    try:
        result = client.images.generate(
            model=MODEL_NAME,
            prompt=prompt,
            size=size,
            quality=quality,
            n=max(1, min(n, 4)),
            output_format=output_format,
        )
    except Exception as exc:
        return _format_openai_error(exc)

    saved = _save_images(result, output_format, prompt, operation="generate")
    return _format_success(saved)


@mcp.tool()
def edit_image(
    prompt: str,
    image_paths: list[str],
    mask_path: str | None = None,
    size: str = "auto",
    quality: str = "auto",
    output_format: str = "png",
) -> str:
    """기존 이미지를 설명에 따라 수정하거나, 여러 이미지를 참고해 새 이미지로 합성합니다.

    Args:
        prompt: 수정/합성하고 싶은 내용에 대한 상세한 설명.
        image_paths: 원본으로 사용할 이미지 파일 경로 목록 (1개=수정, 2개 이상=합성).
        mask_path: 수정할 영역을 투명하게 표시한 마스크 PNG 경로 (선택, 단일 이미지 수정 시에만 사용).
        size: 이미지 크기 (예: "1024x1024", "auto").
        quality: 이미지 품질 ("low", "medium", "high", "auto").
        output_format: 저장 형식 ("png", "webp", "jpeg").
    """
    client, err = _get_client()
    if err:
        return err

    if not image_paths:
        return "수정/합성할 이미지 경로가 최소 1개 필요합니다."

    missing = [p for p in image_paths if not Path(p).is_file()]
    if missing:
        return f"다음 이미지 파일을 찾을 수 없습니다: {', '.join(missing)}"

    if mask_path and not Path(mask_path).is_file():
        return f"마스크 파일을 찾을 수 없습니다: {mask_path}"

    try:
        with ExitStack() as stack:
            opened_images = [
                stack.enter_context(open(p, "rb")) for p in image_paths
            ]
            kwargs = dict(
                model=MODEL_NAME,
                image=opened_images if len(opened_images) > 1 else opened_images[0],
                prompt=prompt,
                size=size,
                quality=quality,
                output_format=output_format,
            )
            if mask_path:
                kwargs["mask"] = stack.enter_context(open(mask_path, "rb"))
            result = client.images.edit(**kwargs)
    except Exception as exc:
        return _format_openai_error(exc)

    operation = "composite" if len(image_paths) > 1 else "edit"
    saved = _save_images(result, output_format, prompt, operation=operation)
    return _format_success(saved)


# ---------------------------------------------------------------------------
# 데이터 (Resources)
# ---------------------------------------------------------------------------


@mcp.resource("images://recent")
def list_recent_images() -> str:
    """최근 생성/편집된 이미지 목록 (최대 20개, 최신순)을 반환합니다."""
    history = _load_history()
    recent = list(reversed(history))[:MAX_RECENT_LIST]
    return json.dumps(recent, ensure_ascii=False, indent=2)


@mcp.resource("config://server")
def get_server_config() -> str:
    """현재 서버 설정값(모델, 저장 경로, 이력 관리 정책 등)을 반환합니다."""
    load_dotenv(ENV_PATH, override=True)
    config = {
        "server_name": "gpt-image-mcp",
        "model": MODEL_NAME,
        "images_dir": str(IMAGES_DIR),
        "history_path": str(HISTORY_PATH),
        "max_history": MAX_HISTORY,
        "max_recent_list": MAX_RECENT_LIST,
        "api_key_configured": bool(os.environ.get("OPENAI_API_KEY", "").strip()),
        "history_count": len(_load_history()),
    }
    return json.dumps(config, ensure_ascii=False, indent=2)


# ---------------------------------------------------------------------------
# 프롬프트 (Prompts)
# ---------------------------------------------------------------------------


@mcp.prompt()
def textbook_illustration_style(topic: str) -> str:
    """교재·보고서에 어울리는 심플한 일러스트 스타일 프롬프트를 만들어 줍니다."""
    return (
        f"{topic}을(를) 표현하는 교재/보고서용 일러스트. "
        "플랫 디자인, 단순한 도형과 선, 차분한 파스텔 색상 팔레트, "
        "불필요한 디테일 없이 핵심 개념을 명확하게 전달하는 구도. "
        "배경은 단색 또는 아주 옅은 그라데이션."
    )


@mcp.prompt()
def technical_diagram_style(topic: str) -> str:
    """기술 다이어그램·설계도 스타일 프롬프트를 만들어 줍니다."""
    return (
        f"{topic}에 대한 기술 다이어그램/설계도. "
        "깔끔한 벡터 라인 드로잉, 화이트보드 또는 청사진(blueprint) 스타일, "
        "구성 요소 간 화살표와 라벨로 흐름과 관계를 명확히 표시, "
        "모노톤 또는 2~3색으로 제한된 색상, 격자 배경."
    )


@mcp.prompt()
def photorealistic_style(subject: str) -> str:
    """사진처럼 사실적인 이미지 스타일 프롬프트를 만들어 줍니다."""
    return (
        f"{subject}를 담은 사진처럼 사실적인 이미지. "
        "자연광 또는 스튜디오 조명, 실제 카메라로 촬영한 듯한 심도(depth of field), "
        "고해상도 질감 표현, 과장되지 않은 자연스러운 색감과 구도."
    )


# ---------------------------------------------------------------------------
# 엔트리 포인트
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    mcp.run(transport="stdio")
