from fastapi import HTTPException, status
from sqlmodel import Session

from .. import repository
from ..utils.auth import (
    create_token,
    hash_password,
    is_strong_password,
    is_valid_cpf,
    only_digits,
    verify_password,
)
from ..utils.models import LoginIn, RegisterIn, UpdateUserIn, Usuario, usuario_dto

WEAK_PASSWORD_MSG = (
    "A senha não atende aos requisitos (8+ caracteres, maiúscula, minúscula, "
    "número, especial e sem sequências)."
)


def normalize_email(email: str) -> str:
    return email.strip().lower()


def _validate(email: str, cpf: str, password: str | None) -> str:
    if not email:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "E-mail é obrigatório")
    if not is_valid_cpf(only_digits(cpf)):
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "CPF inválido")
    if password is not None and not is_strong_password(password):
        raise HTTPException(status.HTTP_400_BAD_REQUEST, WEAK_PASSWORD_MSG)
    return normalize_email(email)


def _require_names(body) -> None:
    if not body.username.strip() or not body.fullname.strip():
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Usuário e nome são obrigatórios")


def register(session: Session, body: RegisterIn) -> dict:
    email = _validate(body.email, body.cpf, body.password)
    _require_names(body)
    if repository.find_user_by_email(session, email) is not None:
        raise HTTPException(status.HTTP_409_CONFLICT, "E-mail já cadastrado")
    user = Usuario(
        username=body.username.strip(),
        fullname=body.fullname.strip(),
        email=email,
        cpf=body.cpf.strip(),
        senha_hash=hash_password(body.password),
    )
    repository.save_user(session, user)
    return {"user": usuario_dto(user), "token": create_token(user.id)}


def login(session: Session, body: LoginIn) -> dict:
    user = repository.find_user_by_email(session, normalize_email(body.email))
    if user is None or not verify_password(body.password, user.senha_hash):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "E-mail ou senha incorretos")
    return {"user": usuario_dto(user), "token": create_token(user.id)}


def update_profile(session: Session, current_user: Usuario, body: UpdateUserIn) -> dict:
    email = _validate(body.email, body.cpf, body.password)
    _require_names(body)
    if email != current_user.email and repository.find_user_by_email(session, email) is not None:
        raise HTTPException(status.HTTP_409_CONFLICT, "E-mail já cadastrado")
    current_user.username = body.username.strip()
    current_user.fullname = body.fullname.strip()
    current_user.email = email
    current_user.cpf = body.cpf.strip()
    current_user.foto = body.foto
    if body.password:
        current_user.senha_hash = hash_password(body.password)
    repository.save_user(session, current_user)
    return usuario_dto(current_user)
