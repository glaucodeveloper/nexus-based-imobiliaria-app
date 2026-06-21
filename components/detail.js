  const DetailComponent = ({ props }) => {
    let status = "";
    let galleryOpen = false;
    let galleryIndex = 0;
    let activePropertyId = "";
    return {
      next(message = {}) {
        if (message.type === "toggleFavorite") props.toggleFavorite(message.propertyId);
        if (message.type === "openGallery") {
          galleryOpen = true;
          galleryIndex = Number(message.target?.dataset?.index || message.value || 0) || 0;
        }
        if (message.type === "closeGallery") {
          galleryOpen = false;
        }
        if (message.type === "nextGallery") {
          galleryIndex += 1;
        }
        if (message.type === "prevGallery") {
          galleryIndex -= 1;
        }
        if (message.type === "proposal") {
          props.addLead({ name: message.fields.name || "Proposta", source: "Pagina do imovel", interest: props.getSelectedProperty().title, stage: "novo" });
          status = "Proposta registrada no dashboard.";
        }
        const property = props.getSelectedProperty();
        if (property?.id !== activePropertyId) {
          activePropertyId = property?.id || "";
          galleryOpen = false;
          galleryIndex = 0;
        }
        const broker = brokers[0];
        const renderPropertyCard = (item) => PropertyCardComponent({
          props: {
            property: item,
            tools: { componentId: "featured", isFavorite: props.isFavorite },
          },
        }).next().value;
        const galleryImages = [property.image, ...(Array.isArray(property.images) ? property.images : []), ...properties.filter((item) => item.id !== property.id).slice(0, 3).map((item) => item.image)].filter(Boolean);
        if (galleryImages.length) galleryIndex = ((galleryIndex % galleryImages.length) + galleryImages.length) % galleryImages.length;
        const currentGalleryImage = galleryImages[galleryIndex] || property.image;
        const renderGalleryItem = (item, index, isMain = false) => {
          const isActive = index === galleryIndex;
          const label = isMain ? "Abrir galeria" : `Abrir imagem ${index + 1}`;
          return `
            <button class="gallery-item ${isMain ? "gallery-main" : "gallery-thumb"} ${isActive ? "is-active" : ""}" type="button" data-cid="detail" data-message="openGallery" data-index="${index}" aria-label="${label}">
              <img src="${item}" alt="${property.title} - imagem ${index + 1}" loading="lazy">
              ${!isMain && index === 3 ? `<span class="gallery-more">ver todas</span>` : ""}
            </button>
          `;
        };
        return {
          done: false,
          value: `
            <section id="imovel" class="section detail-section">
              <div class="container">
                <div class="breadcrumb-row"><span>Home</span><span>Comprar</span><span>${property.title}</span></div>
              </div>
              <div class="container detail-layout">
                <div>
                  <div class="gallery">
                    ${renderGalleryItem(galleryImages[0] || property.image, 0, true)}
                    ${galleryImages.slice(1, 4).map((item, index) => renderGalleryItem(item, index + 1)).join("")}
                  </div>
                  <div class="detail-copy">
                    <span class="eyebrow">${property.type}</span>
                    <h2>${property.title}</h2>
                    <p>Projeto pensado para uma rotina sofisticada, com implantacao funcional, acabamentos consistentes e posicionamento forte dentro do bairro.</p>
                    <ul class="feature-list">
                      <li>Area total: ${property.area}m2</li>
                      <li>Area privativa: ${Math.max(property.area - 20, property.area)}m2</li>
                      <li>${property.bedrooms} quartos, ${property.suites} suites, ${property.bathrooms} banheiros e ${property.parking} vagas</li>
                      <li>Condominio ${property.condominium} e IPTU ${property.iptu}</li>
                    </ul>
                    <div class="detail-tabs">
                      <span class="active">Sobre o imovel</span>
                      <span>Caracteristicas</span>
                      <span>Localizacao</span>
                      <span>Condominio</span>
                      <span>Documentacao</span>
                    </div>
                    <ul class="detail-bullet-list">
                      <li>Sala ampla com pe direito duplo</li>
                      <li>Cozinha integrada com area gourmet</li>
                      <li>Piscina com deck molhado</li>
                      <li>Suite master com closet e varanda</li>
                      <li>Energia solar e aquecimento de agua</li>
                    </ul>
                  </div>
                </div>
                <aside class="detail-panel">
                  <h3>${property.title}</h3>
                  <div class="location">${property.city}</div>
                  <div class="meta">${property.meta.map((item) => `<span>${item}</span>`).join("")}</div>
                  <strong class="price">${property.price}</strong>
                  <div class="action-stack">
                    <button class="gold-btn" type="button" data-route="contato">Agendar visita</button>
                    <button class="ghost-btn whatsapp" type="button" data-route="contato">WhatsApp</button>
                    <button class="ghost-btn" type="button" data-cid="detail" data-message="toggleFavorite" data-property-id="${property.id}">${favoriteMark(props.isFavorite(property.id))} Favoritar</button>
                  </div>
                  <form class="broker-card" data-cid="detail" data-message="proposal">
                    <strong>Formulario de proposta</strong>
                    <div class="mini-field"><label>Nome</label><input name="name" required placeholder="Seu nome"></div>
                    <div class="mini-field"><label>Telefone</label><input name="phone" required placeholder="(71) 99999-0000"></div>
                    <button class="gold-btn" type="submit">Enviar proposta</button>
                    ${status ? `<p class="login-error">${status}</p>` : ""}
                  </form>
                  <div class="broker-card">
                    <strong>Corretor responsavel</strong>
                    <div class="broker-person"><img class="avatar" src="${broker.photo}" alt="${broker.name}"><div><strong>${broker.name}</strong><div class="location">${broker.creci}</div></div></div>
                    <button class="ghost-btn" type="button" data-route="comprar">Ver todos os imoveis</button>
                  </div>
                </aside>
              </div>
              ${galleryOpen ? `
                <div class="gallery-modal" role="dialog" aria-modal="true" aria-label="Galeria de imagens">
                  <button class="gallery-modal-backdrop" type="button" data-cid="detail" data-message="closeGallery" aria-label="Fechar galeria"></button>
                  <div class="gallery-modal-panel">
                    <button class="gallery-modal-close" type="button" data-cid="detail" data-message="closeGallery" aria-label="Fechar">×</button>
                    <button class="gallery-modal-nav gallery-modal-prev" type="button" data-cid="detail" data-message="prevGallery" aria-label="Imagem anterior">‹</button>
                    <img class="gallery-modal-image" src="${currentGalleryImage}" alt="${property.title}">
                    <button class="gallery-modal-nav gallery-modal-next" type="button" data-cid="detail" data-message="nextGallery" aria-label="Próxima imagem">›</button>
                  </div>
                </div>
              ` : ""}
              <div class="container"><div class="section-title"><div><span class="eyebrow">Semelhantes</span><h2>Imoveis semelhantes</h2></div></div><div class="property-grid">${properties.filter((item) => item.id !== property.id).slice(0, 3).map((item) => renderPropertyCard(item)).join("")}</div></div>
            </section>
          `,
        };
      },
    };
  };
