import Produto from "../models/Produto.js";

class ProdutoController {

  static registrarProduto = async (req, res) => {
    try {
      const novoProduto = await Produto.create(req.body);
      res.status(201).json({
        mensagem: "Produto cadastrado com sucesso!",
        dados: novoProduto,
      });
    } catch (erro) {
      res
        .status(400)
        .json({ mensagem: "Erro ao cadastrar produto", erro: erro.message });
    }
  };

  static listarProdutosAtivos = async (req, res) => {
    try {
      const produtos = await Produto.find({ ativo: true });
      res.status(200).json({ dados: produtos });
    } catch (erro) {
      res
        .status(400)
        .json({ mensagem: "Erro ao listar produtos", erro: erro.message });
    }
  };

  static editarProduto = async (req, res) => {
    try {
      const { id } = req.params;
      const produtoAtualizado = await Produto.findByIdAndUpdate(id, req.body, {
        new: true, 
      });

      if (!produtoAtualizado) {
        return res.status(404).json({ mensagem: "Produto não encontrado." });
      }

      res.status(200).json({
        mensagem: "Produto atualizado com sucesso!",
        dados: produtoAtualizado,
      });
    } catch (erro) {
      res
        .status(400)
        .json({ mensagem: "Erro ao atualizar produto", erro: erro.message });
    }
  };

  static excluirProduto = async (req, res) => {
    try {
      const { id } = req.params;
      const produtoDeletado = await Produto.findByIdAndDelete(id);

      if (!produtoDeletado) {
        return res.status(404).json({ mensagem: "Produto não encontrado." });
      }

      res.status(200).json({ mensagem: "Produto excluído com sucesso!" });
    } catch (erro) {
      res
        .status(400)
        .json({ mensagem: "Erro ao excluir produto", erro: erro.message });
    }
  };
}

export default ProdutoController;
