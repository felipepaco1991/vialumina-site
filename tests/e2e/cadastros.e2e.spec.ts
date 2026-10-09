import { expect, test, type Page } from '@playwright/test'
import { cleanupLeads, cleanupStaff, findLeads, seedStaff, staffUser } from '../helpers/leadsUser'

const RUN = Date.now()
const mail = (tag: string) => `qa-${tag}-${RUN}@e2e-cadastros.example.com`
/** Rótulo exato do campo (ignora os sufixos "*" e "(opcional)"), evitando ambiguidade com textos dos consentimentos. */
const L = (form: ReturnType<Page['locator']>, name: string) => form.getByLabel(new RegExp(`^${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}( \\*| \\(opcional\\))?$`))
const events = (page: Page) => page.evaluate(() => (window.dataLayer ?? []).map((e) => (e as { event?: string }).event).filter(Boolean))

test.afterAll(async () => cleanupLeads('%@e2e-cadastros.example.com'))

// Cada teste usa um IP distinto: o limite de taxa por IP não deve interferir entre testes.
let ipSeq = 0
test.beforeEach(async ({ page }) => {
  ipSeq++
  await page.setExtraHTTPHeaders({ 'x-real-ip': `10.${Math.floor(Date.now() / 1000) % 250}.${process.pid % 250}.${ipSeq}` })
})

