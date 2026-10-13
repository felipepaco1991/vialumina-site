# Publicação

O site é uma aplicação Next.js 16 com o Payload CMS 3 embutido (mesmo processo) e banco PostgreSQL. Precisa de:

- **Node.js 22** (ou Docker);
- **PostgreSQL 15+**;
- **armazenamento persistente** para os arquivos enviados pelo painel (pastas `media/` e `documents/`) — ou um armazenamento S3 (ver "Hospedagens sem disco persistente");
- **HTTPS** na frente da aplicação (Caddy, Nginx, Traefik ou o próprio provedor).

## Variáveis de ambiente

| Variável | Obrigatória | Descrição |
|---|---|---|
| `DATABASE_URL` | sim | `postgres://usuario:senha@host:5432/banco` |
| `PAYLOAD_SECRET` | sim | Texto longo e aleatório (assina sessões do painel). Gere com `openssl rand -hex 32` |
| `NEXT_PUBLIC_SITE_URL` | sim | URL pública, ex.: `https://vialuminaviagens.com.br` (canonical, sitemap, Open Graph; com `https://` também ativa o cabeçalho HSTS) |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` | recomendado | Envio das solicitações do formulário por e-mail. Sem elas, as mensagens ficam apenas no painel |
| `CONTACT_RECIPIENTS` | recomendado | E-mails que recebem as solicitações (separados por vírgula). Pode ser sobrescrito no painel |
| `INSTAGRAM_ACCESS_TOKEN` | opcional | Token de longa duração da API do Instagram (login do Instagram, permissão `instagram_business_basic`). Renovar a cada 60 dias |
| `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD` | só no seed | Primeiro administrador criado por `npm run seed` |

## Opção 1 — Servidor próprio com Docker (recomendado)

1. Copie o projeto para o servidor e crie `.env.production` com as variáveis acima (sem `DATABASE_URL`, que o compose monta) e `POSTGRES_PASSWORD`.
2. Suba os serviços:
   ```bash
   docker compose -f docker-compose.prod.yml --env-file .env.production up -d --build
   ```
   Na primeira inicialização o contêiner aplica as migrações, faz o build e inicia o servidor na porta 3000.
3. Importe o conteúdo migrado (uma única vez) e reinicie para gerar as páginas já com os roteiros:
   ```bash
   docker compose -f docker-compose.prod.yml exec app npm run seed
   docker compose -f docker-compose.prod.yml restart app
   ```
4. Configure o proxy HTTPS apontando para `localhost:3000` e o DNS do domínio.
5. **Backup:** banco (`pg_dump`) e os volumes `uploads_media` e `uploads_documents`.

Atualizações de código: `git pull` e `docker compose -f docker-compose.prod.yml up -d --build`. O contêiner aplica novas migrações e refaz o build ao iniciar (1–2 minutos). Alterações de conteúdo no painel **não** exigem reinício — as páginas são revalidadas automaticamente.

## Opção 2 — Servidor Node.js sem Docker

```bash
npm ci
cp .env.example .env            # preencha as variáveis
NODE_ENV=production npm run migrate
npm run seed                    # somente na primeira vez
npm run build
npm run start                   # porta 3000; use PM2/systemd para manter ativo
```

## Hospedagens sem disco persistente (Vercel, Netlify etc.)

Os uploads do painel precisam ir para um armazenamento de objetos. Instale `@payloadcms/storage-s3` (ou `storage-vercel-blob`), configure o plugin em `src/payload.config.ts` para as coleções `media` e `documents` e use um PostgreSQL gerenciado (Neon, Supabase, RDS). O build precisa de acesso ao banco.

## Banco de dados e migrações

- Em desenvolvimento, o Payload sincroniza o schema automaticamente.
- Em produção (`NODE_ENV=production`), o schema vem das migrações versionadas em `src/migrations/`:
  - aplicar: `npm run migrate`
  - após alterar campos no código: `npm run migrate:create nome-da-mudanca` e versionar o arquivo gerado.

## Virada de domínio (checklist)

1. Publicar o novo site num endereço provisório (ex.: `novo.vialuminaviagens.com.br`) com `NEXT_PUBLIC_SITE_URL` provisório.
2. Resolver as pendências da seção A de [pendencias-e-inconsistencias.md](pendencias-e-inconsistencias.md).
3. Revisar cada página de roteiro e mudar "Botão abre" para **Nova página interna** (enquanto apontar para o site antigo, o WordPress precisa continuar no ar).
4. Ajustar `NEXT_PUBLIC_SITE_URL` para o domínio definitivo e apontar o DNS.
5. Conferir os redirecionamentos ([redirecionamentos.md](redirecionamentos.md)) e enviar o `sitemap.xml` ao Google Search Console.
6. Decidir o destino de `wp-content/uploads` (PDFs compartilhados em redes sociais).
7. Remover o script do CookieYes/plugins do WordPress, se o domínio antigo for desativado; o novo site já tem aviso de consentimento próprio.

## Cadastros e parcerias (landing pages)

- **Migração:** `npm run migrate` aplica `20261009_165422_cadastros` (tabelas de cadastros e o perfil “Equipe comercial”). Rode antes do primeiro acesso às novas páginas.
- **Proxy:** o limite de taxa dos formulários usa `CF-Connecting-IP`, `X-Real-IP` ou o último valor de `X-Forwarded-For`. Configure o proxy para **sobrescrever** esses cabeçalhos (no Nginx: `proxy_set_header X-Real-IP $remote_addr;`), nunca repassar o valor enviado pelo cliente.
- **Variáveis novas (opcionais):** `LEAD_WEBHOOK_URL`/`LEAD_WEBHOOK_SECRET`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY` (embutida no build) e `TURNSTILE_SECRET_KEY`. Veja `.env.example`.
- **Retenção:** agende `npm run leads:purge -- --apply` (ex.: semanalmente). Teste antes sem `--apply`.
- **Imagens de IA:** coloque os arquivos em `public/assets/cadastro/` (ver o README da pasta) e republique; sem eles a página usa fotos do acervo.
