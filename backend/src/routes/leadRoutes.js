import express from "express";
import LeadController from "../controllers/LeadController.js";
import { validarDados } from "../middlewares/validarDados.js";
import { leadSchemaZod } from "../validations/leadValidation.js";

const router = express.Router();

router.get("/", LeadController.listarLeads);
router.post("/", validarDados(leadSchemaZod), LeadController.criarLead);

router.get("/hoje", LeadController.buscarEventosDoDia);

router.get("/:id", LeadController.buscarLeadPorId);
router.put("/:id", validarDados(leadSchemaZod), LeadController.editarLead);
router.delete("/:id", LeadController.excluirLead);

export default router;
