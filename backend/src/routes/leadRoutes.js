import express from "express";
import LeadController from "../controllers/LeadController.js";
import { validarDadosLead } from "../middlewares/validarDadosLead.js";
import { leadSchemaZod } from "../validations/leadValidation.js";

const router = express.Router();

router.get("/", LeadController.listarLeads);
router.post("/", validarDadosLead(leadSchemaZod), LeadController.criarLead);

router.get("/hoje", LeadController.buscarEventosDoDia);

router.get("/:id", LeadController.buscarLeadPorId);
router.put("/:id", validarDadosLead(leadSchemaZod), LeadController.editarLead);
router.delete("/:id", LeadController.excluirLead);

export default router;
