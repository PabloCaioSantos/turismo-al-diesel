import { mountHeader } from "../../components/header/header.js";
import { mountFooter } from "../../components/footer/footer.js";
import { renderCardCategoria } from "../../components/card-categoria/card-categoria.js";
import { renderCardPasseio } from "../../components/card-passeio/card-passeio.js";
import { addItem } from "../../services/roteiro-store.js";
import { get } from "../../services/api.js";

async function init() {
  mountHeader(document.querySelector("#app-header"), { activePage: "home" });
  mountFooter(document.querySelector("#app-footer"));

  try {
    const categorias = await get("/api/categorias");
    const gridCat = document.querySelector("#grid-categorias");
    if (gridCat) {
      categorias.forEach((cat) => {
        const card = renderCardCategoria(cat);
        gridCat.appendChild(card);
      });
    }
  } catch (erro) {
    console.error("Erro ao carregar categorias:", erro);
    renderFallback("categorias");
  }

  try {
    const populares = await get("/api/passeios/populares");
    const gridPop = document.querySelector("#grid-populares");
    if (gridPop) {
      populares.forEach((passeio) => {
        const card = renderCardPasseio(passeio);
        card.addEventListener("click", () => addItem(passeio));
        gridPop.appendChild(card);
      });
    }
  } catch (erro) {
    console.error("Erro ao carregar passeios populares:", erro);
    renderFallback("populares");
  }
}

function renderFallback(tipo) {
  const section = tipo === "categorias" ? "#grid-categorias" : "#grid-populares";
  const el = document.querySelector(section);
  if (el) {
    el.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #999;">Erro ao carregar ${tipo}. Tente recarregar a página.</p>`;
  }
}

init();
