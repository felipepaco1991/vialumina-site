# Adaptação para Hostinger Business — avaliação inicial

## Situação

- Versão atual: Next.js 16 + React 19 + Payload CMS 3 + PostgreSQL.
- Hospedagem atual: Hostinger Business; confirmar no hPanel que a instalação de aplicações Node.js está habilitada para a conta/domínio, versão de Node e recursos efetivos.
- O Payload desta aplicação está configurado com `@payloadcms/db-postgres`. Não é possível apontar `DATABASE_URL` para o MySQL da hospedagem e manter essa configuração.
- O painel, roteiros dinâmicos, cadastros e uploads dependem do banco e do backend; **exportar apenas HTML não preserva o funcionamento**.

## Backup do original

A pasta `site-para-vps/` nesta branch referencia o conteúdo integral da árvore original no commit `dae809079770238c8e1d0b4843b2cacc92b97584`. Não editar o conteúdo desta pasta. **Nunca publicar esta pasta em `public_html`**. Manter também o commit/tag remoto como referência de recuperação.

## Decisão aprovada: PostgreSQL externo Neon

A utilização de Neon PostgreSQL foi autorizada pelo responsável do projeto em 13/10/2026. **Ainda não há um banco provisionado, credenciais ou deploy funcional.**

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
3. Verificar disponibilidade de PostgreSQL externo gerenciado e custo; esta é a opção de menor risco técnico para reaproveitar todo o CMS.
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

### Armazenamento: opções

O [Neon Object Storage](https://neon.com/blog/neon-backend-is-ga) é S3-compatível e tem franquia gratuita de armazenamento no plano Free. Antes de adotá-lo, validar disponibilidade na região do projeto, método de criação de bucket, endpoint público/privado, credenciais e a franquia de tráfego de saída compartilhada com banco. Pode servir para **uploads novos e PDFs**, mantendo o acervo estático do site em `public/assets`.

Cloudflare R2 continua como alternativa recomendável em caso de necessidade de maior tráfego de mídia, conforme [adaptador oficial do Payload](https://payloadcms.com/docs/upload/storage-adapters). **Nunca usar `hbuilds/` ou `public_html/` para guardar uploads permanentes**, porque são sobrescritos a cada implantação na Hostinger.

### Inicialização do Payload

A Hostinger informa que os comandos npm de build são executados automaticamente, mas não podem ser executados manualmente via SSH no plano Business. Portanto, implementar estratégia de bootstrap/migração segura **antes** da implantação que não execute o seed completo em toda atualização (o seed atual atualiza todos os roteiros e sobrescreveria edições do CMS). Validar migrations versionadas, build, criação do primeiro administrador, mídia e rollback em homologação.
