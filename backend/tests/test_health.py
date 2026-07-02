def test_health_ok(client):
    resp = client.get("/api/health")
    assert resp.status_code == 200
    assert resp.json() == {"status": "ok", "service": "turismo-api"}


def test_raiz_retorna_json(client):
    resp = client.get("/")
    assert resp.status_code == 200
    assert resp.json() == {"message": "Projeto Turismo do Al-Diesel"}
