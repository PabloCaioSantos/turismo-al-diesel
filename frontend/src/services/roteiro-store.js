import { readJSON, writeJSON } from "../utils/storage.js";

const KEY = "roteiro-itens";

export function getItens() {
  return readJSON(KEY, []);
}

export function addItem(passeio) {
  const itens = getItens();
  const existente = itens.find((i) => i.passeioId === passeio.id);
  if (existente) {
    existente.quantidade += 1;
  } else {
    itens.push({ passeioId: passeio.id, quantidade: 1, snapshot: passeio });
  }
  writeJSON(KEY, itens);
}

export function updateQuantidade(passeioId, quantidade) {
  let itens = getItens();
  if (quantidade <= 0) {
    itens = itens.filter((i) => i.passeioId !== passeioId);
  } else {
    const item = itens.find((i) => i.passeioId === passeioId);
    if (item) item.quantidade = quantidade;
  }
  writeJSON(KEY, itens);
  return itens;
}

export function removeItem(passeioId) {
  const itens = getItens().filter((i) => i.passeioId !== passeioId);
  writeJSON(KEY, itens);
}

export function countItens() {
  return getItens().reduce((acc, i) => acc + i.quantidade, 0);
}

export function clearRoteiro() {
  writeJSON(KEY, []);
}
