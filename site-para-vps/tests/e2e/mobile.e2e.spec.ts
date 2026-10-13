import { expect, test } from '@playwright/test'

const PAGES = ['/', '/destinos', '/destinos/europa-sagrada', '/quem-somos', '/nossa-historia', '/contato', '/cadastro', '/cadastro/padres', '/cadastro/agencias', '/cadastro/peregrinos']
const WIDTHS = [360, 390, 430, 768, 1024, 1440]

test.describe('Responsividade', () => {
  for (const width of WIDTHS) {
    test(`sem rolagem horizontal em ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 })
      for (const p of PAGES) {
        await page.goto(p)
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
        expect(overflow, `${p} @ ${width}px`).toBeLessThanOrEqual(0)
      }
    })
  }

  test('menu mobile abre, navega e fecha', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')
    await page.getByRole('button', { name: 'Abrir menu' }).click()
    const dialog = page.getByRole('dialog', { name: 'Menu' })
    await expect(dialog).toBeVisible()
    await dialog.getByRole('link', { name: 'Destinos' }).click()
    await expect(page).toHaveURL(/\/destinos$/)
    await expect(dialog).toBeHidden()
  })

  test('filtros no celular: painel com aplicar', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/destinos')
    await page.getByRole('button', { name: /^Filtros/ }).click()
    const sheet = page.getByRole('dialog', { name: 'Filtrar peregrinações' })
    await sheet.getByRole('group', { name: 'Região' }).getByRole('checkbox', { name: /^Brasil/ }).check({ force: true })
    await expect(sheet.getByRole('button', { name: 'Ver 4 peregrinações' })).toBeVisible()
    await sheet.getByRole('button', { name: 'Ver 4 peregrinações' }).click()
    await expect(page.getByText('4 peregrinações encontradas')).toBeVisible()
    await expect(page).toHaveURL(/regiao=brasil/)
  })

  test('botões têm área de toque confortável', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/destinos/rio-de-janeiro-aparecida')
    for (const name of ['Quero saber mais!', 'Ver programação', 'Expandir todos']) {
      const box = await page.getByRole('link', { name }).or(page.getByRole('button', { name })).first().boundingBox()
      expect(box!.height, name).toBeGreaterThanOrEqual(44)
    }
  })
})
