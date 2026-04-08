import { apiFetch } from "../api/client.js";

class LeadForm extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <form id="form-lead">
        <div class="form-group">
          <label for="nome">Nome</label>
          <input type="text" id="nome" name="nome" required>
        </div>
        <div class="form-group">
          <label for="sobrenome">Sobrenome</label>
          <input type="text" id="sobrenome" name="sobrenome" required>
        </div>
        <div class="form-group">
          <label for="email">E-mail</label>
          <input type="email" id="email" name="email" required>
        </div>
        <div class="form-group">
          <label for="whatsapp">WhatsApp</label>
          <input type="tel" id="whatsapp" name="whatsapp" required>
        </div>
        <div class="form-group checkbox-group mt-2">
          <input type="checkbox" id="consentimento" name="consentimento" required>
          <label for="consentimento" class="checkbox-label">Aceito receber comunicações.</label>
        </div>
        <button type="submit" id="btn-submit" class="btn-primary w-full mt-2">
          Enviar Solicitação
        </button>
      </form>
      <div id="feedback" class="mt-2 text-center" style="display: none;"></div>
    `;
    this.querySelector("#form-lead").addEventListener(
      "submit",
      this.handleSubmit.bind(this),
    );
  }

  async handleSubmit(event) {
    event.preventDefault();
    const form = this.querySelector("#form-lead");
    const feedbackDiv = this.querySelector("#feedback");
    const submitBtn = this.querySelector("#btn-submit");

    feedbackDiv.style.display = "none";
    submitBtn.disabled = true;
    submitBtn.textContent = "Enviando...";

    const formData = new FormData(form);
    const payload = {
      nome: formData.get("nome"),
      sobrenome: formData.get("sobrenome"),
      email: formData.get("email"),
      whatsapp: formData.get("whatsapp"),
      consentimento: formData.get("consentimento") === "on",
    };

    try {
      const resultado = await apiFetch("/leads", {
        method: "POST",
        body: payload,
      });

      if (resultado.ok) {
        feedbackDiv.textContent =
          "Interesse registrado com sucesso! Entraremos em contato.";
        feedbackDiv.style.display = "block";
        feedbackDiv.style.color = "var(--success)";
        form.reset();
        setTimeout(() => {
          this.dispatchEvent(
            new CustomEvent("lead-success", { bubbles: true }),
          );
          feedbackDiv.style.display = "none";
        }, 2000);
      } else {
        feedbackDiv.textContent =
          resultado.dados.mensagem || "Erro ao processar cadastro.";
        feedbackDiv.style.display = "block";
        feedbackDiv.style.color = "var(--danger)";
      }
    } catch (error) {
      feedbackDiv.textContent = "Erro de conexão com o servidor.";
      feedbackDiv.style.display = "block";
      feedbackDiv.style.color = "var(--danger)";
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Enviar Solicitação";
    }
  }
}
customElements.define("lead-form", LeadForm);
