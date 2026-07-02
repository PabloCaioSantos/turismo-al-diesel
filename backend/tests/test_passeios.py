def test_lista_todos(client):
    resp = client.get("/api/passeios")
    assert resp.status_code == 200
    assert len(resp.json()) == 14


def test_filtro_limite(client):
    resp = client.get("/api/passeios", params={"limite": 5})
    assert resp.status_code == 200
    assert len(resp.json()) == 5


def test_filtro_categorias(client):
    resp = client.get("/api/passeios", params={"categorias": "museus"})
    assert resp.status_code == 200
    passeios = resp.json()
    assert len(passeios) > 0
    assert all("museus" in p["categorias"] for p in passeios)


def test_filtro_excluir(client):
    resp = client.get("/api/passeios", params={"excluir": 1, "limite": 100})
    assert resp.status_code == 200
    assert all(p["id"] != 1 for p in resp.json())


def test_populares_ordenado_por_nota(client):
    resp = client.get("/api/passeios/populares")
    assert resp.status_code == 200
    populares = resp.json()
    assert len(populares) == 5
    notas = [p["nota"] for p in populares]
    assert notas == sorted(notas, reverse=True)


def test_detalhe_dto_completo(client):
    resp = client.get("/api/passeios/1")
    assert resp.status_code == 200
    p = resp.json()
    assert p["id"] == 1
    assert p["nome"] == "Praia da Lagoinha"
    assert p["categoria"] == "praias"
    assert "praias" in p["categorias"]
    assert p["valorEstimado"] == 120
    assert p["numAvaliacoes"] == 512
    assert len(p["galeria"]) >= 1
    assert p["local"]["endereco"].startswith("Lagoinha")
    assert "lat" in p["local"] and "lng" in p["local"]


def test_detalhe_inexistente_404(client):
    resp = client.get("/api/passeios/9999")
    assert resp.status_code == 404
