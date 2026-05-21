class BrandLogo extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="brand-logo">
        <img
          src="assets/logo.png"
          alt="Stilo & Designer"
          class="brand-logo-image"
        >
        <div class="logo-text brand-logo-text">
          Stilo & Designer
        </div>
      </div>
    `;
  }
}

if (!customElements.get("brand-logo")) {
  customElements.define("brand-logo", BrandLogo);
}
