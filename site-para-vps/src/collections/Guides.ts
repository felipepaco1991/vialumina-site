import type { CollectionConfig } from 'payload'
import { anyone, editors } from '@/access'
import { revalidateSite } from '@/hooks/revalidate'
import { slugField } from '@/fields/slug'

/** Sacerdotes, formadores e acompanhantes das peregrinações. */
export const Guides: CollectionConfig = {
  slug: 'guides',
  labels: { singular: 'Acompanhante', plural: 'Sacerdotes e acompanhantes' },
  admin: {
    group: 'Peregrinações',
    useAsTitle: 'name',
    defaultColumns: ['name', 'defaultRole', 'updatedAt'],
    description: 'A função exibida em cada roteiro é definida no próprio roteiro. Não atribua funções que não estejam confirmadas.',
  },
  access: { read: anyone, create: editors, update: editors, delete: editors },
  hooks: { afterChange: [revalidateSite], afterDelete: [revalidateSite] },
  fields: [
    { name: 'name', label: 'Nome (como publicado)', type: 'text', required: true },
    slugField('name'),
    {
      name: 'defaultRole',
      label: 'Função principal',
      type: 'text',
      admin: { description: 'Ex.: Direção espiritual, Formadora, Formação e acompanhamento.' },
    },
    { name: 'photo', label: 'Foto', type: 'upload', relationTo: 'media' },
    { name: 'bio', label: 'Apresentação', type: 'textarea' },
  ],
}
