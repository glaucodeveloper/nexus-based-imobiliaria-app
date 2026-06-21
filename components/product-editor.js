  const ProductEditorComponent = ({ props }) => {
    let draft = collectionEmptyItem("properties");
    let activeKey = "";
    let status = "";
    const renderEditable = (tag, label, name, value, type = "text", className = "", attrs = "") => {
      const empty = value === "" || value === null || value === undefined;
      const editableAttrs = `contenteditable="true" spellcheck="false" role="textbox" aria-label="${escapeHtml(label)}" data-cid="editor" data-message="updateField" data-name="${name}" data-type="${type}" data-placeholder="${escapeHtml(label)}" data-empty="${empty ? "true" : "false"}"`;
      const body = empty ? "" : escapeHtml(value);
      const classes = ["editable-surface", className].filter(Boolean).join(" ");
      return /*html*/`<${tag} class="${classes}" ${editableAttrs} ${attrs}>${body}</${tag}>`;
    };
    const renderImageSlot = (property, index, image, label, className = "", mode = "thumb") => {
      const hasImage = Boolean(image);
      const alt = escapeHtml(property.title || label);
      const body = hasImage
        ? `<img class="editable-media-image" src="${image}" alt="${alt}" loading="lazy">`
        : `<div class="editable-media-placeholder" aria-hidden="true"><span class="editable-media-icon editable-media-icon-large"><svg viewBox="0 0 24 24" focusable="false" aria-hidden="true"><path d="M7 7l1.5-2h7L17 7h3a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h3zm5 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm0-2.2A1.8 1.8 0 1 1 12 10.8a1.8 1.8 0 0 1 0 3.6z"></path></svg></span><span class="editable-media-empty-label">${mode === "main" ? "Adicionar foto principal" : `Foto ${index + 1}`}</span></div>`;
      const overlay = mode === "main" ? `
          <span class="editable-media-overlay">
            <span class="editable-media-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
                <path d="M7 7l1.5-2h7L17 7h3a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h3zm5 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm0-2.2A1.8 1.8 0 1 1 12 10.8a1.8 1.8 0 0 1 0 3.6z"></path>
              </svg>
            </span>
            <span class="editable-media-text">Trocar imagem</span>
          </span>
      ` : "";
      if (mode === "main") {
      return /*html*/`
        <label class="editable-media ${className}" aria-label="${escapeHtml(label)}">
          ${body}
          ${overlay}
          <input class="editable-media-input" type="file" accept="image/*" data-cid="editor" data-message="updateImage" data-name="images" data-image-index="${index}">
        </label>
      `;
      }
      return /*html*/`
        <button class="editable-media ${className}" type="button" aria-label="${escapeHtml(label)}" data-cid="editor" data-message="promoteImage" data-image-index="${index}">
          ${body}
        </button>
      `;
    };
    const renderPreview = (property, editMode) => {
      const meta = Array.isArray(property.meta) ? property.meta : [];
      const features = Array.isArray(property.features) ? property.features : [];
      const images = Array.isArray(property.images) ? property.images.filter(Boolean) : [];
      const previewImage = property.image || "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=85";
      const thumbs = [images[0] || previewImage, images[1] || "", images[2] || "", images[3] || ""];
      return /*html*/`
        <div>
          <div class="gallery">
            ${renderImageSlot(property, 0, thumbs[0], editMode ? "Imagem principal - editar" : "Imagem principal", "gallery-main", "main")}
            ${renderImageSlot(property, 1, thumbs[1], "Imagem secundária 1", "gallery-thumb")}
            ${renderImageSlot(property, 2, thumbs[2], "Imagem secundária 2", "gallery-thumb")}
            ${renderImageSlot(property, 3, thumbs[3], "Imagem secundária 3", "gallery-thumb")}
          </div>
          <div class="detail-copy">
            <span class="eyebrow">${editMode ? "Editar produto" : "Novo produto"}</span>
            <span class="editor-line">
              <span class="editor-line-label">Codigo</span>
              ${renderEditable("span", "Codigo", "id", property.id || "gerado automaticamente", "text", "editable-inline editable-code")}
            </span>
            ${renderEditable("h2", "Titulo do produto", "title", property.title || "", "text", "editable-title")}
            ${renderEditable("p", "Subtitulo", "type", property.type || "", "text", "editable-kicker")}
            ${renderEditable("p", "Descricao", "description", property.description || "Esta tela espelha a pagina do imovel, mas com o formulario embutido para criar ou ajustar o produto antes de publicar no GitHub.", "textarea", "editable-description")}
            <ul class="feature-list">
              <li>Area total: ${renderEditable("span", "Area total", "area", String(property.area || 0), "number", "editable-inline editable-number")} m2</li>
              <li>${renderEditable("span", "Quartos", "bedrooms", String(property.bedrooms || 0), "number", "editable-inline editable-number")} quartos, ${renderEditable("span", "Suites", "suites", String(property.suites || 0), "number", "editable-inline editable-number")} suites, ${renderEditable("span", "Banheiros", "bathrooms", String(property.bathrooms || 0), "number", "editable-inline editable-number")} banheiros e ${renderEditable("span", "Vagas", "parking", String(property.parking || 0), "number", "editable-inline editable-number")} vagas</li>
              <li>Condominio ${renderEditable("span", "Condominio", "condominium", property.condominium || "sem valor", "text", "editable-inline")} e IPTU ${renderEditable("span", "IPTU", "iptu", property.iptu || "sem valor", "text", "editable-inline")}</li>
            </ul>
            <div class="editor-preview-grid">
              ${renderEditable("strong", "Preco", "price", property.price || "Sem preco", "text", "preview-stat editable-price")}
              ${renderEditable("span", "Categoria", "kind", property.kind || property.type || "Imovel", "text", "editable-chip")}
              ${renderEditable("span", "Etiqueta", "tag", property.tag || "Sem etiqueta", "text", "editable-chip")}
            </div>
            ${renderEditable("div", "Cidade completa", "city", property.city || "", "text", "location editable-location")}
            ${renderEditable("div", "Cidade-base", "cityName", property.cityName || "", "text", "location editable-location")}
            ${renderEditable("div", "Bairro", "neighborhood", property.neighborhood || "", "text", "location editable-location")}
            ${renderEditable("div", "Metadados", "meta", meta.length ? meta.join(", ") : "", "textarea", "editable-meta")}
            ${renderEditable("div", "Caracteristicas", "features", features.length ? features.join(", ") : "", "textarea", "editable-meta")}
          </div>
        </div>
      `;
    };
    return {
      next(message = {}) {
        const route = props.getRoute();
        const editMode = route === "imovel-editar";
        const baseProperty = editMode ? props.getSelectedProperty() : null;
        const editorKey = `${route}:${baseProperty?.id || "new"}`;
        if (editorKey !== activeKey) {
          draft = propertyDraftFrom(baseProperty);
          activeKey = editorKey;
          status = "";
        }
        if (message.type === "updateField") {
          const fieldType = message.target?.dataset?.type || "text";
          const rawValue = typeof message.value === "string"
            ? message.value
            : String(message.target?.textContent ?? "");
          const nextValue = fieldType === "textarea" ? rawValue : rawValue.trim();
          draft = { ...draft, [message.name]: fieldType === "number" ? nextValue.replace(/[^\d.-]/g, "") : nextValue };
        }
        if (message.type === "updateImage") {
          const file = message.target?.files?.[0];
          if (!file) return;
          const slotIndex = Number(message.target?.dataset?.imageIndex || 0);
          return fileToDataUrl(file).then((dataUrl) => {
            const nextImages = Array.isArray(draft.images) ? draft.images.slice() : [];
            nextImages[slotIndex] = dataUrl;
            const primaryImage = nextImages.find(Boolean) || dataUrl;
            draft = {
              ...draft,
              images: nextImages.filter(Boolean),
              image: primaryImage,
            };
            status = "Imagem atualizada no editor.";
          });
        }
        if (message.type === "promoteImage") {
          const slotIndex = Number(message.target?.dataset?.imageIndex || 0);
          const nextImages = Array.isArray(draft.images) ? draft.images.slice() : [];
          if (!nextImages[slotIndex]) return;
          if (slotIndex === 0) return;
          const [selectedImage] = nextImages.splice(slotIndex, 1);
          nextImages.unshift(selectedImage);
          draft = {
            ...draft,
            images: nextImages.filter(Boolean),
            image: nextImages[0] || selectedImage,
          };
          status = "Imagem principal atualizada.";
        }
        if (message.type === "saveProperty") {
          status = "Salvando no GitHub...";
          actionNotice = "Salvando produto no GitHub...";
          return props.saveProperty(draft, baseProperty?.id).then((result) => {
            status = result.message || "Produto salvo no GitHub.";
            actionNotice = result.message || "Produto salvo no GitHub.";
            props.goToRoute("imovel", { propertyId: result.property.id });
            return result;
          }).catch((error) => {
            status = error.message;
            actionNotice = error.message;
            throw error;
          });
        }
        if (message.type === "deleteProperty") {
          status = "Excluindo...";
          actionNotice = "Excluindo produto...";
          return props.deleteProperty(baseProperty?.id).then((result) => {
            status = result.message || "Produto removido.";
            actionNotice = result.message || "Produto removido.";
            props.goToRoute("dashboard");
            return result;
          }).catch((error) => {
            status = error.message;
            actionNotice = error.message;
            throw error;
          });
        }
        if (message.type === "cancel") {
          actionNotice = editMode ? "Alteracoes descartadas." : "Operacao cancelada.";
          props.goToRoute(editMode ? "imovel" : "dashboard", editMode && baseProperty ? { propertyId: baseProperty.id } : {});
        }
        const normalized = normalizeDashboardItem("properties", draft);
        const fields = DASHBOARD_COLLECTION_SCHEMAS.properties.fields;
        return {
          done: false,
          value: /*html*/`
            <section id="${editMode ? "imovel-editar" : "imovel-novo"}" class="dashboard-section editor-section">
              <div class="dashboard-shell editor-shell">
                <aside class="dashboard-nav">
                  <div class="dashboard-nav-top">
                    ${brand()}
                    <button class="ghost-btn dashboard-back" type="button" data-cid="editor" data-message="cancel">Voltar</button>
                  </div>
                  <div class="dash-menu">
                    <button class="active" type="button">${editMode ? "Editar produto" : "Novo produto"}</button>
                    <button type="button" data-cid="editor" data-message="saveProperty">${editMode ? "Salvar alterações" : "Criar produto"}</button>
                    ${editMode ? `<button type="button" data-cid="editor" data-message="deleteProperty">Excluir produto</button>` : ""}
                    <button type="button" data-cid="editor" data-message="cancel">Cancelar</button>
                    <p class="route-note editor-note">Clique em qualquer bloco com contorno para editar direto na página. O salvamento continua indo para o GitHub.</p>
                  </div>
                </aside>
                <div class="dashboard-board editor-board">
                  <div class="dashboard-head">
                    <div>
                      <span class="eyebrow">Produto</span>
                      <h2>${editMode ? "Editar produto" : "Criar produto"}</h2>
                      <p>${editMode ? "Ajuste os dados e publique a nova versao do imovel no GitHub." : "Preencha os dados para gerar um novo produto e publicar no GitHub."}</p>
                    </div>
                    <div class="broker-person"><img class="avatar" src="${normalized.image || props.editorImage?.() || "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=85"}" alt="Preview"><div><strong>${escapeHtml(normalized.title || "Produto")}</strong><div class="location">${escapeHtml(normalized.city || "Sem localizacao")}</div></div></div>
                  </div>
                  ${renderActionBanner()}
                  <div class="detail-layout editor-layout">
                    ${renderPreview(normalized, editMode)}
                  </div>
                  ${status ? `<p class="login-error">${status}</p>` : ""}
                </div>
              </div>
            </section>
          `,
        };
      },
    };
  };
