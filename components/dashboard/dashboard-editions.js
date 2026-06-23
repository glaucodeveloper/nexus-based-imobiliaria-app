const DashboardEditionsComponent = ({ props }) => {
  let activeSection = "hero";
  let status = "";

  const getEditions = () => dashboardContent.editions || {};

  const renderEditable = (tag, label, name, value, className = "", attrs = "") => {
    const empty = value === "" || value === null || value === undefined;
    const escaped = escapeHtml(String(value ?? ""));
    const editableAttrs = `contenteditable="true" spellcheck="false" role="textbox" aria-label="${label}" data-cid="editions" data-message="updateField" data-name="${name}" data-placeholder="${label}" data-empty="${empty ? "true" : "false"}"`;
    const classes = ["editable-surface", className].filter(Boolean).join(" ");
    return /*html*/`<${tag} class="${classes}" ${editableAttrs} ${attrs}>${escaped}</${tag}>`;
  };

  const renderImageSlot = (name, image, label) => {
    const hasImage = Boolean(image);
    const body = hasImage
      ? `<img class="editable-media-image" src="${image}" alt="${label}" loading="lazy">`
      : `<div class="editable-media-placeholder" aria-hidden="true"><span class="editable-media-icon editable-media-icon-large"><svg viewBox="0 0 24 24" focusable="false" aria-hidden="true"><path d="M7 7l1.5-2h7L17 7h3a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h3zm5 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm0-2.2A1.8 1.8 0 1 1 12 10.8a1.8 1.8 0 0 1 0 3.6z"></path></svg></span><span class="editable-media-empty-label">Adicionar imagem</span></div>`;
    const overlay = `<span class="editable-media-overlay"><span class="editable-media-icon" aria-hidden="true"><svg viewBox="0 0 24 24" focusable="false" aria-hidden="true"><path d="M7 7l1.5-2h7L17 7h3a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h3zm5 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm0-2.2A1.8 1.8 0 1 1 12 10.8a1.8 1.8 0 0 1 0 3.6z"></path></svg></span><span class="editable-media-text">Trocar imagem</span></span>`;
    return /*html*/`<label class="editable-media editions-visual" aria-label="${label}">${body}${overlay}<input class="editable-media-input" type="file" accept="image/*" data-cid="editions" data-message="updateImage" data-name="${name}"></label>`;
  };

  const sections = {
    hero: { label: "Hero", icon: "\u2302", description: "Sessao principal da home com titulo e chamada." },
    featured: { label: "Destaques", icon: "\u2726", description: "Sessao de imoveis em destaque do site." },
    about: { label: "Sobre nos", icon: "\u25c6", description: "Sessao institucional com historia e valores." },
    contact: { label: "Contato", icon: "\u2709", description: "Sessao de contato e atendimento." },
  };

  const renderTab = (key) => {
    const s = sections[key];
    const isActive = activeSection === key;
    return /*html*/`<button class="about-tab ${isActive ? "active" : ""}" type="button" data-cid="editions" data-message="switchSection" data-value="${key}">
      <span class="about-tab-icon">${s.icon}</span>
      <span>${s.label}</span>
    </button>`;
  };

  const renderSection = (editions) => {
    const sectionData = editions[activeSection] || {};
    const s = sections[activeSection];
    const hasTitle = "title" in sectionData;
    const hasSubtitle = "subtitle" in sectionData;
    const hasCopy = "copy" in sectionData;
    const hasImage = "image" in sectionData;

    return /*html*/`
      <div class="editions-body fade-up">
        <div class="editions-text">
          <span class="eyebrow">${s.label}</span>
          <p class="editions-section-desc">${s.description}</p>
          ${hasTitle
            ? renderEditable("h3", "Titulo", `${activeSection}.title`, sectionData.title || "", "editable-title editions-field-title")
            : ""}
          ${hasSubtitle
            ? renderEditable("p", "Subtitulo", `${activeSection}.subtitle`, sectionData.subtitle || "", "editable-kicker editions-field-subtitle")
            : ""}
          ${hasCopy
            ? renderEditable("p", "Texto", `${activeSection}.copy`, sectionData.copy || "", "editable-description editions-field-copy")
            : ""}
        </div>
        <div class="editions-visual-slot">
          ${hasImage
            ? renderImageSlot(`${activeSection}.image`, sectionData.image || "", `Imagem ${s.label}`)
            : ""}
        </div>
      </div>
    `;
  };

  return {
    next(message = {}) {
      const editions = getEditions();

      if (message.type === "switchSection") {
        activeSection = message.value || "hero";
      }
      if (message.type === "updateField") {
        const name = message.name;
        const rawValue = typeof message.value === "string" ? message.value : String(message.target?.textContent ?? "");
        const parts = name.split(".");
        if (parts.length === 2) {
          dashboardContent = {
            ...dashboardContent,
            editions: {
              ...editions,
              [parts[0]]: { ...(editions[parts[0]] || {}), [parts[1]]: rawValue.trim() },
            },
          };
        }
        return { done: false, value: "" };
      }
      if (message.type === "updateImage") {
        const file = message.target?.files?.[0];
        if (!file) return { done: false, value: "" };
        const name = message.name;
        const parts = name.split(".");
        return fileToDataUrl(file).then((dataUrl) => {
          if (parts.length === 2) {
            dashboardContent = {
              ...dashboardContent,
              editions: {
                ...getEditions(),
                [parts[0]]: { ...(getEditions()[parts[0]] || {}), [parts[1]]: dataUrl },
              },
            };
          }
          status = "Imagem atualizada.";
        });
      }
      if (message.type === "saveEditions") {
        status = "Edicoes salvas.";
        if (typeof props.saveDashboard === "function") return props.saveDashboard(dashboardContent).then(() => { props.requestRender?.(); });
        props.requestRender?.();
      }

      const currentEditions = getEditions();

      return {
        done: false,
        value: /*html*/`
          <div class="editions-section about-section--editor">
            <div class="editions-hero">
              <span class="eyebrow">Edicoes do site</span>
              <h3>Editar sessoes</h3>
              <p>Clique nos campos de texto para editar direto na pagina. Clique no slot de imagem para fazer upload.</p>
            </div>
            <div class="about-tabs">
              ${Object.keys(sections).map(renderTab).join("")}
            </div>
            ${renderSection(currentEditions)}
            <div class="about-editor-actions">
              <button class="ghost-btn" type="button" data-cid="dashboard" data-message="setTab" data-value="overview">Voltar</button>
              <button class="gold-btn" type="button" data-cid="editions" data-message="saveEditions">Salvar edicoes</button>
            </div>
            ${status ? `<p class="route_note">${status}</p>` : ""}
          </div>
        `,
      };
    },
  };
};
