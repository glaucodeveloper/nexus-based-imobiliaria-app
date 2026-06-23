const FinancingComponent = ({ props }) => {
  let simulatorValues = {
    propertyValue: 850000,
    downPayment: 170000,
    termMonths: 360,
    annualRate: 9.5,
  };
  let leadStatus = "";

  const formatCurrency = (value) => {
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  };

  const parseCurrencyInput = (raw) => {
    const cleaned = String(raw || "").replace(/[^\d.,]/g, "").replace(/\./g, "").replace(",", ".");
    const num = parseFloat(cleaned);
    return Number.isNaN(num) ? 0 : num;
  };

  const formatCurrencyInput = (value) => {
    return value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const calcMonthlyPayment = () => {
    const principal = simulatorValues.propertyValue - simulatorValues.downPayment;
    if (principal <= 0) return 0;
    const monthlyRate = simulatorValues.annualRate / 100 / 12;
    if (monthlyRate === 0) return principal / simulatorValues.termMonths;
    const n = simulatorValues.termMonths;
    return principal * (monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1);
  };

  const calcTotalPayment = () => {
    return calcMonthlyPayment() * simulatorValues.termMonths + simulatorValues.downPayment;
  };

  const calcTotalInterest = () => {
    return calcMonthlyPayment() * simulatorValues.termMonths - (simulatorValues.propertyValue - simulatorValues.downPayment);
  };

  const applyStep = (name, dir) => {
    const steps = { propertyValue: 50000, downPayment: 10000, termMonths: 12, annualRate: 0.5 };
    const mins = { propertyValue: 100000, downPayment: 0, termMonths: 12, annualRate: 0.5 };
    const maxs = { propertyValue: 10000000, downPayment: simulatorValues.propertyValue, termMonths: 420, annualRate: 18 };
    const step = steps[name] || 1;
    const min = mins[name] || 0;
    const max = maxs[name] || 999999;
    if (dir === "up") simulatorValues[name] = Math.min(simulatorValues[name] + step, max);
    if (dir === "down") simulatorValues[name] = Math.max(simulatorValues[name] - step, min);
    if (simulatorValues.downPayment > simulatorValues.propertyValue) simulatorValues.downPayment = simulatorValues.propertyValue;
  };

  const renderStepper = (name, value, min, max, step, suffix, prefix, editable) => {
    const displayValue = prefix ? `${prefix} ${formatCurrency(value)}` : `${value} ${suffix || ""}`;
    if (editable === "currency") {
      return /*html*/`
        <div class="financing-stepper">
          <button class="financing-step-btn" type="button" data-cid="financing" data-message="stepValue" data-name="${name}" data-direction="down" ${value <= min ? "disabled" : ""}>−</button>
          <input class="financing-step-input" type="text" inputmode="decimal" data-cid="financing" data-message="editValue" data-name="${name}" value="${formatCurrencyInput(value)}" autocomplete="off">
          <button class="financing-step-btn" type="button" data-cid="financing" data-message="stepValue" data-name="${name}" data-direction="up" ${value >= max ? "disabled" : ""}>+</button>
        </div>
      `;
    }
    if (editable === "number") {
      return /*html*/`
        <div class="financing-stepper">
          <button class="financing-step-btn" type="button" data-cid="financing" data-message="stepValue" data-name="${name}" data-direction="down" ${value <= min ? "disabled" : ""}>−</button>
          <input class="financing-step-input" type="text" inputmode="decimal" data-cid="financing" data-message="editValue" data-name="${name}" value="${suffix === "% a.a." ? value.toFixed(1) : value}" autocomplete="off">
          <button class="financing-step-btn" type="button" data-cid="financing" data-message="stepValue" data-name="${name}" data-direction="up" ${value >= max ? "disabled" : ""}>+</button>
        </div>
      `;
    }
    return /*html*/`
      <div class="financing-stepper">
        <button class="financing-step-btn" type="button" data-cid="financing" data-message="stepValue" data-name="${name}" data-direction="down" ${value <= min ? "disabled" : ""}>−</button>
        <span class="financing-step-value">${displayValue}</span>
        <button class="financing-step-btn" type="button" data-cid="financing" data-message="stepValue" data-name="${name}" data-direction="up" ${value >= max ? "disabled" : ""}>+</button>
      </div>
    `;
  };

  return {
    next(message = {}) {
      if (message.type === "stepValue") {
        const name = message.name;
        const dir = message.direction;
        if (name && dir) applyStep(name, dir);
      }
      if (message.type === "editValue") {
        const name = message.name;
        if (!name) return { done: false, value: "" };
        if (name === "propertyValue" || name === "downPayment") {
          const parsed = parseCurrencyInput(message.value);
          if (parsed > 0) {
            const clamped = Math.max(name === "propertyValue" ? 100000 : 0, Math.min(parsed, name === "propertyValue" ? 10000000 : simulatorValues.propertyValue));
            simulatorValues[name] = clamped;
            if (simulatorValues.downPayment > simulatorValues.propertyValue) simulatorValues.downPayment = simulatorValues.propertyValue;
          }
        } else if (name === "termMonths") {
          const parsed = parseInt(message.value, 10);
          if (!Number.isNaN(parsed) && parsed >= 12) simulatorValues.termMonths = Math.min(parsed, 420);
        } else if (name === "annualRate") {
          const parsed = parseFloat(message.value);
          if (!Number.isNaN(parsed) && parsed >= 0) simulatorValues.annualRate = Math.min(parsed, 18);
        }
      }
      if (message.type === "submitFinancingLead") {
        props.addLead({
          name: message.fields.name || "Lead financiamento",
          source: "Financiamento",
          interest: `Im\u00f3vel de ${formatCurrency(simulatorValues.propertyValue)}`,
          stage: "novo",
        });
        leadStatus = "Solicita\u00e7\u00e3o enviada. Um especialista entrar\u00e1 em contato.";
      }

      const monthly = calcMonthlyPayment();
      const total = calcTotalPayment();
      const interest = calcTotalInterest();
      const financed = simulatorValues.propertyValue - simulatorValues.downPayment;
      const downPct = simulatorValues.propertyValue > 0 ? Math.round(simulatorValues.downPayment / simulatorValues.propertyValue * 100) : 0;
      const interestPct = total > 0 ? Math.round(interest / (total - simulatorValues.downPayment) * 100) : 0;
      const termYears = Math.floor(simulatorValues.termMonths / 12);
      const termRemainder = simulatorValues.termMonths % 12;
      const termDisplay = termYears > 0 ? `${termYears} ano${termYears > 1 ? "s" : ""}${termRemainder > 0 ? ` e ${termRemainder} mese${termRemainder > 1 ? "s" : ""}` : ""}` : `${simulatorValues.termMonths} meses`;

      return {
        done: false,
        value: /*html*/`
          <section class="section financing-section">
            <div class="container">
              <div class="breadcrumb-row"><span>In\u00edcio</span><span>Financiamento</span></div>

              <div class="financing-hero">
                <div class="financing-hero-text">
                  <span class="eyebrow">Financiamento</span>
                  <h2>Simule seu financiamento</h2>
                  <p>Entenda as condi\u00e7\u00f5es, compare cen\u00e1rios e decida com seguran\u00e7a. Nosso time acompanha todo o processo junto ao banco.</p>
                </div>
                <div class="financing-hero-visual">
                  <div class="financing-hero-cards">
                    <article class="financing-benefit-card">
                      <span class="financing-benefit-icon">\u2726</span>
                      <strong>Simula\u00e7\u00e3o r\u00e1pida</strong>
                      <p><span>Ajuste os valores e veja a parcela instantaneamente.</span></p>
                    </article>
                    <article class="financing-benefit-card">
                      <span class="financing-benefit-icon">\u25c6</span>
                      <strong>Assessoria banc\u00e1ria</strong>
                      <p><span>Acompanhamento do processo junto ao banco escolhido.</span></p>
                    </article>
                    <article class="financing-benefit-card">
                      <span class="financing-benefit-icon">\u2756</span>
                      <strong>Documenta\u00e7\u00e3o guiada</strong>
                      <p><span>Checklist completo e suporte na montagem do dossi\u00ea.</span></p>
                    </article>
                  </div>
                </div>
              </div>

              <div class="financing-simulator">
                <div class="financing-simulator-controls">
                  <h3>Configurar simula\u00e7\u00e3o</h3>
                  <div class="financing-control-grid">
                    <div class="financing-control">
                      <label class="financing-control-label">Valor do im\u00f3vel</label>
                      ${renderStepper("propertyValue", simulatorValues.propertyValue, 100000, 10000000, 50000, "", "R$", "currency")}
                    </div>
                    <div class="financing-control">
                      <label class="financing-control-label">Entrada</label>
                      ${renderStepper("downPayment", simulatorValues.downPayment, 0, simulatorValues.propertyValue, 10000, "", "R$", "currency")}
                      <span class="financing-control-hint">${downPct}% do valor</span>
                    </div>
                    <div class="financing-control">
                      <label class="financing-control-label">Prazo</label>
                      ${renderStepper("termMonths", simulatorValues.termMonths, 12, 420, 12, "meses", "", "number")}
                      <span class="financing-control-hint">${termDisplay}</span>
                    </div>
                    <div class="financing-control">
                      <label class="financing-control-label">Taxa anual</label>
                      ${renderStepper("annualRate", simulatorValues.annualRate, 0.5, 18, 0.5, "% a.a.", "", "number")}
                    </div>
                  </div>
                </div>
                <div class="financing-simulator-results">
                  <h3>Resultado</h3>
                  <div class="financing-result-main">
                    <span class="financing-result-label">Parcela mensal estimada</span>
                    <strong class="financing-result-value">${formatCurrency(monthly)}</strong>
                    <span class="financing-result-sub">em ${termDisplay}</span>
                  </div>
                  <div class="financing-result-grid">
                    <div class="financing-result-stat">
                      <span>Valor financiado</span>
                      <strong>${formatCurrency(financed)}</strong>
                    </div>
                    <div class="financing-result-stat">
                      <span>Total pago</span>
                      <strong>${formatCurrency(total)}</strong>
                    </div>
                    <div class="financing-result-stat">
                      <span>Juros totais</span>
                      <strong>${formatCurrency(interest > 0 ? interest : 0)}</strong>
                      <span class="financing-result-detail">${interestPct}% do financiado</span>
                    </div>
                    <div class="financing-result-stat">
                      <span>Entrada</span>
                      <strong>${downPct}%</strong>
                      <span class="financing-result-detail">${formatCurrency(simulatorValues.downPayment)}</span>
                    </div>
                  </div>
                  <div class="financing-bar-track">
                    <div class="financing-bar-fill" style="width: ${downPct}%;"></div>
                  </div>
                  <div class="financing-bar-labels">
                    <span>Entrada ${formatCurrency(simulatorValues.downPayment)}</span>
                    <span>Financiado ${formatCurrency(financed)}</span>
                  </div>
                </div>
              </div>

              <div class="financing-info-section">
                <div class="financing-info-grid">
                  <article class="financing-info-card">
                    <h3>Como funciona</h3>
                    <ul class="detail-bullet-list">
                      <li>Escolha o im\u00f3vel e simule as condi\u00e7\u00f5es</li>
                      <li>Envie sua proposta e documentos para an\u00e1lise</li>
                      <li>O banco avalia risco e aprova o cr\u00e9dito</li>
                      <li>Assine o contrato e receba as chaves</li>
                    </ul>
                  </article>
                  <article class="financing-info-card">
                    <h3>Documentos necess\u00e1rios</h3>
                    <ul class="detail-bullet-list">
                      <li>RG, CPF e comprovante de estado civil</li>
                      <li>Comprovante de renda (holerite, IR ou decore)</li>
                      <li>Comprovante de resid\u00eancia</li>
                      <li>Extrato banc\u00e1rio dos \u00faltimos 3 meses</li>
                      <li>Certid\u00f5es negativas municipais, estaduais e federais</li>
                    </ul>
                  </article>
                  <article class="financing-info-card financing-info-card--highlight">
                    <h3>Fale com um especialista</h3>
                    <p>Preencha o formul\u00e1rio e nossa equipe de financiamento entra em contato para orientar seu processo do in\u00edcio ao fim.</p>
                    <form class="financing-lead-form" data-cid="financing" data-message="submitFinancingLead">
                      <div class="mini-field"><label>Nome</label><input name="name" required placeholder="Seu nome"></div>
                      <div class="mini-field"><label>Telefone</label><input name="phone" required placeholder="(71) 99999-0000"></div>
                      <div class="mini-field"><label>Renda mensal</label><input name="income" placeholder="R$"></div>
                      <button class="gold-btn" type="submit">Solicitar contato</button>
                      ${leadStatus ? `<p class="route_note">${leadStatus}</p>` : ""}
                    </form>
                  </article>
                </div>
              </div>
            </div>
          </section>
        `,
      };
    },
  };
};
