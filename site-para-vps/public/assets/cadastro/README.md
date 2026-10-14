# Imagens das landing pages de cadastro

As páginas `/cadastro/padres`, `/cadastro/agencias` e `/cadastro/peregrinos` procuram aqui as imagens de destaque
geradas por IA. **Enquanto o arquivo não existir, a página usa uma fotografia do acervo original** (ver
`src/content/cadastro-images.ts`), então nada fica quebrado.

| Arquivo (WebP, 1600×1280 ou maior) | Página | Prompt sugerido |
|---|---|---|
| `padres-hero.webp` | Padres | *Fotografia realista de um sacerdote católico brasileiro, de batina ou clergyman, no interior de uma igreja tradicional; luz natural entrando por janelas altas; serenidade e acolhimento; composição premium, profundidade de campo suave, sem texto, sem logotipos, mãos naturais, traços humanos não idealizados.* |
| `agencias-hero.webp` | Agências | *Fotografia realista de dois consultores de turismo em escritório contemporâneo claro, analisando roteiros e mapas de destinos em um notebook; luz natural; profissionalismo e confiança; sem logotipos de empresas, sem texto legível na tela, mãos naturais.* |
| `peregrinos-hero.webp` | Peregrinos | *Fotografia realista de peregrinos adultos brasileiros de diferentes idades diante de um santuário católico, luz natural de fim de tarde, atmosfera acolhedora, sem exageros emocionais, pessoas com aparência natural, sem texto.* |

Regras (briefing):

- Usar somente nestas três páginas; **nunca** apresentar as pessoas geradas como sacerdotes parceiros, clientes ou peregrinações reais.
- A página exibe automaticamente a legenda “Imagem ilustrativa criada por inteligência artificial” quando usa estes arquivos.
- Revisar cada imagem (mãos, rostos, símbolos religiosos, vestes) antes de publicar. Cores devem harmonizar com o azul `#0a2e5c` e o dourado `#c9922a`.
- Otimize para WebP (qualidade ~80). O `next/image` gera os tamanhos responsivos.
- Depois de adicionar um arquivo, publique/reinicie: a verificação de existência ocorre no servidor ao gerar a página (revalida a cada hora).
