import { getPayload, type Payload } from 'payload'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import config from '@/payload.config'
import { PRIVACY_NOTICE_VERSION } from '@/lib/leads/constants'
import { exportLeadsCsv } from '@/lib/leads/export.server'
import { resetRateLimits } from '@/lib/leads/rate-limit'
import { submitLead, withdrawMarketingConsent } from '@/lib/leads/submit.server'
import { parseLeadFilters } from '@/lib/leads/query'

const DOMAIN = '@leads-test.example.com'
let payload: Payload
let n = 0
const email = (tag: string) => `${tag}-${Date.now()}-${++n}${DOMAIN}`
const T0 = Date.now()
/** WhatsApp único por chamada, para que os testes não se marquem como duplicidade entre si. */
const phone = () => `(11) 9${Math.floor(1000 + Math.random() * 8999)}-${Math.floor(1000 + Math.random() * 8999)}`
const ctx = (ip: string, now = T0) => ({ ip, now })

const priest = (e: string, extra: Record<string, unknown> = {}) => ({
  startedAt: T0 - 10_000, consentPrivacy: true, fullName: 'Pe. Teste Automatizado', email: e, whatsapp: phone(), state: 'SP', city: 'Campinas',
  diocese: 'Diocese de Teste', parish: 'Paróquia de Teste', ministry: 'Pároco', mainInterest: 'organizar', destinations: ['brasil', 'italia-vaticano'], travelPeriod: '6-12-meses', sourcePage: '/cadastro/padres', entryPoint: 'menu', utm: { utm_source: 'teste', utm_campaign: 'padres-int', evil: 'x' }, ...extra,
})
const agency = (e: string, extra: Record<string, unknown> = {}) => ({
  startedAt: T0 - 10_000, consentPrivacy: true, legalName: 'Agência Teste Ltda', tradeName: 'Teste Viagens', cnpj: '11.222.333/0001-81', contactName: 'Maria Teste', contactRole: 'Diretora', email: e, whatsapp: phone(),
  state: 'MG', city: 'Belo Horizonte', profile: 'agencia', interest: 'comercializar', destinations: ['mexico-guadalupe'], ...extra,
})
const pilgrim = (e: string, extra: Record<string, unknown> = {}) => ({
  startedAt: T0 - 10_000, consentPrivacy: true, fullName: 'Ana Peregrina', email: e, whatsapp: phone(), state: 'RJ', city: 'Niterói', destinations: ['egito-terra-santa'], travelPeriod: '3-6-meses', ...extra,
})

const find = async (e: string) => (await payload.find({ collection: 'leads', where: { email: { equals: e } }, depth: 1, overrideAccess: true, sort: 'createdAt' })).docs

