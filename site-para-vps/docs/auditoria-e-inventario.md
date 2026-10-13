# Auditoria e inventário do site original

Fonte: https://vialuminaviagens.com.br/ (WordPress + Elementor), consultado em 08/10/2026.
Arquivos brutos preservados em `migration/source/` (HTML de cada página, CSS do Elementor e respostas da API pública `wp-json`).

## 1. Páginas publicadas

| ID WP | Página | URL original | Situação na migração |
|---|---|---|---|
| 1180 | Egito e  Terra Santa | https://vialuminaviagens.com.br/egito-e-terra-santa/ | Roteiro 14 → `/destinos/egito-terra-santa` (redirecionamento 308) |
| 1175 | México,  Guadalupe e Cancún | https://vialuminaviagens.com.br/mexico-guadalupe-e-cancun/ | Roteiro 13 → `/destinos/mexico-guadalupe-cancun-2028` (redirecionamento 308) |
| 1170 | Santuários  Marianos-tito | https://vialuminaviagens.com.br/santuarios-marianos-tito/ | Roteiro 12 → `/destinos/santuarios-marianos-tito` (redirecionamento 308) |
| 1103 | Aparecida do Norte – carlos | https://vialuminaviagens.com.br/aparecida-do-norte-carlos/ | Roteiro 11 → `/destinos/aparecida-carlos-2027` (redirecionamento 308) |
| 1098 | Santuários Italianos | https://vialuminaviagens.com.br/santuarios-italianos-2/ | Roteiro 10 → `/destinos/santuarios-italianos` (redirecionamento 308) |
| 1093 | Europa Sagrada | https://vialuminaviagens.com.br/europa-sagrada/ | Roteiro 9 → `/destinos/europa-sagrada` (redirecionamento 308) |
| 1071 | Aparecida do Norte | https://vialuminaviagens.com.br/elementor-pagina-1071/ | Roteiro 8 → `/destinos/aparecida-agosto-2027` (redirecionamento 308) |
| 1065 | Santuários Marianos 2 | https://vialuminaviagens.com.br/santuarios-marianos-2/ | Roteiro 7 → `/destinos/santuarios-marianos-londrina` (redirecionamento 308) |
| 1057 | Santuários Marianos | https://vialuminaviagens.com.br/santuarios-marianos/ | Roteiro 6 → `/destinos/santuarios-marianos-brasilia` (redirecionamento 308) |
| 1013 | Portugal, Itália  e Vaticano | https://vialuminaviagens.com.br/portugal-italia-e-vaticano/ | Roteiro 5 → `/destinos/portugal-italia-vaticano` (redirecionamento 308) |
| 970 | Rio de Janeiro  e Aparecida | https://vialuminaviagens.com.br/rio-de-janeiro-e-aparecida/ | Roteiro 4 → `/destinos/rio-de-janeiro-aparecida` (redirecionamento 308) |
| 962 | México,Guadalupe  e Cancún | https://vialuminaviagens.com.br/mexicoguadalupe-e-cancun/ | Roteiro 3 → `/destinos/mexico-guadalupe-cancun-2027` (redirecionamento 308) |
| 942 | São Paulo, Aparecida e Canção Nova | https://vialuminaviagens.com.br/elementor-pagina-942/ | Roteiro 2 → `/destinos/sao-paulo-aparecida-cancao-nova` (redirecionamento 308) |
| 899 | Portugal e Franca | https://vialuminaviagens.com.br/elementor-pagina-899/ | Roteiro 1 → `/destinos/portugal-e-franca` (redirecionamento 308) |
| 590 | Via Lumina Viagens | https://vialuminaviagens.com.br/ | Homepage → reconstruída em `/` (seções institucionais viraram páginas próprias) |
| 565 | Links | https://vialuminaviagens.com.br/links/ | Página de links da bio do Instagram → preservada em `/links` |
| 80 | Roteiro Via Lumina | https://vialuminaviagens.com.br/lp-roteiro-guadalupe-2026/ | Landing page fora do menu → inventariada como pendente; redireciona para `/destinos` |
| 16 | page_backup | https://vialuminaviagens.com.br/page-backup/ | Cópia antiga da homepage (backup) → não migrada; redireciona para `/` |
| 2 | Sample Page | https://vialuminaviagens.com.br/sample-page/ | Página de exemplo do WordPress → não migrada; redireciona para `/` |

