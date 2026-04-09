import { z } from "zod";

export const produtoSchemaZod = z.object({
  nome: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  categoria: z.string().min(2, "Categoria é obrigatória"),
  precoBase: z.preprocess(
    (val) => parseFloat(val),
    z.number().positive("Preço deve ser positivo"),
  ),
  prazoProducaoDias: z.preprocess(
    (val) => parseInt(val),
    z.number().int().min(0),
  ),
  descricao: z.string().min(10, "Descrição deve ter no mínimo 10 caracteres"),
  imagem: z.string().optional(), 
});
