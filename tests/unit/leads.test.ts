import { describe, expect, it } from 'vitest'
import { toCsv } from '@/lib/leads/csv'
import { isValidCnpj, maskCnpj, maskPhone, normalizeBrPhone, normalizeInstagram, normalizeUrl, toStoredPhone } from '@/lib/leads/masks'
import { parseLeadFilters } from '@/lib/leads/query'
import { leadRecipients } from '@/lib/leads/recipients.server'
import { leadWhatsapp } from '@/lib/leads/routing.server'
import { agencySchema, pilgrimSchema, priestSchema } from '@/lib/leads/schemas'
import { sanitizeUtm } from '@/lib/leads/utm'

const base = { startedAt: 1, consentPrivacy: true as const }
const priest = { ...base, fullName: 'Pe. João da Silva', email: 'Padre@Paroquia.org.br', whatsapp: '(11) 99999-8888', state: 'SP', city: 'Campinas', diocese: 'Campinas', parish: 'Matriz', ministry: 'Pároco', mainInterest: 'organizar', destinations: ['brasil'] }
const agency = { ...base, legalName: 'Viagens Ltda', tradeName: 'Viagens Boa', cnpj: '11.222.333/0001-81', contactName: 'Maria Souza', contactRole: 'Diretora', email: 'maria@viagens.com.br', whatsapp: '11988887777', state: 'SP', city: 'São Paulo', profile: 'agencia', interest: 'comercializar', destinations: [] }
const pilgrim = { ...base, fullName: 'Ana Pereira', email: 'ana@example.com', whatsapp: '(21) 98888-7777', state: 'RJ', city: 'Niterói', destinations: ['italia-vaticano'], travelPeriod: '6-12-meses' }

describe('máscaras e documentos', () => {
  it('aplica máscara progressiva de telefone', () => {
    expect(maskPhone('11999998888')).toBe('(11) 99999-8888')
    expect(maskPhone('1133334444')).toBe('(11) 3333-4444')
    expect(maskPhone('119')).toBe('(11) 9')
    expect(maskPhone('+5511999998888')).toBe('(11) 99999-8888')
  })
  it('valida telefones brasileiros', () => {
    expect(normalizeBrPhone('(11) 99999-8888')).toBe('11999998888')
    expect(normalizeBrPhone('5511999998888')).toBe('11999998888')
    expect(normalizeBrPhone('(11) 3333-4444')).toBe('1133334444')
    expect(normalizeBrPhone('(00) 99999-8888')).toBeNull() // DDD inválido
    expect(normalizeBrPhone('(11) 89999-8888')).toBeNull() // celular precisa começar com 9
    expect(normalizeBrPhone('(11) 99999-999')).toBeNull()
    expect(normalizeBrPhone('11111111111')).toBeNull()
    expect(toStoredPhone('(11) 99999-8888')).toBe('5511999998888')
  })
  it('valida CNPJ pelos dígitos verificadores', () => {
    expect(isValidCnpj('11.222.333/0001-81')).toBe(true)
    expect(isValidCnpj('11222333000181')).toBe(true)
    expect(isValidCnpj('11.222.333/0001-82')).toBe(false)
    expect(isValidCnpj('00.000.000/0000-00')).toBe(false)
    expect(isValidCnpj('123')).toBe(false)
    expect(maskCnpj('11222333000181')).toBe('11.222.333/0001-81')
  })
  it('normaliza site e Instagram', () => {
    expect(normalizeUrl('www.agencia.com.br')).toBe('https://www.agencia.com.br/')
    expect(normalizeUrl('javascript:alert(1)')).toBeNull()
    expect(normalizeUrl('semponto')).toBeNull()
    expect(normalizeInstagram('https://instagram.com/agencia.viagens/')).toBe('@agencia.viagens')
    expect(normalizeInstagram('@ok_1')).toBe('@ok_1')
    expect(normalizeInstagram('inválido com espaço')).toBeNull()
  })
})

