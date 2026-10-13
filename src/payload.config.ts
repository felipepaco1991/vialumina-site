import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import { pt } from '@payloadcms/translations/languages/pt'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { Documents } from './collections/Documents'
import { Guides } from './collections/Guides'
import { Inquiries } from './collections/Inquiries'
import { Leads } from './collections/Leads'
import { AgencyProfiles, PilgrimProfiles, PriestProfiles } from './collections/LeadProfiles'
import { Media } from './collections/Media'
import { Trips } from './collections/Trips'
import { Users } from './collections/Users'
import { Instagram } from './globals/Instagram'
import { SiteSettings } from './globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// O Payload serve arquivos via /api/{media,documents}/file/... e repassa os bytes do R2.
// Bucket privado: nenhuma URL publica adicional e necessaria.
// Falha cedo em producao para nao gravar uploads em disco efemero da Hostinger.
const r2Required = process.env.NODE_ENV === 'production'
const r2Variables = ['R2_BUCKET', 'R2_ENDPOINT', 'R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY'] as const
const r2Missing = r2Variables.filter((name) => !process.env[name])

if (r2Required && r2Missing.length > 0) {
  throw new Error('Cloudflare R2 nao configurado. Variaveis ausentes: ' + r2Missing.join(', '))
}

const r2Configured = r2Missing.length === 0


export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SITE_URL || '',
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: {
      titleSuffix: ' · Via Lumina Admin',
      icons: [{ rel: 'icon', type: 'image/png', url: '/assets/logos/favicon-via-lumina.png' }],
    },
    dateFormat: 'dd/MM/yyyy',
    components: {
      beforeDashboard: ['@/components/admin/BeforeDashboard#BeforeDashboard'],
      // Item "Cadastros e Parcerias" (visão por abas) no topo do menu lateral.
      beforeNavLinks: ['@/components/admin/LeadsNavLink#LeadsNavLink'],
      views: { cadastros: { Component: '@/components/admin/LeadsView#LeadsView', path: '/cadastros' } },
      graphics: { Logo: '@/components/admin/Brand#AdminLogo', Icon: '@/components/admin/Brand#AdminIcon' },
    },
  },
  i18n: { supportedLanguages: { pt }, fallbackLanguage: 'pt' },
  collections: [Trips, Guides, Media, Documents, Inquiries, Leads, PriestProfiles, AgencyProfiles, PilgrimProfiles, Users],
  globals: [SiteSettings, Instagram],
  editor: lexicalEditor(),
  plugins: r2Configured
    ? [
        s3Storage({
          collections: {
            media: { prefix: 'media' },
            documents: { prefix: 'documents' },
          },
          bucket: process.env.R2_BUCKET!,
          config: {
            endpoint: process.env.R2_ENDPOINT!,
            region: 'auto',
            forcePathStyle: true,
            credentials: {
              accessKeyId: process.env.R2_ACCESS_KEY_ID!,
              secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
            },
          },
        }),
      ]
    : [],
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URL || '' },
    // Em produção o schema é aplicado por migrações versionadas (npm run migrate).
    migrationDir: path.resolve(dirname, 'migrations'),
    push: process.env.NODE_ENV !== 'production',
  }),
  sharp,
  upload: { limits: { fileSize: 30_000_000 } },
  graphQL: { disable: true },
})
