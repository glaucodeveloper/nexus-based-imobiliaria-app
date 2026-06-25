# Software Production Metric Standard

## Purpose

This repository adopts a tooling-based code production metric as a standard software measurement parameter.

The goal is to create a stable, reproducible unit for:

- comparing codebase size across revisions
- estimating implementation effort
- supporting pricing discussions
- describing software production in a less subjective way

This is a measurement standard, not a quality standard.

It measures production volume, not correctness, maintainability, usability, or business value.

## Standard Unit

Primary unit:

- `norm65`

Definition:

- `norm65 = useful_characters / 65`

Where useful characters come only from lines that are:

- non-empty
- not only comment markers

This makes `norm65` a normalized production measure based on actual written code density.

## Why `65`

`65` characters per normalized line is used as a practical compression factor:

- short sparse code does not overstate volume
- dense long lines are not flattened into naive LOC
- mixed frontend files become more comparable

The standard is intentionally simple and cheap to recompute.

## Secondary Units

The repo can expose additional derived views, but `norm65` remains the primary standard.

Derived units:

- `raw useful lines`
- `useful characters`
- `laudas academicas` using a declared character-per-lauda convention
- `R$/lauda` and `R$/norm65` for commercial estimation
- `COSMIC-lite` for lightweight functional sizing per cycle
- `IFPUG-lite` for user-perceived functional package sizing

## Official Scope Rules

By default, production measurement in this project includes:

- `index.html`
- `styles.css`
- `tokens.css`
- `state/**/*.js`
- `events/**/*.js`
- `components/**/*.js`
- `cms-imobiliaria/data/**/*.json`
- production-support scripts when explicitly declared

By default, it excludes:

- Markdown docs
- `.git/`
- `.codex/`
- `.design/`
- generated assets
- images
- PDFs
- third-party vendored code
- auxiliary repositories inside the workspace

Any published metric must state its scope explicitly.

## Standard Tooling

Official repository tooling for this metric:

- [scripts/measure_norm65.sh](/home/wqsaxz/dev/nexus-based-imobiliaria-app/scripts/measure_norm65.sh)

This script is the canonical local measurement path for this repository.

## Reporting Format

Every formal measurement should report at least:

1. scope used
2. raw useful lines
3. useful characters
4. `norm65`
5. date or commit reference

Recommended optional fields:

- breakdown by subsystem
- top files by `norm65`
- lauda conversion
- commercial interpretation
- `COSMIC-lite` planned and delivered per cycle

## Interpretation Rules

Use `norm65` for:

- size comparison
- rough implementation effort framing
- revision delta tracking
- production density analysis

Do not use `norm65` alone for:

- code quality claims
- architecture quality claims
- delivery time guarantees
- pricing without scope context
- productivity judgment about individuals

## Commercial Use

If production pricing is discussed, this repository uses the following order:

1. measure software volume with `norm65`
2. convert to declared lauda convention if needed
3. apply a clearly stated market pricing model
4. document what is included and excluded

This prevents pricing from floating without a measurable software baseline.

## Development Cycles

The repository uses `norm65` as the technical production baseline and `COSMIC-lite` as the functional cycle companion metric.

Reference documents:

- [docs/development-cycle-metric-model.md](/home/wqsaxz/dev/nexus-based-imobiliaria-app/docs/development-cycle-metric-model.md)
- [docs/ifpug-lite-functional-breakdown.md](/home/wqsaxz/dev/nexus-based-imobiliaria-app/docs/ifpug-lite-functional-breakdown.md)
- [docs/project-budget-table.md](/home/wqsaxz/dev/nexus-based-imobiliaria-app/docs/project-budget-table.md)

## Current Project Baseline

Current documented baseline in this repository:

- useful characters: `163345`
- `norm65`: `2513.00`
- lauda reference at `2000 chars/lauda`: `~82`

These baseline numbers should be refreshed whenever the official measured scope materially changes.
