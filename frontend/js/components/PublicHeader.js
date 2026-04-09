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
      authTexto = "Inicio";
    }

    if (isIndexPage) {
      navLinks = `
        <a href="#home" class="header-nav-link">Inicio</a>
        <a href="#produtos" class="header-nav-link">Produtos</a>
        <a href="#como-funciona" class="header-nav-link">Como funciona</a>
        <a href="#comunicados" class="header-nav-link">Comunicados</a>
      `;
    }

    const authClass = isLoginPage
      ? "header-auth-link header-auth-link--ghost"
      : "header-auth-link header-auth-link--solid";

    this.innerHTML = `
      <header class="main-header">
        <div class="container header-container">
          <a href="index.html" class="header-brand-link" aria-label="Ir para a pagina inicial">
            <brand-logo></brand-logo>
          </a>

          <button
            type="button"
            class="header-menu-toggle"
            aria-expanded="false"
            aria-label="Abrir menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <button
            type="button"
            class="header-overlay"
            aria-label="Fechar menu"
            hidden
          ></button>

          <nav class="header-nav" data-open="false">
            <div class="header-nav-top">
              <span class="header-nav-title">Menu</span>
              <button
                type="button"
                class="header-nav-close"
                aria-label="Fechar menu"
              >
                &times;
              </button>
            </div>

            <div class="header-nav-links">
              ${navLinks}
            </div>

            <a href="${authHref}" class="${authClass}">
              ${authTexto}
            </a>
          </nav>
        </div>
      </header>
    `;

    const nav = this.querySelector(".header-nav");
    const overlay = this.querySelector(".header-overlay");
    const toggle = this.querySelector(".header-menu-toggle");
    const closeBtn = this.querySelector(".header-nav-close");
    const mobileMedia = window.matchMedia("(max-width: 820px)");

    const openMenu = () => {
      if (!mobileMedia.matches) return;
      nav.dataset.open = "true";
      toggle.setAttribute("aria-expanded", "true");
      overlay.hidden = false;
      document.body.classList.add("menu-open");
    };

    const closeMenu = () => {
      nav.dataset.open = "false";
      toggle.setAttribute("aria-expanded", "false");
      overlay.hidden = true;
      document.body.classList.remove("menu-open");
    };

    toggle.addEventListener("click", () => {
      if (nav.dataset.open === "true") {
        closeMenu();
      } else {
        openMenu();
      }
    });

    closeBtn.addEventListener("click", closeMenu);
    overlay.addEventListener("click", closeMenu);

    this.querySelectorAll(".header-nav a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    const handleMediaChange = () => {
      if (!mobileMedia.matches) {
        closeMenu();
      }
    };

    if (typeof mobileMedia.addEventListener === "function") {
      mobileMedia.addEventListener("change", handleMediaChange);
    } else {
      mobileMedia.addListener(handleMediaChange);
    }
  }
}

if (!customElements.get("public-header")) {
  customElements.define("public-header", PublicHeader);
}
