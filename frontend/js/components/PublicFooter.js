import "./BrandLogo.js";

class PublicFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <footer style="background-color: var(--card-bg); border-top: 1px solid var(--border-color); padding: 3rem 0 1.5rem 0; margin-top: auto;">
        <div class="container" style="display: flex; flex-direction: column; align-items: center; gap: 1.5rem;">
          <brand-logo></brand-logo>
          <p class="text-muted" style="text-align: center; max-width: 400px; line-height: 1.6;">
            Papelaria Criativa e Design Exclusivo para tornar seus momentos e projetos inesquecíveis.
          </p>
          <div style="width: 100%; border-top: 1px solid var(--border-color); margin-top: 1.5rem; padding-top: 1.5rem; text-align: center;">
            <span class="text-muted" style="font-size: 0.875rem;">&copy; ${new Date().getFullYear()} STILO & DESIGNER. Todos os direitos reservados.</span>
          </div>
        </div>
      </footer>
    `;
  }
}

customElements.define("public-footer", PublicFooter);
