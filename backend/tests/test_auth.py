def test_register_retorna_user_e_token(client, creds):
    resp = client.post("/api/auth/register", json=creds)
    assert resp.status_code == 201, resp.text
    body = resp.json()
    assert body["token"]
    assert body["user"]["email"] == "maria@example.com"
    assert "password" not in body["user"]
    assert "senha_hash" not in body["user"]


def test_register_email_duplicado_409(client, creds):
    assert client.post("/api/auth/register", json=creds).status_code == 201
    assert client.post("/api/auth/register", json=creds).status_code == 409


def test_register_cpf_invalido_400(client, creds):
    creds["cpf"] = "123.456.789-00"
    assert client.post("/api/auth/register", json=creds).status_code == 400


def test_register_senha_fraca_400(client, creds):
    creds["password"] = "fraca"
    assert client.post("/api/auth/register", json=creds).status_code == 400


def test_login_ok(client, creds):
    client.post("/api/auth/register", json=creds)
    resp = client.post(
        "/api/auth/login", json={"email": creds["email"], "password": creds["password"]}
    )
    assert resp.status_code == 200
    assert resp.json()["token"]


def test_login_senha_errada_401(client, creds):
    client.post("/api/auth/register", json=creds)
    resp = client.post("/api/auth/login", json={"email": creds["email"], "password": "Outr0!Senha"})
    assert resp.status_code == 401


def test_login_email_desconhecido_401(client):
    resp = client.post("/api/auth/login", json={"email": "ninguem@example.com", "password": "x"})
    assert resp.status_code == 401


def test_me_requer_token(client):
    assert client.get("/api/auth/me").status_code == 401
    assert (
        client.get("/api/auth/me", headers={"Authorization": "Bearer invalido"}).status_code == 401
    )


def test_me_com_token(client, auth_headers):
    resp = client.get("/api/auth/me", headers=auth_headers)
    assert resp.status_code == 200
    assert resp.json()["username"] == "maria"


def test_atualiza_perfil(client, auth_headers, creds):
    creds["fullname"] = "Maria Souza"
    creds["foto"] = "data:image/png;base64,AAAA"
    resp = client.put("/api/auth/me", headers=auth_headers, json=creds)
    assert resp.status_code == 200, resp.text
    assert resp.json()["fullname"] == "Maria Souza"
    assert resp.json()["foto"] == "data:image/png;base64,AAAA"
