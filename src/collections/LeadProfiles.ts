import type { CollectionConfig, Field } from 'payload'
import { adminOnly, leadStaff, leadStaffField } from '@/access'
import {
  AGENCY_INTERESTS,
  AGENCY_PROFILES,
  AGENCY_TENURE,
  AGENCY_VOLUME,
  DESTINATIONS,
  GROUP_INTENT,
  PARTY_SIZES,
  PRIEST_GROUP_SIZES,
  PRIEST_INTERESTS,
  TRAVEL_PERIODS,
  VERIFICATION_STATUS,
} from '@/lib/leads/constants'

/**
 * Dados específicos de cada perfil de cadastro, relacionados ao lead central (coleção "leads").
 * São criados somente pelo servidor após validação (Zod); o painel os exibe em modo leitura, dentro do lead.
 */

const readOnly = { readOnly: true }
const opts = (list: readonly { value: string; label: string }[]) => list.map((o) => ({ value: o.value, label: o.label }))
const yesNo = [
  { label: 'Sim', value: 'sim' },
  { label: 'Não', value: 'nao' },
]

const profileAccess: CollectionConfig['access'] = {
  create: () => false,
  read: leadStaff,
  update: () => false,
  delete: adminOnly,
}

const leadField: Field = { name: 'lead', label: 'Cadastro', type: 'relationship', relationTo: 'leads', required: true, index: true, admin: readOnly }
const messageField: Field = { name: 'message', label: 'Mensagem', type: 'textarea', admin: readOnly }
const destinationsField: Field = { name: 'destinations', label: 'Destinos de interesse', type: 'select', hasMany: true, options: opts(DESTINATIONS), admin: readOnly }

export const PriestProfiles: CollectionConfig = {
  slug: 'priest-profiles',
  labels: { singular: 'Perfil de padre', plural: 'Perfis de padres' },
  admin: { group: 'Cadastros e Parcerias', hidden: true, useAsTitle: 'ministry' },
  access: profileAccess,
  fields: [
    leadField,
    { name: 'displayName', label: 'Nome de identificação', type: 'text', admin: readOnly },
    { name: 'diocese', label: 'Diocese', type: 'text', required: true, admin: readOnly },
    { name: 'parish', label: 'Paróquia ou comunidade', type: 'text', required: true, admin: readOnly },
    { name: 'ministry', label: 'Função ou ministério', type: 'text', required: true, admin: readOnly },
    { name: 'mainInterest', label: 'Interesse principal', type: 'select', options: opts(PRIEST_INTERESTS), required: true, admin: readOnly },
    { name: 'hasOrganized', label: 'Já organizou ou acompanhou peregrinações?', type: 'select', options: yesNo, admin: readOnly },
    { name: 'groupSize', label: 'Pessoas interessadas (aprox.)', type: 'select', options: opts(PRIEST_GROUP_SIZES), admin: readOnly },
    destinationsField,
    { name: 'travelPeriod', label: 'Período previsto', type: 'select', options: opts(TRAVEL_PERIODS), admin: readOnly },
    messageField,
  ],
}

export const AgencyProfiles: CollectionConfig = {
  slug: 'agency-profiles',
  labels: { singular: 'Perfil de agência', plural: 'Perfis de agências' },
  admin: { group: 'Cadastros e Parcerias', hidden: true, useAsTitle: 'tradeName' },
  access: profileAccess,
  fields: [
    leadField,
    { name: 'legalName', label: 'Razão social', type: 'text', required: true, admin: readOnly },
    { name: 'tradeName', label: 'Nome fantasia', type: 'text', required: true, admin: readOnly },
    { name: 'cnpj', label: 'CNPJ (somente dígitos)', type: 'text', index: true, admin: readOnly },
    { name: 'contactRole', label: 'Cargo ou função', type: 'text', required: true, admin: readOnly },
    { name: 'profile', label: 'Perfil de atuação', type: 'select', options: opts(AGENCY_PROFILES), required: true, admin: readOnly },
    { name: 'interest', label: 'Interesse na parceria', type: 'select', options: opts(AGENCY_INTERESTS), required: true, admin: readOnly },
    { name: 'cadastur', label: 'Cadastur', type: 'text', admin: readOnly },
    { name: 'website', label: 'Site', type: 'text', admin: readOnly },
    { name: 'instagram', label: 'Instagram comercial', type: 'text', admin: readOnly },
    { name: 'tenure', label: 'Tempo de atuação', type: 'select', options: opts(AGENCY_TENURE), admin: readOnly },
    { name: 'worksWithReligious', label: 'Já trabalha com turismo religioso?', type: 'select', options: yesNo, admin: readOnly },
    { name: 'volume', label: 'Volume aproximado', type: 'select', options: opts(AGENCY_VOLUME), admin: readOnly },
    destinationsField,
    messageField,
    // Verificação feita pela equipe: o cadastro inicial nunca atribui "agência aprovada" automaticamente.
    {
      type: 'row',
      fields: [
        {
          name: 'cnpjVerification',
          label: 'Verificação do CNPJ',
          type: 'select',
          defaultValue: 'nao-verificado',
          options: opts(VERIFICATION_STATUS),
          access: { update: leadStaffField },
        },
        {
          name: 'cadasturVerification',
          label: 'Verificação do Cadastur',
          type: 'select',
          defaultValue: 'nao-verificado',
          options: opts(VERIFICATION_STATUS),
          access: { update: leadStaffField },
        },
      ],
    },
  ],
}

export const PilgrimProfiles: CollectionConfig = {
  slug: 'pilgrim-profiles',
  labels: { singular: 'Perfil de peregrino', plural: 'Perfis de peregrinos' },
  admin: { group: 'Cadastros e Parcerias', hidden: true, useAsTitle: 'travelPeriod' },
  access: profileAccess,
  fields: [
    leadField,
    destinationsField,
    { name: 'travelPeriod', label: 'Quando pretende viajar', type: 'select', options: opts(TRAVEL_PERIODS), required: true, admin: readOnly },
    { name: 'boardingCity', label: 'Cidade ou aeroporto de embarque', type: 'text', admin: readOnly },
    { name: 'partySize', label: 'Pessoas na viagem', type: 'select', options: opts(PARTY_SIZES), admin: readOnly },
    { name: 'previousPilgrimage', label: 'Já participou de peregrinação?', type: 'select', options: yesNo, admin: readOnly },
    { name: 'groupWithCommunity', label: 'Viajar com grupo da comunidade?', type: 'select', options: opts(GROUP_INTENT), admin: readOnly },
    messageField,
  ],
}
