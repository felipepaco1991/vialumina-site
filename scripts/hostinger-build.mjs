/**
 * Hostinger Business: migra, importa apenas quando necessario, compila.
 * Hostinger seleciona obrigatoriamente npm run build, que chama este script.
 * Alteracoes limitadas a branch hostinger-business-adaptacao; backup VPS preservado.
 */
import { spawnSync } from 'node:child_process'

const bin = process.platform === 'win32' ? 'npm.cmd' : 'npm'
const directUrl = process.env.DATABASE_URL_UNPOOLED
if (!directUrl) {
  throw new Error('Configure DATABASE_URL_UNPOOLED com a URL direta do Neon (pooling desativado) para as migracoes.')
}
// Exclusivamente CI isolado (PostgreSQL descartavel, sem acesso ao R2 real).
// O ambiente da Hostinger nunca deve definir HOSTINGER_CI_SKIP_SEED_FOR_TESTS.
const skipSeedInCI = process.env.CI === 'true' && process.env.HOSTINGER_CI_SKIP_SEED_FOR_TESTS === '1'
const steps = [
  ['run', 'migrate'],
  ...(skipSeedInCI ? [] : [['run', 'seed:if-empty'], ['run', 'repair:media']]),
  ['exec', '--', 'next', 'build', '--webpack'],
]
// Etapas cuja falha apenas avisa: o site continua publicável (ex.: reparo de mídia no R2).
const optionalSteps = new Set(['repair:media'])

for (const args of steps) {
  process.stdout.write('[Hostinger] Executando: npm ' + args.join(' ') + '\n')
  const proc = spawnSync(bin, args, {
    stdio: 'inherit',
    env: {
      ...process.env,
      DATABASE_URL: args[1] === 'migrate' ? directUrl : process.env.DATABASE_URL,
      NODE_ENV: 'production',
      // Limite de heap conservador para hospedagem compartilhada.
      NODE_OPTIONS: '--no-deprecation --max-old-space-size=2048',
    },
  })
  if ((proc.error || proc.status !== 0) && optionalSteps.has(args[1])) {
    process.stderr.write('[Hostinger] Etapa opcional falhou (build segue): npm ' + args.join(' ') + '\n')
    continue
  }
  if (proc.error || proc.status !== 0) {
    process.stderr.write('[Hostinger] Etapa falhou: npm ' + args.join(' ') + '\n')
    if (proc.error) process.stderr.write(proc.error.message + '\n')
    process.exit(proc.status || 1)
  }
}
