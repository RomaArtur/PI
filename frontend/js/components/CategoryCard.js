class CategoryCard extends HTMLElement {
  connectedCallback() {
    const title = this.getAttribute("title") || "Categoria";
    this.innerHTML = `
      <div class="category-card">
        <div class="category-img placeholder-img"></div>
        <h3>${title}</h3>
      </div>
    `;
  }
}
customElements.define("category-card", CategoryCard);
