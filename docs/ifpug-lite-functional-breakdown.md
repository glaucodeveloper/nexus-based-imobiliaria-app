# IFPUG-lite Functional Breakdown

## Purpose

This document translates the current project into a lightweight IFPUG-style functional view.

It is not a certified IFPUG count.
It is an `IFPUG-lite` operational estimate derived from the application behavior currently visible in the repository.

The goal is to:

- measure functions perceived by the user
- bridge functional sizing with the repository `norm65` metric
- assign a commercial reference value per functionality

## Basis Used

Technical baseline already measured:

- useful raw lines: `5149`
- useful characters: `163345`
- `norm65`: `2513.00`

Commercial baseline already adopted for the project:

- total project value: `~R$ 3.280`

## Method

This estimate follows the IFPUG logic at a lightweight level:

- data functions:
  - `ILF` = Internal Logical File
  - `EIF` = External Interface File
- transaction functions:
  - `EI` = External Input
  - `EO` = External Output
  - `EQ` = External Inquiry

Standard unadjusted weights used in this `IFPUG-lite` reading:

| Type | Low | Avg | High |
| --- | ---: | ---: | ---: |
| `EI` | 3 | 4 | 6 |
| `EO` | 4 | 5 | 7 |
| `EQ` | 3 | 4 | 6 |
| `ILF` | 7 | 10 | 15 |
| `EIF` | 5 | 7 | 10 |

These weights are used here as a practical unadjusted reference.

## Data Functions

| Function | Type | Complexity | FP |
| --- | --- | --- | ---: |
| Property catalog and property attributes | `ILF` | Avg | 10 |
| Broker catalog | `ILF` | Low | 7 |
| CRM leads and commercial follow-up data | `ILF` | Avg | 10 |
| Dashboard content, metrics, settings, and operational lists | `ILF` | Avg | 10 |
| Favorites and session-like local user state | `ILF` | Low | 7 |
| External CMS repository/data source | `EIF` | Avg | 7 |

Data subtotal:

- `51 FP`

## Transaction Functions

| Function perceived by the user | Type | Complexity | FP |
| --- | --- | --- | ---: |
| Explore homepage and featured inventory | `EQ` | Low | 3 |
| Search, filter, sort, and page through property catalog | `EQ` | Avg | 4 |
| Compare selected properties | `EQ` | Low | 3 |
| View property detail and image gallery | `EQ` | Avg | 4 |
| Favorite or unfavorite a property | `EI` | Low | 3 |
| Submit proposal from property detail | `EI` | Avg | 4 |
| Submit "announce your property" lead | `EI` | Avg | 4 |
| Submit generic contact lead | `EI` | Avg | 4 |
| Complete quiz and receive a suggested property | `EO` | Avg | 5 |
| Authenticate into admin area | `EI` | Avg | 4 |
| View dashboard overview | `EO` | Avg | 5 |
| Browse dashboard collections and tabs | `EQ` | Avg | 4 |
| Create a new property in the editor | `EI` | Avg | 4 |
| Update an existing property in the editor | `EI` | Avg | 4 |
| Delete a property | `EI` | Low | 3 |
| Remove an item from a dashboard collection | `EI` | Low | 3 |

Transaction subtotal:

- `61 FP`

## Total Functional Size

- data functions: `51 FP`
- transaction functions: `61 FP`
- total `IFPUG-lite`: `112 FP`

## Bridge To Norm65

Using the current project baseline:

- `2513.00 norm65 / 112 FP = 22.44 norm65 por FP`
- `163345 useful chars / 112 FP = 1458.44 useful chars por FP`
- `5149 useful lines / 112 FP = 45.97 useful lines por FP`

This creates a working bridge between:

- functional size
- technical production volume
- commercial valuation

## Commercial Bridge

Using the adopted project value of `R$ 3.280`:

- `R$ 3.280 / 112 FP = R$ 29,29 por FP`

So the current project baseline implies:

- `1 FP ≈ 22.44 norm65`
- `1 FP ≈ 45.97 linhas úteis`
- `1 FP ≈ R$ 29,29`

## Weighted Value By Project Part

The per-FP bridge above is uniform.
However, the codebase does not have uniform architectural weight.

To estimate more realistic values for each part of the project, this repository uses a weighted reading based on:

- real `norm65` size measured in the codebase
- `architectural_factor`
- `functional_criticality_factor`

Weighted score formula:

- `weighted_score = norm65_part x architectural_factor x criticality_factor`

The project value of `R$ 3.280` is then distributed proportionally across the weighted scores.

### Factors used

- `architectural_factor`
  - `1.35` = foundation/core
  - `1.25` = admin/CMS backbone
  - `1.15` = important feature flow
  - `1.10` = shared visual system
  - `1.00` = standard feature flow
  - below `1.00` = auxiliary utility

