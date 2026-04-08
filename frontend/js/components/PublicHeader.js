import "./BrandLogo.js";

class PublicHeader extends HTMLElement {
  connectedCallback() {
    const token = localStorage.getItem("tokenLojista");
    const isLoginPage = window.location.pathname.includes("login.html");
    const isIndexPage =
      !isLoginPage && !window.location.pathname.includes("dashboard.html");

    let authHref = "login.html";
    let authTexto = "Acesso Lojista";
    let navLinks = "";

    if (token) {
      authHref = "dashboard.html";
      authTexto = "Painel de Controle";
    } else if (isLoginPage) {
      authHref = "index.html";
      authTexto = "Início";
    }

    if (isIndexPage) {
      navLinks = `
            <a href="#home" class="text-muted" style="font-weight: 600; margin-right: 1.5rem; text-decoration: none; transition: color 0.3s;">Início</a>
            <a href="#produtos" class="text-muted" style="font-weight: 600; margin-right: 1.5rem; text-decoration: none; transition: color 0.3s;">Produtos</a>
            <a href="#como-funciona" class="text-muted" style="font-weight: 600; margin-right: 1.5rem; text-decoration: none; transition: color 0.3s;">Como Funciona</a>
        `;
    }

    this.innerHTML = `
      <header class="main-header" style="background-color: var(--card-bg); border-bottom: 1px solid var(--border-color); padding: 1rem 0; position: sticky; top: 0; z-index: 999;">
        <div class="container header-container" style="display: flex; justify-content: space-between; align-items: center;">
          <a href="index.html" style="text-decoration: none;">
            <brand-logo></brand-logo>
          </a>
          <nav style="display: flex; align-items: center;">
            ${navLinks}
            <a href="${authHref}" style="font-weight: 600; font-size: 0.9rem; text-decoration: none; background-color: var(--primary-color); color: white; padding: 0.5rem 1rem; border-radius: var(--radius); transition: background-color 0.3s;">
              ${authTexto}
            </a>
          </nav>
        </div>
      </header>
    `;
  }
}

customElements.define("public-header", PublicHeader);
