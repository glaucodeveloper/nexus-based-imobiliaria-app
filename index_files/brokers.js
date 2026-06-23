  const BrokersComponent = () => ({
    next: () => ({
      done: false,
      value: /*html*/`<section class="section brokers"><div class="container"><div class="section-title" style="justify-content:center;text-align:center;"><div><span class="eyebrow">Corretores</span><h2>Conte com nossos corretores</h2><p>Foto, CRECI, telefone e atendimento direto.</p></div></div><div class="broker-grid">${brokers.map((broker) => /*html*/`<article class="broker-tile"><img src="${broker.photo}" alt="${broker.name}" loading="lazy"><strong>${broker.name}</strong><div class="location">${broker.creci}</div><div class="location">${broker.phone}</div></article>`).join("")}</div></div></section>`,
    }),
  });
