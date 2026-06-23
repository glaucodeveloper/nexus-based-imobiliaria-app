const PropertyCardComponent = ({ props }) => ({
  next() {
    const property = props.property;
    const tools = props.tools || {};
    const favorite = tools.isFavorite?.(property.id);
    const compared = tools.isCompared?.(property.id);
    const isListing = tools.componentId === "listing";
    const titleLink = isListing
      ? `<a class="property-title-link" href="#imovel#${encodeURIComponent(property.id)}" data-route="imovel" data-property-id="${property.id}">${property.title}</a>`
      : property.title;
    return {
      done: false,
      value: /*html*/`
        <article class="property-card fade-up ${isListing ? "compare-card" : ""} ${compared ? "is-compared" : ""}"${isListing ? ` role="button" tabindex="0" aria-pressed="${compared ? "true" : "false"}" data-cid="listing" data-message="toggleCompare" data-property-id="${property.id}"` : ""}>
          ${isListing ? `<span class="compare-chip">${compared ? "Selecionado" : "Comparar"}</span>` : ""}
          ${isListing
            ? `<div class="card-media compare-media"><img src="${property.image}" alt="${property.title}" loading="lazy"><span class="badge">${property.tag}</span></div>`
            : `<button class="card-media" type="button" data-route="imovel" data-property-id="${property.id}" aria-label="Ver detalhes de ${property.title}"><img src="${property.image}" alt="${property.title}" loading="lazy"><span class="badge">${property.tag}</span></button>`}
          <button class="heart ${favorite ? "active" : ""}" type="button" data-cid="${tools.componentId}" data-message="toggleFavorite" data-property-id="${property.id}" aria-label="Favoritar">${favoriteMark(favorite)}</button>
          <div class="property-body">
            <span class="property-type">${property.type}</span>
            <h3>${titleLink}</h3>
            <div class="location">${property.city}</div>
            <div class="meta">${property.meta.map((item) => /*html*/`<span>${item}</span>`).join("")}</div>
            <div class="price">${property.price}</div>
            ${isListing ? `<p class="compare-hint">Clique no card para comparar e no titulo para abrir o detalhe.</p>` : `<button class="ghost-btn compare-btn ${compared ? "active" : ""}" type="button" data-cid="listing" data-message="toggleCompare" data-property-id="${property.id}">${compared ? "Comparando" : "Comparar"}</button>`}
          </div>
        </article>
      `,
    };
  },
});

