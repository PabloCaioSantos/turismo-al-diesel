import { readJSON, writeJSON, removeKey } from "../utils/storage.js";
import { get, post, put } from "./api.js";

const KEY_TOKEN = "auth-token";
const KEY_USER = "auth-usuario";

function salvarSessao(user, token) {
  writeJSON(KEY_USER, user);
  writeJSON(KEY_TOKEN, token);
}

export function getToken() {
  return readJSON(KEY_TOKEN, null);
}

export function estaLogado() {
  return getToken() !== null;
}

export function getUsuario() {
  return readJSON(KEY_USER, null);
}

export function getUsuarioLogado() {
  return estaLogado() ? getUsuario() : null;
}

export async function registrar(dados) {
  const { user, token } = await post("/api/auth/register", dados);
  salvarSessao(user, token);
  return user;
}

export async function login(email, password) {
  const { user, token } = await post("/api/auth/login", { email, password });
  salvarSessao(user, token);
  return user;
}

export async function getPerfil() {
  const user = await get("/api/auth/me");
  writeJSON(KEY_USER, user);
  return user;
}

export async function atualizarPerfil(dados) {
  const user = await put("/api/auth/me", dados);
  writeJSON(KEY_USER, user);
  return user;
}

export function logout() {
  removeKey(KEY_TOKEN);
  removeKey(KEY_USER);
}
