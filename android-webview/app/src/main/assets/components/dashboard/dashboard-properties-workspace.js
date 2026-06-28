  const DashboardPropertiesWorkspaceComponent = ({ props }) => {
    const renderRow = (item, index) => DashboardItemRowComponent({
      props: { collection: "properties", item, index },
    }).next().value;
    return {
      next() {
        return {
          done: false,
          value: /*html*/`
            <div class="dashboard-columns dashboard-crud-layout">
              <article class="dashboard-card dashboard-form-card dashboard-highlight-card">
                <h3>Novo produto</h3>
                <p class="location">Abra uma tela de edição baseada na própria página do produto para criar um novo imóvel e publicar no GitHub.</p>
                <div class="dashboard-form-actions">
                  <button class="gold-btn" type="button" data-route="imovel-novo">Novo produto</button>
                  <button class="ghost-btn" type="button" data-route="imovel-novo">Editar como novo</button>
                </div>
                <p class="route-note">A criação e a edição usam a mesma tela com preview ao vivo.</p>
              </article>
              <article class="dashboard-card">
                <div class="dashboard-card-head">
                  <h3>Produtos cadastrados</h3>
                  <span>${props.items.length}</span>
                </div>
                <div class="activity dashboard-items">
                  ${props.items.map((item, index) => renderRow(item, index)).join("")}
                </div>
              </article>
            </div>
          `,
        };
      },
    };
  };
