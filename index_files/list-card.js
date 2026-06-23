  const ListCardComponent = ({ props }) => ({
    next() {
      const property = props.property;
      const tools = props.tools || {};
      const favorite = tools.isFavorite?.(property.id);
      const compared = tools.isCompared?.(property.id);
      return {
        done: false,
        value: /*html*/`
          <article class="list-card">
            <img src="${property.image}" alt="${property.title}" loading="lazy">
            <div class="list-info">
              <span class="property-type">${property.type}</span>
              <h3>${property.title}</h3>
              <div class="location">${property.city}</div>
              <div class="meta">${property.meta.map((item) => /*html*/`<span>${item}</span>`).join("")}</div>
            </div>
            <div class="list-price">
              <button class="heart ${favorite ? "active" : ""}" type="button" data-cid="listing" data-message="toggleFavorite" data-property-id="${property.id}">${favoriteMark(favorite)}</button>
              <strong class="price">${property.price}</strong>
              <button class="ghost-btn compare-btn ${compared ? "active" : ""}" type="button" data-cid="listing" data-message="toggleCompare" data-property-id="${property.id}">${compared ? "Comparando" : "Comparar"}</button>
              <button class="ghost-btn" type="button" data-route="imovel" data-property-id="${property.id}">Ver detalhes</button>
            </div>
          </article>
        `,
      };
    },
  });

