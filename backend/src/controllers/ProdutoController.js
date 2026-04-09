import Produto from "../models/Produto.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Resolve to repo root: backend/src/controllers -> backend/src -> backend -> (repo root)
const DEBUG_LOG_PATH = path.resolve(__dirname, "../../..", "debug-5768e2.log");
const UPLOADS_DIR = path.resolve(__dirname, "..", "..", "uploads");
const AGENT_DEBUG_ENABLED = process.env.ENABLE_AGENT_DEBUG === "true";
const agentAppendLog = (payload) => {
  if (!AGENT_DEBUG_ENABLED) return;
  try {
    fs.appendFileSync(DEBUG_LOG_PATH, `${JSON.stringify(payload)}\n`, "utf8");
  } catch {
    // ignore
  }
};

const tryDeleteUploadByWebPath = (webPath) => {
  try {
    if (!webPath || typeof webPath !== "string") return false;
    if (!webPath.startsWith("/uploads/")) return false;
    const fileName = path.basename(webPath);
    const filePath = path.join(UPLOADS_DIR, fileName);
    if (!fs.existsSync(filePath)) return false;
    fs.unlinkSync(filePath);
    return true;
  } catch {
    return false;
  }
};

class ProdutoController {
  static registrarProduto = async (req, res) => {
    try {
      // #region agent log
      fetch('http://127.0.0.1:7670/ingest/67f76ef3-088f-43b2-b843-3884353bbc2e',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'5768e2'},body:JSON.stringify({sessionId:'5768e2',runId:'pre-fix',hypothesisId:'H2',location:'backend/src/controllers/ProdutoController.js:registrarProduto',message:'registrarProduto entry',data:{bodyKeys:Object.keys(req.body||{}),hasFile:!!req.file,fileField:req.file?.fieldname,fileName:req.file?.filename,filePath:req.file?.path},timestamp:Date.now()})}).catch(()=>{});
      // #endregion
      agentAppendLog({ sessionId: "5768e2", runId: "pre-fix", hypothesisId: "H2", location: "backend/src/controllers/ProdutoController.js:registrarProduto", message: "registrarProduto entry (file)", data: { bodyKeys: Object.keys(req.body || {}), hasFile: !!req.file, fileField: req.file?.fieldname, fileName: req.file?.filename } , timestamp: Date.now() });

      const payload = { ...req.body };
      if (req.file?.filename) {
        payload.imagem = `/uploads/${req.file.filename}`;
      }

