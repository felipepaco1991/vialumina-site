# Relatório de testes

Execução em 08/10/2026, sobre o **build de produção** (`npm run build && npm run start`) com o banco populado pelo seed.

| Suíte | Ferramenta | Resultado |
|---|---|---|
| Unidade (filtros, busca, formatação, WhatsApp, formulário, integridade da migração) | Vitest | **79/79** |
| Integração com o CMS (PostgreSQL + Payload) | Vitest | **6/6** |
| Ponta a ponta — desktop (Chrome 1280 px) | Playwright | **32/32** |
| Ponta a ponta — celular (Pixel 7) e larguras 360–1440 px | Playwright | **9/9** |
| Lint (ESLint + regras do Next/React) e tipos (TypeScript) | ESLint, `tsc` | sem erros |

Comandos: `npm run test:int` e `E2E_BASE_URL=http://localhost:3000 npm run test:e2e`.

## O que é verificado

### Conteúdo e migração
- Os 14 roteiros existem, com slugs únicos, e **conferem com a tabela do briefing** (datas, cidade de embarque, acompanhante e URL original).
- A função de cada acompanhante é preservada (ex.: Adriana — Formadora; Dinéia — Formação e acompanhamento).
- Cada roteiro tem a **programação dia a dia completa** (quantidade de dias = período oficial), itens incluídos, não incluídos e observações.
- Todos os arquivos referenciados existem localmente; o manifesto não tem falhas e cada arquivo confere com o hash SHA-256 registrado; não há duplicatas binárias.
- No CMS: 14 publicados, 7 viagens pendentes em rascunho, valores migrados ocultos até aprovação.

### Segurança e permissões
- A API pública não expõe rascunhos.
- Solicitações de contato e usuários não podem ser lidos nem criados sem login.
- Rotas do painel redirecionam para o login.

### Navegação e SEO
- Cada página institucional é independente, com título, H1 único, descrição e canonical próprios; o menu leva a páginas (não a âncoras) e indica a página ativa.
- Página inexistente retorna 404 com caminhos de volta.
- URLs antigas redirecionam permanentemente para as novas (com e sem barra final).
- `sitemap.xml` lista as páginas e os roteiros publicados (sem rascunhos); `robots.txt` bloqueia `/admin` e `/api/`.
- Dados estruturados `TravelAgency`, `BreadcrumbList`, `ItemList` e `TouristTrip`.

### Catálogo
- Lista os 14 roteiros; busca ignora acentos e maiúsculas e busca por roteiro, país, cidade, santuário e acompanhante.
- Filtros combinados (região + embarque), mesmo filtro com vários valores (OU), mês/ano, duração calculada pelas datas e acompanhante.
- Contador, chips de filtros ativos, remoção individual, "Limpar filtros" e estado vazio com ações.
- Estado preservado na URL (busca compartilhável) e restaurado ao abrir o link.
- Ordenação por data, relevância e duração; filtros operáveis pelo teclado.
- Celular: painel de filtros com "Ver N peregrinações" (aplicar) e "Limpar".

### Links
- Os 14 botões "Conheça o roteiro completo" apontam cada um para o **seu** roteiro (URL original na primeira etapa), com nome acessível contendo o título.
- Nenhum `href` vazio ou `#` nas páginas públicas; todos os links internos respondem 200.
- As 14 páginas internas existem e cada PDF abre (`application/pdf`).
- WhatsApp usa o número oficial e mensagem pré-preenchida com o nome do roteiro.

### Página do roteiro
- Resumo (período, embarque, acompanhantes e funções), programação com 16 dias no Egito e Terra Santa.
- Expandir/recolher todos e expansão individual de cada dia.
- Galeria em lightbox com navegação por teclado (setas, Esc).
- Sem aprovação, valores exibem "Consulte as condições atuais" e as observações contratuais continuam visíveis.
- Itens incluídos (15) e não incluídos (11) de "Portugal e França" transferidos integralmente.

### Formulário de contato
- Mensagens de validação nos campos obrigatórios e no consentimento.
- Envio real: a solicitação é gravada no CMS com peregrinação de interesse, consentimento e status de envio por e-mail (o teste remove o registro ao final).

