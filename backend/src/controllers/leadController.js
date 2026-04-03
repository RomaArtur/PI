import Lead from "../models/Lead.js";

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
}

export default LeadController;