      // #region agent log
      fetch('http://127.0.0.1:7670/ingest/67f76ef3-088f-43b2-b843-3884353bbc2e',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'5768e2'},body:JSON.stringify({sessionId:'5768e2',runId:'pre-fix',hypothesisId:'H2',location:'backend/src/controllers/ProdutoController.js:registrarProduto',message:'registrarProduto payload prepared',data:{imagem:payload.imagem||null},timestamp:Date.now()})}).catch(()=>{});
      // #endregion
      agentAppendLog({ sessionId: "5768e2", runId: "pre-fix", hypothesisId: "H2", location: "backend/src/controllers/ProdutoController.js:registrarProduto", message: "registrarProduto payload prepared (file)", data: { imagem: payload.imagem || null }, timestamp: Date.now() });

      const novoProduto = await Produto.create(payload);
      res.status(201).json({
        mensagem: "Produto cadastrado com sucesso!",
        dados: novoProduto,
      });
    } catch (erro) {
      res.status(400).json({ mensagem: "Dados inválidos", erro: erro.message });
    }
  };

  static listarProdutos = async (req, res) => {
    try {
      const {
        admin,
        busca,
        sort = "createdAt",
        order = "desc",
        page = 1,
        limit = 10,
      } = req.query;
      let filtro = {};

      if (admin !== "true") {
        filtro.ativo = true;
      }

      if (busca) {
        filtro.$or = [
          { nome: { $regex: busca, $options: "i" } },
          { descricao: { $regex: busca, $options: "i" } },
          { categoria: { $regex: busca, $options: "i" } },
        ];
      }

      const skip = (Number(page) - 1) * Number(limit);
      const total = await Produto.countDocuments(filtro);
      const produtos = await Produto.find(filtro)
        .sort({ [sort]: order === "asc" ? 1 : -1 })
        .skip(skip)
        .limit(Number(limit));

      // #region agent log
      fetch('http://127.0.0.1:7670/ingest/67f76ef3-088f-43b2-b843-3884353bbc2e',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'5768e2'},body:JSON.stringify({sessionId:'5768e2',runId:'pre-fix',hypothesisId:'H3',location:'backend/src/controllers/ProdutoController.js:listarProdutos',message:'listarProdutos result',data:{admin,returned:produtos.length,total,firstImagem:produtos[0]?.imagem||null},timestamp:Date.now()})}).catch(()=>{});
      // #endregion
      agentAppendLog({ sessionId: "5768e2", runId: "pre-fix", hypothesisId: "H3", location: "backend/src/controllers/ProdutoController.js:listarProdutos", message: "listarProdutos result (file)", data: { admin, returned: produtos.length, total, firstImagem: produtos[0]?.imagem || null }, timestamp: Date.now() });

      res.status(200).json({
        dados: produtos,
        total,
        page: Number(page),
        totalPages: Math.ceil(total / Number(limit)) || 1,
      });
    } catch (erro) {
      res
        .status(500)
        .json({
          mensagem: "Erro interno ao listar produtos",
          erro: erro.message,
        });
    }
  };

  static editarProduto = async (req, res) => {
    try {
      const { id } = req.params;
      // #region agent log
      fetch('http://127.0.0.1:7670/ingest/67f76ef3-088f-43b2-b843-3884353bbc2e',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'5768e2'},body:JSON.stringify({sessionId:'5768e2',runId:'pre-fix',hypothesisId:'H2',location:'backend/src/controllers/ProdutoController.js:editarProduto',message:'editarProduto entry',data:{id,bodyKeys:Object.keys(req.body||{}),hasFile:!!req.file,fileName:req.file?.filename},timestamp:Date.now()})}).catch(()=>{});
      // #endregion
      agentAppendLog({ sessionId: "5768e2", runId: "pre-fix", hypothesisId: "H2", location: "backend/src/controllers/ProdutoController.js:editarProduto", message: "editarProduto entry (file)", data: { id, bodyKeys: Object.keys(req.body || {}), hasFile: !!req.file, fileName: req.file?.filename }, timestamp: Date.now() });

      const existente = await Produto.findById(id);
      if (!existente)
        return res.status(404).json({ mensagem: "Produto não encontrado." });

      const oldImagem = existente.imagem || null;

      const payload = { ...req.body };
      if (req.file?.filename) payload.imagem = `/uploads/${req.file.filename}`;

      const produtoAtualizado = await Produto.findByIdAndUpdate(id, payload, {
        returnDocument: "after",
      });

      if (!produtoAtualizado)
        return res.status(404).json({ mensagem: "Produto não encontrado." });

      if (req.file?.filename && oldImagem && oldImagem !== payload.imagem) {
        const deleted = tryDeleteUploadByWebPath(oldImagem);
        agentAppendLog({
          sessionId: "5768e2",
          runId: "pre-fix",
          hypothesisId: "H9",
          location: "backend/src/controllers/ProdutoController.js:editarProduto",
          message: "deleted old upload on replace",
          data: { oldImagem, deleted },
          timestamp: Date.now(),
        });
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
      const existente = await Produto.findById(id);
      if (!existente)
        return res.status(404).json({ mensagem: "Produto não encontrado." });

      const imagem = existente.imagem || null;
      const deletado = await Produto.findByIdAndDelete(id);
      if (!deletado)
        return res.status(404).json({ mensagem: "Produto não encontrado." });

      if (imagem) {
        const deleted = tryDeleteUploadByWebPath(imagem);
        agentAppendLog({
          sessionId: "5768e2",
          runId: "pre-fix",
          hypothesisId: "H9",
          location: "backend/src/controllers/ProdutoController.js:excluirProduto",
          message: "deleted upload on produto delete",
          data: { imagem, deleted },
          timestamp: Date.now(),
        });
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
