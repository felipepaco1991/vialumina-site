# Pendências e inconsistências

Itens encontrados durante a migração que **exigem decisão ou aprovação humana**. Nada foi corrigido por suposição: o novo site mostra o conteúdo como publicado no site original, e cada roteiro afetado tem estas notas na aba **Migração → Pendências de revisão editorial** do painel.

## A. Decisões que bloqueiam ou condicionam a publicação

| # | Item | Situação atual | O que fazer |
|---|---|---|---|
| 1 | Valores dos 14 roteiros | Migrados e estruturados, mas **ocultos** ("Consulte as condições atuais"): o câmbio de referência é de jun–ago/2026 | Equipe comercial confirma valores e marca "Exibir valores" em cada roteiro (aba Valores) |
| 2 | Botões "Conheça o roteiro completo" | Apontam para as **URLs originais** (primeira etapa, §9 do briefing) | Após revisar cada página nova, mudar "Botão abre" para "Nova página interna" |
| 3 | Envio de e-mail do formulário | Mensagens são **salvas no painel**, mas sem notificação por e-mail até configurar SMTP | Definir SMTP_HOST/USER/PASS/FROM e CONTACT_RECIPIENTS |
| 4 | Política de Privacidade | Texto-base preparado na migração (o site original não tinha página própria) | Revisão jurídica do Grupo Arbo; incluir razão social/CNPJ do controlador |
| 5 | Instagram | Exibe 4 publicações reais cadastradas como reserva (sem imagens) | Gerar token da API oficial (INSTAGRAM_ACCESS_TOKEN) ou cadastrar imagens nas publicações de reserva |
| 6 | Analytics | Integração pronta (GA4 ou GTM, com consentimento), sem IDs configurados | Informar o ID em Configurações do site → Analytics (usar GA4 dentro do GTM para não duplicar) |
| 7 | Contatos comerciais por roteiro | Nadja Albuquerque (5 roteiros) e Adriana Oliveira (Rio de Janeiro e Aparecida) migrados como **não validados**; o site usa o WhatsApp institucional | Confirmar números/e-mails e marcar "Contato validado" |
| 8 | Viagens fora da lista (seção C) | Cadastradas como rascunho | Decidir inclusão, completar dados e publicar ou excluir |

## B. Inconsistências encontradas no conteúdo original

### Datas

| Roteiro | Ocorrência |
|---|---|
| `mexico-guadalupe-cancun-2028` | Dia 3 rotulado "17/jun", mas pela data de saída seria 17/03/2028. |
| `mexico-guadalupe-cancun-2028` | Os dois PDFs publicados divergem no Dia 10: "24/mar" (PDF da página) e "29/mar" (PDF da homepage). Pela data de saída, o Dia 10 seria 24/03/2028. |
| geral | PDF "Grupo México, Guadalupe e Cancún" (Padre Diogo Albuquerque e Fred Pacheco) anuncia JANEIRO 2028 (17 a 30/01/2028), mas o Dia 10 aparece como "26/abr". |

### Acompanhantes

| Roteiro | Ocorrência |
|---|---|
| `santuarios-marianos-tito` | A página do roteiro identifica o sacerdote como "Padre Tito Simão", mas o PDF linkado na homepage e a publicação do Instagram (reel DeKHs1_D6_U) usam "Pe. José Tito Lívio" — "Povoado Triunfo - Simão Dias/SE". "Simão Dias" parece ser a cidade, não o sobrenome. Mantido o nome da página até confirmação. |
| geral | O arquivo do roteiro especial Portugal, Itália e Vaticano se chama "padre-adainton_fernando", mas o PDF escreve "Padre Adailton e Fernando Vinhote". Confirmar a grafia. |

### Títulos

| Roteiro | Ocorrência |
|---|---|
| geral | O 1º card da homepage tem o título "Grupo México,Guadalupe e Cancún", mas o PDF associado (vlm_italia_portugal_padre_silas_roteiro.pdf) é do roteiro "Grupo Itália e Portugal" do Padre Silas de Oliveira, RCJ (16 a 30/10/2027, saída de São Paulo). |

### Telefones

| Roteiro | Ocorrência |
|---|---|
| `rio-de-janeiro-aparecida` | WhatsApp do contato Adriana Oliveira tem 10 dígitos ("(81) 9645-7599"); celular brasileiro deve ter 11 (DDD + 9 dígitos). |

### Contatos comerciais

