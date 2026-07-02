from datetime import UTC, datetime


def now_iso() -> str:
    return datetime.now(UTC).isoformat()


def gerar_reserva_id() -> str:
    return "RES-" + datetime.now(UTC).strftime("%Y%m%d%H%M%S%f")
