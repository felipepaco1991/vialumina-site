/**
 * Hostinger Business: migra, importa apenas quando necessario, compila.
 * Uso em Build command: npm run build:hostinger
 * Mantem o script normal 'npm run build' intacto para a versao VPS.
 */
import { spawnSync } from 'node:child_process'

const bin = process.platform === 'win32' ? 'npm.cmd' : 'npm'
const steps = [
  ['run', 'migrate'],
  ['run', 'seed:if-empty'],
  ['exec', '--', 'next', 'build'],
]

for (const args of steps) {
  process.stdout.write('[Hostinger] Executando: npm ' + args.join(' ') + '\n')
  const proc = spawnSync(bin, args, {
    stdio: 'inherit',
    env: {
      ...process.env,
      NODE_ENV: 'production',
      // Limite de heap conservador para hospedagem compartilhada.
      NODE_OPTIONS: '--no-deprecation --max-old-space-size=2048',
    },
  })
  if (proc.error || proc.status !== 0) {
    process.stderr.write('[Hostinger] Etapa falhou: npm ' + args.join(' ') + '\n')
    if (proc.error) process.stderr.write(proc.error.message + '\n')
    process.exit(proc.status || 1)
  }
}
