import { getPayload } from 'payload'
import config from '../../src/payload.config.js'

export const testUser = {
  email: 'qa-editor@vialuminaviagens.com.br',
  password: 'qa-senha-segura-123',
}

/** Cria um editor de testes para os testes e2e do painel. */
export async function seedTestUser(): Promise<void> {
  const payload = await getPayload({ config })
  await payload.delete({ collection: 'users', where: { email: { equals: testUser.email } } })
  await payload.create({ collection: 'users', data: { ...testUser, name: 'QA', roles: ['editor'] } })
}

export async function cleanupTestUser(): Promise<void> {
  const payload = await getPayload({ config })
  await payload.delete({ collection: 'users', where: { email: { equals: testUser.email } } })
}
