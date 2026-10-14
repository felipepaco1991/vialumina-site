import { expect, test } from '@playwright/test'

test.describe('Página do roteiro', () => {
  test('apresenta resumo, acompanhantes e programação completa', async ({ page }) => {
    await page.goto('/destinos/egito-terra-santa')
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Egito e Terra Santa')
    const resumo = page.getByRole('region', { name: 'Resumo da viagem' })
    await expect(resumo).toContainText('10 a 25 de janeiro de 2028')
    await expect(resumo).toContainText('Saída do Aeroporto de Guarulhos')
    await expect(resumo).toContainText('Padre Paulo Júnior')
    await expect(resumo).toContainText('Formação e acompanhamento')
    await expect(page.locator('#programacao details')).toHaveCount(16)
  })

  test('expandir e recolher todos os dias', async ({ page }) => {
    await page.goto('/destinos/portugal-e-franca')
    const days = page.locator('#programacao details')
    await expect(days).toHaveCount(12)
    await page.getByRole('button', { name: 'Expandir todos' }).click()
    await expect(page.locator('#programacao details[open]')).toHaveCount(12)
    await expect(page.getByText('Visita panorâmica pela Capital Francesa')).toBeVisible()
    await page.getByRole('button', { name: 'Recolher todos' }).click()
    await expect(page.locator('#programacao details[open]')).toHaveCount(0)
    await days.nth(3).locator('summary').click()
    await expect(page.locator('#programacao details[open]')).toHaveCount(1)
  })

  test('galeria abre em lightbox e navega pelo teclado', async ({ page }) => {
    await page.goto('/destinos/europa-sagrada')
    await page.getByRole('button', { name: /^Ampliar foto 1 de 6/ }).click()
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    await expect(dialog).toContainText('1 / 6')
    await page.keyboard.press('ArrowRight')
    await expect(dialog).toContainText('2 / 6')
    await page.keyboard.press('ArrowLeft')
    await page.keyboard.press('ArrowLeft')
    await expect(dialog).toContainText('6 / 6')
    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
  })

  test('valores sem aprovação exibem "Consulte as condições atuais" e mantêm as observações', async ({ page }) => {
    await page.goto('/destinos/portugal-e-franca')
    await expect(page.getByRole('heading', { name: 'Consulte as condições atuais' })).toBeVisible()
    await expect(page.getByText('R$ 28.962,08')).toHaveCount(0)
    await expect(page.locator('#valores')).toContainText('Pacote válido para grupos de no mínimo 30 passageiros')
  })

  test('incluído e não incluído são transferidos integralmente', async ({ page }) => {
    await page.goto('/destinos/portugal-e-franca')
    const pacote = page.locator('#pacote')
    await expect(pacote.locator('ul').nth(1).locator('li')).toHaveCount(15)
    await expect(pacote.locator('ul').nth(2).locator('li')).toHaveCount(11)
    await expect(pacote).toContainText('Autorização de Viagem para Europa (ETIAS)')
  })

  test('dados estruturados TouristTrip e breadcrumbs', async ({ page }) => {
    await page.goto('/destinos/santuarios-italianos')
    const blocks = await page.locator('script[type="application/ld+json"]').allTextContents()
    const types = blocks.map((b) => JSON.parse(b)['@type'])
    expect(types).toEqual(expect.arrayContaining(['TouristTrip', 'BreadcrumbList', 'TravelAgency']))
  })
})
