from sqlmodel import Session, select

from .utils.models import Categoria, Passeio, Reserva, ReservaItem, Usuario


def list_passeios(session: Session) -> list[Passeio]:
    return list(session.exec(select(Passeio)).all())


def get_passeio(session: Session, passeio_id: int) -> Passeio | None:
    return session.get(Passeio, passeio_id)


def list_categorias(session: Session) -> list[Categoria]:
    return list(session.exec(select(Categoria).order_by(Categoria.id)).all())


def get_categoria(session: Session, ref: str) -> Categoria | None:
    if ref.isdigit():
        return session.get(Categoria, int(ref))
    return session.exec(select(Categoria).where(Categoria.slug == ref)).first()


def find_user_by_email(session: Session, email: str) -> Usuario | None:
    return session.exec(select(Usuario).where(Usuario.email == email)).first()


def save_user(session: Session, user: Usuario) -> Usuario:
    session.add(user)
    session.commit()
    session.refresh(user)
    return user


def list_reservas(session: Session, usuario_id: int) -> list[Reserva]:
    reservas = list(session.exec(select(Reserva).where(Reserva.usuario_id == usuario_id)).all())
    reservas.sort(key=lambda r: r.data, reverse=True)
    return reservas


def reserva_itens(session: Session, reserva_id: str) -> list[ReservaItem]:
    return list(session.exec(select(ReservaItem).where(ReservaItem.reserva_id == reserva_id)).all())


def create_reserva(session: Session, reserva: Reserva, itens: list[ReservaItem]) -> None:
    session.add(reserva)
    for item in itens:
        session.add(item)
    session.commit()
