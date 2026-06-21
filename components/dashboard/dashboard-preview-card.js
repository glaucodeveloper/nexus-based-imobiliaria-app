  const DashboardPreviewCardComponent = ({ props }) => {
    const collection = props.collection;
    const title = props.title;
    const targetTab = props.targetTab;
    const items = props.items || [];
    const getRow = (item, index) => DashboardItemRowComponent({
      props: { collection, item, index },
    }).next().value;
    return {
      next() {
        return {
          done: false,
          value: `
            <article class="dashboard-card dashboard-preview-card">
              <div class="dashboard-card-head">
                <h3>${title}</h3>
                <button class="ghost-btn" type="button" data-cid="dashboard" data-message="setTab" data-value="${targetTab}">Abrir</button>
              </div>
              <div class="activity dashboard-items">
                ${items.length ? items.map((item, index) => getRow(item, index)).join("") : `<div class="route-note">Nenhum item cadastrado ainda.</div>`}
              </div>
            </article>
          `,
        };
      },
    };
  };
