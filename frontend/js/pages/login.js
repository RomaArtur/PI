import { apiFetch } from "../api/client.js";
import { setFeedbackState } from "../utils/feedback.js";

const loginForm = document.getElementById("form-login");
const feedbackDiv = document.getElementById("login-feedback");
const loginBtn = document.getElementById("btn-login");

/**
 * Controla a exibição de mensagens de erro ou sucesso
 */
function showFeedback(message, isError = false) {
  setFeedbackState(feedbackDiv, message, isError ? "error" : "success");
}

/**
 * Gerencia o fluxo de autenticação
 */
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Estado inicial do carregamento
  setFeedbackState(feedbackDiv, "");
  loginBtn.disabled = true;
  loginBtn.textContent = "Autenticando...";

  const formData = new FormData(loginForm);
  const email = formData.get("email");
  const senha = formData.get("senha");

  try {
    const result = await apiFetch("/login", {
      method: "POST",
      body: { email, senha },
    });

    if (result.ok) {
      // Persistência do JWT e metadados do lojista
      localStorage.setItem("tokenLojista", result.dados.token);
      localStorage.setItem("usuario", JSON.stringify(result.dados.dono));

      showFeedback("Acesso autorizado. Redirecionando...");

      // Delay para feedback visual antes do redirect
      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 800);
    } else {
      showFeedback(
        result.dados.mensagem || "Falha na autenticação. Verifique os dados.",
        true,
      );
      loginBtn.disabled = false;
      loginBtn.textContent = "Entrar no Sistema";
    }
  } catch (error) {
    showFeedback("Serviço indisponível no momento.", true);
    loginBtn.disabled = false;
    loginBtn.textContent = "Entrar no Sistema";
  }
});
