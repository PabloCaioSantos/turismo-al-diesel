def test_lista_categorias(client):
    resp = client.get("/api/categorias")
    assert resp.status_code == 200
    cats = resp.json()
    assert len(cats) == 6
    slugs = [c["slug"] for c in cats]
    assert slugs == ["praias", "trilhas", "museus", "gastronomia", "historicos", "ecoturismo"]
    assert all("label" in c for c in cats)
    assert all(isinstance(c["id"], int) for c in cats)


def test_passeios_por_categoria(client):
    resp = client.get("/api/categorias/praias/passeios")
    assert resp.status_code == 200
    passeios = resp.json()
    assert len(passeios) > 0
    assert all("praias" in p["categorias"] for p in passeios)


def test_cada_categoria_tem_ao_menos_5_passeios(client):
    cats = client.get("/api/categorias").json()
    for c in cats:
        passeios = client.get(f"/api/categorias/{c['slug']}/passeios").json()
        assert len(passeios) >= 5, f"categoria {c['slug']} tem só {len(passeios)}"


def test_passeios_por_categoria_via_id(client):
    cats = client.get("/api/categorias").json()
    praias = next(c for c in cats if c["slug"] == "praias")
    por_id = client.get(f"/api/categorias/{praias['id']}/passeios").json()
    por_slug = client.get("/api/categorias/praias/passeios").json()
    assert por_id == por_slug
    assert len(por_id) > 0


def test_categoria_invalida_404(client):
    resp = client.get("/api/categorias/inexistente/passeios")
    assert resp.status_code == 404
