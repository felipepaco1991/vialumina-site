import Link from 'next/link'

/** Atalho "Cadastros e Parcerias" no topo do menu lateral do painel. */
export function LeadsNavLink() {
  return (
    <Link href="/admin/cadastros" className="nav__link" style={{ fontWeight: 600 }}>
      <span className="nav__link-label">Cadastros e Parcerias</span>
    </Link>
  )
}
