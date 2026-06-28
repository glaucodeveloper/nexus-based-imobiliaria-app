const QuizComponent = ({ props }) => {
  const steps = [
    {
      id: "goal",
      label: "Objetivo",
      question: "O que voce quer resolver agora?",
      helper: "Comecamos pelo destino da busca para o assistente entender a intencao do lead.",
      options: [
        ["comprar", "Comprar para morar", "Busca principal, prazo e perfil familiar."],
        ["alugar", "Alugar com agilidade", "Prioriza disponibilidade e rotina."],
        ["investir", "Investir com criterio", "Olha liquidez, regiao e potencial."],
      ],
    },
    {
      id: "profile",
      label: "Tipo",
      question: "Qual formato conversa melhor com seu momento?",
      helper: "A resposta filtra a vitrine e muda a abordagem da conversa.",
      options: [
        ["casa", "Casa", "Mais privacidade, area externa e conforto."],
        ["apartamento", "Apartamento", "Praticidade, seguranca e localizacao."],
        ["terreno", "Terreno", "Projeto sob medida ou patrimonio."],
      ],
    },
    {
      id: "budget",
      label: "Investimento",
      question: "Qual faixa faz sentido para avancar?",
      helper: "Essa faixa ajuda o consultor a evitar sugestoes fora do combinado.",
      options: [
        ["ate-700", "Ate R$ 700 mil", "Entrada mais conservadora."],
        ["ate-1200", "Ate R$ 1,2 mi", "Equilibrio entre liquidez e conforto."],
        ["acima-1200", "Acima de R$ 1,2 mi", "Busca premium ou alta valorizacao."],
      ],
    },
    {
      id: "pace",
      label: "Prazo",
      question: "Quando voce gostaria de conversar sobre opcoes reais?",
      helper: "O prazo define a prioridade do lead e o tom do atendimento.",
      options: [
        ["agora", "Ainda hoje", "Lead quente para atendimento imediato."],
        ["semana", "Nesta semana", "Lead ativo, pronto para curadoria."],
        ["pesquisa", "Estou pesquisando", "Nutricao com boas oportunidades."],
      ],
    },
  ];

  const labels = steps.reduce((acc, step) => {
    acc[step.id] = step.options.reduce((optionAcc, [value, label]) => {
      optionAcc[value] = label;
      return optionAcc;
    }, {});
    return acc;
  }, {});

  let stepIndex = 0;
  let answers = {};
  let lead = { name: "", phone: "", note: "" };
  let leadSaved = false;
  let chatOpen = false;
  let assistantReply = "";
  let assistantLoading = false;
  let assistantError = "";

  const escapeHtml = (value = "") =>
    String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

  const getAnswerLabel = (id) => labels[id]?.[answers[id]] || "";

  const pickSuggestion = () => {
    let pool = properties.slice();
    if (answers.profile === "casa")
      pool = pool.filter((item) => item.kind === "Casa");
    if (answers.profile === "apartamento")
      pool = pool.filter(
        (item) => item.kind === "Apartamento" || item.kind === "Cobertura",
      );
    if (answers.profile === "terreno")
      pool = pool.filter((item) => item.kind === "Terreno");
    if (answers.budget === "ate-700")
      pool = pool.filter((item) => item.priceNumber <= 700000);
    if (answers.budget === "ate-1200")
      pool = pool.filter((item) => item.priceNumber <= 1200000);
    if (answers.budget === "acima-1200")
      pool = pool.filter((item) => item.priceNumber >= 1200000);
    return pool[0] || properties[0];
  };

  const buildLeadSummary = (suggestion) => [
    getAnswerLabel("goal"),
    getAnswerLabel("profile"),
    getAnswerLabel("budget"),
    getAnswerLabel("pace"),
    suggestion?.title,
  ].filter(Boolean);

  const getGeminiApiKey = () =>
    (typeof window !== "undefined"
      ? window.SuaImobiliariaCmsConfig?.geminiApiKey
      : "") ||
    (typeof localStorage !== "undefined"
      ? localStorage.getItem("mezanino:geminiApiKey")
      : "") ||
    "";

  const buildAssistantPrompt = (suggestion) => `
Voce e o Assistente Mezanino, consultor digital de uma imobiliaria premium na Bahia.
Responda em portugues do Brasil, com tom humano, objetivo e comercial.
Crie uma mensagem curta para iniciar atendimento com este lead.

Dados do lead:
- Nome: ${lead.name || "Lead qualificado"}
- Telefone: ${lead.phone || "nao informado"}
- Objetivo: ${getAnswerLabel("goal") || "nao informado"}
- Tipo de imovel: ${getAnswerLabel("profile") || "nao informado"}
- Faixa de investimento: ${getAnswerLabel("budget") || "nao informado"}
- Prazo: ${getAnswerLabel("pace") || "nao informado"}
- Observacao: ${lead.note || "sem observacao"}

Imovel sugerido:
- Titulo: ${suggestion.title}
- Cidade/regiao: ${suggestion.city}
- Preco: ${suggestion.price}
- Caracteristicas: ${(suggestion.meta || []).join(", ")}

Entregue em ate 70 palavras:
1. confirme que entendeu o perfil;
2. cite o imovel sugerido;
3. proponha o proximo passo com um consultor.
`;

  const requestAssistantReply = async (suggestion) => {
    const apiKey = getGeminiApiKey();
    if (!apiKey) {
      assistantReply =
        "Entendi seu perfil e ja separei uma primeira sugestao alinhada. Um consultor pode validar disponibilidade, comparar opcoes parecidas e seguir pelo WhatsApp com uma curadoria mais precisa.";
      assistantError = "Configure a chave Gemini para resposta gerada por IA.";
      props.requestRender?.();
      return;
    }
    assistantLoading = true;
    assistantError = "";
    assistantReply = "";
    props.requestRender?.();
    try {
      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-goog-api-key": apiKey,
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: buildAssistantPrompt(suggestion) }],
              },
            ],
          }),
        },
      );
      if (!response.ok)
        throw new Error(`Gemini respondeu com status ${response.status}`);
      const data = await response.json();
      assistantReply =
        data?.candidates?.[0]?.content?.parts
          ?.map((part) => part.text || "")
          .join(" ")
          .trim() || "";
      if (!assistantReply)
        throw new Error("Gemini nao retornou texto para a conversa.");
    } catch (error) {
      assistantError = error.message || "Nao foi possivel chamar o Gemini.";
      assistantReply =
        "Seu perfil ja esta qualificado. Vou direcionar a conversa para um consultor validar a sugestao, confirmar disponibilidade e trazer alternativas no mesmo padrao.";
    } finally {
      assistantLoading = false;
      props.requestRender?.();
    }
  };

  const renderSummary = () => /*html*/ `
    <div class="lead-summary-list">
      ${steps
        .map(
          (step, index) => /*html*/ `
            <div class="lead-summary-item ${answers[step.id] ? "is-filled" : ""}">
              <span>${index + 1}</span>
              <div>
                <strong>${step.label}</strong>
                <p>${escapeHtml(getAnswerLabel(step.id) || "Aguardando resposta")}</p>
              </div>
            </div>
          `,
        )
        .join("")}
    </div>
  `;

  const renderChat = (suggestion) => {
    const userName = lead.name ? escapeHtml(lead.name.split(" ")[0]) : "voce";
    const leadName = lead.name ? escapeHtml(lead.name) : "Lead qualificado";
    const leadPhone = lead.phone ? escapeHtml(lead.phone) : "Contato a confirmar";
    const note = lead.note ? escapeHtml(lead.note) : "Sem observacao adicional.";
    const goal = escapeHtml(getAnswerLabel("goal") || "Busca de imovel");
    const profile = escapeHtml(getAnswerLabel("profile") || "Perfil aberto");
    const budget = escapeHtml(getAnswerLabel("budget") || "Faixa aberta");
    const pace = escapeHtml(getAnswerLabel("pace") || "Prazo a alinhar");
    const botReply = assistantLoading
      ? "Estou cruzando suas respostas com a curadoria da Mezanino..."
      : assistantReply ||
        "Seu perfil esta pronto para atendimento. Vou organizar a primeira sugestao e proximos passos.";

    return /*html*/ `
      <div class="assistant-chat" aria-label="Conversa com assistente">
        <div class="assistant-chat-head">
          <span class="assistant-avatar">M</span>
          <div>
            <strong>Assistente Mezanino</strong>
            <p>${leadSaved ? "Lead criado e conversa iniciada" : "Pronto para qualificar"}</p>
          </div>
        </div>
        <div class="assistant-messages">
          <div class="assistant-message is-bot">
            <span>Assistente</span>
            <p>Perfeito, ${userName}. Eu cruzei seu objetivo com o perfil informado e encontrei uma boa primeira rota.</p>
          </div>
          <div class="assistant-message is-user">
            <span>${leadName}</span>
            <p>${goal}. Procuro ${profile.toLowerCase()} na faixa ${budget.toLowerCase()} e quero avancar: ${pace.toLowerCase()}.</p>
          </div>
          <div class="assistant-message is-bot">
            <span>Assistente</span>
            <p>${escapeHtml(botReply)}</p>
            ${assistantError ? `<small class="assistant-status">${escapeHtml(assistantError)}</small>` : ""}
          </div>
          <div class="assistant-lead-ticket">
            <div>
              <span>Entrada de lead</span>
              <strong>${leadPhone}</strong>
            </div>
            <p>${note}</p>
          </div>
        </div>
      </div>
    `;
  };

  return {
    next(message = {}) {
      const currentStep = steps[stepIndex];
      if (message.type === "selectOption" && currentStep) {
        answers = { ...answers, [currentStep.id]: message.value };
      }
      if (
        message.type === "nextStep" &&
        currentStep &&
        answers[currentStep.id]
      ) {
        stepIndex = Math.min(stepIndex + 1, steps.length);
      }
      if (message.type === "prevStep") {
        stepIndex = Math.max(stepIndex - 1, 0);
        chatOpen = false;
      }
      if (message.type === "restartQuiz") {
        stepIndex = 0;
        answers = {};
        lead = { name: "", phone: "", note: "" };
        leadSaved = false;
        chatOpen = false;
        assistantReply = "";
        assistantLoading = false;
        assistantError = "";
      }
      if (message.type === "submitLead") {
        const fields = message.fields || {};
        const suggestion = pickSuggestion();
        lead = {
          name: fields.name || "Lead qualificado",
          phone: fields.phone || "",
          note: fields.note || "",
        };
        if (!leadSaved) {
          props.addLead({
            name: lead.name,
            source: "Imersao assistida",
            interest: buildLeadSummary(suggestion).join(" | "),
            stage: answers.pace === "agora" ? "quente" : "qualificando",
          });
          leadSaved = true;
        }
        chatOpen = true;
        stepIndex = steps.length;
        void requestAssistantReply(suggestion);
      }

      const completed = stepIndex >= steps.length;
      const suggestion = pickSuggestion();
      const activeStep = steps[Math.min(stepIndex, steps.length - 1)];
      const progress = `${Math.min(stepIndex + 1, steps.length)}/${steps.length}`;

      return {
        done: false,
        value: /*html*/ `
          <section id="quiz" class="section dashboard-lite-section lead-immersion-section">
            <div class="container">
              <div class="quiz-layout lead-immersion-layout">
                <article class="quiz-card lead-immersion-card">
                  <div class="quiz-head">
                    <button class="quiz-back" type="button" ${stepIndex === 0 ? "disabled" : `data-cid="quiz" data-message="prevStep"`}>←</button>
                    <div class="breadcrumb-row"><span>Home</span><span>Entrada de lead</span></div>
                    <span class="quiz-progress">${completed ? "Conversa" : progress}</span>
                  </div>
                  <span class="eyebrow">Imersao assistida</span>
                  <h2>${completed ? "Seu atendimento comeca em formato de conversa" : activeStep.question}</h2>
                  <p>${completed ? "As respostas viraram contexto comercial, sugestao de imovel e uma conversa pronta para o consultor continuar." : activeStep.helper}</p>
                  ${
                    completed
                      ? /*html*/ `
                        <article class="quiz-result-card lead-result-card">
                          <img src="${suggestion.image}" alt="${escapeHtml(suggestion.title)}" loading="lazy">
                          <div>
                            <span class="property-type">${escapeHtml(suggestion.type)}</span>
                            <h3>${escapeHtml(suggestion.title)}</h3>
                            <div class="location">${escapeHtml(suggestion.city)}</div>
                            <div class="meta">${suggestion.meta.map((item) => /*html*/ `<span>${escapeHtml(item)}</span>`).join("")}</div>
                            <strong class="price">${escapeHtml(suggestion.price)}</strong>
                          </div>
                        </article>
                        ${
                          chatOpen
                            ? renderChat(suggestion)
                            : /*html*/ `
                              <form class="lead-chat-form" data-cid="quiz" data-message="submitLead">
                                <label class="mini-field">
                                  <span>Nome</span>
                                  <input name="name" type="text" value="${escapeHtml(lead.name)}" placeholder="Seu nome" required>
                                </label>
                                <label class="mini-field">
                                  <span>WhatsApp</span>
                                  <input name="phone" type="tel" value="${escapeHtml(lead.phone)}" placeholder="(71) 99999-0000" required>
                                </label>
                                <label class="mini-field lead-chat-note">
                                  <span>Mensagem para o assistente</span>
                                  <textarea name="note" rows="3" placeholder="Conte uma preferencia importante">${escapeHtml(lead.note)}</textarea>
                                </label>
                                <button class="gold-btn" type="submit">Iniciar conversa</button>
                              </form>
                            `
                        }
                      `
                      : /*html*/ `
                        <div class="quiz-options lead-option-grid">
                          ${activeStep.options
                            .map(
                              ([value, label, detail]) => /*html*/ `
                                <button class="quiz-option lead-option ${answers[activeStep.id] === value ? "active" : ""}" type="button" data-cid="quiz" data-message="selectOption" data-value="${value}">
                                  <span class="quiz-option-mark"></span>
                                  <span>
                                    <strong>${label}</strong>
                                    <small>${detail}</small>
                                  </span>
                                </button>
                              `,
                            )
                            .join("")}
                        </div>
                      `
                  }
                  <div class="quiz-actions">
                    ${
                      completed
                        ? /*html*/ `
                          <button class="ghost-btn" type="button" data-cid="quiz" data-message="restartQuiz">Refazer imersao</button>
                          <a class="gold-btn" href="#imovel#${encodeURIComponent(suggestion.id)}" data-route="imovel" data-property-id="${suggestion.id}">Abrir sugestao</a>
                        `
                        : /*html*/ `
                          <button class="gold-btn" type="button" data-cid="quiz" data-message="nextStep" ${answers[activeStep.id] ? "" : "disabled"}>
                            ${stepIndex === steps.length - 1 ? "Gerar conversa" : "Continuar"}
                          </button>
                        `
                    }
                  </div>
                </article>
                <aside class="quiz-side-card lead-side-card">
                  <span class="eyebrow">Contexto do lead</span>
                  <h3>Assistente acompanha cada escolha</h3>
                  ${renderSummary()}
                  <div class="lead-side-note">
                    <strong>${completed ? "Proxima acao" : "Durante a imersao"}</strong>
                    <p>${completed ? "Captar contato, abrir chat e entregar o contexto para atendimento humano." : "Cada resposta muda a recomendacao e prepara uma conversa mais objetiva."}</p>
                  </div>
                  <div class="quiz-mini-steps">${steps.map((step, index) => /*html*/ `<span class="${index <= stepIndex ? "active" : ""}">${index + 1}</span>`).join("")}</div>
                </aside>
              </div>
            </div>
          </section>
        `,
      };
    },
  };
};
