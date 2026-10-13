# Cadastros e Parcerias — landing pages, dados e administração

Extensão do site com três landing pages de captação, formulários reais (com persistência), painel interno e conformidade com a LGPD.

| Página | URL | Público | Formulário |
|---|---|---|---|
| Seja um Padre Parceiro | `/cadastro/padres` | Sacerdotes | 3 etapas |
| Seja uma Agência Parceira | `/cadastro/agencias` | Agências, operadoras, consultores | 3 etapas |
| Faça Parte da Via Lumina | `/cadastro/peregrinos` | Peregrinos | Curto, 1 etapa |
| Hub (porta de entrada) | `/cadastro` | Quem não sabe qual escolher | — |
| Retirada de consentimento | `/cadastro/comunicacoes/[token]` | Titular do cadastro (link único) | Botão de confirmação |

Acesso pelo site: menu **Parcerias** (Para Padres / Para Agências) e **Cadastre-se** (peregrinos); rodapé (coluna “Cadastre-se”); convite na homepage (“Receba novidades das próximas peregrinações”) e em **Quem Somos** (parcerias). Os links trazem `?origem=menu|rodape|home|institucional|hub`, gravado no cadastro.

## 1. Arquitetura

```text
src/content/cadastro.ts            textos das 3 páginas (conforme o briefing)
src/content/cadastro-images.ts     imagens de destaque (IA + fallback do acervo)
src/components/cadastro/           hero, seções, FAQ, motion (Motion), formulários (form/)
src/app/(frontend)/cadastro/       páginas, layout (provedor de animações), Server Actions
src/lib/leads/                     constantes, esquemas Zod, máscaras, envio, e-mail, webhook, CSV, UTM, LGPD
src/collections/Leads.ts           entidade central
src/collections/LeadProfiles.ts    perfis: PriestProfiles, AgencyProfiles, PilgrimProfiles
src/components/admin/              visão "Cadastros e Parcerias", resumo do perfil, atalho
scripts/leads/purge.ts             rotina de retenção
```

### Dados

- **`leads`** (central): tipo (`PADRE`/`AGENCIA`/`PEREGRINO`), nome/responsável, e-mail, WhatsApp (`55`+DDD+número), cidade, estado, destinos, origem (`lp-padres|lp-agencias|lp-peregrinos|manual`), ponto de entrada, página, UTMs, consentimentos (finalidade, concedido, data, **versão do aviso**, retirada), `marketingConsent`, `retainUntil`, status de atendimento, aprovação de parceria, responsável, observações internas, indicador e referência de duplicidade, situação dos e-mails. `createdAt`/`updatedAt` do Payload cobrem data de cadastro e última atualização.
- **`priest-profiles`**, **`agency-profiles`**, **`pilgrim-profiles`**: dados específicos de cada formulário, ligados ao lead (`lead`) e gravados juntos numa **transação** (se um falhar, nada é salvo). Excluir um lead exclui o perfil.
- Os dados enviados pelo formulário são **imutáveis** pela API/painel (acesso de atualização negado nos campos); a equipe altera apenas a gestão do atendimento (status, parceria, responsável, observações, retenção, retirada de consentimento) e a verificação de CNPJ/Cadastur.

### Status

- **Atendimento:** Novo cadastro → Em análise → Contato iniciado → Em negociação → Convertido → Encerrado.
- **Aprovação de parceria** (campo separado, só padres e agências): Pendente de análise (padrão) → Em avaliação → Parceria aprovada / Não aprovada. **Nenhum cadastro nasce aprovado.**
- **CNPJ e Cadastur** guardam “verificação” própria (Não verificado / Verificado / Divergente): o formulário só confere os dígitos do CNPJ; a conferência cadastral é manual.
- Consultor independente pode se cadastrar sem CNPJ (regra em `agencyRuleErrors`, `src/lib/leads/schemas.ts`; ajuste se a política comercial mudar).

## 2. Painel administrativo

Entrada: card **“Cadastros novos”** no Painel de Controle (`/admin`) ou diretamente `/admin/cadastros`.