| Roteiro | Ocorrência |
|---|---|
| `mexico-guadalupe-cancun-2027` | Contato comercial específico (Nadja Albuquerque) informado no card da homepage; validar antes de exibir na página do roteiro. |
| `rio-de-janeiro-aparecida` | E-mail do contato Adriana Oliveira não pôde ser recuperado (proteção de e-mail sem endereço codificado no site original). |
| `rio-de-janeiro-aparecida` | Contato comercial específico (Adriana Oliveira) informado no card da homepage; validar antes de exibir na página do roteiro. |
| `portugal-italia-vaticano` | Contato comercial específico (Nadja Albuquerque) informado no card da homepage; validar antes de exibir na página do roteiro. |
| `aparecida-agosto-2027` | Contato comercial específico (Nadja Albuquerque) informado no card da homepage; validar antes de exibir na página do roteiro. |
| `santuarios-italianos` | Contato comercial específico (Nadja Albuquerque) informado no card da homepage; validar antes de exibir na página do roteiro. |
| `aparecida-carlos-2027` | Contato comercial específico (Nadja Albuquerque) informado no card da homepage; validar antes de exibir na página do roteiro. |

### Valores

| Roteiro | Ocorrência |
|---|---|
| `portugal-italia-vaticano` | Parcelas (sem entrada informada) somam R$ 29790.04; total publicado é R$ 31.358,00 (diferença de R$ 1567.96). |
| `santuarios-marianos-brasilia` | Parcelas (sem entrada informada) somam R$ 30786.00; total publicado é R$ 32.406,36 (diferença de R$ 1620.36). |
| `santuarios-marianos-londrina` | Parcelas (sem entrada informada) somam R$ 31660.65; total publicado é R$ 32.697,00 (diferença de R$ 1036.35). |
| `aparecida-agosto-2027` | Parcelas (sem entrada informada) somam R$ 5434.00; total publicado é R$ 5.720,00 (diferença de R$ 286.00). |
| `europa-sagrada` | Parcelas (sem entrada informada) somam R$ 38836.00; total publicado é R$ 39.879,00 (diferença de R$ 1043.00). |
| `santuarios-italianos` | Parcelas (sem entrada informada) somam R$ 32170.29; total publicado é R$ 32.547,00 (diferença de R$ 376.71). |
| `aparecida-carlos-2027` | Parcelas (sem entrada informada) somam R$ 5434.00; total publicado é R$ 5.720,00 (diferença de R$ 286.00). |

### Valores desatualizados

| Roteiro | Ocorrência |
|---|---|
| `portugal-e-franca` | Câmbio de referência de 2026-08-07; valores exigem revalidação comercial. |
| `mexico-guadalupe-cancun-2027` | Câmbio de referência de 2026-07-17; valores exigem revalidação comercial. |
| `portugal-italia-vaticano` | Câmbio de referência de 2026-06-17; valores exigem revalidação comercial. |
| `santuarios-marianos-brasilia` | Câmbio de referência de 2026-06-03; valores exigem revalidação comercial. |
| `santuarios-marianos-londrina` | Câmbio de referência de 2026-06-03; valores exigem revalidação comercial. |
| `europa-sagrada` | Câmbio de referência de 2026-06-03; valores exigem revalidação comercial. |
| `santuarios-italianos` | Câmbio de referência de 2026-06-03; valores exigem revalidação comercial. |
| `santuarios-marianos-tito` | Câmbio de referência de 2026-08-13; valores exigem revalidação comercial. |
| `mexico-guadalupe-cancun-2028` | Câmbio de referência de 2026-08-13; valores exigem revalidação comercial. |
| `egito-terra-santa` | Câmbio de referência de 2026-08-13; valores exigem revalidação comercial. |

### PDFs

| Roteiro | Ocorrência |
|---|---|
| `santuarios-marianos-tito` | O card da homepage aponta para outro arquivo PDF (vlm_roteiro_santuarios_marianos_padre-tito_web.pdf) diferente do botão da página (santuarios-marianos-tito.pdf). Confirmar a versão vigente. |
| `mexico-guadalupe-cancun-2028` | O card da homepage aponta para outro arquivo PDF (roteiro_vlm_mexico_guadalupe_frei-jose-1.pdf) diferente do botão da página (mexico-guadalupe-cancun-2028.pdf). Confirmar a versão vigente. |

### Imagens

