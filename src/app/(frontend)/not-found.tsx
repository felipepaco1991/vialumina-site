import { Compass, Home } from 'lucide-react'
import { ButtonLink } from '@/components/ui/Button'

export default function NotFound() {
  return (
    <section className="relative isolate flex min-h-[80svh] items-center overflow-hidden bg-navy-900 pt-24 text-white">
      <div className="container-site max-w-2xl! text-center">
        <p className="eyebrow-light">Página não encontrada</p>
        <h1 className="mt-4 text-[2.6rem] leading-tight font-medium text-white sm:text-6xl">Este caminho não existe mais</h1>
        <p className="mt-5 text-lg text-white/80">O endereço pode ter mudado ou a peregrinação pode ter sido encerrada. Veja as peregrinações disponíveis ou volte ao início.</p>
        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink href="/destinos" variant="gold" icon={<Compass className="size-5" aria-hidden="true" />}>
            Ver peregrinações
          </ButtonLink>
          <ButtonLink href="/" variant="ghost-light" icon={<Home className="size-5" aria-hidden="true" />}>
            Página inicial
          </ButtonLink>
        </div>
      </div>
    </section>
  )
}
