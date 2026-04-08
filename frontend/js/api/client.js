const BASE_URL = "http://localhost:5000/api";

export async function apiFetch(endpoint, opcoes = {}) {
  const token = localStorage.getItem("tokenLojista");

  const headers = {
    "Content-Type": "application/json",
    ...opcoes.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  let body = opcoes.body;
  if (body && typeof body === "object" && !(body instanceof FormData)) {
    body = JSON.stringify(body);
  }

  try {
    const resposta = await fetch(`${BASE_URL}${endpoint}`, {
      ...opcoes,
      headers,
      body,
    });

    const dados = await resposta.json();

    console.log(`[API ${opcoes.method || "GET"}] ${endpoint}:`, dados);

    return {
      ok: resposta.ok,
      status: resposta.status,
      dados,
    };
  } catch (erro) {
    console.error("Erro de Conexão:", erro);
    return {
      ok: false,
      dados: { mensagem: "Não foi possível conectar ao servidor." },
    };
  }
}
