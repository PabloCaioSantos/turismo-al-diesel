import { mountHeader } from "../../components/header/header.js";
import { mountFooter } from "../../components/footer/footer.js";
import { renderCardPasseio } from "../../components/card-passeio/card-passeio.js";
import { imagemDaCategoria } from "../../components/card-categoria/card-categoria.js";
import { addItem } from "../../services/roteiro-store.js";
import { getQueryParam } from "../../utils/url.js";
import { qs, showEmptyState } from "../../utils/dom.js";
import { get } from "../../services/api.js";

async function init() {
  mountHeader(document.querySelector("#app-header"), {
    activePage: "categoria",
  });
  mountFooter(document.querySelector("#app-footer"));

  const slug = getQueryParam("slug");
  if (!slug) {
    showEmptyState(document.querySelector("#main-content"), "Categoria não especificada!");
    return;
  }

  const hero = qs("#categoria-hero");
  const heroEmoji = qs("#hero-emoji");
  const heroTitle = qs("#hero-title");

  heroTitle.textContent = slug;

  const heroImageUrl = imagemDaCategoria(slug);

  const emojiBySlug = {
    praias: "🏖️",
    trilhas: "🥾",
    museus: "🏛️",
    gastronomia: "🍽️",
    historicos: "🏰",
    ecoturismo: "🌿",
  };
  heroEmoji.textContent = emojiBySlug[slug] || "🗺️";

  const img = new Image();
  img.onload = () => {
    hero.style.backgroundImage = `url(${heroImageUrl})`;
    hero.style.backgroundColor = "transparent";
    heroEmoji.style.display = "none";
  };
  img.onerror = () => {
    hero.style.backgroundImage = "none";
    hero.style.backgroundColor = "var(--color-surface-2)";
    heroEmoji.style.display = "inline";
  };
  img.src = heroImageUrl;

  try {
    const passeios = await get(`/api/categorias/${slug}/passeios`);
    const container = qs("#grid-passeios");

    if (passeios.length === 0) {
      showEmptyState(container, `Nenhum passeio encontrado em "${slug}"`);
      return;
    }

    passeios.forEach((passeio) => {
      const card = renderCardPasseio(passeio);
      card.addEventListener("click", () => addItem(passeio));
      container.appendChild(card);
    });
  } catch (erro) {
    console.error("Erro ao carregar passeios:", erro);
    showEmptyState(
      document.querySelector("#main-content"),
      "Erro ao carregar passeios. Tente novamente.",
    );
  }
}

init();
