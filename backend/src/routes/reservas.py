from fastapi import APIRouter, Depends, status
from sqlmodel import Session

from ..services import reserva_service
from ..utils.auth import get_current_user
from ..utils.db import get_session
from ..utils.models import ReservaIn, Usuario

router = APIRouter(prefix="/api/reservas", tags=["reservas"])


@router.get("")
def listar_reservas(
    usuario: Usuario = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    return reserva_service.listar(session, usuario.id)


@router.post("", status_code=status.HTTP_201_CREATED)
def criar_reserva(
    body: ReservaIn,
    usuario: Usuario = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    return reserva_service.criar(session, usuario.id, body)
