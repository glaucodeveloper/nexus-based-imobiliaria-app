  const DashboardOverviewComponent = ({ props }) => {
    const metrics = props.metrics || [];
    const items = props.items || {};
    const renderPreview = (collection, title, targetTab) => DashboardPreviewCardComponent({
      props: {
        collection,
        title,
        targetTab,
        items: items[collection] || [],
      },
    }).next().value;
    return {
      next() {
        return {
          done: false,
          value: `
            <div class="metric-grid">${metrics.map((metric, index) => `<div class="metric metric-${index + 1}"><small>${metric.label}</small><strong${metric.color ? ` style="color:${metric.color};"` : ""}>${metric.value}</strong><span>${index === 0 ? "base total" : index === 1 ? "publicados agora" : index === 2 ? "pipeline atual" : "janela mensal"}</span></div>`).join("")}</div>
            <div class="dashboard-columns">
              ${renderPreview("activities", "Atividades recentes", "activities")}
              ${renderPreview("properties", "Imoveis em destaque", "properties")}
            </div>
          `,
        };
      },
    };
  };
