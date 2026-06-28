const ListCardComponent = ({ props }) => ({
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
        <article class="list-card ${isListing ? "compare-card" : ""} ${compared ? "is-compared" : ""}"${isListing ? ` role="button" tabindex="0" aria-pressed="${compared ? "true" : "false"}" data-cid="listing" data-message="toggleCompare" data-property-id="${property.id}"` : ""}>
          <img src="${property.image}" alt="${property.title}" loading="lazy">
          <div class="list-info">
            <span class="property-type">${property.type}</span>
            <h3>${titleLink}</h3>
            <div class="location">${property.city}</div>
            <div class="meta">${property.meta.map((item) => /*html*/`<span>${item}</span>`).join("")}</div>
            ${isListing ? `<p class="compare-hint">Clique no card para comparar. O titulo abre o detalhe.</p>` : ""}
          </div>
          <div class="list-price">
            <button class="heart ${favorite ? "active" : ""}" type="button" data-cid="listing" data-message="toggleFavorite" data-property-id="${property.id}">${favoriteMark(favorite)}</button>
            <strong class="price">${property.price}</strong>
            ${isListing ? `<span class="compare-chip">${compared ? "Selecionado" : "Comparar"}</span>` : `<button class="ghost-btn compare-btn ${compared ? "active" : ""}" type="button" data-cid="listing" data-message="toggleCompare" data-property-id="${property.id}">${compared ? "Comparando" : "Comparar"}</button><button class="ghost-btn" type="button" data-route="imovel" data-property-id="${property.id}">Ver detalhes</button>`}
          </div>
        </article>
      `,
    };
  },
});

