import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
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
