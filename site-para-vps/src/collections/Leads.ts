import type { CollectionBeforeDeleteHook, CollectionBeforeChangeHook, CollectionConfig, Field } from 'payload'
import { adminOnly, leadStaff } from '@/access'
import { exportLeadsCsv } from '@/lib/leads/export.server'
import { parseLeadFilters } from '@/lib/leads/query'
import {
  CONSENT_PURPOSES,
  DESTINATIONS,
  LEAD_SOURCES,
  LEAD_STATUS,
  LEAD_TYPES,
  PARTNERSHIP_STATUS,
  UF_LIST,
} from '@/lib/leads/constants'

/** Dados enviados pelo formulário são imutáveis pelo painel (nem pela API); a equipe só altera a gestão do atendimento. */
const locked = { update: () => false } as const
const readOnly = { readOnly: true } as const

/** Mantém `marketingConsent` coerente com o registro de consentimentos (inclusive retiradas feitas pela equipe). */
const syncMarketingConsent: CollectionBeforeChangeHook = ({ data }) => {
  if (Array.isArray(data?.consents)) {
    data.marketingConsent = data.consents.some(
      (c: { purpose?: string; granted?: boolean; withdrawnAt?: string | null }) => c.purpose === 'comunicacoes' && c.granted && !c.withdrawnAt,
    )
  }
  return data
}

/** Antes de excluir um cadastro (manualmente ou pela rotina de retenção), remove também o perfil relacionado. */
const deleteProfiles: CollectionBeforeDeleteHook = async ({ id, req }) => {
  for (const collection of ['priest-profiles', 'agency-profiles', 'pilgrim-profiles'] as const) {
    await req.payload.delete({ collection, where: { lead: { equals: id } }, req, overrideAccess: true })
  }
}

const opts = (list: readonly { value: string; label: string }[]) => list.map((o) => ({ value: o.value, label: o.label }))

const dataFields: Field[] = [
  { name: 'type', label: 'Perfil', type: 'select', required: true, index: true, options: opts(LEAD_TYPES), access: locked, admin: { ...readOnly, position: 'sidebar' } },
  {
    type: 'row',
    fields: [
      { name: 'name', label: 'Nome / responsável', type: 'text', required: true, index: true, access: locked, admin: readOnly },
      { name: 'email', label: 'E-mail', type: 'email', required: true, index: true, access: locked, admin: readOnly },
    ],
  },
  {
    type: 'row',
    fields: [
      { name: 'phone', label: 'WhatsApp (55 + DDD + número)', type: 'text', index: true, access: locked, admin: readOnly },
      { name: 'city', label: 'Cidade', type: 'text', index: true, access: locked, admin: readOnly },
      { name: 'state', label: 'Estado', type: 'select', options: opts(UF_LIST), index: true, access: locked, admin: readOnly },
    ],
  },
  { name: 'destinations', label: 'Destinos de interesse', type: 'select', hasMany: true, options: opts(DESTINATIONS), access: locked, admin: readOnly },
  {
    name: 'profileDetails',
    type: 'ui',
    label: 'Dados do formulário',
    admin: { components: { Field: '@/components/admin/LeadProfile#LeadProfile' } },
  },
]