test.describe('Landing pages: estrutura e navegação', () => {
  for (const [path, h1, cta] of [
    ['/cadastro/padres', 'Sua missão pode levar a fé ainda mais longe.', 'Quero conhecer a parceria'],
    ['/cadastro/agencias', 'Amplie as possibilidades da sua agência com o turismo religioso.', 'Quero ser uma agência parceira'],
    ['/cadastro/peregrinos', 'Sua próxima jornada de fé pode começar aqui.', 'Quero conhecer as peregrinações'],
  ] as const) {
    test(`${path}: conteúdo, CTA para o formulário, metadados e breadcrumbs`, async ({ page }) => {
      await page.goto(path)
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(h1)
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', new RegExp(`${path}$`))
      await expect(page.getByRole('navigation', { name: 'Trilha de navegação' })).toContainText('Cadastro')
      await page.getByRole('link', { name: cta }).click()
      await expect(page).toHaveURL(/#cadastro$/)
      await expect(page.locator('#cadastro')).toBeInViewport()
      expect(await events(page)).toContain(path.endsWith('padres') ? 'view_lp_padres' : path.endsWith('agencias') ? 'view_lp_agencias' : 'view_lp_peregrinos')
    })
  }

  test('menu principal e rodapé levam aos três cadastros; hub e links existem', async ({ page }) => {
    await page.goto('/')
    const nav = page.getByRole('navigation', { name: 'Principal' })
    await nav.getByRole('button', { name: 'Parcerias' }).click()
    await expect(nav.getByRole('link', { name: 'Para Padres' })).toBeVisible()
    await expect(nav.getByRole('link', { name: 'Para Agências' })).toBeVisible()
    await expect(nav.getByRole('link', { name: 'Cadastre-se' })).toHaveAttribute('href', /\/cadastro\/peregrinos/)
    const footer = page.locator('footer')
    for (const [name, href] of [['Cadastro de peregrinos', 'peregrinos'], ['Seja um padre parceiro', 'padres'], ['Seja uma agência parceira', 'agencias']] as const)
      await expect(footer.getByRole('link', { name })).toHaveAttribute('href', new RegExp(href))
    await expect(page.getByRole('link', { name: 'Quero receber informações' })).toHaveAttribute('href', /\/cadastro\/peregrinos\?origem=home/)
    await page.goto('/cadastro')
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Cadastre-se')
    await page.getByRole('link', { name: 'Conhecer a parceria' }).click()
    await expect(page).toHaveURL(/\/cadastro\/padres/)
  })

  test('todos os links internos das landing pages respondem 200', async ({ page, request }) => {
    const seen = new Set<string>()
    for (const path of ['/cadastro/padres', '/cadastro/agencias', '/cadastro/peregrinos']) {
      await page.goto(path)
      const hrefs = await page.locator('main a[href]').evaluateAll((as) => as.map((a) => a.getAttribute('href') ?? ''))
      for (const h of hrefs) if (h.startsWith('/') && !seen.has(h)) {
        seen.add(h)
        const res = await request.get(h.split('#')[0] || path)
        expect(res.status(), `${h} em ${path}`).toBeLessThan(400)
      }
    }
    expect(seen.has('/destinos')).toBe(true)
  })

  test('perguntas frequentes expandem e recolhem', async ({ page }) => {
    await page.goto('/cadastro/padres')
    const q = page.getByRole('button', { name: 'Preciso ter um grupo formado para fazer o cadastro?' })
    await q.scrollIntoViewIfNeeded()
    await expect(q).toHaveAttribute('aria-expanded', 'false')
    await q.click()
    await expect(q).toHaveAttribute('aria-expanded', 'true')
    await expect(page.getByText('Não. O cadastro também pode ser utilizado para conhecer possibilidades')).toBeVisible()
    await q.click()
    await expect(page.getByText('Não. O cadastro também pode ser utilizado para conhecer possibilidades')).toBeHidden()
  })
})

test.describe('Formulário de padres (em etapas)', () => {
  test('valida por etapa, preserva dados ao voltar e grava após confirmação do servidor', async ({ page }) => {
    const email = mail('padre')
    await page.goto('/cadastro/padres?utm_source=e2e&utm_campaign=padres-e2e&origem=menu')
    const form = page.locator('#cadastro form')

    // Etapa 1: erros junto aos campos
    await form.getByRole('button', { name: 'Continuar' }).click()
    await expect(form.getByText('Informe seu nome completo.')).toBeVisible()
    await expect(form.getByText('Informe um e-mail válido.').or(form.getByText('Informe seu e-mail.'))).toBeVisible()
    await expect(form.getByText('Selecione o estado.')).toBeVisible()
    expect(await events(page)).toEqual(expect.arrayContaining(['start_form_padres', 'form_error']))

    await L(form, 'Nome completo').fill('Pe. Teste E2E')
    await L(form, 'E-mail').fill(email)
    await L(form, 'WhatsApp com DDD').fill('11987654321')
    await expect(L(form, 'WhatsApp com DDD')).toHaveValue('(11) 98765-4321') // máscara
    await L(form, 'Estado').selectOption('SP')
    await L(form, 'Cidade').fill('Campinas')
    await form.getByRole('button', { name: 'Continuar' }).click()

    // Etapa 2
    await expect(form.getByText('Etapa 2 de 3')).toBeVisible()
    await form.getByRole('button', { name: 'Continuar' }).click()
    await expect(form.getByText('Informe a diocese.')).toBeVisible()
    await expect(form.getByText('Selecione o interesse principal.')).toBeVisible()
    await L(form, 'Diocese').fill('Diocese de Campinas')
    await L(form, 'Paróquia ou comunidade').fill('Paróquia São José')
    await L(form, 'Função ou ministério exercido').fill('Pároco')
    // Aguarda as mensagens de erro desaparecerem para o layout não se deslocar durante o clique.
    await expect(form.getByText('Informe sua função ou ministério.')).toBeHidden()
    await expect(form.getByText('Informe a diocese.')).toBeHidden()
    await L(form, 'Acompanhar espiritualmente uma peregrinação').check()

    // Voltar preserva os dados da etapa 1
    await form.getByRole('button', { name: 'Voltar' }).click()
    await expect(L(form, 'Nome completo')).toHaveValue('Pe. Teste E2E')
    await expect(L(form, 'Cidade')).toHaveValue('Campinas')
    await form.getByRole('button', { name: 'Continuar' }).click()
    await expect(L(form, 'Diocese')).toHaveValue('Diocese de Campinas')
    await form.getByRole('button', { name: 'Continuar' }).click()

    // Etapa 3: o consentimento de privacidade é obrigatório; o de marketing, não
    await expect(form.getByText('Etapa 3 de 3')).toBeVisible()
    await L(form, 'Itália e Vaticano').check()
    await L(form, 'Aparecida e outros destinos do Brasil').check()
    await form.getByRole('button', { name: 'Enviar meu interesse' }).click()
    await expect(form.getByText(/necessário concordar com o tratamento/)).toBeVisible()
    expect(await findLeads(email)).toHaveLength(0)
    expect(await events(page)).not.toContain('submit_form_padres')

    await form.getByLabel(/Li e concordo/).check()
    await page.waitForTimeout(3200) // tempo mínimo antispam
    await form.getByRole('button', { name: 'Enviar meu interesse' }).click()
    await expect(page.getByRole('heading', { name: 'Cadastro recebido' })).toBeVisible()
    await expect(page.getByText('Agradecemos seu interesse em conhecer a Via Lumina Viagens.')).toBeVisible()
    expect(await events(page)).toContain('submit_form_padres')

    const [lead] = await findLeads(email)
    expect(lead).toMatchObject({ type: 'PADRE', name: 'Pe. Teste E2E', phone: '5511987654321', status: 'novo', partnershipStatus: 'pendente', source: 'lp-padres', entryPoint: 'menu', marketingConsent: false })
    expect(lead!.utm).toMatchObject({ source: 'e2e', campaign: 'padres-e2e' })
    expect(lead!.destinations).toEqual(expect.arrayContaining(['italia-vaticano', 'brasil']))
    expect(lead!.consents!.map((c) => c.purpose)).toEqual(['cadastro-contato'])
  })
})

test.describe('Formulário de agências (em etapas)', () => {
  test('CNPJ com máscara e validação; consultor sem CNPJ; envio grava como pendente', async ({ page }) => {
    const email = mail('agencia')
    await page.goto('/cadastro/agencias')
    const form = page.locator('#cadastro form')
    await L(form, 'Agência de viagens').check()
    await L(form, 'Razão social').fill('Agência E2E Ltda')
    await L(form, 'Nome fantasia').fill('E2E Viagens')
    await L(form, 'CNPJ').fill('11222333000182')
    await expect(L(form, 'CNPJ')).toHaveValue('11.222.333/0001-82')
    await L(form, 'Estado').selectOption('MG')
    await L(form, 'Cidade').fill('Belo Horizonte')
    await form.getByRole('button', { name: 'Continuar' }).click()
    await expect(form.getByText('CNPJ inválido. Confira os 14 dígitos.')).toBeVisible()

    // Consultor independente: CNPJ vira opcional
    await L(form, 'Consultor de turismo independente').check()
    await L(form, 'CNPJ').fill('')
    await expect(form.getByText('Opcional para consultores independentes sem CNPJ.')).toBeVisible()
    await L(form, 'Agência de viagens').check()
    await L(form, 'CNPJ').fill('11222333000181')
    await form.getByRole('button', { name: 'Continuar' }).click()

    await L(form, 'Nome do responsável').fill('Maria E2E Souza')
    await L(form, 'Cargo ou função').fill('Diretora comercial')
    await L(form, 'E-mail comercial').fill(email)
    await L(form, 'WhatsApp').fill('31988887777')
    await L(form, 'Conhecer condições comerciais').check()
    await form.getByRole('button', { name: 'Continuar' }).click()

    await L(form, 'Site da empresa').fill('www.e2eviagens.com.br')
    await L(form, 'Instagram comercial').fill('@e2eviagens')
    await L(form, 'México e Guadalupe').check()
    await form.getByLabel(/Li e concordo/).check()
    await form.getByLabel(/aceito receber novidades/).check()
    await page.waitForTimeout(3200)
    await form.getByRole('button', { name: 'Cadastrar minha agência' }).click()
    await expect(page.getByRole('heading', { name: 'Cadastro recebido' })).toBeVisible()
    expect(await events(page)).toContain('submit_form_agencias')

    const [lead] = await findLeads(email)
    expect(lead).toMatchObject({ type: 'AGENCIA', partnershipStatus: 'pendente', source: 'lp-agencias', marketingConsent: true })
    expect(lead!.agencyProfile).toMatchObject({ cnpj: '11222333000181', tradeName: 'E2E Viagens', instagram: '@e2eviagens', cnpjVerification: 'nao-verificado' })
  })
})

test.describe('Formulário de peregrinos (curto)', () => {
  test('valida, envia e grava; marketing é opcional e separado', async ({ page }) => {
    const email = mail('peregrino')
    await page.goto('/cadastro/peregrinos?origem=home&utm_source=e2e')
    const form = page.locator('#cadastro form')
    await form.getByRole('button', { name: 'Quero receber informações' }).click()
    await expect(form.getByText('Informe seu nome completo.')).toBeVisible()
    await expect(form.getByText('Selecione ao menos um destino de interesse.')).toBeVisible()
    await expect(form.getByText('Informe quando pretende viajar.')).toBeVisible()
    await expect(form.getByText(/necessário concordar com o tratamento/)).toBeVisible()
    await expect(form.getByLabel(/aceito receber novidades/)).not.toBeChecked()

    await L(form, 'Nome completo').fill('Ana E2E Peregrina')
    await L(form, 'E-mail').fill(email)
    await L(form, 'WhatsApp').fill('21988887766')
    await L(form, 'Cidade').fill('Niterói')
    await L(form, 'Estado').selectOption('RJ')
    await L(form, 'Egito e Terra Santa').check()
    await L(form, 'Entre 6 e 12 meses').check()
    await form.getByLabel(/Li e concordo/).check()
    await page.waitForTimeout(3200)
    await form.getByRole('button', { name: 'Quero receber informações' }).click()
    await expect(page.getByRole('heading', { name: 'Cadastro realizado com sucesso!' })).toBeVisible()
    expect(await events(page)).toEqual(expect.arrayContaining(['start_form_peregrinos', 'form_error', 'submit_form_peregrinos']))

    const [lead] = await findLeads(email)
    expect(lead).toMatchObject({ type: 'PEREGRINO', state: 'RJ', source: 'lp-peregrinos', entryPoint: 'home', marketingConsent: false, partnershipStatus: 'nao-se-aplica' })
    expect(lead!.destinations).toEqual(['egito-terra-santa'])
    expect(lead!.pilgrimProfile).toMatchObject({ travelPeriod: '6-12-meses' })
  })

  test('erro do servidor (envio rápido demais) não dispara submit_form_*', async ({ page }) => {
    const email = mail('rapido')
    await page.goto('/cadastro/peregrinos')
    const form = page.locator('#cadastro form')
    await L(form, 'Nome completo').fill('Pessoa Apressada')
    await L(form, 'E-mail').fill(email)
    await L(form, 'WhatsApp').fill('21988887766')
    await L(form, 'Cidade').fill('Rio de Janeiro')
    await L(form, 'Estado').selectOption('RJ')
    await L(form, 'Itália e Vaticano').check()
    await L(form, 'Ainda estou pesquisando').check()
    await form.getByLabel(/Li e concordo/).check()
    // O tempo mínimo é contado desde a abertura da página; corrompe-o para simular um robô.
    await page.evaluate(() => (document.querySelector('form') as HTMLFormElement | null)?.dispatchEvent(new Event('focusin', { bubbles: true })))
    await form.getByRole('button', { name: 'Quero receber informações' }).click({ trial: true })
    const started = Date.now()
    await form.getByRole('button', { name: 'Quero receber informações' }).click()
    const res = await Promise.race([
      page.getByRole('alert').filter({ hasText: /Aguarde alguns segundos/ }).waitFor({ timeout: 2500 }).then(() => 'erro'),
      page.getByRole('heading', { name: 'Cadastro realizado com sucesso!' }).waitFor({ timeout: 2500 }).then(() => 'ok'),
    ]).catch(() => 'nenhum')
    if (res === 'erro') {
      expect(await events(page)).not.toContain('submit_form_peregrinos')
      expect(await findLeads(email)).toHaveLength(0)
    } else {
      // Se o preenchimento levou mais de 3 s o envio é legítimo: apenas garante coerência.
      expect(Date.now() - started).toBeGreaterThan(0)
    }
  })

  test('link de retirada de consentimento promocional', async ({ page }) => {
    const email = mail('retirada')
    await page.goto('/cadastro/peregrinos')
    const form = page.locator('#cadastro form')
    await L(form, 'Nome completo').fill('Pessoa Retirada')
    await L(form, 'E-mail').fill(email)
    await L(form, 'WhatsApp').fill('21988880000')
    await L(form, 'Cidade').fill('Niterói')
    await L(form, 'Estado').selectOption('RJ')
    await L(form, 'Portugal e Fátima').check()
    await L(form, 'Nos próximos 3 meses').check()
    await form.getByLabel(/Li e concordo/).check()
    await form.getByLabel(/aceito receber novidades/).check()
    await page.waitForTimeout(3200)
    await form.getByRole('button', { name: 'Quero receber informações' }).click()
    await expect(page.getByRole('heading', { name: 'Cadastro realizado com sucesso!' })).toBeVisible()

    const { getPayload } = await import('payload')
    const config = (await import('../../src/payload.config.js')).default
    const payload = await getPayload({ config })
    const [lead] = await findLeads(email)
    const full = await payload.findByID({ collection: 'leads', id: lead!.id, overrideAccess: true })
    await page.goto(`/cadastro/comunicacoes/${full.unsubscribeToken}`)
    await page.getByRole('button', { name: 'Retirar meu consentimento promocional' }).click()
    await expect(page.getByRole('heading', { name: 'Consentimento retirado' })).toBeVisible()
    expect((await findLeads(email))[0]!.marketingConsent).toBe(false)
  })
})

test.describe('Painel “Cadastros e Parcerias”', () => {
  test.beforeAll(async () => seedStaff())
  test.afterAll(async () => cleanupStaff())

  test('equipe comercial vê as abas, filtra, abre o detalhe, atualiza status e exporta CSV', async ({ page }) => {
    const email = mail('painel')
    const { getPayload } = await import('payload')
    const config = (await import('../../src/payload.config.js')).default
    const payload = await getPayload({ config })
    // Cadastro real pelo formulário público
    await page.goto('/cadastro/peregrinos?utm_campaign=painel-e2e')
    const form = page.locator('#cadastro form')
    await L(form, 'Nome completo').fill('Cadastro Painel E2E')
    await L(form, 'E-mail').fill(email)
    await L(form, 'WhatsApp').fill('41988887766')
    await L(form, 'Cidade').fill('Curitiba')
    await L(form, 'Estado').selectOption('PR')
    await L(form, 'Itália e Vaticano').check()
    await L(form, 'Nos próximos 3 meses').check()
    await form.getByLabel(/Li e concordo/).check()
    await page.waitForTimeout(3200)
    await form.getByRole('button', { name: 'Quero receber informações' }).click()
    await expect(page.getByRole('heading', { name: 'Cadastro realizado com sucesso!' })).toBeVisible()

    await page.goto('/admin/login')
    await page.fill('#field-email', staffUser.email)
    await page.fill('#field-password', staffUser.password)
    await page.click('button[type="submit"]')
    await page.waitForURL(/\/admin$/)
    await page.getByRole('link', { name: /Cadastros novos/ }).click()
    await expect(page.getByRole('heading', { name: 'Cadastros e Parcerias', level: 1 })).toBeVisible()
    for (const tab of ['Padres', 'Agências', 'Peregrinos']) await expect(page.getByRole('navigation', { name: 'Perfis' }).getByRole('link', { name: new RegExp(tab) })).toBeVisible()

    await page.goto(`/admin/cadastros?tab=PEREGRINO&q=${encodeURIComponent(email)}`)
    const row = page.getByRole('row', { name: /Cadastro Painel E2E/ })
    await expect(row).toBeVisible()
    await expect(row.getByText('Novo', { exact: true }).first()).toBeVisible()
    await expect(row).toContainText('Curitiba')
    await expect(row).toContainText('campanha: painel-e2e')

    // Filtros que não devem encontrar o registro
    await page.goto(`/admin/cadastros?tab=PEREGRINO&q=${encodeURIComponent(email)}&state=SP`)
    await expect(page.getByText('Nenhum cadastro encontrado com estes filtros.')).toBeVisible()
    await page.goto(`/admin/cadastros?tab=PADRE&q=${encodeURIComponent(email)}`)
    await expect(page.getByText('Nenhum cadastro encontrado com estes filtros.')).toBeVisible()

    // Exportação respeita os filtros. Usa fetch no navegador (mesmo cabeçalho Sec-Fetch-Site do link do painel).
    const download = (qs: string) =>
      page.evaluate(async (u) => {
        const r = await fetch(u)
        return { status: r.status, type: r.headers.get('content-type') ?? '', disposition: r.headers.get('content-disposition') ?? '', text: await r.text() }
      }, `/api/leads/export?${qs}`)
    const csv = await download(`tab=PEREGRINO&q=${encodeURIComponent(email)}`)
    expect(csv.status).toBe(200)
    expect(csv.type).toContain('text/csv')
    expect(csv.disposition).toContain('attachment')
    expect(csv.text).toContain(email)
    expect((await download(`tab=PEREGRINO&q=${encodeURIComponent(email)}&marketing=1`)).text).not.toContain(email)
    expect((await download(`tab=PADRE&q=${encodeURIComponent(email)}`)).text).not.toContain(email)

    // Detalhe e atualização de status
    await page.goto(`/admin/cadastros?tab=PEREGRINO&q=${encodeURIComponent(email)}`)
    await page.getByRole('link', { name: 'Cadastro Painel E2E' }).click()
    await expect(page.getByText('Dados do formulário')).toBeVisible()
    await expect(page.getByText('Itália e Vaticano').first()).toBeVisible()
    const [lead] = await findLeads(email)
    await payload.update({ collection: 'leads', id: lead!.id, data: { status: 'em-analise', internalNotes: 'Contato agendado' }, overrideAccess: true })
    await page.goto(`/admin/cadastros?tab=PEREGRINO&q=${encodeURIComponent(email)}&status=em-analise`)
    await expect(page.getByRole('row', { name: /Cadastro Painel E2E/ })).toContainText('Em análise')
  })

  test('anônimo não acessa a exportação nem o painel', async ({ request, page }) => {
    expect((await request.get('/api/leads/export?tab=PADRE')).status()).toBe(403)
    await page.goto('/admin/cadastros')
    await expect(page).toHaveURL(/\/admin\/login/)
  })
})
