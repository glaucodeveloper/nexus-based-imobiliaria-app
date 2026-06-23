const FeaturedComponent = ({ props }) => ({
  next(message = {}) {
    if (message.type === "toggleFavorite") props.toggleFavorite(message.propertyId);
    if (message.type === "toggleCompare") props.toggleCompare(message.propertyId);
    const route = props.getRouteInfo?.().route || "home";
    const isDedicatedPage = route === "destaques";
    const hoverState = props.getFeaturedHoverState?.() || {};
    const scrollState = props.getFeaturedScrollState?.() || {};

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

    const renderShowcaseCard = (property, rowIndex) => {
      const favorite = props.isFavorite(property.id);
      const compared = props.isCompared?.(property.id);
      const isActive = hoverState.activePropertyId === property.id;
      const isRowOpen = hoverState.activeRow === rowIndex;
      const specs = [
        { label: "Area", value: `${property.area}m2` },
        { label: "Quartos", value: `${property.bedrooms}` },
        { label: "Suites", value: `${property.suites}` },
        { label: "Banheiros", value: `${property.bathrooms}` },
      ];
      const highlights = (property.features || []).slice(0, 3);
      return /*html*/`
          <article class="featured-showcase-card ${isActive ? "is-active is-expanded" : ""} ${compared ? "is-compared" : ""} ${isActive && scrollState.locked ? "is-locked" : ""}" data-featured-card data-featured-row="${rowIndex}" data-property-id="${property.id}">
          <div class="featured-lens-cursor" aria-hidden="true"></div>
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
                <p>${property.meta.join(" · ")}</p>
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

    const renderShowcaseRows = () => {
      const featured = properties.slice(0, 4);
      const rows = [];
      for (let index = 0; index < featured.length; index += 2) rows.push(featured.slice(index, index + 2));
      return rows.map((rowItems, rowIndex) => {
        const isOpen = hoverState.activeRow === rowIndex;
        const activeId = isOpen ? hoverState.activePropertyId : null;
        if (isOpen && activeId) {
          const activeItem = rowItems.find((p) => p.id === activeId) || rowItems[0];
          const inactiveItems = rowItems.filter((p) => p.id !== activeId);
          return /*html*/`
            <div class="featured-showcase-row is-open" data-featured-row="${rowIndex}">
              ${renderShowcaseCard(activeItem, rowIndex)}
            </div>
            ${inactiveItems.map((item) => /*html*/`
              <div class="featured-showcase-row is-pushed" data-featured-row="${rowIndex}" data-pushed-from="${rowIndex}">
                ${renderShowcaseCard(item, rowIndex)}
              </div>
            `).join("")}
          `;
        }
        return /*html*/`
          <div class="featured-showcase-row" data-featured-row="${rowIndex}">
            ${rowItems.map((property) => renderShowcaseCard(property, rowIndex)).join("")}
          </div>
        `;
      }).join("");
    };

    return {
      done: false,
      value: /*html*/`
        <section id="destaques" class="section featured-section ${isDedicatedPage ? "featured-section--showcase" : "featured-section--grid"}">
          <div class="container featured-shell">
            <div class="section-title">
              <div><span class="eyebrow">Destaques</span><h2>Imoveis em destaque</h2><p>Selecionamos as oportunidades mais fortes para voce.</p></div>
              <button class="ghost-btn" type="button" data-route="comprar">Ver todos</button>
            </div>
            <div class="${isDedicatedPage ? "featured-showcase-grid" : "featured-mini-grid"}">
              ${isDedicatedPage ? renderShowcaseRows() : properties.slice(0, 4).map((property) => renderSimpleCard(property)).join("")}
            </div>
          </div>
        </section>
      `,
    };
  },
});









