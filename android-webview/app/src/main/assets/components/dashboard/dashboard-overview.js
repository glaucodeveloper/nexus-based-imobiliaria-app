const DashboardOverviewComponent = ({ props }) => {
  const metrics = props.metrics || [];
  const activities = props.activities || [];
  const appointments = props.appointments || [];
  const properties = props.properties || [];
  const escapeText = (value) => String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  return {
    next() {
      return {
        done: false,
        value: /*html*/`
          <div class="metric-grid metric-grid--fixed">${metrics.slice(0, 4).map((metric, index) => /*html*/`<article class="metric metric--fixed metric-${index + 1} metric-link" role="button" tabindex="0" aria-label="Abrir detalhes de ${escapeText(metric.label)}" data-cid="dashboard" data-message="setTab" data-value="metrics"><small>${escapeText(metric.label)}</small><strong>${escapeText(metric.value)}</strong><span>${escapeText(metric.note || "")}</span></article>`).join("")}</div>
          <div class="dashboard-columns">
            <article class="dashboard-card dashboard-preview-card">
              <div class="dashboard-card-head"><h3>Atividades recentes</h3><button class="ghost-btn" type="button" data-cid="dashboard" data-message="setTab" data-value="activities">Abrir</button></div>
              <div class="timeline-board timeline-board--compact">${activities.slice(0, 4).map((item) => /*html*/`<article class="timeline-card timeline-card--compact"><div class="timeline-marker"><span class="dot" style="background:${item.color || "var(--gold)"};">${item.icon || "&#8226;"}</span></div><div class="timeline-copy"><strong>${escapeText(item.title || "Atividade")}</strong><p>${escapeText(item.detail || "")}</p></div></article>`).join("")}</div>
            </article>
            <article class="dashboard-card dashboard-preview-card">
              <div class="dashboard-card-head"><h3>Agenda do dia</h3><button class="ghost-btn" type="button" data-cid="dashboard" data-message="setTab" data-value="appointments">Abrir</button></div>
              <div class="calendar-list calendar-list--compact">${appointments.slice(0, 3).map((appointment) => { const clientName = Array.isArray(appointment.clients) && appointment.clients.length ? appointment.clients[0] : "Cliente"; const propName = Array.isArray(appointment.properties) && appointment.properties.length ? appointment.properties[0] : "Imovel"; return /*html*/`<article class="calendar-item calendar-item--compact"><div><strong>${escapeText(clientName)}</strong><p>${escapeText(propName)}</p></div><span class="route-note">${escapeText(appointment.date || "")}</span></article>`; }).join("")}</div>
            </article>
          </div>
          <div class="dashboard-columns dashboard-columns--wide">
            <article class="dashboard-card dashboard-preview-card">
              <div class="dashboard-card-head"><h3>Vitrine ativa</h3><button class="ghost-btn" type="button" data-cid="dashboard" data-message="setTab" data-value="properties">Abrir</button></div>
              <div class="entity-list">${properties.slice(0, 3).map((item) => /*html*/`<article class="entity-row"><div><strong>${escapeText(item.title || "Imovel")}</strong><p>${escapeText(item.city || "")}</p></div><div class="entity-row-actions"><span>${escapeText(item.price || "")}</span></div></article>`).join("")}</div>
            </article>
          </div>
        `,
      };
    },
  };
};
