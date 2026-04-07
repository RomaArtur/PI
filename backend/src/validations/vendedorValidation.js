import { z } from "zod";

export const vendedorSchemaZod = z.object({
  nome: z.string().min(3, "O nome deve ter pelo menos 3 letras"),
  email: z.string().email("E-mail inválido"),
  senha: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
});
