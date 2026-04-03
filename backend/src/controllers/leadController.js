import Lead from "../models/Lead.js";

export const criarLead = async (req, res) => {
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
      .json({ message: "Erro ao criar lead", erro: error.message });
  }
};
