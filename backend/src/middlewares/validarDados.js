export const validarDados = (schema) => (req, res, next) => {
  const resultado = schema.safeParse(req.body);

  if (!resultado.success) {
    const errosFormatados = resultado.error.issues.map((err) => ({
      campo: err.path.join("."),
      mensagem: err.message,
    }));

    return res.status(400).json({
      mensagem: "Erro de validação nos dados enviados",
      erros: errosFormatados,
    });
  }

  req.body = resultado.data;
  next();
};
