def _payload():
    return {
        "itens": [
            {
                "passeioId": 1,
                "quantidade": 2,
                "snapshot": {"nome": "Praia do Forte", "valorEstimado": 120},
            },
            {
                "passeioId": 6,
                "quantidade": 1,
                "snapshot": {"nome": "Pedra da Gávea", "valorEstimado": 60},
            },
        ]
    }


def test_criar_reserva_requer_auth(client):
    assert client.post("/api/reservas", json=_payload()).status_code == 401


def test_criar_e_listar(client, auth_headers):
    resp = client.post("/api/reservas", headers=auth_headers, json=_payload())
    assert resp.status_code == 201, resp.text
    reserva = resp.json()
    assert reserva["id"].startswith("RES-")
    assert reserva["total"] == 120 * 2 + 60
    assert len(reserva["itens"]) == 2
    assert reserva["itens"][0]["passeioId"] == 1

    lista = client.get("/api/reservas", headers=auth_headers)
    assert lista.status_code == 200
    assert len(lista.json()) == 1


def test_reserva_vazia_400(client, auth_headers):
    resp = client.post("/api/reservas", headers=auth_headers, json={"itens": []})
    assert resp.status_code == 400


def test_reservas_sao_por_usuario(client, auth_headers):
    client.post("/api/reservas", headers=auth_headers, json=_payload())
    outro = client.post(
        "/api/auth/register",
        json={
            "username": "joao",
            "fullname": "João Lima",
            "email": "joao@example.com",
            "password": "Str0ng!Pass",
            "cpf": "111.444.777-35",
        },
    )
    assert outro.status_code == 201
    headers2 = {"Authorization": f"Bearer {outro.json()['token']}"}
    assert client.get("/api/reservas", headers=headers2).json() == []
