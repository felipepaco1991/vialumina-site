import type { CollectionConfig } from 'payload'
import { anyone, editors } from '@/access'
import { revalidateSite } from '@/hooks/revalidate'

/** Fotografias e imagens do acervo original. */
export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Imagem', plural: 'Imagens' },
  admin: {
    group: 'Conteúdo',
    defaultColumns: ['filename', 'alt', 'updatedAt'],
    description: 'Use somente fotografias do acervo oficial da Via Lumina. O texto alternativo descreve a imagem para leitores de tela e buscadores.',
  },
  access: { read: anyone, create: editors, update: editors, delete: editors },
  hooks: { afterChange: [revalidateSite], afterDelete: [revalidateSite] },
  fields: [
    { name: 'alt', label: 'Texto alternativo', type: 'text', required: true },
    {
      name: 'originalUrl',
      label: 'URL de origem',
      type: 'text',
      admin: { description: 'Endereço do arquivo no site anterior (rastreabilidade da migração).', readOnly: true },
    },
  ],
  upload: {
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/avif'],
    focalPoint: true,
    formatOptions: { format: 'webp', options: { quality: 85 } },
    resizeOptions: { width: 2560, withoutEnlargement: true },
    imageSizes: [
      { name: 'thumb', width: 480, formatOptions: { format: 'webp', options: { quality: 78 } } },
      { name: 'card', width: 960, formatOptions: { format: 'webp', options: { quality: 80 } } },
      { name: 'large', width: 1920, formatOptions: { format: 'webp', options: { quality: 82 } } },
    ],
    adminThumbnail: 'thumb',
  },
}
