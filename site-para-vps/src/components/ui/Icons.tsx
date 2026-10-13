import type { SVGProps } from 'react'

/** Marca do WhatsApp (o Lucide não inclui logotipos de marcas). */
export function WhatsAppIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.06 2.88 1.21 3.08.15.2 2.1 3.2 5.08 4.48.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35zM12.04 21.5h-.01a9.43 9.43 0 0 1-4.8-1.32l-.35-.2-3.56.93.95-3.47-.23-.36a9.41 9.41 0 0 1-1.44-5.02c0-5.2 4.24-9.44 9.45-9.44a9.4 9.4 0 0 1 6.68 2.77 9.38 9.38 0 0 1 2.76 6.68c0 5.21-4.24 9.44-9.45 9.44zm8.04-17.48A11.3 11.3 0 0 0 12.04.68C5.77.68.67 5.78.67 12.04c0 2 .52 3.96 1.52 5.68L.57 23.62l6.04-1.58a11.33 11.33 0 0 0 5.42 1.38h.01c6.26 0 11.36-5.1 11.37-11.36a11.3 11.3 0 0 0-3.33-8.04z" />
    </svg>
  )
}

export function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M13.5 21v-7.5h2.53l.38-2.94H13.5V8.69c0-.85.24-1.43 1.46-1.43h1.56V4.63a20.9 20.9 0 0 0-2.27-.12c-2.25 0-3.79 1.37-3.79 3.9v2.15H7.92v2.94h2.54V21h3.04z" />
    </svg>
  )
}

/** Raios dourados inspirados no logotipo — elemento decorativo. */
export function Rays({ className, ...props }: SVGProps<SVGSVGElement>) {
  const rays = Array.from({ length: 23 }, (_, i) => -110 + i * 10)
  return (
    <svg viewBox="-100 -100 200 200" aria-hidden="true" className={className} {...props}>
      {rays.map((deg, i) => (
        <line
          key={deg}
          x1="0"
          y1={-34}
          x2="0"
          y2={i % 2 ? -78 : -96}
          stroke="currentColor"
          strokeWidth={i % 2 ? 1.6 : 2.4}
          strokeLinecap="round"
          transform={`rotate(${deg})`}
        />
      ))}
    </svg>
  )
}
