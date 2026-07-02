from fastapi import APIRouter, Depends, status
from sqlmodel import Session

from ..services import account_service
from ..utils.auth import get_current_user
from ..utils.db import get_session
from ..utils.models import LoginIn, RegisterIn, UpdateUserIn, Usuario, usuario_dto

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(body: RegisterIn, session: Session = Depends(get_session)):
    return account_service.register(session, body)


@router.post("/login")
def login(body: LoginIn, session: Session = Depends(get_session)):
    return account_service.login(session, body)


@router.get("/me")
def me(current_user: Usuario = Depends(get_current_user)):
    return usuario_dto(current_user)


@router.put("/me")
def update_me(
    body: UpdateUserIn,
    current_user: Usuario = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    return account_service.update_profile(session, current_user, body)
