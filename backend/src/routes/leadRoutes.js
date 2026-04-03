import express from 'express';
import { criarLead } from '../controllers/leadController.js';

const router = express.Router();

router.post("/leads", criarLead); 

export default router;