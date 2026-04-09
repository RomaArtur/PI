import { apiFetch } from "../api/client.js";
import { clearFeedbackState, setFeedbackState } from "../utils/feedback.js";

class LeadForm extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  get isPublic() {
    return (this.getAttribute("variant") || "admin") === "public";
  }

  get successMsg() {
    return this.isPublic
      ? "Cadastro concluído! Em breve você receberá comunicados."
      : "Dados salvos com sucesso!";
  }

  render() {
    const isPublic = this.isPublic;

    this.innerHTML = `
      <form id="inner-lead-form" class="lead-form">
        <input type="hidden" name="id" id="lead-id">

        <div class="form-grid lead-form-grid">
          <div class="form-group">
            <label for="lead-nome">Nome</label>
            <input type="text" id="lead-nome" name="nome" required>
          </div>

          <div class="form-group">
            <label for="lead-sobrenome">Sobrenome</label>
            <input type="text" id="lead-sobrenome" name="sobrenome" required>
          </div>

          <div class="form-group">
            <label for="lead-whatsapp">WhatsApp</label>
            <input type="text" id="lead-whatsapp" name="whatsapp" required>
          </div>

          <div class="form-group">
            <label for="lead-email">E-mail</label>
            <input type="email" id="lead-email" name="email" required>
          </div>
        </div>

        ${
          isPublic
            ? `
          <label class="form-checkbox text-muted">
            <input type="checkbox" name="consentimento" value="true" required>
            <span>Concordo em receber comunicados e compartilhar minhas informações para contato.</span>
          </label>
        `
            : '<input type="hidden" name="consentimento" value="true">'
        }

        <div id="lead-msg" class="form-feedback" aria-live="polite"></div>

        <button
          type="submit"
          id="btn-submit-lead"
          class="btn-primary form-submit lead-form-submit${isPublic ? " is-hidden" : ""}"
        >
          Salvar Lead
        </button>
      </form>
    `;

    this.querySelector("#inner-lead-form").addEventListener("submit", (e) =>
      this.handleSubmit(e),
    );
  }

  setFeedback(message, type) {
    setFeedbackState(this.querySelector("#lead-msg"), message, type);
  }

  clearFeedback() {
    clearFeedbackState(this.querySelector("#lead-msg"));
  }

  async handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const btn = this.querySelector("#btn-submit-lead");
    const id = form.id.value;

    this.clearFeedback();
    btn.disabled = true;
    const originalText = btn.textContent;
    btn.textContent = "Processando...";

    const payload = Object.fromEntries(new FormData(form).entries());
    delete payload.id;
    payload.consentimento = payload.consentimento === "true";

    const endpoint = id ? `/leads/${id}` : "/leads";
    const method = id ? "PUT" : "POST";

    try {
      const res = await apiFetch(endpoint, { method, body: payload });
      if (res.ok) {
        this.setFeedback(this.successMsg, "success");
        if (!id) form.reset();
        this.dispatchEvent(
          new CustomEvent("lead-success", { bubbles: true, composed: true }),
        );
      } else {
        const validationMessage = Array.isArray(res.dados?.erros)
          ? res.dados.erros.map((erro) => erro.mensagem).join(" ")
          : null;
        throw new Error(
          validationMessage || res.dados?.mensagem || "Erro na operação",
        );
      }
    } catch (err) {
      this.setFeedback(err.message, "error");
    } finally {
      btn.disabled = false;
      btn.textContent = originalText;
    }
  }

  fillData(lead) {
    const form = this.querySelector("#inner-lead-form");
    form.id.value = lead._id;
    form.nome.value = lead.nome;
    form.sobrenome.value = lead.sobrenome;
    form.whatsapp.value = lead.whatsapp;
    form.email.value = lead.email;
    if (form.consentimento) {
      form.consentimento.value = String(Boolean(lead.consentimento ?? true));
    }
    this.clearFeedback();
  }

  reset() {
    const form = this.querySelector("#inner-lead-form");
    if (form) {
      form.reset();
      form.id.value = "";
      if (form.consentimento && !this.isPublic) {
        form.consentimento.value = "true";
      }
    }
    this.clearFeedback();
  }
}

if (!customElements.get("lead-form")) {
  customElements.define("lead-form", LeadForm);
}
