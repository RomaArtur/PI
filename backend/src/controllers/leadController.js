import Lead from "../models/Lead.js";
import * as LeadService from "../services/leadService.js";

class LeadController {
  static criarLead = async (req, res) => {
    try {
      const novoLead = new Lead(req.body);
      await novoLead.save();
      res.status(201).json({
        mensagem: "Lead criado com sucesso",
        lead: novoLead,
      });
    } catch (erro) {
      res
        .status(400)
        .json({ mensagem: "Erro ao criar lead", erro: erro.mensagem });
    }
  };

  static editarLead = async (req, res) => {
    const { id } = req.params;
    try {
      const LeadAtualizado = await Lead.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      res.status(200).json(LeadAtualizado);
    } catch (erro) {
      res
        .status(400)
        .json({ mensagem: "Erro ao editar lead", erro: erro.mensagem });
    }
  };

  static excluirLead = async (req, res) => {
    const { id } = req.params;
    try {
      await Lead.findByIdAndDelete(id);
      res.status(200).json({ mensagem: "Lead excluído com sucesso" });
    } catch (erro) {
      res
        .status(400)
        .json({ mensagem: "Erro ao excluir lead", erro: erro.mensagem });
    }
  };

  static listarLeads = async (req, res) => {
    try {
      const leads = await Lead.find().sort({ createdAt: -1 });
      res.status(200).json(leads);
    } catch (erro) {
      res
        .status(500)
        .json({ mensagem: "Erro ao listar leads", erro: erro.mensagem });
    }
  };

  static buscarLeadPorId = async (req, res) => {
    const { id } = req.params;
    try {
      const lead = await Lead.findById(id);
      if (!lead) {
        return res.status(404).json({ mensagem: "Lead não encontrado" });
      }
      res.status(200).json(lead);
    } catch (erro) {
      res
        .status(500)
        .json({ mensagem: "Erro ao buscar lead", erro: erro.mensagem });
    }
  };

  static buscarEventosDoDia = async (req, res) => {
    try {
      const aniversariantes = await LeadService.obterEventosDoDia();

      res.status(200).json(aniversariantes);
    } catch (erro) {
      res.status(500).json({
        mensagem: "Erro ao buscar eventos do dia",
        erro: erro.mensagem,
      });
    }
  };
}

export default LeadController;
