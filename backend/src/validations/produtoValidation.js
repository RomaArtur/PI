import { z } from "zod";

export const produtoSchemaZod = z.object({
  nome: z.string().min(3, "O nome do produto deve ter pelo menos 3 letras"),
  descricao: z
    .string()
    .min(10, "A descrição precisa ter no mínimo 10 caracteres"),
  precoBase: z.number().positive("O preço base deve ser maior que zero"),
  prazoProducaoDias: z
    .number()
    .int()
    .positive("O prazo de produção deve ser de pelo menos 1 dia"),
  categoria: z.string().min(2, "A categoria é obrigatória"),
  ativo: z.boolean().optional(),
});
