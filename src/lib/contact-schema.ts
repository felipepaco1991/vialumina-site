import { z } from 'zod'

/** Validação do formulário de contato — usada no cliente e no servidor. */
export const contactSchema = z.object({
  name: z.string().trim().min(2, 'Informe seu nome.').max(120, 'Nome muito longo.'),
  email: z.string().trim().email('Informe um e-mail válido.').max(160),
  whatsapp: z
    .string()
    .trim()
    .refine((v) => {
      const d = v.replace(/\D/g, '')
      return d.length >= 10 && d.length <= 13
    }, 'Informe um WhatsApp com DDD.'),
  trip: z.string().max(120).optional().default(''),
  message: z.string().trim().min(10, 'Escreva uma mensagem com pelo menos 10 caracteres.').max(2000, 'Mensagem muito longa (máx. 2.000 caracteres).'),
  consent: z.literal(true, { message: 'É necessário concordar com a Política de Privacidade.' }),
  // Antispam: campo invisível que deve ficar vazio e tempo mínimo de preenchimento.
  website: z.string().max(0).optional().default(''),
  startedAt: z.number().int(),
  sourcePage: z.string().max(300).optional().default(''),
})

export type ContactInput = z.input<typeof contactSchema>
export type ContactResult = { ok: true; delivered: boolean } | { ok: false; error: string; fieldErrors?: Partial<Record<string, string>> }
