import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: true,
      trim: true,
    },
    sobrenome: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    whatsapp: {
      type: String,
      required: true,
      trim: true,
    },
    consentimento: {
      type: Boolean,
      required: true,
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