## 2. Roteiros (14 do briefing)

| # | Roteiro | Período | Dias/noites | Embarque | Acompanhamento | Galeria | Dia a dia | PDF |
|---|---|---|---|---|---|---|---|---|
| 1 | [Portugal e França](https://vialuminaviagens.com.br/elementor-pagina-899/) | 05/10/2027 a 16/10/2027 | 12/9 | Brasília | Padre Donizete (Direção espiritual) | 3 fotos | 12 dias | sim |
| 2 | [São Paulo, Aparecida e Canção Nova](https://vialuminaviagens.com.br/elementor-pagina-942/) | 11/07/2027 a 17/07/2027 | 7/6 | Recife | Padre Moisés Coelho (Direção espiritual) | 3 fotos | 7 dias | sim |
| 3 | [México, Guadalupe e Cancún](https://vialuminaviagens.com.br/mexicoguadalupe-e-cancun/) | 10/04/2027 a 23/04/2027 | 14/11 | São Paulo/Guarulhos | Padre Fábio Fernandes (Direção espiritual) | 5 fotos | 14 dias | sim |
| 4 | [Rio de Janeiro e Aparecida](https://vialuminaviagens.com.br/rio-de-janeiro-e-aparecida/) | 16/06/2027 a 22/06/2027 | 7/6 | Recife | Adriana (Formadora) | 3 fotos | 7 dias | sim |
| 5 | [Portugal, Itália e Vaticano](https://vialuminaviagens.com.br/portugal-italia-e-vaticano/) | 21/09/2027 a 02/10/2027 | 12/10 | Fortaleza | Padre Assis Jordão (Direção espiritual) | 3 fotos | 12 dias | sim |
| 6 | [Santuários Marianos](https://vialuminaviagens.com.br/santuarios-marianos/) | 05/10/2027 a 17/10/2027 | 13/10 | Brasília | Padre João Carlos (Direção espiritual) | 3 fotos | 13 dias | sim |
| 7 | [Santuários Marianos](https://vialuminaviagens.com.br/santuarios-marianos-2/) | 15/10/2027 a 27/10/2027 | 13/10 | Londrina | Padre Paulo Sérgio (Direção espiritual) | 5 fotos | 13 dias | sim |
| 8 | [Aparecida do Norte](https://vialuminaviagens.com.br/elementor-pagina-1071/) | 10/08/2027 a 16/08/2027 | 7/6 | Recife | Padre Marcelo Silva (Direção espiritual) | 3 fotos | 7 dias | sim |
| 9 | [Europa Sagrada](https://vialuminaviagens.com.br/europa-sagrada/) | 15/09/2027 a 01/10/2027 | 17/14 | Brasília | Padre Marcos Fernando (Direção espiritual) | 6 fotos | 17 dias | sim |
| 10 | [Santuários Italianos](https://vialuminaviagens.com.br/santuarios-italianos-2/) | 08/11/2027 a 19/11/2027 | 12/10 | Recife | Padre Thiago Bispo (Direção espiritual) | 3 fotos | 12 dias | sim |
| 11 | [Aparecida do Norte](https://vialuminaviagens.com.br/aparecida-do-norte-carlos/) | 13/05/2027 a 19/05/2027 | 7/6 | Recife | Padre Carlos Eduardo (Direção espiritual) | 3 fotos | 7 dias | sim |
| 12 | [Santuários Marianos](https://vialuminaviagens.com.br/santuarios-marianos-tito/) | 13/10/2027 a 28/10/2027 | 16/13 | Aracaju | Padre Tito Simão (Direção espiritual) | 3 fotos | 16 dias | sim |
| 13 | [México, Guadalupe e Cancún](https://vialuminaviagens.com.br/mexico-guadalupe-e-cancun/) | 15/03/2028 a 27/03/2028 | 13/10 | Recife | Frei José Adriano, O.Carm. (Direção espiritual) | 3 fotos | 13 dias | sim |
| 14 | [Egito e Terra Santa](https://vialuminaviagens.com.br/egito-e-terra-santa/) | 10/01/2028 a 25/01/2028 | 16/13 | São Paulo/Guarulhos | Padre Paulo Júnior (Direção espiritual); Dinéia (Formação e acompanhamento) | 2 fotos | 16 dias | sim |

Conteúdo extraído integralmente de cada página: etiquetas do hero, descrição, ficha (período, acomodação, embarque, bagagem), direção espiritual, destaques, galeria com legendas, programação dia a dia, itens incluídos e não incluídos, observações comerciais, valores e condições, chamada final e PDF. Dados completos em `migration/data/trips.json`.

## 3. Cards da homepage (inventário completo)

A homepage original exibia 20 cards em "Nossas Peregrinações". Todos os botões "Conheça o roteiro completo" apontavam para **PDFs**, não para as páginas dos roteiros.

| # | Título no card | Destino do botão | Situação |
|---|---|---|---|
| 1 | Grupo México,Guadalupe e Cancún | `vlm_italia_portugal_padre_silas_roteiro.pdf` | **Pendente** — Grupo Itália e Portugal |
| 2 | Grupo México,Guadalupe e Cancún | `vlm_roteiro_guadalupe_Formadora-Elaine.pdf` | **Pendente** — Grupo México, Guadalupe e Cancún |
| 3 | Grupo México,Guadalupe e Cancún | `vlm_roteiro_guadalupe_padre-diogo_fred-pacheco_V2.pdf` | **Pendente** — Grupo México, Guadalupe e Cancún |
| 4 | Portugal, Itália e Vaticano | `vlm_roteiro_portugal_italia_vaticano_gracielle.pdf` | **Pendente** — Grupo Especial Portugal, Itália e Vaticano |
| 5 | Especial Portugal, Itália e Vaticano | `vlm_roteiro_portugal_italia_vaticano_padre-adainton_fernando.pdf` | **Pendente** — Especial Portugal, Itália e Vaticano |
| 6 | Santuários Marianos | `vlm_roteiro_santuarios_marianos_padre-tito_web.pdf` | Roteiro 12 (santuarios-marianos-tito) — outra versão do PDF (ver pendências) |
| 7 | México,Guadalupe e Cancún | `roteiro_vlm_mexico_guadalupe_frei-jose-1.pdf` | Roteiro 13 (mexico-guadalupe-cancun-2028) — outra versão do PDF (ver pendências) |
| 8 | Egito e Terra Santa | `roteiro_vlm_egito_terrasanta_padre-paulo.pdf` | Roteiro 14 (egito-terra-santa) |
| 9 | Portugal e França | `vlm_roteiro_portugal_franca_donizete-1.pdf` | Roteiro 1 (portugal-e-franca) |
| 10 | São Paulo, Aparecida e Canção Nova | `vlm_roteiro_aparecida_cancao-nova_moises.pdf` | Roteiro 2 (sao-paulo-aparecida-cancao-nova) |
| 11 | México,Guadalupe e Cancún | `vlm_roteiro_guadalupe_padre-fabio-fernandes_web.pdf` | Roteiro 3 (mexico-guadalupe-cancun-2027) |
| 12 | Rio de Janeiro e Aparecida | `banner_vlm_rio-aparecida_adriana_web.pdf` | Roteiro 4 (rio-de-janeiro-aparecida) |
| 13 | Portugal, Itália e Vaticano | `vlm_roteiro_port-italia-vaticano_padre-assis.pdf` | Roteiro 5 (portugal-italia-vaticano) |
| 14 | Santuários Marianos | `vlm_roteiro_santuarios_marianos_Joao-Carlos_AJUSTADO.pdf` | Roteiro 6 (santuarios-marianos-brasilia) |
| 15 | Santuários Marianos | `vlm_roteiro_santuarios_marianos_AJUSTADO.pdf` | Roteiro 7 (santuarios-marianos-londrina) |
| 16 | Aparecida do Norte | `Roteiro-Aparecida-do-Norte_Agosto_v2_web.pdf` | Roteiro 8 (aparecida-agosto-2027) |
| 17 | Europa Sagrada | `roteiro_vlm_europa_sagrada_2_AJUSTADO.pdf` | Roteiro 9 (europa-sagrada) |
| 18 | Santuários Italianos | `vlm_santuarios_italianos_roteiro_AJUSTADO.pdf` | Roteiro 10 (santuarios-italianos) |
| 19 | Aparecida do Norte | `vlm_aparecida1_maio_roteiro_web.pdf` | Roteiro 11 (aparecida-carlos-2027) |
| 20 | Círio de Nazaré | `#contato` | **Pendente** — Círio de Nazaré |

## 4. Viagens fora dos 14 roteiros (pendentes de inclusão)

Cadastradas no CMS como **rascunho** (não aparecem no site) para validação editorial — nenhuma foi descartada.

| Viagem | Período | Embarque | Acompanhamento | Origem |
|---|---|---|---|---|
| Grupo Itália e Portugal | 16 a 30 de Outubro de 2027 – 12 Noites | São Paulo/Guarulhos | Padre Silas de Oliveira, RCJ (Direção espiritual) | Card nº 1 da homepage + PDF |
| Grupo México, Guadalupe e Cancún | 03 a 15 de Abril e 2027 – 10 Noites | São Paulo/Guarulhos | Elaine Floriano (Formadora) | Card nº 2 da homepage + PDF |
| Grupo México, Guadalupe e Cancún | 17 a 30 de Janeiro de 2028 – 11 Noites | São Paulo/Guarulhos | Padre Diogo Albuquerque (Direção espiritual); Fred Pacheco (Banda DOM) (Direção espiritual) | Card nº 3 da homepage + PDF |
| Grupo Especial Portugal, Itália e Vaticano | 18 a 30 de Outubro de 2027 – 10 Noites | Curitiba | Gracielle Gonçalves (Formadora) | Card nº 4 da homepage + PDF |
| Especial Portugal, Itália e Vaticano | 16 a 30 de Outubro de 2027 – 12 Noites | Curitiba | Padre Adailton (Direção espiritual); Fernando Vinhote (Direção espiritual) | Card nº 5 da homepage + PDF |
| Círio de Nazaré | — | — | — | Card nº 20 da homepage |
| Mistérios de Guadalupe – México e Cancún | 06 a 17 de Novembro de 2026 | — | Padre Davi da Cruz (Direção espiritual) | Landing page /lp-roteiro-guadalupe-2026/ (fora do menu) |

## 5. Mídia recuperada

- **119 arquivos** baixados (137,6 MB), **0 falhas**; 2 URLs eram duplicatas binárias (mesmo conteúdo) e foram unificadas sem perder a referência.
- Cada arquivo tem URL de origem, hash SHA-256, tamanho e usos registrados em `migration/asset-manifest.json`.
- Versões WebP otimizadas geradas ao lado dos originais (originais intactos; apenas redimensionamento até 2400 px e recompressão — sem filtros ou cortes).

| Pasta (`public/assets/`) | Arquivos | Originais | WebP otimizados |
|---|---|---|---|
| `acompanhantes/` | 15 | 12,2 MB | 1 MB |
| `destinos/` | 58 | 73,1 MB | 27 MB |
| `destinos-pendentes/` | 11 | 14,8 MB | 2 MB |
| `home/` | 2 | 1,1 MB | 0,5 MB |
| `icons/` | 5 | 0,1 MB | 0 MB |
| `institucional/` | 4 | 1,8 MB | 0,5 MB |
| `logos/` | 8 | 1,1 MB | 0,8 MB |
| `pdfs/` | 16 | 33,4 MB | — |

### Itens da biblioteca de mídia não baixados

A biblioteca pública do WordPress tem 220 itens; 100 não são usados pelas páginas publicadas (versões antigas de PDFs, rascunhos de artes, capturas de tela, fotos de WhatsApp sem uso). Ficaram listados abaixo para eventual recuperação, mas não foram incorporados ao site.

<details><summary>Ver lista (100)</summary>

| Arquivo | Tipo | Tamanho |
|---|---|---|
| 2026/04/6Jmhu9sA.jpeg | image/jpeg | 82 KB |
| 2026/04/AdobeStock_523596830.jpg | image/jpeg | 309 KB |
| 2026/04/Cirio-de-nazare.jpg | image/jpeg | 385 KB |
| 2026/04/Gemini_Generated_Image_or8bp7or8bp7or8b.jpg | image/jpeg | 498 KB |
| 2026/04/Gramado.jpg | image/jpeg | 574 KB |
| 2026/04/pexels-haleyve-2087387.jpg | image/jpeg | 579 KB |
| 2026/04/Portugal-e-Italia.jpg | image/jpeg | 556 KB |
| 2026/04/rJQWKLmQ.jpeg | image/jpeg | 76 KB |
| 2026/04/Santuarios-Italianos.jpg | image/jpeg | 609 KB |
| 2026/04/Sf7Xyxqw.jpeg | image/jpeg | 53 KB |
| 2026/04/turista-cliente-peregrino.jpg | image/jpeg | 180 KB |
| 2026/05/Aparecida-do-Norte_Agosto_Feed-Stories2_feed-copia-2-1.jpg | image/jpeg | 946 KB |
| 2026/05/Captura-de-tela-2026-05-02-174212.png | image/png | 32 KB |
| 2026/05/Captura-de-tela-2026-05-02-175232.png | image/png | 1 KB |
| 2026/05/Misterios-de-Guadalupe_Padre-Davi.pdf | application/pdf | 27.408 KB |
| 2026/05/Misterios-de-Guadalupe-Pe-Davi-08-05-2026__Versao-aprovada-08-05-2026-copia-scaled.jpg | image/jpeg | 674 KB |
| 2026/05/Misterios-de-Guadalupe-Pe-Davi-08-05-2026_-1.pdf | application/pdf | 27.408 KB |
| 2026/05/Misterios-de-Guadalupe-Pe-Davi-08-05-2026_.pdf | application/pdf | 21.434 KB |
| 2026/05/roteiro_aparecida_.pdf | application/pdf | 11.376 KB |
| 2026/05/Roteiro_Aparecida-do-Norte_Padre-Carlos.pdf | application/pdf | 49.452 KB |
| 2026/05/roteiro_aparecida.pdf | application/pdf | 10.317 KB |
| 2026/05/roteiro_vlm_aparecida_novo_feed-scaled.jpg | image/jpeg | 810 KB |
| 2026/05/roteiro_vlm_aparecida_novo.pdf | application/pdf | 49.443 KB |
| 2026/05/roteiro_vlm_santuarios_italianos_padre_thiago.pdf | application/pdf | 13.998 KB |
| 2026/05/ROTEIRO-1.pdf | application/pdf | 10.317 KB |
| 2026/05/Roteiro-Aparecida-do-Norte_Agosto_site-1.pdf | application/pdf | 6.205 KB |
| 2026/06/banner_topo-1-scaled.jpg | image/jpeg | 505 KB |
| 2026/06/logo-garupa-bicicleta.svg | image/svg+xml | 3 KB |
| 2026/06/Misterios-de-Guadalupe_Padre-Davi.pdf | application/pdf | 84.593 KB |
| 2026/06/Misterios-de-Guadalupe-Roteiro-12-06-2026_site.pdf | application/pdf | 84.593 KB |
| 2026/06/Misterios-de-Guadalupe-Roteiro-feed-scaled.jpg | image/jpeg | 604 KB |
| 2026/06/novo-logo-01.jpg | image/jpeg | 46 KB |
| 2026/06/Novo-Projeto-4.jpg | image/jpeg | 96 KB |
| 2026/06/roteiro_vlm_europa_sagrada_2.pdf | application/pdf | 44.507 KB |
| 2026/06/santuarios_marianos_Joab-Feed_Feed.jpg | image/jpeg | 1.129 KB |
| 2026/06/vlm_adriana_feed_feed.jpg | image/jpeg | 1.285 KB |
| 2026/06/vlm_roteiro_gramado_adriana-1.pdf | application/pdf | 4.004 KB |
| 2026/06/vlm_roteiro_santuarios_marianos_Joab-F-1.pdf | application/pdf | 2.306 KB |
| 2026/06/vlm_roteiro_santuarios_marianos_Joao-Carlos-1.pdf | application/pdf | 2.723 KB |
| 2026/06/vlm_roteiro_santuarios_marianos-1.pdf | application/pdf | 44.094 KB |
| 2026/07/Aparecida-do-Norte_Agosto_Feed-2_v2-scaled.jpg | image/jpeg | 709 KB |
| 2026/07/capa-Roteiro-Aparecida-do-Norte_Agosto_v2.jpg | image/jpeg | 1.354 KB |
| 2026/07/feed-stories_vlm_rio-aparecida_adriana-01.jpg | image/jpeg | 1.487 KB |
| 2026/07/foto_guadalupe-mexico_2.jpg | image/jpeg | 1.085 KB |
| 2026/07/foto_guadalupe-mexico_3-13-1.jpg | image/jpeg | 978 KB |
| 2026/07/foto_guadalupe-mexico.jpg | image/jpeg | 2.919 KB |
| 2026/07/foto_padre-davi.png | image/png | 419 KB |
| 2026/07/iStock-1326051745.jpg | image/jpeg | 877 KB |
| 2026/07/iStock-1433819332.jpg | image/jpeg | 1.077 KB |
| 2026/07/iStock-2149823695.jpg | image/jpeg | 902 KB |
| 2026/07/iStock-2149823695.png | image/png | 1.904 KB |
| 2026/07/Misterios-de-Guadalupe-Roteiro-feed_-scaled.jpg | image/jpeg | 609 KB |
| 2026/07/roteiro_vlm_rio-aparecida_adriana_web_com-contatos.pdf | application/pdf | 514 KB |
| 2026/07/Roteiro-Aparecida-do-Norte_Agosto_site_v2-1.pdf | application/pdf | 941 KB |
| 2026/07/Roteiro-Aparecida-do-Norte_Agosto_site_v2.pdf | application/pdf | 941 KB |
| 2026/07/Roteiro-Aparecida-do-Norte_Agosto_v2_AJUSTADO.pdf | application/pdf | 1.697 KB |
| 2026/07/Roteiros_Banners_Site-01-1.jpg | image/jpeg | 130 KB |
| 2026/07/Roteiros_Banners_Site-01.jpg | image/jpeg | 184 KB |
| 2026/07/Roteiros_Banners_Site-02.jpg | image/jpeg | 496 KB |
| 2026/07/Vialumina_foto_4-2.png | image/png | 5.826 KB |
| 2026/07/Vialumina_foto_5-scaled.png | image/png | 3.515 KB |
| 2026/07/Vialumina_foto_6.png | image/png | 7.030 KB |
| 2026/07/Vialumina_foto_7.png | image/png | 7.247 KB |
| 2026/07/Vialumina_roteiro_capas_ANTIGO.png | image/png | 7.235 KB |
| 2026/07/vlm_aparecida1_maio_roteiro_AJUSTADO.pdf | application/pdf | 2.400 KB |
| 2026/07/vlm_roteiro_port-italia-vaticano_padre-assis_web.pdf | application/pdf | 669 KB |
| 2026/07/vlm_roteiro_port-italia-vaticano_padre-assis-AJUSTE.pdf | application/pdf | 2.342 KB |
| 2026/08/c6167e84dc97c8836f1ecd2e0606d703.jpg | image/jpeg | 291 KB |
| 2026/08/form_adriana-03.jpg | image/jpeg | 106 KB |
| 2026/08/IMG_1303.heic | image/heic | 1.712 KB |
| 2026/08/iStock-1318968050-1-scaled.jpg | image/jpeg | 730 KB |
| 2026/08/iStock-1433819332-scaled.jpg | image/jpeg | 976 KB |
| 2026/08/iStock-2154578606-scaled.jpg | image/jpeg | 919 KB |
| 2026/08/iStock-2176075839-scaled.jpg | image/jpeg | 1.419 KB |
| 2026/08/iStock-2263908714-scaled.jpg | image/jpeg | 857 KB |
| 2026/08/iStock-456892175-scaled.jpg | image/jpeg | 392 KB |
| 2026/08/vlm_post-stories_santuarios_marianos_padre-tito-01-scaled.jpg | image/jpeg | 751 KB |
| 2026/08/vlm_roteiro_portugal_franca_donizete.pdf | application/pdf | 688 KB |
| 2026/08/vlm_roteiro_santuarios_marianos_padre-tito-1.pdf | application/pdf | 326 KB |
| 2026/08/WhatsApp-Image-2026-05-26-at-11.56.05-1.jpeg | image/jpeg | 182 KB |
| 2026/08/WhatsApp-Image-2026-05-28-at-11.53.44-1.png | image/png | 1.275 KB |
| 2026/08/WhatsApp-Image-2026-06-05-at-17.30.32.jpeg | image/jpeg | 21 KB |
| 2026/08/WhatsApp-Image-2026-06-12-at-18.38.21-002.jpeg | image/jpeg | 52 KB |
| 2026/08/WhatsApp-Image-2026-06-15-at-11.37.14.jpeg | image/jpeg | 148 KB |
| 2026/08/WhatsApp-Image-2026-07-09-at-16.36.19.jpeg | image/jpeg | 277 KB |
| 2026/08/WhatsApp-Image-2026-07-14-at-11.44.27-1.jpeg | image/jpeg | 90 KB |
| 2026/08/WhatsApp-Image-2026-08-05-at-10.17.56.jpeg | image/jpeg | 136 KB |
| 2026/08/WhatsApp-Image-2026-08-12-at-09.29.13-002.jpeg | image/jpeg | 99 KB |
| 2026/08/WhatsApp-Image-2026-08-12-at-09.29.13-1-002.png | image/png | 1.424 KB |
| 2026/08/WhatsApp-Image-2026-08-13-at-08.18.15-1.jpeg | image/jpeg | 310 KB |
| 2026/08/WhatsApp-Image-2026-08-13-at-09.22.28-002-1.jpeg | image/jpeg | 86 KB |
| 2026/08/WhatsApp-Image-2026-08-13-at-09.22.28-002.jpeg | image/jpeg | 86 KB |
| 2026/09/form_adriana-03-removebg-preview.png | image/png | 78 KB |
| 2026/09/vlm_guadalupe_padre-diogo_fred-pacheco_post-stories-01.jpg | image/jpeg | 933 KB |
| 2026/09/vlm_portugal_italia_vaticano_gracielle_post_stories-01-1.jpg | image/jpeg | 1.124 KB |
| 2026/09/vlm_roteiro_guadalupe_padre-diogo_fred-pacheco_V2-1.pdf | application/pdf | 725 KB |
| 2026/09/vlm_roteiro_guadalupe_padre-diogo_fred-pacheco_V2-2.pdf | application/pdf | 725 KB |
| 2026/09/vlm_roteiro_guadalupe_padre-diogo_fred-pacheco_V2-3.pdf | application/pdf | 725 KB |
| 2026/09/vlm_roteiro_guadalupe_padre-diogo_fred-pacheco_V2-4.pdf | application/pdf | 725 KB |
| 2026/09/WhatsApp-Image-2026-06-02-at-09.57.39-1.png | image/png | 980 KB |

</details>

## 6. Identidade visual

Detalhes e tokens em [design-tokens.md](design-tokens.md). Resumo:

- **Tipografia:** Playfair Display (títulos), Lato (textos), Montserrat (rótulos e botões) — fontes livres (OFL), servidas localmente.
- **Cores:** azul-marinho #0A2E5C / #1E3A5F, azul #0073B6, dourados #C9922A / #C99A2E / #D29C35 / #E2B04A, creme #FAF7F2, verde WhatsApp #16A34A / #12813C.
- **Logotipos:** Via Lumina (colorido e branco), Grupo Arbo (branco, PNG e SVG), favicon e os raios dourados usados como marca d'água.
