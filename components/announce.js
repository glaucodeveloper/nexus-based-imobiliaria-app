  const AnnounceComponent = ({ props }) => {
    let status = "";
    return {
      next(message = {}) {
        if (message.type === "announce") {
          props.addLead({
            name: message.fields.ownerName || "Lead de captacao",
            source: "Anuncie seu imovel",
            interest: message.fields.propertyType || "Imovel para avaliacao",
            stage: "novo",
          });
          status = "Lead de captacao salvo no dashboard.";
        }
        return {
          done: false,
          value: /*html*/`
            <section id="anuncie" class="section">
              <div class="container">
                <div class="ad-banner">
                  <div class="ad-copy">
                    <h3>Anuncie seu imovel com quem entende</h3>
                    <p>Preencha os dados principais e a equipe comercial recebe o lead de captacao.</p>
                    <button class="gold-btn" type="button" data-route="contato">Falar com especialista</button>
                  </div>
                  <img src="https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=1100&q=82" alt="Sala elegante" loading="lazy">
                </div>
                <form class="phone-strip announce-form-grid" data-cid="announce" data-message="announce" aria-label="Fluxo de anuncio">
                  <article class="phone-card">
                    <h3>1. Proprietario</h3>
                    <div class="mini-field"><label>Nome</label><input name="ownerName" required placeholder="Digite seu nome"></div>
                    <div class="mini-field"><label>Telefone</label><input name="phone" required placeholder="(71) 99999-0000"></div>
                    <div class="mini-field"><label>E-mail</label><input name="email" type="email" placeholder="seuemail@email.com"></div>
                  </article>
                  <article class="phone-card">
                    <h3>2. Imovel</h3>
                    <div class="mini-field"><label>Tipo</label><select name="propertyType"><option>Casa</option><option>Apartamento</option><option>Terreno</option></select></div>
                    <div class="mini-field"><label>Bairro</label><input name="neighborhood" placeholder="Informe o bairro"></div>
                    <div class="mini-field"><label>Valor estimado</label><input name="value" placeholder="R$"></div>
                  </article>
                  <article class="phone-card">
                    <h3>3. Envio</h3>
                    <div class="mini-field"><label>Descricao</label><input name="description" placeholder="Resumo do imovel"></div>
                    <label class="check-list"><span><input name="privacy" type="checkbox" required> Aceito a politica de privacidade</span></label>
                    ${status ? `<p class="login-error">${status}</p>` : `<p class="location">Notificacao simulada para a equipe comercial.</p>`}
                    <button class="gold-btn" style="width:100%;" type="submit">Continuar</button>
                  </article>
                </form>
              </div>
            </section>
          `,
        };
      },
    };
  };
