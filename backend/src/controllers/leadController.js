import Lead from "../models/Lead.js";
import * as LeadService from "../services/leadService.js";

class LeadController {
  static criarLead = async (req, res) => {
    try {
      const novoLead = new Lead(req.body);
      await novoLead.save();
      res.status(201).json({
        message: "Lead criado com sucesso",
        lead: novoLead,
      });
    } catch (error) {
      res
        .status(400)
        .json({ message: "Erro ao criar lead", error: error.message });
    }
  };

  static editarLead = async (req, res) => {
    const { id } = req.params;
    try {
      const LeadAtualizado = await Lead.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      res.status(200).json(LeadAtualizado);
    } catch (error) {
      res
        .status(400)
        .json({ message: "Erro ao editar lead", error: error.message });
    }
  };

  static excluirLead = async (req, res) => {
    const { id } = req.params;
    try {
      await Lead.findByIdAndDelete(id);
      res.status(200).json({ message: "Lead excluído com sucesso" });
    } catch (error) {
      res
        .status(400)
        .json({ message: "Erro ao excluir lead", error: error.message });
    }
  };

  static listarLeads = async (req, res) => {
    try {
      const leads = await Lead.find().sort({ createdAt: -1 });
      res.status(200).json(leads);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Erro ao listar leads", error: error.message });
    }
  };

  static buscarLeadPorId = async (req, res) => {
    const { id } = req.params;
    try {
      const lead = await Lead.findById(id);
      if (!lead) {
        return res.status(404).json({ message: "Lead não encontrado" });
      }
      res.status(200).json(lead);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Erro ao buscar lead", error: error.message });
    }
  };

  static buscarEventosDoDia = async (req, res) => {
    try {
      const aniversariantes = await LeadService.obterEventosDoDia();

      res.status(200).json(aniversariantes);
    } catch (error) {
      res.status(500).json({
        message: "Erro ao buscar eventos do dia",
        error: error.message,
      });
    }
  };
}

export default LeadController;