| Roteiro | Ocorrência |
|---|---|
| `portugal-e-franca` | Imagem do hero da página original não pertence ao acervo da Via Lumina (placeholder externo). Usada a 1ª foto da galeria; substituir pela imagem oficial. |
| geral | A mesma fotografia é capa de 3 roteiros: portugal-italia-vaticano, europa-sagrada, santuarios-italianos. |
| geral | A mesma fotografia é capa de 2 roteiros: aparecida-agosto-2027, aparecida-carlos-2027. |

### Textos

| Roteiro | Ocorrência |
|---|---|
| `egito-terra-santa` | O itinerário contém a grafia "SANTHE CATHARINE" (provável "Santa Catarina"). Mantida a grafia original. |
| `aparecida-agosto-2027` | Os rótulos dos dias usam a abreviação "agos" (ex.: "10/agos") em vez de "ago". Mantida a grafia original. |
| `portugal-e-franca` | As observações citam "condições gerais da Via Ilumina" (provável "Via Lumina"). Mantida a grafia original. |
| geral | Textos de cards da homepage com palavras unidas no original: "pararenovar", "pelosgrandes", "lugaresque", "Nacionalde", "espiritualidade,cultura". Corrigir na revisão editorial (o novo site usa os textos das páginas de roteiro). |
| geral | PDF "Grupo México, Guadalupe e Cancún" (Formadora Elaine Floriano): período escrito "03 a 15 de Abril e 2027" e o Dia 2 repete o texto do Dia 1. |

### Divergências

| Roteiro | Ocorrência |
|---|---|
| `santuarios-marianos-tito` | A publicação do Instagram anuncia "13 Dias de Fé e Devoção", enquanto a página publica 16 dias (13 a 28 de outubro de 2027, 13 noites). |

### Páginas

| Roteiro | Ocorrência |
|---|---|
| geral | A página /lp-roteiro-guadalupe-2026/ ("Mistérios de Guadalupe – México e Cancún", Padre Davi da Cruz, 06 a 17/11/2026) segue publicada, mas não aparece no menu nem na homepage. Inventariada como pendente; decidir se deve ser mantida. |

### Roteiros

| Roteiro | Ocorrência |
|---|---|
| geral | O card "Círio de Nazaré — Belém do Pará" está na homepage sem página, datas ou PDF; o botão aponta para #contato. |

### Identidade visual

