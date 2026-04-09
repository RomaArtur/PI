import { apiFetch } from "../api/client.js";

const BASE_URL = "http://localhost:5000";
const WHATSAPP_URL = "https://wa.me/5511999999999";

document.addEventListener("DOMContentLoaded", () => {
  setupLeadModal();
  setupLeadPopupOnScroll();
  setupLeadCtaSection();
  loadCatalog();
});

function setupLeadModal() {
  const modal = document.getElementById("modal-lead");
  const btnOpen = document.getElementById("btn-open-modal");
  const btnClose = document.getElementById("btn-close-lead-modal");
  const btnLater = document.getElementById("btn-lead-later");
  const btnCta = document.getElementById("btn-lead-cta");
  const DISMISS_KEY = "leadPopupDismissUntil_v2";

  if (btnOpen && modal) {
    btnOpen.onclick = () => {
      window.open(WHATSAPP_URL, "_blank", "noopener,noreferrer");
    };
  }

  const dismiss = (ttlDays = 7) => {
    const until = Date.now() + ttlDays * 24 * 60 * 60 * 1000;
    localStorage.setItem(DISMISS_KEY, String(until));
    if (modal && modal.open) modal.close();
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
      DISMISS_KEY,
      String(Date.now() + 365 * 24 * 60 * 60 * 1000),
    );
    setTimeout(() => {
      if (modal && modal.open) modal.close();
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

  const DISMISS_KEY = "leadPopupDismissUntil_v2";

  const shouldSuppress = () => {
    const until = Number(localStorage.getItem(DISMISS_KEY) || 0);
    return Number.isFinite(until) && until > Date.now();
  };

  let shownThisPage = false;
  let ticking = false;

  const maybeShow = () => {
    ticking = false;
    if (shownThisPage) return;
    if (modal.open) return;
    if (shouldSuppress()) return;

    const scrolled = window.scrollY || document.documentElement.scrollTop || 0;
    if (scrolled < 260) return;

    shownThisPage = true;
    modal.showModal();
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(maybeShow);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  maybeShow();
}

async function loadCatalog() {
  const grid = document.getElementById("catalog-grid");
  if (!grid) return;

  grid.innerHTML =
    '<p class="text-center w-full" style="grid-column: 1/-1;">Carregando produtos...</p>';

  try {
    const res = await apiFetch("/produtos");

    if (res.ok) {
      const payload = res.dados;
      const listaProdutos =
        payload.dados || (Array.isArray(payload) ? payload : []);

      const ativos = listaProdutos.filter((p) => p.ativo);

      if (ativos.length === 0) {
        grid.innerHTML =
          '<p class="text-center w-full" style="grid-column: 1/-1;">Nenhum produto disponível no momento.</p>';
        return;
      }

      grid.innerHTML = "";
      ativos.forEach((p) => {
        let imagePath = p.imagem || "";

        if (imagePath && !imagePath.startsWith("http")) {
          const cleanPath = imagePath.startsWith("/")
            ? imagePath
            : `/${imagePath}`;
          imagePath = `${BASE_URL}${cleanPath}`;
        }

        grid.insertAdjacentHTML(
          "beforeend",
          `
                    <category-card 
                        title="${p.nome}" 
                        price="${p.precoBase}" 
                        category="${p.categoria}" 
                        description="${p.descricao}"
                        imagem="${imagePath}">
                    </category-card>
                `,
        );
      });
    } else {
      console.error("Erro na API:", res.status, res.dados);
      throw new Error("Falha ao processar resposta do servidor");
    }
  } catch (error) {
    console.error("Erro técnico no carregamento:", error);
    grid.innerHTML =
      '<p class="text-center w-full" style="grid-column: 1/-1; color: var(--danger);">Erro ao carregar catálogo. Tente atualizar a página.</p>';
  }
}
