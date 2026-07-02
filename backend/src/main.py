from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routes import auth, categorias, health, passeios, reservas
from .utils import config
from .utils.db import init_db, make_engine


def create_app(database_url: str | None = None) -> FastAPI:
    engine = make_engine(database_url or config.DATABASE_URL)
    init_db(engine)

    app = FastAPI(title="Projeto Turismo do Al-Diesel", version="0.1.0")
    app.state.engine = engine

    app.add_middleware(
        CORSMiddleware,
        allow_origins=config.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    for modulo in (health, categorias, passeios, auth, reservas):
        app.include_router(modulo.router)

    return app


app = create_app()
