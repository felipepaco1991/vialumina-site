import { expect, test } from '@playwright/test'
import { cleanupLeads, findLeads } from '../helpers/leadsUser'

const email = `qa-mobile-${Date.now()}@e2e-cadastros.example.com`
test.afterAll(async () => cleanupLeads('%@e2e-cadastros.example.com'))

// Cada teste usa um IP distinto: o limite de taxa por IP não deve interferir entre testes.
let ipSeq = 0
test.beforeEach(async ({ page }) => {
  ipSeq++
  await page.setExtraHTTPHeaders({ 'x-real-ip': `10.${Math.floor(Date.now() / 1000) % 250}.${process.pid % 250}.${ipSeq}` })
})

test.describe('Cadastros no celular', () => {
  test('menu mobile organiza Parcerias e Cadastre-se', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Abrir menu' }).click()
    const dialog = page.getByRole('dialog', { name: 'Menu' })
    await expect(dialog.getByText('Parcerias')).toBeVisible()
    await expect(dialog.getByRole('link', { name: 'Para Padres' })).toBeVisible()
    await expect(dialog.getByRole('link', { name: 'Para Agências' })).toBeVisible()
    await dialog.getByRole('link', { name: /Cadastre-se/ }).click()
    await expect(page).toHaveURL(/\/cadastro\/peregrinos/)
  })

  test('CTA do hero fica visível sem rolar e leva ao formulário', async ({ page }) => {
    await page.goto('/cadastro/peregrinos')
    const cta = page.getByRole('link', { name: 'Quero me cadastrar como cliente' })
    await expect(cta).toBeInViewport()
    await cta.click()
    await expect(page.locator('#cadastro')).toBeInViewport()
  })

  test('campos confortáveis (altura mínima de toque) e envio completo no celular', async ({ page }) => {
    await page.goto('/cadastro/peregrinos')
    const form = page.locator('#cadastro form')
    const nome = form.getByLabel(/^Nome completo/)
    const box = await nome.boundingBox()
    expect(box!.height).toBeGreaterThanOrEqual(48)

    await nome.fill('Maria Celular')
    await form.getByLabel(/^E-mail/).fill(email)
    await form.getByLabel(/^WhatsApp/).fill('11977776666')
    await expect(form.getByLabel(/^WhatsApp/)).toHaveValue('(11) 97777-6666')
    await form.getByLabel(/^Cidade/).fill('São Paulo')
    await form.getByLabel(/^Estado/).selectOption('SP')
    await form.getByLabel('França e Lourdes').tap()
    await form.getByLabel('Entre 3 e 6 meses').tap()
    await form.getByLabel(/Li e concordo/).check()
    await page.waitForTimeout(3200)
    await form.getByRole('button', { name: 'Cadastrar-me como cliente' }).tap()
    await expect(page.getByRole('heading', { name: 'Cadastro realizado com sucesso!' })).toBeVisible()
    const [lead] = await findLeads(email)
    expect(lead).toMatchObject({ type: 'PEREGRINO', state: 'SP', destinations: ['franca-lourdes'] })
  })

  test('mensagens de erro aparecem junto aos campos no celular', async ({ page }) => {
    await page.goto('/cadastro/padres')
    const form = page.locator('#cadastro form')
    await form.getByRole('button', { name: 'Continuar' }).tap()
    const err = form.getByText('Informe seu nome completo.')
    await expect(err).toBeVisible()
    const nameBox = await form.getByLabel(/^Nome completo/).boundingBox()
    const errBox = await err.boundingBox()
    expect(errBox!.y - (nameBox!.y + nameBox!.height)).toBeLessThan(40)
  })
})
