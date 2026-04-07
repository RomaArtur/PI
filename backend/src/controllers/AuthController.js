import Vendedor from "../models/Vendedor.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

class AuthController {
  static login = async (req, res) => {
    try {
      const { email, senha } = req.body;

      const vendedor = await Vendedor.findOne({ email });
      if (!vendedor) {
        return res.status(401).json({ mensagem: "E-mail ou senha inválidos." });
      }

      const senhaValida = await bcrypt.compare(senha, vendedor.senha);
      if (!senhaValida) {
        return res.status(401).json({ mensagem: "E-mail ou senha inválidos." });
      }

      const token = jwt.sign(
        { id: vendedor._id },
        "chave_secreta_super_segura_do_pi_2024",
        { expiresIn: "1d" },
      );

      res.status(200).json({
        mensagem: "Login realizado com sucesso!",
        token: token,
        dono: {
          id: vendedor._id,
          nome: vendedor.nome,
          email: vendedor.email,
        },
      });
    } catch (erro) {
      res
        .status(500)
        .json({ mensagem: "Erro ao fazer login", erro: erro.message });
    }
  };
}

export default AuthController;