### Responsividade e acessibilidade
- Sem rolagem horizontal em **360, 390, 430, 768, 1024 e 1440 px** nas páginas principais.
- Menu mobile abre, navega e fecha; botões principais com área de toque ≥ 44 px.
- Revisão visual por capturas em todas as larguras acima (`scripts/qa/screenshot.mjs`).

## Lighthouse

Lighthouse 12 (configuração padrão: mobile com limitação simulada de CPU e rede; desktop com o preset `desktop`).

| Página | Dispositivo | Performance | Acessibilidade | Boas práticas | SEO | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|---|
| `/` | mobile | 92 | 100 | 100 | 100 | 3,2 s | 0 | 140 ms |
| `/` | desktop | 99 | 100 | 100 | 100 | 0,8 s | 0 | 0 ms |
| `/destinos` | mobile | 82 | 100 | 100 | 100 | 4,4 s | 0 | 200 ms |
| `/destinos` | desktop | 99 | 100 | 100 | 100 | 0,9 s | 0 | 10 ms |
| `/destinos/egito-terra-santa` | mobile | 86 | 100 | 100 | 100 | 4,0 s | 0 | 130 ms |
| `/destinos/egito-terra-santa` | desktop | 99 | 100 | 100 | 100 | 0,9 s | 0 | 0 ms |
| `/destinos/portugal-e-franca` | mobile | 86 | 100 | 100 | 100 | 4,0 s | 0 | 140 ms |
| `/destinos/portugal-e-franca` | desktop | 99 | 100 | 100 | 100 | 0,9 s | 0 | 0 ms |
| `/quem-somos` | mobile | 93 | 100 | 100 | 100 | 3,2 s | 0 | 80 ms |
| `/quem-somos` | desktop | 99 | 100 | 100 | 100 | 0,9 s | 0 | 0 ms |
| `/nossa-historia` | mobile | 88 | 100 | 100 | 100 | 3,9 s | 0 | 80 ms |
| `/nossa-historia` | desktop | 100 | 100 | 100 | 100 | 0,8 s | 0 | 0 ms |
| `/contato` | mobile | 86 | 100 | 100 | 100 | 4,0 s | 0 | 120 ms |
| `/contato` | desktop | 100 | 100 | 100 | 100 | 0,8 s | 0 | 0 ms |

**Metas do briefing:** Acessibilidade ≥ 95, Boas práticas ≥ 95 e SEO ≥ 95 atingidas em todas as páginas (100). Performance ≥ 90 atingida em todas as páginas no desktop e na home e em Quem Somos no celular; as demais ficam entre 82 e 88 no celular.

O limite no celular é o tempo de processamento de JavaScript do React/Next.js na CPU simulada (TBT 80–200 ms, CLS 0). Já aplicado: páginas estáticas, pré-carregamento só da imagem de LCP, três arquivos de fonte pré-carregados, animações de entrada em CSS (sem JavaScript por elemento), Motion apenas no catálogo e no lightbox (este baixado só ao abrir uma foto). As medições foram feitas em `localhost`; em produção, com HTTP/2, compressão e CDN, os tempos de rede tendem a ser menores. Reavalie em produção com `scripts/qa/lighthouse.sh https://<domínio>`.

## Outras validações

- **Implantação do zero:** migração (`npm run migrate`) + seed em banco vazio geraram 21 roteiros, 79 imagens, 19 PDFs e 23 acompanhantes.
- **Docker:** imagem construída e iniciada com banco novo (migração → build → servidor respondendo 200), seed executado dentro do contêiner e página de roteiro renderizada.
- **Duplicação no painel:** a cópia de um roteiro nasce como rascunho, com "(cópia)" no nome, slug próprio e sem URL antiga.

## Não coberto por testes automatizados

- Envio real de e-mail (depende de SMTP configurado — o caminho de falha e o de "não configurado" são registrados no CMS).
- Feed do Instagram pela API oficial (depende de token); o conteúdo de reserva é testado.
- Carregamento do mapa do Google (externo, só após clique).
- Navegadores Safari e Firefox (os testes usam Chrome); recomenda-se uma verificação manual em iPhone antes da virada.
