# Execution Memory

## Goal
- Website imobiliário "Mezanino Imobiliária" — SPA client-side com CMS auxiliar para catálogo e operação.

## Architecture

### Type
- Monolito HTML/CSS/JS puro, sem bundle, sem framework
- Roteamento hash-based (`#home`, `#comprar`, `#imovel/alphaville`, etc.)
- Dados embutidos em `state/app-state.js` + fonte remota `cms-imobiliaria/data/site.json` via GitHub raw URL

### Key Files
- `state/app-state.js`: estado global — propriedades, corretores, leads, sessão, rotas
- `events/app-events.js`: boot, roteamento, sessão, favoritos, rendering
- `components/dashboard/dashboard-collection-card.js`: render de todas as tabs do dashboard
- `components/dashboard/dashboard.js`: componente principal do dashboard
- `components/dashboard/dashboard-editions.js`: editor de seções do site (novo)
- `components/brokers.js`: listagem + detalhe de corretores

## Changes This Session

### Agendamentos remodelados
- Schema: `date`, `time`, `status`, `notes` + arrays `properties[]`, `clients[]`, `brokers[]`
- Formulário dedicado `renderAppointmentForm()`: selects checkbox de imoveis, vendedores, clientes
- `fieldsFrom()` corrigido para suportar múltiplos valores com mesmo name (checkboxes)
- `saveItem` de appointments: lê arrays de checkboxes, converte para arrays
- Calendário e painel lateral mostram entity-link-cards (foto + nome, link para página)

### Atividades como accordion com cards
- `renderActivities()` reescrito: accordion `<details>` com entity-link-cards por grupo
- Grupos: Imoveis, Vendedores, Clientes — cada card é `<a>` com `data-route` para a página da entidade
- `renderActivityEntityCard()`com foto, nome e sub-info (cidade/CRECI/perfil)
- Dados de activities no app-state incluem `properties[]`, `brokers[]`, `clients[]`

### Compatibilidade
- `brokers.js` e `dashboard-collection-card.js` fazem fallback para `item.broker`/`item.client` antigos
- `summarizeItem("appointments")` lê arrays com fallback
- `addLead` cria atividades com `properties:[], brokers:[], clients:[]`

### CSS adicionado
- `.entity-link-card`, `.entity-link-card-icon`, `.entity-link-card-info`
- `.activity-entity-sections`, `.activity-entity-group`, `.activity-entity-label`, `.activity-entity-cards`
- `.appointment-entity-section`, `.appointment-entity-grid`, `.appointment-check`
- `.appointment-entity-cards`

## Resume Next
- Continuar qualquer funcionalidade ou melhoria solicitada
