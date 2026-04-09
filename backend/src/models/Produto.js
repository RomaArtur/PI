import mongoose from "mongoose";

const produtoSchema = new mongoose.Schema(
  {
    nome: { type: String, required: true },
    categoria: { type: String, required: true },
    precoBase: { type: Number, required: true },
    prazoProducaoDias: { type: Number, required: true },
    descricao: { type: String, required: true },
    imagem: { type: String }, 
    ativo: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const Produto = mongoose.model("Produto", produtoSchema);
export default Produto;
