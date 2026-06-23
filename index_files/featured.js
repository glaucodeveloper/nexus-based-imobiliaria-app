  const FeaturedComponent = ({ props }) => ({
    next(message = {}) {
      if (message.type === "toggleFavorite") props.toggleFavorite(message.propertyId);
      const renderPropertyCard = (property) => PropertyCardComponent({
        props: {
          property,
          tools: { componentId: "featured", isFavorite: props.isFavorite },
        },
      }).next().value;
      return {
        done: false,
        value: /*html*/`
          <section id="destaques" class="section">
            <div class="container">
              <div class="section-title">
                <div><span class="eyebrow">Destaques</span><h2>Imoveis em destaque</h2><p>Selecionamos as oportunidades mais fortes para voce.</p></div>
                <button class="ghost-btn" type="button" data-route="comprar">Ver todos</button>
              </div>
              <div class="property-grid">${properties.slice(0, 4).map((property) => renderPropertyCard(property)).join("")}</div>
            </div>
          </section>
        `,
      };
    },
  });

