import { mountHeader } from "../../components/header/header.js";
import { mountFooter } from "../../components/footer/footer.js";
import { renderCardPasseio } from "../../components/card-passeio/card-passeio.js";
import { addItem } from "../../services/roteiro-store.js";
import { getQueryParam } from "../../utils/url.js";
import { formatMoeda } from "../../utils/format.js";
import { qs } from "../../utils/dom.js";
import { get } from "../../services/api.js";

const CATEGORIA_LABEL = {
  praias: "Praias",
  trilhas: "Trilhas",
  museus: "Museus",
  gastronomia: "Gastronomia",
  historicos: "Passeios Históricos",
  ecoturismo: "Ecoturismo",
};

const PIX_DESCONTO = 0.05;
const PARCELAS_SEM_JUROS = 6;
const PARCELAS_MAX = 12;
const JUROS_MENSAL = 0.0199;

function montarGaleria(passeio) {
  return passeio.galeria && passeio.galeria.length ? passeio.galeria : [passeio.imagem];
}

function renderEstrelas(nota, rotulo) {
  const pct = Math.max(0, Math.min(100, (nota / 5) * 100));
  return `
    <span class="stars" role="img" aria-label="${rotulo}">
      <span class="stars__empty" aria-hidden="true">★★★★★</span>
      <span class="stars__fill" style="width:${pct}%" aria-hidden="true">★★★★★</span>
    </span>`;
}

function valorParcela(valor, n) {
  if (n <= PARCELAS_SEM_JUROS) return valor / n;
  const i = JUROS_MENSAL;
  return (valor * i) / (1 - Math.pow(1 + i, -n));
}

function renderPagina(passeio) {
  const root = qs("#detalhe-root");
  const galeria = montarGaleria(passeio);
  const notaFmt = passeio.nota.toFixed(1).replace(".", ",");
  const total = passeio.numAvaliacoes;
  const precoPix = passeio.valorEstimado;
  const precoCartao = passeio.valorEstimado / (1 - PIX_DESCONTO);
  const parcelaSemJuros = precoCartao / PARCELAS_SEM_JUROS;
  const mapaBusca = `https://www.google.com/maps/search/?api=1&query=${passeio.local.lat},${passeio.local.lng}`;
  const mapaEmbed = `https://maps.google.com/maps?q=${passeio.local.lat},${passeio.local.lng}&z=14&hl=pt-BR&output=embed`;

  document.title = `${passeio.nome} | Projeto Turismo do Al-Diesel`;

  const chipsCategorias = passeio.categorias
    .map(
      (slug) =>
        `<a class="chip" href="/src/pages/categoria/index.html?slug=${slug}">${CATEGORIA_LABEL[slug] || slug}</a>`,
    )
    .join("");

  const thumbs = galeria
    .map(
      (src, i) => `
        <button
          type="button"
          class="detalhe-galeria__thumb ${i === 0 ? "is-active" : ""}"
          data-src="${src}"
          aria-label="Ver foto ${i + 1} de ${passeio.nome}"
        >
          <img src="${src}" alt="Foto ${i + 1} de ${passeio.nome}" loading="lazy" />
        </button>`,
    )
    .join("");

  const linhasParcelas = [];
  for (let n = 1; n <= PARCELAS_MAX; n++) {
    const parcela = valorParcela(precoCartao, n);
    const rotulo = n <= PARCELAS_SEM_JUROS ? "sem juros" : "com juros";
    linhasParcelas.push(
      `<li><span>${n}x de ${formatMoeda(parcela)}</span><span class="detalhe-preco__tag">${rotulo}</span></li>`,
    );
  }

  root.innerHTML = `
    <section class="detalhe-topo" aria-label="Fotos e informações principais">
      <div class="detalhe-galeria">
        <div class="detalhe-galeria__cover">
          <img
            id="galeria-principal"
            src="${galeria[0]}"
            alt="${passeio.nome}"
            onerror="this.src='https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80'"
          />
        </div>
        <div class="detalhe-galeria__thumbs" role="group" aria-label="Miniaturas">
          ${thumbs}
        </div>
      </div>

      <div class="detalhe-resumo">
        <h1 class="detalhe-nome">${passeio.nome}</h1>

        <div class="detalhe-meta">
          <div class="detalhe-avaliacao-resumo">
            ${renderEstrelas(passeio.nota, `Nota ${notaFmt} de 5`)}
            <span class="detalhe-nota-num">${notaFmt}</span>
            <span class="detalhe-num-aval">(${total} ${total === 1 ? "avaliação" : "avaliações"})</span>
            <a
              class="detalhe-mapa-link"
              href="${mapaBusca}"
              target="_blank"
              rel="noopener"
            >
              📍 ${passeio.local.endereco}, ver no mapa
            </a>
          </div>

          <div class="detalhe-preco-box">
            <span class="detalhe-preco__label">à vista no Pix</span>
            <strong class="detalhe-preco__pix">${formatMoeda(precoPix)}</strong>
            <span class="detalhe-preco__desconto">5% de desconto · de ${formatMoeda(precoCartao)}</span>
            <span class="detalhe-preco__cartao">
              ou em até ${PARCELAS_SEM_JUROS}x de ${formatMoeda(parcelaSemJuros)} sem juros
            </span>
            <details class="detalhe-preco__parcelas">
              <summary>Ver todas as parcelas</summary>
              <ul>${linhasParcelas.join("")}</ul>
              <p class="detalhe-preco__obs">Parcelas de 7x a 12x com juros de 1,99% a.m.</p>
            </details>
            <button
              type="button"
              class="btn btn--accent detalhe-btn-reserva card-passeio__btn-roteiro"
              data-id="${passeio.id}"
            >
              + Adicionar à Reserva
            </button>
          </div>
        </div>

        <div class="detalhe-categorias" aria-label="Categorias">
          ${chipsCategorias}
        </div>
      </div>
    </section>

    <section class="detalhe-secao" aria-labelledby="titulo-detalhes">
      <h2 id="titulo-detalhes" class="section__title">Sobre o passeio</h2>
      <p class="detalhe-descricao">${passeio.detalhes}</p>
      <ul class="detalhe-info-grid">
        <li><span class="detalhe-info__rotulo">⏱️ Duração</span><span>${passeio.duracao}</span></li>
        <li><span class="detalhe-info__rotulo">📍 Local</span><span>${passeio.local.endereco}</span></li>
        <li><span class="detalhe-info__rotulo">⭐ Avaliação</span><span>${notaFmt} de 5 (${total})</span></li>
      </ul>
      <div class="detalhe-mapa">
        <iframe
          title="Localização de ${passeio.nome} no Google Maps"
          src="${mapaEmbed}"
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          allowfullscreen
        ></iframe>
      </div>
    </section>

    <section class="detalhe-secao" aria-labelledby="titulo-recomendacoes">
      <div class="section__header">
        <div>
          <h2 id="titulo-recomendacoes" class="section__title">Você também pode gostar</h2>
          <p class="section__subtitle">Passeios com categorias parecidas</p>
        </div>
      </div>
      <div class="rec-scroll" id="rec-scroll" role="list"></div>
    </section>
  `;

  ativarGaleria();
  renderRecomendacoes(passeio);
  ativarBotaoReserva(passeio);
}

