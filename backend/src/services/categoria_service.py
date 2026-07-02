from fastapi import HTTPException, status
from sqlmodel import Session

from .. import repository
from ..utils.models import categoria_dto, passeio_dto


def listar(session: Session) -> list[dict]:
    return [categoria_dto(c) for c in repository.list_categorias(session)]


def passeios_da_categoria(session: Session, ref: str) -> list[dict]:
    categoria = repository.get_categoria(session, ref)
    if categoria is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Categoria não encontrada")
    passeios = repository.list_passeios(session)
    return [passeio_dto(p) for p in passeios if categoria.slug in p.categorias]
