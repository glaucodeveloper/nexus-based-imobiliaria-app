const TopbarComponent = ({ props }) => {
  let mobileMenuOpen = false;
  let lastRoute = null;

  return {
    next(message = {}) {
      if (message.type === "toggleMobileMenu") mobileMenuOpen = !mobileMenuOpen;

      const route = props.getRoute();
      if (lastRoute && lastRoute !== route) mobileMenuOpen = false;
      lastRoute = route;

      const routeInfo = props.getRouteInfo?.() || {};
      const session = props.getSession();
      const favoritesCount = session.favorites?.size || 0;
      const operation = routeInfo.operation === "alugar" ? "alugar" : "comprar";
      const pageTitleMap = {
        home: "Início",
        destaques: "Destaques",
        comprar: operation === "alugar" ? "Alugar" : "Comprar",
        imovel: "Imóvel",
        favoritos: "Favoritos",
        quiz: "Quiz",
        anuncie: "Anuncie",
        login: "Acesso",
        dashboard: "Dashboard",
        contato: "Contato",
        sobre: "Sobre",
        financiamento: "Financiamento",
        vendedores: "Vendedores",
        brokers: "Vendedores",
      };
      const pageSubtitleMap = {
        home: "Curadoria premium e busca rápida",
        destaques: "Lançamentos e oportunidades em destaque",
        comprar:
          operation === "alugar" ? "Busca para locação" : "Busca para compra",
        imovel: "Detalhes do produto",
        favoritos: "Seleção salva pelo usuário",
        quiz: "Perfil de preferência e recomendação",
        anuncie: "Captação e conversão",
        login: "Acesso ao painel",
        dashboard: "Gestão comercial",
        contato: "Fale com a imobiliária",
        sobre: "Conheça a equipe e o processo",
        financiamento: "Simulação e apoio financeiro",
        vendedores: "Base comercial e atendimento",
        brokers: "Base comercial e atendimento",
      };
      const pageTitle = pageTitleMap[route] || "Página";
      const pageSubtitle = pageSubtitleMap[route] || "";
      const navLinks = [
        { route: "home", label: "Início" },
        { route: "comprar", label: "Comprar" },
        {
          route: "comprar",
          label: "Alugar",
          operation: "alugar",
          active: route === "comprar" && operation === "alugar",
        },
        { route: "destaques", label: "Lançamentos" },
        { route: "anuncie", label: "Anuncie" },
        { route: "favoritos", label: "Favoritos" },
        { route: "quiz", label: "Quiz" },
        { route: "contato", label: "Contato" },
      ];
      const renderSearchPanel = () => /*html*/ `
        <div class="search-panel topbar-search-panel" role="search" aria-label="Pesquisa principal">
          <div class="tabs topbar-search-tabs">
            <button class="tab ${operation === "comprar" ? "active" : ""}" type="button" data-cid="hero" data-message="setTab" data-value="comprar">Comprar</button>
            <button class="tab ${operation === "alugar" ? "active" : ""}" type="button" data-cid="hero" data-message="setTab" data-value="alugar">Alugar</button>
          </div>
          <div class="search-grid topbar-search-grid">
            <label class="field"><span>Localizacao</span><input name="quickLocation" placeholder="Cidade, bairro ou condominio"></label>
            <label class="field"><span>Tipo de imovel</span><select><option>Todos</option><option>Casa</option><option>Apartamento</option><option>Terreno</option></select></label>
            <label class="field"><span>Faixa de preco</span><select><option>Qualquer preco</option><option>Ate R$ 700 mil</option><option>Acima de R$ 1 mi</option></select></label>
            <button class="gold-btn topbar-search-btn" type="button" data-route="comprar" data-operation="${operation}">${operation === "alugar" ? "Buscar para alugar" : "Buscar para comprar"}</button>
          </div>
        </div>
      `;

      return {
        done: false,
        value: /*html*/ `
          <header class="topbar ${mobileMenuOpen ? "topbar--mobile-open" : ""}">
            <div class="topbar-title-slot container">
              <span class="eyebrow">${route === "dashboard" ? "Area interna" : "Navegacao"}</span>
              <h1>${pageTitle}</h1>
              <p>${pageSubtitle}</p>
            </div>
            <div class="topbar-brand-slot container">
              <a class="${active(route, "home")} topbar-brand" href="#home" data-route="home">${window.LOGO_SVG}</a>
              <button class="topbar-burger" type="button" data-cid="topbar" data-message="toggleMobileMenu" aria-label="${mobileMenuOpen ? "Fechar menu" : "Abrir menu"}" aria-expanded="${mobileMenuOpen ? "true" : "false"}" aria-controls="topbar-navigation">
                <span class="topbar-burger-logo" aria-hidden="true">${window.LOGO_SVG}</span>
              </button>
              <nav id="topbar-navigation" class="topbar-nav" aria-label="Navegação principal">
                ${navLinks
                  .map((item) => {
                    const isActive = item.active ?? active(route, item.route);
                    const href = item.operation
                      ? `#${item.route}?operation=${encodeURIComponent(item.operation)}`
                      : `#${item.route}`;
                    const operationAttr = item.operation
                      ? ` data-operation="${item.operation}"`
                      : item.route === "comprar"
                        ? ` data-operation="${operation}"`
                        : "";
                    return `<a class="${isActive}" href="${href}" data-route="${item.route}"${operationAttr}>${item.label}</a>`;
                  })
                  .join("")}
              </nav>
            </div>
            <div class="topbar-tools container">
              <a class="icon-btn" href="#comprar" data-route="comprar" data-operation="${operation}" aria-label="Buscar">
                <span>&#128269;</span>
              </a>
              <a class="icon-btn ${active(route, "favoritos")}" href="#favoritos" data-route="favoritos" aria-label="Favoritos">
                <span>${favoriteMark(favoritesCount > 0)}</span>
                ${favoritesCount ? `<small>${favoritesCount}</small>` : ""}
              </a>
              <a class="icon-btn ${active(route, session.authenticated ? "dashboard" : "login")}" href="#${session.authenticated ? "dashboard" : "login"}" data-route="${session.authenticated ? "dashboard" : "login"}" aria-label="Conta">
                <span>${session.authenticated ? "&#9786;" : "&#9675;"}</span>
              </a>
              <a class="pill-btn" href="#contato" data-route="contato">Fale conosco</a>
            </div>
            <div class="topbar-shell container">
              <div class="topbar-search-shell">
                ${renderSearchPanel()}
              </div>
            </div>
          </header>
        `,
      };
    },
  };
};
