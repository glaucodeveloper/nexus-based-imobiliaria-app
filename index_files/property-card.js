  const PropertyCardComponent = ({ props }) => ({
    next() {
      const property = props.property;
      const tools = props.tools || {};
      const favorite = tools.isFavorite?.(property.id);
      const compared = tools.isCompared?.(property.id);
      return {
        done: false,
        value: /*html*/`
          <article class="property-card fade-up">
            <button class="card-media" type="button" data-route="imovel" data-property-id="${property.id}" aria-label="Ver detalhes de ${property.title}">
              <img src="${property.image}" alt="${property.title}" loading="lazy">
              <span class="badge">${property.tag}</span>
            </button>
            <button class="heart ${favorite ? "active" : ""}" type="button" data-cid="${tools.componentId}" data-message="toggleFavorite" data-property-id="${property.id}" aria-label="Favoritar">${favoriteMark(favorite)}</button>
            <div class="property-body">
              <span class="property-type">${property.type}</span>
              <h3>${property.title}</h3>
              <div class="location">${property.city}</div>
              <div class="meta">${property.meta.map((item) => /*html*/`<span>${item}</span>`).join("")}</div>
              <div class="price">${property.price}</div>
              ${tools.componentId === "listing" ? `<button class="ghost-btn compare-btn ${compared ? "active" : ""}" type="button" data-cid="listing" data-message="toggleCompare" data-property-id="${property.id}">${compared ? "Comparando" : "Comparar"}</button>` : ""}
            </div>
          </article>
        `,
      };
    },
  });

