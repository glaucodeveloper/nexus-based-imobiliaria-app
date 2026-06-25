# Code Metrics

## Scope

This measurement covers the application source currently present in this repository:

- `index.html`
- `styles.css`
- `tokens.css`
- `state/app-state.js`
- `events/bootapp.js`
- `components/**/*.js`
- `cms-imobiliaria/data/site.json`
- `gerar_proposta_pdf.py`

Excluded from the count:

- Markdown documentation
- `.design/`
- `.codex/`
- `static-next-interator-frontend-skill/`
- binary assets such as images and PDFs
- Git metadata

## Counting Rule

Useful line:

- non-empty line
- line that is not only a comment marker

Normalized line:

- useful characters divided by `65`
- reported as `norm65`

This means a dense file with long lines scores higher than a sparse file with short lines.

## Result

- Useful raw lines: `5149`
- Useful characters: `163345`
- Normalized useful lines at `65` chars: `2513.00`

## Breakdown By Area

| Area | Raw useful lines | Useful chars | norm65 |
| --- | ---: | ---: | ---: |
| `styles` | 2422 | 42735 | 657.46 |
| `components` | 1280 | 62250 | 957.69 |
| `state` | 542 | 22995 | 353.77 |
| `events` | 295 | 10930 | 168.15 |
| `cms-data` | 224 | 8039 | 123.68 |
| `python` | 336 | 13828 | 212.74 |
| `html` | 50 | 2568 | 39.51 |

## Largest Files

| File | Raw useful lines | Useful chars | norm65 |
| --- | ---: | ---: | ---: |
| `styles.css` | 2383 | 41425 | 637.31 |
| `state/app-state.js` | 542 | 22995 | 353.77 |
| `gerar_proposta_pdf.py` | 336 | 13828 | 212.74 |
| `events/bootapp.js` | 295 | 10930 | 168.15 |
| `components/product-editor.js` | 207 | 10809 | 166.29 |
| `components/listing.js` | 174 | 10399 | 159.98 |
| `cms-imobiliaria/data/site.json` | 224 | 8039 | 123.68 |
| `components/detail.js` | 133 | 6292 | 96.80 |

## Reproducibility

Command used:

```bash
awk '
function trim(s){sub(/^[[:space:]]+/,"",s);sub(/[[:space:]]+$/,"",s);return s}
function is_comment(s){return s ~ /^\/\// || s ~ /^\/\*/ || s ~ /^\*/ || s ~ /^\*\/ || s ~ /^<!--/ || s ~ /^#/}
{
  line=trim($0)
  if (line=="" || is_comment(line)) next
  raw++
  chars+=length(line)
}
END{
  printf "raw_lines=%d\nnormalized_65ch=%.2f\nuseful_chars=%d\n", raw, chars/65, chars
}
' index.html styles.css tokens.css gerar_proposta_pdf.py \
  state/app-state.js events/bootapp.js \
  components/*.js components/dashboard/*.js \
  cms-imobiliaria/data/site.json
```

## Interpretation

- The project is frontend-heavy: `styles + components + state + events` represent the majority of the useful code.
- Styling alone is a major part of the codebase, which matches the single-page, highly visual nature of the site.
- `state/app-state.js` and `events/bootapp.js` form the application kernel.
- `components/product-editor.js` and `components/listing.js` are the heaviest UI modules and likely the first places to modularize if the system grows.
