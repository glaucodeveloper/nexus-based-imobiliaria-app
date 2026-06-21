const DashboardCollectionCardComponent = ({ props }) => {
  const collection = props.collection;
  const schema = DASHBOARD_COLLECTION_SCHEMAS[collection];
  const collectionFormTitle = (name, mode) => `${mode === "edit" ? "Editar" : "Novo"} ${DASHBOARD_COLLECTION_SCHEMAS[name]?.itemLabel || "item"}`;
  const metrics = props.metrics || [];
  const activities = props.activities || [];
  const appointments = props.appointments || [];
  const attachmentRows = Number(props.attachmentRows || 2);
  const appointmentModalOpen = Boolean(props.appointmentModalOpen);
  const escapeText = (value) => String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  const toolbar = (title, subtitle, actions) => /*html*/`
    <div class="dashboard-toolbar">
      <div><strong>${title}</strong><span>${subtitle}</span></div>
      <div class="dashboard-toolbar-actions">${actions}</div>
    </div>
  `;
  const whatsappLink = (phone, text) => {
    const clean = String(phone || "").replace(/\D/g, "");
    return clean ? `https://wa.me/${clean}?text=${encodeURIComponent(text)}` : "#";
  };
  const appointmentDateKey = (value) => {
    const text = String(value || "");
    const iso = text.match(/\d{4}-\d{2}-\d{2}/);
    if (iso) return iso[0];
    const dm = text.match(/(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?/);
    if (!dm) return "";
    const year = dm[3] ? (dm[3].length === 2 ? `20${dm[3]}` : dm[3]) : new Date().getFullYear();
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

  const renderMetrics = () => /*html*/`
    ${toolbar("Metricas fixas", "Indicadores derivados da movimentacao do site.", `<button class="ghost-btn" type="button" data-cid="dashboard" data-message="refreshMetrics">Atualizar</button>`)}
    <div class="metric-grid metric-grid--fixed">
      ${metrics.map((metric, index) => /*html*/`<article class="metric metric--fixed metric-${index + 1} metric-link" role="button" tabindex="0" aria-label="Abrir detalhes de ${escapeText(metric.label)}" data-cid="dashboard" data-message="setTab" data-value="metrics"><small>${escapeText(metric.label)}</small><strong>${escapeText(metric.value)}</strong><span>${escapeText(metric.note || "")}</span></article>`).join("")}
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

  const renderActivities = () => /*html*/`
    ${toolbar("Linha do tempo", "Cards ilustrativos em ordem do mais recente para o mais antigo.", `<button class="ghost-btn" type="button" data-cid="dashboard" data-message="newActivity">Novo evento</button>`)}
    <div class="timeline-board">
      ${activities.map((item, index) => /*html*/`
        <article class="timeline-card">
          <div class="timeline-marker">
            <span class="dot" style="background:${item.color || "var(--gold)"};">${item.icon || "&#8226;"}</span>
            ${index < activities.length - 1 ? `<span class="timeline-rail"></span>` : ""}
          </div>
          <div class="timeline-copy">
            <div class="timeline-topline"><strong>${escapeText(item.title || "Atividade")}</strong><span>${escapeText(item.time || "Agora")}</span></div>
            <p>${escapeText(item.detail || "")}</p>
            ${item.image ? `<img class="timeline-image" src="${item.image}" alt="${escapeText(item.title || "Atividade")}">` : ""}
          </div>
        </article>
      `).join("")}
    </div>
  `;

  const renderAppointments = () => {
    const groups = new Map();
    appointments.forEach((item) => {
      const key = appointmentDateKey(item.date || item.day || item.when) || todayKey;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(item);
    });
    const modal = appointmentModalOpen ? /*html*/`
      <div class="appointment-modal" role="dialog" aria-modal="true" aria-label="Novo agendamento">
        <button class="appointment-modal-backdrop" type="button" data-cid="dashboard" data-message="closeAppointmentModal" aria-label="Fechar modal"></button>
        <div class="appointment-modal-panel">
          <div class="appointment-modal-head">
            <div>
              <span class="eyebrow">Agendamento</span>
              <h3>Novo agendamento</h3>
              <p>Crie a visita sem sair do calendario e mantenha o fluxo de atendimento no mesmo contexto.</p>
            </div>
            <button class="appointment-modal-close" type="button" data-cid="dashboard" data-message="closeAppointmentModal" aria-label="Fechar">&times;</button>
          </div>
          <form class="appointment-form appointment-form--modal" data-cid="dashboard" data-message="saveItem" data-collection="appointments">
            <label class="mini-field"><span>Data</span><input name="date" type="text" placeholder="19/06"></label>
            <label class="mini-field"><span>Hora</span><input name="time" type="text" placeholder="09:30"></label>
            <label class="mini-field"><span>Cliente</span><input name="client" type="text" placeholder="Nome do cliente"></label>
            <label class="mini-field"><span>Imovel</span><input name="property" type="text" placeholder="Casa no condominio"></label>
            <label class="mini-field"><span>Corretor</span><input name="broker" type="text" placeholder="Nome do corretor"></label>
            <label class="mini-field"><span>Telefone</span><input name="phone" type="text" placeholder="(71) 99999-0000"></label>
            <label class="mini-field"><span>Nota</span><textarea name="note" rows="3" placeholder="Observacoes do atendimento"></textarea></label>
            <div class="dashboard-form-actions dashboard-form-actions--modal">
              <button class="ghost-btn" type="button" data-cid="dashboard" data-message="closeAppointmentModal">Cancelar</button>
              <button class="gold-btn" type="submit">Salvar agendamento</button>
            </div>
          </form>
        </div>
      </div>
    ` : "";
    return /*html*/`
      ${toolbar("Agendamentos e calendario", "Visao mensal com botoes de WhatsApp para cada visita.", `
        <button class="ghost-btn" type="button" data-cid="dashboard" data-message="newItem" data-collection="appointments">Novo agendamento</button>
        <button class="gold-btn" type="button" data-cid="dashboard" data-message="jumpToday">Hoje</button>
      `)}
      <div class="calendar-shell">
        <section class="calendar-grid">
          ${["Seg", "Ter", "Qua", "Qui", "Sex", "Sab", "Dom"].map((day) => `<span class="calendar-head">${day}</span>`).join("")}
          ${monthDays().map((date) => {
            const key = date.toISOString().slice(0, 10);
            const dayItems = groups.get(key) || [];
            const outside = date.getMonth() !== new Date().getMonth();
            return /*html*/`
              <article class="calendar-day ${outside ? "is-outside" : ""} ${key === todayKey ? "is-today" : ""}">
                <header><strong>${date.getDate()}</strong><span>${date.toLocaleDateString("pt-BR", { weekday: "short" })}</span></header>
                <div class="calendar-day-events">
                  ${dayItems.slice(0, 3).map((item) => {
                    const phone = item.phone || brokers.find((broker) => broker.name === item.broker)?.phone || "";
                    const text = `Ola ${item.client || ""}, confirmando seu agendamento para ${item.date || ""} ${item.time || ""} em ${item.property || ""}.`;
                    return /*html*/`<div class="calendar-chip"><strong>${escapeText(item.time || "--:--")}</strong><span>${escapeText(item.client || "Cliente")}</span><a class="whatsapp-btn" href="${whatsappLink(phone, text)}" target="_blank" rel="noreferrer">WhatsApp</a></div>`;
                  }).join("")}
                </div>
              </article>
            `;
          }).join("")}
        </section>
        <aside class="calendar-panel">
          <div class="dashboard-card-head"><h3>Proximos agendamentos</h3><span>${appointments.length}</span></div>
          <div class="calendar-list">
            ${appointments.map((item) => {
              const broker = brokers.find((entry) => entry.name === item.broker);
              const phone = item.phone || broker?.phone || "";
              const text = `Ola ${item.client || ""}, passando para confirmar seu agendamento para ${item.property || ""} em ${item.date || ""} ${item.time || ""}.`;
              return /*html*/`
                <article class="calendar-item">
                  <div>
                    <strong>${escapeText(item.client || "Cliente")}</strong>
                    <p>${escapeText(item.property || "Imovel")}</p>
                    <small>${escapeText(item.date || "")}${item.time ? ` - ${escapeText(item.time)}` : ""}</small>
                  </div>
                  <div class="calendar-item-actions">
                    <button class="ghost-btn" type="button" data-route="imovel" data-property-id="${item.propertyId || properties[0]?.id || ""}">Abrir</button>
                    <a class="gold-btn" href="${whatsappLink(phone, text)}" target="_blank" rel="noreferrer">WhatsApp</a>
                  </div>
                </article>
              `;
            }).join("")}
          </div>
        </aside>
      </div>
      ${modal}
    `;
  };
  const renderClients = () => /*html*/`
    ${toolbar("Cadastro manual", "Ficha em estilo CV com anexos dinamicos e controle comercial.", `
      <button class="ghost-btn" type="button" data-cid="dashboard" data-message="addAttachmentRow">Adicionar anexo</button>
      <button class="ghost-btn" type="reset">Limpar</button>
    `)}
    <div class="dashboard-columns dashboard-crud-layout client-layout">
      <article class="dashboard-card dashboard-form-card client-form-card">
        <h3>Novo cliente</h3>
        <p class="location">Preencha a ficha como um curriculum comercial.</p>
        <form class="client-cv-form" data-cid="dashboard" data-message="saveItem" data-collection="clients">
          <div class="client-cv-grid">
            <label class="mini-field"><span>Nome</span><input name="name" type="text" placeholder="Nome completo"></label>
            <label class="mini-field"><span>Telefone</span><input name="phone" type="text" placeholder="(71) 99999-0000"></label>
            <label class="mini-field"><span>E-mail</span><input name="email" type="email" placeholder="cliente@dominio.com"></label>
            <label class="mini-field"><span>Perfil</span><input name="profile" type="text" placeholder="Comprador, investidor, etc."></label>
            <label class="mini-field"><span>Foco</span><input name="focus" type="text" placeholder="3 quartos em Salvador"></label>
            <label class="mini-field"><span>Faixa</span><input name="budget" type="text" placeholder="Ate R$ 1,2 mi"></label>
            <label class="mini-field"><span>Cidade</span><input name="city" type="text" placeholder="Salvador"></label>
            <label class="mini-field"><span>Responsavel</span><input name="owner" type="text" placeholder="Corretor responsavel"></label>
            <label class="mini-field client-notes"><span>Notas</span><textarea name="notes" rows="4" placeholder="Preferencias, historia, restricoes e observacoes"></textarea></label>
          </div>
          <div class="attachment-stack">
            <strong>Anexos</strong>
            ${Array.from({ length: attachmentRows }, (_, index) => /*html*/`
              <div class="attachment-row">
                <label class="mini-field"><span>Anexo ${index + 1}</span><input name="attachmentLabel" data-attachment-label="true" type="text" placeholder="Documento, comprovante, etc."></label>
                <label class="mini-field"><span>Arquivo</span><input name="attachmentFile" data-attachment-file="true" type="file"></label>
              </div>
            `).join("")}
          </div>
          <div class="dashboard-form-actions">
            <button class="gold-btn" type="submit">Salvar cliente</button>
          </div>
        </form>
        ${props.crudStatus ? `<p class="route-note">${escapeText(props.crudStatus)}</p>` : ""}
      </article>
      <article class="dashboard-card">
        <div class="dashboard-card-head"><h3>Clientes cadastrados</h3><span>${items.length}</span></div>
        <div class="client-cards">
          ${items.map((client) => /*html*/`
            <article class="client-card">
              <div class="client-card-top">
                <div><strong>${escapeText(client.name || "Cliente")}</strong><span>${escapeText(client.profile || "Perfil comercial")}</span></div>
                <span class="client-badge">${Array.isArray(client.attachments) ? client.attachments.length : 0} anexos</span>
              </div>
              <p>${escapeText(client.focus || "")}</p>
              <div class="client-meta"><span>${escapeText(client.city || client.source || "Manual")}</span><span>${escapeText(client.owner || "Sem responsavel")}</span></div>
              <div class="client-attachments">${(client.attachments || []).slice(0, 3).map((attachment) => `<span>${escapeText(attachment.name || attachment.label || "Arquivo")}</span>`).join("")}</div>
            </article>
          `).join("")}
        </div>
      </article>
    </div>
  `;

  const renderReports = () => /*html*/`
    ${toolbar("Relatorios corporativos", "Cards do historico e botao para gerar um novo PDF com metricas e atividades.", `<button class="gold-btn" type="button" data-cid="dashboard" data-message="generateReport">Gerar novo relatorio</button>`)}
    <div class="report-grid">
      ${items.map((report) => /*html*/`
        <article class="report-card">
          <div class="report-head"><span class="report-badge">PDF</span><small>${escapeText(report.generatedAt || report.time || "")}</small></div>
          <h3>${escapeText(report.title || "Relatorio")}</h3>
          <p>${escapeText(report.note || "")}</p>
          <div class="report-meta"><span>${escapeText(report.value || "")}</span><span>${escapeText(report.period || "Corporativo")}</span></div>
          <div class="dashboard-form-actions">
            <button class="ghost-btn" type="button" data-cid="dashboard" data-message="downloadReport" data-report-id="${report.id || ""}">Baixar PDF</button>
          </div>
        </article>
      `).join("")}
    </div>
  `;

  const renderProperties = () => /*html*/`
    ${toolbar("Imoveis e entidades", "Atalhos de utilidade para criar, editar e organizar os produtos do site.", `
      <button class="gold-btn" type="button" data-route="imovel-novo">Novo imovel</button>
      <button class="ghost-btn" type="button" data-route="comprar">Ver vitrine</button>
    `)}
    <div class="dashboard-columns dashboard-crud-layout entity-layout">
      <article class="dashboard-card dashboard-form-card dashboard-highlight-card">
        <h3>Novo produto</h3>
        <p class="location">Use a pagina de criacao completa para editar conteudos, imagens e publicacao no GitHub.</p>
        <div class="dashboard-form-actions">
          <button class="gold-btn" type="button" data-route="imovel-novo">Novo produto</button>
          <button class="ghost-btn" type="button" data-route="imovel-editar" data-property-id="${properties[0]?.id || ""}">Editar primeiro</button>
        </div>
        <p class="route-note">A criacao e a edicao continuam na tela imovel, com preview ao vivo.</p>
      </article>
      <article class="dashboard-card">
        <div class="dashboard-card-head"><h3>Produtos cadastrados</h3><span>${items.length}</span></div>
        <div class="entity-list">
          ${items.map((item) => /*html*/`
            <article class="entity-row">
              <div><strong>${escapeText(item.title || item.name || "Imovel")}</strong><p>${escapeText(item.city || item.neighborhood || "")}</p></div>
              <div class="entity-row-actions">
                <span>${escapeText(item.price || "Sem preco")}</span>
                <button class="ghost-btn" type="button" data-route="imovel" data-property-id="${item.id}">Abrir</button>
                <button class="ghost-btn" type="button" data-route="imovel-editar" data-property-id="${item.id}">Editar</button>
              </div>
            </article>
          `).join("")}
        </div>
      </article>
    </div>
  `;

  return {
    next() {
      if (collection === "metrics") return { done: false, value: renderMetrics() };
      if (collection === "activities") return { done: false, value: renderActivities() };
      if (collection === "appointments") return { done: false, value: renderAppointments() };
      if (collection === "clients") return { done: false, value: renderClients() };
      if (collection === "reports") return { done: false, value: renderReports() };
      if (collection === "properties") return { done: false, value: renderProperties() };
      return {
        done: false,
        value: /*html*/`
          <div class="dashboard-columns dashboard-crud-layout">
            <article class="dashboard-card dashboard-form-card">
              <h3>${schema ? collectionFormTitle(collection, "create") : "Novo item"}</h3>
              <p class="location">${schema?.description || "Gestao interna do painel."}</p>
              <div class="dashboard-form-actions">
                <button class="gold-btn" type="button" data-cid="dashboard" data-message="newItem" data-collection="${collection}">Novo ${schema?.itemLabel || "item"}</button>
              </div>
            </article>
            <article class="dashboard-card">
              <div class="dashboard-card-head"><h3>${schema?.title || "Itens"}</h3><span>${items.length}</span></div>
              <div class="activity dashboard-items">${items.map((item, index) => /*html*/`<article class="activity-row dashboard-item-row"><span class="dot">&#8226;</span><div class="dashboard-item-copy"><strong>${escapeText(item.title || item.name || item.label || `Item ${index + 1}`)}</strong><div class="location">${escapeText(item.detail || item.value || "")}</div></div></article>`).join("")}</div>
            </article>
          </div>
        `,
      };
    },
  };
};
