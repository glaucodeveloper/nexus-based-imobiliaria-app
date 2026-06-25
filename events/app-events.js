"use strict";
const bootApp = (rootSelector = "#app") => {
  const root =
    document.querySelector(rootSelector) ||
    document.body.appendChild(
      Object.assign(document.createElement("div"), { id: "app" }),
    );
  root.classList.add("app-shell");

  const initialRoute = parseRoute();
  const routeState = {
    state: {
      route: initialRoute.route,
      selectedPropertyId: initialRoute.propertyId || properties[0]?.id || null,
      selectedBrokerId: initialRoute.brokerId || null,
      dashboardTab: initialRoute.dashboardTab || "overview",
      selectedEntityId: initialRoute.entityId || null,
      operation: initialRoute.operation || "comprar",
    },
    current() {
      return this.state;
    },
    apply(message = {}) {
      if (message.type !== "route") return this.state;
      const nextRoute = ROUTES.includes(message.route) ? message.route : "home";
      this.state = {
        ...this.state,
        route:
          message.authenticated || nextRoute !== "dashboard"
            ? nextRoute
            : "login",
        selectedPropertyId:
          message.propertyId ||
          this.state.selectedPropertyId ||
          properties[0]?.id ||
          null,
        selectedBrokerId:
          message.brokerId !== undefined
            ? message.brokerId
            : this.state.selectedBrokerId,
        dashboardTab:
          message.dashboardTab || this.state.dashboardTab || "overview",
        selectedEntityId:
          message.entityId !== undefined
            ? message.entityId
            : this.state.selectedEntityId,
        operation: message.operation || this.state.operation || "comprar",
      };
      return this.state;
    },
    setRoute(route, options = {}) {
      return this.apply({
        type: "route",
        route,
        propertyId: options.propertyId,
        brokerId: options.brokerId,
        dashboardTab: options.dashboardTab,
        entityId: options.entityId,
        operation: options.operation,
        authenticated: options.authenticated,
      });
    },
  };

  const sessionState = {
    state: {
      favorites: new Set(
        JSON.parse(localStorage.getItem("suaimobiliaria:favorites") || "[]"),
      ),
      compare: new Set(),
      authenticated: false,
    },
    current() {
      return this.state;
    },
    apply(message = {}) {
      if (message.type === "toggleFavorite") {
        const favorites = new Set(this.state.favorites);
        if (favorites.has(message.propertyId))
          favorites.delete(message.propertyId);
        else favorites.add(message.propertyId);
        localStorage.setItem(
          "suaimobiliaria:favorites",
          JSON.stringify([...favorites]),
        );
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

  const featuredHoverState = {};

  const dashboardState = {
    state: dashboardContent,
    current() {
      return this.state;
    },
    addLead(lead) {
      this.state = {
        ...dashboardContent,
        leads: [lead, ...dashboardContent.leads],
        activities: [
          {
            icon: "L",
            title: "Novo lead recebido",
            detail: lead.interest,
            time: "Agora",
            color: "var(--gold)",
            properties: [],
            brokers: [],
            clients: [],
          },
          ...dashboardContent.activities,
        ],
      };
      dashboardContent = this.state;
      return this.state;
    },
  };

  const components = new Map();
  const add = (id, createComponent, props = {}) => {
    const component = createComponent({ id, props });
    if (!component || typeof component.next !== "function")
      throw new Error(`Component ${id} must expose next().`);
    components.set(id, component);
    return component;
  };
  const getRoute = () => routeState.current().route;
  const getSession = () => sessionState.current();
  const getSelectedBroker = () =>
    brokers.find(
      (broker) =>
        (broker.id || slugify(broker.name || broker.title || "")) ===
        routeState.current().selectedBrokerId,
    ) ||
    brokers[0] ||
    null;
  const addLead = (lead) => dashboardState.addLead(lead);
  let requestRender = () => {};
  const persistCmsSnapshot = async (
    nextProperties = properties,
    nextDashboard = dashboardContent,
    nextBrokers = brokers,
  ) => {
    return saveCmsDataToGitHub(CMS_GITHUB_TOKEN, {
      properties: nextProperties,
      brokers: nextBrokers,
      dashboard: nextDashboard,
    });
  };
  const saveDashboard = async (nextDashboard = dashboardContent) => {
    const normalizedDashboard = normalizeDashboardContent(nextDashboard);
    dashboardContent = normalizedDashboard;
    dashboardState.state = normalizedDashboard;
    await persistCmsSnapshot(properties, normalizedDashboard);
    propsSync();
    return { message: "Dashboard salvo no CMS." };
  };
  const saveProperty = async (draft, originalId = null) => {
    const normalized = normalizeDashboardItem("properties", draft);
    const nextProperties = properties.slice();
    const index = originalId
      ? nextProperties.findIndex((item) => item.id === originalId)
      : -1;
    if (index >= 0) nextProperties.splice(index, 1, normalized);
    else nextProperties.unshift(normalized);
    await persistCmsSnapshot(nextProperties, dashboardContent);
    properties = nextProperties;
    propsSync();
    return { property: normalized, message: "Produto salvo no GitHub." };
  };
  const deleteProperty = async (propertyId) => {
    const nextProperties = properties.filter((item) => item.id !== propertyId);
    if (nextProperties.length === properties.length)
      throw new Error("Produto nao encontrado.");
    await persistCmsSnapshot(nextProperties, dashboardContent);
    properties = nextProperties;
    propsSync();
    return { message: "Produto removido do GitHub." };
  };
  const saveBroker = async (draft, originalId = null) => {
    const normalized = {
      id:
        draft.id ||
        slugify(draft.name || draft.title || "vendedor") ||
        `vendedor-${Date.now()}`,
      name: draft.name || draft.title || "Vendedor",
      phone: draft.phone || "",
      photo: draft.photo || draft.image || "",
      creci: draft.creci || "",
      city: draft.city || "",
      specialty: draft.specialty || draft.role || "",
      bio: draft.bio || draft.note || "",
      performance: draft.performance || "",
      status: draft.status || "Ativo",
    };
    const nextBrokers = brokers.slice();
    const index = originalId
      ? nextBrokers.findIndex(
          (item) =>
            (item.id || slugify(item.name || item.title || "")) === originalId,
        )
      : -1;
    if (index >= 0) nextBrokers.splice(index, 1, normalized);
    else nextBrokers.unshift(normalized);
    await persistCmsSnapshot(properties, dashboardContent, nextBrokers);
    brokers = nextBrokers;
    propsSync();
    return { broker: normalized, message: "Vendedor salvo no GitHub." };
  };
  const deleteBroker = async (brokerId) => {
    const nextBrokers = brokers.filter(
      (item) =>
        (item.id || slugify(item.name || item.title || "")) !== brokerId,
    );
    if (nextBrokers.length === brokers.length)
      throw new Error("Vendedor nao encontrado.");
    await persistCmsSnapshot(properties, dashboardContent, nextBrokers);
    brokers = nextBrokers;
    propsSync();
    return { message: "Vendedor removido do GitHub." };
  };
  const propsSync = () => requestRender();
  const propertyTools = {
    getRouteInfo: () => routeState.current(),
    getFeaturedScrollState: () => featuredScrollState,
    isFavorite: (id) => getSession().favorites.has(id),
    isCompared: (id) => getSession().compare.has(id),
    toggleFavorite: (id) =>
      sessionState.apply({ type: "toggleFavorite", propertyId: id }),
    toggleCompare: (id) =>
      sessionState.apply({ type: "toggleCompare", propertyId: id }),
    clearCompare: () => sessionState.apply({ type: "clearCompare" }),
    getCompareSelection: () => [...getSession().compare],
    getSelectedProperty: () =>
      properties.find(
        (property) => property.id === routeState.current().selectedPropertyId,
      ) || properties[0],
    addLead,
    saveProperty,
    deleteProperty,
    goToRoute: (route, options = {}) => setRoute(route, options),
  };
  const routeTools = {
    getRoute,
    getSession,
    getSelectedBroker,
    getRouteInfo: () => routeState.current(),
    goToRoute: (route, options = {}) => setRoute(route, options),
  };

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
    getSelectedProperty: () =>
      properties.find(
        (property) => property.id === routeState.current().selectedPropertyId,
      ) || null,
    saveProperty,
    deleteProperty,
    goToRoute: (route, options = {}) => setRoute(route, options),
    editorImage: () => properties[0]?.image || "",
  });
  add("brokers", BrokersComponent, {
    ...routeTools,
    saveBroker,
    deleteBroker,
    requestRender: () => requestRender(),
    goToRoute: (route, options = {}) => setRoute(route, options),
  });
  add("dashboard", DashboardComponentStateful, {
    requestRender: () => requestRender(),
    goToRoute: (route, options = {}) => setRoute(route, options),
    deleteProperty,
    saveBroker,
    deleteBroker,
    getSession: () => getSession(),
    getRouteInfo: () => routeState.current(),
    saveDashboard,
    renderAbout: () => renderComponent("dashboard-about"),
    renderEditions: () => renderComponent("dashboard-editions"),
  });
  add("login", LoginComponent, {
    login: (email, password) => {
      const ok =
        email === "admin@suaimobiliaria.com.br" &&
        password === CMS_LOGIN_PASSWORD;
      if (ok) {
        sessionState.apply({ type: "login" });
        const currentTab = routeState.current().dashboardTab;
        setRoute("dashboard", {
          dashboardTab:
            currentTab && currentTab !== "overview" ? currentTab : undefined,
        });
      }
      return ok;
    },
  });
  add("contact", ContactComponent, { addLead });
  add("about", AboutComponent, { ...routeTools });
  add("dashboard-about", AboutComponent, {
    ...routeTools,
    requestRender: () => requestRender(),
    saveDashboard,
  });
  add("editions", DashboardEditionsComponent, {
    saveDashboard,
    requestRender: () => requestRender(),
  });
  add("dashboard-editions", DashboardEditionsComponent, {
    saveDashboard,
    requestRender: () => requestRender(),
  });
  add("financing", FinancingComponent, { addLead });
  add("footer", FooterComponent);
  add("floating-whats", FloatingWhatsComponent);

  const renderComponent = (id) => {
    const result = components.get(id)?.next();
    return result?.value || "";
  };
  const panel = (route, html) => {
    const offset = route !== "home";
    return /*html*/ `<div class="route-panel${offset ? " route-panel--offset" : ""}" ${routeAttrs(getRoute() === route)}>${html}</div>`;
  };
  const syncTopbarState = () => {
    const topbar = root.querySelector(".topbar");
    if (!topbar) return;
    const topbarHeight = topbar.getBoundingClientRect().height;
    const route = getRoute();
    const hero = route === "home" ? root.querySelector(".hero") : null;
    const heroScrollEnd = hero
      ? hero.offsetTop + hero.offsetHeight * 0.4 - topbarHeight
      : 64;
    const scrolledThreshold =
      route === "home" ? Math.max(64, heroScrollEnd) : 64;
    root.style.setProperty(
      "--toolbar-offset",
      `${Math.max(92, Math.round(topbarHeight + 28))}px`,
    );
    root.classList.toggle("is-scrolled", window.scrollY >= scrolledThreshold);
  };
  const render = () => {
    const route = getRoute();
    root.classList.toggle("dashboard-mode", route === "dashboard");
    root.classList.toggle(
      "editor-mode",
      route === "imovel-novo" || route === "imovel-editar",
    );
    root.classList.toggle("route-home", route === "home");
    if (
      route === "dashboard" ||
      route === "imovel-novo" ||
      route === "imovel-editar"
    ) {
      root.innerHTML = /*html*/ `${route === "dashboard" ? renderComponent("dashboard") : renderComponent("editor")}`;
      syncTopbarState();
      return;
    }
    root.innerHTML = /*html*/ `
        ${renderComponent("topbar")}
        <main>
          ${panel("home", route === "home" ? `${renderComponent("hero")}${renderComponent("stats")}${renderComponent("featured")}${renderComponent("quiz")}${renderComponent("brokers")}` : "")}
          ${panel("destaques", route === "destaques" ? renderComponent("featured") : "")}
          ${panel("comprar", route === "comprar" ? renderComponent("listing") : "")}
          ${panel("imovel", route === "imovel" ? `${renderComponent("detail")}${renderComponent("brokers")}` : "")}
          ${panel("vendedores", route === "vendedores" || route === "brokers" ? renderComponent("brokers") : "")}
          ${panel("favoritos", route === "favoritos" ? renderComponent("favorites") : "")}
          ${panel("quiz", route === "quiz" ? renderComponent("quiz") : "")}
          ${panel("anuncie", route === "anuncie" ? renderComponent("quiz") : "")}
          ${panel("login", route === "login" ? renderComponent("login") : "")}
          ${panel("contato", route === "contato" ? renderComponent("contact") : "")}
          ${panel("sobre", route === "sobre" ? renderComponent("about") : "")}
          ${panel("financiamento", route === "financiamento" ? renderComponent("financing") : "")}
        </main>
        ${renderComponent("footer")}
        ${renderComponent("floating-whats")}
      `;
    syncTopbarState();
  };
  requestRender = render;
  window.addEventListener("scroll", syncTopbarState, { passive: true });
  window.addEventListener("resize", syncTopbarState, { passive: true });
  const setRoute = (route, options = {}) => {
    const nextRoute = ROUTES.includes(route) ? route : "home";
    const current = routeState.current();
    const propertyId =
      options.propertyId ||
      routeState.current().selectedPropertyId ||
      properties[0]?.id ||
      null;
    const hasBrokerId = Object.prototype.hasOwnProperty.call(
      options,
      "brokerId",
    );
    const brokerId = hasBrokerId
      ? options.brokerId || null
      : routeState.current().selectedBrokerId || null;
    const sameRoute =
      current.route === nextRoute &&
      current.selectedPropertyId === propertyId &&
      current.selectedBrokerId === brokerId &&
      current.dashboardTab === options.dashboardTab &&
      current.selectedEntityId === options.entityId &&
      current.operation === options.operation;
    if (sameRoute && options.syncHash !== false) return;
    if (sameRoute) return;
    routeState.setRoute(nextRoute, {
      propertyId,
      brokerId,
      dashboardTab: options.dashboardTab,
      entityId: options.entityId,
      operation: options.operation,
      authenticated: getSession().authenticated,
    });
    if (nextRoute !== "destaques") {
      featuredForceClose();
    }
    if (options.syncHash !== false) {
      const query = new URLSearchParams();
      if (options.operation) query.set("operation", options.operation);
      if (brokerId && (nextRoute === "vendedores" || nextRoute === "brokers"))
        query.set("brokerId", brokerId);
      if (nextRoute === "dashboard") {
        if (options.dashboardTab) query.set("tab", options.dashboardTab);
        if (options.entityId) query.set("entityId", options.entityId);
      }
      const nextHash =
        (nextRoute === "imovel" || nextRoute === "imovel-editar") && propertyId
          ? `#${nextRoute}#${encodeURIComponent(propertyId)}`
          : `#${nextRoute}${query.toString() ? `?${query.toString()}` : ""}`;
      window.history.pushState(
        {
          route: nextRoute,
          propertyId,
          brokerId,
          dashboardTab: options.dashboardTab || null,
          entityId: options.entityId || null,
          operation: options.operation || null,
        },
        "",
        nextHash,
      );
    }
    render();
    syncTopbarState();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const fieldsFrom = (form) => {
    const result = {};
    for (const [key, value] of new FormData(form).entries()) {
      if (key in result) {
        if (Array.isArray(result[key])) result[key].push(value);
        else result[key] = [result[key], value];
      } else {
        result[key] = value;
      }
    }
    return result;
  };
  const dispatch = async (target, event) => {
    const component = components.get(target.dataset.cid);
    if (!component) return;
    const isForm = target.tagName === "FORM";
    const message = {
      type: target.dataset.message,
      name: target.dataset.name || target.name,
      direction: target.dataset.direction,
      propertyId: target.dataset.propertyId,
      value:
        target.dataset.value ??
        (target.isContentEditable ? target.textContent : target.value),
      checked: target.checked,
      fields: isForm ? fieldsFrom(target) : {},
      target,
      event,
    };
    const routeBefore = getRoute();
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
    if (getRoute() === routeBefore) {
      render();
      syncTopbarState();
    }
  };

  const featuredScrollState = {
    expandedPropertyId: null,
    expandedHeight: null,
    hoverTimerId: null,
    hoverPendingId: null,
    stageTimerId: null,
    expansionStage: null,
  };
  const featuredMeasureExpandedHeight = () => {
    const topbar = root.querySelector(".topbar");
    const topbarHeight = topbar?.getBoundingClientRect().height || 0;
    const viewportHeight = window.innerHeight || 900;
    return Math.max(
      420,
      Math.min(760, Math.round(viewportHeight - topbarHeight - 96)),
    );
  };
  const FEATURED_HOVER_ACTIVATION_DELAY = 520;
  const featuredClearTimers = () => {
    if (featuredScrollState.hoverTimerId)
      clearTimeout(featuredScrollState.hoverTimerId);
    if (featuredScrollState.stageTimerId)
      clearTimeout(featuredScrollState.stageTimerId);
    featuredScrollState.hoverTimerId = null;
    featuredScrollState.hoverPendingId = null;
    featuredScrollState.stageTimerId = null;
  };
  const featuredForceClose = ({ shouldRender = true } = {}) => {
    const hadState =
      featuredScrollState.expandedPropertyId ||
      featuredScrollState.hoverPendingId ||
      featuredScrollState.expansionStage;
    featuredClearTimers();
    featuredScrollState.expandedPropertyId = null;
    featuredScrollState.expandedHeight = null;
    featuredScrollState.expansionStage = null;
    if (!hadState || !shouldRender) return;
    render();
    syncTopbarState();
  };
  const featuredOpen = (propertyId) => {
    if (!propertyId || getRoute() !== "destaques") return;
    featuredClearTimers();
    featuredScrollState.expandedPropertyId = propertyId;
    featuredScrollState.expandedHeight = featuredMeasureExpandedHeight();
    featuredScrollState.expansionStage = "compact";
    render();
    syncTopbarState();
    featuredScrollState.stageTimerId = setTimeout(() => {
      if (featuredScrollState.expandedPropertyId !== propertyId) return;
      featuredScrollState.expansionStage = "expanded";
      featuredScrollState.stageTimerId = null;
      render();
      syncTopbarState();
      setTimeout(() => {
        if (featuredScrollState.expandedPropertyId !== propertyId) return;
        const expandedCard = root.querySelector(
          `.featured-showcase-card.is-expanded[data-property-id="${CSS.escape(propertyId)}"]`,
        );
        expandedCard?.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "nearest",
        });
      }, 160);
    }, 460);
  };
  const featuredScheduleOpen = (propertyId) => {
    if (!propertyId || getRoute() !== "destaques") return;
    if (
      featuredScrollState.expandedPropertyId ||
      featuredScrollState.hoverPendingId === propertyId
    )
      return;
    featuredClearTimers();
    featuredScrollState.hoverPendingId = propertyId;
    featuredScrollState.hoverTimerId = setTimeout(
      () => featuredOpen(propertyId),
      FEATURED_HOVER_ACTIVATION_DELAY,
    );
  };
  const featuredShouldCloseFromScrollIntent = (event) => {
    if (!featuredScrollState.expandedPropertyId)
      return Boolean(featuredScrollState.hoverPendingId);
    const expandedCard = root.querySelector(
      ".featured-showcase-card.is-expanded",
    );
    if (!expandedCard) return true;
    const rect = expandedCard.getBoundingClientRect();
    const point = event?.touches?.[0] || event;
    const y = typeof point?.clientY === "number" ? point.clientY : null;
    if (y === null) return false;
    const tolerance = Math.min(140, Math.max(72, rect.height * 0.16));
    return y <= rect.top + tolerance || y >= rect.bottom - tolerance;
  };
  const featuredCloseOnScrollIntent = (event) => {
    if (getRoute() !== "destaques") return;
    if (!featuredShouldCloseFromScrollIntent(event)) return;
    featuredForceClose();
  };
  window.addEventListener("wheel", featuredCloseOnScrollIntent, {
    passive: true,
  });
  window.addEventListener("touchmove", featuredCloseOnScrollIntent, {
    passive: true,
  });
  root.addEventListener("pointerover", (event) => {
    const galleryTarget = event.target.closest(
      ".gallery-main[data-cid='detail'][data-message='openGallery']",
    );
    if (galleryTarget) {
      void dispatch(galleryTarget, event);
      return;
    }
    if (getRoute() !== "destaques") return;
    const card = event.target.closest(
      ".featured-showcase-card[data-property-id]",
    );
    if (!card) return;
    if (card.contains(event.relatedTarget)) return;
    featuredScheduleOpen(card.dataset.propertyId);
  });
  root.addEventListener("pointerout", (event) => {
    if (getRoute() !== "destaques") return;
    const grid = event.target.closest(".featured-showcase-grid");
    if (!grid || grid.contains(event.relatedTarget)) return;
    featuredForceClose();
  });
  root.addEventListener("click", (event) => {
    const routeTarget = event.target.closest("[data-route]");
    if (routeTarget) {
      event.preventDefault();
      setRoute(routeTarget.dataset.route, {
        propertyId: routeTarget.dataset.propertyId || undefined,
        brokerId: routeTarget.dataset.brokerId || undefined,
        dashboardTab: routeTarget.dataset.dashboardTab || undefined,
        entityId: routeTarget.dataset.entityId || undefined,
        operation: routeTarget.dataset.operation || undefined,
      });
      return;
    }
    const actionTarget = event.target.closest("[data-cid][data-message]");
    if (
      actionTarget &&
      actionTarget.tagName !== "FORM" &&
      !actionTarget.isContentEditable &&
      !(actionTarget.tagName === "INPUT" && actionTarget.type === "file")
    )
      void dispatch(actionTarget, event);
  });
  root.addEventListener("input", (event) => {
    const actionTarget = event.target.closest("[data-cid][data-message]");
    if (actionTarget) void dispatch(actionTarget, event);
  });
  root.addEventListener("change", (event) => {
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
    routeState.apply({
      type: "route",
      route: parsed.route,
      propertyId: parsed.propertyId,
      brokerId: parsed.brokerId || null,
      dashboardTab: parsed.dashboardTab || null,
      entityId: parsed.entityId || null,
      operation: parsed.operation || null,
      authenticated: getSession().authenticated,
    });
    render();
  });
  window.addEventListener("hashchange", () => {
    const parsed = parseRoute();
    if (
      parsed.route !== getRoute() ||
      parsed.propertyId !== routeState.current().selectedPropertyId ||
      parsed.brokerId !== routeState.current().selectedBrokerId ||
      parsed.dashboardTab !== routeState.current().dashboardTab ||
      parsed.entityId !== routeState.current().selectedEntityId ||
      parsed.operation !== routeState.current().operation
    ) {
      setRoute(parsed.route, {
        propertyId: parsed.propertyId,
        brokerId: parsed.brokerId || null,
        dashboardTab: parsed.dashboardTab || null,
        entityId: parsed.entityId || null,
        operation: parsed.operation || null,
        syncHash: false,
      });
    }
  });
  if (getRoute() === "dashboard" && !getSession().authenticated) {
    routeState.apply({
      type: "route",
      route: "login",
      propertyId: null,
      brokerId: null,
      dashboardTab: null,
      entityId: null,
      operation: null,
      authenticated: false,
    });
    window.history.replaceState({ route: "login" }, "", "#login");
    render();
  } else render();
  return {
    next: (message = {}) =>
      message.type === "render" ? render() : routeState.apply(message),
    states: { routeState, sessionState, dashboardState },
  };
};

window.SuaImobiliariaApp = { bootApp };

document.addEventListener("DOMContentLoaded", () => {
  loadCmsData()
    .catch((error) => {
      console.warn("CMS indisponivel, usando dados locais.", error);
    })
    .then(() => bootApp("#app"));
});
