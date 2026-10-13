import 'server-only'
import { cache } from 'react'
import { getPayloadClient } from './payload'

export const getSiteSettings = cache(async () => {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'site-settings', depth: 0 })
})

export const getInstagramSettings = cache(async () => {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'instagram', depth: 1 })
})

export type SiteSettingsData = Awaited<ReturnType<typeof getSiteSettings>>
