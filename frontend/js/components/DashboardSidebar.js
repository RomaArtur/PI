import "./BrandLogo.js";

class DashboardSidebar extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <aside class="sidebar">
        <div class="sidebar-header">
          <brand-logo></brand-logo>
          <button type="button" class="sidebar-close" aria-label="Fechar menu">
            &times;
          </button>
        </div>

        <nav class="sidebar-nav">
          <button class="nav-item active" data-target="section-leads">
            <span>Leads</span>
          </button>
          <button class="nav-item" data-target="section-produtos">
            <span>Produtos</span>
          </button>
        </nav>

        <div class="sidebar-footer">
          <button id="btn-logout" class="btn-logout">Sair</button>
        </div>
      </aside>
    `;

    const navItems = this.querySelectorAll(".nav-item");
    navItems.forEach((item) => {
      item.addEventListener("click", () => {
        navItems.forEach((nav) => nav.classList.remove("active"));
        item.classList.add("active");
        this.dispatchEvent(
          new CustomEvent("tab-changed", {
            detail: { target: item.getAttribute("data-target") },
            bubbles: true,
          }),
        );
        this.dispatchEvent(
          new CustomEvent("sidebar-close", {
            bubbles: true,
          }),
        );
      });
    });

    this.querySelector(".sidebar-close").addEventListener("click", () => {
      this.dispatchEvent(
        new CustomEvent("sidebar-close", {
          bubbles: true,
        }),
      );
    });

    this.querySelector("#btn-logout").addEventListener("click", () => {
      localStorage.removeItem("tokenLojista");
      localStorage.removeItem("usuario");
      window.location.href = "login.html";
    });
  }
}

if (!customElements.get("dashboard-sidebar")) {
  customElements.define("dashboard-sidebar", DashboardSidebar);
}
