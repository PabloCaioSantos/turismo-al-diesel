from fastapi import APIRouter

router = APIRouter(tags=["health"])


@router.get("/")
def raiz():
    return {"message": "Projeto Turismo do Al-Diesel"}


@router.get("/api/health")
def health():
    return {"status": "ok", "service": "turismo-api"}
