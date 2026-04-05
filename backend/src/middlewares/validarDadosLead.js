export const validarDadosLead = (schema) => (req, res, next) => {
  const resultado = schema.safeParse(req.body);

  if (!resultado.success) {
    const errosFormatados = resultado.erro.issues.map((err) => ({
      campo: err.path.join("."),
      mensagem: err.mensagem,
    }));

    return res.status(400).json({
      mensagem: "Erro de validação nos dados enviados",
      erros: errosFormatados,
    });
  }

  req.body = resultado.data;
  next();
};
