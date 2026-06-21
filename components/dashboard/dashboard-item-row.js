  const DashboardItemRowComponent = ({ props }) => {
    const collection = props.collection;
    const item = props.item;
    const index = props.index || 0;
    const summary = summarizeItem(collection, item, index);
    const propertyActions = collection === "properties";
    return {
      next() {
        return {
          done: false,
          value: `
            <article class="activity-row dashboard-item-row">
              <span class="dot" style="background:${item.color || "var(--gold)"};">${summary.icon || "•"}</span>
              <div class="dashboard-item-copy">
                <strong>${summary.title}</strong>
                <div class="location">${summary.detail || ""}</div>
                ${summary.badge ? `<small class="route-note">${summary.badge}</small>` : ""}
              </div>
              ${propertyActions ? `<div class="dashboard-item-actions"><button class="ghost-btn" type="button" data-route="imovel-editar" data-property-id="${item.id}">Editar</button><button class="ghost-btn danger-btn" type="button" data-cid="dashboard" data-message="deleteItem" data-collection="${collection}" data-item-id="${item.id}">Excluir</button></div>` : ""}
            </article>
          `,
        };
      },
    };
  };
