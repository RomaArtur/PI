import express from "express";
import VendedorController from "../controllers/VendedorController.js";
import { checarAutenticacao } from "../middlewares/authMiddleware.js";
import { validarDados } from "../middlewares/validarDados.js";
import { vendedorSchemaZod } from "../validations/vendedorValidation.js";

const router = express.Router();

router.get("/", checarAutenticacao, VendedorController.listarVendedores);

router.post(
  "/",
  validarDados(vendedorSchemaZod),
  VendedorController.registrarVendedor,
);

router.get("/:id", checarAutenticacao, VendedorController.buscarVendedorPorId);
router.put("/:id", checarAutenticacao, VendedorController.editarVendedor);
router.delete("/:id", checarAutenticacao, VendedorController.excluirVendedor);

export default router;
