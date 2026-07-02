export function mountFooter(root) {
  if (!root) return;

  const ano = new Date().getFullYear();

  root.innerHTML = `
    <footer class="site-footer">
      <div class="site-footer__inner container">
        <div class="site-footer__brand">
          <span class="site-footer__logo"> Projeto Turismo do Al-Diesel</span>
          <p class="site-footer__tagline">Descubra o Brasil. Reserve experiências únicas.</p>
          <div class="div-icons">
          <img class="icons" src="/public/assets/icons/insta-icon.svg"/>         
          <img class="icons" src="/public/assets/icons/chrome.svg"/>    
          
          </div>
        </div>

        <nav class="site-footer__links" aria-label="Links rápidos">
          <a href="/src/pages/home/index.html">Início</a>
          <a href="/src/pages/cadastro/index.html">Cadastro</a>
          <a href="/src/pages/roteiro/index.html">Minha Reserva</a>
        </nav>

        <p class="site-footer__copy">© ${ano} Projeto Turismo do Al-Diesel. Todos os direitos reservados.</p>
      </div>
    </footer>
  `;
}