describe('Cadastros (leads) — persistência e regras', () => {
  beforeAll(async () => {
    payload = await getPayload({ config: await config })
  })
  beforeEach(() => resetRateLimits())
  afterAll(async () => {
    await payload.delete({ collection: 'leads', where: { email: { like: DOMAIN } }, overrideAccess: true })
  })

  it('padre: grava lead + perfil, consentimento com versão e status iniciais', async () => {
    const e = email('padre')
    const res = await submitLead('PADRE', priest(e, { consentMarketing: true }), ctx('10.0.0.1'))
    expect(res).toEqual({ ok: true })
    const [lead] = await find(e)
    expect(lead).toBeTruthy()
    expect(lead).toMatchObject({ type: 'PADRE', name: 'Pe. Teste Automatizado', state: 'SP', status: 'novo', partnershipStatus: 'pendente', source: 'lp-padres', entryPoint: 'menu', possibleDuplicate: false, marketingConsent: true })
    expect(lead!.utm).toMatchObject({ source: 'teste', campaign: 'padres-int' })
    expect(lead!.destinations).toEqual(['brasil', 'italia-vaticano'])
    expect(lead!.consents).toHaveLength(2)
    expect(lead!.consents![0]).toMatchObject({ purpose: 'cadastro-contato', granted: true, noticeVersion: PRIVACY_NOTICE_VERSION })
    expect(lead!.consents![1]).toMatchObject({ purpose: 'comunicacoes', granted: true })
    expect(new Date(lead!.retainUntil!).getTime()).toBeGreaterThan(T0)
    expect(typeof lead!.priestProfile).toBe('object')
    expect(lead!.priestProfile).toMatchObject({ diocese: 'Diocese de Teste', parish: 'Paróquia de Teste', mainInterest: 'organizar' })
  })

  it('sem consentimento de marketing, registra apenas o consentimento de cadastro', async () => {
    const e = email('semmkt')
    await submitLead('PEREGRINO', pilgrim(e), ctx('10.0.0.2'))
    const [lead] = await find(e)
    expect(lead!.marketingConsent).toBe(false)
    expect(lead!.consents!.map((c) => c.purpose)).toEqual(['cadastro-contato'])
  })

  it('agência: nunca nasce aprovada; CNPJ guardado só com dígitos', async () => {
    const e = email('agencia')
    expect(await submitLead('AGENCIA', agency(e), ctx('10.0.0.3'))).toEqual({ ok: true })
    const [lead] = await find(e)
    expect(lead).toMatchObject({ type: 'AGENCIA', partnershipStatus: 'pendente', source: 'lp-agencias' })
    expect(lead!.agencyProfile).toMatchObject({ cnpj: '11222333000181', cnpjVerification: 'nao-verificado', cadasturVerification: 'nao-verificado' })
  })

  it('agência: consultor independente pode se cadastrar sem CNPJ', async () => {
    const e = email('consultor')
    expect(await submitLead('AGENCIA', agency(e, { profile: 'consultor', cnpj: '' }), ctx('10.0.0.4'))).toEqual({ ok: true })
    expect((await find(e))[0]!.agencyProfile).toMatchObject({ profile: 'consultor' })
  })

  it('peregrino: partnershipStatus não se aplica', async () => {
    const e = email('peregrino')
    await submitLead('PEREGRINO', pilgrim(e), ctx('10.0.0.5'))
    expect((await find(e))[0]).toMatchObject({ type: 'PEREGRINO', partnershipStatus: 'nao-se-aplica', source: 'lp-peregrinos' })
  })

  it('erro de validação: devolve mensagens por campo e não grava nada', async () => {
    const e = email('invalido')
    const res = await submitLead('PADRE', priest(e, { fullName: '', whatsapp: '123', state: 'ZZ', consentPrivacy: false }), ctx('10.0.0.6'))
    expect(res.ok).toBe(false)
    if (!res.ok) expect(Object.keys(res.fieldErrors ?? {})).toEqual(expect.arrayContaining(['fullName', 'whatsapp', 'state', 'consentPrivacy']))
    expect(await find(e)).toHaveLength(0)
  })

  it('CNPJ inválido é rejeitado no servidor', async () => {
    const e = email('cnpj')
    const res = await submitLead('AGENCIA', agency(e, { cnpj: '11.222.333/0001-82' }), ctx('10.0.0.7'))
    expect(res.ok).toBe(false)
    if (!res.ok) expect(res.fieldErrors?.cnpj).toBeTruthy()
    expect(await find(e)).toHaveLength(0)
  })

  it('antispam: honeypot parece sucesso mas não grava; envio rápido demais é recusado', async () => {
    const e1 = email('bot')
    expect(await submitLead('PEREGRINO', pilgrim(e1, { website: 'http://spam.example' }), ctx('10.0.0.8'))).toEqual({ ok: true })
    expect(await find(e1)).toHaveLength(0)
    const e2 = email('rapido')
    const fast = await submitLead('PEREGRINO', pilgrim(e2, { startedAt: T0 - 500 }), ctx('10.0.0.9'))
    expect(fast.ok).toBe(false)
    expect(await find(e2)).toHaveLength(0)
  })

  it('limite de taxa por IP', async () => {
    let blocked = false
    for (let i = 0; i < 8; i++) {
      const r = await submitLead('PEREGRINO', pilgrim(email('rate')), ctx('10.0.0.10'))
      if (!r.ok && /muitas tentativas/i.test(r.error)) blocked = true
    }
    expect(blocked).toBe(true)
  })

  it('duplicidade: reenvio imediato não duplica; novo envio depois marca possível duplicidade', async () => {
    const e = email('dup')
    expect(await submitLead('PADRE', priest(e), ctx('10.0.0.11'))).toEqual({ ok: true })
    // Duplo clique / reenvio logo em seguida: confirmado sem criar outro registro.
    expect(await submitLead('PADRE', priest(e), ctx('10.0.0.11', T0 + 60_000))).toEqual({ ok: true })
    expect(await find(e)).toHaveLength(1)
    // Meia hora depois: novo cadastro, sinalizado como possível duplicidade do primeiro.
    expect(await submitLead('PADRE', priest(e, { startedAt: T0 + 30 * 60_000 - 10_000 }), ctx('10.0.0.11', T0 + 30 * 60_000))).toEqual({ ok: true })
    const leads = await find(e)
    expect(leads).toHaveLength(2)
    expect(leads[0]!.possibleDuplicate).toBe(false)
    expect(leads[1]!.possibleDuplicate).toBe(true)
    expect(typeof leads[1]!.duplicateOf === 'object' ? leads[1]!.duplicateOf!.id : leads[1]!.duplicateOf).toBe(leads[0]!.id)
  })

  it('duplicidade também por WhatsApp, mas apenas dentro do mesmo perfil', async () => {
    const a = email('wa-a')
    const b = email('wa-b')
    await submitLead('PEREGRINO', pilgrim(a, { whatsapp: '(31) 97777-1234' }), ctx('10.0.0.12'))
    await submitLead('PEREGRINO', pilgrim(b, { whatsapp: '(31) 97777-1234' }), ctx('10.0.0.12', T0 + 1000))
    expect((await find(b))[0]!.possibleDuplicate).toBe(true)
    // Mesmo telefone em outro perfil (padre) não é duplicidade.
    const c = email('wa-c')
    await submitLead('PADRE', priest(c, { whatsapp: '(31) 97777-1234' }), ctx('10.0.0.13'))
    expect((await find(c))[0]!.possibleDuplicate).toBe(false)
  })

  it('retirada de consentimento promocional pelo token, com data registrada', async () => {
    const e = email('retirada')
    await submitLead('PEREGRINO', pilgrim(e, { consentMarketing: true }), ctx('10.0.0.14'))
    const [lead] = await find(e)
    const full = await payload.findByID({ collection: 'leads', id: lead!.id, overrideAccess: true })
    const token = full.unsubscribeToken!
    expect(token.length).toBeGreaterThan(20)
    expect(await withdrawMarketingConsent(token, { ip: '10.0.0.14' })).toEqual({ ok: true })
    const after = (await find(e))[0]!
    expect(after.marketingConsent).toBe(false)
    expect(after.consents!.find((c) => c.purpose === 'comunicacoes')!.withdrawnAt).toBeTruthy()
    expect(after.consents!.find((c) => c.purpose === 'cadastro-contato')!.withdrawnAt).toBeFalsy()
    expect(await withdrawMarketingConsent(token, { ip: '10.0.0.14' })).toEqual({ ok: true, alreadyWithdrawn: true })
    expect((await withdrawMarketingConsent('token-invalido-token-invalido', { ip: '10.0.0.14' })).ok).toBe(false)
  })

  it('o token de retirada não é exposto pela API', async () => {
    const e = email('token')
    await submitLead('PEREGRINO', pilgrim(e), ctx('10.0.0.15'))
    const { id } = (await find(e))[0]!
    const staff = await payload.create({ collection: 'users', data: { email: email('staff'), password: 'qa-senha-segura-123', roles: ['comercial'] }, overrideAccess: true })
    const read = await payload.findByID({ collection: 'leads', id, user: staff, overrideAccess: false })
    expect('unsubscribeToken' in read && read.unsubscribeToken).toBeFalsy()
    await payload.delete({ collection: 'users', id: staff.id, overrideAccess: true })
  })

  it('controle de acesso: anônimo e editor não leem; comercial lê; só admin exclui', async () => {
    const e = email('acesso')
    await submitLead('PEREGRINO', pilgrim(e), ctx('10.0.0.16'))
    const { id } = (await find(e))[0]!
    await expect(payload.find({ collection: 'leads', overrideAccess: false })).rejects.toThrow()
    await expect(payload.create({ collection: 'leads', overrideAccess: false, data: { type: 'PEREGRINO', name: 'x', email: 'x@x.com', source: 'manual' } as never })).rejects.toThrow()
    const mk = (roles: ('admin' | 'editor' | 'comercial')[]) => payload.create({ collection: 'users', data: { email: email('u'), password: 'qa-senha-segura-123', roles }, overrideAccess: true })
    const editor = await mk(['editor'])
    const comercial = await mk(['comercial'])
    await expect(payload.findByID({ collection: 'leads', id, user: editor, overrideAccess: false })).rejects.toThrow()
    await expect(payload.findByID({ collection: 'leads', id, user: comercial, overrideAccess: false })).resolves.toBeTruthy()
    await expect(payload.delete({ collection: 'leads', id, user: comercial, overrideAccess: false })).rejects.toThrow()
    // A equipe atualiza a gestão do atendimento, mas não altera os dados enviados.
    const upd = await payload.update({ collection: 'leads', id, user: comercial, overrideAccess: false, data: { status: 'em-analise', internalNotes: 'ligar amanhã', name: 'ALTERADO' } })
    expect(upd).toMatchObject({ status: 'em-analise', internalNotes: 'ligar amanhã', name: 'Ana Peregrina' })
    await payload.delete({ collection: 'users', where: { id: { in: [editor.id, comercial.id] } }, overrideAccess: true })
  })

  it('exportação CSV respeita filtros, consentimento e inclui dados do perfil', async () => {
    const e1 = email('csv-sim')
    const e2 = email('csv-nao')
    await submitLead('PADRE', priest(e1, { fullName: '=CMD() Injeção', consentMarketing: true }), ctx('10.0.0.17'))
    await submitLead('PADRE', priest(e2), ctx('10.0.0.17', T0 + 1000))
    const all = await exportLeadsCsv(payload, parseLeadFilters({ tab: 'PADRE', q: DOMAIN }), 'teste')
    expect(all.csv).toContain(e1)
    expect(all.csv).toContain(e2)
    expect(all.csv).toContain('Diocese de Teste')
    expect(all.csv).toContain("'=CMD() Injeção")
    const onlyMarketing = await exportLeadsCsv(payload, parseLeadFilters({ tab: 'PADRE', q: DOMAIN, marketing: '1' }), 'teste')
    expect(onlyMarketing.csv).toContain(e1)
    expect(onlyMarketing.csv).not.toContain(e2)
  })

  it('excluir um cadastro remove também o perfil relacionado', async () => {
    const e = email('exclusao')
    await submitLead('PADRE', priest(e), ctx('10.0.0.18'))
    const lead = (await find(e))[0]!
    const profileId = typeof lead.priestProfile === 'object' ? lead.priestProfile!.id : lead.priestProfile
    await payload.delete({ collection: 'leads', id: lead.id, overrideAccess: true })
    const left = await payload.find({ collection: 'priest-profiles', where: { id: { equals: profileId } }, overrideAccess: true })
    expect(left.totalDocs).toBe(0)
  })
})
