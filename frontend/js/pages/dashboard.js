import { apiFetch } from "../api/client.js";

const debounce = (fn, delay = 500) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

const updateSortIcons = (tableId, field, order) => {
  const table = document.getElementById(tableId);
  if (!table) return;
  table.querySelectorAll("th[data-sort] .sort-icon").forEach((i) => {
    i.textContent = "";
  });
  const th = table.querySelector(`th[data-sort="${field}"] .sort-icon`);
  if (th) th.textContent = order === "asc" ? " ▲" : " ▼";
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
    tbody.innerHTML =
      '<tr><td colspan="5" class="text-center">Carregando leads...</td></tr>';

    try {
      const params = new URLSearchParams(this.state);
      const res = await apiFetch(`/leads?${params}`);
      updateSortIcons("table-leads", this.state.sort, this.state.order);

      if (res.ok) {
        // Tratamento defensivo para diferentes formatos de resposta da API
        const dataRoot =
          res.dados.dados || (Array.isArray(res.dados) ? res.dados : []);
        const totalPages = res.dados.totalPages || 1;

        tbody.innerHTML = dataRoot.length
          ? ""
          : '<tr><td colspan="5" class="text-center">Nenhum lead encontrado.</td></tr>';

        dataRoot.forEach((l) => {
          tbody.insertAdjacentHTML(
            "beforeend",
            `
                        <tr>
                            <td>${l.nome || ""} ${l.sobrenome || ""}</td>
                            <td>${l.whatsapp || ""}</td>
                            <td>${l.email || ""}</td>
                            <td><span class="badge" style="background:#f1f5f9; color:#475569">${l.interesses?.length || 0} item(s)</span></td>
                            <td>
                                <button class="btn-action" onclick="window.Leads.edit('${l._id}')">Editar</button>
                                <button class="btn-action" onclick="window.Leads.delete('${l._id}')" style="color:var(--danger)">Excluir</button>
                            </td>
                        </tr>
                    `,
          );
        });
        this.updatePagination(totalPages);
      } else {
        tbody.innerHTML = `<tr><td colspan="5" class="text-center" style="color:var(--danger)">${res.dados?.mensagem || "Erro ao carregar dados"}</td></tr>`;
      }
    } catch (error) {
      tbody.innerHTML =
        '<tr><td colspan="5" class="text-center" style="color:var(--danger)">Erro crítico na requisição.</td></tr>';
    }
  },
  updatePagination(total) {
    const info = document.getElementById("info-leads");
    if (info) info.textContent = `Página ${this.state.page} de ${total}`;
    const prev = document.getElementById("prev-leads");
    const next = document.getElementById("next-leads");
    if (prev) prev.disabled = this.state.page <= 1;
    if (next) next.disabled = this.state.page >= total;
  },
  async edit(id) {
    const res = await apiFetch(`/leads/${id}`);
    if (res.ok) {
      const modal = document.getElementById("modal-novo-lead");
      const title = document.getElementById("modal-title-lead");
      const form = document.getElementById("component-lead-form");
      if (title) title.textContent = "Editar Lead";
      if (form) form.fillData(res.dados.dados || res.dados);
      if (modal) modal.showModal();
    }
  },
  async delete(id) {
    if (confirm("Excluir este lead permanentemente?")) {
      const res = await apiFetch(`/leads/${id}`, { method: "DELETE" });
      if (res.ok) this.load();
    }
  },
};

