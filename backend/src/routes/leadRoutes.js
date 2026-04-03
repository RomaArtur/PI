import express from 'express';
import LeadController from '../controllers/leadController.js';

const router = express.Router();

router.post("/", LeadController.criarLead);
router.get("/", LeadController.listarLeads);

export default router;