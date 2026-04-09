const BASE_URL =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? "http://localhost:5000/api"
    : "https://stylodesigner.alwaysdata.net/api";

export async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem("tokenLojista");

  const headers = {
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
    if (options.body) {
      options.body = JSON.stringify(options.body);
    }
  }

  const config = {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    const dados = await response.json();

    return {
      ok: response.ok,
      status: response.status,
      dados,
    };
  } catch (error) {
    return {
      ok: false,
      status: 500,
      dados: { mensagem: "Erro de conexão com o servidor" },
    };
  }
}
