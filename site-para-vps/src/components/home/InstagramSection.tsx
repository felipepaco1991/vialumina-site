import { Play } from 'lucide-react'
import Image from 'next/image'
import { ButtonLink } from '@/components/ui/Button'
import { InstagramIcon } from '@/components/ui/Icons'
import { Reveal } from '@/components/ui/Reveal'
import { INSTAGRAM } from '@/content/institutional'
import { getInstagramFeed } from '@/lib/instagram.server'
import { getInstagramSettings, getSiteSettings } from '@/lib/settings.server'

export async function InstagramSection() {
  const [{ posts }, ig, settings] = await Promise.all([getInstagramFeed(), getInstagramSettings(), getSiteSettings()])
  const profileUrl = settings.instagramUrl ?? `https://www.instagram.com/${ig.handle}/`
  return (
    <section aria-labelledby="instagram-titulo" className="bg-white py-24">
      <div className="container-site">
        <Reveal className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div className="flex items-center gap-5">
            <span className="rounded-full bg-[conic-gradient(from_180deg,#c9922a,#f2d58a,#0073b6,#0a2e5c,#c9922a)] p-[3px]">
              <Image src="/assets/institucional/instagram-avatar.webp" alt="" width={72} height={72} className="size-[72px] rounded-full border-[3px] border-white bg-white object-cover" />
            </span>
            <div>
              <h2 id="instagram-titulo" className="eyebrow mb-1.5">
                {INSTAGRAM.eyebrow}
              </h2>
              <p className="font-display text-2xl text-navy-900">@{ig.handle}</p>
              {ig.bio ? <p className="mt-1 max-w-md text-sm whitespace-pre-line text-slate-500">{ig.bio}</p> : null}
            </div>
          </div>
          <ButtonLink href={profileUrl} variant="outline" icon={<InstagramIcon className="size-5" />}>
            {INSTAGRAM.cta}
          </ButtonLink>
        </Reveal>

        {posts.length ? (
          <ul className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {posts.slice(0, 4).map((post, i) => (
              <Reveal as="li" key={post.id} delay={i * 0.07}>
                <a
                  href={post.permalink}
                  target="_blank"
                  rel="noopener"
                  className="group relative flex aspect-square flex-col justify-end overflow-hidden rounded-[var(--radius-card)] bg-navy-900 p-6 text-white ring-1 ring-navy-900/5 transition duration-500 hover:-translate-y-1 hover:shadow-lift"
                >
                  {post.image ? (
                    <Image src={post.image.url} alt="" fill sizes="(min-width: 1024px) 280px, 50vw" className="object-cover transition duration-700 group-hover:scale-105" />
                  ) : (
                    <span className="absolute inset-0 bg-[linear-gradient(150deg,#0a2e5c,#0f4c81_60%,#143f72)]" aria-hidden="true">
                      <Image src="/assets/logos/raios-via-lumina.webp" alt="" width={318} height={640} className="absolute -top-10 -right-14 w-40 opacity-25" />
                    </span>
                  )}
                  <span className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-navy-950/20 to-transparent" aria-hidden="true" />
                  <span className="absolute top-5 right-5 inline-flex size-9 items-center justify-center rounded-full bg-white/15 backdrop-blur" aria-hidden="true">
                    {post.isVideo ? <Play className="size-4 fill-current" /> : <InstagramIcon className="size-4" />}
                  </span>
                  <span className="relative line-clamp-4 text-[0.95rem] leading-relaxed">{post.caption}</span>
                  <span className="relative mt-3 font-label text-xs font-semibold tracking-wider text-gold-200 uppercase">
                    Ver no Instagram<span className="sr-only"> (abre em nova aba)</span>
                  </span>
                </a>
              </Reveal>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  )
}
