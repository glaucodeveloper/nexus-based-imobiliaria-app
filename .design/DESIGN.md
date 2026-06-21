# Design System

## Direction
Visual premium imobiliario, editorial e quente, inspirado em `proposta.png` e agora codificado em `tokens.css`.

## Principles
- Contraste entre superfícies claras quentes e shells escuros sofisticados.
- Tipografia editorial no display e sans limpa no corpo.
- Cards com bordas suaves, sombra mais profunda e hierarquia de superfície clara.
- Densidade maior em listagem, detalhe e dashboard, evitando aparência genérica de landing page.

## Colors
- `--tone-sand-*`: base clara e quente
- `--tone-clay-*`: acento principal
- `--tone-forest-*`: fundos escuros premium
- `--tone-ink-*`: texto e muteds

## Components
- Topbar fixa com glass dark premium e sublinhado sutil ativo
- Hero cinematográfico com search panel pesado
- Listagem com sidebar densa e cards mais editoriais
- Detalhe com galeria hero e painel comercial mais forte
- Dashboard com shell escuro + workspace claro bem separado

## Technical Constraint
Sem framework frontend.
Manter componentes JS baseados em `next()`, tokens em CSS custom properties e sem remover fluxos existentes.
