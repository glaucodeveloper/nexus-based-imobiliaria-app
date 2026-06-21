  const FavoritesComponent = ({ props }) => ({
    next(message = {}) {
      if (message.type === "toggleFavorite") props.toggleFavorite(message.propertyId);
      const isCompared = (propertyId) => props.isCompared?.(propertyId);
      const favorites = properties.filter((property) => props.isFavorite(property.id));
      return {
        done: false,
        value: /*html*/`
          <section id="favoritos" class="section dashboard-lite-section">
            <div class="container">
              <div class="utility-hero">
                <div>
                  <div class="breadcrumb-row"><span>Home</span><span>Favoritos</span></div>
                  <span class="eyebrow">Sua selecao</span>
                  <h2>Favoritos</h2>
                  <p>Reuna os imoveis mais promissores antes de enviar para um corretor ou seguir para comparacao.</p>
                </div>
                <div class="utility-highlight">
                  <strong>${favorites.length}</strong>
                  <span>imoveis salvos</span>
                </div>
              </div>
              <div class="favorites-layout">
                <div class="favorites-stack">
                  ${favorites.length ? favorites.map((property) => /*html*/`
                    <article class="favorite-card">
                      <img src="${property.image}" alt="${property.title}" loading="lazy">
                      <div class="favorite-card-body">
                        <span class="property-type">${property.type}</span>
                        <h3>${property.title}</h3>
                        <div class="location">${property.city}</div>
                        <div class="meta">${property.meta.map((item) => /*html*/`<span>${item}</span>`).join("")}</div>
                        <strong class="price">${property.price}</strong>
                      </div>
                      <div class="favorite-card-actions">
                        <a class="ghost-btn" href="#imovel?propertyId=${encodeURIComponent(property.id)}" data-route="imovel" data-property-id="${property.id}">Ver detalhes</a>
                        <button class="ghost-btn compare-btn ${isCompared(property.id) ? "active" : ""}" type="button" data-cid="favorites" data-message="toggleCompare" data-property-id="${property.id}">${isCompared(property.id) ? "Comparando" : "Comparar"}</button>
                        <button class="ghost-btn danger-btn" type="button" data-cid="favorites" data-message="toggleFavorite" data-property-id="${property.id}">Remover</button>
                      </div>
                    </article>
                  `).join("") : `
                    <article class="empty-state-card">
                      <h3>Nenhum favorito salvo</h3>
                      <p>Use o icone de coracao nas vitrines para montar sua pasta de oportunidades.</p>
                      <a class="gold-btn" href="#comprar" data-route="comprar">Explorar imoveis</a>
                    </article>
                  `}
                </div>
                <aside class="favorites-side-panel">
                  <div class="side-note-card">
                    <span class="eyebrow">Atalho</span>
                    <h3>Quer ajuda para decidir?</h3>
                    <p>O quiz cruza finalidade, metragem e perfil para apontar o tipo de imovel mais aderente.</p>
                    <a class="gold-btn" href="#quiz" data-route="quiz">Abrir quiz</a>
                  </div>
                  <div class="broker-card">
                    <strong>Consultor disponivel</strong>
                    <div class="broker-person"><img class="avatar" src="${brokers[0].photo}" alt="${brokers[0].name}"><div><strong>${brokers[0].name}</strong><div class="location">${brokers[0].creci}</div></div></div>
                    <a class="ghost-btn whatsapp" href="#contato" data-route="contato">Enviar lista no WhatsApp</a>
                  </div>
                </aside>
              </div>
            </div>
          </section>
        `,
      };
    },
  });