- `functional_criticality_factor`
  - `1.30` = critical operation/commercial continuity
  - `1.20` = high business relevance
  - `0.85` = support layer with lower direct business criticality
  - `0.55` = peripheral utility

### Weighted commercial breakdown

| Project part | Main files considered | norm65 | Architectural factor | Functional criticality | Weighted score | Estimated value |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| Visual shared layer | `index.html`, `styles.css`, `tokens.css` | 696.97 | 1.10 | 0.85 | 651.67 | R$ 665,73 |
| Runtime and foundation | `state/app-state.js`, `events/bootapp.js`, shared shell components | 643.57 | 1.35 | 1.20 | 1042.58 | R$ 1.065,09 |
| Property discovery | `featured`, `listing`, `detail`, `favorites`, property cards | 356.11 | 1.15 | 1.25 | 511.91 | R$ 522,96 |
| Lead capture | `announce`, `contact`, `quiz` | 137.05 | 1.00 | 1.20 | 164.46 | R$ 168,01 |
| Admin and CMS | `login`, `product-editor`, dashboard modules, CMS data | 466.57 | 1.25 | 1.30 | 758.18 | R$ 774,54 |
| PDF utility | `gerar_proposta_pdf.py` | 212.74 | 0.70 | 0.55 | 81.90 | R$ 83,67 |

Weighted total:

- `R$ 3.280,00`

## Reading The Weighted Breakdown

This weighted breakdown says:

- the largest commercial concentration is in the application kernel, not in any isolated screen
- `Admin and CMS` is worth more than its raw screen count alone would suggest, because it concentrates write flows and operational continuity
- `Lead capture` is commercially important but smaller in technical mass
- the visual layer is large in code volume but receives a lower criticality factor than the foundation and admin core
- the PDF generator exists as a real technical asset, but with lower architectural and business criticality in the current repository context

## Functional Reading Inside The Weighted View

You can interpret the project in two simultaneous ways:

- `112 FP` as user-perceived functional size
- weighted part values as implementation-value concentration

This means the project can be priced:

- by global functional size
- by implementation concentration
- or by a combination of both

## Practical Per-Function Reading

Using the weighted breakdown, functions inside a heavier architectural package should not be valued only by raw FP count.

Example:

- a `4 FP` admin/CMS function is economically denser than a `4 FP` brochure-style display function
- a shared runtime capability can carry value even when users do not see it as a standalone screen

For this reason, the repository uses:

- `IFPUG-lite` for functional count
- weighted part valuation for commercial concentration
- `norm65` for technical production size

## Functional Packages

The table below groups the application into packages that users would recognize.

| Package | Included functional pieces | FP | Approx. norm65 | Approx. useful lines | Approx. value |
| --- | --- | ---: | ---: | ---: | ---: |
| Discovery and brand | homepage exploration, featured inventory, broker base | 10 | 224.40 | 459.70 | R$ 292,90 |
| Property discovery | catalog search, compare, detail, favorites, property catalog, local state | 31 | 695.64 | 1425.07 | R$ 908,00 |
| Lead capture | proposal, announce flow, contact form, quiz, CRM lead base | 27 | 605.88 | 1241.19 | R$ 790,83 |
| Admin and CMS | login, dashboard overview, collection browsing, property CRUD, dashboard content, external CMS | 44 | 987.36 | 2022.68 | R$ 1.288,76 |

Package total:

- `112 FP`
- `2513.28 norm65` equivalent by rounding bridge
- `~R$ 3.280,49` equivalent by rounding bridge

Minor rounding differences exist because the bridge is derived from divided totals.

## Reading By Functionality

This means, under the current project baseline:

- a `3 FP` function is worth about:
  - `67.32 norm65`
  - `137.91` useful lines
  - `R$ 87,87`
- a `4 FP` function is worth about:
  - `89.76 norm65`
  - `183.88` useful lines
  - `R$ 117,16`
- a `5 FP` function is worth about:
  - `112.20 norm65`
  - `229.85` useful lines
  - `R$ 146,45`
- a `10 FP` function is worth about:
  - `224.40 norm65`
  - `459.70` useful lines
  - `R$ 292,90`

## Relationship To Norm65

`norm65` remains the technical production metric of record.

This document does not replace it.
Instead, it explains what the `norm65` baseline means when decomposed into user-perceived functional units.

In this project:

- `norm65` answers: how much technical production exists
- `IFPUG-lite` answers: how much user-perceived functional size exists

Used together, they allow:

- functional pricing
- cycle planning
- package comparison
- feature-level commercial breakdown

## External References

- IFPUG overview:
  - https://ifpug.org
- Functional size measurement overview:
  - https://en.wikipedia.org/wiki/Function_point
