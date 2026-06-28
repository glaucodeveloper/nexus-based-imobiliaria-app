const AboutComponent = ({ props }) => {
  let activeSection = "historia";
  let draft = null;
  let status = "";

  const getDefaultAbout = () => dashboardContent.about || {};

  const renderEditable = (tag, label, name, value, className = "", attrs = "") => {
    const empty = value === "" || value === null || value === undefined;
    const escaped = escapeHtml(String(value ?? ""));
    const editableAttrs = `contenteditable="true" spellcheck="false" role="textbox" aria-label="${label}" data-cid="about" data-message="updateField" data-name="${name}" data-placeholder="${label}" data-empty="${empty ? "true" : "false"}"`;
    const classes = ["editable-surface", className].filter(Boolean).join(" ");
    return /*html*/`<${tag} class="${classes}" ${editableAttrs} ${attrs}>${escaped}</${tag}>`;
  };

  const renderImageSlot = (name, image, label) => {
    const hasImage = Boolean(image);
    const body = hasImage
      ? `<img class="editable-media-image" src="${image}" alt="${label}" loading="lazy">`
      : `<div class="editable-media-placeholder" aria-hidden="true"><span class="editable-media-icon editable-media-icon-large"><svg viewBox="0 0 24 24" focusable="false" aria-hidden="true"><path d="M7 7l1.5-2h7L17 7h3a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h3zm5 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm0-2.2A1.8 1.8 0 1 1 12 10.8a1.8 1.8 0 0 1 0 3.6z"></path></svg></span><span class="editable-media-empty-label">Adicionar imagem</span></div>`;
    const overlay = `<span class="editable-media-overlay"><span class="editable-media-icon" aria-hidden="true"><svg viewBox="0 0 24 24" focusable="false" aria-hidden="true"><path d="M7 7l1.5-2h7L17 7h3a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h3zm5 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm0-2.2A1.8 1.8 0 1 1 12 10.8a1.8 1.8 0 0 1 0 3.6z"></path></svg></span><span class="editable-media-text">Trocar imagem</span></span>`;
    return /*html*/`<label class="editable-media about-visual" aria-label="${label}">${body}${overlay}<input class="editable-media-input" type="file" accept="image/*" data-cid="about" data-message="updateImage" data-name="${name}"></label>`;
  };

  const sections = {
    historia: { label: "Hist\u00f3ria", icon: "\u2726" },
    missao: { label: "Miss\u00e3o & Valores", icon: "\u25c6" },
    diferenciais: { label: "Diferenciais", icon: "\u2756" },
    equipe: { label: "Equipe", icon: "\u2642" },
  };

  const isDashboard = () => props.getRoute?.() === "dashboard";

  const renderTab = (key) => {
    const s = sections[key];
    const isActive = activeSection === key;
    return `<button class="about-tab ${isActive ? "active" : ""}" type="button" data-cid="about" data-message="switchSection" data-value="${key}">
      <span class="about-tab-icon">${s.icon}</span>
      <span>${s.label}</span>
    </button>`;
  };

  const renderSection = (about, editing) => {
    const s = sections[activeSection];

    if (activeSection === "diferenciais") {
      const items = about.diferenciais || [];
      return /*html*/`
        <div class="about-differentials fade-up">
          <div class="about-diff-grid">
            ${items.map((item, i) => /*html*/`
              <article class="about-diff-card">
                <span class="about-diff-icon">\u2726</span>
                ${editing ? renderEditable("strong", "Titulo", `diferenciais.${i}.title`, item.title || "", "editable-kicker") : `<strong>${item.title || ""}</strong>`}
                ${editing ? renderEditable("p", "Descricao", `diferenciais.${i}.desc`, item.desc || "", "editable-description") : `<p>${item.desc || ""}</p>`}
              </article>
            `).join("")}
          </div>
        </div>
      `;
    }

    if (activeSection === "equipe") {
      return /*html*/`
        <div class="about-team fade-up">
          <div class="about-team-grid">
            ${brokers.map((broker) => /*html*/`
              <article class="about-team-card">
                <img src="${broker.photo}" alt="${broker.name}" loading="lazy">
                <strong>${broker.name}</strong>
                <span>${broker.creci || ""}</span>
                <p>${broker.specialty || broker.bio || ""}</p>
              </article>
            `).join("")}
          </div>
        </div>
      `;
    }

    const sectionData = about[activeSection] || {};
    const copy = sectionData.copy || "";
    const detail = sectionData.detail || "";
    const image = sectionData.image || "";

    return /*html*/`
      <div class="about-body fade-up">
        <div class="about-text">
          ${editing
            ? renderEditable("p", "Paragrafo principal", `${activeSection}.copy`, copy, "about-lead editable-description")
            : `<p class="about-lead">${copy}</p>`}
          ${editing
            ? renderEditable("p", "Paragrafo complementar", `${activeSection}.detail`, detail, "about-detail editable-description")
            : `<p class="about-detail">${detail}</p>`}
        </div>
        <div class="about-visual-slot">
          ${editing
            ? renderImageSlot(`${activeSection}.image`, image, `Imagem ${sections[activeSection].label}`)
            : `<div class="about-visual"><img src="${image}" alt="${sections[activeSection].label}" loading="lazy"></div>`}
        </div>
      </div>
    `;
  };

  return {
    next(message = {}) {
      const about = draft || getDefaultAbout();
      const editing = isDashboard();

      if (message.type === "switchSection") {
        activeSection = message.value || "historia";
      }
      if (message.type === "updateField" && editing) {
        const name = message.name;
        const rawValue = typeof message.value === "string" ? message.value : String(message.target?.textContent ?? "");
        const parts = name.split(".");
        if (parts.length === 3 && parts[0] === "diferenciais") {
          const idx = parseInt(parts[1], 10);
          const key = parts[2];
          const nextDiff = Array.isArray(about.diferenciais) ? about.diferenciais.slice() : [];
          if (!nextDiff[idx]) nextDiff[idx] = { title: "", desc: "" };
          nextDiff[idx] = { ...nextDiff[idx], [key]: rawValue.trim() };
          draft = { ...about, diferenciais: nextDiff };
        } else if (parts.length === 2) {
          draft = { ...about, [parts[0]]: { ...(about[parts[0]] || {}), [parts[1]]: rawValue.trim() } };
        }
      }
      if (message.type === "updateImage" && editing) {
        const file = message.target?.files?.[0];
        if (!file) return { done: false, value: "" };
        const name = message.name;
        const parts = name.split(".");
        return fileToDataUrl(file).then((dataUrl) => {
          if (parts.length === 2) {
            draft = { ...about, [parts[0]]: { ...(about[parts[0]] || {}), [parts[1]]: dataUrl } };
          }
          status = "Imagem atualizada.";
        });
      }
      if (message.type === "saveAbout" && editing) {
        const dataToSave = draft || about;
        dashboardContent = { ...dashboardContent, about: dataToSave };
        draft = null;
        status = "Conteudo salvo.";
        if (typeof props.saveDashboard === "function") return props.saveDashboard(dashboardContent).then(() => { props.requestRender?.(); });
        props.requestRender?.();
      }

      if (!editing && draft) draft = null;

      const currentAbout = draft || getDefaultAbout();

      return {
        done: false,
        value: /*html*/`
          <section class="section about-section ${editing ? "about-section--editor" : ""}">
            <div class="container">
              ${!editing ? `<div class="breadcrumb-row"><span>In\u00edcio</span><span>Sobre n\u00f3s</span></div>` : ""}
              <div class="about-hero">
                <span class="eyebrow">Mezanino Imobili\u00e1ria</span>
                <h2>Sobre n\u00f3s</h2>
                <p>${editing ? "Edite os textos diretamente clicando nos campos. Altere imagens pelo bot\u00e3o de upload." : "Conhe\u00e7a a hist\u00f3ria, os valores e a equipe que transforma neg\u00f3cios imobili\u00e1rios em rela\u00e7\u00f5es duradouras."}</p>
              </div>
              <div class="about-tabs">
                ${Object.keys(sections).map(renderTab).join("")}
              </div>
              ${renderSection(currentAbout, editing)}
              ${editing ? `<div class="about-editor-actions"><button class="ghost-btn" type="button" data-cid="dashboard" data-message="setTab" data-value="overview">Voltar</button><button class="gold-btn" type="button" data-cid="about" data-message="saveAbout">Salvar conte\u00fado</button></div>` : ""}
              ${!editing ? `<div class="about-cta">
                <div class="about-cta-copy">
                  <h3>Pronto para conversar?</h3>
                  <p>Nossa equipe est\u00e1 dispon\u00edvel para entender exatamente o que voc\u00ea procura.</p>
                </div>
                <div class="about-cta-actions">
                  <a class="gold-btn" href="#contato" data-route="contato">Fale conosco</a>
                  <a class="ghost-btn" href="#comprar" data-route="comprar">Ver im\u00f3veis</a>
                </div>
              </div>` : ""}
              ${status ? `<p class="route_note">${status}</p>` : ""}
            </div>
          </section>
        `,
      };
    },
  };
};
