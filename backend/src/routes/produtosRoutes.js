import express from "express";
import ProdutoController from "../controllers/ProdutoController.js";
import { validarDados } from "../middlewares/validarDados.js";
import { produtoSchemaZod } from "../validations/produtoValidation.js";
import { checarAutenticacao } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", ProdutoController.listarProdutosAtivos);

router.post(
  "/",
  checarAutenticacao,
  validarDados(produtoSchemaZod),
  ProdutoController.registrarProduto,
);
router.put("/:id", checarAutenticacao, ProdutoController.editarProduto);
router.delete("/:id", checarAutenticacao, ProdutoController.excluirProduto);

export default router;
