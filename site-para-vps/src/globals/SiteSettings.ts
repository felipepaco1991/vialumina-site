import type { GlobalConfig } from 'payload'
import { adminOnly, anyone } from '@/access'
import { revalidateSite } from '@/hooks/revalidate'

const validateEmails = (values: string[] | null | undefined) =>
  !values?.length || values.every((v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) ? true : 'Informe apenas e-mails válidos.'

/** Canais institucionais e integrações. Valores iniciais vêm do site original. */
export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Configurações do site',
  admin: { group: 'Administração' },
  access: { read: anyone, update: adminOnly },
  hooks: { afterChange: [revalidateSite] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Contato',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'whatsapp',
                  label: 'WhatsApp (somente números)',
                  type: 'text',
                  required: true,
                  defaultValue: '5511992526053',
                  validate: (v: string | null | undefined) => (v && /^55\d{10,11}$/.test(v) ? true : 'Use 55 + DDD + número.'),
                },
                { name: 'whatsappDisplay', label: 'WhatsApp (exibição)', type: 'text', defaultValue: '+55 11 99252-6053' },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'phone', label: 'Telefone (somente números)', type: 'text', defaultValue: '551140033216' },
                { name: 'phoneDisplay', label: 'Telefone (exibição)', type: 'text', defaultValue: '+55 11 4003-3216' },
              ],
            },
            { name: 'email', label: 'E-mail institucional', type: 'email', defaultValue: 'contato@vialuminaviagens.com.br' },
            { name: 'hours', label: 'Horário de atendimento', type: 'text', defaultValue: 'Seg. a Sáb. 8h - 18h' },
            {
              name: 'address',
              label: 'Endereço',
              type: 'group',
              fields: [
                { name: 'street', label: 'Logradouro', type: 'text', defaultValue: 'Praça Dom José Gaspar, 134' },
                { name: 'complement', label: 'Complemento', type: 'text', defaultValue: '18º andar' },
                { name: 'district', label: 'Bairro', type: 'text', defaultValue: 'República' },
                { name: 'city', label: 'Cidade', type: 'text', defaultValue: 'São Paulo' },
                { name: 'state', label: 'UF', type: 'text', defaultValue: 'SP' },
                { name: 'zip', label: 'CEP', type: 'text', defaultValue: '01047-912' },
              ],
            },
            {
              name: 'defaultWhatsappMessage',
              label: 'Mensagem padrão do WhatsApp',
              type: 'textarea',
              defaultValue: 'Olá! Gostaria de saber mais sobre as peregrinações da Via Lumina.',
            },
          ],
        },
        {
          label: 'Redes e links',
          fields: [
            { name: 'instagramUrl', label: 'Instagram', type: 'text', defaultValue: 'https://www.instagram.com/vialuminaviagens/' },
            { name: 'facebookUrl', label: 'Facebook', type: 'text', defaultValue: 'https://www.facebook.com/vialuminaviagens' },
            { name: 'communityUrl', label: 'Comunidade no WhatsApp', type: 'text', defaultValue: 'https://chat.whatsapp.com/JiqNny9Qx8YK4rwZC7nXGO' },
            { name: 'grupoArboUrl', label: 'Site do Grupo Arbo', type: 'text', defaultValue: 'https://grupoarbo.tur.br/' },
            { name: 'garupaUrl', label: 'Garupa (apoio)', type: 'text', defaultValue: 'https://garupa.org.br/' },
          ],
        },
        {
          label: 'Formulário',
          fields: [
            {
              name: 'contactRecipients',
              label: 'Destinatários do formulário',
              type: 'text',
              hasMany: true,
              validate: (values: string[] | null | undefined) =>
                !values?.length || values.every((v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) ? true : 'Informe apenas e-mails válidos.',
              admin: { description: 'E-mails que recebem as solicitações. Se vazio, usa a variável CONTACT_RECIPIENTS.' },
            },
          ],
        },
        {
          label: 'Cadastros',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'leadRecipientsPadres', label: 'Substituir destinatários · padres (opcional)', type: 'text', hasMany: true, validate: validateEmails, admin: { description: 'Deixe vazio para usar o padrão do site. Se preencher, só estes e-mails recebem (sem cópia).' } },
                { name: 'leadRecipientsAgencias', label: 'Substituir destinatários · agências (opcional)', type: 'text', hasMany: true, validate: validateEmails, admin: { description: 'Deixe vazio para usar o padrão do site. Se preencher, só estes e-mails recebem (sem cópia).' } },
                { name: 'leadRecipientsPeregrinos', label: 'Substituir destinatários · peregrinos (opcional)', type: 'text', hasMany: true, validate: validateEmails, admin: { description: 'Deixe vazio para usar o padrão do site. Se preencher, só estes e-mails recebem (sem cópia).' } },
              ],
            },
            {
              name: 'leadConfirmationEmail',
              label: 'Enviar e-mail de confirmação ao cadastrado',
              type: 'checkbox',
              defaultValue: false,
              admin: { description: 'Só funciona com SMTP configurado. Desligado por padrão: nenhuma mensagem automática é enviada sem esta autorização.' },
            },
            {
              name: 'leadRetentionMonths',
              label: 'Retenção dos cadastros (meses)',
              type: 'number',
              min: 1,
              max: 120,
              defaultValue: 24,
              admin: { description: 'Após este prazo, sem atualização, o cadastro é elegível à exclusão (npm run leads:purge). Cada registro mostra a data prevista.' },
            },
          ],
        },
        {
          label: 'Analytics',
          fields: [
            { name: 'gtmId', label: 'Google Tag Manager (GTM-XXXX)', type: 'text', admin: { description: 'Se usar o GTM, configure o GA4 dentro dele e deixe o campo abaixo vazio para não duplicar eventos.' } },
            { name: 'ga4Id', label: 'Google Analytics 4 (G-XXXX)', type: 'text' },
          ],
        },
      ],
    },
  ],
}
