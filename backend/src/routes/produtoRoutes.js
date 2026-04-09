import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import ProdutoController from "../controllers/ProdutoController.js";
import { validarDados } from "../middlewares/validarDados.js";
import { produtoSchemaZod } from "../validations/produtoValidation.js";
import { checarAutenticacao } from "../middlewares/authMiddleware.js";

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

// Garante a existência do diretório de uploads de forma síncrona na inicialização
const uploadDir = path.resolve("uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuração de armazenamento local para uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limite de 5MB
});

router.get("/", ProdutoController.listarProdutos);

// Captura erros do multer com evidência de runtime
const uploadSingleImagem = (req, res, next) => {
  upload.single("imagem")(req, res, (err) => {
    if (err) {
      agentAppendLog({
        sessionId: "5768e2",
        runId: "pre-fix",
        hypothesisId: "H8",
        location: "backend/src/routes/produtoRoutes.js:uploadSingleImagem",
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
        mensagem: "Erro no upload da imagem",
        erro: err?.message || String(err),
      });
    }

    agentAppendLog({
      sessionId: "5768e2",
      runId: "pre-fix",
      hypothesisId: "H8",
      location: "backend/src/routes/produtoRoutes.js:uploadSingleImagem",
      message: "multer upload ok",
      data: {
        hasFile: !!req.file,
        fileName: req.file?.filename,
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
  uploadSingleImagem,
  validarDados(produtoSchemaZod),
  ProdutoController.registrarProduto,
);

router.put(
  "/:id",
  checarAutenticacao,
  uploadSingleImagem,
  ProdutoController.editarProduto,
);

router.delete("/:id", checarAutenticacao, ProdutoController.excluirProduto);

export default router;
