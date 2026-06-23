  const DashboardCollectionCardComponent = ({ props }) => {
    const collection = props.collection;
    const schema = DASHBOARD_COLLECTION_SCHEMAS[collection];
    const items = props.items || [];
    const crudStatus = props.crudStatus || "";
    const getRow = (item, index) => DashboardItemRowComponent({
      props: { collection, item, index },
    }).next().value;
    const fields = schema.fields.filter((field) => field.name !== "id");
    const formFields = fields
      .map((field) => {
        const sample = items[0]?.[field.name];
        const value = field.type === "textarea" ? (Array.isArray(sample) ? sample.join(", ") : sample || "") : sample || "";
        if (field.type === "textarea") {
          return /*html*/`<label class="mini-field"><span>${field.label}</span><textarea name="${field.name}" rows="3" placeholder="${field.placeholder || ""}">${escapeHtml(Array.isArray(value) ? value.join(", ") : value)}</textarea></label>`;
        }
        return /*html*/`<label class="mini-field"><span>${field.label}</span><input name="${field.name}" type="${field.type === "number" ? "number" : "text"}" value="${escapeHtml(value)}" placeholder="${field.placeholder || ""}"></label>`;
      })
      .join("");
    return {
      next() {
        return {
          done: false,
          value: /*html*/`
            <div class="dashboard-columns dashboard-crud-layout">
              <article class="dashboard-card dashboard-form-card">
                <h3>${collectionFormTitle(collection, "create")}</h3>
                <p class="location">${schema.description}</p>
                <form class="filter-stack crud-form" data-cid="dashboard" data-message="saveItem" data-collection="${collection}">
                  ${formFields}
                  <div class="dashboard-form-actions">
                    <button class="ghost-btn" type="button" data-cid="dashboard" data-message="newItem" data-collection="${collection}">Novo ${schema.itemLabel}</button>
                    <button class="gold-btn" type="submit">Salvar item</button>
                  </div>
                </form>
                ${crudStatus ? `<p class="route-note">${crudStatus}</p>` : ""}
              </article>
              <article class="dashboard-card">
                <div class="dashboard-card-head">
                  <h3>${schema.title}</h3>
                  <span>${items.length}</span>
                </div>
                <div class="activity dashboard-items">
                  ${items.length ? items.map((item, index) => getRow(item, index)).join("") : `<div class="route-note">Nenhum item cadastrado ainda.</div>`}
                </div>
              </article>
            </div>
          `,
        };
      },
    };
  };