describe('esquemas de validação', () => {
  it('aceita um padre válido e normaliza o e-mail', () => {
    const r = priestSchema.safeParse(priest)
    expect(r.success).toBe(true)
    if (r.success) expect(r.data.email).toBe('padre@paroquia.org.br')
  })
  it('exige os campos obrigatórios do padre, com mensagens por campo', () => {
    const r = priestSchema.safeParse({ ...base, consentPrivacy: false, destinations: [] })
    expect(r.success).toBe(false)
    if (!r.success) {
      const fields = r.error.issues.map((i) => i.path[0])
      for (const f of ['fullName', 'email', 'whatsapp', 'state', 'city', 'diocese', 'parish', 'ministry', 'mainInterest', 'consentPrivacy']) expect(fields).toContain(f)
    }
  })
  it('rejeita opções fora da lista e WhatsApp inválido', () => {
    expect(priestSchema.safeParse({ ...priest, state: 'XX' }).success).toBe(false)
    expect(priestSchema.safeParse({ ...priest, mainInterest: 'qualquer' }).success).toBe(false)
    expect(priestSchema.safeParse({ ...priest, whatsapp: '123' }).success).toBe(false)
    expect(priestSchema.safeParse({ ...priest, destinations: ['inexistente'] }).success).toBe(false)
  })
  it('consentimento de marketing é opcional e o de privacidade obrigatório', () => {
    expect(priestSchema.safeParse({ ...priest, consentMarketing: false }).success).toBe(true)
    expect(priestSchema.safeParse({ ...priest, consentPrivacy: false }).success).toBe(false)
  })
  it('agência: CNPJ válido é exigido, exceto para consultor independente', () => {
    expect(agencySchema.safeParse(agency).success).toBe(true)
    expect(agencySchema.safeParse({ ...agency, cnpj: '' }).success).toBe(false)
    expect(agencySchema.safeParse({ ...agency, cnpj: '11.222.333/0001-82' }).success).toBe(false)
    expect(agencySchema.safeParse({ ...agency, profile: 'consultor', cnpj: '' }).success).toBe(true)
    // Se um consultor informar CNPJ, ele precisa ser válido.
    expect(agencySchema.safeParse({ ...agency, profile: 'consultor', cnpj: '123' }).success).toBe(false)
  })
  it('agência: site e Instagram opcionais, mas válidos quando informados', () => {
    expect(agencySchema.safeParse({ ...agency, website: 'www.agencia.com.br', instagram: '@agencia' }).success).toBe(true)
    expect(agencySchema.safeParse({ ...agency, website: 'não é site' }).success).toBe(false)
    expect(agencySchema.safeParse({ ...agency, instagram: 'a b' }).success).toBe(false)
  })
  it('peregrino: exige destino e período', () => {
    expect(pilgrimSchema.safeParse(pilgrim).success).toBe(true)
    expect(pilgrimSchema.safeParse({ ...pilgrim, destinations: [] }).success).toBe(false)
    expect(pilgrimSchema.safeParse({ ...pilgrim, travelPeriod: '' }).success).toBe(false)
  })
  it('honeypot preenchido invalida o envio', () => {
    const r = pilgrimSchema.safeParse({ ...pilgrim, website: 'http://spam' })
    expect(r.success).toBe(false)
    if (!r.success) expect(r.error.issues.some((i) => i.path[0] === 'website')).toBe(true)
  })
})

describe('UTM e filtros', () => {
  it('mantém somente UTMs conhecidas e seguras', () => {
    expect(sanitizeUtm({ utm_source: 'instagram', utm_campaign: 'padres-2027', foo: 'x', utm_medium: '<script>alert(1)</script>', utm_term: 'a'.repeat(200) })).toEqual({ utm_source: 'instagram', utm_campaign: 'padres-2027' })
    expect(sanitizeUtm(null)).toEqual({})
  })
  it('valida os filtros do painel por listas permitidas', () => {
    const f = parseLeadFilters({ tab: 'AGENCIA', state: 'SP', status: 'novo', from: '2026-10-01', to: 'lixo', page: '3', new: '1', q: ' maria ' })
    expect(f).toMatchObject({ tab: 'AGENCIA', state: 'SP', status: 'novo', from: '2026-10-01', to: '', page: 3, onlyNew: true, q: 'maria' })
    expect(parseLeadFilters({ tab: 'HACKER', state: "SP' OR 1=1" })).toMatchObject({ tab: 'PADRE', state: '' })
  })
})

describe('CSV', () => {
  it('escapa aspas, vírgulas e quebras de linha', () => {
    const csv = toCsv(['a', 'b'], [['x,y', 'diz "oi"\nlinha']])
    expect(csv).toContain('"x,y","diz ""oi""\nlinha"')
  })
  it('neutraliza injeção de fórmulas em planilhas', () => {
    const csv = toCsv(['nome'], [['=HYPERLINK("http://x")'], ['+55 11'], ['@cmd'], ['-1+1']])
    for (const line of csv.split('\r\n').slice(1, 5)) expect(line.replace(/^"/, '').startsWith("'")).toBe(true)
  })
})

describe('destinatários dos cadastros', () => {
  const none = {} as Parameters<typeof leadRecipients>[0]
  it('padres e agências: comercial com cópia para a Fabíola', () => {
    for (const type of ['PADRE', 'AGENCIA'] as const) {
      expect(leadRecipients(none, type)).toEqual({ to: ['williton.santos@vialuminaviagens.com.br'], cc: ['fabiola.almeida@vialuminaviagens.com.br'] })
      expect(leadWhatsapp(type, '5511992526053')).toBe('5511917992727')
    }
  })
  it('peregrinos: só a Fabíola, sem cópia, com o WhatsApp do site', () => {
    expect(leadRecipients(none, 'PEREGRINO')).toEqual({ to: ['fabiola.almeida@vialuminaviagens.com.br'], cc: [] })
    expect(leadWhatsapp('PEREGRINO', '5511992526053')).toBe('5511992526053')
  })
  it('destinatários definidos no painel substituem o padrão, sem cópia', () => {
    expect(leadRecipients({ leadRecipientsPadres: ['outro@exemplo.com'] } as never, 'PADRE')).toEqual({ to: ['outro@exemplo.com'], cc: [] })
  })
})
