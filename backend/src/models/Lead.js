import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: [true, "O nome é obrigatório"],
    },
    sobrenome: {
      type: String,
      required: [true, "O sobrenome é obrigatório"],
    },
    email: {
      type: String,
      required: [true, "O email é obrigatório"],
    },
    whatsapp: {
      type: String,
      required: [true, "O número de WhatsApp é obrigatório"],
    },
    consentimento: {
      type: Boolean,
      required: [true, "O consentimento é obrigatório"],
      default: false,
    },
    interesses: {
      type: [String],
    },
    dataNascimento: {
      type: Date,
    },
    datasComemorativas: {
      descricao: {
        type: String,
      },
      data: {
        type: Date,
      },
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Lead", leadSchema);
