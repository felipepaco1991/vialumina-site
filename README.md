# Via Lumina Viagens — site e CMS

Reconstrução do site [vialuminaviagens.com.br](https://vialuminaviagens.com.br/): plataforma institucional de turismo religioso, multipáginas, com catálogo filtrável de peregrinações, páginas completas de cada roteiro e painel administrativo para a equipe.

| | |
|---|---|
| **Front-end** | Next.js 16 (App Router, React 19, TypeScript), Tailwind CSS 4, Motion, Radix UI, Lucide |
| **CMS** | Payload CMS 3 (embutido no Next.js, painel em `/admin`), PostgreSQL |
| **Formulários** | React Hook Form + Zod (validação no cliente e no servidor), Server Actions, Nodemailer |
| **Testes** | Vitest (unidade e integração com o CMS), Playwright (ponta a ponta, desktop e celular) |

## Páginas

| Rota | Conteúdo |
|---|---|
| `/` | Homepage: hero, diferenciais, peregrinações em destaque, quem somos, história, valores, Instagram, chamada final |
| `/destinos` | Catálogo com busca sem acentos, filtros combináveis (região, país, mês/ano, embarque, duração, acompanhante, preço quando aprovado), ordenação e estado na URL |
| `/destinos/[slug]` | Página do roteiro: resumo, direção espiritual, destaques, galeria com lightbox, programação dia a dia, incluído/não incluído, valores e condições, PDF, contato contextualizado, relacionados |
| `/quem-somos`, `/nossa-historia` | Páginas institucionais |
| `/contato` | Canais oficiais, mapa sob demanda e formulário real |
| `/cadastro`, `/cadastro/padres`, `/cadastro/agencias`, `/cadastro/peregrinos` | Landing pages de cadastro (padres, agências, peregrinos) — ver [docs/cadastros-e-parcerias.md](docs/cadastros-e-parcerias.md) |
| `/politica-de-privacidade`, `/links` | Política (texto-base para revisão jurídica) e página de links da bio do Instagram |
| `/admin`, `/admin/cadastros` | Painel administrativo e visão “Cadastros e Parcerias” |

## Começando (desenvolvimento)

Requisitos: Node.js 22 e Docker (para o PostgreSQL).

```bash
npm install
cp .env.example .env          # ajuste PAYLOAD_SECRET e SEED_ADMIN_PASSWORD
docker compose up -d          # PostgreSQL local
npm run seed                  # importa os 14 roteiros, viagens pendentes, imagens e PDFs
npm run dev                   # http://localhost:3000  ·  painel: http://localhost:3000/admin
```

O seed cria o administrador definido em `SEED_ADMIN_EMAIL`/`SEED_ADMIN_PASSWORD` e pode ser executado novamente sem duplicar registros.

## Scripts

| Comando | Função |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` / `npm run start` | Build e servidor de produção (o build precisa do banco) |
| `npm run migrate` / `npm run migrate:create <nome>` | Aplicar / criar migrações de banco (produção) |
| `npm run leads:purge` | Retenção LGPD dos cadastros (`-- --apply` exclui) |
| `npm run seed` | Importar o conteúdo migrado para o CMS |
| `npm run lint` | ESLint |
| `npm run test:int` | Testes de unidade e integração (Vitest; integração requer o banco) |
| `npm run test:e2e` | Testes ponta a ponta (Playwright; usa `E2E_BASE_URL` ou sobe `npm run dev`) |
| `npm run generate:types` | Regenera `src/payload-types.ts` após alterar coleções |

Scripts de migração (`scripts/migration/`, executados com `node`): `extract-trips.mjs`, `extract-home.mjs`, `download-assets.mjs`, `optimize-assets.mjs`, `build-catalog.mjs`, `build-reports.mjs`. Scripts de QA (`scripts/qa/`): capturas de tela, rolagem horizontal, Lighthouse.

## Estrutura

```text
src/
  app/(frontend)/        páginas públicas (layout, rotas, server action do contato)
  app/(payload)/         painel e API do Payload (gerado)
  app/sitemap.ts, robots.ts
  collections/, globals/ modelos de conteúdo do CMS (roteiros, acompanhantes, mídia, PDFs, solicitações, usuários, configurações)
  components/            layout, ui, home, trips, contact, analytics, admin, seo
  content/               textos institucionais originais
  lib/                   dados (consultas, modelo de visualização), filtros, formatação, WhatsApp, analytics
  migrations/            migrações do PostgreSQL
  seed/                  importação do conteúdo migrado
  styles/                tokens de design (Tailwind) e fontes
public/assets/           acervo original organizado (logos, fontes, ícones, home, institucional, destinos, acompanhantes, pdfs) + versões WebP
migration/               fontes brutas do site antigo, dados extraídos e manifesto de mídia
tests/                   unit/, int/, e2e/
docs/                    documentação e relatórios
```

## Documentação

| Documento | Para quem |
|---|---|
| [docs/auditoria-e-inventario.md](docs/auditoria-e-inventario.md) | Inventário do site original: páginas, roteiros, cards, mídia, identidade |
| [docs/pendencias-e-inconsistencias.md](docs/pendencias-e-inconsistencias.md) | **Itens que exigem aprovação antes da publicação** |
| [docs/guia-do-administrador.md](docs/guia-do-administrador.md) | Equipe da Via Lumina |
| [docs/cadastros-e-parcerias.md](docs/cadastros-e-parcerias.md) | Landing pages de cadastro, painel, LGPD, analytics e integrações |
| [docs/publicacao.md](docs/publicacao.md) | Publicação (Docker, Node, variáveis, migrações, virada de domínio) |
| [docs/redirecionamentos.md](docs/redirecionamentos.md) | Mapa de URLs antigas → novas |
| [docs/relatorio-de-testes.md](docs/relatorio-de-testes.md) | Resultados dos testes e do Lighthouse |
| [docs/design-tokens.md](docs/design-tokens.md) | Tipografia, cores e componentes extraídos do site original |

## Decisões de projeto

- **Payload CMS em vez de Prisma + admin próprio:** o Payload roda dentro do Next.js e entrega autenticação, permissões, uploads com geração de tamanhos, duplicação, versões e painel em português — cobrindo a seção 12 do briefing sem manter um admin sob medida. Usa PostgreSQL (via Drizzle).
- **Fidelidade ao conteúdo:** textos, programações, cláusulas e fotos vêm do site original. Divergências foram registradas, não corrigidas.
- **Valores ocultos por padrão:** os preços migrados ficam no CMS, mas só aparecem após aprovação comercial (câmbios de referência de jun–ago/2026).
- **Botões do catálogo apontam para as páginas originais** na primeira etapa (§9 do briefing); a troca para a página interna é feita por roteiro, no painel.
- **Desempenho:** páginas estáticas com revalidação sob demanda ao salvar no CMS; animações de entrada em CSS com um único IntersectionObserver; Motion carregado só onde agrega (reorganização do catálogo e lightbox, este último sob demanda).
