from typing import Any

from pydantic import BaseModel
from sqlalchemy import JSON, Column
from sqlmodel import Field, SQLModel


class Categoria(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    slug: str = Field(index=True, unique=True)
    label: str


class Passeio(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    nome: str
    categorias: list[str] = Field(default_factory=list, sa_column=Column(JSON))
    imagem: str
    galeria: list[str] = Field(default_factory=list, sa_column=Column(JSON))
    valor_estimado: float
    descricao: str
    detalhes: str = ""
    duracao: str = ""
    nota: float = 0.0
    num_avaliacoes: int = 0
    local_endereco: str = ""
    local_lat: float = 0.0
    local_lng: float = 0.0


class Usuario(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    username: str
    fullname: str
    email: str = Field(index=True, unique=True)
    cpf: str
    senha_hash: str
    foto: str | None = None


class Reserva(SQLModel, table=True):
    id: str = Field(primary_key=True)
    usuario_id: int = Field(index=True, foreign_key="usuario.id")
    data: str
    total: float


class ReservaItem(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    reserva_id: str = Field(index=True, foreign_key="reserva.id")
    passeio_id: int
    quantidade: int
    snapshot: dict = Field(default_factory=dict, sa_column=Column(JSON))


class RegisterIn(BaseModel):
    username: str
    fullname: str
    email: str
    password: str
    cpf: str


class LoginIn(BaseModel):
    email: str
    password: str


class UpdateUserIn(BaseModel):
    username: str
    fullname: str
    email: str
    cpf: str
    foto: str | None = None
    password: str | None = None


class ReservaItemIn(BaseModel):
    passeioId: int
    quantidade: int
    snapshot: dict[str, Any] = {}


class ReservaIn(BaseModel):
    itens: list[ReservaItemIn]


def categoria_dto(c: Categoria) -> dict[str, Any]:
    return {"id": c.id, "slug": c.slug, "label": c.label}


def passeio_dto(p: Passeio) -> dict[str, Any]:
    return {
        "id": p.id,
        "nome": p.nome,
        "categoria": p.categorias[0] if p.categorias else None,
        "categorias": p.categorias,
        "imagem": p.imagem,
        "galeria": p.galeria,
        "valorEstimado": p.valor_estimado,
        "descricao": p.descricao,
        "detalhes": p.detalhes,
        "duracao": p.duracao,
        "nota": p.nota,
        "numAvaliacoes": p.num_avaliacoes,
        "local": {
            "endereco": p.local_endereco,
            "lat": p.local_lat,
            "lng": p.local_lng,
        },
    }


def usuario_dto(u: Usuario) -> dict[str, Any]:
    return {
        "username": u.username,
        "fullname": u.fullname,
        "email": u.email,
        "cpf": u.cpf,
        "foto": u.foto,
    }


def reserva_item_dto(i: ReservaItem) -> dict[str, Any]:
    return {"passeioId": i.passeio_id, "quantidade": i.quantidade, "snapshot": i.snapshot}


def reserva_dto(r: Reserva, itens: list[ReservaItem]) -> dict[str, Any]:
    return {
        "id": r.id,
        "data": r.data,
        "total": r.total,
        "itens": [reserva_item_dto(i) for i in itens],
    }
