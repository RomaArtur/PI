import express from "express";
import LeadController from "../controllers/leadController.js";

const router = express.Router();

router.get("/", LeadController.listarLeads);
router.post("/", LeadController.criarLead);

router.get("/hoje", LeadController.buscarEventosDoDia);

router.get("/:id", LeadController.buscarLeadPorId);
router.put("/:id", LeadController.editarLead);
router.delete("/:id", LeadController.excluirLead);

export default router;
