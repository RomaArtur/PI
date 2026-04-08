class BrandLogo extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="logo-text" style="color: var(--text-main); font-weight: 800; font-size: 1.25rem; text-decoration: none;">
        STILO & DESIGNER
      </div>
    `;
  }
}

customElements.define("brand-logo", BrandLogo);