- **Abas:** Padres, Agências, Peregrinos (contagem total e de novos).
- **Busca** por nome, e-mail e cidade; filtros por estado, status, aprovação da parceria, **destino de interesse**, **período de cadastro**, somente novos, possíveis duplicidades.
- **Tabela** com origem/campanha, status, parceria, responsável e data; linha de novo cadastro destacada.
- **Detalhe:** clicar no nome abre a edição do cadastro (dados do formulário em leitura, consentimentos, origem/UTM, notificações). Ali se atualiza status, parceria, responsável e observações.
- **Exportar CSV:** do filtro atual, ou **somente quem aceitou comunicações promocionais** (use este para listas de marketing). Células que começam com `= + - @` são neutralizadas contra injeção de fórmulas. A exportação é registrada no log (usuário e quantidade, sem dados pessoais).
- **Duplicidade:** mesmo perfil + mesmo e-mail **ou** WhatsApp. Um reenvio idêntico em até 10 minutos (duplo clique) não cria registro; depois disso cria o novo cadastro marcado como “Possível duplicidade”, apontando para o primeiro. Após conferir, desmarque o indicador.
- A lista nativa (“Cadastros” no menu do Payload) continua disponível para uso avançado.

### Perfis de acesso

| Perfil | Cadastros |
|---|---|
| Administrador | Tudo, inclusive excluir |
| **Equipe comercial** (novo) | Ver, atualizar gestão, exportar. Não exclui |
| Editor de conteúdo | **Sem acesso** (dados pessoais) |
| Público/anônimo | Sem acesso; só envia pelos formulários (Server Actions) |

Crie usuários em *Administração → Usuários* e marque “Equipe comercial (cadastros)”.

## 3. Notificações e integrações

Após gravar: (1) aviso interno por e-mail, conforme o público (ver tabela abaixo); (2) confirmação ao cadastrado **somente** se a opção “Enviar e-mail de confirmação” estiver ligada (padrão: desligada); (3) evento para integrações. **Sem `SMTP_HOST` e destinatários não há envio**: o cadastro fica salvo e a situação aparece no registro (“Pendente”).

**Quem recebe cada aviso** (definido em `src/lib/leads/routing.server.ts`; muda com um deploy):

| Público | Para | Em cópia (CC) | WhatsApp dos botões da página |
|---|---|---|---|
| Padres | williton.santos@vialuminaviagens.com.br | fabiola.almeida@vialuminaviagens.com.br | +55 11 91799-2727 |
| Agências | williton.santos@vialuminaviagens.com.br | fabiola.almeida@vialuminaviagens.com.br | +55 11 91799-2727 |
| Peregrinos (cliente final) | fabiola.almeida@vialuminaviagens.com.br | — | +55 11 99252-6053 (WhatsApp do site) |

Para trocar os destinatários de um público sem deploy, preencha **Configurações do site → Cadastros → Substituir destinatários**; nesse caso só os e-mails informados recebem (sem cópia). O contato do formulário geral (`/contato`) segue `CONTACT_RECIPIENTS`.

Integrações futuras (CRM, e-mail marketing, automação): `src/lib/leads/integrations.server.ts`. Hoje há um adaptador de **webhook** (`LEAD_WEBHOOK_URL` + `LEAD_WEBHOOK_SECRET`; corpo JSON `lead.created`, assinatura `X-ViaLumina-Signature: sha256=<hmac>`). Outros destinos entram como novos adaptadores. O evento leva `marketingConsent`: respeite-o no destino.

## 4. LGPD e segurança

