# Design tokens

Valores extraídos do CSS do site original (Elementor `post-590.css`, `local-590-frontend-desktop.css` e o bloco `#via-lumina-page` das páginas de roteiro). Implementados em `src/styles/globals.css` (`@theme` do Tailwind CSS 4).

## Tipografia

| Uso | Família | Pesos | Origem no site original |
|---|---|---|---|
| Títulos (h1–h4), nomes de roteiros, citações | **Playfair Display** | 400–700, itálico | `font-family: "Playfair Display", serif` nos títulos da homepage e dos roteiros |
| Textos corridos, descrições, listas | **Lato** | 400, 700 | `font-family: "Lato", sans-serif` no corpo dos roteiros e textos da homepage |
| Sobretítulos, rótulos, botões, navegação | **Montserrat** | 400–800 (variável) | Divisores e rótulos da homepage (`font-weight: 600–700`) |

- Arquivos em `public/assets/fonts/` (licença SIL OFL, ver `LICENSES.md`), carregados com `next/font/local` (sem dependência do Google Fonts em tempo de execução).
- O kit global do Elementor declara Roboto/Roboto Slab, mas essas fontes não aparecem nas seções visíveis; não foram usadas.
- O site original pede Playfair Display com peso 300, que não existe na família — o navegador exibia 400. O novo site usa 400–500.

Escala aplicada: corpo 17 px (público de várias faixas etárias), sobretítulos 12 px em caixa-alta com espaçamento 0,2 em, títulos de seção 32–48 px e títulos de hero 44–104 px.

## Cores

| Token | HEX | Origem / uso |
|---|---|---|
| `navy-950` | `#041A36` | Degradê do card "Grupo Arbo" |
| `navy-900` | `#0A2E5C` | `--primary-blue` dos roteiros — títulos, fundos institucionais |
| `navy-800` | `#1E3A5F` | Títulos da homepage |
| `navy-700` | `#344D6F` | Botões "Conheça o roteiro completo" da homepage |
| `blue-700` | `#0F4C81` | Degradê das faixas de pacote |
| `blue-500` | `#0073B6` | `--secondary-blue` |
| `gold-500` | `#C9922A` | Dourado principal da homepage |
| `gold-450` | `#C99A2E` | `--accent-gold` dos roteiros (traços, timeline) |
| `gold-400` | `#D29C35` | Divisores da homepage |
| `gold-300` | `#E2B04A` | Destaques sobre azul |
| `gold-200` | `#F2D58A` | Rótulos sobre azul (`.director-photo-label span`) |
| `gold-100` | `#F8EFD9` | Fundo dos ícones da ficha do roteiro |
| `gold-700` | `#8A6114` | **Derivado** — texto dourado sobre fundo claro (contraste 5,5:1; o `#C9922A` tem 2,8:1) |
| `cream-100` | `#FAF7F2` | Fundos de seção da homepage |
| `cream-50` | `#FBFAF8` | Fundo geral |
| `mist` | `#F7F9FA` | `--bg-light` dos roteiros |
| `ink-900` | `#333333` | `--text-dark` |
| `slate-700` | `#3A4A5C` | Textos da homepage |
| `slate-500` | `#5C6A7C` | **Ajustado** de `#6B7A8D` para contraste AA |
| `whatsapp` | `#12813C` | Hover do botão de WhatsApp original, usado como cor base (contraste 5:1 com branco; `#16A34A` tem 3,3:1) |
| `alert` | `#D32F2F` | `--red-alert` (lista "não inclui") |

## Formas, sombras e movimento

| Token | Valor | Origem |
|---|---|---|
| Raio de cards | 18 px | `.experience-card { border-radius: 18px }` |
| Raio de painéis | 28 px | `.director-feature { border-radius: 28px }` |
| Botões | pílula (999 px), altura mínima 48–56 px | `.vl-btn { border-radius: 999px; min-height: 50px }` |
| Sombra suave | `0 12px 35px rgb(10 46 92 / .07)` | `.experience-card` |
| Sombra elevada | `0 18px 45px rgb(10 46 92 / .12)` | `.experience-card:hover` |
| Sombra profunda | `0 24px 70px rgb(10 46 92 / .14)` | `.director-feature` |
| Traço de título | 60 × 4 px dourado, raio 2 px | `.section-title::after` |
| Curva de animação | `cubic-bezier(.22, 1, .36, 1)` | — |
| Entrada de seções | 0,7 s, fade + 18 px | — |

Elementos de marca reutilizados: os **raios dourados** do logotipo (`logos/raios-via-lumina.png`, marca d'água nos roteiros originais) aparecem como textura discreta no rodapé, na história e no Instagram; os banners em duotone azul com raios (`home/hero-banner-topo.jpg`, `home/banner-meio-roteiros.jpg`) abrem a homepage e o catálogo.
