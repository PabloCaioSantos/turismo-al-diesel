import os
from pathlib import Path

_BASE_DIR = Path(__file__).resolve().parent.parent

DEFAULT_DB_PATH = _BASE_DIR / "data.db"
DATABASE_URL: str = os.environ.get("DATABASE_URL", f"sqlite:///{DEFAULT_DB_PATH}")


_default_origins = "http://localhost:5173,http://127.0.0.1:5173"
CORS_ORIGINS: list[str] = [
    o.strip() for o in os.environ.get("CORS_ORIGINS", _default_origins).split(",") if o.strip()
]
