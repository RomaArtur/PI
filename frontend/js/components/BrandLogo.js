class BrandLogo extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="logo-text">
        STILO & DESIGNER
      </div>
    `;
  }
}

if (!customElements.get("brand-logo")) {
  customElements.define("brand-logo", BrandLogo);
}
