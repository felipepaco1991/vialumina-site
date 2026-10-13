import type { CollectionConfig } from 'payload'
import { adminOnly, adminOnlyField, authenticated } from '@/access'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Usuário', plural: 'Usuários' },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['name', 'email', 'roles'],
    group: 'Administração',
  },
  auth: {
    maxLoginAttempts: 5,
    lockTime: 15 * 60 * 1000,
    tokenExpiration: 8 * 60 * 60,
  },
  access: {
    // O primeiro usuário pode ser criado pela tela inicial do painel;
    // depois disso, apenas administradores criam contas.
    create: async ({ req }) => {
      if (req.user) return adminOnly({ req })
      const { totalDocs } = await req.payload.count({ collection: 'users', overrideAccess: true })
      return totalDocs === 0
    },
    read: authenticated,
    update: ({ req, id }) => Boolean(req.user && (adminOnly({ req }) || req.user.id === id)),
    delete: adminOnly,
  },
  fields: [
    { name: 'name', label: 'Nome', type: 'text' },
    {
      name: 'roles',
      label: 'Perfis',
      type: 'select',
      hasMany: true,
      required: true,
      defaultValue: ['editor'],
      saveToJWT: true,
      access: { update: adminOnlyField, create: adminOnlyField },
      options: [
        { label: 'Administrador', value: 'admin' },
        { label: 'Editor de conteúdo', value: 'editor' },
        { label: 'Equipe comercial (cadastros)', value: 'comercial' },
      ],
      admin: {
        description:
          'Editores gerenciam roteiros, mídias e solicitações de contato. A equipe comercial atende os cadastros de padres, agências e peregrinos (dados pessoais). Administradores também gerenciam usuários e configurações.',
      },
    },
  ],
}
