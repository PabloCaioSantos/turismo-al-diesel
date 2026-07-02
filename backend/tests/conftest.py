import pytest
from fastapi.testclient import TestClient

from src.main import create_app

VALID_CPF = "111.444.777-35"
STRONG_PASSWORD = "Str0ng!Pass"


@pytest.fixture
def client() -> TestClient:
    app = create_app("sqlite://")
    return TestClient(app)


@pytest.fixture
def creds() -> dict:
    return {
        "username": "maria",
        "fullname": "Maria Alves",
        "email": "maria@example.com",
        "password": STRONG_PASSWORD,
        "cpf": VALID_CPF,
    }


@pytest.fixture
def auth_headers(client: TestClient, creds: dict) -> dict:
    resp = client.post("/api/auth/register", json=creds)
    assert resp.status_code == 201, resp.text
    token = resp.json()["token"]
    return {"Authorization": f"Bearer {token}"}
