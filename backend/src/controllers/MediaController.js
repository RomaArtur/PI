import fs from "fs";
import path from "path";
import MediaAsset from "../models/MediaAsset.js";

const UPLOADS_DIR = path.resolve("uploads");

const tryDeleteUploadByUrl = (url) => {
  try {
    if (!url || typeof url !== "string" || !url.startsWith("/uploads/")) {
      return false;
    }

    const filePath = path.join(UPLOADS_DIR, path.basename(url));
    if (!fs.existsSync(filePath)) return false;

    fs.unlinkSync(filePath);
    return true;
  } catch {
    return false;
  }
};

class MediaController {
  static listar = async (req, res) => {
    try {
      const assets = await MediaAsset.find().sort({ createdAt: -1 }).limit(100);
      res.status(200).json({ dados: assets });
    } catch (erro) {
      res.status(500).json({
        mensagem: "Erro ao listar biblioteca de imagens",
        erro: erro.message,
      });
    }
  };

  static upload = async (req, res) => {
    try {
      const files = req.files || [];
      if (!files.length) {
        return res.status(400).json({ mensagem: "Nenhuma imagem enviada." });
      }

      const assets = await MediaAsset.insertMany(
        files.map((file) => ({
          originalName: file.originalname,
          fileName: file.filename,
          mimeType: file.mimetype,
          size: file.size,
          url: `/uploads/${file.filename}`,
          source: "biblioteca",
        })),
      );

      res.status(201).json({
        mensagem: "Imagens enviadas com sucesso!",
        dados: assets,
      });
    } catch (erro) {
      res.status(400).json({
        mensagem: "Erro ao enviar imagens para a biblioteca",
        erro: erro.message,
      });
    }
  };

  static excluir = async (req, res) => {
    try {
      const asset = await MediaAsset.findByIdAndDelete(req.params.id);
      if (!asset) {
        return res.status(404).json({ mensagem: "Imagem não encontrada." });
      }

      tryDeleteUploadByUrl(asset.url);
      res.status(200).json({ mensagem: "Imagem removida com sucesso!" });
    } catch (erro) {
      res.status(400).json({
        mensagem: "Erro ao excluir imagem",
        erro: erro.message,
      });
    }
  };
}

export default MediaController;
