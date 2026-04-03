import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: [true, "O nome é obrigatório"],
      trim: true,
    },
    sobrenome: {
      type: String,
      required: [true, "O sobrenome é obrigatório"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "O email é obrigatório"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    whatsapp: {
      type: String,
      required: [true, "O número de WhatsApp é obrigatório"],
      trim: true,
    },
    consentimento: {
      type: Boolean,
      required: [true, "O consentimento é obrigatório"],
      default: false,
    },
    interesses: { type: [String], default: [] },
    dataNascimento: { type: Date },

    datasComemorativas: [
      {
        nomeEvento: { type: String, default: "Data importante" },
        data: { type: Date },
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.model("Lead", leadSchema);
