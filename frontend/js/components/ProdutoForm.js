import { apiFetch } from "../api/client.js";
import { clearFeedbackState, setFeedbackState } from "../utils/feedback.js";

class ProdutoForm extends HTMLElement {
  connectedCallback() {
    this._cropper = null;
    this._croppedFile = null;
    this._selectedFiles = [];
    this._existingImages = [];
    this.render();
  }

  render() {
    this.innerHTML = `
      <form id="form-produto-interno" class="produto-form" enctype="multipart/form-data">
        <input type="hidden" id="prod-id" name="id">

        <div class="form-grid produto-form-grid">
          <div class="form-group">
            <label for="prod-nome">Nome do Produto</label>
            <input type="text" id="prod-nome" name="nome" required>
          </div>

          <div class="form-group">
            <label for="prod-categoria">Categoria</label>
            <input type="text" id="prod-categoria" name="categoria" required>
          </div>

          <div class="form-group">
            <label for="prod-preco">Preço base (R$)</label>
            <input type="number" id="prod-preco" name="precoBase" step="0.01" required>
          </div>

          <div class="form-group">
            <label for="prod-prazo">Prazo Produção (dias)</label>
            <input type="number" id="prod-prazo" name="prazoProducaoDias" required>
          </div>

          <div class="form-group form-group-full">
            <label for="prod-imagem">Fotos do Produto</label>
            <input type="file" id="prod-imagem" name="imagens" accept="image/*" multiple>
            <p id="current-img-name" class="form-helper"></p>
            <div id="existing-images" class="form-helper"></div>
          </div>
        </div>

        <div class="form-group produto-form-description">
          <label for="prod-descricao">Descrição</label>
          <textarea id="prod-descricao" name="descricao" rows="3" required></textarea>
        </div>

        <div id="feedback-produto" class="form-feedback" aria-live="polite"></div>

        <footer class="form-footer">
          <button type="submit" id="btn-submit-prod" class="btn-primary form-submit">
            Salvar Produto
          </button>
        </footer>
      </form>

      <dialog id="modal-crop-produto" class="modal">
        <div class="modal-content cropper-modal-content">
          <header class="modal-header">
            <h3>Ajustar imagem</h3>
            <button type="button" class="btn-close" id="btn-close-crop">&times;</button>
          </header>

          <div class="cropper-layout">
            <div class="cropper-preview">
              <img id="crop-image" alt="Prévia para corte" class="cropper-image">
            </div>

            <div class="cropper-controls">
              <label class="cropper-zoom">
                <span>Zoom</span>
                <input id="crop-zoom" type="range" min="1" max="3" step="0.01" value="1">
              </label>

              <div class="cropper-actions">
                <button type="button" class="btn-action" id="btn-cancel-crop">Cancelar</button>
                <button type="button" class="btn-primary" id="btn-apply-crop">Aplicar corte</button>
              </div>
            </div>
          </div>
        </div>
      </dialog>
    `;

    this.querySelector("#form-produto-interno").addEventListener(
      "submit",
      this.handleSubmit.bind(this),
    );

    this.querySelector("#prod-imagem").addEventListener(
      "change",
      this.handleImageSelected.bind(this),
    );

    this.querySelector("#btn-close-crop").addEventListener("click", () =>
      this.closeCropModal(true),
    );
    this.querySelector("#btn-cancel-crop").addEventListener("click", () =>
      this.closeCropModal(true),
    );
    this.querySelector("#btn-apply-crop").addEventListener("click", () =>
      this.applyCrop(),
    );

    this.querySelector("#crop-zoom").addEventListener("input", (e) => {
      if (!this._cropper) return;
      this._cropper.zoomTo(Number(e.target.value));
    });
  }

  setFeedback(message, type) {
    setFeedbackState(this.querySelector("#feedback-produto"), message, type);
  }

  clearFeedback() {
    clearFeedbackState(this.querySelector("#feedback-produto"));
  }

  handleImageSelected(e) {
    const input = e.target;
    const files = Array.from(input.files || []);
    const firstFile = files[0];
    this._croppedFile = null;
    this._selectedFiles = files;

    if (!firstFile) return;

    const currentImgName = this.querySelector("#current-img-name");
    if (files.length > 1) {
      if (currentImgName) {
        currentImgName.textContent = `${files.length} imagens selecionadas para envio.`;
      }
      return;
    }

    const modal = this.querySelector("#modal-crop-produto");
    const img = this.querySelector("#crop-image");
    const zoom = this.querySelector("#crop-zoom");

    zoom.value = "1";
    if (this._cropper) {
      this._cropper.destroy();
      this._cropper = null;
    }

    const url = URL.createObjectURL(firstFile);
    img.onload = () => URL.revokeObjectURL(url);
    img.src = url;

    modal.showModal();

    // eslint-disable-next-line no-undef
    this._cropper = new Cropper(img, {
      aspectRatio: 1,
      viewMode: 1,
      dragMode: "move",
      autoCropArea: 1,
      background: false,
      responsive: true,
      movable: true,
      zoomable: true,
      rotatable: false,
      scalable: false,
    });
  }

