# Guia do painel administrativo

Para a equipe da Via Lumina atualizar o site sem mexer em código.

**Endereço:** `https://<domínio do site>/admin`

## Acesso

- Cada pessoa tem seu próprio usuário (e-mail e senha). Após 5 tentativas erradas, o acesso fica bloqueado por 15 minutos.
- **Editor de conteúdo:** gerencia peregrinações, acompanhantes, imagens, PDFs, Instagram e solicitações.
- **Administrador:** tudo isso, mais usuários e Configurações do site.
- Novos usuários: menu **Administração → Usuários → Criar novo** (somente administradores).

## Tela inicial: Pendências

O topo do painel mostra o que precisa de atenção:

| Quadro | Significado |
|---|---|
| Rascunhos / viagens pendentes de inclusão | Viagens que existiam no site antigo, mas ainda não foram validadas. Não aparecem no site |
| Roteiros com pendências de revisão | Divergências encontradas na migração (aba **Migração** de cada roteiro) |
| Valores ocultos | Roteiros cujos preços ainda não foram aprovados — o site mostra "Consulte as condições atuais" |
| Botões apontando para o site antigo | Roteiros cujo "Conheça o roteiro completo" ainda abre a página do WordPress |
| Solicitações novas | Mensagens do formulário ainda não atendidas |

Um aviso laranja aparece se o envio de e-mail do formulário não estiver configurado.

## Peregrinações

Menu **Peregrinações → Peregrinações**. Cada **saída** é um cadastro próprio (ex.: "Santuários Marianos" com saída de Brasília e de Londrina são dois cadastros).

### Criar uma nova saída a partir de outra

1. Abra o roteiro parecido e use **⋮ → Duplicar**.
2. A cópia nasce como **Rascunho**, sem destaque, com "(cópia)" no nome e sem URL antiga.
3. Ajuste nome, **Endereço (slug)**, datas, embarque, acompanhante, valores, PDF e fotos.
4. Revise a **Programação** dia a dia — datas e cidades mudam entre saídas.
5. Mude o **Status** para **Publicado** e salve.

### Barra lateral

| Campo | Para que serve |
|---|---|
| Endereço (slug) | Final da URL: `/destinos/<slug>`. Evite mudar depois de publicado |
| Status | **Rascunho** (não aparece) · **Publicado** · **Sob consulta** e **Esgotado** (aparecem com etiqueta) · **Encerrado** (sai do catálogo; a página continua acessível com aviso) |
| Destaque na página inicial | Roteiros marcados aparecem primeiro na homepage (4 posições, depois os de saída mais próxima) |
| Ordem | Desempate da ordenação (menor número primeiro) |
| Botão "Conheça o roteiro completo" abre | **Página original** (site antigo) ou **Nova página interna**. Mude para a página interna depois de revisá-la |

### Abas

| Aba | O que preencher |
|---|---|
| Apresentação | Linha de destinos, descrição, etiquetas do topo, aviso de vagas, **fotografia principal** e arte de divulgação |
| Datas e embarque | Datas de saída e retorno (os **dias** são calculados), noites, texto do período, **cidade de embarque** (use sempre a mesma grafia, ex.: "São Paulo/Guarulhos", para o filtro agrupar), acomodação e bagagem |
| Destinos | Regiões, países, cidades e santuários — usados nos filtros e na busca |
| Acompanhamento espiritual | Pessoas e **função exatamente como confirmada** (ex.: "Direção espiritual", "Formadora"). Textos da seção |
| Destaques e galeria | Cards de destaques e fotos da galeria com legenda |
| Programação | Um item por dia: número, rótulo da data (ex.: "05/out"), cidades e **descrição completa** (separe parágrafos com uma linha em branco). Não resuma |
| Pacote | Resumo, itens incluídos, não incluídos e **observações comerciais** (cláusulas contratuais — não remova sem aprovação) |
| Valores | Ver abaixo |
| Contato e arquivos | PDF do roteiro, mensagem do WhatsApp, contato comercial específico, textos da chamada final |
| SEO | Título e descrição para o Google (opcional; se vazio, usa nome e descrição) e imagem de compartilhamento |
| Migração | Dados de origem e **pendências de revisão**: apague cada item depois de resolvê-lo |

