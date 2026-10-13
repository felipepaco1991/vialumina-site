# Adaptação para Hostinger Business — avaliação inicial

## Situação

- Versão atual: Next.js 16 + React 19 + Payload CMS 3 + PostgreSQL.
- Hospedagem atual: Hostinger Business; confirmar no hPanel que a instalação de aplicações Node.js está habilitada para a conta/domínio, versão de Node e recursos efetivos.
- O Payload desta aplicação está configurado com `@payloadcms/db-postgres`. Não é possível apontar `DATABASE_URL` para o MySQL da hospedagem e manter essa configuração.
- O painel, roteiros dinâmicos, cadastros e uploads dependem do banco e do backend; **exportar apenas HTML não preserva o funcionamento**.

## Backup do original

A pasta `site-para-vps/` nesta branch referencia o conteúdo integral da árvore original no commit `dae809079770238c8e1d0b4843b2cacc92b97584`. Não editar o conteúdo desta pasta. **Nunca publicar esta pasta em `public_html`**. Manter também o commit/tag remoto como referência de recuperação.

## Decisão aprovada: PostgreSQL externo Neon

A utilização de Neon PostgreSQL foi autorizada pelo responsável do projeto em 13/10/2026. **Banco Neon provisionado e variáveis configuradas pelo usuário na Hostinger. Ainda não há deploy validado.**

