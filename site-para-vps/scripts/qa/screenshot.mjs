/**
 * Capturas de tela para revisão visual em várias larguras.
 * Uso: node scripts/qa/screenshot.mjs <url> <pasta-saida> [larguras=360,390,430,768,1024,1440] [--full]
 */
import { chromium } from '@playwright/test'
import fs from 'node:fs'
import path from 'node:path'

const [url, outDir, widthsArg, ...flags] = process.argv.slice(2)
if (!url || !outDir) {
  console.error('Uso: node scripts/qa/screenshot.mjs <url> <pasta> [larguras] [--full]')
  process.exit(1)
}
const widths = (widthsArg && !widthsArg.startsWith('--') ? widthsArg : '360,390,430,768,1024,1440').split(',').map(Number)
const full = flags.includes('--full') || widthsArg === '--full'
fs.mkdirSync(outDir, { recursive: true })

const browser = await chromium.launch({ channel: process.env.PW_CHANNEL || 'chrome' })
for (const width of widths) {
  const page = await browser.newPage({ viewport: { width, height: width < 768 ? 800 : 900 }, deviceScaleFactor: 1 })
  await page.goto(url, { waitUntil: 'networkidle' })
  // Força a entrada das animações ao rolar a página inteira.
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 400) {
      window.scrollTo({ top: y, behavior: 'instant' })
      await new Promise((r) => setTimeout(r, 120))
    }
    window.scrollTo({ top: 0, behavior: 'instant' })
  })
  await page.waitForTimeout(900)
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
  const name = `${new URL(url).pathname.replace(/\//g, '_') || 'home'}-${width}.png`
  await page.screenshot({ path: path.join(outDir, name), fullPage: full })
  console.log(`${width}px → ${name}${overflow > 0 ? `  ⚠ rolagem horizontal de ${overflow}px` : ''}`)
  await page.close()
}
await browser.close()
