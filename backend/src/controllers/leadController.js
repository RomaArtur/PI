import Lead from "../models/Lead.js";
import * as LeadService from "../services/leadService.js";

class LeadController {
  static criarLead = async (req, res) => {
    try {
      const novoLead = new Lead(req.body);
      await novoLead.save();
      res.status(201).json({
        mensagem: "Lead criado com sucesso",
        dados: novoLead,
      });
    } catch (erro) {
      res.status(400).json({
        mensagem: "Erro ao criar lead",
        erro: erro.message,
      });
    }
  };

  static editarLead = async (req, res) => {
    const { id } = req.params;
    try {
      const LeadAtualizado = await Lead.findByIdAndUpdate(id, req.body, {
        returnDocument: "after",
      });
      if (!LeadAtualizado)
        return res.status(404).json({ mensagem: "Lead não encontrado" });
      res.status(200).json({ dados: LeadAtualizado });
    } catch (erro) {
      res.status(400).json({
        mensagem: "Erro ao editar lead",
        erro: erro.message,
      });
    }
  };

  static excluirLead = async (req, res) => {
    const { id } = req.params;
    try {
      const deletado = await Lead.findByIdAndDelete(id);
      if (!deletado)
        return res.status(404).json({ mensagem: "Lead não encontrado" });
      res.status(200).json({ mensagem: "Lead excluído com sucesso" });
    } catch (erro) {
      res.status(400).json({
        mensagem: "Erro ao excluir lead",
        erro: erro.message,
      });
    }
  };

  static listarLeads = async (req, res) => {
    try {
      const {
        page = 1,
        limit = 10,
        busca,
        sort = "createdAt",
        order = "desc",
      } = req.query;
      const query = {};

      if (busca) {
        query.$or = [
          { nome: { $regex: busca, $options: "i" } },
          { sobrenome: { $regex: busca, $options: "i" } },
          { email: { $regex: busca, $options: "i" } },
          { whatsapp: { $regex: busca, $options: "i" } },
        ];
      }

      const skip = (Number(page) - 1) * Number(limit);
      const total = await Lead.countDocuments(query);
      const leads = await Lead.find(query)
        .sort({ [sort]: order === "asc" ? 1 : -1 })
        .skip(skip)
        .limit(Number(limit));

      res.status(200).json({
        dados: leads,
        total,
        page: Number(page),
        totalPages: Math.ceil(total / Number(limit)) || 1,
      });
    } catch (erro) {
      res.status(500).json({
        mensagem: "Erro ao listar leads",
        erro: erro.message,
      });
    }
  };

  static buscarLeadPorId = async (req, res) => {
    const { id } = req.params;
    try {
      const lead = await Lead.findById(id);
      if (!lead)
        return res.status(404).json({ mensagem: "Lead não encontrado" });
      res.status(200).json({ dados: lead });
    } catch (erro) {
      res.status(500).json({
        mensagem: "Erro ao buscar lead",
        erro: erro.message,
      });
    }
  };

  static buscarEventosDoDia = async (req, res) => {
    try {
      const aniversariantes = await LeadService.obterEventosDoDia();
      res.status(200).json({ dados: aniversariantes });
    } catch (erro) {
      res.status(500).json({
        mensagem: "Erro ao buscar eventos do dia",
        erro: erro.message,
      });
    }
  };
}

export default LeadController;
