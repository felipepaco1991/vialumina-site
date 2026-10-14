# Imagem de produção do site Via Lumina (Next.js + Payload CMS).
# O build do Next precisa do banco (páginas estáticas geradas a partir do CMS),
# por isso ele roda na inicialização do contêiner — ver scripts/docker-entrypoint.sh.
FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json .npmrc ./
RUN npm ci

FROM node:22-alpine AS runner
RUN apk add --no-cache libc6-compat
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000 HOSTNAME=0.0.0.0
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs \
  && mkdir -p .next media documents && chown -R nextjs:nodejs .next media documents
USER nextjs
EXPOSE 3000
ENTRYPOINT ["sh", "scripts/docker-entrypoint.sh"]
