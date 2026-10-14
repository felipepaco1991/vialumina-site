import fs from 'node:fs'
import path from 'node:path'
import { expect, test } from '@playwright/test'

const trips: { slug: string; title: string; legacyUrl: string }[] = JSON.parse(fs.readFileSync(path.resolve('migration/data/trips.json'), 'utf8'))

test.describe('Integridade dos links', () => {
  test('cada "Conheça o roteiro completo" aponta para o roteiro correspondente', async ({ page }) => {
    await page.goto('/destinos')
    const links = page.getByRole('link', { name: /^Conheça o roteiro completo/ })
    await expect(links).toHaveCount(14)
    const seen = new Set<string>()
    for (const link of await links.all()) {
      const label = (await link.getAttribute('aria-label'))!
      const href = (await link.getAttribute('href'))!
      const trip = trips.find((t) => href === t.legacyUrl || href === `/destinos/${t.slug}`)
      expect(trip, `destino inesperado: ${href}`).toBeTruthy()
      expect(label).toContain(trip!.title)
      seen.add(trip!.slug)
    }
    expect(seen.size).toBe(14)
  })

  test('nenhuma página pública usa href vazio ou "#"', async ({ page }) => {
    for (const p of ['/', '/destinos', '/quem-somos', '/nossa-historia', '/contato', '/destinos/portugal-e-franca', '/links']) {
      await page.goto(p)
      const bad = await page.$$eval('a', (as) => as.map((a) => a.getAttribute('href')).filter((h) => h === null || h === '' || h === '#'))
      expect(bad, p).toEqual([])
    }
  })

  test('links internos respondem 200', async ({ page, request }) => {
    test.setTimeout(240_000)
    const targets = new Set<string>()
    for (const p of ['/', '/destinos', '/quem-somos', '/nossa-historia', '/contato', '/destinos/egito-terra-santa']) {
      await page.goto(p)
      const hrefs = await page.$$eval('a[href^="/"]', (as) => as.map((a) => a.getAttribute('href')!))
      hrefs.forEach((h) => targets.add(h.split('#')[0]))
    }
    for (const t of targets) {
      if (!t) continue
      const res = await request.get(t)
      expect(res.status(), t).toBe(200)
    }
  })

  test('todas as páginas internas dos 14 roteiros existem e os PDFs abrem', async ({ request }) => {
    test.setTimeout(240_000)
    for (const t of trips) {
      const res = await request.get(`/destinos/${t.slug}`)
      expect(res.status(), t.slug).toBe(200)
      const html = await res.text()
      const pdf = html.match(/href="(\/api\/documents\/file\/[^"]+\.pdf)"/)?.[1]
      expect(pdf, `PDF de ${t.slug}`).toBeTruthy()
      const file = await request.get(pdf!)
      expect(file.status()).toBe(200)
      expect(file.headers()['content-type']).toContain('pdf')
    }
  })

  test('botões de WhatsApp usam o número oficial e mensagem preenchida', async ({ page }) => {
    await page.goto('/destinos/santuarios-italianos')
    const href = await page.getByRole('link', { name: 'Quero saber mais!' }).first().getAttribute('href')
    const url = new URL(href!)
    expect(url.hostname).toBe('wa.me')
    expect(url.pathname).toBe('/5511992526053')
    expect(url.searchParams.get('text')).toContain('Santuários Italianos')
  })
})