function ativarGaleria() {
  const principal = document.querySelector("#galeria-principal");
  const thumbs = document.querySelectorAll(".detalhe-galeria__thumb");
  thumbs.forEach((thumb) => {
    thumb.addEventListener("click", () => {
      const src = thumb.getAttribute("data-src");
      if (!src || !principal) return;
      principal.src = src;
      thumbs.forEach((t) => t.classList.remove("is-active"));
      thumb.classList.add("is-active");
    });
  });
}

async function renderRecomendacoes(passeio) {
  const scroll = document.querySelector("#rec-scroll");
  if (!scroll) return;

  let recomendados = [];
  try {
    const params = new URLSearchParams({
      categorias: passeio.categorias.join(","),
      excluir: String(passeio.id),
      limite: "8",
    });
    recomendados = await get(`/api/passeios?${params.toString()}`);
  } catch (erro) {
    console.error("Erro ao carregar recomendações:", erro);
  }

  for (const p of recomendados) {
    const card = renderCardPasseio(p, { linkImagem: true });
    card.classList.add("rec-card");
    card.setAttribute("role", "listitem");
    scroll.appendChild(card);
  }

  const slugPrincipal = passeio.categorias[0];
  const verMais = document.createElement("a");
  verMais.className = "rec-ver-mais";
  verMais.setAttribute("role", "listitem");
  verMais.href = `/src/pages/categoria/index.html?slug=${slugPrincipal}`;
  verMais.innerHTML = `
    <span class="rec-ver-mais__icone" aria-hidden="true">→</span>
    <span class="rec-ver-mais__texto">Ver mais passeios de<br /><strong>${CATEGORIA_LABEL[slugPrincipal] || slugPrincipal}</strong></span>
  `;
  scroll.appendChild(verMais);
}

function ativarBotaoReserva(passeio) {
  const btn = document.querySelector(".detalhe-btn-reserva");
  if (!btn) return;

  btn.addEventListener("click", () => {
    addItem(passeio);
    btn.classList.add("added");
    btn.textContent = "✓ Adicionado à Reserva";
    mountHeader(document.querySelector("#app-header"));
    setTimeout(() => {
      btn.classList.remove("added");
      btn.textContent = "+ Adicionar à Reserva";
    }, 1500);
  });
}

function renderBreadcrumb(passeio) {
  const nav = document.querySelector("#breadcrumb");
  if (!nav) return;
  const slug = passeio.categorias[0];
  nav.innerHTML = `
    <a href="/src/pages/home/index.html">Início</a>
    <span aria-hidden="true"> › </span>
    <a href="/src/pages/categoria/index.html?slug=${slug}">${CATEGORIA_LABEL[slug] || slug}</a>
    <span aria-hidden="true"> › </span>
    <span>${passeio.nome}</span>
  `;
}

async function init() {
  mountHeader(document.querySelector("#app-header"));
  mountFooter(document.querySelector("#app-footer"));

  const id = Number(getQueryParam("id"));

  let passeio;
  try {
    passeio = await get(`/api/passeios/${id}`);
  } catch (erro) {
    console.error("Erro ao carregar passeio:", erro);
    const root = qs("#detalhe-root");
    root.innerHTML = `
      <div class="empty-state">
        <span class="empty-state__icon">🧭</span>
        <p>Passeio não encontrado.</p>
        <a class="btn btn--primary" href="/src/pages/home/index.html">Voltar para o início</a>
      </div>`;
    return;
  }

  renderBreadcrumb(passeio);
  renderPagina(passeio);
}

init();
