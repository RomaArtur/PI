import { z } from "zod";

export const leadSchemaZod = z.object({
  nome: z.string().min(2, "O nome deve ter pelo menos 2 letras"),
  sobrenome: z.string().min(2, "O sobrenome deve ter pelo menos 2 letras"),
  email: z.string().email("Formato de e-mail inválido"),
  whatsapp: z
    .string()
    .min(10, "O WhatsApp deve ter DDD e o número (mínimo 10 dígitos)"),
  consentimento: z.boolean().refine((val) => val === true, {
    mensagem: "O usuário precisa aceitar os termos (consentimento: true)",
  }),
  interesses: z.array(z.string()).optional(),

  dataNascimento: z.coerce.date().optional(),

  datasComemorativas: z
    .array(
      z.object({
        nomeEvento: z.string().min(2, "O nome do evento é obrigatório"),
        data: z.coerce.date(),
      }),
    )
    .optional(),
});
