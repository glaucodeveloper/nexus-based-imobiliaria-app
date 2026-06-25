# Project Budget Table

## Purpose

This document is the commercial budgeting view of the current project.

It uses:

- measured technical size from `norm65`
- user-perceived functional size from `IFPUG-lite`
- weighted value concentration by architectural importance and functional criticality

Generated executive artifacts based on this source:

- [project-budget-table.xlsx](/home/wqsaxz/dev/nexus-based-imobiliaria-app/deliverables/project-budget-table.xlsx)
- [project-metrics-summary.pdf](/home/wqsaxz/dev/nexus-based-imobiliaria-app/deliverables/project-metrics-summary.pdf)

## Baseline

- useful raw lines: `5149`
- useful characters: `163345`
- `norm65`: `2513.00`
- `IFPUG-lite`: `112 FP`
- adopted lean project value: `R$ 3.280,00`

## Commercial Conversion

- `1 FP ≈ R$ 29,29`
- `1 norm65 ≈ R$ 1,31`
- `1 linha útil ≈ R$ 0,64`

## Weighted Budget By Module

| Module | Functional scope | FP | norm65 | Weight basis | Module value |
| --- | --- | ---: | ---: | --- | ---: |
| Visual shared layer | shell, layout, styles, tokens, entry structure | 0 direct FP package | 696.97 | large technical mass, medium architectural relevance, lower direct business criticality | R$ 665,73 |
| Runtime and foundation | app runtime, route handling, shared state, session, data normalization, shared shell components | indirect support for all functions | 643.57 | highest architectural importance, high business continuity | R$ 1.065,09 |
| Property discovery | featured inventory, listing, filtering, comparison, detail, favorites | 31 FP | 356.11 | strong user-facing value, relevant search flow | R$ 522,96 |
| Lead capture | property proposal, announce flow, contact, quiz | 27 FP | 137.05 | commercially important, lower code mass | R$ 168,01 |
| Admin and CMS | login, dashboard, collections, property editor, CMS integration | 44 FP | 466.57 | high write-criticality and operational importance | R$ 774,54 |
| PDF utility | proposal PDF generation support | peripheral utility | 212.74 | auxiliary feature, lower runtime centrality | R$ 83,67 |

Total:

- `R$ 3.280,00`

## User-Perceived Functional Packages

| Functional package | Included functions | FP | Approx. value |
| --- | --- | ---: | ---: |
| Discovery and brand | homepage, featured inventory, broker showcase | 10 | R$ 292,90 |
| Property discovery | listing, filters, compare, detail, favorites | 31 | R$ 908,00 |
| Lead capture | proposal, announce, contact, quiz | 27 | R$ 790,83 |
| Admin and CMS | login, dashboard, collection browsing, property CRUD, CMS source | 44 | R$ 1.288,76 |

## Function Price Reference

Under the current project baseline:

| Function size | Approx. value | Approx. norm65 | Approx. useful lines |
| --- | ---: | ---: | ---: |
| `3 FP` | R$ 87,87 | 67.32 | 137.91 |
| `4 FP` | R$ 117,16 | 89.76 | 183.88 |
| `5 FP` | R$ 146,45 | 112.20 | 229.85 |
| `10 FP` | R$ 292,90 | 224.40 | 459.70 |

## MEI Charges

For a service-provider `MEI`, this repository uses the standard recurring formula:

- `DAS-MEI de serviços = 5% do salário mínimo + R$ 5,00`

Estimated 2026 reading used here:

- assumed minimum wage: `R$ 1.621,00`
- estimated monthly `INSS`: `R$ 81,05`
- estimated monthly `DAS-MEI serviços`: `R$ 86,05`

Impact over the current project value:

- gross project value: `R$ 3.280,00`
- less one estimated monthly DAS: `R$ 86,05`
- net after DAS only: `R$ 3.193,95`

If `R$ 3.280,00` must be preserved as net after the monthly DAS burden:

- suggested gross charged value: `R$ 3.366,05`

## Notes

- This is a lean-market commercial reading, not an enterprise agency budget.
- The weighted module values are more realistic for scoping than a flat `FP x price` multiplication alone.
- The runtime and admin layers carry disproportionate value because they support more than one visible feature.

## References

- Technical size baseline:
  - [docs/code-metrics.md](/home/wqsaxz/dev/nexus-based-imobiliaria-app/docs/code-metrics.md)
- Functional sizing:
  - [docs/ifpug-lite-functional-breakdown.md](/home/wqsaxz/dev/nexus-based-imobiliaria-app/docs/ifpug-lite-functional-breakdown.md)
- Metric standard:
  - [docs/software-production-metric-standard.md](/home/wqsaxz/dev/nexus-based-imobiliaria-app/docs/software-production-metric-standard.md)
