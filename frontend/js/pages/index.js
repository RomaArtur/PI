import { apiFetch } from "../api/client.js";

const modalLead = document.getElementById("modal-lead");
const btnOpenModal = document.getElementById("btn-open-modal");
const btnCloseModal = document.getElementById("close-modal-lead");

if (btnOpenModal) {
  btnOpenModal.addEventListener("click", () => {
    modalLead.showModal();
  });
}

if (btnCloseModal) {
  btnCloseModal.addEventListener("click", () => {
    modalLead.close();
  });
}

document.addEventListener("lead-success", () => {
  modalLead.close();
});

async function loadCatalog() {
  const catalogGrid = document.getElementById("catalog-grid");
  if (!catalogGrid) return;

  catalogGrid.innerHTML =
    '<p class="text-center w-full" style="grid-column: 1 / -1;">Carregando produtos...</p>';

  try {
    const res = await apiFetch("/produtos");

    if (res.ok) {
      const produtos = res.dados.dados || res.dados;
      const produtosAtivos = produtos.filter((p) => p.ativo);

      catalogGrid.innerHTML = produtosAtivos.length
        ? ""
        : '<p class="text-center w-full" style="grid-column: 1 / -1;">Nenhum produto disponível no momento.</p>';

      produtosAtivos.forEach((prod) => {
        catalogGrid.insertAdjacentHTML(
          "beforeend",
          `<category-card title="${prod.nome}"></category-card>`,
        );
      });
    } else {
      catalogGrid.innerHTML =
        '<p class="text-center w-full" style="grid-column: 1 / -1; color: var(--danger);">Erro ao carregar catálogo.</p>';
    }
  } catch (error) {
    catalogGrid.innerHTML =
      '<p class="text-center w-full" style="grid-column: 1 / -1; color: var(--danger);">Falha de conexão com o servidor.</p>';
  }
}

window.addEventListener("DOMContentLoaded", loadCatalog);
