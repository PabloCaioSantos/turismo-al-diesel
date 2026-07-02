from fastapi import APIRouter, Depends
from sqlmodel import Session

from ..services import categoria_service
from ..utils.db import get_session

router = APIRouter(prefix="/api/categorias", tags=["categorias"])


@router.get("")
def listar_categorias(session: Session = Depends(get_session)):
    return categoria_service.listar(session)


@router.get("/{categoria}/passeios")
def passeios_por_categoria(categoria: str, session: Session = Depends(get_session)):
    return categoria_service.passeios_da_categoria(session, categoria)
