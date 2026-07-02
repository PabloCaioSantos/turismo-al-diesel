from fastapi import APIRouter, Depends
from sqlmodel import Session

from ..services import passeio_service
from ..utils.db import get_session

router = APIRouter(prefix="/api/passeios", tags=["passeios"])


@router.get("")
def listar_passeios(
    categorias: str | None = None,
    excluir: int | None = None,
    limite: int | None = None,
    session: Session = Depends(get_session),
):
    return passeio_service.listar(session, categorias, excluir, limite)


@router.get("/populares")
def passeios_populares(session: Session = Depends(get_session)):
    return passeio_service.populares(session)


@router.get("/{passeio_id}")
def detalhe_passeio(passeio_id: int, session: Session = Depends(get_session)):
    return passeio_service.detalhe(session, passeio_id)
