import type { CollectionBeforeChangeHook, CollectionConfig, Validate } from 'payload'
import { editors, publishedOrEditors } from '@/access'
import { revalidateSite } from '@/hooks/revalidate'
import { slugField } from '@/fields/slug'
import { REGIONS, TRIP_STATUS } from '@/lib/taxonomy'

/** Obrigatório apenas quando o roteiro sai do rascunho. */
const requiredWhenPublic: Validate = (value, { siblingData, data }) => {
  const status = (data as { status?: string })?.status ?? (siblingData as { status?: string })?.status
  if (status === 'rascunho') return true
  const empty = value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0)
  return empty ? 'Obrigatório para roteiros fora do rascunho.' : true
}

/** Calcula dias a partir das datas oficiais quando não informado. */
const computeDays: CollectionBeforeChangeHook = ({ data }) => {
  if (data.startDate && data.endDate) {
    const days = Math.round((Date.parse(data.endDate) - Date.parse(data.startDate)) / 86_400_000) + 1
    if (days > 0) data.days = days
  }
  return data
}

const paragraphsHelp = 'Separe parágrafos com uma linha em branco.'

export const Trips: CollectionConfig = {
  slug: 'trips',
  labels: { singular: 'Peregrinação', plural: 'Peregrinações' },
  admin: {
    group: 'Peregrinações',
    useAsTitle: 'title',
    defaultColumns: ['title', 'startDate', 'departureCity', 'status', 'featured', 'linkTarget'],
    listSearchableFields: ['title', 'slug', 'departureCity', 'subtitle'],
    description:
      'Cada saída é um produto independente. Para criar outra saída do mesmo roteiro, use "Duplicar" e ajuste datas, embarque, acompanhante e slug.',
    pagination: { defaultLimit: 50 },
  },
  defaultSort: 'sortOrder',
  versions: { maxPerDoc: 30 },
  access: { read: publishedOrEditors, create: editors, update: editors, delete: editors },
  hooks: {
    beforeChange: [computeDays],
    afterChange: [revalidateSite],
    afterDelete: [revalidateSite],
  },
  fields: [
    {
      name: 'title',
      label: 'Nome do roteiro',
      type: 'text',
      required: true,
      hooks: { beforeDuplicate: [({ value }) => `${value} (cópia)`] },
    },
    slugField('title'),
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      required: true,
      defaultValue: 'rascunho',
      options: TRIP_STATUS.map((s) => ({ ...s })),
      // Uma cópia nunca nasce publicada: precisa de revisão de datas, embarque e acompanhante.
      hooks: { beforeDuplicate: [() => 'rascunho'] },
      admin: {
        position: 'sidebar',
        description: 'Rascunho não aparece no site. Encerrado mantém a página com aviso e sai do catálogo.',
      },
    },
    {
      name: 'featured',
      label: 'Destaque na página inicial',
      type: 'checkbox',
      defaultValue: false,
      hooks: { beforeDuplicate: [() => false] },
      admin: { position: 'sidebar' },
    },
    {
      name: 'sortOrder',
      label: 'Ordem',
      type: 'number',
      defaultValue: 100,
      admin: { position: 'sidebar', description: 'Menor número aparece primeiro na ordenação padrão.' },
    },
    {
      name: 'linkTarget',
      label: 'Botão "Conheça o roteiro completo" abre',
      type: 'select',
      required: true,
      defaultValue: 'legacy',
      options: [
        { label: 'Página original (site anterior)', value: 'legacy' },
        { label: 'Nova página interna', value: 'internal' },
      ],
      hooks: { beforeDuplicate: [() => 'internal'] },
      admin: {
        position: 'sidebar',
        description: 'Mude para "Nova página interna" quando a página deste roteiro estiver revisada e aprovada.',
      },
    },
    {
      name: 'legacyUrl',
      label: 'URL original (site anterior)',
      type: 'text',
      admin: { position: 'sidebar' },
      hooks: { beforeDuplicate: [() => null] },
      validate: (value: string | null | undefined, { siblingData }: { siblingData: { linkTarget?: string } }) => {
        if (siblingData?.linkTarget === 'legacy' && !value) return 'Informe a URL original ou mude o destino do botão para a página interna.'
        if (value && !/^https?:\/\//.test(value)) return 'Informe uma URL completa (https://...).'
        return true
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Apresentação',
          fields: [
            { name: 'subtitle', label: 'Linha de destinos', type: 'text', admin: { description: 'Ex.: LISBOA | FÁTIMA | LOURDES' } },
            { name: 'description', label: 'Descrição', type: 'textarea', validate: requiredWhenPublic },
            {
              type: 'row',
              fields: [
                { name: 'periodTag', label: 'Etiqueta de período', type: 'text', admin: { description: 'Ex.: OUTUBRO | 2027' } },
                { name: 'departureTag', label: 'Etiqueta de embarque', type: 'text', admin: { description: 'Ex.: SAÍDA DE BRASÍLIA' } },
              ],
            },
            { name: 'limitedNote', label: 'Aviso de vagas', type: 'textarea' },
            {
              name: 'featuredImage',
              label: 'Fotografia principal',
              type: 'upload',
              relationTo: 'media',
              validate: requiredWhenPublic,
            },
            {
              name: 'cardArt',
              label: 'Arte de divulgação',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'Peça gráfica usada nas redes sociais (exibida junto ao PDF).' },
            },
          ],
        },
        {
          label: 'Datas e embarque',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'startDate',
                  label: 'Data de saída',
                  type: 'date',
                  validate: requiredWhenPublic,
                  admin: { date: { pickerAppearance: 'dayOnly', displayFormat: 'dd/MM/yyyy' } },
                },
                {
                  name: 'endDate',
                  label: 'Data de retorno',
                  type: 'date',
                  validate: requiredWhenPublic,
                  admin: { date: { pickerAppearance: 'dayOnly', displayFormat: 'dd/MM/yyyy' } },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'days', label: 'Dias', type: 'number', admin: { readOnly: true, description: 'Calculado pelas datas.' } },
                { name: 'nights', label: 'Noites', type: 'number' },
              ],
            },
            { name: 'periodText', label: 'Período (texto exibido)', type: 'text', admin: { description: 'Ex.: 05 a 16 de outubro de 2027 · 9 noites' } },
            {
              name: 'departureCity',
              label: 'Cidade de embarque',
              type: 'text',
              validate: requiredWhenPublic,
              admin: { description: 'Use sempre a mesma grafia para o filtro agrupar corretamente (ex.: São Paulo/Guarulhos).' },
            },
            { name: 'departureAirport', label: 'Embarque (texto exibido)', type: 'text', admin: { description: 'Ex.: Saída do Aeroporto de Brasília' } },
            { name: 'accommodation', label: 'Acomodação', type: 'text' },
            { name: 'baggage', label: 'Bagagem permitida', type: 'text' },
          ],
        },
        {
          label: 'Destinos',
          fields: [
            {
              name: 'regions',
              label: 'Regiões',
              type: 'select',
              hasMany: true,
              options: REGIONS.map((r) => ({ ...r })),
              validate: requiredWhenPublic,
            },
            { name: 'countries', label: 'Países', type: 'text', hasMany: true, validate: requiredWhenPublic },
            { name: 'cities', label: 'Cidades visitadas', type: 'text', hasMany: true },
            { name: 'sanctuaries', label: 'Santuários e lugares de fé', type: 'text', hasMany: true, admin: { description: 'Usados na busca.' } },
          ],
        },
        {
          label: 'Acompanhamento espiritual',
          fields: [
            {
              name: 'guides',
              label: 'Sacerdotes e acompanhantes',
              labels: { singular: 'Pessoa', plural: 'Pessoas' },
              type: 'array',
              fields: [
                { name: 'guide', label: 'Pessoa', type: 'relationship', relationTo: 'guides', required: true },
                {
                  name: 'role',
                  label: 'Função neste roteiro',
                  type: 'text',
                  required: true,
                  admin: { description: 'Exatamente como informado pela equipe (ex.: Direção espiritual, Formadora).' },
                },
              ],
            },
            {
              name: 'guidance',
              label: 'Texto da seção',
              type: 'group',
              fields: [
                { name: 'eyebrow', label: 'Sobretítulo', type: 'text' },
                { name: 'heading', label: 'Título', type: 'text' },
                { name: 'lead', label: 'Introdução', type: 'textarea' },
                { name: 'points', label: 'Tópicos', type: 'array', fields: [{ name: 'text', label: 'Texto', type: 'text', required: true }] },
              ],
            },
          ],
        },
        {
          label: 'Destaques e galeria',
          fields: [
            {
              name: 'highlights',
              label: 'Destaques do itinerário',
              type: 'group',
              fields: [
                { name: 'heading', label: 'Título', type: 'text' },
                { name: 'intro', label: 'Introdução', type: 'textarea' },
                {
                  name: 'cards',
                  label: 'Cards',
                  type: 'array',
                  fields: [
                    { name: 'place', label: 'Local', type: 'text' },
                    { name: 'title', label: 'Título', type: 'text', required: true },
                    { name: 'text', label: 'Texto', type: 'textarea' },
                  ],
                },
              ],
            },
            {
              name: 'gallery',
              label: 'Galeria',
              type: 'group',
              fields: [
                { name: 'eyebrow', label: 'Sobretítulo', type: 'text' },
                { name: 'heading', label: 'Título', type: 'text' },
                {
                  name: 'items',
                  label: 'Fotografias',
                  type: 'array',
                  fields: [
                    { name: 'image', label: 'Imagem', type: 'upload', relationTo: 'media', required: true },
                    { name: 'place', label: 'Local', type: 'text' },
                    { name: 'title', label: 'Legenda', type: 'text' },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Programação',
          fields: [
            {
              name: 'itinerary',
              label: 'Programação dia a dia',
              labels: { singular: 'Dia', plural: 'Dias' },
              type: 'array',
              admin: { description: 'Transcreva integralmente; não resuma etapas.', initCollapsed: true, components: { RowLabel: '@/components/admin/DayRowLabel#DayRowLabel' } },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'day', label: 'Dia', type: 'number', required: true, admin: { width: '15%' } },
                    { name: 'dateLabel', label: 'Data (rótulo)', type: 'text', admin: { width: '20%', description: 'Ex.: 05/out' } },
                    { name: 'route', label: 'Cidades / deslocamento', type: 'text', required: true, admin: { width: '65%' } },
                  ],
                },
                { name: 'description', label: 'Descrição completa', type: 'textarea', required: true, admin: { description: paragraphsHelp, rows: 6 } },
              ],
            },
          ],
        },
        {
          label: 'Pacote',
          fields: [
            {
              name: 'packageSummary',
              label: 'Resumo do pacote',
              type: 'group',
              fields: [
                { name: 'heading', label: 'Título', type: 'text' },
                { name: 'text', label: 'Texto', type: 'textarea' },
                { name: 'tags', label: 'Etiquetas', type: 'text', hasMany: true },
              ],
            },
            {
              name: 'included',
              label: 'O que está incluído',
              type: 'group',
              fields: [
                { name: 'title', label: 'Título', type: 'text', defaultValue: 'O PREÇO DO PACOTE INCLUI:' },
                { name: 'items', label: 'Itens', type: 'array', fields: [{ name: 'text', label: 'Item', type: 'textarea', required: true }] },
              ],
            },
            {
              name: 'notIncluded',
              label: 'O que não está incluído',
              type: 'group',
              fields: [
                { name: 'title', label: 'Título', type: 'text', defaultValue: 'O PREÇO DO PACOTE NÃO INCLUI:' },
                { name: 'items', label: 'Itens', type: 'array', fields: [{ name: 'text', label: 'Item', type: 'textarea', required: true }] },
              ],
            },
            {
              name: 'observations',
              label: 'Observações comerciais',
              type: 'group',
              admin: { description: 'Cláusulas e ressalvas contratuais. Não remova sem aprovação.' },
              fields: [
                { name: 'heading', label: 'Título', type: 'text', defaultValue: 'OBSERVAÇÕES:' },
                {
                  name: 'paragraphs',
                  label: 'Parágrafos',
                  type: 'array',
                  fields: [
                    { name: 'text', label: 'Texto', type: 'textarea', required: true },
                    { name: 'emphasis', label: 'Exibir como nota', type: 'checkbox' },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Valores',
          description:
            'Valores só aparecem no site quando "Exibir valores" estiver marcado. Sem aprovação, o site mostra "Consulte as condições atuais".',
          fields: [
            {
              name: 'pricing',
              label: 'Valores e condições',
              type: 'group',
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'showPrices', label: 'Exibir valores (aprovados pela equipe comercial)', type: 'checkbox', defaultValue: false },
                    {
                      name: 'approvedAt',
                      label: 'Aprovado em',
                      type: 'date',
                      admin: { date: { pickerAppearance: 'dayOnly', displayFormat: 'dd/MM/yyyy' } },
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'currency',
                      label: 'Moeda original',
                      type: 'select',
                      defaultValue: 'BRL',
                      options: [
                        { label: 'Real (BRL)', value: 'BRL' },
                        { label: 'Dólar (USD)', value: 'USD' },
                        { label: 'Euro (EUR)', value: 'EUR' },
                      ],
                    },
                    { name: 'totalOriginalCurrency', label: 'Preço total na moeda original', type: 'number' },
                    { name: 'totalBrl', label: 'Preço total em R$', type: 'number' },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    { name: 'installmentsCount', label: 'Nº de parcelas', type: 'number' },
                    { name: 'installmentValueBrl', label: 'Valor da parcela (R$)', type: 'number' },
                    { name: 'extraInstallments', label: 'Parcelas adicionais (texto)', type: 'text' },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    { name: 'entryText', label: 'Entrada (texto exibido)', type: 'text', admin: { description: 'Ex.: Entrada de R$ 1.447,90' } },
                    { name: 'entryValueBrl', label: 'Entrada (R$)', type: 'number' },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    { name: 'exchangeRate', label: 'Câmbio de referência (R$ por unidade)', type: 'number' },
                    {
                      name: 'exchangeRateDate',
                      label: 'Data do câmbio',
                      type: 'date',
                      admin: { date: { pickerAppearance: 'dayOnly', displayFormat: 'dd/MM/yyyy' } },
                    },
                  ],
                },
                {
                  name: 'conditions',
                  label: 'Condições de pagamento e ressalvas',
                  type: 'array',
                  fields: [{ name: 'text', label: 'Texto', type: 'textarea', required: true }],
                },
                { name: 'internalNote', label: 'Nota interna', type: 'textarea', admin: { description: 'Não é exibida no site.' } },
              ],
            },
          ],
        },
        {
          label: 'Contato e arquivos',
          fields: [
            { name: 'pdf', label: 'Roteiro em PDF', type: 'upload', relationTo: 'documents' },
            {
              name: 'whatsappMessage',
              label: 'Mensagem pré-preenchida do WhatsApp',
              type: 'textarea',
              admin: { description: 'Se vazio: "Olá! Gostaria de receber mais informações sobre a peregrinação [nome], com saída em [data]."' },
            },
            {
              name: 'contact',
              label: 'Contato comercial específico',
              type: 'group',
              admin: { description: 'Só é exibido quando "Contato validado" estiver marcado. Caso contrário, o site usa os canais institucionais.' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'name', label: 'Nome', type: 'text' },
                    {
                      name: 'whatsapp',
                      label: 'WhatsApp (somente números, com 55 e DDD)',
                      type: 'text',
                      validate: (v: string | null | undefined) => (!v || /^55\d{10,11}$/.test(v) ? true : 'Use o formato 55 + DDD + número, sem espaços.'),
                    },
                    { name: 'email', label: 'E-mail', type: 'email' },
                  ],
                },
                { name: 'validated', label: 'Contato validado para publicação', type: 'checkbox', defaultValue: false },
              ],
            },
            {
              name: 'finalCta',
              label: 'Chamada final',
              type: 'group',
              fields: [
                { name: 'kicker', label: 'Sobretítulo', type: 'text' },
                { name: 'heading', label: 'Título', type: 'text', defaultValue: 'Quer saber mais sobre esta peregrinação?' },
                { name: 'text', label: 'Texto', type: 'textarea' },
              ],
            },
          ],
        },
        {
          label: 'SEO',
          fields: [
            {
              name: 'seo',
              type: 'group',
              label: false,
              fields: [
                { name: 'title', label: 'Título para buscadores', type: 'text', admin: { description: 'Até ~60 caracteres. Se vazio, usa o nome do roteiro.' } },
                { name: 'description', label: 'Descrição para buscadores', type: 'textarea', admin: { description: 'Até ~155 caracteres. Se vazio, usa a descrição.' } },
                { name: 'image', label: 'Imagem de compartilhamento', type: 'upload', relationTo: 'media' },
              ],
            },
          ],
        },
        {
          label: 'Migração',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'legacyNumber', label: 'Nº no briefing', type: 'number', admin: { readOnly: true } },
                { name: 'legacyWpSlug', label: 'Slug no WordPress', type: 'text', admin: { readOnly: true } },
              ],
            },
            {
              name: 'reviewNotes',
              label: 'Pendências de revisão editorial',
              type: 'array',
              admin: { description: 'Divergências encontradas na migração. Remova cada item após resolvê-lo.' },
              fields: [{ name: 'text', label: 'Pendência', type: 'textarea', required: true }],
            },
          ],
        },
      ],
    },
  ],
}