- **Finalidade clara** acima do botão de cada formulário; link para a Política de Privacidade (seção 3-A nova).
- **Dois consentimentos separados:** (a) obrigatório, para tratar o cadastro e entrar em contato; (b) **opcional**, para comunicações promocionais — desmarcado por padrão e nunca condiciona o envio.
- **Registro** de cada consentimento: finalidade, data/hora, **versão do aviso** (`PRIVACY_NOTICE_VERSION`, em `src/lib/leads/constants.ts` — altere junto com o texto da política).
- **Retirada:** link único (`/cadastro/comunicacoes/<token>`) incluído no e-mail de confirmação quando há consentimento promocional; a retirada é gravada com data. A equipe também pode registrar a retirada no cadastro (campo “Retirado em”). O token nunca é exposto pela API.
- **Retenção:** configurável em Configurações do site → Cadastros (padrão 24 meses). Cada registro mostra “Reter até” (editável). Rotina: `npm run leads:purge` (simulação) e `npm run leads:purge -- --apply` (exclui cadastro + perfil). Agende no cron do servidor.
- **Minimização:** sem CPF, sem dados financeiros, sem dados religiosos pessoais além do que o próprio perfil exige (diocese/paróquia/função do padre).
- **Antispam:** campo-isca (honeypot), tempo mínimo de preenchimento (3 s), limite de taxa por IP (6/10 min) e por e-mail (4/h), e **Cloudflare Turnstile opcional** (defina `NEXT_PUBLIC_TURNSTILE_SITE_KEY` e `TURNSTILE_SECRET_KEY`; a chave pública é embutida no build). O limitador é em memória por instância; com vários servidores, mova-o para Redis (`src/lib/leads/rate-limit.ts`).
- **Validação** no navegador e no servidor com o mesmo esquema Zod; no servidor também se saneiam UTMs (lista de chaves e caracteres), URLs e Instagram. Consultas usam o Payload/Drizzle (parametrizadas): sem SQL injection. Server Actions do Next.js validam a origem (proteção CSRF). Erros não expõem detalhes internos; logs registram só identificador e tipo, nunca dados pessoais.
- **Acesso por função** (tabela acima); exportação exige sessão autenticada.
- Em produção use HTTPS (HSTS já configurado quando `NEXT_PUBLIC_SITE_URL` é https) e defina `PAYLOAD_SECRET` forte.

## 5. Analytics

Eventos enviados ao `dataLayer` (GTM) / GA4 — **só carregam com o aceite de cookies**; antes disso ficam em memória:

| Evento | Quando |
|---|---|
| `view_lp_padres`, `view_lp_agencias`, `view_lp_peregrinos` | Abertura da página |
| `start_form_padres/agencias/peregrinos` | Primeira interação com o formulário (1× por visita) |
| `submit_form_padres/agencias/peregrinos` | **Somente após o servidor confirmar** que gravou o cadastro |
| `form_error` | Erro de validação ou do servidor (`form`, `reason`, `fields`, `step`; sem valores digitados) |
| `click_whatsapp` | Botões de WhatsApp das landing pages e da confirmação |
| `click_destinos` | Links para `/destinos` (cards, chamada final, confirmação) |

UTMs (`utm_source|medium|campaign|term|content`) são lidas da URL, filtradas, guardadas na sessão (primeiro contato) e gravadas no cadastro. `?origem=` registra o ponto de entrada.

**Validação:** no navegador, `window.dataLayer` mostra os eventos (os testes automatizados conferem a ordem: `start` → `form_error` → `submit` só após o sucesso).

## 6. Imagens

Veja `public/assets/cadastro/README.md` (prompts e regras). Sem os arquivos de IA, as páginas usam fotografias do acervo (Fátima, Vaticano, Basílica de São Pedro). Os cards de destinos usam apenas fotos do acervo.

## 7. Operação e testes

```bash
npm run migrate          # produção: aplica a migração 20261009_165422_cadastros
npm run test:int         # unidade + integração (usa o banco)
npm run test:e2e         # inclui tests/e2e/cadastros*.e2e.spec.ts
npm run leads:purge      # simulação da retenção
```

Cobertura: máscaras/CNPJ/esquemas/UTM/CSV (unidade); persistência, consentimentos, duplicidade, antispam, limite de taxa, retirada de consentimento, acesso por função, exportação e exclusão em cascata (integração); fluxos completos dos três formulários, painel, exportação, menu/rodapé e celular (e2e). Os testes criam cadastros com e-mails `@e2e-cadastros.example.com`/`@leads-test.example.com` e os removem ao final.
