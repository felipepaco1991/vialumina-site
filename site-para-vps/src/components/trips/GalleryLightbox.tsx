'use client'
import * as Dialog from '@radix-ui/react-dialog'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { AnimatePresence, MotionConfig, motion } from 'motion/react'
import Image from 'next/image'
import { useEffect, useRef } from 'react'
import type { GalleryItem } from './Gallery'

type Props = { items: GalleryItem[]; index: number; direction: number; onNavigate: (delta: number) => void; onClose: () => void }

export default function GalleryLightbox({ items, index, direction, onNavigate, onClose }: Props) {
  const current = items[index]

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') onNavigate(1)
      if (e.key === 'ArrowLeft') onNavigate(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onNavigate])

  // Gesto de deslizar no celular.
  const touchStart = useRef<number | null>(null)
  const onTouchStart = (e: React.TouchEvent) => (touchStart.current = e.touches[0].clientX)
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStart.current === null) return
    const dx = e.changedTouches[0].clientX - touchStart.current
    if (Math.abs(dx) > 50) onNavigate(dx < 0 ? 1 : -1)
    touchStart.current = null
  }

  return (
    <MotionConfig reducedMotion="user">
      <Dialog.Root open onOpenChange={(o) => !o && onClose()}>
        <AnimatePresence>
          {current ? (
            <Dialog.Portal forceMount>
              <Dialog.Overlay asChild forceMount>
                <motion.div className="fixed inset-0 z-[80] bg-navy-950/95" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
              </Dialog.Overlay>
              <Dialog.Content asChild forceMount aria-describedby={undefined}>
                <motion.div
                  className="fixed inset-0 z-[80] flex flex-col"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onTouchStart={onTouchStart}
                  onTouchEnd={onTouchEnd}
                >
                  <div className="flex items-center justify-between px-4 py-3 text-white sm:px-6">
                    <p className="font-label text-sm font-semibold tracking-wide text-white/70" aria-live="polite">
                      {index + 1} / {items.length}
                    </p>
                    <Dialog.Close className="inline-flex size-12 items-center justify-center rounded-full hover:bg-white/10" aria-label="Fechar galeria">
                      <X className="size-6" />
                    </Dialog.Close>
                  </div>
                  <div className="relative flex-1">
                    <AnimatePresence initial={false} custom={direction} mode="popLayout">
                      <motion.div
                        key={index}
                        custom={direction}
                        className="absolute inset-0 px-2 sm:px-20"
                        initial={{ opacity: 0, x: direction * 60 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: direction * -60 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <Image src={current.url} alt={current.alt} fill sizes="100vw" className="object-contain" />
                      </motion.div>
                    </AnimatePresence>
                    {items.length > 1 ? (
                      <>
                        <button
                          type="button"
                          onClick={() => onNavigate(-1)}
                          className="absolute top-1/2 left-2 inline-flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur hover:bg-white/20 sm:left-5"
                          aria-label="Foto anterior"
                        >
                          <ChevronLeft className="size-6" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onNavigate(1)}
                          className="absolute top-1/2 right-2 inline-flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur hover:bg-white/20 sm:right-5"
                          aria-label="Próxima foto"
                        >
                          <ChevronRight className="size-6" />
                        </button>
                      </>
                    ) : null}
                  </div>
                  <div className="px-6 pt-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] text-center text-white">
                    {current.place ? <p className="eyebrow-light">{current.place}</p> : null}
                    <Dialog.Title className="mt-1 font-display text-xl text-white sm:text-2xl">{current.title ?? current.alt}</Dialog.Title>
                    <p className="mx-auto mt-1 max-w-2xl text-sm text-white/60">{current.alt}</p>
                  </div>
                </motion.div>
              </Dialog.Content>
            </Dialog.Portal>
          ) : null}
        </AnimatePresence>
      </Dialog.Root>
    </MotionConfig>
  )
}
