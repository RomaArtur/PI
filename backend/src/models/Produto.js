import mongoose from "mongoose";

const produtoSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: true,
    },
    descricao: {
      type: String,
      required: true,
    },
    precoBase: {
      type: Number,
      required: true, 
    },
    prazoProducaoDias: {
      type: Number,
      required: true, 
    },
    categoria: {
      type: String,
      required: true, 
    },
    ativo: {
      type: Boolean,
      default: true, 
    },
  },
  { timestamps: true },
);

export default mongoose.model("Produto", produtoSchema);
