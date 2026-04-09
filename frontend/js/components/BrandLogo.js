class BrandLogo extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div style="display: flex; align-items: center; gap: 0.6rem;">
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
        </svg>
        <div class="logo-text" style="color: var(--text-main);">
          STILO & DESIGNER
        </div>
      </div>
    `;
  }
}

if (!customElements.get("brand-logo")) {
  customElements.define("brand-logo", BrandLogo);
}
