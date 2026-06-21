  const DashboardComponentStateful = ({ props }) => {
    let activeTab = "overview";
    let crudStatus = "";
    const tabs = [
      ["overview", "Dashboard", "⌂"],
      ...Object.entries(DASHBOARD_COLLECTION_SCHEMAS).map(([id, schema], index) => [id, schema.label, ["▣", "◎", "◔", "◫", "◩", "◬", "⚙"][index] || "•"]),
    ];
    const getCollectionItems = (collection) => {
      if (collection === "properties") return properties;
      return dashboardContent[collection] || [];
    };
    const setCollectionItems = (collection, items) => {
      if (collection === "properties") {
        properties = normalizeDashboardCollection("properties", items);
        return;
      }
      dashboardContent = {
        ...dashboardContent,
        [collection]: normalizeDashboardCollection(collection, items),
      };
    };
    const renderCollectionCard = (collection) => DashboardCollectionCardComponent({
      props: {
        collection,
        items: getCollectionItems(collection),
        crudStatus,
      },
    }).next().value;
    const renderPropertiesWorkspace = () => DashboardPropertiesWorkspaceComponent({
      props: {
        items: properties,
      },
    }).next().value;
    const renderOverview = () => DashboardOverviewComponent({
      props: {
        metrics: dashboardContent.metrics,
        items: {
          activities: getCollectionItems("activities"),
          properties: getCollectionItems("properties"),
        },
      },
    }).next().value;
    return {
      next(message = {}) {
        if (message.type === "setTab") {
          activeTab = message.value || activeTab;
        }
        if (message.type === "newItem") {
          crudStatus = "";
        }
        if (message.type === "deleteItem") {
          const collection = message.collection || activeTab;
          const itemId = message.itemId;
          const item = getCollectionItems(collection).find((entry) => entry.id === itemId);
          if (item && window.confirm(`Excluir ${item.title || item.name || item.label || item.subject || "este item"}?`)) {
            if (collection === "properties") {
              props.deleteProperty(itemId).then(() => {
                crudStatus = "Produto removido do GitHub.";
                props.requestRender();
              }).catch((error) => {
                crudStatus = error.message;
                props.requestRender();
              });
            } else {
              setCollectionItems(collection, getCollectionItems(collection).filter((entry) => entry.id !== itemId));
              crudStatus = "Item removido localmente.";
            }
          }
        }
        if (message.type === "saveItem") {
          const collection = message.collection || activeTab;
          const schema = DASHBOARD_COLLECTION_SCHEMAS[collection];
          if (schema && collection !== "properties") crudStatus = `${schema.itemLabel.charAt(0).toUpperCase()}${schema.itemLabel.slice(1)} gerado apenas como entrada do dashboard.`;
        }
        const currentLabel = tabs.find(([id]) => id === activeTab)?.[1] || "Dashboard";
        const mainPanel = () => {
          if (activeTab === "overview") return renderOverview();
          if (activeTab === "properties") return renderPropertiesWorkspace();
          if (activeTab === "settings") return renderCollectionCard("settings");
          if (DASHBOARD_EDITABLE_COLLECTIONS.has(activeTab)) return renderCollectionCard(activeTab);
          return renderOverview();
        };
        return {
          done: false,
          value: `
            <section id="dashboard" class="dashboard-section dashboard-fullscreen">
              <div class="dashboard-shell">
                <aside class="dashboard-nav">
                  <div class="dashboard-nav-top">
                    ${brand()}
                    <button class="ghost-btn dashboard-back" type="button" data-route="home">Voltar ao site</button>
                  </div>
                  <div class="dash-menu">${tabs.map(([id, label, icon]) => `<button class="${id === activeTab ? "active" : ""}" type="button" data-cid="dashboard" data-message="setTab" data-value="${id}"><span class="dash-menu-icon">${icon}</span><span>${label}</span></button>`).join("")}<button type="button" data-cid="dashboard" data-message="logout"><span class="dash-menu-icon">↗</span><span>Sair</span></button></div>
                </aside>
                <div class="dashboard-board">
                  <div class="dashboard-head">
                    <div>
                      <span class="eyebrow">Area interna</span>
                      <h2>${currentLabel}</h2>
                      <p>${activeTab === "overview" ? "Visao geral com acessos rapidos para o CRUD do painel." : activeTab === "properties" ? "Gerencie os produtos abrindo a pagina de edição ou criando um novo produto em tela cheia." : DASHBOARD_COLLECTION_SCHEMAS[activeTab]?.description || "Gestao interna do painel."}</p>
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
