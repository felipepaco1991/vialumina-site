import type { CollectionConfig } from 'payload'
import { adminOnly, editors } from '@/access'

/** Solicitações enviadas pelo formulário de contato. Criadas somente pelo servidor. */
export const Inquiries: CollectionConfig = {
  slug: 'inquiries',
  labels: { singular: 'Solicitação', plural: 'Solicitações de contato' },
  admin: {
    group: 'Atendimento',
    useAsTitle: 'name',
    defaultColumns: ['name', 'tripTitle', 'status', 'emailDelivery', 'createdAt'],
    description: 'Mensagens recebidas pelo site. "Envio por e-mail" indica se a notificação foi entregue à equipe.',
  },
  defaultSort: '-createdAt',
  access: {
    // Não há criação pela API pública: o formulário usa uma Server Action com validação.
    create: () => false,
    read: editors,
    update: editors,
    delete: adminOnly,
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'name', label: 'Nome', type: 'text', required: true, admin: { readOnly: true } },
        { name: 'email', label: 'E-mail', type: 'email', required: true, admin: { readOnly: true } },
        { name: 'whatsapp', label: 'WhatsApp', type: 'text', admin: { readOnly: true } },
      ],
    },
    { name: 'trip', label: 'Peregrinação de interesse', type: 'relationship', relationTo: 'trips', admin: { readOnly: true } },
    { name: 'tripTitle', label: 'Destino de interesse (texto)', type: 'text', admin: { readOnly: true } },
    { name: 'message', label: 'Mensagem', type: 'textarea', required: true, admin: { readOnly: true } },
    {
      type: 'row',
      fields: [
        { name: 'consent', label: 'Consentimento de privacidade', type: 'checkbox', required: true, admin: { readOnly: true } },
        { name: 'consentAt', label: 'Consentimento em', type: 'date', admin: { readOnly: true, date: { pickerAppearance: 'dayAndTime' } } },
      ],
    },
    { name: 'sourcePage', label: 'Página de origem', type: 'text', admin: { readOnly: true } },
    {
      name: 'status',
      label: 'Atendimento',
      type: 'select',
      defaultValue: 'novo',
      options: [
        { label: 'Novo', value: 'novo' },
        { label: 'Em atendimento', value: 'em-atendimento' },
        { label: 'Concluído', value: 'concluido' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'emailDelivery',
      label: 'Envio por e-mail',
      type: 'select',
      defaultValue: 'pendente',
      options: [
        { label: 'Enviado', value: 'enviado' },
        { label: 'Pendente (SMTP não configurado)', value: 'pendente' },
        { label: 'Falhou', value: 'falhou' },
      ],
      admin: { position: 'sidebar', readOnly: true },
    },
    { name: 'deliveryError', label: 'Erro de envio', type: 'text', admin: { position: 'sidebar', readOnly: true } },
    { name: 'internalNotes', label: 'Anotações internas', type: 'textarea' },
  ],
}
