# Technical Overview

## Summary

`nexus-based-imobiliaria-app` is a monolithic client-rendered real estate website with an embedded lightweight CMS workflow.

Engineering measurement in this repository is based on:

- `norm65` for technical production volume
- `COSMIC-lite` for lightweight functional cycle sizing

It is built with:

- static `index.html`
- plain JavaScript modules loaded by script tags
- HTML-string component rendering
- centralized boot runtime in `events/bootapp.js`
- shared application state in `state/app-state.js`
- CSS-driven design system in `tokens.css` and `styles.css`

The current architecture is effectively a custom static frontend framework.

## Runtime Architecture

### 1. Entry

`index.html` loads:

1. `state/app-state.js`
2. all UI components
3. `events/bootapp.js`

The runtime starts on `DOMContentLoaded`, calls `loadCmsData()`, and then boots the app through `bootApp("#app")`.

### 2. Application Kernel

`events/bootapp.js` is the orchestration layer.

Responsibilities:

- build the root app shell
- create and register component instances
- hold route state, session state, and dashboard state adapters
- inject shared tools into components
- dispatch delegated DOM events into `component.next(message)`
- trigger re-render after state transitions
- synchronize route state with `hashchange` and `popstate`

### 3. Shared State

`state/app-state.js` is the domain/state foundation.

It contains:

- route registry in `ROUTES`
- seed catalog data in `properties`
- seed broker data in `brokers`
- seed dashboard collections in `dashboardContent`
- CMS loading and GitHub persistence helpers
- route parsing and UI helper functions
- dashboard collection schemas
- normalization, parsing, and summarization helpers

This file is both a state container and a domain utility module.

## Component Model

Each UI unit is a factory that returns an object exposing `next(message = {})`.

Canonical shape:

```js
const SomeComponent = ({ id, props }) => ({
  next(message = {}) {
    // handle message
    return { done: false, value: "<section>...</section>" };
  },
});
```

Properties of this model:

- render and event handling share the same entrypoint
- local component state can stay in closure variables
- cross-cutting behavior is injected through `props`
- the runtime remains responsible for app-wide concerns

## Event Model

The app uses delegated DOM events instead of per-component listeners.

Interactive nodes carry attributes such as:

- `data-cid`
- `data-message`
- `data-route`
- `data-property-id`
- `data-value`
- `data-name`

`bootApp` transforms DOM interaction into a message object and forwards it to the component instance addressed by `data-cid`.

Handled root events:

- `click`
- `change`
- `input`
- `submit`
- `hashchange`
- `popstate`

This is the main reason the app behaves like a framework despite being plain JavaScript.

## Routing

Routing is hash-based.

Known routes:

- `home`
- `destaques`
- `comprar`
- `imovel`
- `favoritos`
- `quiz`
- `imovel-novo`
- `imovel-editar`
- `anuncie`
- `login`
- `dashboard`
- `contato`

`parseRoute()` reads the hash and optional `propertyId` query parameter.

Protected behavior:

- `dashboard` requires an authenticated session flag
- unauthenticated access is redirected to `login`

## Main Feature Areas

### Public site

- top navigation in `components/topbar.js`
- hero and stats in `components/hero.js` and `components/stats.js`
- featured inventory in `components/featured.js`
- listing and filter/search experience in `components/listing.js`
- property detail and gallery in `components/detail.js`
- favorites in `components/favorites.js`
- lead capture flows in `components/announce.js`, `components/contact.js`, and `components/quiz.js`
- broker showcase in `components/brokers.js`
- footer and floating WhatsApp entry in `components/footer.js` and `components/floating-whats.js`

### Backoffice

- login gate in `components/login.js`
- dashboard shell in `components/dashboard/dashboard.js`
- overview widgets and preview cards in the dashboard subcomponents
- property editing workspace in `components/product-editor.js`

The dashboard supports editing collections such as:

- properties
- metrics
- activities
- leads
- clients
- appointments
- reports
- settings

## Data Model

Primary in-memory collections:

- `properties`
- `brokers`
- `dashboardContent`

`DASHBOARD_COLLECTION_SCHEMAS` defines editable collections and field metadata, which drives:

- normalization
- form generation
- item summaries
- CRUD-like dashboard presentation

This keeps the backoffice mostly schema-driven without introducing a server framework.

## Persistence and External Integration

### Local and remote CMS

The app reads CMS data from:

- `cms-imobiliaria/data/site.json` locally
- or the configured remote GitHub raw URL from `window.SuaImobiliariaCmsConfig`

Write path:

- `saveCmsDataToGitHub()` updates `data/site.json` in the CMS repository through the GitHub Contents API
- if authentication fails, the app falls back to `localStorage`

### Browser storage

Local browser state stores:

- favorites
- CMS snapshot cache

The compare set is session-memory only in the current implementation.

## Styling System

`tokens.css` provides design tokens.

`styles.css` carries the bulk of layout and visual implementation:

- topbar and hero presentation
- card systems
- dashboard layout
- editor surfaces
- utility treatments and responsive behavior

The CSS volume is high because the app is visually rich and built without a component-scoped styling system.

## PDF Utility

`gerar_proposta_pdf.py` is an auxiliary script separate from the SPA runtime.

Its role is to generate the proposal PDF assets tied to the commercial presentation flow.

## Current Architectural Strengths

- zero frontend build step for the main app
- explicit runtime with easy browser debugging
- simple deployment model
- reusable component contract
- lightweight CMS integration without requiring a dedicated backend

## Current Architectural Limits

- `state/app-state.js` is large and mixes data, schemas, utilities, and transport logic
- `styles.css` concentrates a large amount of visual logic in one file
- component rendering is string-based, so composability and static analysis are limited
- runtime coupling is intentionally high; the app is modular, but not independently packaged
- secrets/config values currently appear in frontend boot configuration and should be treated carefully

## Recommended Refactoring Order

1. Split `state/app-state.js` into `data`, `cms`, `schemas`, and `ui-helpers`.
2. Split `styles.css` by feature area or route.
3. Move dashboard schema helpers into a dedicated module.
4. Add a small build-time check or script for CMS schema integrity.
5. Externalize sensitive config so frontend tokens are not embedded in `index.html`.
