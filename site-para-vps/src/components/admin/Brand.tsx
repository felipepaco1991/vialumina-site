/* eslint-disable @next/next/no-img-element -- componentes do painel do Payload */

/** Logotipo na tela de login do painel. */
export function AdminLogo() {
  return <img src="/assets/logos/via-lumina-logo.webp" alt="Via Lumina Viagens" style={{ width: 220, height: 'auto' }} />
}

/** Ícone na barra do painel. */
export function AdminIcon() {
  return <img src="/assets/logos/favicon-via-lumina.png" alt="Via Lumina" style={{ width: 28, height: 28, borderRadius: 6 }} />
}
