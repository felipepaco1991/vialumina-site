#!/usr/bin/env bash
# Mede Lighthouse (mobile e desktop) nas páginas principais e grava um resumo em docs/qa/lighthouse.md
# Uso: scripts/qa/lighthouse.sh [baseURL]
set -euo pipefail
BASE="${1:-http://localhost:3000}"
OUT="$(mktemp -d)"
PAGES=("/" "/destinos" "/destinos/egito-terra-santa" "/destinos/portugal-e-franca" "/quem-somos" "/nossa-historia" "/contato")
mkdir -p docs/qa
{
  echo "# Lighthouse — $(date '+%d/%m/%Y %H:%M')"
  echo
  echo "Base: \`$BASE\` (build de produção). Lighthouse 12, Chrome headless."
  echo
  echo "| Página | Dispositivo | Performance | Acessibilidade | Boas práticas | SEO | LCP | CLS | TBT |"
  echo "|---|---|---|---|---|---|---|---|---|"
} > docs/qa/lighthouse.md
for p in "${PAGES[@]}"; do
  for preset in mobile desktop; do
    f="$OUT/$(echo "$p" | tr '/' '_')-$preset.json"
    extra=()
    [ "$preset" = desktop ] && extra=(--preset=desktop)
    npx -y lighthouse@12.8.2 "$BASE$p" --quiet "${extra[@]}" --chrome-flags="--headless=new --no-sandbox" --output=json --output-path="$f" >/dev/null 2>&1 || true
    node -e "
      const r=require('$f'); const c=r.categories, a=r.audits, s=k=>Math.round(c[k].score*100);
      console.log('| \`$p\` | $preset | '+[s('performance'),s('accessibility'),s('best-practices'),s('seo'),a['largest-contentful-paint'].displayValue,a['cumulative-layout-shift'].displayValue,a['total-blocking-time'].displayValue].join(' | ')+' |')
    " | tee -a docs/qa/lighthouse.md
  done
done
