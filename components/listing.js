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

    const filterProperties = () => {
      const filtered = properties.filter((property) => {
        const minBedrooms = filters.bedrooms === "Qualquer" ? 0 : Number(filters.bedrooms.replace("+", ""));
        const minSuites = filters.suites === "Qualquer" ? 0 : Number(filters.suites.replace("+", ""));
        const minParking = filters.parking === "Qualquer" ? 0 : Number(filters.parking.replace("+", ""));
        const minArea = filters.minArea === "Qualquer" ? 0 : Number(filters.minArea);
        const features = propertyFeatures(property);
        return (
          (filters.kinds.size === 0 || filters.kinds.has(property.kind)) &&
          (filters.city === "Todos" || property.cityName === filters.city) &&
          (filters.neighborhood === "Todos" || property.neighborhood === filters.neighborhood) &&
          property.priceNumber <= Number(filters.maxPrice) &&
          (minBedrooms === 0 || property.bedrooms >= minBedrooms) &&
          (minSuites === 0 || property.suites >= minSuites) &&
          (minParking === 0 || property.parking >= minParking) &&
          (minArea === 0 || property.area >= minArea) &&
          (filters.features.size === 0 || [...filters.features].every((feature) => features.has(feature.toLowerCase())))
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
      if (filters.neighborhood !== "Todos") params.set("bairro", filters.neighborhood);
      if (Number(filters.maxPrice) < 2500000) params.set("preco", filters.maxPrice);
      if (filters.bedrooms !== "Qualquer") params.set("quartos", filters.bedrooms);
      if (filters.suites !== "Qualquer") params.set("suites", filters.suites);
      if (filters.parking !== "Qualquer") params.set("vagas", filters.parking);
      if (filters.minArea !== "Qualquer") params.set("area", filters.minArea);
      if (filters.features.size) params.set("caracteristicas", [...filters.features].join(","));
      if (sortBy !== "recentes") params.set("ordem", sortBy);
      if (page > 1) params.set("pagina", String(page));
      const query = params.toString();
      window.history.replaceState({ route: "comprar" }, "", `#comprar${query ? `?${query}` : ""}`);
    };

    return {
      next(message = {}) {
        if (message.type === "toggleFavorite") props.toggleFavorite(message.propertyId);
        if (message.type === "toggleCompare") props.toggleCompare(message.propertyId);
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
        const visibleProperties = filtered.slice((page - 1) * pageSize, page * pageSize);
        const neighborhoods = ["Todos", ...new Set(properties.filter((property) => filters.city === "Todos" || property.cityName === filters.city).map((property) => property.neighborhood))];
        const compared = properties.filter((property) => props.isCompared(property.id));
        const renderPropertyCard = (property) => PropertyCardComponent({
          props: {
            property,
            tools: { componentId: "listing", isFavorite: props.isFavorite, isCompared: props.isCompared },
          },
        }).next().value;
        const renderListCard = (property) => ListCardComponent({
          props: {
            property,
            tools: { isFavorite: props.isFavorite, isCompared: props.isCompared },
          },
        }).next().value;
        const pager = Array.from({ length: totalPages }, (_, index) => index + 1)
          .map((item) => `<button class="${item === page ? "active" : ""}" type="button" data-cid="listing" data-message="setPage" data-value="${item}">${item}</button>`)
          .join("");

        return {
          done: false,
          value: `
            <section id="comprar" class="section listing-section">
              <div class="container">
                <div class="breadcrumb-row"><span>Home</span><span>Comprar</span></div>
                <div class="section-title">
                  <div><span class="eyebrow">Comprar / Alugar / Buscar</span><h2>Imoveis a venda</h2><p>Encontramos ${filtered.length} imoveis. Filtros ativos atualizam a URL e mantem o comparador funcionando.</p></div>
                </div>
                <div class="listing-layout">
                  <aside class="filter-box" aria-label="Filtros">
                    <div class="filter-head"><strong>Filtros</strong><button type="button" data-cid="listing" data-message="clearFilters">Limpar filtros</button></div>
                    <div class="filter-stack">
                      <div class="mini-field"><label>Tipo</label><div class="check-list">${["Casa", "Apartamento", "Terreno", "Cobertura", "Sala comercial"].map((kind) => `<label><input type="checkbox" data-cid="listing" data-message="filter" data-name="kind" value="${kind}" ${filters.kinds.has(kind) ? "checked" : ""}> ${kind}</label>`).join("")}</div></div>
                      <div class="mini-field"><label>Cidade</label><select data-cid="listing" data-message="filter" data-name="city">${["Todos", ...new Set(properties.map((property) => property.cityName))].map((city) => option(city, filters.city)).join("")}</select></div>
                      <div class="mini-field"><label>Bairro</label><select data-cid="listing" data-message="filter" data-name="neighborhood">${neighborhoods.map((item) => option(item, filters.neighborhood)).join("")}</select></div>
                      <div class="mini-field"><label>Preco maximo: R$ ${money(filters.maxPrice)}</label><input type="range" min="290000" max="2500000" step="50000" value="${filters.maxPrice}" data-cid="listing" data-message="filter" data-name="maxPrice"></div>
                      <div class="mini-field"><label>Quartos</label><select data-cid="listing" data-message="filter" data-name="bedrooms">${["Qualquer", "1+", "2+", "3+", "4+"].map((value) => option(value, filters.bedrooms)).join("")}</select></div>
                      <div class="mini-field"><label>Suites</label><select data-cid="listing" data-message="filter" data-name="suites">${["Qualquer", "1+", "2+"].map((value) => option(value, filters.suites)).join("")}</select></div>
                      <div class="mini-field"><label>Vagas</label><select data-cid="listing" data-message="filter" data-name="parking">${["Qualquer", "1+", "2+", "3+"].map((value) => option(value, filters.parking)).join("")}</select></div>
                      <div class="mini-field"><label>Area minima</label><select data-cid="listing" data-message="filter" data-name="minArea">${["Qualquer", "50", "100", "200", "400"].map((value) => option(value, filters.minArea, value === "Qualquer" ? value : `${value}m2`)).join("")}</select></div>
                      <div class="mini-field"><label>Caracteristicas</label><div class="check-list">${["vista mar", "praia", "condominio", "comercial"].map((feature) => `<label><input type="checkbox" data-cid="listing" data-message="filter" data-name="feature" value="${feature}" ${filters.features.has(feature) ? "checked" : ""}> ${feature}</label>`).join("")}</div></div>
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
                      ].map(([value, label]) => option(value, sortBy, label)).join("")}</select></label>
                      <div class="view-toggle">
                        <button class="square-btn ${viewMode === "grid" ? "active" : ""}" type="button" data-cid="listing" data-message="setView" data-value="grid">Grade</button>
                        <button class="square-btn ${viewMode === "list" ? "active" : ""}" type="button" data-cid="listing" data-message="setView" data-value="list">Lista</button>
                      </div>
                    </div>
                    <div class="results-meta-strip">
                      <span>${filtered.length} resultados</span>
                      <span>${compared.length} em comparacao</span>
                    </div>
                    <div class="${viewMode === "grid" ? "property-grid listing-grid" : "list-stack"}">
                      ${visibleProperties.length ? visibleProperties.map((property) => (viewMode === "grid" ? renderPropertyCard(property) : renderListCard(property))).join("") : `<article class="list-card"><div class="list-info"><h3>Nenhum imovel encontrado</h3><div class="location">Tente limpar filtros.</div></div></article>`}
                    </div>
                    ${compared.length >= 2 ? `<div class="compare-box"><strong>Comparando ${compared.length} imoveis</strong><div class="compare-table">${compared.map((property) => `<div><b>${property.title}</b><span>${property.price}</span><span>${property.neighborhood}</span><span>${property.area}m2</span><span>${property.bedrooms} quartos</span><span>${property.bathrooms} banheiros</span><span>${property.parking} vagas</span><span>Condominio ${property.condominium}</span><span>IPTU ${property.iptu}</span></div>`).join("")}</div><button class="ghost-btn whatsapp" type="button" data-route="contato">Enviar comparacao para WhatsApp</button></div>` : `<p class="route-note">Marque dois ou mais imoveis para comparar.</p>`}
                    <div class="pager"><button type="button" data-cid="listing" data-message="setPage" data-value="${page - 1}" ${page === 1 ? "disabled" : ""}>‹</button>${pager}<button type="button" data-cid="listing" data-message="setPage" data-value="${page + 1}" ${page === totalPages ? "disabled" : ""}>›</button></div>
                  </div>
                </div>
              </div>
            </section>
          `,
        };
      },
    };
  };