const Produtos = {
  state: { page: 1, limit: 10, busca: "", sort: "createdAt", order: "desc" },
  async load() {
    const tbody = document.getElementById("tbody-produtos");
    if (!tbody) return;
    tbody.innerHTML =
      '<tr><td colspan="5" class="text-center">Carregando produtos...</td></tr>';

    try {
      const params = new URLSearchParams({ ...this.state, admin: true });
      const res = await apiFetch(`/produtos?${params}`);
      updateSortIcons("table-produtos", this.state.sort, this.state.order);

      if (res.ok) {
        const dataRoot =
          res.dados.dados || (Array.isArray(res.dados) ? res.dados : []);
        const totalPages = res.dados.totalPages || 1;

        tbody.innerHTML = dataRoot.length
          ? ""
          : '<tr><td colspan="5" class="text-center">Nenhum produto cadastrado.</td></tr>';
        dataRoot.forEach((p) => {
          tbody.insertAdjacentHTML(
            "beforeend",
            `
                        <tr>
                            <td>${p.nome || ""}</td>
                            <td>R$ ${(p.precoBase || 0).toFixed(2)}</td>
                            <td>${p.prazoProducaoDias || 0} dias</td>
                            <td><span class="badge" style="background:${p.ativo ? "#dcfce7" : "#fee2e2"}; color:${p.ativo ? "#166534" : "#991b1b"}">${p.ativo ? "Ativo" : "Inativo"}</span></td>
                            <td>
                                <button class="btn-action" onclick="window.Produtos.toggle('${p._id}', ${p.ativo})">${p.ativo ? "Desativar" : "Ativar"}</button>
                                <button class="btn-action" onclick="window.Produtos.edit('${p._id}')">Editar</button>
                                <button class="btn-action" onclick="window.Produtos.delete('${p._id}')" style="color:var(--danger)">Excluir</button>
                            </td>
                        </tr>
                    `,
          );
        });
        this.updatePagination(totalPages);
      } else {
        tbody.innerHTML = `<tr><td colspan="5" class="text-center" style="color:var(--danger)">${res.dados?.mensagem || "Erro ao carregar dados"}</td></tr>`;
      }
    } catch (error) {
      tbody.innerHTML =
        '<tr><td colspan="5" class="text-center" style="color:var(--danger)">Erro crítico na requisição.</td></tr>';
    }
  },
  updatePagination(total) {
    const info = document.getElementById("info-produtos");
    if (info) info.textContent = `Página ${this.state.page} de ${total}`;
    const prev = document.getElementById("prev-produtos");
    const next = document.getElementById("next-produtos");
    if (prev) prev.disabled = this.state.page <= 1;
    if (next) next.disabled = this.state.page >= total;
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
    if (res.ok) {
      const list = res.dados.dados || res.dados;
      const prod = list.find((p) => p._id === id);
      if (prod) {
        const modal = document.getElementById("modal-produto");
        const title = document.getElementById("modal-title-produto");
        const form = document.getElementById("component-produto-form");
        if (title) title.textContent = "Editar Produto";
        if (form) form.fillData(prod);
        if (modal) modal.showModal();
      }
    }
  },
  async delete(id) {
    if (confirm("Excluir produto permanentemente?")) {
      const res = await apiFetch(`/produtos/${id}`, { method: "DELETE" });
      if (res.ok) this.load();
      else alert(res.dados?.mensagem || "Erro ao excluir produto");
    }
  },
};

window.Leads = Leads;
window.Produtos = Produtos;

const setupGlobalEvents = () => {
  // Busca Leads
  document.getElementById("search-leads")?.addEventListener(
    "input",
    debounce((e) => {
      Leads.state.busca = e.target.value;
      Leads.state.page = 1;
      Leads.load();
    }),
  );

  // Busca Produtos
  document.getElementById("search-produtos")?.addEventListener(
    "input",
    debounce((e) => {
      Produtos.state.busca = e.target.value;
      Produtos.state.page = 1;
      Produtos.load();
    }),
  );

  // Ordenação
  document.querySelectorAll("th[data-sort]").forEach((th) => {
    th.addEventListener("click", () => {
      const tableId = th.closest("table").id;
      const field = th.dataset.sort;
      const module = tableId === "table-leads" ? Leads : Produtos;
      module.state.order =
        module.state.sort === field && module.state.order === "asc"
          ? "desc"
          : "asc";
      module.state.sort = field;
      module.load();
    });
  });

  // Paginação Leads
  document.getElementById("prev-leads")?.addEventListener("click", () => {
    if (Leads.state.page > 1) {
      Leads.state.page--;
      Leads.load();
    }
  });
  document.getElementById("next-leads")?.addEventListener("click", () => {
    Leads.state.page++;
    Leads.load();
  });

  // Paginação Produtos
  document.getElementById("prev-produtos")?.addEventListener("click", () => {
    if (Produtos.state.page > 1) {
      Produtos.state.page--;
      Produtos.load();
    }
  });
  document.getElementById("next-produtos")?.addEventListener("click", () => {
    Produtos.state.page++;
    Produtos.load();
  });

  // Modais
  document.getElementById("btn-add-lead")?.addEventListener("click", () => {
    const form = document.getElementById("component-lead-form");
    const title = document.getElementById("modal-title-lead");
    if (title) title.textContent = "Novo Lead";
    if (form && form.reset) form.reset();
    document.getElementById("modal-novo-lead")?.showModal();
  });

  document.getElementById("btn-add-produto")?.addEventListener("click", () => {
    const form = document.getElementById("component-produto-form");
    const title = document.getElementById("modal-title-produto");
    if (title) title.textContent = "Novo Produto";
    if (form && form.reset) form.reset();
    document.getElementById("modal-produto")?.showModal();
  });

  // Listeners de Sucesso
  document.addEventListener("lead-success", () => {
    const modal = document.getElementById("modal-novo-lead");
    if (modal) modal.close();
    Leads.load();
  });

  document.addEventListener("produto-success", () => {
    const modal = document.getElementById("modal-produto");
    if (modal) modal.close();
    Produtos.load();
  });

  // Navegação Sidebar
  document.addEventListener("tab-changed", (e) => {
    const target = e.detail.target;
    const sections = document.querySelectorAll(".content-section");
    sections.forEach(
      (s) => (s.style.display = s.id === target ? "block" : "none"),
    );

    if (target === "section-leads") Leads.load();
    if (target === "section-produtos") Produtos.load();
  });
};

const bootstrap = () => {
  if (Auth.check()) {
    setupGlobalEvents();
    Leads.load();
  }
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootstrap);
} else {
  bootstrap();
}
