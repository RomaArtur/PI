import express from "express";
import LeadController from "../controllers/LeadController.js";
import { validarDados } from "../middlewares/validarDados.js";
import { leadSchemaZod } from "../validations/leadValidation.js";
import { checarAutenticacao } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", checarAutenticacao, LeadController.listarLeads);
router.post("/", validarDados(leadSchemaZod), LeadController.criarLead);

router.get("/hoje", LeadController.buscarEventosDoDia);

router.get("/:id", checarAutenticacao, LeadController.buscarLeadPorId);
router.put("/:id", checarAutenticacao, validarDados(leadSchemaZod), LeadController.editarLead);
router.delete("/:id", checarAutenticacao, LeadController.excluirLead);

export default router;
