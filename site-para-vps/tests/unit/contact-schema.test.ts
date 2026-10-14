import { describe, expect, it } from 'vitest'
import { contactSchema } from '@/lib/contact-schema'

const valid = {
  name: 'Maria da Silva',
  email: 'maria@example.com',
  whatsapp: '(81) 99999-0000',
  trip: 'egito-terra-santa',
  message: 'Gostaria de saber sobre as condições de pagamento.',
  consent: true as const,
  website: '',
  startedAt: Date.now() - 10_000,
}

describe('formulário de contato', () => {
  it('aceita dados válidos', () => expect(contactSchema.safeParse(valid).success).toBe(true))
  it('exige consentimento', () => expect(contactSchema.safeParse({ ...valid, consent: false }).success).toBe(false))
  it('valida e-mail e WhatsApp', () => {
    expect(contactSchema.safeParse({ ...valid, email: 'maria' }).success).toBe(false)
    expect(contactSchema.safeParse({ ...valid, whatsapp: '9999' }).success).toBe(false)
  })
  it('rejeita honeypot preenchido', () => expect(contactSchema.safeParse({ ...valid, website: 'spam.com' }).success).toBe(false))
  it('limita o tamanho da mensagem', () => expect(contactSchema.safeParse({ ...valid, message: 'x'.repeat(2001) }).success).toBe(false))
})
