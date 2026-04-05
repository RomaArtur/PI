import Vendedor from "../models/Vendedor.js";

class VendedorController {
  static registrarVendedor = async (req, res) => {
    try {
      const quantidadeDonos = await Vendedor.countDocuments();
      if (quantidadeDonos >= 1) {
        return res.status(403).json({
          mensagem: "Acesso negado: O sistema já possui um dono cadastrado.",
        });
      }

      const emailExiste = await Vendedor.findOne({ email: req.body.email });
      if (emailExiste) {
        return res
          .status(400)
          .json({ mensagem: "Este e-mail já está cadastrado no sistema." });
      }

      const novoVendedor = await Vendedor.create(req.body);

      const vendedorSemSenha = novoVendedor.toObject();
      delete vendedorSemSenha.senha;

      res.status(201).json({
        mensagem: "Dono da loja cadastrado com sucesso!",
        dados: vendedorSemSenha,
      });
    } catch (erro) {
      res
        .status(400)
        .json({ mensagem: "Erro ao cadastrar", erro: erro.message });
    }
  };

  static listarVendedores = async (req, res) => {
    try {
      const vendedores = await Vendedor.find().select("-senha");
      res.status(200).json({ dados: vendedores });
    } catch (erro) {
      res
        .status(400)
        .json({ mensagem: "Erro ao listar vendedores", erro: erro.message });
    }
  };

  static editarVendedor = async (req, res) => {
    try {
      const { id } = req.params;
      const dadosAtualizados = req.body;

      const vendedor = await Vendedor.findById(id);
      if (!vendedor) {
        return res.status(404).json({ mensagem: "Vendedor não encontrado." });
      }

      if (dadosAtualizados.nome) vendedor.nome = dadosAtualizados.nome;
      if (dadosAtualizados.email) vendedor.email = dadosAtualizados.email;
      if (dadosAtualizados.senha) vendedor.senha = dadosAtualizados.senha;

      await vendedor.save();

      const vendedorSemSenha = vendedor.toObject();
      delete vendedorSemSenha.senha;

      res.status(200).json({
        mensagem: "Dados do vendedor atualizados com sucesso!",
        dados: vendedorSemSenha,
      });
    } catch (erro) {
      res
        .status(400)
        .json({ mensagem: "Erro ao atualizar", erro: erro.message });
    }
  };

  static excluirVendedor = async (req, res) => {
    try {
      const { id } = req.params;
      const vendedorDeletado = await Vendedor.findByIdAndDelete(id);

      if (!vendedorDeletado) {
        return res.status(404).json({
          mensagem: "Vendedor não encontrado. Verifique o ID fornecido.",
        });
      }

      res.status(200).json({ mensagem: "Vendedor excluído com sucesso!" });
    } catch (erro) {
      res
        .status(400)
        .json({ mensagem: "Erro ao excluir vendedor", erro: erro.message });
    }
  };

  static buscarVendedorPorId = async (req, res) => {
    try {
      const { id } = req.params;

      const vendedor = await Vendedor.findById(id).select("-senha");

      if (!vendedor) {
        return res.status(404).json({ mensagem: "Vendedor não encontrado." });
      }

      res.status(200).json({ dados: vendedor });
    } catch (erro) {
      res
        .status(400)
        .json({ mensagem: "Erro ao buscar vendedor", erro: erro.message });
    }
  };
}

export default VendedorController;
