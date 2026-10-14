import { getPayload } from 'payload'
import config from '../../src/payload.config.js'

export const staffUser = { email: 'qa-comercial@vialuminaviagens.com.br', password: 'qa-senha-segura-123' }

export async function seedStaff(): Promise<void> {
  const payload = await getPayload({ config })
  await payload.delete({ collection: 'users', where: { email: { equals: staffUser.email } } })
  await payload.create({ collection: 'users', data: { ...staffUser, name: 'QA Comercial', roles: ['comercial'] } })
}

export async function cleanupStaff(): Promise<void> {
  const payload = await getPayload({ config })
  await payload.delete({ collection: 'users', where: { email: { equals: staffUser.email } } })
}

/** Remove cadastros criados pelos testes (identificados pelo domínio example.com do e-mail de QA). */
export async function cleanupLeads(prefix: string): Promise<void> {
  const payload = await getPayload({ config })
  await payload.delete({ collection: 'leads', where: { email: { like: prefix } }, overrideAccess: true })
}

export async function findLeads(email: string) {
  const payload = await getPayload({ config })
  return (await payload.find({ collection: 'leads', where: { email: { equals: email } }, depth: 1, overrideAccess: true, sort: 'createdAt' })).docs
}
