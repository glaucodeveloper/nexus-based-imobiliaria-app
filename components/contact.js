  const ContactComponent = ({ props }) => {
    let status = "";
    return {
      next(message = {}) {
        if (message.type === "contact") {
          props.addLead({ name: message.fields.name || "Contato", source: "Contato", interest: message.fields.interest || "Mensagem geral", stage: "novo" });
          status = "Mensagem salva como lead.";
        }
        return {
          done: false,
					value: /*html*/`<section class="section detail-section"><div class="container"><div class="breadcrumb-row"><span>Home</span><span>Contato</span></div><div class="section-title"><div><span class="eyebrow">Contato</span><h2>Fale com a imobiliaria</h2><p>Atendimento consultivo, envio de favoritos, visitas e captacao em um unico ponto de contato.</p></div></div><div class="phone-strip"><article class="phone-card"><h3>WhatsApp</h3><p class="location">(71) 99999-0000</p><button class="gold-btn" type="button">Iniciar conversa</button></article><form class="phone-card" data-cid="contact" data-message="contact"><h3>Formulario</h3>
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
							</form>
						</div>	<article class="phone-card"><h3>Endereco</h3><p class="location">Rua das Acacias, 129<br>Caminho das Arvores, Salvador/BA</p><button class="ghost-btn" type="button">Ver mapa</button></article></div></div></section>`,
        };
      },
    };
  };
