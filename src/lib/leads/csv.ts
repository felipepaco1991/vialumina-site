/** Geração de CSV (RFC 4180) com proteção contra injeção de fórmulas em planilhas. */
const FORMULA_START = /^[=+\-@\t\r]/

export function csvCell(value: unknown): string {
  let s = value == null ? '' : String(value)
  // Células que começam com = + - @ seriam interpretadas como fórmulas no Excel/Sheets.
  if (FORMULA_START.test(s)) s = `'${s}`
  return /[",\n\r;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

export function toCsv(headers: string[], rows: unknown[][]): string {
  // BOM para o Excel reconhecer UTF-8; separador vírgula.
  return '﻿' + [headers, ...rows].map((r) => r.map(csvCell).join(',')).join('\r\n') + '\r\n'
}
