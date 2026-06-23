const ContactComponent = ({ props }) => {
  let status = "";
  let announceStatus = "";
  let announceOpen = false;

  return {
    next(message = {}) {
      if (message.type === "contact") {
        props.addLead({
          name: message.fields.name || "Contato",
          source: "Contato",
          interest: message.fields.interest || "Mensagem geral",
          stage: "novo",
        });
        status = "Mensagem salva como lead.";
      }

      if (message.type === "toggleAnnounce") {
        announceOpen = !announceOpen;
        announceStatus = "";
      }

      if (message.type === "announce") {
        props.addLead({
          name: message.fields.ownerName || "Lead de captacao",
          source: "Anuncie seu imovel",
          interest: message.fields.propertyType || "Imovel para avaliacao",
          stage: "novo",
        });
        announceOpen = true;
        announceStatus = "Lead de captacao salvo no dashboard.";
      }

      const announcePanelClass = announceOpen ? "is-active" : "is-inactive";
      const contactPanelClass = announceOpen ? "is-inactive" : "is-active";

      return {
        done: false,
        value: /*html*/ `
            <section class="section detail-section contact-section">
              <div class="container">
                <div class="breadcrumb-row"><span>Home</span><span>Contato</span></div>

                <div class="ad-banner contact-banner">
                  <div class="ad-copy contact-banner-copy">
                    <div class="section-title">
										<div>
											<span class="eyebrow">Contato</span>
											<h2>Fale com a imobiliaria</h2>
											<p>Atendimento consultivo, envio de favoritos, visitas e captacao em um unico ponto de contato.</p>
										</div>
                </div>
                    <div class="contact-banner-actions">
                      <button class="gold-btn" type="button" data-cid="contact" data-message="toggleAnnounce">${announceOpen ? "Voltar ao contato" : "Anuncie"}</button>
                    </div>
                  </div>
                  <img src="https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=1100&q=82" alt="Sala elegante" loading="lazy">
                  <div class="contact-banner-slot">
                    <div class="contact-panel ${contactPanelClass}">
                      <div class="phone-strip contact-strip">
                        <article class="phone-card">
                          <h3>WhatsApp</h3>
                          <p class="location">(71) 99999-0000</p>
                          <button class="gold-btn" type="button">Iniciar conversa</button>
                        </article>
                        <form class="phone-card" data-cid="contact" data-message="contact">
                          <h3>Formulario</h3>
                          <div>
                            <div class="mini-field">
                              <label>Nome</label>
                              <input name="name" required>
                            </div>
                            <div class="mini-field">
                              <label>Telefone</label>
                              <input name="phone" required>
                            </div>
                            <div class="mini-field">
                              <label>Interesse</label>
                              <input name="interest">
                            </div>
                            <button class="gold-btn" type="submit">Enviar</button>
                            ${status ? `<p class="login-error">${status}</p>` : ""}
                          </div>
                        </form>
                        <article class="phone-card">
                          <h3>Endereco</h3>
                          <p class="location">Rua das Acacias, 129<br>Caminho das Arvores, Salvador/BA</p>
                          <button class="ghost-btn" type="button">Ver mapa</button>
                        </article>
                      </div>
                    </div>
                    <div class="contact-panel ${announcePanelClass}">
                      <form class="phone-strip announce-form-grid" data-cid="contact" data-message="announce" aria-label="Fluxo de anuncio">
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
                          ${announceStatus ? `<p class="login-error">${announceStatus}</p>` : `<p class="location">Notificacao simulada para a equipe comercial.</p>`}
                          <button class="gold-btn" style="width:100%;" type="submit">Continuar</button>
                        </article>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          `,
      };
    },
  };
};
