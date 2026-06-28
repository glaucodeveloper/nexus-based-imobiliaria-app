const FeaturedComponent = ({ props }) => ({
  next(message = {}) {
    if (message.type === "toggleFavorite") props.toggleFavorite(message.propertyId);
    if (message.type === "toggleCompare") props.toggleCompare(message.propertyId);
    const route = props.getRouteInfo?.().route || "home";
    const isDedicatedPage = route === "destaques";
    const scrollState = props.getFeaturedScrollState?.() || {};
    const expandedId = scrollState.expandedPropertyId || null;
    const expandedHeight = scrollState.expandedHeight || null;
    const expansionStage = scrollState.expansionStage || null;
    const showcaseStageClass = expansionStage ? `is-${expansionStage}-stage` : "";

    const renderSimpleCard = (property) => {
      const favorite = props.isFavorite(property.id);
      return /*html*/`
        <article class="featured-mini-card">
          <div class="featured-mini-media">
            <img src="${property.image}" alt="${property.title}" loading="lazy">
            <span class="badge">${property.tag}</span>
          </div>
          <div class="featured-mini-body">
            <div class="featured-mini-head">
              <div>
                <span class="property-type">${property.type}</span>
                <h3><a class="property-title-link" href="#imovel#${encodeURIComponent(property.id)}" data-route="imovel" data-property-id="${property.id}">${property.title}</a></h3>
                <div class="location">${property.city}</div>
              </div>
              <button class="heart ${favorite ? "active" : ""}" type="button" data-cid="featured" data-message="toggleFavorite" data-property-id="${property.id}" aria-label="Favoritar">${favoriteMark(favorite)}</button>
            </div>
            <div class="featured-mini-bottom">
              <strong class="featured-mini-price">${property.price}</strong>
              <a class="ghost-btn" href="#imovel#${encodeURIComponent(property.id)}" data-route="imovel" data-property-id="${property.id}">Ver detalhes</a>
            </div>
          </div>
        </article>
      `;
    };

    const renderShowcaseCard = (property) => {
      const favorite = props.isFavorite(property.id);
      const compared = props.isCompared?.(property.id);
      const isExpanded = expandedId === property.id;
      const isNeighbor = expandedId && !isExpanded;
      const isCompacting = isExpanded && expansionStage === "compact";
      const specs = [
        { label: "Area", value: `${property.area}m2` },
        { label: "Quartos", value: `${property.bedrooms}` },
        { label: "Suites", value: `${property.suites}` },
        { label: "Banheiros", value: `${property.bathrooms}` },
      ];
      const highlights = (property.features || []).slice(0, 3);
      let neighborClass = "";
      if (isNeighbor) {
        const neighborSlots = ["left-top", "right-top", "left-bottom", "right-bottom"];
        const neighborIndex = properties
          .slice(0, 4)
          .filter((item) => item.id !== expandedId)
          .findIndex((item) => item.id === property.id);
        neighborClass = neighborIndex >= 0 ? `is-gallery-${neighborSlots[neighborIndex]}` : "";
      }
      return /*html*/`
        <article class="featured-showcase-card ${isExpanded ? "is-expanded" : ""} ${isCompacting ? "is-compact" : ""} ${isNeighbor ? `is-neighbor ${neighborClass}` : ""} ${compared ? "is-compared" : ""}" data-featured-card data-property-id="${property.id}">
          <div class="featured-showcase-media">
            <img src="${property.image}" alt="${property.title}" loading="lazy">
            <span class="badge">${property.tag}</span>
          </div>
          <div class="featured-showcase-content">
            <div class="featured-showcase-head">
              <div>
                <span class="property-type">${property.type}</span>
                <h3><a class="property-title-link" href="#imovel#${encodeURIComponent(property.id)}" data-route="imovel" data-property-id="${property.id}">${property.title}</a></h3>
                <div class="location">${property.city}</div>
              </div>
              <button class="heart ${favorite ? "active" : ""}" type="button" data-cid="featured" data-message="toggleFavorite" data-property-id="${property.id}" aria-label="Favoritar">${favoriteMark(favorite)}</button>
            </div>
            <div class="featured-showcase-price">${property.price}</div>
            <div class="featured-showcase-specs">
              ${specs.map((spec) => /*html*/`
                <div class="featured-showcase-spec">
                  <span>${spec.label}</span>
                  <strong>${spec.value}</strong>
                </div>
              `).join("")}
            </div>
            <div class="featured-showcase-details">
              <div class="featured-showcase-copy">
                <p>${property.meta.join(" &#183; ")}</p>
                <div class="featured-tags">
                  ${highlights.map((item) => /*html*/`<span>${item}</span>`).join("")}
                </div>
              </div>
              <div class="featured-showcase-actions">
                <button class="ghost-btn compare-btn ${compared ? "active" : ""}" type="button" data-cid="featured" data-message="toggleCompare" data-property-id="${property.id}">${compared ? "Comparando" : "Comparar"}</button>
                <a class="gold-btn" href="#imovel#${encodeURIComponent(property.id)}" data-route="imovel" data-property-id="${property.id}">Ver detalhes</a>
              </div>
            </div>
          </div>
        </article>
      `;
    };

    return {
      done: false,
      value: /*html*/`
        <section id="destaques" class="section featured-section ${isDedicatedPage ? `featured-section--showcase ${showcaseStageClass}` : "featured-section--grid"}" ${isDedicatedPage && expandedHeight ? `style="--featured-expanded-height:${expandedHeight}px"` : ""}>
          <div class="container featured-shell">
            <div class="section-title">
              <div><span class="eyebrow">Destaques</span><h2>Imoveis em destaque</h2><p>Selecionamos as oportunidades mais fortes para voce.</p></div>
              <button class="ghost-btn" type="button" data-route="comprar">Ver todos</button>
            </div>
            <div class="${isDedicatedPage ? `featured-showcase-grid ${showcaseStageClass}` : "featured-mini-grid"}">
              ${isDedicatedPage ? properties.slice(0, 4).map((property) => renderShowcaseCard(property)).join("") : properties.slice(0, 4).map((property) => renderSimpleCard(property)).join("")}
            </div>
          </div>
        </section>
      `,
    };
  },
});




