import { describe, expect, it } from 'vitest'
import { calendarDate, formatBrl, formatDateRange, formatForeign, normalizeText, periodBadge, toParagraphs } from '@/lib/format'
import { tripWhatsappMessage, whatsappUrl } from '@/lib/whatsapp'

describe('datas', () => {
  it('trata datas do CMS como datas de calendário, sem fuso', () => {
    expect(calendarDate('2027-10-05T00:00:00.000Z')).toBe('2027-10-05')
    // Formato gravado pelo seletor "somente dia" do painel (12:00 UTC).
    expect(calendarDate('2027-10-05T12:00:00.000Z')).toBe('2027-10-05')
    expect(calendarDate(null)).toBeNull()
  })
  it('formata períodos como no site original', () => {
    expect(formatDateRange('2027-10-05', '2027-10-16')).toBe('05 a 16 de outubro de 2027')
    expect(formatDateRange('2027-09-21', '2027-10-02')).toBe('21 de setembro a 02 de outubro de 2027')
    expect(formatDateRange('2027-12-28', '2028-01-05')).toBe('28 de dezembro de 2027 a 05 de janeiro de 2028')
  })
  it('gera etiqueta curta', () => {
    expect(periodBadge('2027-10-05', '2027-10-16')).toBe('OUT 2027')
    expect(periodBadge('2027-09-15', '2027-10-01')).toBe('SET/OUT 2027')
  })
})

describe('valores', () => {
  it('formata como no site original', () => {
    expect(formatBrl(28962.08)).toBe('R$ 28.962,08')
    expect(formatForeign(5444, 'USD')).toBe('USD 5.444,00')
  })
})

describe('textos', () => {
  it('normaliza acentos', () => expect(normalizeText('  Fátima São JOÃO ')).toBe('fatima sao joao'))
  it('divide parágrafos', () => expect(toParagraphs('a\n\nb\n \nc')).toEqual(['a', 'b', 'c']))
})

describe('WhatsApp', () => {
  it('monta link com mensagem contextualizada', () => {
    const msg = tripWhatsappMessage({ title: 'Egito e Terra Santa', startDate: '2028-01-10', endDate: '2028-01-25' })
    expect(msg).toBe('Olá! Gostaria de receber mais informações sobre a peregrinação Egito e Terra Santa, com saída em 10 a 25 de janeiro de 2028.')
    const url = new URL(whatsappUrl('55 (11) 99252-6053', msg))
    expect(url.hostname).toBe('wa.me')
    expect(url.pathname).toBe('/5511992526053')
    expect(url.searchParams.get('text')).toBe(msg)
  })
})
