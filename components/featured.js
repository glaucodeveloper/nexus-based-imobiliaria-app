  const FeaturedComponent = ({ props }) => ({
    next(message = {}) {
      if (message.type === "toggleFavorite") props.toggleFavorite(message.propertyId);
      if (message.type === "toggleCompare") props.toggleCompare(message.propertyId);
      const renderFeaturedCard = (property) => {
        const favorite = props.isFavorite(property.id);
        const compared = props.isCompared?.(property.id);
        const specs = [
          { label: "Area", value: `${property.area}m2` },
          { label: "Quartos", value: `${property.bedrooms}` },
          { label: "Suites", value: `${property.suites}` },
          { label: "Banheiros", value: `${property.bathrooms}` },
        ];
        const highlights = (property.features || []).slice(0, 3);
        return /*html*/`
          <article class="featured-card ${compared ? "is-compared" : ""}">
            <div class="featured-card-media">
              <img src="${property.image}" alt="${property.title}" loading="lazy">
              <span class="badge">${property.tag}</span>
            </div>
            <div class="featured-card-content">
              <div class="featured-card-head">
                <div>
                  <span class="property-type">${property.type}</span>
                  <h3><a class="property-title-link" href="#imovel?propertyId=${encodeURIComponent(property.id)}" data-route="imovel" data-property-id="${property.id}">${property.title}</a></h3>
                  <div class="location">${property.city}</div>
                </div>
                <button class="heart ${favorite ? "active" : ""}" type="button" data-cid="featured" data-message="toggleFavorite" data-property-id="${property.id}" aria-label="Favoritar">${favoriteMark(favorite)}</button>
              </div>
              <div class="featured-card-price">${property.price}</div>
              <div class="featured-card-specs">
                ${specs.map((spec) => /*html*/`
                  <div class="featured-spec">
                    <span>${spec.label}</span>
                    <strong>${spec.value}</strong>
                  </div>
                `).join("")}
              </div>
              <div class="featured-card-details">
                <div class="featured-card-copy">
                  <p>${property.meta.join(" · ")}</p>
                  <div class="featured-tags">
                    ${highlights.map((item) => /*html*/`<span>${item}</span>`).join("")}
                  </div>
                </div>
                <div class="featured-card-actions">
                  <button class="ghost-btn compare-btn ${compared ? "active" : ""}" type="button" data-cid="featured" data-message="toggleCompare" data-property-id="${property.id}">${compared ? "Comparando" : "Comparar"}</button>
                  <a class="gold-btn" href="#imovel?propertyId=${encodeURIComponent(property.id)}" data-route="imovel" data-property-id="${property.id}">Ver detalhes</a>
                </div>
              </div>
            </div>
          </article>
        `;
      };
      return {
        done: false,
        value: /*html*/`
          <section id="destaques" class="section featured-section">
            <div class="container featured-shell">
              <div class="section-title">
                <div><span class="eyebrow">Destaques</span><h2>Imoveis em destaque</h2><p>Selecionamos as oportunidades mais fortes para voce.</p></div>
                <button class="ghost-btn" type="button" data-route="comprar">Ver todos</button>
              </div>
              <div class="featured-strip">
                ${properties.slice(0, 4).map((property) => renderFeaturedCard(property)).join("")}
              </div>
            </div>
          </section>
        `,
      };
    },
  });