| Roteiro | Ocorrência |
|---|---|
| geral | O kit global do Elementor ainda define cores e fontes padrão (Roboto, Roboto Slab, #6EC1E4). A identidade real usada nas seções é Playfair Display (títulos), Lato (textos) e Montserrat (rótulos), conforme o CSS das páginas. O CSS pede Playfair Display com peso 300, que não existe na família (o navegador usa 400). |

## C. Viagens publicadas na homepage original que não estão entre os 14 roteiros

| Viagem | Período | Embarque | Acompanhamento | Observação |
|---|---|---|---|---|
| Grupo Itália e Portugal | 16 a 30 de Outubro de 2027 – 12 Noites | São Paulo/Guarulhos | Padre Silas de Oliveira, RCJ (Direção espiritual) | Publicado apenas como card + PDF na homepage, com título incorreto ("Grupo México,Guadalupe e Cancún"). Sem página própria. Dados extraídos do PDF; programação a transcrever e validar. |
| Grupo México, Guadalupe e Cancún | 03 a 15 de Abril e 2027 – 10 Noites | São Paulo/Guarulhos | Elaine Floriano (Formadora) | Sem página própria. O PDF tem erro de digitação no período e o Dia 2 repete o texto do Dia 1. |
| Grupo México, Guadalupe e Cancún | 17 a 30 de Janeiro de 2028 – 11 Noites | São Paulo/Guarulhos | Padre Diogo Albuquerque (Direção espiritual); Fred Pacheco (Banda DOM) (Direção espiritual) | Sem página própria. O PDF anuncia janeiro/2028, mas o Dia 10 aparece como "26/abr". O PDF lista ambos sob "Direção Espiritual"; confirmar a função de cada pessoa. |
| Grupo Especial Portugal, Itália e Vaticano | 18 a 30 de Outubro de 2027 – 10 Noites | Curitiba | Gracielle Gonçalves (Formadora) | Sem página própria. Programação, inclusões e valores apenas no PDF. |
| Especial Portugal, Itália e Vaticano | 16 a 30 de Outubro de 2027 – 12 Noites | Curitiba | Padre Adailton (Direção espiritual); Fernando Vinhote (Direção espiritual) | Sem página própria. O nome do arquivo usa "Adainton" e o PDF usa "Adailton". O PDF lista ambos sob "Direção Espiritual"; confirmar a função de cada pessoa. |
| Círio de Nazaré | — | — | — | Card sem datas, roteiro, PDF ou página; o botão apontava para #contato. |
| Mistérios de Guadalupe – México e Cancún | 06 a 17 de Novembro de 2026 | — | Padre Davi da Cruz (Direção espiritual) | Landing page publicada, mas sem link no menu ou na homepage. A biblioteca de mídia tem PDFs "Misterios-de-Guadalupe" de maio/junho de 2026. Confirmar se a viagem segue ativa. |

## D. Arquivos

- **Arquivos não recuperados:** nenhum — todos os arquivos referenciados pelas páginas publicadas foram baixados.
- **Imagem sem origem no acervo:** o hero da página "Portugal e França" usava uma foto do Unsplash (placeholder externo). O novo site usa a 1ª foto da galeria do próprio roteiro; substituir pela imagem oficial.
- **Imagens que não são fotografias:** `institucional/seguranca.jpg` (captura de tela de cards de interface) e os ícones de valores (`icons/valor-*.png`, estilo emoji) foram preservados no acervo, mas o novo layout usa tratamento tipográfico nessas seções.
- **PDFs duplicados:** a homepage e as páginas de dois roteiros apontam para versões diferentes do mesmo PDF (ver seção B → PDFs). Ambas as versões estão em `public/assets/pdfs/`.
- **Biblioteca do WordPress:** 100 itens sem uso nas páginas publicadas foram apenas listados (ver [auditoria-e-inventario.md](auditoria-e-inventario.md)).

## E. Ajustes de acessibilidade em relação ao original

Para atingir contraste AA (WCAG), dois tons foram derivados da paleta original:

- Texto dourado sobre fundo claro usa **#8A6114** (o dourado #C9922A tem contraste 2,8:1 com branco); o dourado original segue nos elementos decorativos e sobre azul.
- Botões de WhatsApp usam **#12813C** (tom de hover do site original) em vez de #16A34A, cujo contraste com texto branco é 3,3:1.
- Cinza de textos secundários: **#5C6A7C** em vez de #6B7A8D.

## F. Cadastros e parcerias (landing pages) — itens que exigem decisão ou ação

1. **Imagens geradas por IA ainda não existem.** As ferramentas desta entrega não geram imagens; as páginas usam fotografias do acervo como substituto e já estão prontas para receber `padres-hero.webp`, `agencias-hero.webp` e `peregrinos-hero.webp` (prompts em `public/assets/cadastro/README.md`). Revisar manualmente cada imagem antes de publicar.
2. **Aviso de privacidade:** a seção 3-A da política é texto-base e deve ser revisada pelo jurídico do Grupo Arbo (inclui prazo de retenção de 24 meses e retirada de consentimento). Ao alterar o texto, atualizar `PRIVACY_NOTICE_VERSION`.
3. **Política comercial para agências:** hoje consultor independente pode se cadastrar sem CNPJ; Cadastur é opcional. Confirmar a regra (`agencyRuleErrors`).
4. **Notificações por e-mail:** dependem de `SMTP_*` e dos destinatários em Configurações do site → Cadastros. Sem isso os cadastros ficam só no painel. A confirmação ao cadastrado vem desligada.
5. **CAPTCHA:** o antispam padrão é honeypot + tempo mínimo + limite de taxa. Para tráfego pago, ativar o Turnstile (chaves no `.env`; a pública é embutida no build).
6. **Limite de taxa em memória:** correto para um único servidor; com réplicas, usar armazenamento compartilhado.
7. **Retenção:** agendar `npm run leads:purge -- --apply` no servidor (cron) — a rotina não roda sozinha.
8. **Perfil “Equipe comercial”:** criar os usuários que atenderão os cadastros; editores de conteúdo não têm acesso.
9. **Destinos “Espanha”:** não há roteiro exclusivo; a Espanha aparece nos “Santuários Marianos” (Portugal, Espanha e França). O card “Portugal, França e Espanha” e a opção “Espanha e Santuários Marianos” seguem o briefing e esse catálogo.
10. **Garantias nas páginas:** nenhuma promessa de comissão, remuneração, gratuidade ou exclusividade foi incluída. Os benefícios da página de peregrinos reutilizam os já publicados em “Quem Somos”.
