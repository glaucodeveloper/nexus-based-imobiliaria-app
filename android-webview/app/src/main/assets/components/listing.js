const ListingComponent = ({ props }) => {
  let viewMode = "grid";
  let page = 1;
  let sortBy = "recentes";
  const pageSize = 4;
  const filters = {
    kinds: new Set(),
    city: "Todos",
    neighborhood: "Todos",
    maxPrice: 2500000,
    bedrooms: "Qualquer",
    suites: "Qualquer",
    parking: "Qualquer",
    minArea: "Qualquer",
    features: new Set(),
  };

  const routeInfo = props.getRouteInfo?.() || {};
  const operation = routeInfo.operation || "comprar";

  const compareFields = [
    {
      key: "priceNumber",
      label: "Preco",
      render: (property) => property.price,
    },
    { key: "area", label: "Area", render: (property) => `${property.area}m2` },
    {
      key: "bedrooms",
      label: "Quartos",
      render: (property) => `${property.bedrooms}`,
    },
    {
      key: "suites",
      label: "Suites",
      render: (property) => `${property.suites}`,
    },
    {
      key: "bathrooms",
      label: "Banheiros",
      render: (property) => `${property.bathrooms}`,
    },
    {
      key: "parking",
      label: "Vagas",
      render: (property) => `${property.parking}`,
    },
    { key: "city", label: "Cidade", render: (property) => property.cityName },
  ];

  const filterProperties = () => {
    const filtered = properties.filter((property) => {
      const minBedrooms =
        filters.bedrooms === "Qualquer"
          ? 0
          : Number(filters.bedrooms.replace("+", ""));
      const minSuites =
        filters.suites === "Qualquer"
          ? 0
          : Number(filters.suites.replace("+", ""));
      const minParking =
        filters.parking === "Qualquer"
          ? 0
          : Number(filters.parking.replace("+", ""));
      const minArea =
        filters.minArea === "Qualquer" ? 0 : Number(filters.minArea);
      const features = propertyFeatures(property);
      return (
        (filters.kinds.size === 0 || filters.kinds.has(property.kind)) &&
        (filters.city === "Todos" || property.cityName === filters.city) &&
        (filters.neighborhood === "Todos" ||
          property.neighborhood === filters.neighborhood) &&
        property.priceNumber <= Number(filters.maxPrice) &&
        (minBedrooms === 0 || property.bedrooms >= minBedrooms) &&
        (minSuites === 0 || property.suites >= minSuites) &&
        (minParking === 0 || property.parking >= minParking) &&
        (minArea === 0 || property.area >= minArea) &&
        (filters.features.size === 0 ||
          [...filters.features].every((feature) =>
            features.has(feature.toLowerCase()),
          )) &&
        (operation === "comprar" || !property.operation || property.operation === operation || String(property.type || "").toLowerCase().includes(operation === "alugar" ? "alug" : "vend"))
      );
    });
    return [...filtered].sort((a, b) => {
      if (sortBy === "menor-preco") return a.priceNumber - b.priceNumber;
      if (sortBy === "maior-preco") return b.priceNumber - a.priceNumber;
      if (sortBy === "maior-area") return b.area - a.area;
      return properties.indexOf(a) - properties.indexOf(b);
    });
  };

  const resetFilters = () => {
    filters.kinds.clear();
    filters.features.clear();
    filters.city = "Todos";
    filters.neighborhood = "Todos";
    filters.maxPrice = 2500000;
    filters.bedrooms = "Qualquer";
    filters.suites = "Qualquer";
    filters.parking = "Qualquer";
    filters.minArea = "Qualquer";
    sortBy = "recentes";
    page = 1;
  };

  const syncUrl = () => {
    const params = new URLSearchParams();
    if (filters.kinds.size) params.set("tipo", [...filters.kinds].join(","));
    if (filters.city !== "Todos") params.set("cidade", filters.city);
    if (filters.neighborhood !== "Todos")
      params.set("bairro", filters.neighborhood);
    if (Number(filters.maxPrice) < 2500000)
      params.set("preco", filters.maxPrice);
    if (filters.bedrooms !== "Qualquer")
      params.set("quartos", filters.bedrooms);
    if (filters.suites !== "Qualquer") params.set("suites", filters.suites);
    if (filters.parking !== "Qualquer") params.set("vagas", filters.parking);
    if (filters.minArea !== "Qualquer") params.set("area", filters.minArea);
    if (filters.features.size)
      params.set("caracteristicas", [...filters.features].join(","));
    if (operation !== "comprar") params.set("operation", operation);
    if (sortBy !== "recentes") params.set("ordem", sortBy);
    if (page > 1) params.set("pagina", String(page));
    const query = params.toString();
    window.history.replaceState(
      { route: "comprar" },
      "",
      `#comprar${query ? `?${query}` : ""}`,
    );
  };

  const compareDifferenceCount = (baseline, property) =>
    compareFields.reduce((count, field) => {
      const baselineValue =
        field.key === "city" ? baseline.cityName : baseline[field.key];
      const propertyValue =
        field.key === "city" ? property.cityName : property[field.key];
      return count + (String(baselineValue) === String(propertyValue) ? 0 : 1);
    }, 0);

  const compareItems = () =>
    (props.getCompareSelection?.() || [])
      .map((propertyId) =>
        properties.find((property) => property.id === propertyId),
      )
      .filter(Boolean);

  const renderCompareDock = (items) => {
    if (items.length < 2) return "";
    const baseline = items[0];
    return /*html*/ `
      <div class="compare-dock" role="complementary" aria-label="Comparacao ativa">
        <div class="compare-dock-head">
          <div>
            <span class="eyebrow">Comparador ativo</span>
            <h3>${items.length} imoveis selecionados</h3>
          </div>
          <button class="ghost-btn" type="button" data-cid="listing" data-message="clearCompare">Limpar comparacao</button>
        </div>
        <div class="compare-track">
          ${items
            .map((property, index) => {
              const diffCount =
                index === 0 ? 0 : compareDifferenceCount(baseline, property);
              return /*html*/ `
              <article class="compare-column ${index === 0 ? "is-baseline" : ""}">
                <span class="compare-rank">${index === 0 ? "Base" : `#${index + 1}`}</span>
                <strong>${property.title}</strong>
                <div class="compare-delta">${index === 0 ? "Referencia" : `${diffCount} diferencas`}</div>
                <div class="compare-specs">
                  ${compareFields.map((field) => `<span><label>${field.label}</label><b>${field.render(property)}</b></span>`).join("")}
                </div>
              </article>
            `;
            })
            .join("")}
        </div>
      </div>
    `;
  };

  return {
    next(message = {}) {
      if (message.type === "toggleFavorite")
        props.toggleFavorite(message.propertyId);
      if (message.type === "toggleCompare")
        props.toggleCompare(message.propertyId);
      if (message.type === "clearCompare") props.clearCompare?.();
      if (message.type === "setView") viewMode = message.value || viewMode;
      if (message.type === "sort") {
        sortBy = message.value || sortBy;
        page = 1;
      }
      if (message.type === "filter") {
        if (message.name === "kind") {
          if (message.checked) filters.kinds.add(message.value);
          else filters.kinds.delete(message.value);
        } else if (message.name === "feature") {
          if (message.checked) filters.features.add(message.value);
          else filters.features.delete(message.value);
        } else if (message.name in filters) {
          filters[message.name] = message.value;
          if (message.name === "city") filters.neighborhood = "Todos";
        }
        page = 1;
      }
      if (message.type === "clearFilters") resetFilters();
      if (message.type === "setPage") page = Number(message.value) || 1;

      const filtered = filterProperties();
      const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
      page = Math.min(Math.max(page, 1), totalPages);
      syncUrl();
      const visibleProperties = filtered.slice(
        (page - 1) * pageSize,
        page * pageSize,
      );
      const neighborhoods = [
        "Todos",
        ...new Set(
          properties
            .filter(
              (property) =>
                filters.city === "Todos" || property.cityName === filters.city,
            )
            .map((property) => property.neighborhood),
        ),
      ];
      const compareSelection = compareItems();
      const renderPropertyCard = (property) =>
        PropertyCardComponent({
          props: {
            property,
            tools: {
              componentId: "listing",
              isFavorite: props.isFavorite,
              isCompared: props.isCompared,
            },
          },
        }).next().value;
      const renderListCard = (property) =>
        ListCardComponent({
          props: {
            property,
            tools: {
              componentId: "listing",
              isFavorite: props.isFavorite,
              isCompared: props.isCompared,
            },
          },
        }).next().value;
      const pager = Array.from({ length: totalPages }, (_, index) => index + 1)
        .map(
          (item) =>
            `<button class="${item === page ? "active" : ""}" type="button" data-cid="listing" data-message="setPage" data-value="${item}">${item}</button>`,
        )
        .join("");

      return {
        done: false,
        value: /*html*/ `
          <section id="comprar" class="section listing-section">
            <div class="container">
              <div class="breadcrumb-row"><span>Home</span><span>Comprar</span></div>
              <div class="section-title">
                <div><span class="eyebrow">${operation === "alugar" ? "Alugar / Buscar" : "Comprar / Alugar / Buscar"}</span><h2>${operation === "alugar" ? "Imoveis para aluguel" : "Imoveis a venda"}</h2><p>Encontramos ${filtered.length} imoveis. ${operation === "alugar" ? "A tela entrou no modo aluguel. Use os filtros para refinar a busca." : "Clique no card para selecionar comparacao e no titulo para abrir o detalhe."}</p></div>
              </div>
              <div class="listing-layout">
                <aside class="filter-box" aria-label="Filtros">
                  <div class="filter-head"><strong>Filtros</strong><button type="button" data-cid="listing" data-message="clearFilters">Limpar filtros</button></div>
                  <div class="filter-stack">
                    <div class="mini-field"><label id="tipo-filter-title">Tipo</label><div class="check-list">${["Casa", "Apartamento", "Terreno", "Cobertura", "Sala comercial"].map((kind) => /*html*/ `<label>${kind}<input type="checkbox" data-cid="listing" data-message="filter" data-name="kind" value="${kind}" ${filters.kinds.has(kind) ? "checked" : ""}></label>`).join("")}</div></div>
                    <div class="mini-field"><label>Cidade</label><select data-cid="listing" data-message="filter" data-name="city">${["Todos", ...new Set(properties.map((property) => property.cityName))].map((city) => option(city, filters.city)).join("")}</select></div>
                    <div class="mini-field"><label>Bairro</label><select data-cid="listing" data-message="filter" data-name="neighborhood">${neighborhoods.map((item) => option(item, filters.neighborhood)).join("")}</select></div>
                    <div class="mini-field"><label>Preco maximo: R$ ${money(filters.maxPrice)}</label><input type="range" min="290000" max="2500000" step="50000" value="${filters.maxPrice}" data-cid="listing" data-message="filter" data-name="maxPrice"></div>
                    <div class="mini-field"><label>Quartos</label><select data-cid="listing" data-message="filter" data-name="bedrooms">${["Qualquer", "1+", "2+", "3+", "4+"].map((value) => option(value, filters.bedrooms)).join("")}</select></div>
                    <div class="mini-field"><label>Suites</label><select data-cid="listing" data-message="filter" data-name="suites">${["Qualquer", "1+", "2+"].map((value) => option(value, filters.suites)).join("")}</select></div>
                    <div class="mini-field"><label>Vagas</label><select data-cid="listing" data-message="filter" data-name="parking">${["Qualquer", "1+", "2+", "3+"].map((value) => option(value, filters.parking)).join("")}</select></div>
                    <div class="mini-field"><label>Area minima</label><select data-cid="listing" data-message="filter" data-name="minArea">${["Qualquer", "50", "100", "200", "400"].map((value) => option(value, filters.minArea, value === "Qualquer" ? value : `${value}m2`)).join("")}</select></div>
                    <div class="mini-field"><label>Caracteristicas</label><div class="check-list">${["vista mar", "praia", "condominio", "comercial"].map((feature) => /*html*/ `<label>${feature}<input type="checkbox" data-cid="listing" data-message="filter" data-name="feature" value="${feature}" ${filters.features.has(feature) ? "checked" : ""}></label>`).join("")}</div></div>
                  </div>
                </aside>
                <div>
                  <div class="list-toolbar">
                    <strong>Pagina ${page} de ${totalPages}</strong>
                    <label class="mini-field sort-field"><span>Ordenar por</span><select data-cid="listing" data-message="sort">${[
                      ["recentes", "Mais recentes"],
                      ["menor-preco", "Menor preco"],
                      ["maior-preco", "Maior preco"],
                      ["maior-area", "Maior area"],
                    ]
                      .map(([value, label]) => option(value, sortBy, label))
                      .join("")}</select></label>
                    <div class="view-toggle">
                      <button class="square-btn ${viewMode === "grid" ? "active" : ""}" type="button" data-cid="listing" data-message="setView" data-value="grid" aria-label="Modo grade" title="Modo grade"><span class="view-icon" aria-hidden="true">&#9638;</span></button>
                      <button class="square-btn ${viewMode === "list" ? "active" : ""}" type="button" data-cid="listing" data-message="setView" data-value="list" aria-label="Modo lista" title="Modo lista"><span class="view-icon" aria-hidden="true">&#9776;</span></button>
                    </div>
                  </div>
                  <div class="results-meta-strip">
                    <span>${filtered.length} resultados</span>
                    <span>${compareSelection.length} em comparacao</span>
                  </div>
                  <div class="${viewMode === "grid" ? "property-grid listing-grid" : "list-stack"}">
                    ${visibleProperties.length ? visibleProperties.map((property) => (viewMode === "grid" ? renderPropertyCard(property) : renderListCard(property))).join("") : `<article class="list-card empty-list-card"><div class="list-info"><h3>Nenhum imovel encontrado</h3><div class="location">Tente limpar filtros.</div></div></article>`}
                  </div>
                  <div class="pager"><button type="button" data-cid="listing" data-message="setPage" data-value="${page - 1}" ${page === 1 ? "disabled" : ""}>&#8249;</button>${pager}<button type="button" data-cid="listing" data-message="setPage" data-value="${page + 1}" ${page === totalPages ? "disabled" : ""}>&#8250;</button></div>
                  ${compareSelection.length >= 2 ? renderCompareDock(compareSelection) : `<p class="route-note compare-note">Clique nos cards para comparar. O titulo abre o detalhe.</p>`}
                </div>
              </div>
            </div>
          </section>
        `,
      };
    },
  };
};
