const DetailComponent = ({ props }) => {
  let status = "";
  let galleryOpen = false;
  let galleryIndex = 0;
  let activePropertyId = "";
  let galleryZoom = null;
  let activeTab = "sobre";

  const escapeText = (value) => String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

  return {
    next(message = {}) {
      if (message.type === "toggleFavorite") props.toggleFavorite(message.propertyId);
      if (message.type === "setDetailTab") activeTab = message.value || activeTab;
      if (message.type === "openGallery") {
        if (message.event?.type === "pointermove") {
          const rect = message.target?.getBoundingClientRect?.();
          if (rect?.width && rect?.height) {
            const rawX = (message.event.clientX - rect.left) / rect.width;
            const rawY = (message.event.clientY - rect.top) / rect.height;
            galleryZoom = {
              x: Math.min(0.84, Math.max(0.16, rawX)),
              y: Math.min(0.84, Math.max(0.16, rawY)),
            };
          }
        } else {
          galleryOpen = true;
          galleryIndex = Number(message.target?.dataset?.index || message.value || 0) || 0;
          galleryZoom = { x: 0.5, y: 0.5 };
        }
      }
      if (message.type === "closeGallery") {
        galleryOpen = false;
        galleryZoom = null;
      }
      if (message.type === "nextGallery") galleryIndex += 1;
      if (message.type === "prevGallery") galleryIndex -= 1;
      if (message.type === "proposal") {
        props.addLead({ name: message.fields.name || "Proposta", source: "Pagina do imovel", interest: props.getSelectedProperty().title, stage: "novo" });
        status = "Proposta registrada no dashboard.";
      }

      const property = props.getSelectedProperty();
      if (property?.id !== activePropertyId) {
        activePropertyId = property?.id || "";
        galleryOpen = false;
        galleryIndex = 0;
        galleryZoom = null;
        activeTab = "sobre";
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
        const zoomStyle = isMain
          ? `style="--zoom-x:${galleryZoom?.x ?? 0.5};--zoom-y:${galleryZoom?.y ?? 0.5};--zoom-image:url('${item}')"`
          : "";
        return /*html*/`
          <button class="gallery-item ${isMain ? "gallery-main" : "gallery-thumb"} ${isActive ? "is-active" : ""} ${isMain && galleryZoom ? "is-zooming" : ""}" type="button" data-cid="detail" data-message="openGallery" data-index="${index}" aria-label="${label}" ${zoomStyle}>
            <img src="${item}" alt="${property.title} - imagem ${index + 1}" loading="lazy">
            ${isMain ? `<div class="gallery-lens" aria-hidden="true"></div>` : ""}
            ${!isMain && index === 3 ? `<span class="gallery-more">ver todas</span>` : ""}
          </button>
        `;
      };

      const detailTabs = [
        {
          id: "sobre",
          label: "Sobre o imovel",
          title: "Resumo do cadastro",
          body: /*html*/`
            <ul class="detail-bullet-list">
              <li><strong>Titulo:</strong> ${escapeText(property.title)}</li>
              <li><strong>Tipo:</strong> ${escapeText(property.type)}</li>
              <li><strong>Categoria:</strong> ${escapeText(property.kind)}</li>
              <li><strong>Preco:</strong> ${escapeText(property.price)}</li>
              <li><strong>Area:</strong> ${escapeText(property.area)}m2</li>
            </ul>
            <div class="detail-card-grid">
              <article class="detail-info-card"><span>Quartos</span><strong>${escapeText(property.bedrooms)}</strong></article>
              <article class="detail-info-card"><span>Suites</span><strong>${escapeText(property.suites)}</strong></article>
              <article class="detail-info-card"><span>Banheiros</span><strong>${escapeText(property.bathrooms)}</strong></article>
              <article class="detail-info-card"><span>Vagas</span><strong>${escapeText(property.parking)}</strong></article>
            </div>
          `,
        },
        {
          id: "caracteristicas",
          label: "Caracteristicas",
          title: "Dados do formulario de imoveis",
          body: /*html*/`
            <div class="detail-chip-cloud">
              ${(property.features || []).map((item) => `<span>${escapeText(item)}</span>`).join("")}
            </div>
            <ul class="detail-bullet-list">
              ${(property.meta || []).map((item) => `<li>${escapeText(item)}</li>`).join("")}
            </ul>
          `,
        },
        {
          id: "localizacao",
          label: "Localizacao",
          title: "Endereco e contexto",
          body: /*html*/`
            <ul class="detail-bullet-list">
              <li><strong>Cidade completa:</strong> ${escapeText(property.city)}</li>
              <li><strong>Cidade-base:</strong> ${escapeText(property.cityName || property.city)}</li>
              <li><strong>Bairro:</strong> ${escapeText(property.neighborhood)}</li>
              <li><strong>Operacao:</strong> ${escapeText(property.operation || "Comprar")}</li>
            </ul>
          `,
        },
        {
          id: "condominio",
          label: "Condominio",
          title: "Custos recorrentes",
          body: /*html*/`
            <ul class="detail-bullet-list">
              <li><strong>Condominio:</strong> ${escapeText(property.condominium || "Nao informado")}</li>
              <li><strong>IPTU:</strong> ${escapeText(property.iptu || "Nao informado")}</li>
              <li><strong>Etiqueta:</strong> ${escapeText(property.tag || "Nao informada")}</li>
              <li><strong>Base de calculo:</strong> ${property.priceNumber ? `R$ ${Number(property.priceNumber).toLocaleString("pt-BR")}` : escapeText(property.price)}</li>
            </ul>
          `,
        },
        {
          id: "documentacao",
          label: "Documentacao",
          title: "Identificacao do produto",
          body: /*html*/`
            <div class="detail-card-grid">
              <article class="detail-info-card"><span>ID</span><strong>${escapeText(property.id)}</strong></article>
              <article class="detail-info-card"><span>Categoria</span><strong>${escapeText(property.kind)}</strong></article>
              <article class="detail-info-card"><span>Galeria</span><strong>${galleryImages.length}</strong></article>
              <article class="detail-info-card"><span>Publicacao</span><strong>${escapeText(property.tag || "Ativa")}</strong></article>
            </div>
            <p class="route-note">Os campos acima vem do mesmo cadastro editado no dashboard e no editor de produto.</p>
          `,
        },
      ];
      const currentTab = detailTabs.find((tab) => tab.id === activeTab) || detailTabs[0];

      return {
        done: false,
        value: /*html*/`
          <section id="imovel" class="section detail-section">
            <div class="container">
              <div class="breadcrumb-row"><span>Home</span><span>Comprar</span><span>${escapeText(property.title)}</span></div>
            </div>
            <div class="container detail-layout">
              <div>
                <div class="gallery">
                  ${renderGalleryItem(galleryImages[0] || property.image, 0, true)}
                  ${galleryImages.slice(1, 4).map((item, index) => renderGalleryItem(item, index + 1)).join("")}
                </div>
                <div class="detail-copy">
                  <span class="eyebrow">${escapeText(property.type)}</span>
                  <h2>${escapeText(property.title)}</h2>
                  <p>Projeto pensado para uma rotina sofisticada, com implantacao funcional, acabamentos consistentes e posicionamento forte dentro do bairro.</p>
                  <ul class="feature-list">
                    <li>Area total: ${escapeText(property.area)}m2</li>
                    <li>Area privativa: ${Math.max(Number(property.area) - 20, Number(property.area))}m2</li>
                    <li>${escapeText(property.bedrooms)} quartos, ${escapeText(property.suites)} suites, ${escapeText(property.bathrooms)} banheiros e ${escapeText(property.parking)} vagas</li>
                    <li>Condominio ${escapeText(property.condominium)} e IPTU ${escapeText(property.iptu)}</li>
                  </ul>
                  <div class="detail-tabs" role="tablist" aria-label="Detalhes do imovel">
                    ${detailTabs.map((tab) => /*html*/`<button class="${tab.id === currentTab.id ? "active" : ""}" type="button" role="tab" aria-selected="${tab.id === currentTab.id ? "true" : "false"}" data-cid="detail" data-message="setDetailTab" data-value="${tab.id}">${escapeText(tab.label)}</button>`).join("")}
                  </div>
                  <div class="detail-tab-panel" role="tabpanel" aria-label="${escapeText(currentTab.title)}">
                    <h3>${escapeText(currentTab.title)}</h3>
                    ${currentTab.body}
                  </div>
                </div>
              </div>
              <aside class="detail-panel">
                <h3>${escapeText(property.title)}</h3>
                <div class="location">${escapeText(property.city)}</div>
                <div class="meta">${(property.meta || []).map((item) => /*html*/`<span>${escapeText(item)}</span>`).join("")}</div>
                <strong class="price">${escapeText(property.price)}</strong>
                <div class="action-stack">
                  <button class="gold-btn" type="button" data-route="contato">Agendar visita</button>
                  <button class="ghost-btn whatsapp" type="button" data-route="contato">WhatsApp</button>
                  <button class="ghost-btn" type="button" data-cid="detail" data-message="toggleFavorite" data-property-id="${escapeText(property.id)}">${favoriteMark(props.isFavorite(property.id))} Favoritar</button>
                </div>
                <form class="broker-card" data-cid="detail" data-message="proposal">
                  <strong>Formulario de proposta</strong>
                  <div class="mini-field"><label>Nome</label><input name="name" required placeholder="Seu nome"></div>
                  <div class="mini-field"><label>Telefone</label><input name="phone" required placeholder="(71) 99999-0000"></div>
                  <button class="gold-btn" type="submit">Enviar proposta</button>
                  ${status ? `<p class="login-error">${escapeText(status)}</p>` : ""}
                </form>
                <div class="broker-card">
                  <strong>Corretor responsavel</strong>
                  <div class="broker-person"><img class="avatar" src="${broker.photo}" alt="${escapeText(broker.name)}"><div><strong>${escapeText(broker.name)}</strong><div class="location">${escapeText(broker.creci)}</div></div></div>
                  <button class="ghost-btn" type="button" data-route="comprar">Ver todos os imoveis</button>
                </div>
              </aside>
            </div>
            ${galleryOpen ? `
              <div class="gallery-modal" role="dialog" aria-modal="true" aria-label="Galeria de imagens">
                <button class="gallery-modal-backdrop" type="button" data-cid="detail" data-message="closeGallery" aria-label="Fechar galeria"></button>
                <div class="gallery-modal-panel">
                  <button class="gallery-modal-close" type="button" data-cid="detail" data-message="closeGallery" aria-label="Fechar">&times;</button>
                  <button class="gallery-modal-nav gallery-modal-prev" type="button" data-cid="detail" data-message="prevGallery" aria-label="Imagem anterior">&lsaquo;</button>
                  <img class="gallery-modal-image" src="${currentGalleryImage}" alt="${escapeText(property.title)}">
                  <button class="gallery-modal-nav gallery-modal-next" type="button" data-cid="detail" data-message="nextGallery" aria-label="Proxima imagem">&rsaquo;</button>
                </div>
              </div>
            ` : ""}
            <div class="container">
              <div class="section-title"><div><span class="eyebrow">Semelhantes</span><h2>Imoveis semelhantes</h2></div></div>
              <div class="property-grid">${properties.filter((item) => item.id !== property.id).slice(0, 3).map((item) => renderPropertyCard(item)).join("")}</div>
            </div>
          </section>
        `,
      };
    },
  };
};
