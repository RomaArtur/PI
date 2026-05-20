/* global process */
import express from "express";
import fs from "fs";
import path from "path";
import ProdutoController from "../controllers/ProdutoController.js";
import { validarDados } from "../middlewares/validarDados.js";
import { produtoSchemaZod } from "../validations/produtoValidation.js";
import { checarAutenticacao } from "../middlewares/authMiddleware.js";
import { upload, uploadDir } from "../utils/uploads.js";

const router = express.Router();
const AGENT_DEBUG_ENABLED = process.env.ENABLE_AGENT_DEBUG === "true";

const agentAppendLog = (payload) => {
  if (!AGENT_DEBUG_ENABLED) return;
  try {
    const logPath = path.resolve(process.cwd(), "debug-5768e2.log");
    fs.appendFileSync(logPath, `${JSON.stringify(payload)}\n`, "utf8");
  } catch {
    // ignore
  }
};

router.get("/", ProdutoController.listarProdutos);

const uploadProdutoImagens = (req, res, next) => {
  upload.fields([
    { name: "imagem", maxCount: 1 },
    { name: "imagens", maxCount: 8 },
  ])(req, res, (err) => {
    if (err) {
      agentAppendLog({
        sessionId: "5768e2",
        runId: "pre-fix",
        hypothesisId: "H8",
        location: "backend/src/routes/produtoRoutes.js:uploadProdutoImagens",
        message: "multer upload error",
        data: {
          name: err?.name,
          code: err?.code,
          message: err?.message,
          field: err?.field,
        },
        timestamp: Date.now(),
      });
      return res.status(400).json({
        mensagem: "Erro no upload das imagens",
        erro: err?.message || String(err),
      });
    }

    const singleFile = req.files?.imagem?.[0];
    const multiFiles = req.files?.imagens || [];
    req.uploadedProdutoFiles = [singleFile, ...multiFiles].filter(Boolean);

    agentAppendLog({
      sessionId: "5768e2",
      runId: "pre-fix",
      hypothesisId: "H8",
      location: "backend/src/routes/produtoRoutes.js:uploadProdutoImagens",
      message: "multer upload ok",
      data: {
        filesCount: req.uploadedProdutoFiles.length,
        fileNames: req.uploadedProdutoFiles.map((file) => file.filename),
        bodyKeys: Object.keys(req.body || {}),
        uploadDir,
      },
      timestamp: Date.now(),
    });
    next();
  });
};

router.post(
  "/",
  checarAutenticacao,
  uploadProdutoImagens,
  validarDados(produtoSchemaZod),
  ProdutoController.registrarProduto,
);

router.put(
  "/:id",
  checarAutenticacao,
  uploadProdutoImagens,
  ProdutoController.editarProduto,
);

router.delete("/:id", checarAutenticacao, ProdutoController.excluirProduto);

export default router;
