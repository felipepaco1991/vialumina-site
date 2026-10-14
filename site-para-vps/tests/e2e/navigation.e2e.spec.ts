import { expect, test } from '@playwright/test'

const PAGES = [
  { path: '/', title: /Via Lumina Viagens/, h1: /Via Lumina Viagens/ },
  { path: '/quem-somos', title: /Quem Somos \| Via Lumina/, h1: /empresa de fé/ },
  { path: '/destinos', title: /Destinos/, h1: /Encontre sua próxima peregrinação/ },
  { path: '/nossa-historia', title: /Nossa História/, h1: /Dedicação, experiência e propósito/ },
  { path: '/contato', title: /Contato/, h1: /primeiro passo/ },
  { path: '/politica-de-privacidade', title: /Política de Privacidade/, h1: /Política de Privacidade/ },
]

test.describe('Arquitetura multipáginas', () => {
  for (const p of PAGES) {
    test(`${p.path} é uma página própria com título, H1 e canonical`, async ({ page }) => {
      const res = await page.goto(p.path)
      expect(res?.status()).toBe(200)
      await expect(page).toHaveTitle(p.title)
      await expect(page.locator('h1')).toHaveCount(1)
      await expect(page.locator('h1')).toHaveText(p.h1)
      const canonical = await page.locator('link[rel="canonical"]').getAttribute('href')
      expect(canonical).toContain(p.path === '/' ? '' : p.path)
      const description = await page.locator('meta[name="description"]').getAttribute('content')
      expect(description?.length).toBeGreaterThan(50)
    })
  }

  test('menu principal leva a páginas independentes (não âncoras)', async ({ page }) => {
    await page.goto('/')
    const nav = page.getByRole('navigation', { name: 'Principal' })
    for (const [label, path] of [
      ['Quem Somos', '/quem-somos'],
      ['Destinos', '/destinos'],
      ['Nossa História', '/nossa-historia'],
      ['Contato', '/contato'],
      ['Início', '/'],
    ]) {
      await nav.getByRole('link', { name: label, exact: true }).click()
      await expect(page).toHaveURL(new RegExp(`${path === '/' ? '/$' : path}$`))
      await expect(nav.getByRole('link', { name: label, exact: true })).toHaveAttribute('aria-current', 'page')
    }
  })

  test('página inexistente retorna 404 com navegação de volta', async ({ page }) => {
    const res = await page.goto('/destinos/roteiro-que-nao-existe')
    expect(res?.status()).toBe(404)
    await expect(page.getByRole('link', { name: 'Ver peregrinações' })).toBeVisible()
  })

  test('URLs antigas redirecionam permanentemente', async ({ request }) => {
    for (const [from, to] of [
      ['/elementor-pagina-899', '/destinos/portugal-e-franca'],
      ['/santuarios-marianos-2', '/destinos/santuarios-marianos-londrina'],
      ['/egito-e-terra-santa', '/destinos/egito-terra-santa'],
    ]) {
      const res = await request.get(from, { maxRedirects: 0 })
      expect([301, 308]).toContain(res.status())
      expect(new URL(res.headers().location!, 'http://x').pathname).toBe(to)
      // Forma original, com barra final: cadeia de redirecionamentos permanentes até o destino.
      const final = await request.get(`${from}/`)
      expect(final.status()).toBe(200)
      expect(new URL(final.url()).pathname).toBe(to)
    }
  })

  test('sitemap e robots', async ({ request }) => {
    const sitemap = await (await request.get('/sitemap.xml')).text()
    expect(sitemap.match(/<url>/g)?.length).toBeGreaterThanOrEqual(20)
    expect(sitemap).toContain('/destinos/egito-terra-santa')
    expect(sitemap).not.toContain('pendente-')
    const robots = await (await request.get('/robots.txt')).text()
    expect(robots).toContain('Disallow: /admin')
    expect(robots).toContain('Sitemap:')
  })
})
