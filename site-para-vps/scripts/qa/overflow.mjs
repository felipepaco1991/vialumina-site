/**
 * Detecta elementos que ultrapassam a largura da janela (rolagem horizontal).
 * Uso: node scripts/qa/overflow.mjs [baseURL] [largura]
 */
import { chromium } from '@playwright/test'

const base = process.argv[2] || 'http://localhost:3000'
const width = Number(process.argv[3] || 360)
const pages = ['/', '/destinos', '/destinos/europa-sagrada', '/destinos/egito-terra-santa', '/quem-somos', '/nossa-historia', '/contato', '/links', '/politica-de-privacidade']
const browser = await chromium.launch({ channel: process.env.PW_CHANNEL || 'chrome' })
const page = await browser.newPage({ viewport: { width, height: 800 } })
for (const p of pages) {
  await page.goto(base + p, { waitUntil: 'networkidle' })
  const res = await page.evaluate(() => {
    const vw = document.documentElement.clientWidth
    const over = document.documentElement.scrollWidth - vw
    const offenders = []
    if (over > 0)
      for (const el of document.querySelectorAll('body *')) {
        const r = el.getBoundingClientRect()
        if (r.right > vw + 1 && r.width > 0) offenders.push(`${el.tagName.toLowerCase()}.${String(el.className).slice(0, 80)} → right=${Math.round(r.right)}`)
      }
    return { over, offenders: offenders.slice(0, 6) }
  })
  console.log(`${p} @${width}: ${res.over > 0 ? `⚠ ${res.over}px` : 'ok'}`)
  res.offenders.forEach((o) => console.log('   ', o))
}
await browser.close()
