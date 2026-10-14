#!/bin/sh
# Inicialização em produção: migrações → build (precisa do banco) → servidor.
# O build roda a cada início para refletir sempre o código da imagem e o conteúdo atual.
# Use SKIP_BUILD=1 para reaproveitar um build existente.
set -e
npm run migrate
if [ "$SKIP_BUILD" != "1" ] || [ ! -f .next/BUILD_ID ]; then
  npm run build
fi
exec npm run start
