const QuizComponent = ({ props }) => {
  const steps = [
    {
      id: "goal",
      question: "Qual e a finalidade?",
      options: [
        ["comprar", "Comprar"],
        ["alugar", "Alugar"],
        ["investir", "Investir"],
      ],
    },
    {
      id: "profile",
      question: "Qual tipologia te atende melhor?",
      options: [
        ["casa", "Casa"],
        ["apartamento", "Apartamento"],
        ["terreno", "Terreno"],
      ],
    },
    {
      id: "budget",
      question: "Qual faixa de investimento?",
      options: [
        ["ate-700", "Ate R$ 700 mil"],
        ["ate-1200", "Ate R$ 1,2 mi"],
        ["acima-1200", "Acima de R$ 1,2 mi"],
      ],
    },
  ];
  let stepIndex = 0;
  let answers = {};

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
      }
      if (message.type === "submitQuiz") {
        const suggestion = pickSuggestion();
        props.addLead({
          name: "Lead do quiz",
          source: "Quiz",
          interest: suggestion.title,
          stage: "qualificando",
        });
        stepIndex = steps.length;
      }

      const completed = stepIndex >= steps.length;
      const suggestion = pickSuggestion();
      const progress = `${Math.min(stepIndex + 1, steps.length)}/${steps.length}`;

      return {
        done: false,
        value: /*html*/ `
            <section id="quiz" class="section dashboard-lite-section">
              <div class="container">
                <div class="quiz-layout">
                  <article class="quiz-card">
                    <div class="quiz-head">
                      <button class="quiz-back" type="button" ${stepIndex === 0 ? "disabled" : `data-cid="quiz" data-message="prevStep"`}>←</button>
                      <div class="breadcrumb-row"><span>Home</span><span>Quiz</span></div>
                      <span class="quiz-progress">${completed ? "Concluido" : progress}</span>
                    </div>
                    <span class="eyebrow">Quiz - Ache seu imovel</span>
                    <h2>${completed ? "Sugestao pronta" : currentStep.question}</h2>
                    <p>${completed ? "Com base nas respostas, encontramos uma oportunidade que combina com o perfil informado." : "Responda algumas perguntas e encontramos o imovel ideal para voce."}</p>
                    ${
                      completed
                        ? `
                      <article class="quiz-result-card">
                        <img src="${suggestion.image}" alt="${suggestion.title}" loading="lazy">
                        <div>
                          <span class="property-type">${suggestion.type}</span>
                          <h3>${suggestion.title}</h3>
                          <div class="location">${suggestion.city}</div>
                          <div class="meta">${suggestion.meta.map((item) => /*html*/ `<span>${item}</span>`).join("")}</div>
                          <strong class="price">${suggestion.price}</strong>
                        </div>
                      </article>
                    `
                        : `
                      <div class="quiz-options">
                        ${currentStep.options
                          .map(
                            ([value, label]) => /*html*/ `
                          <button class="quiz-option ${answers[currentStep.id] === value ? "active" : ""}" type="button" data-cid="quiz" data-message="selectOption" data-value="${value}">
                            <span class="quiz-option-mark"></span>
                            <span>${label}</span>
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
                          ? `<a class="ghost-btn" href="#comprar" data-route="comprar">Ver catalogo completo</a><a class="gold-btn" href="#imovel#${encodeURIComponent(suggestion.id)}" data-route="imovel" data-property-id="${suggestion.id}">Abrir sugestao</a>`
                          : `<button class="gold-btn" type="button" data-cid="quiz" data-message="${stepIndex === steps.length - 1 ? "submitQuiz" : "nextStep"}" ${answers[currentStep.id] ? "" : "disabled"}>${stepIndex === steps.length - 1 ? "Concluir" : "Proxima"}</button>`
                      }
                    </div>
                  </article>
                  <aside class="quiz-side-card">
                    <span class="eyebrow"></span>
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
