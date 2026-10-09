import type { TextField } from 'payload'

export const slugify = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

/** Campo de slug único, gerado a partir de outro campo quando vazio. */
export const slugField = (from: string): TextField => ({
  name: 'slug',
  label: 'Endereço (slug)',
  type: 'text',
  unique: true,
  index: true,
  admin: { position: 'sidebar', description: 'Parte final da URL. Gerado automaticamente se ficar em branco.' },
  hooks: {
    beforeValidate: [
      ({ value, siblingData }) => {
        if (typeof value === 'string' && value.trim()) return slugify(value)
        const source = siblingData?.[from]
        return typeof source === 'string' ? slugify(source) : value
      },
    ],
  },
})
