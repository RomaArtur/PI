/* global process */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import MediaAsset from "../models/MediaAsset.js";
import Produto from "../models/Produto.js";
import { filesToWebPaths } from "../utils/uploads.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DEBUG_LOG_PATH = path.resolve(__dirname, "../../..", "debug-5768e2.log");
const UPLOADS_DIR = path.resolve(__dirname, "..", "..", "uploads");
const AGENT_DEBUG_ENABLED = process.env.ENABLE_AGENT_DEBUG === "true";

const agentAppendLog = (payload) => {
  if (!AGENT_DEBUG_ENABLED) return;
  try {
    fs.appendFileSync(DEBUG_LOG_PATH, `${JSON.stringify(payload)}\n`, "utf8");
  } catch {
    // ignore
  }
};

const tryDeleteUploadByWebPath = (webPath) => {
  try {
    if (!webPath || typeof webPath !== "string") return false;
    if (!webPath.startsWith("/uploads/")) return false;

    const filePath = path.join(UPLOADS_DIR, path.basename(webPath));
    if (!fs.existsSync(filePath)) return false;

    fs.unlinkSync(filePath);
    return true;
  } catch {
    return false;
  }
};

const normalizeBodyImages = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value !== "string") return [];

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
};

const buildProdutoImages = (payload = {}, uploadedFiles = [], fallbackImages = []) => {
  const hasExplicitImages = Object.prototype.hasOwnProperty.call(payload, "imagens");
  const bodyImages = normalizeBodyImages(payload.imagens);
  const uploadedPaths = filesToWebPaths(uploadedFiles);
  const legacyImage =
    typeof payload.imagem === "string" && payload.imagem.trim()
      ? [payload.imagem.trim()]
      : [];
  const fallback = hasExplicitImages ? [] : fallbackImages;
  const imagens = [...bodyImages, ...uploadedPaths, ...legacyImage, ...fallback].filter(
    Boolean,
  );
  const uniqueImages = [...new Set(imagens)];

  return {
    imagem: uniqueImages[0] || "",
    imagens: uniqueImages,
  };
};

const syncMediaAssets = async ({ produtoId, uploadedFiles = [], source = "produto" }) => {
  if (!uploadedFiles.length) return;

  await MediaAsset.insertMany(
    uploadedFiles.map((file) => ({
      originalName: file.originalname,
      fileName: file.filename,
      mimeType: file.mimetype,
      size: file.size,
      url: `/uploads/${file.filename}`,
      source,
      produtoId,
    })),
  );
};

class ProdutoController {
  static registrarProduto = async (req, res) => {
    try {
      agentAppendLog({
        sessionId: "5768e2",
        runId: "pre-fix",
        hypothesisId: "H2",
        location: "backend/src/controllers/ProdutoController.js:registrarProduto",
        message: "registrarProduto entry",
        data: {
          bodyKeys: Object.keys(req.body || {}),
          filesCount: req.uploadedProdutoFiles?.length || 0,
        },
        timestamp: Date.now(),
      });

      const payload = { ...req.body };
      Object.assign(payload, buildProdutoImages(payload, req.uploadedProdutoFiles));

      const novoProduto = await Produto.create(payload);
      await syncMediaAssets({
        produtoId: novoProduto._id,
        uploadedFiles: req.uploadedProdutoFiles,
      });

      res.status(201).json({
        mensagem: "Produto cadastrado com sucesso!",
        dados: novoProduto,
      });
    } catch (erro) {
      res.status(400).json({ mensagem: "Dados inválidos", erro: erro.message });
    }
  };

