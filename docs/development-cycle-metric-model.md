# Development Cycle Metric Model

## Purpose

This project adopts a cycle metric model that combines:

- `norm65` for technical production volume
- `COSMIC-lite` for functional delivery size
- cycle tracking for planning and review

The model is intentionally lightweight.

It is not a full certified IFPUG or COSMIC implementation.
It is a project-operational adaptation meant to stay compatible with the logic of functional sizing while remaining usable in a small frontend codebase.

## Metric Stack

### 1. Technical production

- `norm65_before`
- `norm65_after`
- `delta_norm65`

Formula:

- `delta_norm65 = norm65_after - norm65_before`

### 2. Functional delivery

Each backlog item receives a `COSMIC-lite` count.

Count these movements:

- `E` = entry
- `X` = exit
- `R` = read
- `W` = write

Formula:

- `cosmic_lite_item = E + X + R + W`

### 3. Cycle flow

Each cycle should track:

- `cycle_id`
- `date_start`
- `date_end`
- `planned_items`
- `done_items`
- `planned_cosmic_lite`
- `done_cosmic_lite`
- `norm65_before`
- `norm65_after`
- `delta_norm65`
- `rework_norm65`
- `planned_vs_done_pct`

## COSMIC-lite Counting Rules

This repo should use the following simplified rules:

- user action or external request entering the system = `E`
- render response, confirmation, or data returned to UI = `X`
- read from in-memory collection, CMS payload, browser storage, or remote content = `R`
- write to in-memory state, local storage, CMS payload, or remote persistence = `W`

Examples:

- open listing with filters: `E + R + X`
- toggle favorite: `E + W + X`
- login check: `E + R + X`
- save property in editor: `E + R + W + X`
- load CMS snapshot: `R + X`

## Operational Workflow

### Planning

For each planned item:

1. define the item name
2. count its `COSMIC-lite`
3. estimate a likely `delta_norm65` band if useful

### Execution

At the start of the cycle:

- measure `norm65_before`

At the end of the cycle:

- measure `norm65_after`
- calculate `delta_norm65`
- register delivered `done_cosmic_lite`

### Review

Review the cycle with:

- `delta_norm65 / done_cosmic_lite`
- `done_cosmic_lite / cycle`
- `planned_cosmic_lite` vs `done_cosmic_lite`
- `rework_norm65 / delta_norm65`

## Interpretation

### Useful readings

- high `delta_norm65` with low `done_cosmic_lite`
  - likely heavy technical work, refactor, or complexity overhead
- low `delta_norm65` with high `done_cosmic_lite`
  - likely efficient feature delivery
- high `rework_norm65`
  - likely unstable specification or quality issues

### Do not infer

Do not infer from this model alone:

- code quality
- product value
- UX quality
- developer performance as an individual ranking

## Baseline For This Project

Current repository baseline:

- `norm65 = 2513.00`
- useful raw lines = `5149`
- useful characters = `163345`

This is the official baseline to use as the starting reference for future cycles until re-measured under a changed scope.

## Suggested Cycle Table

| cycle_id | planned_items | done_items | planned_cosmic_lite | done_cosmic_lite | norm65_before | norm65_after | delta_norm65 | rework_norm65 | planned_vs_done_pct |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| `C001` | `listing filters, favorites` | `listing filters, favorites` | 6 | 6 | 2513.00 | 2558.40 | 45.40 | 4.00 | 100% |

## Derived Commercial Bridge

If the project is priced with a lauda-based commercial model, the bridge is:

1. measure `norm65`
2. convert useful chars to lauda convention if needed
3. optionally compare `delta_norm65` against delivered `COSMIC-lite`
4. apply the declared commercial rate

This keeps technical volume and functional delivery linked without pretending they are the same thing.
