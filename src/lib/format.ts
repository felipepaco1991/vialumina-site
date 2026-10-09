/** Formatação pt-BR. Datas do CMS são tratadas como datas de calendário (sem fuso). */

const MONTHS = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro']
const MONTHS_SHORT = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']

/** "2027-10-05T00:00:00.000Z" (ou com horário local) → "2027-10-05". */
export function calendarDate(value: string | null | undefined): string | null {
  if (!value) return null
  const t = Date.parse(value)
  if (Number.isNaN(t)) return null
  // O seletor "somente dia" do Payload grava 12:00 UTC e o seed grava 00:00 UTC:
  // em ambos os casos a data UTC é a data de calendário.
  return new Date(t).toISOString().slice(0, 10)
}

const parts = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number)
  return { y, m, d }
}

export const monthName = (m: number) => MONTHS[m - 1]
export const monthShort = (m: number) => MONTHS_SHORT[m - 1]

/** "05 a 16 de outubro de 2027" / "21 de setembro a 02 de outubro de 2027" / "28 de dezembro de 2027 a 05 de janeiro de 2028" */
export function formatDateRange(start: string | null, end: string | null): string {
  if (!start) return 'Datas a confirmar'
  const s = parts(start)
  const dd = (n: number) => String(n).padStart(2, '0')
  if (!end) return `${dd(s.d)} de ${monthName(s.m)} de ${s.y}`
  const e = parts(end)
  if (s.y !== e.y) return `${dd(s.d)} de ${monthName(s.m)} de ${s.y} a ${dd(e.d)} de ${monthName(e.m)} de ${e.y}`
  if (s.m !== e.m) return `${dd(s.d)} de ${monthName(s.m)} a ${dd(e.d)} de ${monthName(e.m)} de ${e.y}`
  return `${dd(s.d)} a ${dd(e.d)} de ${monthName(e.m)} de ${e.y}`
}

/** "05/out/2027" */
export function formatShortDate(iso: string | null): string {
  if (!iso) return ''
  const { y, m, d } = parts(iso)
  return `${String(d).padStart(2, '0')}/${monthShort(m)}/${y}`
}

/** "Out 2027" — rótulo de mês/ano. */
export function formatMonthYear(yearMonth: string): string {
  const [y, m] = yearMonth.split('-').map(Number)
  const name = monthName(m)
  return `${name.charAt(0).toUpperCase()}${name.slice(1)} de ${y}`
}

const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
const num2 = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

/** "R$ 28.962,08" (com espaço comum, como no site original) */
export const formatBrl = (v: number) => brl.format(v).replace(/ /g, ' ')
/** "USD 5.444,00" — formato usado no site original. */
export const formatForeign = (v: number, currency: string) => `${currency} ${num2.format(v)}`

/** Remove acentos e caixa para comparação de textos. */
export const normalizeText = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()

/** Divide um texto em parágrafos (linha em branco como separador). */
export const toParagraphs = (s: string | null | undefined) =>
  (s ?? '')
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)

/** Etiqueta curta de período: "OUT 2027", "SET/OUT 2027", "DEZ 2027/JAN 2028". */
export function periodBadge(start: string | null, end: string | null): string | null {
  if (!start) return null
  const s = parts(start)
  const e = end ? parts(end) : s
  const S = monthShort(s.m).toUpperCase()
  const E = monthShort(e.m).toUpperCase()
  if (s.y !== e.y) return `${S} ${s.y}/${E} ${e.y}`
  return s.m === e.m ? `${S} ${s.y}` : `${S}/${E} ${s.y}`
}
