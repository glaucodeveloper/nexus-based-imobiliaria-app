  const HeroComponent = () => {
    let tab = "comprar";
    return {
      next(message = {}) {
        if (message.type === "setTab") tab = message.value || tab;
        return {
          done: false,
          value: /*html*/`
            <section id="home" class="hero">
              <div class="container hero-shell">
                <div class="hero-content">
                  <span class="eyebrow">Curadoria premium</span>
                  <h1>Encontre o imovel ideal para voce</h1>
                  <p>Casas, apartamentos e terrenos nas melhores localizacoes da cidade, com atendimento consultivo do primeiro clique ate a entrega das chaves.</p>
                </div>
                <div class="search-panel" role="search">
                  <div class="tabs">
                    <button class="tab ${tab === "comprar" ? "active" : ""}" type="button" data-cid="hero" data-message="setTab" data-value="comprar">Comprar</button>
                    <button class="tab ${tab === "alugar" ? "active" : ""}" type="button" data-cid="hero" data-message="setTab" data-value="alugar">Alugar</button>
                  </div>
                  <div class="search-grid">
                    <label class="field"><span>Localizacao</span><input name="quickLocation" placeholder="Cidade, bairro ou condominio"></label>
                    <label class="field"><span>Tipo de imovel</span><select><option>Todos</option><option>Casa</option><option>Apartamento</option><option>Terreno</option></select></label>
                    <label class="field"><span>Faixa de preco</span><select><option>Qualquer preco</option><option>Ate R$ 700 mil</option><option>Acima de R$ 1 mi</option></select></label>
                    <button class="gold-btn" type="button" data-route="comprar">Buscar imoveis</button>
                  </div>
                </div>
                <div class="hero-trustbar">
                  <div><strong>+20</strong><span>anos de experiencia</span></div>
                  <div><strong>124</strong><span>imoveis ativos</span></div>
                  <div><strong>100%</strong><span>apoio consultivo</span></div>
                </div>
              </div>
            </section>
          `,
        };
      },
    };
  };
