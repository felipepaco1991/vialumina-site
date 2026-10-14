import { expect, test } from '@playwright/test'

const TRIVVA = 'https://trivva.com.br/cadastro-via-lumina'

test.describe('Promoções e banners da home', () => {
  test('a hero é um carrossel com banners dos parceiros e troca sozinha a cada 4 s e só para no botão', async ({ page }) => {
    await page.goto('/')
    const slides = page.locator('[aria-roledescription="slide"]')
    expect(await slides.count()).toBeGreaterThanOrEqual(3)
    await expect(page.locator('h1')).toHaveCount(1)

    const active = () => page.locator('[aria-roledescription="slide"]:not([inert])').first().getAttribute('aria-label')
    const first = await active()
    // Mouse sobre o banner não interrompe a rotação.
    await page.mouse.move(400, 400)
    await expect.poll(active, { timeout: 7_000 }).not.toBe(first)

    await page.getByRole('button', { name: /Pausar troca automática/ }).click()
    const paused = await active()
    await page.waitForTimeout(5_000)
    expect(await active()).toBe(paused)
  })

  test('banners da Trivva e do Crescer levam às páginas e aos links de inscrição', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /Pausar troca automática/ }).click()

    await page.getByRole('button', { name: /Ir para o banner \d+: Parceria Trivva/ }).click()
    const trivva = page.getByRole('link', { name: 'Inscrever-se na Trivva' }).first()
    await expect(trivva).toHaveAttribute('href', TRIVVA)
    await expect(trivva).toHaveAttribute('target', '_blank')

    await page.getByRole('button', { name: /Ir para o banner \d+: 30º Crescer/ }).click()
    await page.getByRole('link', { name: 'Saiba mais', exact: true }).click()
    await expect(page).toHaveURL(/\/promocoes\/crescer$/)
  })

  test('menu Promoções lista as páginas', async ({ page }) => {
    await page.goto('/')
    const nav = page.getByRole('navigation', { name: 'Principal' })
    await nav.getByRole('button', { name: 'Promoções' }).click()
    await expect(nav.getByRole('link', { name: 'Todas as promoções' })).toBeVisible()
    await nav.getByRole('link', { name: /Trivva/ }).click()
    await expect(page).toHaveURL(/\/promocoes\/trivva$/)
  })

  for (const [path, title, h1] of [
    ['/promocoes', /Promoções/, /Oportunidades/],
    ['/promocoes/trivva', /Trivva/, /viagem de férias/],
    ['/promocoes/crescer', /Crescer/, /30º Crescer/],
  ] as const) {
    test(`${path} tem título, H1 único e canonical`, async ({ page }) => {
      expect((await page.goto(path))?.status()).toBe(200)
      await expect(page).toHaveTitle(title)
      await expect(page.locator('h1')).toHaveCount(1)
      await expect(page.locator('h1')).toHaveText(h1)
      expect(await page.locator('link[rel="canonical"]').getAttribute('href')).toContain(path)
    })
  }

  test('página da Trivva tem botão de inscrição no link combinado', async ({ page }) => {
    await page.goto('/promocoes/trivva')
    const links = page.getByRole('link', { name: 'Inscrever-se na Trivva' })
    expect(await links.count()).toBeGreaterThanOrEqual(2)
    for (const l of await links.all()) await expect(l).toHaveAttribute('href', TRIVVA)
  })
})