- A aplicação já utiliza `@payloadcms/db-postgres`: manter Payload CMS e PostgreSQL, sem migrar desnecessariamente o frontend ou CMS para PHP/MySQL.
- Criar projeto privado `via-lumina` no [Neon](https://console.neon.tech/), na região **próxima à hospedagem da aplicação**. O nome do banco pode ser `vialumina`.
- Gerar string PostgreSQL com TLS (`sslmode=require`) e configurar como `DATABASE_URL` no painel de variáveis de ambiente da Hostinger; **nunca versionar ou publicar senhas, strings reais ou arquivos `.env`**.
- Para execução persistente com Node, testar conexão direta e limites do pool; para migrations preferir conexão direta. Verificar se a Hostinger aceita a versão Node.js 22.
- Definir `PAYLOAD_SECRET` (valor seguro, gerado localmente) e `NEXT_PUBLIC_SITE_URL` apontando ao **domínio provisório** de testes. Não alterar ainda o DNS.
- Aplicar migrações versionadas e seed inicialmente em ambiente de homologação; validar se Hostinger permite executar comandos de inicialização e se o build do Next acessa o banco.
- Configurar um armazenamento persistente separado para uploads do Payload (`media` e `documents`), preferencialmente S3/R2 através de plugin oficial. Os arquivos já versionados em `public/assets` continuam estáticos.
- Implementar backups de banco e arquivos, teste de recuperação, e alertas de limites/custos do plano escolhido. A gratuidade do Neon não dispensa monitoramento ou política de backups.
- Manter o site atual em produção até homologação completa.

## Decisão técnica pendente

1. Testar no hPanel a execução e publicação de Next.js com Payload CMS (memória, duração do build e rotas de API).
2. Verificar armazenamento persistente fora dos diretórios substituídos em redeploy, inclusive para uploads e banco.
3. Neon PostgreSQL gerenciado escolhido e criado no plano Free, região São Paulo.
4. Se só houver MySQL e nenhum PostgreSQL externo, comparar reimplementação de backend/CMS em PHP+MySQL **com testes de paridade**. Não substituir silenciosamente o Payload pelo MySQL: não são compatíveis.
5. SQLite com Payload pode ser avaliado apenas com armazenamento persistente verificado, backups e testes de redeploy; não armazenar DB dentro do diretório da versão publicada.
6. Revisar dados já cadastrados antes da migração; preservar hashes/sessões apenas quando suportados e garantir preservação de consentimentos e leads.
7. Manter o website antigo em produção até homologação num subdomínio.

## Funcionalidades a homologar

- Homepage e institucionais; 14 roteiros, galerias, PDF e links legados.
- Catálogo com filtros combináveis, query string e rotas /destinos/[slug].
- CMS /admin, autenticação, edição de destinos, alterações e arquivos de mídia.
- Formulários de contato, padres, agências e peregrinos, persistência, consentimento, SMTP e notificação.
- Retenção de leads, uploads, backups, SEO, sitemap e redirecionamentos.
- Testes de escrita e leitura **após novo deploy** e após restart do aplicativo.

## Entrega segura

A alteração da branch principal e a troca de DNS dependem de homologação, backups e aprovação explícita. Este documento representa avaliação, não implantação concluída.

## Configuração confirmada no hPanel (13/10/2026)

O usuário conseguiu chegar à tela da Hostinger para importar GitHub e confirmou visualmente:

- Repositório `felipepaco1991/vialumina-site`;
- Branch `hostinger-business-adaptacao`;
- Preset `Next.js`;
- Node `22.x`;
- Diretório `./`;
- Cinco variáveis de ambiente adicionadas: `DATABASE_URL`, `PAYLOAD_SECRET`, `NEXT_PUBLIC_SITE_URL`, `SEED_ADMIN_EMAIL` e `SEED_ADMIN_PASSWORD`.
- Endereço de homologação `https://brown-mandrill-580646.hostingersite.com`.
- Banco Neon PostgreSQL 18, região São Paulo, projeto `via-lumina`, banco `neondb`.

**Importante:** inclusão no formulário de variáveis não confirma que o build ou banco funcionem. Nenhuma implantação foi validada até aqui. Não reproduzir os valores secretos neste documento.

### Cloudflare R2 confirmado

- O usuário criou o bucket privado `vialumina-media` (classe Standard) e forneceu ao hPanel as variáveis `R2_BUCKET`, `R2_ENDPOINT`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY` sem compartilhá-las em chat.
- A aplicação usa `@payloadcms/storage-s3` para `media` (prefixo `media/`) e `documents` (prefixo `documents/`); o proxy de acesso do Payload permanece ativo e o bucket continua privado.
- Os arquivos versionados em `public/assets/` continuam no site. Uploads novos vão ao R2.
- É imprescindível testar upload e leitura dos dois tipos após o primeiro deployment, além da reimplantação.

### Armazenamento: opções

O [Neon Object Storage](https://neon.com/blog/neon-backend-is-ga) é S3-compatível e tem franquia gratuita de armazenamento no plano Free. Antes de adotá-lo, validar disponibilidade na região do projeto, método de criação de bucket, endpoint público/privado, credenciais e a franquia de tráfego de saída compartilhada com banco. Pode servir para **uploads novos e PDFs**, mantendo o acervo estático do site em `public/assets`.

Cloudflare R2 continua como alternativa recomendável em caso de necessidade de maior tráfego de mídia, conforme [adaptador oficial do Payload](https://payloadcms.com/docs/upload/storage-adapters). **Nunca usar `hbuilds/` ou `public_html/` para guardar uploads permanentes**, porque são sobrescritos a cada implantação na Hostinger.

### Inicialização do Payload

A Hostinger informa que os comandos npm de build são executados automaticamente, mas não podem ser executados manualmente via SSH no plano Business. Portanto, implementar estratégia de bootstrap/migração segura **antes** da implantação que não execute o seed completo em toda atualização (o seed atual atualiza todos os roteiros e sobrescreveria edições do CMS). Validar migrations versionadas, build, criação do primeiro administrador, mídia e rollback em homologação.

## Hostinger — comando de compilação

Na Hostinger, em **Configurações de compilação e saída > Alterar**, selecione o framework Next.js, Node 22, raiz `./` e mantenha o comando de build padrão que a Hostinger oferece (o seletor não permite personalização):

```bash
npm run build
```

Na branch de adaptação o script padrão aponta para `npm run build:hostinger`.

O script realiza, na ordem: migrações do Payload com conexão direta, importação inicial dos 14 roteiros + pendentes se ainda estiverem ausentes, e `next build`.

O fluxo **não está homologado na Hostinger**. Se houver limite de tempo, memória ou indisponibilidade no processo de seed (imagens), suspender a tentativa e separar a importação do build antes de prosseguir.

### Variável adicional obrigatória

No Neon: `Connect` -> `Connection pooling` **desativado** -> copie a connection string completa. No hPanel, adicione:

- `DATABASE_URL_UNPOOLED`: string direta Neon (sem `-pooler`) para migrations.

Preserve `DATABASE_URL` (string com pooling) para o tráfego comum da aplicação. A senha do banco deve permanecer somente nas variáveis privadas da Hostinger. Use a mesma base e o mesmo usuário Neon nas duas URLs.

O script de build exige a variável direta: não reutilize a URL pooled ou altere as URLs manualmente com substituições de texto, pois isso pode mascarar configurações incorretas.

### Segredos e controles pós-primeiro deploy

- O código-fonte está em um repositório **público**: nunca adicionar valores secretos em commits, PRs, capturas de tela, documentação ou GitHub Actions.
- As variáveis `SEED_ADMIN_EMAIL` e `SEED_ADMIN_PASSWORD` são usadas somente se o seed inicial ainda precisa importar roteiros. Depois da primeira criação bem-sucedida, retirar `SEED_ADMIN_PASSWORD` do hPanel, sem apagar o administrador que foi cadastrado.
- O seed só é executado novamente se faltarem registros de roteiros da migração. Se houver importação parcial, uma nova tentativa pode atualizar os itens da migração; não editar conteúdo até validar a carga inicial.
- Depois da publicação de homologação, testar login no Payload, 14 destinos, galeria, PDF, formulários e novos uploads via R2, sem alterar o DNS principal.
- O bucket permanece privado, com acesso de escrita restrito à credencial configurada.
- Gerir limites de memória, processamento e tráfego no painel da Hostinger e definir alertas de custo Neon/R2.

## Validação automatizada (13/10/2026)

- GitHub Actions: <https://github.com/felipepaco1991/vialumina-site/actions/runs/38437596518> — **aprovada**.
- Verificações de TypeScript e lint: aprovadas.
- Instalação de dependências em modo de produção: aprovada, incluindo Next.js, Tailwind e TypeScript.
- Aplicação das migrações em PostgreSQL 17 isolado: aprovada.
- Build Next.js 16 com banco vazio migrado e adapter R2 habilitado (credenciais de teste sem bucket real): aprovado.
- **Não coberto por este teste:** conexão real ao Neon, importação de 14 roteiros e mídia para o R2, autenticação do admin, formulários, desempenho na Hostinger e retenção de uploads após redeploy.


## Confirmação do comando fixo (13/10/2026)

- A Hostinger Business exibiu seletor **sem entrada de comando personalizado**. Por isso o `package.json` da branch de adaptação usa `"build": "npm run build:hostinger"`.
- GitHub Actions <https://github.com/felipepaco1991/vialumina-site/actions/runs/38447305427>: **aprovado** com o comando exato `npm run build`, migrações e compilação com PostgreSQL descartável.
- Na execução do CI, a importação de conteúdo foi **propositadamente ignorada** por não haver bucket R2 real nem credenciais: ainda é obrigatório testar a primeira carga em homologação na Hostinger, sem mudar o DNS da produção.
- Importação parcial: o guard em `src/seed/if-empty.ts` interrompe o processo para não sobrescrever roteiros já existentes. Corrigir inconsistências e só então publicar novamente.
- Na Hostinger, mantenha gerenciador `npm`, diretório de saída `.next`, preset Next.js, Node 22.x, branch `hostinger-business-adaptacao` e raiz `./`.

## Compatibilidade Next.js 16 com glibc da Hostinger (13/10/2026)

Uma tentativa de deploy falhou depois da etapa de migração e seed com:
`GLIBC_2.29 not found` ao carregar `@next/swc-linux-x64-gnu`, seguido de erro ao compilar `next.config.ts`. O sistema da Hostinger não fornece as interfaces de glibc exigidas pelo binding nativo do SWC.

Solução implementada nesta branch:
- `next.config.ts` convertido em `next.config.mjs`, sem carregamento de módulo TypeScript nesse estágio.
- Redirecionamentos WordPress partilhados em `src/lib/legacy-redirects.json` com tipos mantidos em `legacy-redirects.ts`.
- Script `scripts/hostinger-build.mjs` usa `next build --webpack` (evita Turbopack, que exige binding SWC nativo).
- Hostinger mantém `npm run build`, Node.js 22 e saída `.next`.
- Compilação isolada e consultas R2 no CI aprovadas: <https://github.com/felipepaco1991/vialumina-site/actions/runs/38452222500>.

**Pendente**: retestar a implantação no ambiente Hostinger com glibc antigo. O GitHub Actions usa Linux mais recente, portanto sucesso no CI não demonstra compatibilidade do runtime real. Após deploy confirmar inicialização Node, SSR, otimização de imagens e uploads Cloudflare R2. Não mudar DNS oficial antes de homologação.

O log também apresentou `No email adapter provided`, logo as notificações por e-mail não estão configuradas; configurar SMTP ou adaptador de e-mail antes de usar formulários publicamente. O npm relatou vulnerabilidades em dependências; auditar e corrigir de modo controlado, sem `npm audit fix --force` cego.
