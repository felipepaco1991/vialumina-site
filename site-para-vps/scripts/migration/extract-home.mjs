/**
 * Extrai da homepage original os cards de "Nossas Peregrinações"
 * (inclusive viagens que não fazem parte dos 14 roteiros do briefing)
 * e grava migration/data/home-cards.raw.json.
 *
 * Uso: node scripts/migration/extract-home.mjs
 */
import * as cheerio from 'cheerio'
import fs from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '../..')
const html = fs.readFileSync(path.join(ROOT, 'migration/source/pages/home.html'), 'utf8')
const $ = cheerio.load(html)
$('br').replaceWith(' ')

const clean = (s) => (s ?? '').replace(/ /g, ' ').replace(/\s+/g, ' ').trim()

function decodeCfEmail(href) {
  const m = /#([0-9a-f]+)/i.exec(href ?? '')
  if (!m) return null
  const bytes = m[1].match(/../g).map((h) => parseInt(h, 16))
  return String.fromCharCode(...bytes.slice(1).map((b) => b ^ bytes[0]))
}

const cards = []
$('a').each((_, a) => {
  if (!/Conheça o roteiro completo/i.test($(a).text())) return
  // Sobe até o contêiner do card (o primeiro ancestral que contém a imagem).
  let card = $(a).parent()
  while (card.length && !card.find('img').length) card = card.parent()
  const img = card.find('img').first()
  const paragraphs = card
    .find('p')
    .map((_, p) => clean($(p).text()))
    .get()
    .filter(Boolean)
  const emailLink = card.find('a[href*="email-protection"]').attr('href')
  cards.push({
    order: cards.length + 1,
    image: img.attr('src') ?? null,
    imageSize: { width: Number(img.attr('width')) || null, height: Number(img.attr('height')) || null },
    title: clean(card.find('h2').first().text()),
    paragraphs,
    email: emailLink ? decodeCfEmail(emailLink) : null,
    href: $(a).attr('href'),
  })
})

const out = path.join(ROOT, 'migration/data/home-cards.raw.json')
fs.writeFileSync(out, JSON.stringify(cards, null, 2))
for (const c of cards) console.log(c.order, c.title, '|', path.basename(c.href), '|', c.email ?? '')
console.log(`\n→ ${path.relative(ROOT, out)} (${cards.length} cards)`)
