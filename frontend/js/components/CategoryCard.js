import { escapeHtml } from "../utils/html.js";

class CategoryCard extends HTMLElement {
  connectedCallback() {
    const title = this.getAttribute("title") || "Produto";
    const rawPrice = Number(this.getAttribute("price") || 0);
    const price = Number.isFinite(rawPrice) ? rawPrice.toFixed(2) : "0.00";
    const category = this.getAttribute("category") || "Geral";
    const description = this.getAttribute("description") || "";
    const imagem = this.getAttribute("imagem") || "";
    const fallbackImg = "https://placehold.co/400x300?text=Imagem+indisponivel";

    this.innerHTML = `
      <article class="category-card">
        <div class="category-card-media">
          <img
            class="category-card-image"
            src="${escapeHtml(imagem)}"
            alt="${escapeHtml(title)}"
          >
        </div>

        <div class="category-card-body">
          <span class="badge-category">${escapeHtml(category)}</span>
          <h3 class="category-card-title">${escapeHtml(title)}</h3>
          <p class="text-muted category-card-description">${escapeHtml(description)}</p>
          <div class="category-card-price">R$ ${price}</div>
        </div>
      </article>
    `;

    const image = this.querySelector(".category-card-image");
    image?.addEventListener("error", () => {
      image.src = fallbackImg;
    }, { once: true });
  }
}

if (!customElements.get("category-card")) {
  customElements.define("category-card", CategoryCard);
}
