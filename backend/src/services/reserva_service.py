from fastapi import HTTPException, status
from sqlmodel import Session

from .. import repository
from ..utils.clock import gerar_reserva_id, now_iso
from ..utils.models import Reserva, ReservaIn, ReservaItem, reserva_dto


def listar(session: Session, usuario_id: int) -> list[dict]:
    reservas = repository.list_reservas(session, usuario_id)
    return [reserva_dto(r, repository.reserva_itens(session, r.id)) for r in reservas]


def criar(session: Session, usuario_id: int, body: ReservaIn) -> dict:
    if not body.itens:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Nenhum passeio na reserva")
    total = sum(float(i.snapshot.get("valorEstimado", 0) or 0) * i.quantidade for i in body.itens)
    reserva = Reserva(id=gerar_reserva_id(), usuario_id=usuario_id, data=now_iso(), total=total)
    itens = [
        ReservaItem(
            reserva_id=reserva.id,
            passeio_id=i.passeioId,
            quantidade=i.quantidade,
            snapshot=i.snapshot,
        )
        for i in body.itens
    ]
    repository.create_reserva(session, reserva, itens)
    return reserva_dto(reserva, repository.reserva_itens(session, reserva.id))