### Valores

1. Preencha moeda, total na moeda original, total em R$, parcelas, entrada e **câmbio de referência com a data**.
2. Em "Condições de pagamento e ressalvas", registre o texto exatamente como aprovado.
3. Só marque **Exibir valores** quando a equipe comercial aprovar. Registre a data em "Aprovado em".
4. Sem a marcação, o site mostra "Consulte as condições atuais" com botão de WhatsApp — as observações comerciais continuam visíveis.
5. O filtro de faixa de preço do catálogo só aparece quando ao menos dois roteiros tiverem valores aprovados.

### Contato específico do roteiro

Se o roteiro tiver um contato próprio (ex.: representante regional), preencha nome, WhatsApp (formato `5581999999999`) e e-mail e marque **Contato validado**. Sem validação, o site usa o WhatsApp institucional.

## Sacerdotes e acompanhantes

Menu **Peregrinações → Sacerdotes e acompanhantes**. Cadastre a pessoa uma vez (nome como publicado e foto) e vincule-a a quantos roteiros precisar. A **função** é definida em cada roteiro.

## Imagens e PDFs

- **Imagens:** use somente fotografias do acervo oficial. O **texto alternativo** é obrigatório (descreva a foto: "Vista aérea do Santuário de Fátima"). Use o **ponto focal** para escolher o centro do enquadramento nos cortes automáticos. O sistema gera versões otimizadas.
- **PDFs:** menu **Conteúdo → Documentos PDF**, depois vincule ao roteiro na aba "Contato e arquivos".

## Solicitações de contato

Menu **Atendimento → Solicitações de contato**. Cada mensagem do formulário fica registrada com nome, e-mail, WhatsApp, peregrinação de interesse e consentimento. Use **Atendimento** (Novo → Em atendimento → Concluído) e **Anotações internas** para o controle da equipe. "Envio por e-mail" indica se a notificação foi enviada.

## Cadastros e Parcerias

Padres, agências e peregrinos que se cadastram nas landing pages (`/cadastro/...`) aparecem em **Painel de Controle → “Cadastros novos”** (ou `/admin/cadastros`), em três abas. Filtre, abra o cadastro, atualize o **status do atendimento**, a **aprovação da parceria** (campo separado, só para padres e agências), o responsável e as observações, e exporte CSV. Acesso restrito a administradores e à **equipe comercial**. Guia completo, LGPD e retenção: [cadastros-e-parcerias.md](cadastros-e-parcerias.md).

## Configurações do site (administradores)

Menu **Administração → Configurações do site**:

- **Contato:** WhatsApp (somente números, com 55 e DDD), telefone, e-mail, horário, endereço e mensagem padrão do WhatsApp — atualizam cabeçalho, rodapé e página de contato.
- **Redes e links:** Instagram, Facebook, comunidade no WhatsApp, Grupo Arbo, Garupa (usados também na página `/links`).
- **Formulário:** e-mails que recebem as solicitações.
- **Analytics:** ID do Google Tag Manager **ou** do GA4. Se usar o GTM, configure o GA4 dentro dele e deixe o campo GA4 vazio para não duplicar eventos.

Eventos enviados (após consentimento do visitante): `view_trip`, `trip_card_click`, `filter_use`, `whatsapp_click`, `info_request`, `pdf_download`, `form_submit`.

## Instagram

Menu **Conteúdo → Instagram**. Com o token da API configurado no servidor, o site mostra as publicações mais recentes automaticamente. Sem token, mostra as **publicações de reserva** cadastradas aqui (link, legenda e, opcionalmente, imagem). Cadastre apenas publicações reais do perfil.

## Histórico e recuperação

Cada roteiro guarda até 30 versões (botão **Versões** no topo). É possível comparar e restaurar uma versão anterior.

## Quando as mudanças aparecem no site

Ao salvar, as páginas afetadas são atualizadas automaticamente em poucos segundos.
