"use strict";
  const bootApp = (rootSelector = "#app") => {
    const root = document.querySelector(rootSelector) || document.body.appendChild(Object.assign(document.createElement("div"), { id: "app" }));
    root.classList.add("app-shell");

    const initialRoute = parseRoute();
    const routeState = {
      state: {
        route: initialRoute.route,
        selectedPropertyId: initialRoute.propertyId || properties[0]?.id || null,
      },
      current() {
        return this.state;
      },
      apply(message = {}) {
        if (message.type !== "route") return this.state;
        const nextRoute = ROUTES.includes(message.route) ? message.route : "home";
        this.state = {
          ...this.state,
          route: message.authenticated || nextRoute !== "dashboard" ? nextRoute : "login",
          selectedPropertyId: message.propertyId || this.state.selectedPropertyId || properties[0]?.id || null,
        };
        return this.state;
      },
      setRoute(route, options = {}) {
        return this.apply({
          type: "route",
          route,
          propertyId: options.propertyId,
          authenticated: options.authenticated,
        });
      },
    };

    const sessionState = {
      state: {
        favorites: new Set(JSON.parse(localStorage.getItem("suaimobiliaria:favorites") || "[]")),
        compare: new Set(),
        authenticated: false,
      },
      current() {
        return this.state;
      },
      apply(message = {}) {
        if (message.type === "toggleFavorite") {
          const favorites = new Set(this.state.favorites);
          if (favorites.has(message.propertyId)) favorites.delete(message.propertyId);
          else favorites.add(message.propertyId);
          localStorage.setItem("suaimobiliaria:favorites", JSON.stringify([...favorites]));
          this.state = { ...this.state, favorites };
          return this.state;
        }
        if (message.type === "toggleCompare") {
          const compare = new Set(this.state.compare);
          if (compare.has(message.propertyId)) compare.delete(message.propertyId);
          else compare.add(message.propertyId);
          this.state = { ...this.state, compare };
          return this.state;
        }
        if (message.type === "login") {
          this.state = { ...this.state, authenticated: true };
          return this.state;
        }
        if (message.type === "logout") {
          this.state = { ...this.state, authenticated: false };
          return this.state;
        }
        return this.state;
      },
    };

    const dashboardState = {
      state: dashboardContent,
      current() {
        return this.state;
      },
      addLead(lead) {
        this.state = {
          ...dashboardContent,
          leads: [lead, ...dashboardContent.leads],
          activities: [{ icon: "L", title: "Novo lead recebido", detail: lead.interest, time: "Agora", color: "var(--gold)" }, ...dashboardContent.activities],
        };
        dashboardContent = this.state;
        return this.state;
      },
    };

    const components = new Map();
    const add = (id, createComponent, props = {}) => {
      const component = createComponent({ id, props });
      if (!component || typeof component.next !== "function") throw new Error(`Component ${id} must expose next().`);
      components.set(id, component);
      return component;
    };
    const getRoute = () => routeState.current().route;
    const getSession = () => sessionState.current();
    const addLead = (lead) => dashboardState.addLead(lead);
    let requestRender = () => {};
    const persistCmsSnapshot = async (nextProperties = properties, nextDashboard = dashboardContent) => {
      return saveCmsDataToGitHub(CMS_GITHUB_TOKEN, { properties: nextProperties, brokers, dashboard: nextDashboard });
    };
    const saveProperty = async (draft, originalId = null) => {
      const normalized = normalizeDashboardItem("properties", draft);
      const nextProperties = properties.slice();
      const index = originalId ? nextProperties.findIndex((item) => item.id === originalId) : -1;
      if (index >= 0) nextProperties.splice(index, 1, normalized);
      else nextProperties.unshift(normalized);
      await persistCmsSnapshot(nextProperties, dashboardContent);
      properties = nextProperties;
      propsSync();
      return { property: normalized, message: "Produto salvo no GitHub." };
    };
    const deleteProperty = async (propertyId) => {
      const nextProperties = properties.filter((item) => item.id !== propertyId);
      if (nextProperties.length === properties.length) throw new Error("Produto nao encontrado.");
      await persistCmsSnapshot(nextProperties, dashboardContent);
      properties = nextProperties;
      propsSync();
      return { message: "Produto removido do GitHub." };
    };
    const propsSync = () => requestRender();
    const propertyTools = {
      isFavorite: (id) => getSession().favorites.has(id),
      isCompared: (id) => getSession().compare.has(id),
      toggleFavorite: (id) => sessionState.apply({ type: "toggleFavorite", propertyId: id }),
      toggleCompare: (id) => sessionState.apply({ type: "toggleCompare", propertyId: id }),
      getSelectedProperty: () => properties.find((property) => property.id === routeState.current().selectedPropertyId) || properties[0],
      addLead,
      saveProperty,
      deleteProperty,
      goToRoute: (route, options = {}) => setRoute(route, options),
    };
    const routeTools = { getRoute, getSession };

    add("topbar", TopbarComponent, routeTools);
    add("hero", HeroComponent, routeTools);
    add("stats", StatsComponent);
    add("featured", FeaturedComponent, propertyTools);
    add("announce", AnnounceComponent, { addLead });
    add("listing", ListingComponent, propertyTools);
    add("detail", DetailComponent, propertyTools);
    add("favorites", FavoritesComponent, propertyTools);
    add("quiz", QuizComponent, { addLead });
    add("editor", ProductEditorComponent, {
      getRoute,
      getSelectedProperty: () => properties.find((property) => property.id === routeState.current().selectedPropertyId) || null,
      saveProperty,
      deleteProperty,
      goToRoute: (route, options = {}) => setRoute(route, options),
      editorImage: () => properties[0]?.image || "",
    });
    add("brokers", BrokersComponent);
    add("dashboard", DashboardComponentStateful, {
      requestRender: () => requestRender(),
      goToRoute: (route, options = {}) => setRoute(route, options),
      deleteProperty,
    });
    add("login", LoginComponent, {
      login: (email, password) => {
        const ok = email === "admin@suaimobiliaria.com.br" && password === CMS_LOGIN_PASSWORD;
        if (ok) {
          sessionState.apply({ type: "login" });
          setRoute("dashboard");
        }
        return ok;
      },
    });
    add("contact", ContactComponent, { addLead });
    add("footer", FooterComponent);
    add("floating-whats", FloatingWhatsComponent);

    const renderComponent = (id) => {
      const result = components.get(id)?.next();
      return result?.value || "";
    };
    const panel = (route, html) => {
      const offset = route !== "home";
      return /*html*/`<div class="route-panel${offset ? " route-panel--offset" : ""}" data-route="${route}" ${routeAttrs(getRoute() === route)}>${html}</div>`;
    };
    const render = () => {
      const route = getRoute();
      root.classList.toggle("dashboard-mode", route === "dashboard");
      root.classList.toggle("editor-mode", route === "imovel-novo" || route === "imovel-editar");
      if (route === "dashboard" || route === "imovel-novo" || route === "imovel-editar") {
        root.innerHTML = /*html*/`${route === "dashboard" ? renderComponent("dashboard") : renderComponent("editor")}`;
        return;
      }
      root.innerHTML = /*html*/`
        ${renderComponent("topbar")}
        <main>
          ${panel("home", route === "home" ? `${renderComponent("hero")}${renderComponent("stats")}${renderComponent("featured")}${renderComponent("quiz")}${renderComponent("brokers")}` : "")}
          ${panel("destaques", route === "destaques" ? renderComponent("featured") : "")}
          ${panel("comprar", route === "comprar" ? renderComponent("listing") : "")}
          ${panel("imovel", route === "imovel" ? `${renderComponent("detail")}${renderComponent("brokers")}` : "")}
          ${panel("favoritos", route === "favoritos" ? renderComponent("favorites") : "")}
          ${panel("quiz", route === "quiz" ? renderComponent("quiz") : "")}
          ${panel("anuncie", route === "anuncie" ? renderComponent("quiz") : "")}
          ${panel("login", route === "login" ? renderComponent("login") : "")}
          ${panel("contato", route === "contato" ? renderComponent("contact") : "")}
        </main>
        ${renderComponent("footer")}
        ${renderComponent("floating-whats")}
      `;
    };
    requestRender = render;
    const setRoute = (route, options = {}) => {
      const nextRoute = ROUTES.includes(route) ? route : "home";
      const current = routeState.current();
      const propertyId = options.propertyId || routeState.current().selectedPropertyId || properties[0]?.id || null;
      const sameRoute = current.route === nextRoute && current.selectedPropertyId === propertyId;
      if (sameRoute && options.syncHash !== false) return;
      if (sameRoute) return;
      routeState.setRoute(nextRoute, { propertyId, authenticated: getSession().authenticated });
      if (options.syncHash !== false) {
        const nextHash = (nextRoute === "imovel" || nextRoute === "imovel-editar") && propertyId
          ? `#${nextRoute}#${encodeURIComponent(propertyId)}`
          : (brokerId && (nextRoute === "vendedores" || nextRoute === "brokers") ? `#${nextRoute}?brokerId=${encodeURIComponent(brokerId)}` : `#${nextRoute}${options.operation ? `?operation=${encodeURIComponent(options.operation)}` : ""}`);
        window.history.pushState({ route: nextRoute, propertyId, brokerId, operation: options.operation || null }, "", nextHash);
      }      render();
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
    const fieldsFrom = (form) => Object.fromEntries(new FormData(form).entries());
    const dispatch = async (target, event) => {
      const component = components.get(target.dataset.cid);
      if (!component) return;
      const isForm = target.tagName === "FORM";
      const message = {
        type: target.dataset.message,
        name: target.dataset.name || target.name,
        propertyId: target.dataset.propertyId,
        value: target.dataset.value ?? (target.isContentEditable ? target.textContent : target.value),
        checked: target.checked,
        fields: isForm ? fieldsFrom(target) : {},
        target,
        event,
      };
      try {
        const result = component.next(message);
        if (result?.then) await result;
      } catch (error) {
        console.error(`Action ${message.type} failed`, error);
      }
      if (message.type === "logout") {
        sessionState.apply({ type: "logout" });
        setRoute("login");
        return;
      }
      render();
    };

    root.addEventListener("click", (event) => {
      const routeTarget = event.target.closest("[data-route]");
      if (routeTarget) {
        event.preventDefault();
        setRoute(routeTarget.dataset.route, { propertyId: routeTarget.dataset.propertyId || undefined });
        return;
      }
      const actionTarget = event.target.closest("[data-cid][data-message]");
      if (actionTarget && actionTarget.tagName !== "FORM" && !actionTarget.isContentEditable && !(actionTarget.tagName === "INPUT" && actionTarget.type === "file")) void dispatch(actionTarget, event);
    });
    root.addEventListener("change", (event) => {
      const actionTarget = event.target.closest("[data-cid][data-message]");
      if (actionTarget) void dispatch(actionTarget, event);
    });
    root.addEventListener("input", (event) => {
      const actionTarget = event.target.closest("[data-cid][data-message]");
      if (actionTarget) void dispatch(actionTarget, event);
    });
    root.addEventListener("submit", (event) => {
      const actionTarget = event.target.closest("form[data-cid][data-message]");
      if (!actionTarget) return;
      event.preventDefault();
      void dispatch(actionTarget, event);
    });
    window.addEventListener("popstate", () => {
      const parsed = parseRoute();
      routeState.apply({ type: "route", route: parsed.route, propertyId: parsed.propertyId, authenticated: getSession().authenticated });
      render();
    });
    window.addEventListener("hashchange", () => {
      const parsed = parseRoute();
      if (parsed.route !== getRoute() || parsed.propertyId !== routeState.current().selectedPropertyId) {
        setRoute(parsed.route, { propertyId: parsed.propertyId, syncHash: false });
      }
    });
    if (getRoute() === "dashboard" && !getSession().authenticated) setRoute("login", { syncHash: false });
    else render();
    return { next: (message = {}) => (message.type === "render" ? render() : routeState.apply(message)), states: { routeState, sessionState, dashboardState } };
  };

  window.SuaImobiliariaApp = { bootApp };

  document.addEventListener("DOMContentLoaded", () => {
    loadCmsData()
      .catch((error) => {
        console.warn("CMS indisponivel, usando dados locais.", error);
      })
      .then(() => bootApp("#app"));
  });




