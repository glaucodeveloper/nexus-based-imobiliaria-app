const BrokersComponent = ({ props }) => {
  let editorOpen = false;
  let editingBrokerId = null;
  let status = "";

  const escapeText = (value) => String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;").replace(/'/g, "&#39;");
  const slugId = (broker) => broker?.id || (String(broker?.name || broker?.title || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""));
  const route = () => props.getRoute?.() || "home";
  const isDirectoryRoute = () => route() === "vendedores" || route() === "brokers";
  const canDeleteBroker = () => route() === "brokers";
  const getSelectedBroker = () => props.getSelectedBroker?.() || null;
  const getBrokerById = (brokerId) => brokers.find((broker) => slugId(broker) === brokerId) || null;
  const whatsappLink = (phone, text) => {
    const clean = String(phone || "").replace(/\D/g, "");
    return clean ? `https://wa.me/${clean}?text=${encodeURIComponent(text)}` : "#";
  };
  const brokerAppointments = (broker) => dashboardContent.appointments.filter((item) => Array.isArray(item.brokers) ? item.brokers.some((id) => id === (broker.id || slugId(broker.name))) : item.broker === broker.name);
  const brokerProperties = (broker) => properties.filter((item) => String(item.title || "").toLowerCase().includes(String(broker.name || "").split(" ")[0].toLowerCase())).slice(0, 3);
  const openBroker = (brokerId) => props.goToRoute?.("vendedores", { brokerId });
  const openList = () => props.goToRoute?.("vendedores");
  const createDraft = (broker = null) => ({
    id: broker?.id || "",
    name: broker?.name || "",
    phone: broker?.phone || "",
    photo: broker?.photo || "",
    creci: broker?.creci || "",
    city: broker?.city || "",
    specialty: broker?.specialty || "",
    bio: broker?.bio || "",
    performance: broker?.performance || "",
    status: broker?.status || "Ativo",
  });
  const currentDraft = () => createDraft(editingBrokerId ? getBrokerById(editingBrokerId) : null);

  const renderToolbar = (title, subtitle, actions) => /*html*/`
    <div class="dashboard-toolbar">
      <div><strong>${title}</strong><span>${subtitle}</span></div>
      <div class="dashboard-toolbar-actions">${actions}</div>
    </div>
  `;

  const renderFormCard = () => {
    const draft = currentDraft();
    return /*html*/`
      <article class="dashboard-card dashboard-form-card broker-form-card">
        <h3>${editingBrokerId ? "Editar vendedor" : "Novo vendedor"}</h3>
        <p class="location">Cadastre ou atualize o perfil comercial do vendedor.</p>
        <form class="client-cv-form" data-cid="brokers" data-message="saveBroker">
          <input type="hidden" name="id" value="${escapeText(draft.id)}">
          <div class="client-cv-grid">
            <label class="mini-field"><span>Nome</span><input name="name" type="text" value="${escapeText(draft.name)}" placeholder="Nome completo"></label>
            <label class="mini-field"><span>Telefone</span><input name="phone" type="text" value="${escapeText(draft.phone)}" placeholder="(71) 99999-0000"></label>
            <label class="mini-field"><span>Foto</span><input name="photo" type="text" value="${escapeText(draft.photo)}" placeholder="https://..."></label>
            <label class="mini-field"><span>CRECI</span><input name="creci" type="text" value="${escapeText(draft.creci)}" placeholder="CRECI 12345"></label>
            <label class="mini-field"><span>Cidade</span><input name="city" type="text" value="${escapeText(draft.city)}" placeholder="Salvador/BA"></label>
            <label class="mini-field"><span>Especialidade</span><input name="specialty" type="text" value="${escapeText(draft.specialty)}" placeholder="Alto padrão, lançamentos..."></label>
            <label class="mini-field client-notes"><span>Bio</span><textarea name="bio" rows="4" placeholder="Apresentação do vendedor">${escapeText(draft.bio)}</textarea></label>
            <label class="mini-field"><span>Desempenho</span><input name="performance" type="text" value="${escapeText(draft.performance)}" placeholder="+18% conversão"></label>
            <label class="mini-field"><span>Status</span><input name="status" type="text" value="${escapeText(draft.status)}" placeholder="Ativo"></label>
          </div>
          <div class="dashboard-form-actions">
            <button class="ghost-btn" type="button" data-cid="brokers" data-message="cancelEditor">Cancelar</button>
            <button class="gold-btn" type="submit">${editingBrokerId ? "Salvar vendedor" : "Criar vendedor"}</button>
          </div>
        </form>
        ${status ? `<p class="route-note">${escapeText(status)}</p>` : ""}
      </article>
    `;
  };

  const renderBrokerCard = (broker, index) => {
    const appointments = brokerAppointments(broker);
    const related = brokerProperties(broker);
    return /*html*/`
      <article class="broker-tile broker-card">
        <button class="broker-card-link" type="button" data-cid="brokers" data-message="openBroker" data-broker-id="${slugId(broker)}">
          <img src="${broker.photo}" alt="${escapeText(broker.name)}" loading="lazy">
          <strong>${escapeText(broker.name)}</strong>
        </button>
        <div class="location">${escapeText(broker.creci || "CRECI não informado")}</div>
        <div class="location">${escapeText(broker.phone || "Sem telefone")}</div>
        <div class="broker-chip-row">
          ${broker.specialty ? `<span>${escapeText(broker.specialty)}</span>` : ""}
          ${broker.city ? `<span>${escapeText(broker.city)}</span>` : ""}
        </div>
        <div class="broker-card-meta">
          <small>${appointments.length} agendamentos</small>
          <small>${related.length} imoveis relacionados</small>
        </div>
        <div class="broker-card-actions">
          <button class="ghost-btn" type="button" data-cid="brokers" data-message="openBroker" data-broker-id="${slugId(broker)}">Detalhes</button>
          <button class="ghost-btn" type="button" data-cid="brokers" data-message="editBroker" data-broker-id="${slugId(broker)}">Editar</button>
          ${canDeleteBroker() ? `<button class="ghost-btn danger-btn" type="button" data-cid="brokers" data-message="deleteBroker" data-broker-id="${slugId(broker)}">Excluir</button>` : ""}
        </div>
      </article>
    `;
  };

  const renderListPage = () => /*html*/`
    <section class="section brokers brokers-page">
      <div class="container">
        <div class="section-title">
          <div>
            <span class="eyebrow">Vendedores</span>
            <h2>Equipe comercial</h2>
            <p>Cards com acesso ao detalhe completo e ferramentas de cadastro acima da listagem.</p>
          </div>
        </div>
        ${renderToolbar("CRUD de vendedores", "Crie e edite vendedores diretamente nesta página.", `
          <button class="gold-btn" type="button" data-cid="brokers" data-message="newBroker">Novo vendedor</button>
          <button class="ghost-btn" type="button" data-cid="brokers" data-message="refresh">Atualizar lista</button>
        `)}
        <div class="broker-layout">
          ${renderFormCard()}
          <article class="dashboard-card broker-list-card">
            <div class="dashboard-card-head"><h3>Cards de vendedores</h3><span>${brokers.length}</span></div>
            <div class="broker-grid broker-grid--cards">
              ${brokers.map((broker, index) => renderBrokerCard(broker, index)).join("")}
            </div>
          </article>
        </div>
      </div>
    </section>
  `;

  const renderDetailPage = (broker) => {
    const appointments = brokerAppointments(broker);
    const related = brokerProperties(broker);
    return /*html*/`
      <section class="section brokers brokers-detail-page">
        <div class="container broker-detail-shell">
          <div class="section-title">
            <div>
              <span class="eyebrow">Detalhes do vendedor</span>
              <h2>${escapeText(broker.name)}</h2>
              <p>Visão completa com contatos, atuação e histórico operacional.</p>
            </div>
          </div>
          <article class="dashboard-card broker-detail-card">
            <div class="broker-hero">
              <img class="broker-hero-photo" src="${broker.photo}" alt="${escapeText(broker.name)}">
              <div class="broker-hero-copy">
                <div class="broker-hero-top">
                  <div>
                    <span class="client-badge">${escapeText(broker.status || "Ativo")}</span>
                    <h3>${escapeText(broker.name)}</h3>
                    <p>${escapeText(broker.bio || "Vendedor com atuação destacada no atendimento comercial.")}</p>
                  </div>
                  <div class="broker-hero-actions">
                    <button class="ghost-btn" type="button" data-cid="brokers" data-message="backToList">Voltar</button>
                    <button class="gold-btn" type="button" data-cid="brokers" data-message="editBroker" data-broker-id="${slugId(broker)}">Editar</button>
                  </div>
                </div>
                <div class="broker-stats">
                  <div><strong>${broker.creci || "--"}</strong><span>CRECI</span></div>
                  <div><strong>${brokerAppointments(broker).length}</strong><span>agendamentos</span></div>
                  <div><strong>${related.length}</strong><span>imoveis ligados</span></div>
                  <div><strong>${broker.performance || "Ativo"}</strong><span>performance</span></div>
                </div>
                <div class="broker-action-row">
                  <a class="gold-btn" href="${whatsappLink(broker.phone, `Ola ${broker.name}, gostaria de falar sobre os imoveis disponiveis.`)}" target="_blank" rel="noreferrer">WhatsApp</a>
                  <a class="ghost-btn" href="mailto:contato@suaimobiliaria.com.br">E-mail</a>
                  ${canDeleteBroker() ? `<button class="ghost-btn danger-btn" type="button" data-cid="brokers" data-message="deleteBroker" data-broker-id="${slugId(broker)}">Excluir</button>` : ""}
                </div>
              </div>
            </div>
            <div class="broker-detail-grid">
              <div class="dashboard-card broker-detail-panel">
                <div class="dashboard-card-head"><h3>Dados comerciais</h3><span>perfil</span></div>
                <div class="broker-detail-list">
                  <div><strong>Telefone</strong><span>${escapeText(broker.phone || "Sem telefone")}</span></div>
                  <div><strong>Cidade</strong><span>${escapeText(broker.city || "Sem cidade")}</span></div>
                  <div><strong>Especialidade</strong><span>${escapeText(broker.specialty || "Sem especialidade")}</span></div>
                </div>
              </div>
              <div class="dashboard-card broker-detail-panel">
                <div class="dashboard-card-head"><h3>Agenda recente</h3><span>${appointments.length}</span></div>
                <div class="broker-timeline">
                  ${appointments.length ? appointments.map((item) => { const clientName = Array.isArray(item.clients) && item.clients.length ? item.clients[0] : (item.client || "Cliente"); const propName = Array.isArray(item.properties) && item.properties.length ? item.properties[0] : (item.property || "Imovel"); return /*html*/`<article class="timeline-card timeline-card--compact"><div class="timeline-marker"><span class="dot" style="background:var(--gold);">A</span></div><div class="timeline-copy"><strong>${escapeText(clientName)}</strong><p>${escapeText(propName)}</p><span class="route-note">${escapeText(item.date || "")}${item.time ? ` - ${escapeText(item.time)}` : ""}</span></div></article>`; }).join("") : `<p class="route-note">Nenhum agendamento ligado a este vendedor.</p>`}
                </div>
              </div>
            </div>
            <div class="dashboard-card broker-relations-card">
              <div class="dashboard-card-head"><h3>Imoveis relacionados</h3><span>${related.length}</span></div>
              <div class="broker-related-grid">
                ${related.length ? related.map((item) => /*html*/`<article class="entity-row"><div><strong>${escapeText(item.title || "Imovel")}</strong><p>${escapeText(item.city || item.neighborhood || "")}</p></div><div class="entity-row-actions"><button class="ghost-btn" type="button" data-route="imovel" data-property-id="${item.id}">Abrir</button></div></article>`).join("") : `<p class="route-note">Sem imoveis vinculados por enquanto.</p>`}
              </div>
            </div>
          </article>
        </div>
      </section>
    `;
  };

  const renderTeaser = () => /*html*/`
    <section class="section brokers brokers-teaser">
      <div class="container">
        <div class="section-title" style="justify-content:center;text-align:center;">
          <div>
            <span class="eyebrow">Vendedores</span>
            <h2>Equipe comercial</h2>
            <p>Foto, CRECI, telefone e acesso direto à página de detalhes.</p>
          </div>
        </div>
        <div class="broker-grid broker-grid--cards">
          ${brokers.slice(0, 4).map((broker, index) => renderBrokerCard(broker, index)).join("")}
        </div>
      </div>
    </section>
  `;

  return {
    next(message = {}) {
      if (message.type === "newBroker") {
        editingBrokerId = null;
        editorOpen = true;
      }
      if (message.type === "refresh") {
        status = "Lista atualizada.";
      }
      if (message.type === "backToList") {
        editorOpen = false;
        openList();
      }
      if (message.type === "cancelEditor") {
        editorOpen = false;
        status = "";
      }
      if (message.type === "editBroker") {
        editingBrokerId = message.brokerId || editingBrokerId;
        editorOpen = true;
        status = "";
        openList();
      }
      if (message.type === "openBroker") {
        openBroker(message.brokerId);
      }
      if (message.type === "deleteBroker") {
        const broker = getBrokerById(message.brokerId);
        if (!broker) return { done: false, value: "" };
        if (window.confirm(`Excluir ${broker.name}?`)) {
          const result = props.deleteBroker?.(message.brokerId);
          if (result?.then) {
            return result.then(() => {
              if (editingBrokerId === message.brokerId) editingBrokerId = null;
              if (route() === "vendedores" || route() === "brokers") {
                openList();
              }
            });
          }
        }
      }
      if (message.type === "saveBroker") {
        const draft = { ...message.fields };
        const result = props.saveBroker?.(draft, editingBrokerId || draft.id || null);
        if (result?.then) {
          return result.then((response = {}) => {
            status = response.message || "Vendedor salvo.";
            editorOpen = false;
            editingBrokerId = null;
            if (response.broker?.id) openBroker(response.broker.id);
          });
        }
      }
      const currentRoute = route();
      const selectedBroker = getSelectedBroker();
      const inDirectory = isDirectoryRoute();
      if (!inDirectory) {
        return { done: false, value: renderTeaser() };
      }
      if (selectedBroker) {
        return { done: false, value: renderDetailPage(selectedBroker) };
      }
      return { done: false, value: renderListPage() };
    },
  };
};
