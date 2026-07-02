import { mountHeader } from "../../components/header/header.js";
import { mountFooter } from "../../components/footer/footer.js";
import { estaLogado } from "../../services/auth-store.js";
import { getHistorico } from "../../services/historico-store.js";
import { qs, showEmptyState } from "../../utils/dom.js";
import { formatMoeda, formatData } from "../../utils/format.js";

if (!estaLogado()) {
  window.location.href = "../login/index.html";
}

async function init() {
  mountHeader(document.querySelector("#app-header"), { activePage: "historico" });
  mountFooter(document.querySelector("#app-footer"));

  const container = qs("#historico-container");

  let reservas;
  try {
    reservas = await getHistorico();
  } catch (erro) {
    console.error("Erro ao carregar histórico:", erro);
    showEmptyState(container, "Erro ao carregar seu histórico. Tente novamente.");
    return;
  }

  if (reservas.length === 0) {
    showEmptyState(
      container,
      "Você ainda não confirmou nenhuma reserva. Monte um roteiro e finalize para vê-lo aqui!",
    );
    return;
  }

  container.innerHTML = reservas.map(renderReserva).join("");
}

function renderReserva(reserva) {
  const qtdTotal = reserva.itens.reduce((acc, i) => acc + i.quantidade, 0);
  const linhas = reserva.itens
    .map(
      (i) => `
        <li class="historico-item">
          <img
            src="${i.snapshot.imagem}"
            alt="${i.snapshot.nome}"
            class="historico-item__img"
            loading="lazy"
            onerror="this.src='https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=100&q=80'"
          />
          <span class="historico-item__nome">${i.snapshot.nome}</span>
          <span class="historico-item__qtd">${i.quantidade}x</span>
          <span class="historico-item__valor">${formatMoeda(i.snapshot.valorEstimado * i.quantidade)}</span>
        </li>`,
    )
    .join("");

  return `
    <article class="historico-card">
      <header class="historico-card__topo">
        <div>
          <span class="historico-card__id">${reserva.id}</span>
          <span class="historico-card__data">${formatData(reserva.data)}</span>
        </div>
        <span class="historico-card__badge">${qtdTotal} ${qtdTotal === 1 ? "passeio" : "passeios"}</span>
      </header>
      <ul class="historico-card__itens">${linhas}</ul>
      <footer class="historico-card__rodape">
        <span>Total</span>
        <strong>${formatMoeda(reserva.total)}</strong>
      </footer>
    </article>`;
}

init();
