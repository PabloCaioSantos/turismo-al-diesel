import { countItens, clearRoteiro } from "../../services/roteiro-store.js";
import { estaLogado, getUsuarioLogado, logout } from "../../services/auth-store.js";

function iniciais(nome) {
  const partes = String(nome || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (partes.length === 0) return "?";
  const primeira = partes[0][0] || "";
  const segunda = partes.length > 1 ? partes[partes.length - 1][0] : "";
  return (primeira + segunda).toUpperCase();
}

const iconeCadastro = `
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>`;

const iconeLogin = `
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
    <polyline points="10 17 15 12 10 7"/>
    <line x1="15" y1="12" x2="3" y2="12"/>
  </svg>`;

function acoesDeslogado(activePage) {
  return `
    <a
      href="../login/index.html"
      class="site-header__action-btn ${activePage === "login" ? "site-header__action-btn--active" : ""}"
      aria-label="Entrar"
      title="Entrar"
    >
      ${iconeLogin}
      <span class="site-header__action-label">Entrar</span>
    </a>

    <a
      href="../cadastro/index.html"
      class="site-header__action-btn ${activePage === "cadastro" ? "site-header__action-btn--active" : ""}"
      aria-label="Cadastrar visitante"
      title="Cadastro"
    >
      ${iconeCadastro}
      <span class="site-header__action-label">Cadastro</span>
    </a>`;
}

function acoesLogado(usuario, activePage) {
  const nome = usuario.fullname || usuario.username || "Minha conta";
  const primeiroNome = nome.split(/\s+/)[0];
  const paginasDoMenu = ["minha-conta", "historico"];
  const ativo = paginasDoMenu.includes(activePage) ? "site-header__action-btn--active" : "";
  const avatar = usuario.foto
    ? `<span class="site-header__avatar site-header__avatar--foto" aria-hidden="true"><img src="${usuario.foto}" alt="" /></span>`
    : `<span class="site-header__avatar" aria-hidden="true">${iniciais(nome)}</span>`;

  return `
    <div class="site-header__user" data-user-menu>
      <button
        type="button"
        class="site-header__action-btn site-header__user-btn ${ativo}"
        aria-haspopup="true"
        aria-expanded="false"
        aria-label="Menu do usuário"
        data-user-toggle
      >
        ${avatar}
        <span class="site-header__action-label">${primeiroNome}</span>
      </button>

      <div class="site-header__menu" role="menu" hidden>
        <div class="site-header__menu-header">
          <strong>${nome}</strong>
          <span>${usuario.email || ""}</span>
        </div>
        <a class="site-header__menu-item" role="menuitem" href="../minha-conta/index.html">👤 Minha conta</a>
        <a class="site-header__menu-item" role="menuitem" href="../historico/index.html">📜 Meu histórico</a>
        <button type="button" class="site-header__menu-item site-header__menu-item--danger" role="menuitem" data-logout>
          🚪 Sair
        </button>
      </div>
    </div>`;
}

export function mountHeader(root, options = {}) {
  if (!root) return;

  const qtd = countItens();
  const { activePage = "" } = options;
  const logado = estaLogado();
  const usuario = logado ? getUsuarioLogado() : null;

  root.innerHTML = `
    <header class="site-header">
      <div class="site-header__inner container">
        <a href="../home/index.html" class="site-header__logo" aria-label="Projeto Turismo do Al-Diesel - página inicial">
          <span class="site-header__logo-icon">🌴</span>
          <span class="site-header__logo-text">Projeto Turismo do Al-Diesel</span>
        </a>

        <nav class="site-header__actions" aria-label="Ações do usuário">
          ${usuario ? acoesLogado(usuario, activePage) : acoesDeslogado(activePage)}

          <a
            href="../roteiro/index.html"
            class="site-header__action-btn site-header__action-btn--cart ${activePage === "roteiro" ? "site-header__action-btn--active" : ""}"
            aria-label="Minha Reserva${qtd > 0 ? ` (${qtd} ${qtd === 1 ? "item" : "itens"})` : ""}"
            title="Minha Reserva"
          >
            <span class="site-header__cart-wrapper">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M9 11l3 3L22 4"/>
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
              </svg>
              ${qtd > 0 ? `<span class="badge" aria-hidden="true">${qtd}</span>` : ""}
            </span>
            <span class="site-header__action-label">Reserva</span>
          </a>
        </nav>
      </div>
    </header>
  `;

  if (usuario) ativarMenuUsuario(root);
}

function ativarMenuUsuario(root) {
  const wrapper = root.querySelector("[data-user-menu]");
  const toggle = root.querySelector("[data-user-toggle]");
  const menu = root.querySelector(".site-header__menu");
  const btnLogout = root.querySelector("[data-logout]");
  if (!wrapper || !toggle || !menu) return;

  const abrir = () => {
    menu.hidden = false;
    wrapper.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
  };
  const fechar = () => {
    menu.hidden = true;
    wrapper.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  };

  toggle.addEventListener("click", (e) => {
    e.stopPropagation();
    if (wrapper.classList.contains("is-open")) fechar();
    else abrir();
  });

  document.addEventListener("click", (e) => {
    if (!wrapper.contains(e.target)) fechar();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") fechar();
  });

  if (btnLogout) {
    btnLogout.addEventListener("click", () => {
      logout();
      clearRoteiro();
      window.location.href = "../home/index.html";
    });
  }
}
