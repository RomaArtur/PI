import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const vendedorSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    senha: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

vendedorSchema.pre("save", async function () {
  
  if (!this.isModified("senha")) return;

  const salt = await bcrypt.genSalt(10);
  this.senha = await bcrypt.hash(this.senha, salt);
});

vendedorSchema.methods.compararSenha = async function (senhaDigitada) {
  return await bcrypt.compare(senhaDigitada, this.senha);
};

const Vendedor = mongoose.model("Vendedor", vendedorSchema);

export default Vendedor;
