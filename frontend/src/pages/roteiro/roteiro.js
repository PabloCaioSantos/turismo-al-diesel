import { mountHeader } from "../../components/header/header.js";
import { mountFooter } from "../../components/footer/footer.js";
import {
  getItens,
  updateQuantidade,
  removeItem,
  clearRoteiro,
} from "../../services/roteiro-store.js";
import { qs, showEmptyState } from "../../utils/dom.js";
import { formatMoeda } from "../../utils/format.js";
import { estaLogado } from "../../services/auth-store.js";
import { adicionarReserva } from "../../services/historico-store.js";

async function init() {
  mountHeader(document.querySelector("#app-header"), { activePage: "roteiro" });
  mountFooter(document.querySelector("#app-footer"));

  const container = qs("#roteiro-container");
  const itens = getItens();

  if (itens.length === 0) {
    showEmptyState(
      container,
      "Você ainda não adicionou nenhum passeio ao seu roteiro. Explore as categorias e reserve seus passeios favoritos!",
    );
    return;
  }

  renderTabela(container, itens);
  renderTotal(container, itens);
  renderBotoes(container);
  setupListeners();
}

function renderTabela(container, itens) {
  const table = document.createElement("div");
  table.className = "roteiro__tabela";

  const cabecalho = document.createElement("div");
  cabecalho.className = "roteiro__linha roteiro__linha--cabecalho";
  cabecalho.innerHTML = `
    <div class="roteiro__celula">Imagem</div>
    <div class="roteiro__celula">Descrição</div>
    <div class="roteiro__celula">Valor Unit.</div>
    <div class="roteiro__celula">Quantidade</div>
    <div class="roteiro__celula">Total</div>
    <div class="roteiro__celula">Ações</div>
  `;
  table.appendChild(cabecalho);

  itens.forEach((item) => {
    const passeio = item.snapshot;
    const valorTotal = passeio.valorEstimado * item.quantidade;

    const linha = document.createElement("div");
    linha.className = "roteiro__linha";
    linha.dataset.id = item.passeioId;
    linha.innerHTML = `
      <div class="roteiro__celula">
        <img src="${passeio.imagem}" alt="${passeio.nome}" class="roteiro__imagem" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=100&q=80'" />
      </div>
      <div class="roteiro__celula">
        <div class="roteiro__nome">${passeio.nome}</div>
        <div class="roteiro__categoria">${passeio.categoria}</div>
      </div>
      <div class="roteiro__celula"><span class="roteiro__valor">${formatMoeda(passeio.valorEstimado)}</span></div>
      <div class="roteiro__celula">
        <input type="number" class="roteiro__input-quantidade" data-id="${item.passeioId}" value="${item.quantidade}" min="0" max="99" />
      </div>
      <div class="roteiro__celula"><span class="roteiro__valor-total">${formatMoeda(valorTotal)}</span></div>
      <div class="roteiro__celula">
        <button class="btn btn--danger btn--sm roteiro__btn-remover" data-id="${item.passeioId}" type="button">Remover</button>
      </div>
    `;
    table.appendChild(linha);
  });

  container.appendChild(table);
}

function renderTotal(container, itens) {
  const qtdTotal = itens.reduce((acc, i) => acc + i.quantidade, 0);
  const valorTotal = itens.reduce((acc, i) => acc + i.snapshot.valorEstimado * i.quantidade, 0);
  const pluralLabel = qtdTotal === 1 ? "item" : "itens";

  const resumo = document.createElement("div");
  resumo.className = "roteiro__resumo";
  resumo.innerHTML = `
    <div class="roteiro__resumo-linha">
      <span>Total de passeios:</span>
      <span>${qtdTotal} ${pluralLabel}</span>
    </div>
    <div class="roteiro__resumo-linha roteiro__resumo-linha--total">
      <span>Valor Total:</span>
      <span>${formatMoeda(valorTotal)}</span>
    </div>
  `;
  container.appendChild(resumo);
}

function renderBotoes(container) {
  const acoes = document.createElement("div");
  acoes.className = "roteiro__acoes";
  acoes.innerHTML = `
    <a href="/src/pages/home/index.html" class="btn btn--outline">← Continuar Explorando</a>
    <button class="btn btn--accent roteiro__btn-finalizar" type="button">✓ Finalizar Reserva</button>
  `;
  container.appendChild(acoes);
}

function setupListeners() {
  document.addEventListener("click", (e) => {
    const btnRemover = e.target.closest(".roteiro__btn-remover");
    const btnFinalizar = e.target.closest(".roteiro__btn-finalizar");

    if (btnRemover) handleRemover(Number(btnRemover.dataset.id));
    if (btnFinalizar) handleFinalizar();
  });

  document.addEventListener("change", (e) => {
    const input = e.target.closest(".roteiro__input-quantidade");
    if (!input) return;

    const passeioId = Number(input.dataset.id);
    const novaQtd = Number(input.value);

    if (novaQtd <= 0 && confirm("Remover este passeio?")) {
      removeItem(passeioId);
      window.location.reload();
    } else if (novaQtd > 0) {
      updateQuantidade(passeioId, novaQtd);
      window.location.reload();
    } else {
      const itens = getItens();
      const item = itens.find((i) => i.passeioId === passeioId);
      input.value = item?.quantidade || 1;
    }
  });
}

function handleRemover(passeioId) {
  if (confirm("Tem certeza que deseja remover este passeio?")) {
    removeItem(passeioId);
    window.location.reload();
  }
}

async function handleFinalizar() {
  const itens = getItens();
  if (itens.length === 0) {
    alert("Nenhum passeio selecionado!");
    return;
  }

  if (!estaLogado()) {
    alert("Faça login para confirmar sua reserva.");
    window.location.href = "../login/index.html";
    return;
  }

  const resumo = itens.map((i) => `${i.snapshot.nome} (${i.quantidade}x)`).join("\n");
  if (!confirm(`Confirmar reserva?\n\n${resumo}`)) return;

  let reserva;
  try {
    reserva = await adicionarReserva(
      itens.map((i) => ({
        passeioId: i.passeioId,
        quantidade: i.quantidade,
        snapshot: i.snapshot,
      })),
    );
  } catch (erro) {
    alert(erro.message || "Erro ao confirmar a reserva.");
    return;
  }

  clearRoteiro();
  alert(`Reserva confirmada! Código: ${reserva.id}`);
  window.location.href = "../historico/index.html";
}

init().catch(console.error);
