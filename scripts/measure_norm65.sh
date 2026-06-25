#!/usr/bin/env bash
set -euo pipefail

if [ "$#" -eq 0 ]; then
  set -- \
    index.html \
    styles.css \
    tokens.css \
    gerar_proposta_pdf.py \
    state/app-state.js \
    events/bootapp.js \
    components/*.js \
    components/dashboard/*.js \
    cms-imobiliaria/data/site.json
fi

awk '
function trim(s){sub(/^[[:space:]]+/,"",s);sub(/[[:space:]]+$/,"",s);return s}
function is_comment(s){
  return s ~ /^\/\// || s ~ /^\/\*/ || s ~ /^\*/ || s ~ /^\*\// || index(s, "<!--") == 1 || index(s, "#") == 1
}
{
  line=trim($0)
  if (line=="" || is_comment(line)) next
  raw++
  chars+=length(line)
}
END{
  printf "raw_lines=%d\n", raw
  printf "useful_chars=%d\n", chars
  printf "norm65=%.2f\n", chars/65
}
' "$@"
