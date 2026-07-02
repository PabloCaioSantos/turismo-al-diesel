export function imagemDaCategoria(slug) {
  return `/public/assets/images/categorias/${slug}.jpg`;
}

export function renderCardCategoria(categoria) {
  let emoji = "🗺️";
  let descricao = "";

  switch (categoria.slug) {
    case "praias":
      emoji = "🏖️";
      descricao = "Areias brancas, águas cristalinas e muito sol";
      break;
    case "trilhas":
      emoji = "🥾";
      descricao = "Aventura e natureza nos melhores percursos";
      break;
    case "museus":
      emoji = "🏛️";
      descricao = "Arte, história e cultura ao alcance";
      break;
    case "gastronomia":
      emoji = "🍽️";
      descricao = "Sabores autênticos da culinária regional";
      break;
    case "historicos":
      emoji = "🏰";
      descricao = "Patrimônios e marcos que contam nossa história";
      break;
    case "ecoturismo":
      emoji = "🌿";
      descricao = "Biodiversidade e sustentabilidade em harmonia";
      break;
  }

  const article = document.createElement("article");
  article.className = "card-categoria";
  article.dataset.slug = categoria.slug;

  article.innerHTML = `
    <div class="card-categoria__image-wrapper">
      <img
        src="${imagemDaCategoria(categoria.slug)}"
        alt="Foto representativa da categoria ${categoria.label}"
        class="card-categoria__image"
        loading="lazy"
        onerror="this.style.display='none';this.parentElement.querySelector('.card-categoria__emoji').style.display='flex'"
      />
      <div class="card-categoria__emoji" aria-hidden="true" style="display:none">${emoji}</div>
      <div class="card-categoria__overlay" aria-hidden="true"></div>
    </div>
    <div class="card-categoria__body">
      <span class="card-categoria__badge">${emoji}</span>
      <h3 class="card-categoria__title">${categoria.label}</h3>
      <p class="card-categoria__desc">${descricao}</p>
      <a
        class="btn btn--primary btn--sm card-categoria__btn"
        href="/src/pages/categoria/index.html?slug=${categoria.slug}"
        id="btn-categoria-${categoria.slug}"
      >
        Ver passeios
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
      </a>
    </div>
  `;

  return article;
}
