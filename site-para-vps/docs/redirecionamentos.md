# Mapa de redirecionamentos

Configurados em `src/lib/legacy-redirects.ts` e aplicados pelo `next.config.ts` como **redirecionamentos permanentes (308)**. Entram em vigor quando o novo site assumir o domínio `vialuminaviagens.com.br`.

A forma com barra final (`/europa-sagrada/`) é normalizada antes pelo Next.js (308 para `/europa-sagrada`) e então segue para o destino — dois saltos permanentes, ambos interpretados corretamente por buscadores.

| URL original | Nova URL |
|---|---|
| `/elementor-pagina-899/` | `/destinos/portugal-e-franca` |
| `/elementor-pagina-942/` | `/destinos/sao-paulo-aparecida-cancao-nova` |
| `/mexicoguadalupe-e-cancun/` | `/destinos/mexico-guadalupe-cancun-2027` |
| `/rio-de-janeiro-e-aparecida/` | `/destinos/rio-de-janeiro-aparecida` |
| `/portugal-italia-e-vaticano/` | `/destinos/portugal-italia-vaticano` |
| `/santuarios-marianos/` | `/destinos/santuarios-marianos-brasilia` |
| `/santuarios-marianos-2/` | `/destinos/santuarios-marianos-londrina` |
| `/elementor-pagina-1071/` | `/destinos/aparecida-agosto-2027` |
| `/europa-sagrada/` | `/destinos/europa-sagrada` |
| `/santuarios-italianos-2/` | `/destinos/santuarios-italianos` |
| `/aparecida-do-norte-carlos/` | `/destinos/aparecida-carlos-2027` |
| `/santuarios-marianos-tito/` | `/destinos/santuarios-marianos-tito` |
| `/mexico-guadalupe-e-cancun/` | `/destinos/mexico-guadalupe-cancun-2028` |
| `/egito-e-terra-santa/` | `/destinos/egito-terra-santa` |
| `/lp-roteiro-guadalupe-2026/` | `/destinos` |
| `/page-backup/`, `/sample-page/` | `/` |
| `/feed/`, `/comments/feed/` | `/` |

## Mantidas sem redirecionamento

| URL | Motivo |
|---|---|
| `/links/` | Link da bio do Instagram — preservada como página própria em `/links` |
| `/#quemsomos`, `/#roteiros`, `/#historia`, `/#contato` | Âncoras da homepage antiga: continuam abrindo a homepage nova (âncoras não chegam ao servidor) |

## Arquivos do WordPress (`/wp-content/uploads/...`)

PDFs e imagens antigos compartilhados em redes sociais e no WhatsApp apontam para `wp-content/uploads`. Se o WordPress for desligado, essas URLs deixam de funcionar. Opções:

1. Manter o WordPress (ou só a pasta `uploads`) num subdomínio e redirecionar `/wp-content/uploads/:path*` para ele; ou
2. Acrescentar em `src/lib/legacy-redirects.ts` regras específicas para os PDFs mais compartilhados, apontando para os arquivos já migrados (`/assets/pdfs/<slug>.pdf` ou a URL do PDF no CMS). A relação URL original → arquivo local está em `migration/asset-manifest.json`.
