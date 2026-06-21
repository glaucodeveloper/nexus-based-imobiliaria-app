# SuaImobiliaria Design Loop

## 1. Purpose
SPA imobiliaria com rotas por hash, foco em compra, detalhe, favoritos, quiz, captacao e dashboard interno.

## 2. Reference
Fonte visual principal: `proposta.png`.

## 3. Core Constraint
Nao remover funcionalidades existentes.
Preservar CRUD, login, dashboard, CMS GitHub/localStorage e arquitetura de componentes JS com `next()`.

## 4. Sitemap
- [x] `#home` - landing com hero e destaques
- [x] `#comprar` - listagem com filtros, ordenacao e comparacao
- [x] `#imovel?propertyId=...` - detalhe do imovel
- [x] `#favoritos` - colecao salva pelo usuario
- [x] `#quiz` - fluxo guiado de descoberta
- [x] `#anuncie` - captacao de proprietarios
- [x] `#contato` - ponto de contato
- [x] `#login` - acesso interno
- [x] `#dashboard` - painel operacional
- [x] `#imovel-novo` e `#imovel-editar?propertyId=...` - CRUD visual

## 5. Roadmap
- [ ] Refinar `#comprar` no nivel de detalhe: alinhamento fino da coluna de filtros, densidade textual e estados responsivos
- [ ] Aproximar `#imovel` do bloco lateral fixo e da galeria da proposta
- [ ] Refinar `#dashboard` visualmente para coincidir com o mockup sem alterar fluxos, validando tambem o estado autenticado
- [ ] Revisar estados mobile das rotas publicas

## 6. Notes
- O runtime ativo entra por `index.html` + `events/app-events.js`.
- A navegacao principal deve sempre funcionar por URL direta `http://127.0.0.1:5500/#rota`.
- Capturas recentes confirmam melhora clara em `#home` e `#comprar`: topbar menos comprimida, toggles da toolbar legiveis e cards da listagem ocupando a largura correta.
