import base64
import re

from fastapi import Depends, Header, HTTPException, status
from sqlmodel import Session

from .db import get_session
from .models import Usuario


def hash_password(password: str) -> str:
    return base64.b64encode(password.encode()).decode()


def verify_password(password: str, stored: str) -> bool:
    return hash_password(password) == stored


def create_token(user_id: int) -> str:
    return base64.urlsafe_b64encode(str(user_id).encode()).decode()


def parse_token(token: str) -> int | None:
    try:
        return int(base64.urlsafe_b64decode(token.encode()).decode())
    except ValueError:
        return None


def get_current_user(
    authorization: str | None = Header(default=None),
    session: Session = Depends(get_session),
) -> Usuario:
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Não autenticado")
    token = authorization.split(" ", 1)[1].strip()
    user_id = parse_token(token)
    if user_id is None:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Token inválido")
    user = session.get(Usuario, user_id)
    if user is None:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Usuário não encontrado")
    return user


_SEQUENCES = [
    "0123",
    "1234",
    "2345",
    "3456",
    "4567",
    "5678",
    "6789",
    "012",
    "123",
    "234",
    "345",
    "456",
    "567",
    "678",
    "789",
    "0987",
    "1098",
    "2109",
    "3210",
    "4321",
    "5432",
    "6543",
    "7654",
    "8765",
    "9876",
    "098",
    "109",
    "210",
    "321",
    "432",
    "543",
    "654",
    "765",
    "876",
    "987",
]


def only_digits(value: str) -> str:
    return re.sub(r"\D", "", str(value))


def has_sequence(value: str) -> bool:
    normalized = only_digits(value)
    if re.search(r"\d{3,}", normalized) and re.search(r"(\d)\1{2,}", normalized):
        return True
    return any(seq in normalized for seq in _SEQUENCES)


def is_valid_cpf(cpf: str) -> bool:
    if len(cpf) != 11 or not cpf.isdigit():
        return False
    if cpf == cpf[0] * 11:
        return False
    soma = sum(int(cpf[i]) * (10 - i) for i in range(9))
    d1 = (soma * 10) % 11
    if d1 == 10:
        d1 = 0
    if d1 != int(cpf[9]):
        return False
    soma = sum(int(cpf[i]) * (11 - i) for i in range(10))
    d2 = (soma * 10) % 11
    if d2 == 10:
        d2 = 0
    return d2 == int(cpf[10])


def check_password(value: str) -> dict[str, bool]:
    return {
        "length": len(value) >= 8,
        "uppercase": bool(re.search(r"[A-Z]", value)),
        "lowercase": bool(re.search(r"[a-z]", value)),
        "number": bool(re.search(r"\d", value)),
        "special": bool(re.search(r"[^A-Za-z0-9]", value)),
        "sequence": not has_sequence(value),
    }


def is_strong_password(value: str) -> bool:
    return all(check_password(value).values())
