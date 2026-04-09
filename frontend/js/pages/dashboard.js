import { apiFetch } from "../api/client.js";
import { bindDialogCloseButtons } from "../utils/dialogs.js";
import { escapeHtml } from "../utils/html.js";

const mobileSidebarMedia = window.matchMedia("(max-width: 900px)");

const debounce = (fn, delay = 500) => {
  let timer;

  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

const renderTableMessage = (message, tone = "") =>
  `<tr><td colspan="5" class="text-center table-message ${tone}">${escapeHtml(message)}</td></tr>`;

const renderActionButton = ({ action, id, label, tone = "", extraData = {} }) => {
  const dataAttributes = Object.entries({ action, id, ...extraData })
    .map(
      ([key, value]) =>
        `data-${key.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`)}="${escapeHtml(value)}"`,
    )
    .join(" ");

  return `
    <button type="button" class="btn-action${tone ? ` ${tone}` : ""}" ${dataAttributes}>
      ${escapeHtml(label)}
    </button>
  `;
};

const normalizeCollection = (payload = {}) => ({
  items: payload.dados || (Array.isArray(payload) ? payload : []),
  totalPages: payload.totalPages || 1,
});

const formatLeadName = (lead) =>
  [lead.nome, lead.sobrenome].filter(Boolean).join(" ").trim() || "Lead sem nome";

const renderLeadRow = (lead) => `
  <tr>
    <td>${escapeHtml(formatLeadName(lead))}</td>
    <td>${escapeHtml(lead.whatsapp || "Não informado")}</td>
    <td>${escapeHtml(lead.email || "Não informado")}</td>
    <td>
      <span class="badge badge-neutral">
        ${escapeHtml(lead.interesses?.length || 0)} item(s)
      </span>
    </td>
    <td>
      <div class="table-actions">
        ${renderActionButton({
          action: "edit-lead",
          id: lead._id,
          label: "Editar",
        })}
        ${renderActionButton({
          action: "delete-lead",
          id: lead._id,
          label: "Excluir",
          tone: "btn-action-danger",
        })}
      </div>
    </td>
  </tr>
`;

const renderProdutoRow = (produto) => `
  <tr>
    <td>${escapeHtml(produto.nome || "Produto sem nome")}</td>
    <td>R$ ${escapeHtml(Number(produto.precoBase || 0).toFixed(2))}</td>
    <td>${escapeHtml(produto.prazoProducaoDias || 0)} dias</td>
    <td>
      <span class="badge ${produto.ativo ? "badge-success" : "badge-danger"}">
        ${produto.ativo ? "Ativo" : "Inativo"}
      </span>
    </td>
    <td>
      <div class="table-actions">
        ${renderActionButton({
          action: "toggle-produto",
          id: produto._id,
          label: produto.ativo ? "Desativar" : "Ativar",
          extraData: { current: produto.ativo },
        })}
        ${renderActionButton({
          action: "edit-produto",
          id: produto._id,
          label: "Editar",
        })}
        ${renderActionButton({
          action: "delete-produto",
          id: produto._id,
          label: "Excluir",
          tone: "btn-action-danger",
        })}
      </div>
    </td>
  </tr>
`;

const setSidebarOpen = (isOpen) => {
  document.body.classList.toggle("sidebar-open", isOpen);

  const toggle = document.getElementById("dashboard-sidebar-toggle");
  if (toggle) {
    toggle.setAttribute("aria-expanded", String(isOpen));
  }
};

const updateSortIcons = (tableId, field, order) => {
  const table = document.getElementById(tableId);
  if (!table) return;

  table.querySelectorAll("th[data-sort] .sort-icon").forEach((icon) => {
    icon.textContent = "";
  });

  const icon = table.querySelector(`th[data-sort="${field}"] .sort-icon`);
  if (icon) {
    icon.textContent = order === "asc" ? " ▲" : " ▼";
  }
};

const Auth = {
  check() {
    const token = localStorage.getItem("tokenLojista");
    const user = JSON.parse(localStorage.getItem("usuario") || "null");

    if (!token || !user) {
      window.location.href = "login.html";
      return false;
    }

    const welcomeMsg = document.getElementById("welcome-msg");
    const userEmail = document.getElementById("user-email");

    if (welcomeMsg) welcomeMsg.textContent = `Bem-vindo, ${user.nome}`;
    if (userEmail) userEmail.textContent = user.email;

    return true;
  },
};

const Leads = {
  state: { page: 1, limit: 10, busca: "", sort: "createdAt", order: "desc" },

  async load() {
    const tbody = document.getElementById("tbody-leads");
    if (!tbody) return;

    tbody.innerHTML = renderTableMessage("Carregando leads...");

    try {
      const params = new URLSearchParams(this.state);
      const res = await apiFetch(`/leads?${params}`);
      updateSortIcons("table-leads", this.state.sort, this.state.order);

      if (!res.ok) {
        tbody.innerHTML = renderTableMessage(
          res.dados?.mensagem || "Erro ao carregar dados",
          "table-message-error",
        );
        return;
      }

      const { items, totalPages } = normalizeCollection(res.dados);

      tbody.innerHTML = items.length
        ? items.map(renderLeadRow).join("")
        : renderTableMessage("Nenhum lead encontrado.");

      this.updatePagination(totalPages);
    } catch (error) {
      tbody.innerHTML = renderTableMessage(
        "Erro crítico na requisição.",
        "table-message-error",
      );
    }
  },

  updatePagination(totalPages) {
    const info = document.getElementById("info-leads");
    if (info) info.textContent = `Página ${this.state.page} de ${totalPages}`;

    const prev = document.getElementById("prev-leads");
    const next = document.getElementById("next-leads");
    if (prev) prev.disabled = this.state.page <= 1;
    if (next) next.disabled = this.state.page >= totalPages;
  },

  async edit(id) {
    const res = await apiFetch(`/leads/${id}`);
    if (!res.ok) return;

    const modal = document.getElementById("modal-novo-lead");
    const title = document.getElementById("modal-title-lead");
    const form = document.getElementById("component-lead-form");

    if (title) title.textContent = "Editar Lead";
    if (form) form.fillData(res.dados.dados || res.dados);
    if (modal) modal.showModal();
  },

  async delete(id) {
    if (!confirm("Excluir este lead permanentemente?")) return;

    const res = await apiFetch(`/leads/${id}`, { method: "DELETE" });
    if (res.ok) this.load();
  },
};

const Produtos = {
  state: { page: 1, limit: 10, busca: "", sort: "createdAt", order: "desc" },

  async load() {
    const tbody = document.getElementById("tbody-produtos");
    if (!tbody) return;

    tbody.innerHTML = renderTableMessage("Carregando produtos...");

    try {
      const params = new URLSearchParams({ ...this.state, admin: true });
      const res = await apiFetch(`/produtos?${params}`);
      updateSortIcons("table-produtos", this.state.sort, this.state.order);

      if (!res.ok) {
        tbody.innerHTML = renderTableMessage(
          res.dados?.mensagem || "Erro ao carregar dados",
          "table-message-error",
        );
        return;
      }

      const { items, totalPages } = normalizeCollection(res.dados);

      tbody.innerHTML = items.length
        ? items.map(renderProdutoRow).join("")
        : renderTableMessage("Nenhum produto cadastrado.");

      this.updatePagination(totalPages);
    } catch (error) {
      tbody.innerHTML = renderTableMessage(
        "Erro crítico na requisição.",
        "table-message-error",
      );
    }
  },

  updatePagination(totalPages) {
    const info = document.getElementById("info-produtos");
    if (info) info.textContent = `Página ${this.state.page} de ${totalPages}`;

    const prev = document.getElementById("prev-produtos");
    const next = document.getElementById("next-produtos");
    if (prev) prev.disabled = this.state.page <= 1;
    if (next) next.disabled = this.state.page >= totalPages;
  },

  async toggle(id, current) {
    const res = await apiFetch(`/produtos/${id}`, {
      method: "PUT",
      body: { ativo: !current },
    });

    if (res.ok) this.load();
  },

  async edit(id) {
    const res = await apiFetch(`/produtos?admin=true`);
    if (!res.ok) return;

    const list = res.dados.dados || res.dados;
    const produto = list.find((item) => item._id === id);
    if (!produto) return;

    const modal = document.getElementById("modal-produto");
    const title = document.getElementById("modal-title-produto");
    const form = document.getElementById("component-produto-form");

    if (title) title.textContent = "Editar Produto";
    if (form) form.fillData(produto);
    if (modal) modal.showModal();
  },

  async delete(id) {
    if (!confirm("Excluir produto permanentemente?")) return;

    const res = await apiFetch(`/produtos/${id}`, { method: "DELETE" });
    if (res.ok) {
      this.load();
      return;
    }

    alert(res.dados?.mensagem || "Erro ao excluir produto");
  },
};

window.Leads = Leads;
window.Produtos = Produtos;

const setupSidebarControls = () => {
  const toggle = document.getElementById("dashboard-sidebar-toggle");
  const overlay = document.getElementById("dashboard-sidebar-overlay");

  toggle?.addEventListener("click", () => {
    setSidebarOpen(!document.body.classList.contains("sidebar-open"));
  });

  overlay?.addEventListener("click", () => {
    setSidebarOpen(false);
  });

  document.addEventListener("sidebar-close", () => {
    setSidebarOpen(false);
  });

  const handleMediaChange = () => {
    if (!mobileSidebarMedia.matches) {
      setSidebarOpen(false);
    }
  };

  if (typeof mobileSidebarMedia.addEventListener === "function") {
    mobileSidebarMedia.addEventListener("change", handleMediaChange);
  } else {
    mobileSidebarMedia.addListener(handleMediaChange);
  }
};

const setupTableActions = () => {
  document.getElementById("table-leads")?.addEventListener("click", (event) => {
    const actionTrigger = event.target.closest("[data-action]");
    if (!actionTrigger) return;

    if (actionTrigger.dataset.action === "edit-lead") {
      void Leads.edit(actionTrigger.dataset.id);
    }

    if (actionTrigger.dataset.action === "delete-lead") {
      void Leads.delete(actionTrigger.dataset.id);
    }
  });

  document
    .getElementById("table-produtos")
    ?.addEventListener("click", (event) => {
      const actionTrigger = event.target.closest("[data-action]");
      if (!actionTrigger) return;

      if (actionTrigger.dataset.action === "toggle-produto") {
        void Produtos.toggle(
          actionTrigger.dataset.id,
          actionTrigger.dataset.current === "true",
        );
      }

      if (actionTrigger.dataset.action === "edit-produto") {
        void Produtos.edit(actionTrigger.dataset.id);
      }

      if (actionTrigger.dataset.action === "delete-produto") {
        void Produtos.delete(actionTrigger.dataset.id);
      }
    });
};

const setupGlobalEvents = () => {
  bindDialogCloseButtons();
  setupTableActions();

  document.getElementById("search-leads")?.addEventListener(
    "input",
    debounce((event) => {
      Leads.state.busca = event.target.value;
      Leads.state.page = 1;
      Leads.load();
    }),
  );

  document.getElementById("search-produtos")?.addEventListener(
    "input",
    debounce((event) => {
      Produtos.state.busca = event.target.value;
      Produtos.state.page = 1;
      Produtos.load();
    }),
  );

  document.querySelectorAll("th[data-sort]").forEach((headerCell) => {
    headerCell.addEventListener("click", () => {
      const tableId = headerCell.closest("table").id;
      const field = headerCell.dataset.sort;
      const module = tableId === "table-leads" ? Leads : Produtos;

      module.state.order =
        module.state.sort === field && module.state.order === "asc"
          ? "desc"
          : "asc";
      module.state.sort = field;
      module.load();
    });
  });

  document.getElementById("prev-leads")?.addEventListener("click", () => {
    if (Leads.state.page > 1) {
      Leads.state.page -= 1;
      Leads.load();
    }
  });

  document.getElementById("next-leads")?.addEventListener("click", () => {
    Leads.state.page += 1;
    Leads.load();
  });

  document.getElementById("prev-produtos")?.addEventListener("click", () => {
    if (Produtos.state.page > 1) {
      Produtos.state.page -= 1;
      Produtos.load();
    }
  });

  document.getElementById("next-produtos")?.addEventListener("click", () => {
    Produtos.state.page += 1;
    Produtos.load();
  });

  document.getElementById("btn-add-lead")?.addEventListener("click", () => {
    const form = document.getElementById("component-lead-form");
    const title = document.getElementById("modal-title-lead");

    if (title) title.textContent = "Novo Lead";
    if (form?.reset) form.reset();

    document.getElementById("modal-novo-lead")?.showModal();
  });

  document.getElementById("btn-add-produto")?.addEventListener("click", () => {
    const form = document.getElementById("component-produto-form");
    const title = document.getElementById("modal-title-produto");

    if (title) title.textContent = "Novo Produto";
    if (form?.reset) form.reset();

    document.getElementById("modal-produto")?.showModal();
  });

  document.addEventListener("lead-success", () => {
    document.getElementById("modal-novo-lead")?.close();
    Leads.load();
  });

  document.addEventListener("produto-success", () => {
    document.getElementById("modal-produto")?.close();
    Produtos.load();
  });

  document.addEventListener("tab-changed", (event) => {
    const target = event.detail.target;
    const sections = document.querySelectorAll(".content-section");

    sections.forEach((section) => {
      section.hidden = section.id !== target;
    });

    if (target === "section-leads") Leads.load();
    if (target === "section-produtos") Produtos.load();

    if (mobileSidebarMedia.matches) {
      setSidebarOpen(false);
    }
  });

  setupSidebarControls();
};

const bootstrap = () => {
  if (!Auth.check()) return;

  setupGlobalEvents();
  Leads.load();
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootstrap);
} else {
  bootstrap();
}
