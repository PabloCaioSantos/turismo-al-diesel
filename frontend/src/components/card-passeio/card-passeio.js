export function renderCardPasseio(passeio, options = {}) {
  const { linkImagem = true } = options;

  const article = document.createElement("article");
  article.className = "card-passeio";
  article.dataset.id = String(passeio.id);

  const detalhePath = `/src/pages/detalhe/index.html?id=${passeio.id}`;

  const imagemHtml = linkImagem
    ? `<a href="${detalhePath}" class="card-passeio__image-link" aria-label="Ver detalhes de ${passeio.nome}">
        <img
          src="${passeio.imagem}"
          alt="${passeio.nome}"
          class="card-passeio__image"
          loading="lazy"
          onerror="this.src='https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80'"
        />
       </a>`
    : `<img
        src="${passeio.imagem}"
        alt="${passeio.nome}"
        class="card-passeio__image"
        loading="lazy"
        onerror="this.src='https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80'"
      />`;

  const valorFormatado = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(passeio.valorEstimado);

  article.innerHTML = `
    <div class="card-passeio__image-wrapper">
      ${imagemHtml}
    </div>
    <div class="card-passeio__body">
      <h3 class="card-passeio__title">
        <a href="${detalhePath}" class="card-passeio__title-link">${passeio.nome}</a>
      </h3>
      <p class="card-passeio__desc">${passeio.descricao}</p>
      <div class="card-passeio__footer">
        <span class="card-passeio__valor">${valorFormatado}</span>
        <button
          class="btn btn--accent btn--sm card-passeio__btn-roteiro"
          type="button"
          data-id="${passeio.id}"
          id="btn-roteiro-${passeio.id}"
          aria-label="Adicionar ${passeio.nome} à reserva"
        >
          + Reserva
        </button>
      </div>
    </div>
  `;

  return article;
}
