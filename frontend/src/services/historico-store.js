import { get, post } from "./api.js";

export async function getHistorico() {
  return get("/api/reservas");
}

export async function adicionarReserva(itens) {
  return post("/api/reservas", { itens });
}
