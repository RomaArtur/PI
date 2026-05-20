import { escapeHtml } from "../utils/html.js";

class CategoryCard extends HTMLElement {
  connectedCallback() {
    this._autoRotate = null;
    this._currentIndex = 0;

    const title = this.getAttribute("title") || "Produto";
    const rawPrice = Number(this.getAttribute("price") || 0);
    const price = Number.isFinite(rawPrice) ? rawPrice.toFixed(2) : "0.00";
    const category = this.getAttribute("category") || "Geral";
    const description = this.getAttribute("description") || "";
    const imagem = this.getAttribute("imagem") || "";
    const imagesAttr = this.getAttribute("images") || "[]";

    let images = [];
    try {
      images = JSON.parse(imagesAttr);
    } catch {
      images = [];
    }

    const safeImages = images.filter(Boolean);
    if (!safeImages.length && imagem) safeImages.push(imagem);
    const hasImages = safeImages.length > 0;

    this.innerHTML = `
      <article class="category-card">
        <div class="category-card-media">
          ${
            hasImages
              ? `
                <div class="category-card-carousel" data-count="${safeImages.length}">
                  <div class="category-card-track">
                    ${safeImages
                      .map(
                        (src, index) => `
                          <div class="category-card-slide" data-index="${index}">
                            <img
                              class="category-card-image"
                              src="${escapeHtml(src)}"
                              alt="${escapeHtml(`${title} - imagem ${index + 1}`)}"
                            >
                          </div>
                        `,
                      )
                      .join("")}
                  </div>
                  ${
                    safeImages.length > 1
                      ? `
                        <button type="button" class="category-card-nav category-card-nav-prev" aria-label="Imagem anterior">
                          &#8249;
                        </button>
                        <button type="button" class="category-card-nav category-card-nav-next" aria-label="Proxima imagem">
                          &#8250;
                        </button>
                        <div class="category-card-dots">
                          ${safeImages
                            .map(
                              (_, index) => `
                                <button
                                  type="button"
                                  class="category-card-dot${index === 0 ? " is-active" : ""}"
                                  data-index="${index}"
                                  aria-label="Ir para imagem ${index + 1}"
                                ></button>
                              `,
                            )
                            .join("")}
                        </div>
                      `
                      : ""
                  }
                </div>
              `
              : `
                <div class="category-card-empty-media">
                  <span>Sem imagem cadastrada</span>
                </div>
              `
          }
        </div>

        <div class="category-card-body">
          <span class="badge-category">${escapeHtml(category)}</span>
          <h3 class="category-card-title">${escapeHtml(title)}</h3>
          <p class="text-muted category-card-description">${escapeHtml(description)}</p>
          <div class="category-card-price">R$ ${price}</div>
        </div>
      </article>
    `;

    this.querySelectorAll(".category-card-image").forEach((image) => {
      image.addEventListener(
        "error",
        () => {
          const slide = image.closest(".category-card-slide");
          if (slide) {
            slide.innerHTML =
              '<div class="category-card-empty-media"><span>Sem imagem cadastrada</span></div>';
          }
        },
        { once: true },
      );
    });

    if (safeImages.length > 1) {
      this.startAutoRotate();
      this.bindCarouselEvents();
      this.updateCarousel();
    }
  }

  disconnectedCallback() {
    this.stopAutoRotate();
  }

  bindCarouselEvents() {
    this.querySelector(".category-card-nav-prev")?.addEventListener("click", () => {
      this.moveSlide(-1);
    });

    this.querySelector(".category-card-nav-next")?.addEventListener("click", () => {
      this.moveSlide(1);
    });

    this.querySelectorAll(".category-card-dot").forEach((dot) => {
      dot.addEventListener("click", () => {
        this._currentIndex = Number(dot.dataset.index || 0);
        this.updateCarousel();
        this.restartAutoRotate();
      });
    });

    this.addEventListener("mouseenter", () => this.stopAutoRotate());
    this.addEventListener("mouseleave", () => this.startAutoRotate());
  }

  moveSlide(direction) {
    const slides = this.querySelectorAll(".category-card-slide");
    if (!slides.length) return;

    this._currentIndex =
      (this._currentIndex + direction + slides.length) % slides.length;
    this.updateCarousel();
    this.restartAutoRotate();
  }

  updateCarousel() {
    const track = this.querySelector(".category-card-track");
    if (track) {
      track.style.transform = `translateX(-${this._currentIndex * 100}%)`;
    }

    this.querySelectorAll(".category-card-dot").forEach((dot, index) => {
      dot.classList.toggle("is-active", index === this._currentIndex);
    });
  }

  startAutoRotate() {
    this.stopAutoRotate();
    const slides = this.querySelectorAll(".category-card-slide");
    if (slides.length <= 1) return;

    this._autoRotate = window.setInterval(() => {
      this.moveSlide(1);
    }, 4500);
  }

  stopAutoRotate() {
    if (this._autoRotate) {
      window.clearInterval(this._autoRotate);
      this._autoRotate = null;
    }
  }

  restartAutoRotate() {
    this.startAutoRotate();
  }
}

if (!customElements.get("category-card")) {
  customElements.define("category-card", CategoryCard);
}
