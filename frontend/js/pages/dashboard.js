import { apiFetch } from "../api/client.js";

const sections = document.querySelectorAll(".content-section");
const tbodyLeads = document.getElementById("tbody-leads");
const tbodyProdutos = document.getElementById("tbody-produtos");
const modalProd = document.getElementById("modal-produto");
const formProd = document.getElementById("form-produto");
const btnAddProd = document.querySelector(".btn-add");
const closeModal = document.getElementById("close-modal");

function checkAuth() {
  const token = localStorage.getItem("tokenLojista");
  const user = JSON.parse(localStorage.getItem("usuario") || "null");

  if (!token || !user) {
    window.location.href = "login.html";
    return null;
  }

  document.getElementById("welcome-msg").textContent =
    `Bem-vindo, ${user.nome}`;
  document.getElementById("user-email").textContent = user.email;
  return token;
}

document.addEventListener("tab-changed", (e) => {
  const target = e.detail.target;
  sections.forEach((section) => {
    section.style.display = section.id === target ? "block" : "none";
  });
  if (target === "section-leads") loadLeads();
  if (target === "section-produtos") loadProdutos();
});

async function loadLeads() {
  tbodyLeads.innerHTML =
    '<tr><td colspan="5" class="text-center">Carregando leads...</td></tr>';
  const res = await apiFetch("/leads");
  if (res.ok) {
    tbodyLeads.innerHTML = res.dados.length
      ? ""
      : '<tr><td colspan="5" class="text-center">Nenhum lead encontrado.</td></tr>';
    res.dados.forEach((lead) => {
      const row = `
        <tr>
          <td>${lead.nome} ${lead.sobrenome}</td>
          <td>${lead.whatsapp}</td>
          <td>${lead.email}</td>
          <td><span class="badge badge-info">${lead.interesses?.length || 0} interesse(s)</span></td>
          <td>
            <button class="btn-action" onclick="excluirLead('${lead._id}')" style="color: var(--danger)">Excluir</button>
          </td>
        </tr>
      `;
      tbodyLeads.insertAdjacentHTML("beforeend", row);
    });
  }
}

window.excluirLead = async (id) => {
  if (!confirm("Deseja remover este lead permanentemente?")) return;
  const res = await apiFetch(`/leads/${id}`, { method: "DELETE" });
  if (res.ok) loadLeads();
};

async function loadProdutos() {
  tbodyProdutos.innerHTML =
    '<tr><td colspan="6" class="text-center">Carregando produtos...</td></tr>';
  const res = await apiFetch("/produtos");
  if (res.ok) {
    const produtos = res.dados.dados || res.dados;
    tbodyProdutos.innerHTML = produtos.length
      ? ""
      : '<tr><td colspan="6" class="text-center">Nenhum produto cadastrado.</td></tr>';
    produtos.forEach((prod) => {
      const row = `
        <tr>
          <td>${prod.nome}</td>
          <td>${prod.categoria}</td>
          <td>R$ ${Number(prod.precoBase).toFixed(2)}</td>
          <td>${prod.prazoProducaoDias} dias</td>
          <td>
            <span class="badge ${prod.ativo ? "badge-success" : "badge-info"}">
              ${prod.ativo ? "Ativo" : "Inativo"}
            </span>
          </td>
          <td>
            <button class="btn-action" onclick="editarProduto('${prod._id}')">Editar</button>
            <button class="btn-action" onclick="excluirProduto('${prod._id}')" style="color: var(--danger)">Excluir</button>
          </td>
        </tr>
      `;
      tbodyProdutos.insertAdjacentHTML("beforeend", row);
    });
  }
}

if (btnAddProd) {
  btnAddProd.addEventListener("click", () => {
    formProd.reset();
    document.getElementById("prod-id").value = "";
    document.getElementById("modal-title").textContent = "Novo Produto";
    modalProd.showModal();
  });
}

if (closeModal) {
  closeModal.addEventListener("click", () => modalProd.close());
}

formProd.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(formProd);
  const id = formData.get("id");
  const payload = {
    nome: formData.get("nome"),
    categoria: formData.get("categoria"),
    precoBase: parseFloat(formData.get("precoBase")),
    prazoProducaoDias: parseInt(formData.get("prazoProducaoDias")),
    descricao: formData.get("descricao"),
    ativo: formData.get("ativo") === "on",
  };
  const method = id ? "PUT" : "POST";
  const endpoint = id ? `/produtos/${id}` : "/produtos";
  const res = await apiFetch(endpoint, {
    method: method,
    body: payload,
  });
  if (res.ok) {
    modalProd.close();
    loadProdutos();
  } else {
    alert(res.dados.mensagem || "Erro ao processar produto");
  }
});

window.editarProduto = async (id) => {
  const res = await apiFetch("/produtos");
  if (res.ok) {
    const produtos = res.dados.dados || res.dados;
    const prod = produtos.find((p) => p._id === id);
    if (prod) {
      document.getElementById("prod-id").value = prod._id;
      document.getElementById("prod-nome").value = prod.nome;
      document.getElementById("prod-categoria").value = prod.categoria;
      document.getElementById("prod-preco").value = prod.precoBase;
      document.getElementById("prod-prazo").value = prod.prazoProducaoDias;
      document.getElementById("prod-descricao").value = prod.descricao;
      document.getElementById("prod-ativo").checked = prod.ativo;
      document.getElementById("modal-title").textContent = "Editar Produto";
      modalProd.showModal();
    }
  }
};

window.excluirProduto = async (id) => {
  if (!confirm("Confirmar exclusão deste produto?")) return;
  const res = await apiFetch(`/produtos/${id}`, { method: "DELETE" });
  if (res.ok) loadProdutos();
};

window.onload = () => {
  if (checkAuth()) {
    loadLeads();
  }
};