  static listarProdutos = async (req, res) => {
    try {
      const {
        admin,
        busca,
        sort = "createdAt",
        order = "desc",
        page = 1,
        limit = 10,
      } = req.query;
      const filtro = {};

      if (admin !== "true") {
        filtro.ativo = true;
      }

      if (busca) {
        filtro.$or = [
          { nome: { $regex: busca, $options: "i" } },
          { descricao: { $regex: busca, $options: "i" } },
          { categoria: { $regex: busca, $options: "i" } },
        ];
      }

      const skip = (Number(page) - 1) * Number(limit);
      const total = await Produto.countDocuments(filtro);
      const produtos = await Produto.find(filtro)
        .sort({ [sort]: order === "asc" ? 1 : -1 })
        .skip(skip)
        .limit(Number(limit));

      res.status(200).json({
        dados: produtos,
        total,
        page: Number(page),
        totalPages: Math.ceil(total / Number(limit)) || 1,
      });
    } catch (erro) {
      res.status(500).json({
        mensagem: "Erro interno ao listar produtos",
        erro: erro.message,
      });
    }
  };

  static editarProduto = async (req, res) => {
    try {
      const { id } = req.params;
      const existente = await Produto.findById(id);
      if (!existente) {
        return res.status(404).json({ mensagem: "Produto não encontrado." });
      }

      const oldImagens = Array.isArray(existente.imagens)
        ? existente.imagens
        : existente.imagem
          ? [existente.imagem]
          : [];

      const payload = { ...req.body };
      Object.assign(
        payload,
        buildProdutoImages(
          payload,
          req.uploadedProdutoFiles,
          req.uploadedProdutoFiles?.length ? [] : oldImagens,
        ),
      );

      const produtoAtualizado = await Produto.findByIdAndUpdate(id, payload, {
        returnDocument: "after",
      });

      if (!produtoAtualizado) {
        return res.status(404).json({ mensagem: "Produto não encontrado." });
      }

      await syncMediaAssets({
        produtoId: produtoAtualizado._id,
        uploadedFiles: req.uploadedProdutoFiles,
      });

      const removedImages = oldImagens.filter(
        (image) => !produtoAtualizado.imagens?.includes(image),
      );

      for (const image of removedImages) {
        const deleted = tryDeleteUploadByWebPath(image);
        await MediaAsset.deleteMany({ produtoId: produtoAtualizado._id, url: image });
        agentAppendLog({
          sessionId: "5768e2",
          runId: "pre-fix",
          hypothesisId: "H9",
          location: "backend/src/controllers/ProdutoController.js:editarProduto",
          message: "deleted old upload on replace",
          data: { oldImagem: image, deleted },
          timestamp: Date.now(),
        });
      }

      res.status(200).json({
        mensagem: "Produto atualizado com sucesso!",
        dados: produtoAtualizado,
      });
    } catch (erro) {
      res.status(400).json({
        mensagem: "Erro ao atualizar produto",
        erro: erro.message,
      });
    }
  };

  static excluirProduto = async (req, res) => {
    try {
      const { id } = req.params;
      const existente = await Produto.findById(id);
      if (!existente) {
        return res.status(404).json({ mensagem: "Produto não encontrado." });
      }

      const imagens = Array.isArray(existente.imagens)
        ? existente.imagens
        : existente.imagem
          ? [existente.imagem]
          : [];

      const deletado = await Produto.findByIdAndDelete(id);
      if (!deletado) {
        return res.status(404).json({ mensagem: "Produto não encontrado." });
      }

      for (const imagem of imagens) {
        const deleted = tryDeleteUploadByWebPath(imagem);
        agentAppendLog({
          sessionId: "5768e2",
          runId: "pre-fix",
          hypothesisId: "H9",
          location: "backend/src/controllers/ProdutoController.js:excluirProduto",
          message: "deleted upload on produto delete",
          data: { imagem, deleted },
          timestamp: Date.now(),
        });
      }

      await MediaAsset.deleteMany({ produtoId: id });
      res.status(200).json({ mensagem: "Produto excluído com sucesso!" });
    } catch (erro) {
      res.status(400).json({
        mensagem: "Erro ao excluir produto",
        erro: erro.message,
      });
    }
  };
}

export default ProdutoController;
