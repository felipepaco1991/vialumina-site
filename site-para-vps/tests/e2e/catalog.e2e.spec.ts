import { expect, test, type Page } from '@playwright/test'

const results = (page: Page) => page.locator('main ul li article')
const count = (page: Page) => page.getByText(/peregrinaç(ão|ões) encontrada/)

test.describe('Catálogo /destinos', () => {
  test('lista os 14 roteiros', async ({ page }) => {
    await page.goto('/destinos')
    await expect(count(page)).toHaveText('14 peregrinações encontradas')
    await expect(results(page)).toHaveCount(14)
  })

  test('busca ignora acentos e atualiza a URL', async ({ page }) => {
    await page.goto('/destinos')
    await page.getByLabel('Pesquisar').fill('medjugorje')
    await expect(count(page)).toHaveText('1 peregrinação encontrada')
    await expect(page).toHaveURL(/q=medjugorje/)
    await page.getByLabel('Pesquisar').fill('FATIMA')
    await expect(count(page)).not.toHaveText('1 peregrinação encontrada')
    await expect(page).toHaveURL(/q=FATIMA/)
    expect(await results(page).count()).toBeGreaterThanOrEqual(4)
  })

  test('filtros combinados, chips ativos e limpar', async ({ page }) => {
    await page.goto('/destinos')
    const aside = page.getByRole('complementary', { name: 'Filtros' })
    await aside.getByRole('checkbox', { name: /^Europa/ }).check({ force: true })
    await aside.getByRole('checkbox', { name: /^Brasília/ }).check({ force: true })
    await expect(count(page)).toHaveText('3 peregrinações encontradas')
    await expect(page).toHaveURL(/regiao=europa/)
    await expect(page).toHaveURL(/embarque=brasilia/)
    await expect(page.getByRole('list', { name: 'Filtros ativos' }).getByRole('button', { name: /^Remover filtro/ })).toHaveCount(2)
    await page.getByRole('button', { name: 'Remover filtro Cidade de embarque: Brasília' }).click()
    await expect(count(page)).toHaveText('7 peregrinações encontradas')
    await aside.getByRole('button', { name: 'Limpar filtros' }).click()
    await expect(count(page)).toHaveText('14 peregrinações encontradas')
  })

  test('busca filtrada é compartilhável (estado restaurado pela URL)', async ({ page }) => {
    await page.goto('/destinos?regiao=brasil&acompanhante=adriana')
    await expect(count(page)).toHaveText('1 peregrinação encontrada')
    await expect(results(page).first()).toContainText('Rio de Janeiro e Aparecida')
    await expect(page.getByRole('complementary', { name: 'Filtros' }).getByRole('group', { name: 'Região' }).getByRole('checkbox', { name: /^Brasil/ })).toBeChecked()
  })

  test('estado vazio com ações', async ({ page }) => {
    await page.goto('/destinos?regiao=brasil&pais=mexico')
    await expect(page.getByRole('heading', { name: 'Nenhuma peregrinação com esses critérios' })).toBeVisible()
    await page.getByRole('button', { name: 'Limpar filtros' }).last().click()
    await expect(count(page)).toHaveText('14 peregrinações encontradas')
  })

  test('ordenação por duração', async ({ page }) => {
    await page.goto('/destinos')
    await page.getByLabel('Ordenar por').selectOption('duracao')
    await expect(page).toHaveURL(/ordem=duracao/)
    const first = await results(page).first().textContent()
    expect(first).toMatch(/7 dias/)
  })

  test('filtros acessíveis por teclado', async ({ page }) => {
    await page.goto('/destinos')
    const box = page.getByRole('complementary', { name: 'Filtros' }).getByRole('checkbox', { name: /^Oriente Médio/ })
    await box.focus()
    await page.keyboard.press('Space')
    await expect(count(page)).toHaveText('1 peregrinação encontrada')
  })
})
