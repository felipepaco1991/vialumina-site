import localFont from 'next/font/local'

/** Famílias do site original, servidas localmente (licença OFL, ver public/assets/fonts/LICENSES.md). */
export const playfair = localFont({
  src: [
    { path: '../../public/assets/fonts/playfair-display-variable.woff2', weight: '400 900', style: 'normal' },
    { path: '../../public/assets/fonts/playfair-display-italic-variable.woff2', weight: '400 900', style: 'italic' },
  ],
  variable: '--font-playfair',
  display: 'swap',
  fallback: ['Georgia', 'serif'],
})

export const lato = localFont({
  src: [
    // Apenas os pesos usados no site (os demais arquivos ficam no acervo em public/assets/fonts).
    { path: '../../public/assets/fonts/lato-400.woff2', weight: '400', style: 'normal' },
    { path: '../../public/assets/fonts/lato-700.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-lato',
  display: 'swap',
  fallback: ['system-ui', 'Arial', 'sans-serif'],
})

export const montserrat = localFont({
  src: [{ path: '../../public/assets/fonts/montserrat-variable.woff2', weight: '400 800', style: 'normal' }],
  variable: '--font-montserrat',
  display: 'swap',
  fallback: ['system-ui', 'Arial', 'sans-serif'],
})
