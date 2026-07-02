from fastapi import HTTPException, status
from sqlmodel import Session

from .. import repository
from ..utils.models import passeio_dto

_POPULARES_LIMITE = 5


def listar(
    session: Session,
    categorias: str | None = None,
    excluir: int | None = None,
    limite: int | None = None,
) -> list[dict]:
    passeios = repository.list_passeios(session)
    if categorias:
        desejadas = {c.strip() for c in categorias.split(",") if c.strip()}
        passeios = [p for p in passeios if desejadas & set(p.categorias)]
    if excluir is not None:
        passeios = [p for p in passeios if p.id != excluir]
    if limite is not None and limite >= 0:
        passeios = passeios[:limite]
    return [passeio_dto(p) for p in passeios]


def populares(session: Session) -> list[dict]:
    passeios = repository.list_passeios(session)
    top = sorted(passeios, key=lambda p: p.nota, reverse=True)[:_POPULARES_LIMITE]
    return [passeio_dto(p) for p in top]


def detalhe(session: Session, passeio_id: int) -> dict:
    passeio = repository.get_passeio(session, passeio_id)
    if passeio is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Passeio não encontrado")
    return passeio_dto(passeio)
