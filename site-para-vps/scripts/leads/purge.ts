/**
 * Rotina de retenção (LGPD): exclui cadastros cujo prazo "Reter até" já venceu.
 *
 *   npm run leads:purge                 # simulação: lista quantos seriam excluídos
 *   npm run leads:purge -- --apply      # exclui de fato (cadastro + perfil relacionado)
 *
 * O prazo vem da configuração "Retenção dos cadastros (meses)" no momento do cadastro e pode ser estendido por
 * registro no painel. Agende a execução (cron) conforme a política da empresa.
 */
import config from '@payload-config'
import { getPayload } from 'payload'

const apply = process.argv.includes('--apply')
const payload = await getPayload({ config })
const now = new Date().toISOString()
const where = { retainUntil: { less_than: now } }

const { totalDocs } = await payload.count({ collection: 'leads', where, overrideAccess: true })
if (!apply) {
  payload.logger.info(`Simulação: ${totalDocs} cadastro(s) com prazo de retenção vencido. Use --apply para excluir.`)
} else {
  await payload.delete({ collection: 'leads', where, overrideAccess: true })
  payload.logger.info(`${totalDocs} cadastro(s) com prazo de retenção vencido foram excluídos.`)
}
process.exit(0)
