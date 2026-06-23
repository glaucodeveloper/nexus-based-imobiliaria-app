const DashboardCollectionCardComponent = ({ props }) => {
  const collection = props.collection;
  const schema = DASHBOARD_COLLECTION_SCHEMAS[collection];
  const metrics = props.metrics || [];
  const activities = props.activities || [];
  const appointments = props.appointments || [];
  const attachmentRows = Number(props.attachmentRows || 2);
  const viewMode = props.viewMode || "grid";
  const selectedEntityId = props.selectedEntityId || null;
  const routeInfo = props.routeInfo || {};
  const crudWorkspace = props.crudWorkspace || null;
  const escapeText = (value) =>
    String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  const slugId = (value) =>
    String(value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  const itemId = (item, fallback = "item") =>
    item?.id ||
    slugId(
      item?.name ||
        item?.title ||
        item?.label ||
        item?.client ||
        item?.broker ||
        item?.property ||
        fallback,
    );
  const openDashboard = (tab, entityId = "") =>
    `#dashboard?tab=${encodeURIComponent(tab)}${entityId ? `&entityId=${encodeURIComponent(entityId)}` : ""}`;
  const entityLink = (kind, entity) => {
    const id = itemId(entity, kind);
    if (kind === "property") return `#imovel#${encodeURIComponent(id)}`;
    if (kind === "broker") return openDashboard("brokers", id);
    if (kind === "client") return openDashboard("clients", id);
    if (kind === "appointment") return openDashboard("appointments", id);
    return openDashboard("overview");
  };
  const toolbar = (title, subtitle, actions) => /*html*/ `
    <div class="dashboard-toolbar">
      <div><strong>${title}</strong><span>${subtitle}</span></div>
      <div class="dashboard-toolbar-actions">${actions}</div>
    </div>
  `;
  const whatsappLink = (phone, text) => {
    const clean = String(phone || "").replace(/\D/g, "");
    return clean
      ? `https://wa.me/${clean}?text=${encodeURIComponent(text)}`
      : "#";
  };
  const relatedFrom = (item, keys) => {
    const next = [];
    keys.forEach((key) => {
      const value = item?.[key];
      if (Array.isArray(value)) next.push(...value);
      else if (value)
        next.push(
          ...String(value)
            .split(/\r?\n|,/)
            .map((entry) => entry.trim())
            .filter(Boolean),
        );
    });
    return [...new Set(next)];
  };
  const appointmentDateKey = (value) => {
    const text = String(value || "");
    const iso = text.match(/\d{4}-\d{2}-\d{2}/);
    if (iso) return iso[0];
    const dm = text.match(/(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?/);
    if (!dm) return "";
    const year = dm[3]
      ? dm[3].length === 2
        ? `20${dm[3]}`
        : dm[3]
      : new Date().getFullYear();
    return `${year}-${String(dm[2]).padStart(2, "0")}-${String(dm[1]).padStart(2, "0")}`;
  };
  const todayKey = new Date().toISOString().slice(0, 10);
  const monthDays = () => {
    const current = new Date();
    const first = new Date(current.getFullYear(), current.getMonth(), 1);
    const start = new Date(first);
    start.setDate(first.getDate() - ((first.getDay() + 6) % 7));
    return Array.from({ length: 42 }, (_, index) => {
      const date = new Date(start);
      date.setDate(start.getDate() + index);
      return date;
    });
  };
  const openState = routeInfo.selectedEntityId || selectedEntityId;
  const crudIsOpen = crudWorkspace?.collection === collection;
  const crudMode = crudWorkspace?.mode || "create";
  const crudDraftId = crudWorkspace?.entityId || null;
  const crudDraft =
    crudIsOpen && crudDraftId
      ? (props.items || []).find(
          (item) => String(itemId(item)) === String(crudDraftId),
        ) || null
      : null;
  const renderEntityChips = (kind, values) =>
    values
      .map(
        (value) =>
          /*html*/ `<a class="entity-chip" href="${entityLink(kind, { id: value, name: value, title: value, label: value })}" data-route="${kind === "property" ? "imovel" : "dashboard"}" ${kind === "property" ? `data-property-id="${escapeText(value)}"` : `data-dashboard-tab="${kind === "broker" ? "brokers" : kind === "client" ? "clients" : "appointments"}" data-entity-id="${escapeText(value)}"`}>${escapeText(value)}</a>`,
      )
      .join("");
  const renderCloseAction = () =>
    `<button class="ghost-btn" type="button" data-cid="dashboard" data-message="closeCrudWorkspace">Voltar para lista</button>`;
  const renderField = (field, draft = {}) => {
    const value = draft?.[field.name] ?? "";
    if (field.type === "textarea") {
      return /*html*/ `<label class="mini-field mini-field--wide"><span>${escapeText(field.label)}</span><textarea name="${escapeText(field.name)}" rows="${field.rows || 4}" placeholder="${escapeText(field.placeholder || "")}">${escapeText(value)}</textarea></label>`;
    }
    const inputType =
      field.type === "number"
        ? "number"
        : field.type === "email"
          ? "email"
          : field.type === "file"
            ? "file"
            : "text";
    return /*html*/ `<label class="mini-field"><span>${escapeText(field.label)}</span><input name="${escapeText(field.name)}" type="${inputType}" ${field.type === "file" ? "" : `value="${escapeText(value)}"`} placeholder="${escapeText(field.placeholder || "")}"></label>`;
  };
  const renderSchemaForm = (mode, draft = {}) => {
    if (!schema?.fields?.length) return "";
    const submitLabel =
      mode === "edit"
        ? `Salvar ${schema?.itemLabel || "item"}`
        : `Salvar ${schema?.itemLabel || "item"}`;
    return /*html*/ `
      <article class="dashboard-card dashboard-crud-stage is-expanded">
        <div class="dashboard-card-head dashboard-crud-stage-head">
          <div>
            <span class="eyebrow">${escapeText(schema.label || schema.title || "CRUD")}</span>
            <h3>${mode === "edit" ? `Editar ${schema?.itemLabel || "item"}` : `Novo ${schema?.itemLabel || "item"}`}</h3>
            <p>${mode === "edit" ? "O formulario já vem preenchido com os dados atuais da entidade." : schema.description || "Preencha os dados para criar um novo registro."}</p>
          </div>
          <div class="dashboard-form-actions dashboard-form-actions--compact">
            ${renderCloseAction()}
          </div>
        </div>
        <form class="dashboard-crud-form" data-cid="dashboard" data-message="saveItem" data-collection="${collection}">
          <input type="hidden" name="id" value="${escapeText(draft?.id || crudDraftId || "")}">
          <div class="client-cv-grid dashboard-crud-grid">
            ${schema.fields.map((field) => renderField(field, draft)).join("")}
          </div>
          <div class="dashboard-form-actions">
            <button class="gold-btn" type="submit">${submitLabel}</button>
          </div>
        </form>
      </article>
    `;
  };

  const renderClientForm = (draft = {}) => /*html*/ `
    <article class="dashboard-card dashboard-crud-stage is-expanded">
      <div class="dashboard-card-head dashboard-crud-stage-head">
        <div>
          <span class="eyebrow">Clientes</span>
          <h3>${crudMode === "edit" ? "Editar cliente" : "Novo cliente"}</h3>
          <p>Preencha a ficha como um curriculo comercial e anexe os arquivos dinamicos.</p>
        </div>
        <div class="dashboard-form-actions dashboard-form-actions--compact">
          ${renderCloseAction()}
        </div>
      </div>
      <form class="client-cv-form dashboard-crud-form" data-cid="dashboard" data-message="saveItem" data-collection="clients">
        <div class="client-cv-grid dashboard-crud-grid">
          <label class="mini-field"><span>Nome</span><input name="name" type="text" placeholder="Nome completo" value="${escapeText(draft.name || "")}"></label>
          <label class="mini-field"><span>Telefone</span><input name="phone" type="text" placeholder="(71) 99999-0000" value="${escapeText(draft.phone || "")}"></label>
          <label class="mini-field"><span>E-mail</span><input name="email" type="email" placeholder="cliente@dominio.com" value="${escapeText(draft.email || "")}"></label>
          <label class="mini-field"><span>Perfil</span><input name="profile" type="text" placeholder="Comprador, investidor, etc." value="${escapeText(draft.profile || "")}"></label>
          <label class="mini-field"><span>Foco</span><input name="focus" type="text" placeholder="3 quartos em Salvador" value="${escapeText(draft.focus || "")}"></label>
          <label class="mini-field"><span>Faixa</span><input name="budget" type="text" placeholder="Ate R$ 1,2 mi" value="${escapeText(draft.budget || "")}"></label>
          <label class="mini-field"><span>Cidade</span><input name="city" type="text" placeholder="Salvador" value="${escapeText(draft.city || "")}"></label>
          <label class="mini-field"><span>Responsavel</span><input name="owner" type="text" placeholder="Corretor responsavel" value="${escapeText(draft.owner || "")}"></label>
          <label class="mini-field mini-field--wide client-notes"><span>Notas</span><textarea name="notes" rows="4" placeholder="Preferencias, historia, restricoes e observacoes">${escapeText(draft.notes || "")}</textarea></label>
        </div>
        <div class="attachment-stack">
          <strong>Anexos</strong>
          ${Array.from(
            { length: attachmentRows },
            (_, index) => /*html*/ `
            <div class="attachment-row">
              <label class="mini-field"><span>Anexo ${index + 1}</span><input name="attachmentLabel" data-attachment-label="true" type="text" placeholder="Documento, comprovante, etc."></label>
              <label class="mini-field"><span>Arquivo</span><input name="attachmentFile" data-attachment-file="true" type="file"></label>
            </div>
          `,
          ).join("")}
        </div>
        <div class="dashboard-form-actions">
          <button class="gold-btn" type="submit">Salvar cliente</button>
        </div>
      </form>
    </article>
  `;
  const renderAppointmentForm = (draft = {}) => /*html*/ `
    <article class="dashboard-card dashboard-crud-stage is-expanded">
      <div class="dashboard-card-head dashboard-crud-stage-head">
        <div>
          <span class="eyebrow">Agendamentos</span>
          <h3>${crudMode === "edit" ? "Editar agendamento" : "Novo agendamento"}</h3>
          <p>Vincule imoveis, vendedores e clientes ao agendamento.</p>
        </div>
        <div class="dashboard-form-actions dashboard-form-actions--compact">
          ${renderCloseAction()}
        </div>
      </div>
      <form class="client-cv-form dashboard-crud-form" data-cid="dashboard" data-message="saveItem" data-collection="appointments">
        <input type="hidden" name="id" value="${escapeText(draft?.id || crudDraftId || "")}">
        <div class="client-cv-grid dashboard-crud-grid">
          <label class="mini-field"><span>Data</span><input name="date" type="text" placeholder="22/06 - 09:30" value="${escapeText(draft.date || "")}"></label>
          <label class="mini-field"><span>Horario</span><input name="time" type="text" placeholder="09:30" value="${escapeText(draft.time || "")}"></label>
          <label class="mini-field"><span>Status</span><input name="status" type="text" placeholder="confirmado" value="${escapeText(draft.status || "")}"></label>
        </div>
        <div class="appointment-entity-section">
          <strong>Imoveis</strong>
          <div class="appointment-entity-grid">
            ${properties.map((prop) => /*html*/ `<label class="appointment-check"><input type="checkbox" name="properties" value="${escapeText(prop.id)}" ${Array.isArray(draft.properties) && draft.properties.includes(prop.id) ? "checked" : ""}><span>${escapeText(prop.title || prop.id)}</span></label>`).join("")}
          </div>
        </div>
        <div class="appointment-entity-section">
          <strong>Vendedores</strong>
          <div class="appointment-entity-grid">
            ${brokers.map((broker) => /*html*/ `<label class="appointment-check"><input type="checkbox" name="brokers" value="${escapeText(broker.id || slugId(broker.name))}" ${Array.isArray(draft.brokers) && draft.brokers.includes(broker.id || slugId(broker.name)) ? "checked" : ""}><span>${escapeText(broker.name)}</span></label>`).join("")}
          </div>
        </div>
        <div class="appointment-entity-section">
          <strong>Clientes</strong>
          <div class="appointment-entity-grid">
            ${getCollectionItems("clients")
              .map(
                (client) =>
                  /*html*/ `<label class="appointment-check"><input type="checkbox" name="clients" value="${escapeText(client.id || client.name)}" ${Array.isArray(draft.clients) && draft.clients.includes(client.id || client.name) ? "checked" : ""}><span>${escapeText(client.name || client.id)}</span></label>`,
              )
              .join("")}
          </div>
        </div>
        <div class="client-cv-grid dashboard-crud-grid">
          <label class="mini-field mini-field--wide"><span>Observacoes</span><textarea name="notes" rows="3" placeholder="Detalhes do agendamento...">${escapeText(draft.notes || "")}</textarea></label>
        </div>
        <div class="dashboard-form-actions">
          <button class="gold-btn" type="submit">Salvar agendamento</button>
        </div>
      </form>
    </article>
  `;
  const renderBrokerForm = (draft = {}) => /*html*/ `
    <article class="dashboard-card dashboard-crud-stage is-expanded">
      <div class="dashboard-card-head dashboard-crud-stage-head">
        <div>
          <span class="eyebrow">Vendedores</span>
          <h3>${crudMode === "edit" ? "Editar vendedor" : "Novo vendedor"}</h3>
          <p>Cadastre ou atualize o perfil comercial do vendedor sem sair da aba.</p>
        </div>
        <div class="dashboard-form-actions dashboard-form-actions--compact">
          ${renderCloseAction()}
        </div>
      </div>
      <form class="client-cv-form dashboard-crud-form" data-cid="dashboard" data-message="saveItem" data-collection="brokers">
        <div class="client-cv-grid dashboard-crud-grid">
          <label class="mini-field"><span>Nome</span><input name="name" type="text" placeholder="Nome completo" value="${escapeText(draft.name || "")}"></label>
          <label class="mini-field"><span>Telefone</span><input name="phone" type="text" placeholder="(71) 99999-0000" value="${escapeText(draft.phone || "")}"></label>
          <label class="mini-field"><span>Foto</span><input name="photo" type="text" placeholder="https://..." value="${escapeText(draft.photo || "")}"></label>
          <label class="mini-field"><span>CRECI</span><input name="creci" type="text" placeholder="CRECI 12345" value="${escapeText(draft.creci || "")}"></label>
          <label class="mini-field"><span>Cidade</span><input name="city" type="text" placeholder="Salvador/BA" value="${escapeText(draft.city || "")}"></label>
          <label class="mini-field"><span>Especialidade</span><input name="specialty" type="text" placeholder="Alto padrao" value="${escapeText(draft.specialty || "")}"></label>
          <label class="mini-field mini-field--wide"><span>Bio</span><textarea name="bio" rows="4" placeholder="Apresentacao do vendedor">${escapeText(draft.bio || "")}</textarea></label>
          <label class="mini-field"><span>Desempenho</span><input name="performance" type="text" placeholder="+18% conversao" value="${escapeText(draft.performance || "")}"></label>
          <label class="mini-field"><span>Status</span><input name="status" type="text" placeholder="Ativo" value="${escapeText(draft.status || "")}"></label>
        </div>
        <div class="dashboard-form-actions">
          <button class="gold-btn" type="submit">Salvar vendedor</button>
        </div>
      </form>
    </article>
  `;
  const renderMetrics = () => /*html*/ `
    ${toolbar("Metricas fixas", "Indicadores derivados da movimentacao do site.", `<button class="ghost-btn" type="button" data-cid="dashboard" data-message="refreshMetrics">Atualizar</button>`)}
    <div class="metric-grid metric-grid--fixed">
      ${metrics.map((metric, index) => /*html*/ `<article class="metric metric--fixed metric-${index + 1} metric-link" role="button" tabindex="0"><small>${escapeText(metric.label)}</small><strong>${escapeText(metric.value)}</strong><span>${escapeText(metric.note || "")}</span></article>`).join("")}
    </div>
    <div class="dashboard-card dashboard-insight-card">
      <div class="dashboard-card-head"><h3>Leitura operacional</h3><span>ao vivo</span></div>
      <div class="dashboard-insight-list">
        <div><strong>Funil</strong><span>${activities.length} eventos recentes no contexto da aba.</span></div>
        <div><strong>Vitrine</strong><span>${props.propertiesCount || 0} imoveis ativos e publicos.</span></div>
        <div><strong>Agenda</strong><span>${appointments.length} compromissos no calendario.</span></div>
      </div>
    </div>
  `;

  const renderActivities = () => {
    const resolveName = (id, collection) => {
      if (collection === "properties") {
        const p = properties.find((entry) => entry.id === id);
        return p ? p.title : id;
      }
      if (collection === "brokers") {
        const b = brokers.find(
          (entry) => (entry.id || slugId(entry.name)) === id,
        );
        return b ? b.name : id;
      }
      if (collection === "clients") {
        const c = (getCollectionItems("clients") || []).find(
          (entry) => (entry.id || entry.name) === id,
        );
        return c ? c.name : id;
      }
      return id;
    };
    const renderActivityEntityCard = (kind, id) => {
      const name = resolveName(
        id,
        kind === "property"
          ? "properties"
          : kind === "broker"
            ? "brokers"
            : "clients",
      );
      const tab =
        kind === "property"
          ? "properties"
          : kind === "broker"
            ? "brokers"
            : "clients";
      const photo =
        kind === "property"
          ? properties.find((p) => p.id === id)?.image || ""
          : kind === "broker"
            ? brokers.find((b) => (b.id || slugId(b.name)) === id)?.photo || ""
            : "";
      const sub =
        kind === "property"
          ? properties.find((p) => p.id === id)?.city || ""
          : kind === "broker"
            ? brokers.find((b) => (b.id || slugId(b.name)) === id)?.creci || ""
            : getCollectionItems("clients").find((c) => (c.id || c.name) === id)
                ?.profile || "";
      if (kind === "property") {
        return /*html*/ `<a class="entity-link-card" href="#imovel#${encodeURIComponent(id)}" data-route="imovel" data-property-id="${escapeText(id)}">
          ${photo ? `<img src="${photo}" alt="${escapeText(name)}" loading="lazy">` : `<span class="entity-link-card-icon">&#127968;</span>`}
          <div class="entity-link-card-info"><strong>${escapeText(name)}</strong>${sub ? `<span>${escapeText(sub)}</span>` : ""}</div>
        </a>`;
      }
      return /*html*/ `<button class="entity-link-card" type="button" data-cid="dashboard" data-message="setTab" data-value="${tab}">
        ${photo ? `<img src="${photo}" alt="${escapeText(name)}" loading="lazy">` : `<span class="entity-link-card-icon">${kind === "broker" ? "&#128100;" : "&#128101;"}</span>`}
        <div class="entity-link-card-info"><strong>${escapeText(name)}</strong>${sub ? `<span>${escapeText(sub)}</span>` : ""}</div>
      </button>`;
    };
    return /*html*/ `
    ${toolbar("Linha do tempo", "Accordion com cards e links para os elementos envolvidos.", `<button class="ghost-btn" type="button" data-cid="dashboard" data-message="newActivity">Novo evento</button>`)}
    <div class="timeline-accordion">
      ${activities
        .map((item, index) => {
          const relatedProperties = relatedFrom(item, [
            "properties",
            "propertyIds",
            "property",
            "detail",
          ]).filter(Boolean);
          const relatedClients = relatedFrom(item, [
            "clients",
            "clientIds",
            "client",
          ]);
          const relatedBrokers = relatedFrom(item, [
            "brokers",
            "brokerIds",
            "broker",
          ]);
          const hasEntities =
            relatedProperties.length ||
            relatedClients.length ||
            relatedBrokers.length;
          return /*html*/ `
          <details class="timeline-card timeline-card--accordion" ${index === 0 ? "open" : ""}>
            <summary class="timeline-summary">
              <span class="timeline-marker"><span class="dot" style="background:${item.color || "var(--gold)"};">${item.icon || "&#8226;"}</span></span>
              <span class="timeline-summary-copy">
                <strong>${escapeText(item.title || "Atividade")}</strong>
                <span>${escapeText(item.time || "Agora")}</span>
              </span>
            </summary>
            <div class="timeline-copy">
              <p>${escapeText(item.detail || "")}</p>
              ${
                hasEntities
                  ? /*html*/ `
                <div class="activity-entity-sections">
                  ${relatedProperties.length ? /*html*/ `<div class="activity-entity-group"><span class="activity-entity-label">Imoveis</span><div class="activity-entity-cards">${relatedProperties.map((id) => renderActivityEntityCard("property", id)).join("")}</div></div>` : ""}
                  ${relatedBrokers.length ? /*html*/ `<div class="activity-entity-group"><span class="activity-entity-label">Vendedores</span><div class="activity-entity-cards">${relatedBrokers.map((id) => renderActivityEntityCard("broker", id)).join("")}</div></div>` : ""}
                  ${relatedClients.length ? /*html*/ `<div class="activity-entity-group"><span class="activity-entity-label">Clientes</span><div class="activity-entity-cards">${relatedClients.map((id) => renderActivityEntityCard("client", id)).join("")}</div></div>` : ""}
                </div>
              `
                  : ""
              }
              ${item.image ? `<img class="timeline-image" src="${item.image}" alt="${escapeText(item.title || "Atividade")}">` : ""}
            </div>
          </details>
        `;
        })
        .join("")}
    </div>
  `;
  };

  const renderAppointments = () => {
    const groups = new Map();
    appointments.forEach((item) => {
      const key =
        appointmentDateKey(item.date || item.day || item.when) || todayKey;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(item);
    });
    const inlineForm = crudIsOpen ? renderAppointmentForm(crudDraft || {}) : "";
    const resolveName = (id, collection) => {
      if (collection === "properties") {
        const p = properties.find((entry) => entry.id === id);
        return p ? p.title : id;
      }
      if (collection === "brokers") {
        const b = brokers.find(
          (entry) => (entry.id || slugId(entry.name)) === id,
        );
        return b ? b.name : id;
      }
      if (collection === "clients") {
        const c = (getCollectionItems("clients") || []).find(
          (entry) => (entry.id || entry.name) === id,
        );
        return c ? c.name : id;
      }
      return id;
    };
    const renderEntityCard = (kind, id) => {
      const name = resolveName(
        id,
        kind === "property"
          ? "properties"
          : kind === "broker"
            ? "brokers"
            : "clients",
      );
      const tab =
        kind === "property"
          ? "properties"
          : kind === "broker"
            ? "brokers"
            : "clients";
      const photo =
        kind === "property"
          ? properties.find((p) => p.id === id)?.image || ""
          : kind === "broker"
            ? brokers.find((b) => (b.id || slugId(b.name)) === id)?.photo || ""
            : "";
      if (kind === "property") {
        return /*html*/ `<a class="entity-link-card" href="#imovel#${encodeURIComponent(id)}" data-route="imovel" data-property-id="${escapeText(id)}">
          ${photo ? `<img src="${photo}" alt="${escapeText(name)}" loading="lazy">` : `<span class="entity-link-card-icon">&#127968;</span>`}
          <span>${escapeText(name)}</span>
        </a>`;
      }
      return /*html*/ `<button class="entity-link-card" type="button" data-cid="dashboard" data-message="setTab" data-value="${tab}">
        ${photo ? `<img src="${photo}" alt="${escapeText(name)}" loading="lazy">` : `<span class="entity-link-card-icon">${kind === "broker" ? "&#128100;" : "&#128101;"}</span>`}
        <span>${escapeText(name)}</span>
      </button>`;
    };
    return /*html*/ `
      ${toolbar(
        "Agendamentos e calendario",
        "Vincule imoveis, vendedores e clientes a cada visita.",
        `
        <button class="ghost-btn" type="button" data-cid="dashboard" data-message="newItem" data-collection="appointments">Novo agendamento</button>
        <button class="gold-btn" type="button" data-cid="dashboard" data-message="jumpToday">Hoje</button>
      `,
      )}
      ${inlineForm}
      <div class="calendar-shell">
        <section class="calendar-grid">
          ${["Seg", "Ter", "Qua", "Qui", "Sex", "Sab", "Dom"].map((day) => `<span class="calendar-head">${day}</span>`).join("")}
          ${monthDays()
            .map((date) => {
              const key = date.toISOString().slice(0, 10);
              const dayItems = groups.get(key) || [];
              const outside = date.getMonth() !== new Date().getMonth();
              return /*html*/ `
              <article class="calendar-day ${outside ? "is-outside" : ""} ${key === todayKey ? "is-today" : ""}">
                <header><strong>${date.getDate()}</strong><span>${date.toLocaleDateString("pt-BR", { weekday: "short" })}</span></header>
                <div class="calendar-day-events">
                  ${dayItems
                    .slice(0, 3)
                    .map((item) => {
                      const firstBrokerId = (item.brokers || [])[0] || "";
                      const broker = brokers.find(
                        (b) => (b.id || slugId(b.name)) === firstBrokerId,
                      );
                      const phone = broker?.phone || "";
                      const text = `Ola, confirmando seu agendamento para ${item.date || ""} ${item.time || ""}.`;
                      return /*html*/ `<div class="calendar-chip"><strong>${escapeText(item.time || "--:--")}</strong><span>${escapeText(resolveName((item.clients || [])[0] || "", "clients"))}</span>${phone ? `<a class="whatsapp-btn" href="${whatsappLink(phone, text)}" target="_blank" rel="noreferrer">WhatsApp</a>` : ""}</div>`;
                    })
                    .join("")}
                </div>
              </article>
            `;
            })
            .join("")}
        </section>
        <aside class="calendar-panel">
          <div class="dashboard-card-head"><h3>Proximos agendamentos</h3><span>${appointments.length}</span></div>
          <div class="calendar-list">
            ${appointments
              .map((item) => {
                const firstBrokerId = (item.brokers || [])[0] || "";
                const broker = brokers.find(
                  (b) => (b.id || slugId(b.name)) === firstBrokerId,
                );
                const phone = broker?.phone || "";
                const text = `Ola, passando para confirmar seu agendamento para ${item.date || ""} ${item.time || ""}.`;
                return /*html*/ `
                <article class="calendar-item ${openState === itemId(item) ? "is-selected" : ""}">
                  <div>
                    <strong>${escapeText(item.date || "Agendamento")}</strong>
                    <p>${escapeText(item.status || "")}${item.time ? ` - ${escapeText(item.time)}` : ""}</p>
                    ${item.notes ? `<small>${escapeText(item.notes)}</small>` : ""}
                    <div class="appointment-entity-cards">
                      ${(item.properties || []).map((id) => renderEntityCard("property", id)).join("")}
                      ${(item.brokers || []).map((id) => renderEntityCard("broker", id)).join("")}
                      ${(item.clients || []).map((id) => renderEntityCard("client", id)).join("")}
                    </div>
                  </div>
                  <div class="calendar-item-actions">
                    ${phone ? `<a class="gold-btn" href="${whatsappLink(phone, text)}" target="_blank" rel="noreferrer">WhatsApp</a>` : ""}
                    <button class="ghost-btn danger-btn" type="button" data-cid="dashboard" data-message="deleteItem" data-collection="appointments" data-item-id="${escapeText(itemId(item))}">Excluir</button>
                  </div>
                </article>
              `;
              })
              .join("")}
          </div>
        </aside>
      </div>
    `;
  };

  const renderClients = () => {
    const cards = props.items || [];
    const listMode = viewMode === "list";
    const inlineForm = crudIsOpen ? renderClientForm(crudDraft || {}) : "";
    return /*html*/ `
      ${toolbar(
        "Cadastro manual",
        "Ficha em estilo CV com anexos dinamicos e controle comercial.",
        `
        <button class="ghost-btn" type="button" data-cid="dashboard" data-message="setCollectionView" data-collection="clients" data-value="grid">Grid</button>
        <button class="ghost-btn" type="button" data-cid="dashboard" data-message="setCollectionView" data-collection="clients" data-value="list">Lista</button>
        <button class="gold-btn" type="button" data-cid="dashboard" data-message="newItem" data-collection="clients">Novo cliente</button>
      `,
      )}
      ${inlineForm}
      <div class="dashboard-card">
        <div class="dashboard-card-head"><h3>Clientes cadastrados</h3><span>${cards.length}</span></div>
        <div class="${listMode ? "entity-list" : "client-cards"}">
          ${cards
            .map(
              (client) => /*html*/ `
            <article class="client-card ${openState === itemId(client) ? "is-selected" : ""}">
              <div class="client-card-top">
                <div>
                  <strong><a class="property-title-link" href="${openDashboard("clients", itemId(client))}" data-route="dashboard" data-dashboard-tab="clients" data-entity-id="${escapeText(itemId(client))}">${escapeText(client.name || "Cliente")}</a></strong>
                  <span>${escapeText(client.profile || "Perfil comercial")}</span>
                </div>
                <span class="client-badge">${Array.isArray(client.attachments) ? client.attachments.length : 0} anexos</span>
              </div>
              <p>${escapeText(client.focus || "")}</p>
              <div class="client-meta"><span>${escapeText(client.city || client.source || "Manual")}</span><span>${escapeText(client.owner || "Sem responsavel")}</span></div>
              <div class="client-attachments">${(client.attachments || [])
                .slice(0, 3)
                .map(
                  (attachment) =>
                    `<span>${escapeText(attachment.name || attachment.label || "Arquivo")}</span>`,
                )
                .join("")}</div>
              <div class="entity-row-actions">
                <a class="ghost-btn" href="${openDashboard("clients", itemId(client))}" data-route="dashboard" data-dashboard-tab="clients" data-entity-id="${escapeText(itemId(client))}">Abrir</a>
                <button class="ghost-btn danger-btn" type="button" data-cid="dashboard" data-message="deleteItem" data-collection="clients" data-item-id="${escapeText(itemId(client))}">Excluir</button>
              </div>
            </article>
          `,
            )
            .join("")}
        </div>
      </div>
    `;
  };

  const renderBrokers = () => {
    const cards = Array.isArray(props.items) ? props.items : [];
    const listMode = viewMode === "list";
    const inlineForm = crudIsOpen ? renderBrokerForm(crudDraft || {}) : "";
    return /*html*/ `
      ${toolbar(
        "Cadastro de vendedores",
        "Equipe comercial com cards e list view.",
        `
        <button class="ghost-btn" type="button" data-cid="dashboard" data-message="setCollectionView" data-collection="brokers" data-value="grid">Grid</button>
        <button class="ghost-btn" type="button" data-cid="dashboard" data-message="setCollectionView" data-collection="brokers" data-value="list">Lista</button>
        <button class="gold-btn" type="button" data-cid="dashboard" data-message="newItem" data-collection="brokers">Novo vendedor</button>
      `,
      )}
      ${inlineForm}
      <div class="dashboard-card">
        <div class="dashboard-card-head"><h3>Vendedores cadastrados</h3><span>${cards.length}</span></div>
        <div class="${listMode ? "entity-list" : "broker-grid broker-grid--cards"}">
          ${cards
            .map(
              (broker) => /*html*/ `
            <article class="broker-card ${openState === itemId(broker) ? "is-selected" : ""}">
              <button class="broker-card-link" type="button" data-cid="dashboard" data-message="editBroker" data-broker-id="${escapeText(itemId(broker))}">
                <img src="${broker.photo}" alt="${escapeText(broker.name)}" loading="lazy">
                <strong><a class="property-title-link" href="${openDashboard("brokers", itemId(broker))}" data-route="dashboard" data-dashboard-tab="brokers" data-entity-id="${escapeText(itemId(broker))}">${escapeText(broker.name)}</a></strong>
              </button>
              <div class="location">${escapeText(broker.creci || "CRECI nao informado")}</div>
              <div class="location">${escapeText(broker.phone || "Sem telefone")}</div>
              <div class="broker-chip-row">
                ${broker.specialty ? `<span>${escapeText(broker.specialty)}</span>` : ""}
                ${broker.city ? `<span>${escapeText(broker.city)}</span>` : ""}
              </div>
              <div class="broker-card-meta">
                <small>${appointments.filter((item) => (Array.isArray(item.brokers) ? item.brokers.some((id) => id === (broker.id || slugId(broker.name))) : String(item.broker || "") === String(broker.name || ""))).length} agendamentos</small>
                <small>${
                  (props.properties || []).filter((item) =>
                    String(item.title || "")
                      .toLowerCase()
                      .includes(
                        String(broker.name || "")
                          .split(" ")[0]
                          .toLowerCase(),
                      ),
                  ).length
                } imoveis</small>
              </div>
              <div class="broker-card-actions">
                <a class="ghost-btn" href="${openDashboard("brokers", itemId(broker))}" data-route="dashboard" data-dashboard-tab="brokers" data-entity-id="${escapeText(itemId(broker))}">Detalhes</a>
                <button class="ghost-btn" type="button" data-cid="dashboard" data-message="editBroker" data-broker-id="${escapeText(itemId(broker))}">Editar</button>
                <button class="ghost-btn danger-btn" type="button" data-cid="dashboard" data-message="deleteBroker" data-broker-id="${escapeText(itemId(broker))}">Excluir</button>
              </div>
            </article>
          `,
            )
            .join("")}
        </div>
      </div>
    `;
  };

  const renderReports = () => {
    const listMode = viewMode === "list";
    return /*html*/ `
      ${toolbar(
        "Relatorios corporativos",
        "Cards do historico e botao para gerar um novo PDF com metricas e atividades.",
        `
        <button class="ghost-btn" type="button" data-cid="dashboard" data-message="setCollectionView" data-collection="reports" data-value="grid">Grid</button>
        <button class="ghost-btn" type="button" data-cid="dashboard" data-message="setCollectionView" data-collection="reports" data-value="list">Lista</button>
        <button class="gold-btn" type="button" data-cid="dashboard" data-message="generateReport">Gerar novo relatorio</button>
      `,
      )}
      <div class="${listMode ? "report-list" : "report-grid"}">
        ${props.items
          .map(
            (report) => /*html*/ `
          <article class="report-card">
            <div class="report-head"><span class="report-badge">PDF</span><small>${escapeText(report.generatedAt || report.time || "")}</small></div>
            <h3>${escapeText(report.title || "Relatorio")}</h3>
            <p>${escapeText(report.note || "")}</p>
            <div class="report-meta"><span>${escapeText(report.value || "")}</span><span>${escapeText(report.period || "Corporativo")}</span></div>
            <div class="dashboard-form-actions">
              <button class="ghost-btn" type="button" data-cid="dashboard" data-message="downloadReport" data-report-id="${report.id || ""}">Baixar PDF</button>
            </div>
          </article>
        `,
          )
          .join("")}
      </div>
    `;
  };

  const renderProperties = () => {
    const listMode = viewMode === "list";
    const inlineForm = crudIsOpen
      ? renderSchemaForm(crudMode, crudDraft || {})
      : "";
    return /*html*/ `
      ${toolbar(
        "Imoveis e entidades",
        "Listagem CRUD com acesso direto a pagina de edicao do produto.",
        `
        <button class="ghost-btn" type="button" data-cid="dashboard" data-message="setCollectionView" data-collection="properties" data-value="grid">Grid</button>
        <button class="ghost-btn" type="button" data-cid="dashboard" data-message="setCollectionView" data-collection="properties" data-value="list">Lista</button>
        <button class="gold-btn" type="button" data-cid="dashboard" data-message="newItem" data-collection="properties">Novo imovel</button>
        <button class="ghost-btn" type="button" data-route="comprar">Ver vitrine</button>
      `,
      )}
      ${inlineForm}
      <div class="dashboard-card">
        <div class="dashboard-card-head"><h3>Produtos cadastrados</h3><span>${props.items.length}</span></div>
        <div class="${listMode ? "entity-list" : "property-card-grid"}">
          ${props.items
            .map(
              (item) => /*html*/ `
            <article class="entity-row property-row ${openState === item.id ? "is-selected" : ""}">
              <div>
                <strong><a class="property-title-link" href="#imovel#${encodeURIComponent(item.id)}" data-route="imovel" data-property-id="${item.id}">${escapeText(item.title || item.name || "Imovel")}</a></strong>
                <p>${escapeText(item.city || item.neighborhood || "")}</p>
              </div>
              <div class="entity-row-actions">
                <span>${escapeText(item.price || "Sem preco")}</span>
                <a class="ghost-btn" href="#imovel#${encodeURIComponent(item.id)}" data-route="imovel" data-property-id="${item.id}">Abrir</a>
                <a class="ghost-btn" href="#imovel-editar#${encodeURIComponent(item.id)}" data-route="imovel-editar" data-property-id="${item.id}">Editar</a>
                <button class="ghost-btn danger-btn" type="button" data-cid="dashboard" data-message="deleteItem" data-collection="properties" data-item-id="${item.id}">Excluir</button>
              </div>
            </article>
          `,
            )
            .join("")}
        </div>
      </div>
    `;
  };

  const renderFallback = () => {
    const listMode = viewMode === "list";
    const inlineForm = crudIsOpen
      ? renderSchemaForm(crudMode, crudDraft || {})
      : "";
    return /*html*/ `
      ${toolbar(
        schema?.title || "Itens",
        schema?.description || "Gestao interna do painel.",
        `
        <button class="ghost-btn" type="button" data-cid="dashboard" data-message="setCollectionView" data-collection="${collection}" data-value="grid">Grid</button>
        <button class="ghost-btn" type="button" data-cid="dashboard" data-message="setCollectionView" data-collection="${collection}" data-value="list">Lista</button>
        <button class="gold-btn" type="button" data-cid="dashboard" data-message="newItem" data-collection="${collection}">Novo ${schema?.itemLabel || "item"}</button>
      `,
      )}
      ${inlineForm}
      <div class="dashboard-card">
        <div class="dashboard-card-head"><h3>${schema?.title || "Itens"}</h3><span>${props.items.length}</span></div>
        <div class="${listMode ? "entity-list" : "activity dashboard-items"}">
          ${props.items.map((item, index) => /*html*/ `<article class="activity-row dashboard-item-row"><span class="dot">&#8226;</span><div class="dashboard-item-copy"><strong>${escapeText(item.title || item.name || item.label || `Item ${index + 1}`)}</strong><div class="location">${escapeText(item.detail || item.value || "")}</div></div></article>`).join("")}
        </div>
      </div>
    `;
  };

  return {
    next() {
      if (collection === "metrics")
        return { done: false, value: renderMetrics() };
      if (collection === "activities")
        return { done: false, value: renderActivities() };
      if (collection === "appointments")
        return { done: false, value: renderAppointments() };
      if (collection === "clients")
        return { done: false, value: renderClients() };
      if (collection === "brokers")
        return { done: false, value: renderBrokers() };
      if (collection === "reports")
        return { done: false, value: renderReports() };
      if (collection === "properties")
        return { done: false, value: renderProperties() };
      return { done: false, value: renderFallback() };
    },
  };
};
