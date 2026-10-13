import type { CollectionConfig } from 'payload'
import { anyone, editors } from '@/access'
import { revalidateSite } from '@/hooks/revalidate'

/** PDFs dos roteiros. */
export const Documents: CollectionConfig = {
  slug: 'documents',
  labels: { singular: 'Documento PDF', plural: 'Documentos PDF' },
  admin: {
    group: 'Conteúdo',
    useAsTitle: 'title',
    defaultColumns: ['title', 'filename', 'updatedAt'],
  },
  access: { read: anyone, create: editors, update: editors, delete: editors },
  hooks: { afterChange: [revalidateSite], afterDelete: [revalidateSite] },
  fields: [
    { name: 'title', label: 'Título', type: 'text', required: true },
    {
      name: 'originalUrl',
      label: 'URL de origem',
      type: 'text',
      admin: { description: 'Endereço do arquivo no site anterior.', readOnly: true },
    },
  ],
  upload: { mimeTypes: ['application/pdf'] },
}
