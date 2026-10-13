import type { GlobalConfig } from 'payload'
import { anyone, editors } from '@/access'
import { revalidateSite } from '@/hooks/revalidate'

/**
 * Publicações exibidas quando a API oficial do Instagram não está configurada
 * ou indisponível. Cadastre apenas publicações reais do perfil oficial.
 */
export const Instagram: GlobalConfig = {
  slug: 'instagram',
  label: 'Instagram',
  admin: { group: 'Conteúdo' },
  access: { read: anyone, update: editors },
  hooks: { afterChange: [revalidateSite] },
  fields: [
    { name: 'handle', label: 'Perfil', type: 'text', defaultValue: 'vialuminaviagens' },
    { name: 'bio', label: 'Descrição do perfil', type: 'textarea' },
    {
      name: 'fallbackPosts',
      label: 'Publicações de reserva',
      type: 'array',
      maxRows: 8,
      admin: { description: 'Exibidas quando INSTAGRAM_ACCESS_TOKEN não estiver configurado.' },
      fields: [
        { name: 'permalink', label: 'Link da publicação', type: 'text', required: true },
        { name: 'image', label: 'Imagem', type: 'upload', relationTo: 'media' },
        { name: 'caption', label: 'Legenda', type: 'textarea' },
      ],
    },
  ],
}
