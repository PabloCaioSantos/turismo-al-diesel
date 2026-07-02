from collections.abc import Iterator

from fastapi import Request
from sqlalchemy import Engine, create_engine
from sqlalchemy.pool import StaticPool
from sqlmodel import Session, SQLModel, select

from .models import Passeio

_IN_MEMORY = {"sqlite://", "sqlite:///:memory:"}


def make_engine(database_url: str) -> Engine:
    kwargs: dict = {}
    if database_url.startswith("sqlite"):
        kwargs["connect_args"] = {"check_same_thread": False}
    if database_url in _IN_MEMORY:
        kwargs["poolclass"] = StaticPool
    return create_engine(database_url, **kwargs)


def init_db(engine: Engine) -> None:
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        _seed_if_empty(session)


def _seed_if_empty(session: Session) -> None:
    if session.exec(select(Passeio).limit(1)).first() is not None:
        return
    from .seed import build_categorias, build_passeios

    for categoria in build_categorias():
        session.add(categoria)
    for passeio in build_passeios():
        session.add(passeio)
    session.commit()


def get_session(request: Request) -> Iterator[Session]:
    engine: Engine = request.app.state.engine
    with Session(engine) as session:
        yield session
