import { apiFetch } from "../api/client.js";
import { bindDialogCloseButtons } from "../utils/dialogs.js";
import { escapeHtml } from "../utils/html.js";

const BASE_URL = "http://localhost:5000";
const WHATSAPP_URL = "https://wa.me/5511967833244";

document.addEventListener("DOMContentLoaded", () => {
  bindDialogCloseButtons();
  setupLeadModal();
  setupLeadPopupOnScroll();
  setupLeadCtaSection();
  loadCatalog();
});

const renderCatalogStatus = (message, tone = "") => `
  <p class="catalog-status${tone ? ` ${tone}` : ""} text-center">${escapeHtml(message)}</p>
`;

const renderCatalogCard = (produto) => {
  let imagePath = produto.imagem || "";

  if (imagePath && !imagePath.startsWith("http")) {
    const cleanPath = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
    imagePath = `${BASE_URL}${cleanPath}`;
  }

  return `
    <category-card
      title="${escapeHtml(produto.nome || "")}"
      price="${escapeHtml(produto.precoBase || 0)}"
      category="${escapeHtml(produto.categoria || "")}"
      description="${escapeHtml(produto.descricao || "")}"
      imagem="${escapeHtml(imagePath)}">
    </category-card>
  `;
};

function setupLeadModal() {
  const modal = document.getElementById("modal-lead");
  const btnOpen = document.getElementById("btn-open-modal");
  const btnClose = document.getElementById("btn-close-lead-modal");
  const btnLater = document.getElementById("btn-lead-later");
  const btnCta = document.getElementById("btn-lead-cta");
  const dismissKey = "leadPopupDismissUntil_v2";

  if (btnOpen && modal) {
    btnOpen.addEventListener("click", () => {
      window.open(WHATSAPP_URL, "_blank", "noopener,noreferrer");
    });
  }

  const dismiss = (ttlDays = 7) => {
    const until = Date.now() + ttlDays * 24 * 60 * 60 * 1000;
    localStorage.setItem(dismissKey, String(until));
    if (modal?.open) modal.close();
  };

  btnClose?.addEventListener("click", () => dismiss(7));
  btnLater?.addEventListener("click", () => dismiss(7));
  btnCta?.addEventListener("click", () => {
    const form = modal?.querySelector("lead-form")?.querySelector("form");
    if (form?.requestSubmit) {
      form.requestSubmit();
      return;
    }

    const input = modal?.querySelector('input[name="nome"]');
    if (input) input.focus();
  });

  document.addEventListener("lead-success", () => {
    localStorage.setItem(
      dismissKey,
      String(Date.now() + 365 * 24 * 60 * 60 * 1000),
    );
    setTimeout(() => {
      if (modal?.open) modal.close();
    }, 1500);
  });
}

function setupLeadCtaSection() {
  const btn = document.getElementById("btn-open-lead-cta");
  const modal = document.getElementById("modal-lead");
  if (!btn || !modal) return;

  btn.addEventListener("click", () => {
    const formEl = modal.querySelector("lead-form");
    if (formEl?.reset) formEl.reset();
    modal.showModal();
    const input = modal.querySelector('input[name="nome"]');
    if (input) input.focus();
  });
}

function setupLeadPopupOnScroll() {
  const modal = document.getElementById("modal-lead");
  if (!modal) return;

  const dismissKey = "leadPopupDismissUntil_v2";

  const shouldSuppress = () => {
    const until = Number(localStorage.getItem(dismissKey) || 0);
    return Number.isFinite(until) && until > Date.now();
  };

  let shownThisPage = false;
  let ticking = false;

  const maybeShow = () => {
    ticking = false;
    if (shownThisPage || modal.open || shouldSuppress()) return;

    const scrolled = window.scrollY || document.documentElement.scrollTop || 0;
    if (scrolled < 260) return;

    shownThisPage = true;
    modal.showModal();
  };

  window.addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(maybeShow);
    },
    { passive: true },
  );

  maybeShow();
}

async function loadCatalog() {
  const grid = document.getElementById("catalog-grid");
  if (!grid) return;

  grid.innerHTML = renderCatalogStatus("Carregando produtos...");

  try {
    const res = await apiFetch("/produtos");

    if (!res.ok) {
      throw new Error("Falha ao processar resposta do servidor");
    }

    const payload = res.dados;
    const listaProdutos = payload.dados || (Array.isArray(payload) ? payload : []);
    const ativos = listaProdutos.filter((produto) => produto.ativo);

    if (ativos.length === 0) {
      grid.innerHTML = renderCatalogStatus(
        "Nenhum produto disponível no momento.",
      );
      return;
    }

    grid.innerHTML = ativos.map(renderCatalogCard).join("");
  } catch (error) {
    console.error("Erro técnico no carregamento:", error);
    grid.innerHTML = renderCatalogStatus(
      "Erro ao carregar catálogo. Tente atualizar a página.",
      "catalog-status-error",
    );
  }
}