  closeCropModal(clearSelection = false) {
    const modal = this.querySelector("#modal-crop-produto");
    const input = this.querySelector("#prod-imagem");

    if (this._cropper) {
      this._cropper.destroy();
      this._cropper = null;
    }

    if (clearSelection) {
      this._croppedFile = null;
      this._selectedFiles = [];
      if (input) input.value = "";
      const currentImgName = this.querySelector("#current-img-name");
      if (currentImgName) currentImgName.textContent = "";
    }

    if (modal?.open) modal.close();
  }

  async applyCrop() {
    if (!this._cropper) return;

    const original = this.querySelector("#prod-imagem")?.files?.[0];
    if (!original) return;

    const canvas = this._cropper.getCroppedCanvas({
      width: 1024,
      height: 1024,
      imageSmoothingEnabled: true,
      imageSmoothingQuality: "high",
    });

    const blob = await new Promise((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", 0.85),
    );
    if (!blob) return;

    const safeBase =
      (original.name || "produto")
        .replace(/\.[^/.]+$/, "")
        .replace(/[^\w-]+/g, "_") || "produto";

    this._croppedFile = new File([blob], `${safeBase}.jpg`, {
      type: "image/jpeg",
    });
    this._selectedFiles = [this._croppedFile];

    const currentImgName = this.querySelector("#current-img-name");
    if (currentImgName) {
      currentImgName.textContent = `Imagem ajustada: ${this._croppedFile.name}`;
    }

    this.closeCropModal(false);
  }

  async handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const submitBtn = this.querySelector("#btn-submit-prod");

    this.clearFeedback();
    submitBtn.disabled = true;
    const originalText = submitBtn.textContent;
    submitBtn.textContent = "Enviando arquivo...";

    const formData = new FormData(form);
    formData.delete("imagens");
    formData.delete("imagem");

    if (this._croppedFile) {
      formData.append("imagem", this._croppedFile, this._croppedFile.name);
    } else {
      this._selectedFiles.forEach((file) => {
        formData.append("imagens", file, file.name);
      });
    }

    this._existingImages.forEach((image) => {
      formData.append("imagens", image);
    });

    const id = formData.get("id");
    const method = id ? "PUT" : "POST";
    const endpoint = id ? `/produtos/${id}` : "/produtos";

    try {
      const res = await apiFetch(endpoint, {
        method,
        body: formData,
      });

      if (res.ok) {
        this.setFeedback("Produto salvo com sucesso!", "success");
        if (!id) form.reset();

        this.dispatchEvent(
          new CustomEvent("produto-success", {
            bubbles: true,
            composed: true,
            detail: res.dados,
          }),
        );
      } else {
        throw new Error(res.dados?.mensagem || "Erro ao processar produto");
      }
    } catch (error) {
      this.setFeedback(error.message, "error");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  }

  fillData(prod) {
    const form = this.querySelector("#form-produto-interno");
    if (!form) return;

    form.querySelector("#prod-id").value = prod._id || "";
    form.querySelector("#prod-nome").value = prod.nome || "";
    form.querySelector("#prod-categoria").value = prod.categoria || "";
    form.querySelector("#prod-preco").value = prod.precoBase || "";
    form.querySelector("#prod-prazo").value = prod.prazoProducaoDias || "";
    form.querySelector("#prod-descricao").value = prod.descricao || "";

    this._existingImages = Array.isArray(prod.imagens)
      ? [...prod.imagens]
      : prod.imagem
        ? [prod.imagem]
        : [];

    const currentImgName = this.querySelector("#current-img-name");
    currentImgName.textContent = this._existingImages.length
      ? `${this._existingImages.length} imagem(ns) já cadastrada(s).`
      : "";

    const existingImages = this.querySelector("#existing-images");
    existingImages.textContent = this._existingImages.length
      ? this._existingImages.map((image) => image.split("/").pop()).join(", ")
      : "";

    this.clearFeedback();
  }

  reset() {
    const form = this.querySelector("#form-produto-interno");
    if (form) {
      form.reset();
      form.querySelector("#prod-id").value = "";
    }

    this._croppedFile = null;
    this._selectedFiles = [];
    this._existingImages = [];
    this.querySelector("#current-img-name").textContent = "";
    this.querySelector("#existing-images").textContent = "";
    this.clearFeedback();
  }
}

if (!customElements.get("produto-form")) {
  customElements.define("produto-form", ProdutoForm);
}
