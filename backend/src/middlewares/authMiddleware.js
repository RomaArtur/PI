import jwt from "jsonwebtoken";

export const checarAutenticacao = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res
      .status(401)
      .json({ mensagem: "Acesso negado! Token não fornecido." });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ mensagem: "Acesso negado! Token mal formatado." });
  }

  try {
    const segredo = "chave_secreta_super_segura_do_pi_2024";
    const decodificado = jwt.verify(token, segredo);
    req.lojistaId = decodificado.id;
    next();
  } catch (erro) {
    return res
      .status(401)
      .json({ mensagem: "Token inválido ou expirado. Faça login novamente." });
  }
};
