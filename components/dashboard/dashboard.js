const DashboardComponentStateful = ({ props }) => {
  let activeTab = "overview";
  let crudStatus = "";
  let clientAttachmentRows = 2;
  let appointmentModalOpen = false;

  const tabs = [
    ["overview", "Painel", "&#8962;"],
    ["metrics", "Metricas", "&#128200;"],
    ["activities", "Atividades", "&#8635;"],
    ["appointments", "Agendamentos", "&#128197;"],
    ["clients", "Clientes", "&#128100;"],
    ["reports", "Relatorios", "&#128196;"],
    ["properties", "Imoveis", "&#127968;"],
    ["settings", "Configuracoes", "&#9881;"],
  ];

  const escapeText = (value) => String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  const getSession = () => props.getSession?.() || { favorites: new Set() };
  const getCollectionItems = (collection) => (collection === "properties" ? properties : dashboardContent[collection] || []);
  const setCollectionItems = (collection, items) => {
    if (collection === "properties") {
      properties = normalizeDashboardCollection("properties", items);
      return;
    }
    dashboardContent = { ...dashboardContent, [collection]: normalizeDashboardCollection(collection, items) };
  };
  const persistDashboard = async () => {
    if (typeof props.saveDashboard === "function") await props.saveDashboard(dashboardContent);
    else props.requestRender?.();
  };
  const buildMetrics = () => {
    const session = getSession();
    const appointments = getCollectionItems("appointments");
    const reports = getCollectionItems("reports");
    const clients = getCollectionItems("clients");
    const leads = getCollectionItems("leads");
    const today = new Date().toISOString().slice(0, 10);
    const todayAppointments = appointments.filter((item) => String(item.date || "").includes(today.slice(8, 10)) || String(item.date || "").includes(today.slice(5, 7))).length;
    return [
      { label: "Imoveis ativos", value: String(properties.length), note: "vitrine publicada" },
      { label: "Leads captados", value: String(leads.length), note: "entradas do site" },
      { label: "Agendamentos ativos", value: String(appointments.length), note: "calendario operacional" },
      { label: "Clientes cadastrados", value: String(clients.length), note: "cadastros manuais" },
      { label: "Relatorios gerados", value: String(reports.length), note: "pdfs e cards" },
      { label: "Favoritos salvos", value: String(session.favorites?.size || 0), note: "movimento do publico" },
    ];
  };
  const downloadPdf = (report) => {
    const escapePdf = (value) => String(value).replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)").replace(/[^\x20-\x7E]/g, "");
    const lines = [
      `Gerado em: ${report.generatedAt || new Date().toLocaleString("pt-BR")}`,
      `Valor: ${report.value || ""}`,
      `Resumo: ${report.note || ""}`,
      "Metricas:",
      ...buildMetrics().slice(0, 4).map((metric) => `${metric.label}: ${metric.value}`),
    ].map((line) => escapePdf(line));
    const stream = ["BT", "/F1 18 Tf", "72 760 Td", `(${escapePdf(report.title || "Relatorio")}) Tj`, "/F1 11 Tf", ...lines.map((line, index) => `${index === 0 ? "0 -26 Td" : "0 -16 Td"} (${line}) Tj`), "ET"].join("\n");
    const objects = [
      '<< /Type /Catalog /Pages 2 0 R >>',
      '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
      '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
      `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
      '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>',
    ];
    let pdf = "%PDF-1.4\n";
    const offsets = [0];
    objects.forEach((object, index) => { offsets.push(pdf.length); pdf += `${index + 1} 0 obj\n${object}\nendobj\n`; });
    const xrefStart = pdf.length;
    pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
    for (let index = 1; index <= objects.length; index += 1) pdf += `${String(offsets[index]).padStart(10, "0")} 00000 n \n`;
    pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;
    const blob = new Blob([pdf], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${String(report.title || "relatorio").toLowerCase().replace(/[^a-z0-9]+/g, "-") || "relatorio"}.pdf`;
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 800);
  };
  const renderCollectionCard = (collection) => DashboardCollectionCardComponent({
    props: {
      collection,
      items: getCollectionItems(collection),
      metrics: buildMetrics(),
      activities: getCollectionItems("activities"),
      appointments: getCollectionItems("appointments"),
      propertiesCount: properties.length,
      attachmentRows: clientAttachmentRows,
      crudStatus,
      appointmentModalOpen,
    },
  }).next().value;
  const renderOverview = () => DashboardOverviewComponent({
    props: {
      metrics: buildMetrics(),
      activities: getCollectionItems("activities"),
      appointments: getCollectionItems("appointments"),
      properties: getCollectionItems("properties"),
    },
  }).next().value;

  return {
    next(message = {}) {
      dashboardContent = { ...dashboardContent, metrics: buildMetrics() };
      if (message.type === "setTab") activeTab = message.value || activeTab;
      if (message.type === "newItem") {
        crudStatus = "";
        if (message.collection === "appointments") {
          appointmentModalOpen = true;
          activeTab = "appointments";
        }
      }
      if (message.type === "addAttachmentRow") clientAttachmentRows += 1;
      if (message.type === "refreshMetrics") crudStatus = "Metricas fixas calculadas a partir da movimentacao do site.";
      if (message.type === "newActivity") {
        dashboardContent = { ...dashboardContent, activities: [{ icon: "A", title: "Nova ocorrencia registrada", detail: "Evento manual adicionado ao topo da timeline.", time: "Agora", color: "var(--gold)" }, ...dashboardContent.activities] };
        persistDashboard();
      }
      if (message.type === "jumpToday") activeTab = "appointments";
      if (message.type === "closeAppointmentModal") appointmentModalOpen = false;
      if (message.type === "downloadReport") {
        const report = getCollectionItems("reports").find((entry) => entry.id === message.reportId);
        if (report) downloadPdf(report);
      }
      if (message.type === "generateReport") {
        const metrics = buildMetrics();
        const report = {
          id: `report-${Date.now()}`,
          title: `Relatorio corporativo ${new Date().toLocaleDateString("pt-BR")}`,
          value: `${metrics.length} indicadores`,
          note: `Resumo com ${metrics[0].value} imoveis, ${metrics[1].value} leads e ${metrics[2].value} agendamentos.`,
          generatedAt: new Date().toLocaleString("pt-BR"),
          period: "PDF corporativo",
        };
        dashboardContent = { ...dashboardContent, reports: [report, ...dashboardContent.reports] };
        downloadPdf(report);
        crudStatus = "Relatorio PDF gerado e baixado.";
        persistDashboard();
      }
      if (message.type === "deleteItem") {
        const collection = message.collection || activeTab;
        const itemId = message.itemId;
        const item = getCollectionItems(collection).find((entry) => entry.id === itemId);
        if (item && window.confirm(`Excluir ${item.title || item.name || item.label || "este item"}?`)) {
          if (collection === "properties") {
            return props.deleteProperty(itemId).then((result) => { crudStatus = result.message || "Produto removido do GitHub."; props.requestRender?.(); });
          }
          setCollectionItems(collection, getCollectionItems(collection).filter((entry) => entry.id !== itemId));
          crudStatus = "Item removido localmente.";
          persistDashboard();
        }
      }
      if (message.type === "saveItem") {
        const collection = message.collection || activeTab;
        const fields = message.fields || {};
        if (collection === "clients") {
          const form = message.target?.tagName === "FORM" ? message.target : message.target?.closest?.("form");
          const labelInputs = Array.from(form?.querySelectorAll('[data-attachment-label="true"]') || []);
          const fileInputs = Array.from(form?.querySelectorAll('[data-attachment-file="true"]') || []);
          const attachments = [];
          const readFile = (file) => new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(String(reader.result || ""));
            reader.onerror = () => resolve("");
            reader.readAsDataURL(file);
          });
          return Promise.all(fileInputs.map(async (input, index) => {
            const file = input.files?.[0];
            if (!file) return;
            const dataUrl = await readFile(file);
            attachments.push({ name: file.name, label: labelInputs[index]?.value || file.name, type: file.type, size: file.size, dataUrl });
          })).then(() => {
            const client = normalizeDashboardItem("clients", { ...fields, attachments });
            dashboardContent = { ...dashboardContent, clients: [client, ...dashboardContent.clients] };
            crudStatus = `Cliente ${client.name || "salvo"} cadastrado com ${attachments.length} anexo(s).`;
            clientAttachmentRows = Math.max(2, attachments.length || 2);
            return persistDashboard();
          });
        }
        if (collection === "appointments") {
          const broker = brokers.find((entry) => entry.name === fields.broker);
          const appointment = normalizeDashboardItem("appointments", { ...fields, phone: fields.phone || broker?.phone || "", status: fields.status || "confirmado" });
          dashboardContent = { ...dashboardContent, appointments: [appointment, ...dashboardContent.appointments] };
          crudStatus = `Agendamento salvo para ${appointment.client || "cliente"}.`;
          appointmentModalOpen = false;
          return persistDashboard();
        }
      }

      const currentLabel = tabs.find(([id]) => id === activeTab)?.[1] || "Painel";
      const mainPanel = () => {
        if (activeTab === "overview") return renderOverview();
        if (activeTab === "metrics") return renderCollectionCard("metrics");
        if (activeTab === "activities") return renderCollectionCard("activities");
        if (activeTab === "appointments") return renderCollectionCard("appointments");
        if (activeTab === "clients") return renderCollectionCard("clients");
        if (activeTab === "reports") return renderCollectionCard("reports");
        if (activeTab === "properties") return renderCollectionCard("properties");
        if (activeTab === "settings") return renderCollectionCard("settings");
        return renderOverview();
      };

      return {
        done: false,
        value: /*html*/`
          <section id="dashboard" class="dashboard-section dashboard-fullscreen">
            <div class="dashboard-shell">
              <aside class="dashboard-nav">
                <div class="dashboard-nav-top">
                  ${brand()}
                  <button class="ghost-btn dashboard-back" type="button" data-route="home">Voltar ao site</button>
                </div>
                <div class="dash-menu">
                  ${tabs.map(([id, label, icon]) => /*html*/`<button class="${id === activeTab ? "active" : ""}" type="button" data-cid="dashboard" data-message="setTab" data-value="${id}"><span class="dash-menu-icon">${icon}</span><span>${label}</span></button>`).join("")}
                  <button type="button" data-cid="dashboard" data-message="logout"><span class="dash-menu-icon">&#8599;</span><span>Sair</span></button>
                </div>
              </aside>
              <div class="dashboard-board">
                <div class="dashboard-head">
                  <div>
                    <span class="eyebrow">Area interna</span>
                    <h2>${currentLabel}</h2>
                    <p>${activeTab === "overview" ? "Visao geral com acesso rapido para os modulos do painel." : activeTab === "properties" ? "Gerencie os produtos com uma toolbar de utilidade e a pagina de edicao ao vivo." : DASHBOARD_COLLECTION_SCHEMAS[activeTab]?.description || "Gestao interna do painel."}</p>
                  </div>
                  <div class="broker-person"><img class="avatar" src="${brokers[1].photo}" alt="Admin"><div><strong>Admin</strong><div class="location">Conteudo do painel</div></div></div>
                </div>
                ${renderActionBanner()}
                ${mainPanel()}
              </div>
            </div>
          </section>
        `,
      };
    },
  };
};
