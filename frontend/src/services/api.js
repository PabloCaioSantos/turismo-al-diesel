import { readJSON } from "../utils/storage.js";

const API_URL = "http://localhost:3000";
const KEY_TOKEN = "auth-token";

async function request(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;
  const token = readJSON(KEY_TOKEN, null);

  const config = {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  };

  if (options.body) {
    config.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(url, config);

    const texto = await response.text();
    const dados = texto ? JSON.parse(texto) : null;

    if (!response.ok) {
      const detalhe = dados && (dados.detail || dados.message);
      throw new Error(typeof detalhe === "string" ? detalhe : `Erro HTTP ${response.status}`);
    }

    return dados;
  } catch (erro) {
    console.error(`❌ Erro em ${config.method} ${endpoint}:`, erro.message);
    throw erro;
  }
}

export async function get(endpoint) {
  return request(endpoint, { method: "GET" });
}

export async function post(endpoint, body) {
  return request(endpoint, { method: "POST", body });
}

export async function put(endpoint, body) {
  return request(endpoint, { method: "PUT", body });
}

export async function del(endpoint) {
  return request(endpoint, { method: "DELETE" });
}

export default { get, post, put, del };
