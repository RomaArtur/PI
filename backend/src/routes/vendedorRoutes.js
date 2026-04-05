import express from "express";
import VendedorController from "../controllers/VendedorController.js";
import { validarDados } from "../middlewares/validarDados.js";
import { vendedorSchemaZod } from "../validations/vendedorValidation.js";

const router = express.Router();

router.get("/", VendedorController.listarVendedores);

router.post(
  "/",
  validarDados(vendedorSchemaZod),
  VendedorController.registrarVendedor,
);

router.get("/:id", VendedorController.buscarVendedorPorId);
router.put("/:id", VendedorController.editarVendedor);
router.delete("/:id", VendedorController.excluirVendedor);

export default router;