export const Leads: CollectionConfig = {
  slug: 'leads',
  labels: { singular: 'Cadastro', plural: 'Cadastros' },
  admin: {
    group: 'Cadastros e Parcerias',
    useAsTitle: 'name',
    defaultColumns: ['name', 'type', 'city', 'state', 'status', 'createdAt'],
    listSearchableFields: ['name', 'email', 'city'],
    description:
      'Registros de padres, agências e peregrinos recebidos pelas landing pages. Use a tela “Cadastros e Parcerias” (menu lateral) para a visão por abas. Dados pessoais: acesso restrito.',
  },
  defaultSort: '-createdAt',
  access: {
    // Criação só pelo servidor (Server Actions com validação, antispam e consentimento).
    create: () => false,
    read: leadStaff,
    update: leadStaff,
    delete: adminOnly,
  },
  hooks: { beforeChange: [syncMarketingConsent], beforeDelete: [deleteProfiles] },
  endpoints: [
    {
      // GET /api/leads/export?tab=PADRE&q=...&marketing=1 — somente administradores e equipe comercial.
      path: '/export',
      method: 'get',
      handler: async (req) => {
        const allowed = Boolean(req.user && (req.user.roles as string[] | undefined)?.some((r) => r === 'admin' || r === 'comercial'))
        if (!allowed) return Response.json({ error: 'Acesso negado.' }, { status: 403 })
        const filters = parseLeadFilters(Object.fromEntries(new URL(req.url ?? '', 'http://x').searchParams))
        const { csv } = await exportLeadsCsv(req.payload, filters, req.user!.id)
        const stamp = new Date().toISOString().slice(0, 10)
        return new Response(csv, {
          headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': `attachment; filename="cadastros-${filters.tab.toLowerCase()}-${stamp}.csv"`, 'Cache-Control': 'no-store' },
        })
      },
    },
  ],
  fields: [
    ...dataFields,

    // Gestão do atendimento (editável pela equipe)
    {
      type: 'row',
      fields: [
        { name: 'status', label: 'Status do atendimento', type: 'select', required: true, defaultValue: 'novo', index: true, options: opts(LEAD_STATUS), admin: { position: 'sidebar' } },
        {
          name: 'partnershipStatus',
          label: 'Aprovação da parceria',
          type: 'select',
          defaultValue: 'nao-se-aplica',
          index: true,
          options: opts(PARTNERSHIP_STATUS),
          admin: {
            position: 'sidebar',
            description: 'Independente do status de atendimento. Só se aplica a padres e agências; o cadastro nunca aprova a parceria automaticamente.',
            condition: (data) => data?.type === 'PADRE' || data?.type === 'AGENCIA',
          },
        },
      ],
    },
    { name: 'assignee', label: 'Responsável pelo atendimento', type: 'relationship', relationTo: 'users', index: true, admin: { position: 'sidebar' } },
    { name: 'internalNotes', label: 'Observações internas', type: 'textarea', admin: { description: 'Visível somente para a equipe. Não registre dados sensíveis desnecessários.' } },

    // Perfil relacionado (somente um é preenchido, conforme o tipo)
    { name: 'priestProfile', label: 'Perfil de padre', type: 'relationship', relationTo: 'priest-profiles', access: locked, admin: { hidden: true } },
    { name: 'agencyProfile', label: 'Perfil de agência', type: 'relationship', relationTo: 'agency-profiles', access: locked, admin: { hidden: true } },
    { name: 'pilgrimProfile', label: 'Perfil de peregrino', type: 'relationship', relationTo: 'pilgrim-profiles', access: locked, admin: { hidden: true } },

    // Origem e campanha
    {
      type: 'collapsible',
      label: 'Origem do cadastro',
      admin: { initCollapsed: false },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'source', label: 'Origem', type: 'select', required: true, defaultValue: 'manual', index: true, options: opts(LEAD_SOURCES), access: locked, admin: readOnly },
            { name: 'entryPoint', label: 'Ponto de entrada', type: 'text', access: locked, admin: { ...readOnly, description: 'Link do menu, rodapé, homepage etc., quando informado.' } },
          ],
        },
        { name: 'sourcePage', label: 'Página', type: 'text', access: locked, admin: readOnly },
        {
          name: 'utm',
          label: 'Campanha (UTM)',
          type: 'group',
          fields: [
            { name: 'source', label: 'utm_source', type: 'text', access: locked, admin: readOnly },
            { name: 'medium', label: 'utm_medium', type: 'text', access: locked, admin: readOnly },
            { name: 'campaign', label: 'utm_campaign', type: 'text', index: true, access: locked, admin: readOnly },
            { name: 'term', label: 'utm_term', type: 'text', access: locked, admin: readOnly },
            { name: 'content', label: 'utm_content', type: 'text', access: locked, admin: readOnly },
          ],
        },
      ],
    },

    // Privacidade (LGPD)
    {
      type: 'collapsible',
      label: 'Consentimentos e retenção (LGPD)',
      admin: { initCollapsed: false },
      fields: [
        {
          name: 'consents',
          label: 'Consentimentos registrados',
          type: 'array',
          // As linhas existentes não podem ser removidas/reordenadas: o histórico é parte da prova de consentimento.
          admin: { isSortable: false, initCollapsed: true },
          fields: [
            { type: 'row', fields: [
              { name: 'purpose', label: 'Finalidade', type: 'select', options: opts(CONSENT_PURPOSES), required: true, access: locked, admin: readOnly },
              { name: 'granted', label: 'Concedido', type: 'checkbox', access: locked, admin: readOnly },
            ] },
            { type: 'row', fields: [
              { name: 'grantedAt', label: 'Data e hora', type: 'date', access: locked, admin: { ...readOnly, date: { pickerAppearance: 'dayAndTime' } } },
              { name: 'noticeVersion', label: 'Versão do aviso', type: 'text', access: locked, admin: readOnly },
            ] },
            {
              name: 'withdrawnAt',
              label: 'Retirado em',
              type: 'date',
              admin: { date: { pickerAppearance: 'dayAndTime' }, description: 'Preencha para registrar a retirada do consentimento (ex.: pedido recebido por e-mail).' },
            },
          ],
        },
        { name: 'marketingConsent', label: 'Pode receber comunicações promocionais', type: 'checkbox', defaultValue: false, index: true, admin: readOnly },
        { name: 'retainUntil', label: 'Reter até', type: 'date', index: true, admin: { date: { pickerAppearance: 'dayOnly' }, description: 'Prazo previsto pela política de retenção. Pode ser estendido com justificativa (ex.: negociação em andamento).' } },
        { name: 'anonymizedAt', label: 'Anonimizado em', type: 'date', access: locked, admin: readOnly },
        // Segredo do link de retirada de consentimento enviado/exibido ao titular. Nunca é lido pela API.
        { name: 'unsubscribeToken', type: 'text', index: true, access: { read: () => false, update: () => false, create: () => false }, admin: { hidden: true } },
      ],
    },

    // Duplicidades
    {
      type: 'row',
      fields: [
        { name: 'possibleDuplicate', label: 'Possível duplicidade', type: 'checkbox', defaultValue: false, index: true, admin: { position: 'sidebar', description: 'Mesmo e-mail ou WhatsApp de outro cadastro do mesmo perfil. Desmarque após conferir.' } },
        { name: 'duplicateOf', label: 'Semelhante a', type: 'relationship', relationTo: 'leads', access: locked, admin: { position: 'sidebar', readOnly: true } },
      ],
    },
    { name: 'emailKey', type: 'text', index: true, access: { read: () => false, update: () => false }, admin: { hidden: true } },

    // Notificações
    {
      type: 'row',
      fields: [
        {
          name: 'notificationStatus',
          label: 'Aviso à equipe (e-mail)',
          type: 'select',
          defaultValue: 'pendente',
          options: [
            { label: 'Enviado', value: 'enviado' },
            { label: 'Pendente (SMTP/destinatários não configurados)', value: 'pendente' },
            { label: 'Falhou', value: 'falhou' },
          ],
          access: locked,
          admin: { position: 'sidebar', readOnly: true },
        },
        {
          name: 'confirmationStatus',
          label: 'Confirmação ao cadastrado',
          type: 'select',
          defaultValue: 'nao-enviada',
          options: [
            { label: 'Não enviada (desativada ou sem SMTP)', value: 'nao-enviada' },
            { label: 'Enviada', value: 'enviada' },
            { label: 'Falhou', value: 'falhou' },
          ],
          access: locked,
          admin: { position: 'sidebar', readOnly: true },
        },
      ],
    },
    { name: 'deliveryError', label: 'Erro de envio', type: 'text', access: locked, admin: { position: 'sidebar', readOnly: true } },
  ],
}
