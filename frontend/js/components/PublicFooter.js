import "./BrandLogo.js";

class PublicFooter extends HTMLElement {
  connectedCallback() {
    const isIndexPage =
      window.location.pathname.includes("index.html") ||
      window.location.pathname.endsWith("/");
    const navLinks = isIndexPage
      ? `
        <a href="#home">Início</a>
        <a href="#produtos">Produtos</a>
        <a href="#como-funciona">Como funciona</a>
        <a href="#comunicados">Comunicados</a>
      `
      : `
        <a href="index.html#home">Início</a>
        <a href="index.html#produtos">Produtos</a>
        <a href="index.html#como-funciona">Como funciona</a>
        <a href="index.html#comunicados">Comunicados</a>
      `;

    this.innerHTML = `
      <footer class="public-footer">
        <div class="container">
          <div class="footer-grid">
            <div class="footer-column footer-column--brand">
              <brand-logo></brand-logo>
              <p class="text-muted footer-copy">
                Papelaria criativa e design exclusivo para tornar seus momentos e projetos inesquecíveis.
              </p>
            </div>

            <div class="footer-column">
              <h3 class="footer-title">Navegação</h3>
              <nav class="footer-links">
                ${navLinks}
              </nav>
            </div>

            <div class="footer-column">
              <h3 class="footer-title">Contato</h3>
              <div class="text-muted footer-links">
                <a href="tel:+5511967833244">WhatsApp: +55 (11) 96783-3244</a>
                <a href="mailto:contato@stiloedesigner.com">contato@stiloedesigner.com</a>
                <span>Atendimento: Seg-Sex • 09h-18h</span>
              </div>
            </div>

            <div class="footer-column">
              <h3 class="footer-title">Endereço e redes</h3>
              <div class="text-muted footer-links">
                <span>Rua Tomoichi Shimizu, 181</span>
                <span>São Paulo • SP</span>
              </div>
            </div>
          </div>

          <div class="footer-bottom">
            <span class="text-muted footer-meta">&copy; ${new Date().getFullYear()} STILO & DESIGNER. Todos os direitos reservados.</span>
          </div>
        </div>
      </footer>
    `;
  }
}

if (!customElements.get("public-footer")) {
  customElements.define("public-footer", PublicFooter);
}
