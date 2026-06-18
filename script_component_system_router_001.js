(() => {
  "use strict";

  const STYLE_ID = "suaimobiliaria-component-system-style";
  const ROUTES = ["home", "destaques", "comprar", "imovel", "anuncie", "login", "dashboard", "contato"];

  const properties = [
    {
      id: "alphaville",
      title: "Casa em Condomínio Alphaville",
      type: "Casa à venda",
      kind: "Casa",
      city: "Alphaville, Camaçari/BA",
      cityName: "Camaçari",
      neighborhood: "Alphaville",
      price: "R$ 1.850.000",
      priceNumber: 1850000,
      bedrooms: 4,
      area: 320,
      meta: ["4 quartos", "5 banheiros", "4 vagas", "320m²"],
      tag: "Destaque",
      image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=82",
    },
    {
      id: "jardim-armacao",
      title: "Apartamento no Jardim Armação",
      type: "Apartamento à venda",
      kind: "Apartamento",
      city: "Jardim Armação, Salvador/BA",
      cityName: "Salvador",
      neighborhood: "Jardim Armação",
      price: "R$ 650.000",
      priceNumber: 650000,
      bedrooms: 3,
      area: 98,
      meta: ["3 quartos", "2 banheiros", "2 vagas", "98m²"],
      tag: "Com vista",
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=900&q=82",
    },
    {
      id: "vilarejo",
      title: "Casa no Vilarejo",
      type: "Casa à venda",
      kind: "Casa",
      city: "Vilarejo, Lauro de Freitas/BA",
      cityName: "Lauro de Freitas",
      neighborhood: "Vilarejo",
      price: "R$ 790.000",
      priceNumber: 790000,
      bedrooms: 3,
      area: 180,
      meta: ["3 quartos", "3 banheiros", "2 vagas", "180m²"],
      tag: "Novo",
      image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=82",
    },
    {
      id: "busca-vida",
      title: "Terreno em Busca Vida",
      type: "Terreno à venda",
      kind: "Terreno",
      city: "Busca Vida, Camaçari/BA",
      cityName: "Camaçari",
      neighborhood: "Busca Vida",
      price: "R$ 470.000",
      priceNumber: 470000,
      bedrooms: 0,
      area: 450,
      meta: ["450m²", "lote plano", "condomínio"],
      tag: "Oportunidade",
      image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=900&q=82",
    },
    {
      id: "cobertura-barra",
      title: "Cobertura Vista Mar na Barra",
      type: "Cobertura à venda",
      kind: "Cobertura",
      city: "Barra, Salvador/BA",
      cityName: "Salvador",
      neighborhood: "Barra",
      price: "R$ 1.250.000",
      priceNumber: 1250000,
      bedrooms: 4,
      area: 210,
      meta: ["4 quartos", "4 banheiros", "3 vagas", "210m²"],
      tag: "Vista mar",
      image: "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=900&q=82",
    },
    {
      id: "studio-caminho",
      title: "Studio no Caminho das Árvores",
      type: "Apartamento à venda",
      kind: "Apartamento",
      city: "Caminho das Árvores, Salvador/BA",
      cityName: "Salvador",
      neighborhood: "Caminho das Árvores",
      price: "R$ 420.000",
      priceNumber: 420000,
      bedrooms: 1,
      area: 48,
      meta: ["1 quarto", "1 banheiro", "1 vaga", "48m²"],
      tag: "Compacto",
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=900&q=82",
    },
    {
      id: "casa-ipitanga",
      title: "Casa Familiar em Ipitanga",
      type: "Casa à venda",
      kind: "Casa",
      city: "Ipitanga, Lauro de Freitas/BA",
      cityName: "Lauro de Freitas",
      neighborhood: "Ipitanga",
      price: "R$ 690.000",
      priceNumber: 690000,
      bedrooms: 3,
      area: 160,
      meta: ["3 quartos", "2 banheiros", "2 vagas", "160m²"],
      tag: "Família",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=82",
    },
    {
      id: "sala-comercial-pituba",
      title: "Sala Comercial na Pituba",
      type: "Sala comercial à venda",
      kind: "Sala comercial",
      city: "Pituba, Salvador/BA",
      cityName: "Salvador",
      neighborhood: "Pituba",
      price: "R$ 350.000",
      priceNumber: 350000,
      bedrooms: 0,
      area: 62,
      meta: ["62m²", "1 banheiro", "1 vaga", "empresarial"],
      tag: "Comercial",
      image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=900&q=82",
    },
    {
      id: "terreno-jaua",
      title: "Terreno em Jauá",
      type: "Terreno à venda",
      kind: "Terreno",
      city: "Jauá, Camaçari/BA",
      cityName: "Camaçari",
      neighborhood: "Jauá",
      price: "R$ 290.000",
      priceNumber: 290000,
      bedrooms: 0,
      area: 600,
      meta: ["600m²", "lote plano", "perto da praia"],
      tag: "Praia",
      image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=82",
    },
  ];

  const brokers = [
    ["João Almeida", "(71) 99999-0001", "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=240&q=80"],
    ["Mariana Santos", "(71) 99999-0002", "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=240&q=80"],
    ["Carlos Mendes", "(71) 99999-0003", "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&q=80"],
    ["Juliana Oliveira", "(71) 99999-0004", "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&q=80"],
  ];

  function injectStyle() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `:root {\n        --ink: #111815;\n        --coal: #0d1718;\n        --muted: #66716c;\n        --line: #e9ece8;\n        --paper: #ffffff;\n        --wash: #f7f6f1;\n        --cream: #fbf8ef;\n        --gold: #c9902d;\n        --gold-dark: #a87219;\n        --green: #25d366;\n        --shadow: 0 24px 60px rgba(17, 24, 21, 0.1);\n        --soft-shadow: 0 12px 36px rgba(17, 24, 21, 0.08);\n        --radius-xl: 28px;\n        --radius-lg: 18px;\n        --radius-md: 12px;\n        --font-display: Georgia, \"Times New Roman\", serif;\n        --font-body: \"Trebuchet MS\", \"Segoe UI\", sans-serif;\n      }\n\n      * {\n        box-sizing: border-box;\n      }\n\n      html {\n        scroll-behavior: smooth;\n      }\n\n      body {\n        margin: 0;\n        color: var(--ink);\n        background:\n          radial-gradient(circle at 12% 8%, rgba(201, 144, 45, 0.13), transparent 26rem),\n          linear-gradient(180deg, #fff 0%, var(--wash) 55%, #fff 100%);\n        font-family: var(--font-body);\n      }\n\n      button,\n      input,\n      select {\n        font: inherit;\n      }\n\n      button,\n      a {\n        -webkit-tap-highlight-color: transparent;\n      }\n\n      a {\n        color: inherit;\n        text-decoration: none;\n      }\n\n      img {\n        display: block;\n        max-width: 100%;\n      }\n\n      .app-shell {\n        overflow: hidden;\n      }\n\n      .container {\n        width: min(1180px, calc(100% - 40px));\n        margin: 0 auto;\n      }\n\n      .section {\n        padding: 78px 0;\n      }\n\n      .topbar {\n        position: fixed;\n        z-index: 20;\n        inset: 18px 0 auto;\n        width: min(1180px, calc(100% - 32px));\n        margin: 0 auto;\n        display: flex;\n        align-items: center;\n        justify-content: space-between;\n        gap: 24px;\n        padding: 14px 18px;\n        border: 1px solid rgba(255, 255, 255, 0.2);\n        border-radius: 999px;\n        color: #fff;\n        background: rgba(8, 17, 20, 0.7);\n        backdrop-filter: blur(18px);\n        box-shadow: 0 18px 44px rgba(0, 0, 0, 0.18);\n      }\n\n      .brand {\n        display: flex;\n        align-items: center;\n        gap: 10px;\n        font-weight: 800;\n        letter-spacing: -0.03em;\n      }\n\n      .brand-mark {\n        position: relative;\n        width: 32px;\n        height: 24px;\n      }\n\n      .brand-mark::before,\n      .brand-mark::after {\n        position: absolute;\n        content: \"\";\n        inset: auto 0 0;\n        height: 17px;\n        border: 4px solid var(--gold);\n        border-top: 0;\n        border-radius: 2px 2px 6px 6px;\n      }\n\n      .brand-mark::after {\n        inset: 1px 5px auto;\n        width: 18px;\n        height: 18px;\n        border: 4px solid var(--gold);\n        border-right: 0;\n        border-bottom: 0;\n        transform: rotate(45deg);\n        border-radius: 2px;\n      }\n\n      .nav {\n        display: flex;\n        align-items: center;\n        gap: 26px;\n        font-size: 14px;\n        font-weight: 700;\n      }\n\n      .nav a {\n        color: rgba(255, 255, 255, 0.82);\n      }\n\n      .nav a:hover {\n        color: #fff;\n      }\n\n      .pill-btn,\n      .gold-btn,\n      .ghost-btn {\n        border: 0;\n        cursor: pointer;\n        border-radius: 999px;\n        font-weight: 800;\n        transition: transform 180ms ease, box-shadow 180ms ease, background 180ms ease;\n      }\n\n      .pill-btn {\n        display: inline-flex;\n        align-items: center;\n        gap: 8px;\n        padding: 12px 18px;\n        color: var(--ink);\n        background: #fff;\n      }\n\n      .gold-btn {\n        color: #fff;\n        padding: 14px 22px;\n        background: linear-gradient(135deg, #dca642, var(--gold-dark));\n        box-shadow: 0 12px 22px rgba(201, 144, 45, 0.28);\n      }\n\n      .ghost-btn {\n        padding: 13px 20px;\n        border: 1px solid var(--line);\n        background: #fff;\n      }\n\n      .pill-btn:hover,\n      .gold-btn:hover,\n      .ghost-btn:hover {\n        transform: translateY(-2px);\n      }\n\n      .hero {\n        position: relative;\n        min-height: 770px;\n        color: #fff;\n        background:\n          linear-gradient(90deg, rgba(6, 13, 16, 0.95) 0%, rgba(6, 13, 16, 0.7) 42%, rgba(6, 13, 16, 0.18) 100%),\n          url(\"https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1800&q=85\") center/cover;\n      }\n\n      .hero::after {\n        position: absolute;\n        content: \"\";\n        inset: auto 0 0;\n        height: 180px;\n        background: linear-gradient(180deg, transparent, rgba(247, 246, 241, 0.96));\n      }\n\n      .hero-content {\n        position: relative;\n        z-index: 1;\n        padding: 188px 0 88px;\n        width: min(700px, 100%);\n      }\n\n      .eyebrow {\n        display: inline-flex;\n        align-items: center;\n        gap: 9px;\n        margin-bottom: 20px;\n        color: #f5d597;\n        font-size: 13px;\n        font-weight: 900;\n        letter-spacing: 0.12em;\n        text-transform: uppercase;\n      }\n\n      .eyebrow::before {\n        content: \"\";\n        width: 34px;\n        height: 1px;\n        background: currentColor;\n      }\n\n      .hero h1,\n      .section-title h2,\n      .detail-copy h2,\n      .dashboard-head h2 {\n        margin: 0;\n        font-family: var(--font-display);\n        letter-spacing: -0.055em;\n      }\n\n      .hero h1 {\n        font-size: clamp(3.5rem, 8vw, 6.9rem);\n        line-height: 0.91;\n        max-width: 720px;\n      }\n\n      .hero p {\n        max-width: 520px;\n        margin: 26px 0 34px;\n        color: rgba(255, 255, 255, 0.82);\n        font-size: 1.08rem;\n        line-height: 1.8;\n      }\n\n      .search-panel {\n        width: min(930px, 100%);\n        padding: 18px;\n        border: 1px solid rgba(255, 255, 255, 0.2);\n        border-radius: var(--radius-lg);\n        background: rgba(255, 255, 255, 0.94);\n        box-shadow: var(--shadow);\n      }\n\n      .tabs {\n        display: flex;\n        gap: 8px;\n        margin-bottom: 14px;\n      }\n\n      .tab {\n        padding: 11px 24px;\n        border: 0;\n        border-radius: 999px;\n        color: var(--ink);\n        background: #eef0ed;\n        cursor: pointer;\n        font-weight: 800;\n      }\n\n      .tab.active {\n        color: #fff;\n        background: var(--coal);\n      }\n\n      .search-grid {\n        display: grid;\n        grid-template-columns: 1.7fr 1fr 1fr auto;\n        gap: 10px;\n      }\n\n      .field {\n        display: grid;\n        gap: 7px;\n        padding: 10px 13px;\n        border: 1px solid var(--line);\n        border-radius: 12px;\n        color: var(--muted);\n        background: #fff;\n        font-size: 12px;\n      }\n\n      .field strong {\n        color: var(--ink);\n        font-size: 13px;\n      }\n\n      .field input,\n      .field select {\n        width: 100%;\n        border: 0;\n        outline: 0;\n        color: var(--ink);\n        background: transparent;\n      }\n\n      .stats-strip {\n        position: relative;\n        z-index: 2;\n        transform: translateY(-48px);\n      }\n\n      .stats-grid {\n        display: grid;\n        grid-template-columns: repeat(4, 1fr);\n        gap: 16px;\n        padding: 18px;\n        border-radius: var(--radius-xl);\n        background: rgba(255, 255, 255, 0.96);\n        box-shadow: var(--soft-shadow);\n      }\n\n      .stat-card {\n        display: flex;\n        align-items: center;\n        gap: 14px;\n        padding: 18px;\n      }\n\n      .icon-box {\n        display: grid;\n        place-items: center;\n        flex: 0 0 48px;\n        width: 48px;\n        height: 48px;\n        border-radius: 16px;\n        color: var(--gold);\n        background: #fff3dc;\n        font-size: 22px;\n      }\n\n      .stat-card strong {\n        display: block;\n        font-size: 15px;\n      }\n\n      .stat-card span {\n        color: var(--muted);\n        font-size: 13px;\n      }\n\n      .section-title {\n        display: flex;\n        align-items: end;\n        justify-content: space-between;\n        gap: 24px;\n        margin-bottom: 28px;\n      }\n\n      .section-title h2,\n      .detail-copy h2,\n      .dashboard-head h2 {\n        font-size: clamp(2rem, 4vw, 3.8rem);\n      }\n\n      .section-title p {\n        max-width: 570px;\n        margin: 10px 0 0;\n        color: var(--muted);\n        line-height: 1.7;\n      }\n\n      .property-grid {\n        display: grid;\n        grid-template-columns: repeat(4, 1fr);\n        gap: 20px;\n      }\n\n      .property-card,\n      .filter-box,\n      .list-card,\n      .detail-panel,\n      .broker-card,\n      .dashboard-card,\n      .phone-card {\n        border: 1px solid var(--line);\n        border-radius: var(--radius-lg);\n        background: #fff;\n        box-shadow: var(--soft-shadow);\n      }\n\n      .property-card {\n        overflow: hidden;\n      }\n\n      .card-media {\n        position: relative;\n        height: 205px;\n        overflow: hidden;\n        background: #d8d8d0;\n      }\n\n      .card-media img {\n        width: 100%;\n        height: 100%;\n        object-fit: cover;\n        transition: transform 500ms ease;\n      }\n\n      .property-card:hover .card-media img,\n      .list-card:hover img {\n        transform: scale(1.05);\n      }\n\n      .badge {\n        display: inline-flex;\n        align-items: center;\n        padding: 7px 10px;\n        border-radius: 999px;\n        color: #fff;\n        background: rgba(14, 23, 24, 0.84);\n        font-size: 12px;\n        font-weight: 900;\n      }\n\n      .card-media .badge {\n        position: absolute;\n        top: 12px;\n        left: 12px;\n      }\n\n      .heart {\n        display: grid;\n        place-items: center;\n        width: 38px;\n        height: 38px;\n        border: 0;\n        border-radius: 50%;\n        color: #c42a2a;\n        background: rgba(255, 255, 255, 0.92);\n        cursor: pointer;\n      }\n\n      .card-media .heart {\n        position: absolute;\n        top: 12px;\n        right: 12px;\n      }\n\n      .property-body {\n        padding: 17px;\n      }\n\n      .property-type {\n        color: var(--muted);\n        font-size: 12px;\n        font-weight: 800;\n      }\n\n      .property-body h3,\n      .list-info h3 {\n        margin: 7px 0 6px;\n        letter-spacing: -0.03em;\n      }\n\n      .location,\n      .meta {\n        color: var(--muted);\n        font-size: 13px;\n      }\n\n      .meta {\n        display: flex;\n        flex-wrap: wrap;\n        gap: 12px;\n        margin: 14px 0;\n      }\n\n      .price {\n        font-size: 18px;\n        font-weight: 900;\n        letter-spacing: -0.02em;\n      }\n\n      .ad-banner {\n        display: grid;\n        grid-template-columns: 0.95fr 1.65fr;\n        min-height: 260px;\n        overflow: hidden;\n        margin-top: 62px;\n        border-radius: var(--radius-xl);\n        background: var(--coal);\n        box-shadow: var(--shadow);\n      }\n\n      .ad-copy {\n        padding: 42px;\n        color: #fff;\n      }\n\n      .ad-copy h3 {\n        margin: 0 0 14px;\n        font-family: var(--font-display);\n        font-size: 2.2rem;\n        line-height: 1;\n      }\n\n      .ad-copy p {\n        color: rgba(255, 255, 255, 0.72);\n        line-height: 1.7;\n      }\n\n      .ad-banner img {\n        width: 100%;\n        height: 100%;\n        object-fit: cover;\n      }\n\n      .listing-section {\n        background: linear-gradient(180deg, #fff 0%, var(--cream) 100%);\n      }\n\n      .listing-layout {\n        display: grid;\n        grid-template-columns: 265px 1fr;\n        gap: 24px;\n        align-items: start;\n      }\n\n      .filter-box {\n        position: sticky;\n        top: 108px;\n        padding: 20px;\n      }\n\n      .filter-head {\n        display: flex;\n        align-items: center;\n        justify-content: space-between;\n        margin-bottom: 20px;\n      }\n\n      .filter-head strong {\n        font-size: 18px;\n      }\n\n      .filter-head button {\n        border: 0;\n        color: var(--gold-dark);\n        background: transparent;\n        font-weight: 900;\n        cursor: pointer;\n      }\n\n      .check-list,\n      .filter-stack {\n        display: grid;\n        gap: 13px;\n      }\n\n      .check-list label {\n        display: flex;\n        align-items: center;\n        gap: 9px;\n        color: #34403a;\n        font-size: 14px;\n      }\n\n      .mini-field {\n        display: grid;\n        gap: 8px;\n      }\n\n      .mini-field label {\n        color: var(--muted);\n        font-size: 12px;\n        font-weight: 900;\n      }\n\n      .mini-field select,\n      .mini-field input {\n        width: 100%;\n        padding: 12px;\n        border: 1px solid var(--line);\n        border-radius: 11px;\n        outline: 0;\n        background: #fff;\n      }\n\n      .list-toolbar {\n        display: flex;\n        align-items: center;\n        justify-content: space-between;\n        gap: 20px;\n        margin-bottom: 18px;\n      }\n\n      .view-toggle {\n        display: flex;\n        gap: 8px;\n      }\n\n      .square-btn {\n        display: grid;\n        place-items: center;\n        width: 43px;\n        height: 43px;\n        border: 1px solid var(--line);\n        border-radius: 12px;\n        background: #fff;\n      }\n\n      .square-btn.active {\n        color: #fff;\n        background: var(--coal);\n      }\n\n      .list-stack {\n        display: grid;\n        gap: 16px;\n      }\n\n      .list-card {\n        display: grid;\n        grid-template-columns: 250px 1fr auto;\n        gap: 18px;\n        padding: 14px;\n        overflow: hidden;\n      }\n\n      .list-card img {\n        width: 250px;\n        height: 165px;\n        object-fit: cover;\n        border-radius: 14px;\n        transition: transform 500ms ease;\n      }\n\n      .list-info {\n        align-self: center;\n      }\n\n      .list-price {\n        display: grid;\n        align-content: space-between;\n        justify-items: end;\n        padding: 6px 2px;\n      }\n\n      .pager {\n        display: flex;\n        justify-content: center;\n        gap: 8px;\n        margin-top: 26px;\n      }\n\n      .pager button {\n        width: 38px;\n        height: 38px;\n        border: 1px solid var(--line);\n        border-radius: 11px;\n        background: #fff;\n      }\n\n      .pager button.active {\n        color: #fff;\n        background: var(--coal);\n      }\n\n      .detail-section {\n        background: #fff;\n      }\n\n      .detail-layout {\n        display: grid;\n        grid-template-columns: minmax(0, 1.55fr) 390px;\n        gap: 28px;\n      }\n\n      .gallery {\n        display: grid;\n        grid-template-columns: repeat(4, 1fr);\n        gap: 10px;\n      }\n\n      .gallery-main {\n        grid-column: 1 / -1;\n        height: 520px;\n        overflow: hidden;\n        border-radius: var(--radius-xl);\n      }\n\n      .gallery-main img,\n      .gallery-thumb img {\n        width: 100%;\n        height: 100%;\n        object-fit: cover;\n      }\n\n      .gallery-thumb {\n        position: relative;\n        height: 118px;\n        overflow: hidden;\n        border-radius: 15px;\n      }\n\n      .gallery-more {\n        position: absolute;\n        inset: 0;\n        display: grid;\n        place-items: center;\n        color: #fff;\n        background: rgba(10, 17, 18, 0.58);\n        font-weight: 900;\n      }\n\n      .detail-copy {\n        margin-top: 34px;\n      }\n\n      .detail-copy p {\n        color: var(--muted);\n        font-size: 1rem;\n        line-height: 1.8;\n      }\n\n      .feature-list {\n        display: grid;\n        gap: 14px;\n        margin: 24px 0 0;\n        padding: 0;\n        list-style: none;\n      }\n\n      .feature-list li::before {\n        content: \"✓\";\n        margin-right: 10px;\n        color: var(--gold-dark);\n        font-weight: 900;\n      }\n\n      .detail-panel {\n        position: sticky;\n        top: 108px;\n        padding: 26px;\n      }\n\n      .detail-panel .property-type {\n        color: var(--gold-dark);\n      }\n\n      .detail-panel h3 {\n        margin: 10px 0;\n        font-family: var(--font-display);\n        font-size: 2.2rem;\n        line-height: 1.05;\n        letter-spacing: -0.04em;\n      }\n\n      .detail-panel .price {\n        display: block;\n        margin: 24px 0 8px;\n        font-size: 2rem;\n      }\n\n      .financing {\n        display: inline-block;\n        margin-bottom: 22px;\n        padding: 8px 11px;\n        border-radius: 9px;\n        color: #6d5221;\n        background: #fff4d9;\n        font-size: 12px;\n      }\n\n      .action-stack {\n        display: grid;\n        gap: 12px;\n      }\n\n      .whatsapp {\n        color: #0f7a3b;\n        border-color: rgba(37, 211, 102, 0.32);\n      }\n\n      .broker-card {\n        margin-top: 18px;\n        padding: 18px;\n      }\n\n      .broker-person {\n        display: flex;\n        align-items: center;\n        gap: 13px;\n        margin-bottom: 15px;\n      }\n\n      .avatar {\n        width: 56px;\n        height: 56px;\n        border-radius: 50%;\n        object-fit: cover;\n      }\n\n      .dashboard-section {\n        color: #fff;\n        background:\n          linear-gradient(130deg, rgba(9, 19, 20, 0.97), rgba(9, 19, 20, 0.84)),\n          url(\"https://images.unsplash.com/photo-1613545325278-f24b0cae1224?auto=format&fit=crop&w=1600&q=80\") center/cover;\n      }\n\n      .dashboard-grid {\n        display: grid;\n        grid-template-columns: 280px 1fr;\n        gap: 26px;\n        align-items: stretch;\n      }\n\n      .dashboard-nav {\n        padding: 24px;\n        border-radius: var(--radius-xl);\n        background: rgba(255, 255, 255, 0.08);\n        backdrop-filter: blur(18px);\n      }\n\n      .dashboard-nav .brand {\n        margin-bottom: 30px;\n      }\n\n      .dash-menu {\n        display: grid;\n        gap: 8px;\n      }\n\n      .dash-menu span {\n        padding: 13px 14px;\n        border-radius: 13px;\n        color: rgba(255, 255, 255, 0.72);\n        font-weight: 800;\n      }\n\n      .dash-menu span.active {\n        color: #fff;\n        background: rgba(255, 255, 255, 0.14);\n      }\n\n      .dashboard-board {\n        padding: 26px;\n        border-radius: var(--radius-xl);\n        color: var(--ink);\n        background: #f9faf7;\n        box-shadow: var(--shadow);\n      }\n\n      .dashboard-head {\n        display: flex;\n        justify-content: space-between;\n        align-items: center;\n        gap: 16px;\n        margin-bottom: 22px;\n      }\n\n      .metric-grid {\n        display: grid;\n        grid-template-columns: repeat(4, 1fr);\n        gap: 14px;\n        margin-bottom: 18px;\n      }\n\n      .metric {\n        padding: 18px;\n        border: 1px solid var(--line);\n        border-radius: 16px;\n        background: #fff;\n      }\n\n      .metric small {\n        color: var(--muted);\n        font-weight: 900;\n      }\n\n      .metric strong {\n        display: block;\n        margin-top: 8px;\n        font-size: 2rem;\n      }\n\n      .dashboard-columns {\n        display: grid;\n        grid-template-columns: 1.2fr 0.9fr;\n        gap: 16px;\n      }\n\n      .dashboard-card {\n        padding: 18px;\n      }\n\n      .activity,\n      .popular {\n        display: grid;\n        gap: 13px;\n      }\n\n      .activity-row,\n      .popular-row {\n        display: grid;\n        grid-template-columns: auto 1fr auto;\n        gap: 12px;\n        align-items: center;\n        padding: 10px;\n        border-radius: 14px;\n        background: #fbfbf9;\n      }\n\n      .dot {\n        display: grid;\n        place-items: center;\n        width: 34px;\n        height: 34px;\n        border-radius: 12px;\n        color: #fff;\n        background: var(--gold);\n        font-size: 13px;\n        font-weight: 900;\n      }\n\n      .popular-row img {\n        width: 70px;\n        height: 52px;\n        border-radius: 10px;\n        object-fit: cover;\n      }\n\n      .phone-strip {\n        display: grid;\n        grid-template-columns: repeat(3, 1fr);\n        gap: 18px;\n        margin-top: 24px;\n      }\n\n      .phone-card {\n        padding: 22px;\n        color: var(--ink);\n      }\n\n      .phone-card h3 {\n        margin: 0 0 14px;\n      }\n\n      .mini-property {\n        display: grid;\n        grid-template-columns: 86px 1fr auto;\n        gap: 12px;\n        align-items: center;\n        padding: 10px 0;\n        border-bottom: 1px solid var(--line);\n      }\n\n      .mini-property:last-child {\n        border-bottom: 0;\n      }\n\n      .mini-property img {\n        width: 86px;\n        height: 62px;\n        border-radius: 11px;\n        object-fit: cover;\n      }\n\n      .quiz-option {\n        display: flex;\n        align-items: center;\n        gap: 12px;\n        margin-bottom: 12px;\n        padding: 18px;\n        border: 1px solid var(--line);\n        border-radius: 14px;\n        background: #fff;\n      }\n\n      .quiz-option.active {\n        border-color: rgba(201, 144, 45, 0.56);\n        background: #fff8e7;\n      }\n\n      .progress {\n        height: 8px;\n        margin: 28px 0 14px;\n        overflow: hidden;\n        border-radius: 999px;\n        background: #eceae3;\n      }\n\n      .progress span {\n        display: block;\n        width: 18%;\n        height: 100%;\n        background: var(--gold);\n      }\n\n      .brokers {\n        text-align: center;\n      }\n\n      .broker-grid {\n        display: grid;\n        grid-template-columns: repeat(4, 1fr);\n        gap: 22px;\n        margin-top: 28px;\n      }\n\n      .broker-tile {\n        padding: 24px;\n        border: 1px solid var(--line);\n        border-radius: var(--radius-lg);\n        background: #fff;\n      }\n\n      .broker-tile img {\n        width: 88px;\n        height: 88px;\n        margin: 0 auto 14px;\n        border-radius: 50%;\n        object-fit: cover;\n      }\n\n      .site-footer {\n        padding: 56px 0;\n        color: #fff;\n        background: #101a1b;\n      }\n\n      .footer-grid {\n        display: grid;\n        grid-template-columns: 1.4fr repeat(4, 1fr);\n        gap: 36px;\n      }\n\n      .site-footer p,\n      .site-footer a {\n        color: rgba(255, 255, 255, 0.68);\n        line-height: 1.8;\n      }\n\n      .site-footer h4 {\n        margin: 0 0 14px;\n      }\n\n      .footer-links {\n        display: grid;\n        gap: 8px;\n      }\n\n      .float-whats {\n        position: fixed;\n        z-index: 25;\n        right: 24px;\n        bottom: 24px;\n        display: grid;\n        place-items: center;\n        width: 64px;\n        height: 64px;\n        border-radius: 50%;\n        color: #fff;\n        background: var(--green);\n        box-shadow: 0 18px 36px rgba(37, 211, 102, 0.32);\n        font-size: 27px;\n        font-weight: 900;\n      }\n\n      .fade-up {\n        animation: fadeUp 760ms ease both;\n      }\n\n      @keyframes fadeUp {\n        from {\n          opacity: 0;\n          transform: translateY(22px);\n        }\n        to {\n          opacity: 1;\n          transform: translateY(0);\n        }\n      }\n\n      @media (max-width: 1080px) {\n        .nav {\n          display: none;\n        }\n\n        .property-grid,\n        .metric-grid,\n        .broker-grid {\n          grid-template-columns: repeat(2, 1fr);\n        }\n\n        .search-grid,\n        .listing-layout,\n        .detail-layout,\n        .dashboard-grid,\n        .dashboard-columns,\n        .footer-grid {\n          grid-template-columns: 1fr;\n        }\n\n        .filter-box,\n        .detail-panel {\n          position: static;\n        }\n\n        .list-card {\n          grid-template-columns: 210px 1fr;\n        }\n\n        .list-price {\n          grid-column: 1 / -1;\n          grid-template-columns: 1fr auto;\n          align-items: center;\n          justify-items: start;\n        }\n\n        .phone-strip {\n          grid-template-columns: 1fr;\n        }\n      }\n\n      @media (max-width: 720px) {\n        .container {\n          width: min(100% - 24px, 1180px);\n        }\n\n        .topbar {\n          inset: 10px 0 auto;\n        }\n\n        .pill-btn {\n          display: none;\n        }\n\n        .hero {\n          min-height: 760px;\n        }\n\n        .hero-content {\n          padding-top: 142px;\n        }\n\n        .hero h1 {\n          font-size: 3.4rem;\n        }\n\n        .search-grid,\n        .stats-grid,\n        .property-grid,\n        .broker-grid,\n        .metric-grid,\n        .ad-banner {\n          grid-template-columns: 1fr;\n        }\n\n        .stats-strip {\n          transform: translateY(-26px);\n        }\n\n        .section {\n          padding: 58px 0;\n        }\n\n        .section-title,\n        .list-toolbar,\n        .dashboard-head {\n          align-items: flex-start;\n          flex-direction: column;\n        }\n\n        .list-card {\n          grid-template-columns: 1fr;\n        }\n\n        .list-card img {\n          width: 100%;\n        }\n\n        .gallery-main {\n          height: 330px;\n        }\n\n        .gallery {\n          grid-template-columns: repeat(2, 1fr);\n        }\n\n        .gallery-main {\n          grid-column: 1 / -1;\n        }\n\n        .footer-grid {\n          gap: 22px;\n        }\n      }\n\n      .route-panel {\n        display: block;\n      }\n\n      .route-panel[aria-hidden=\"true\"] {\n        display: none !important;\n      }\n\n      .nav a.active,\n      .dash-menu button.active {\n        color: #fff;\n        background: rgba(255, 255, 255, 0.14);\n      }\n\n      .nav a.active {\n        background: transparent;\n      }\n\n      .dash-menu button {\n        width: 100%;\n        text-align: left;\n        padding: 13px 14px;\n        border: 0;\n        border-radius: 13px;\n        color: rgba(255, 255, 255, 0.72);\n        background: transparent;\n        font-weight: 800;\n        cursor: pointer;\n      }\n\n      .heart.active {\n        color: #c42a2a;\n        background: rgba(255, 255, 255, 0.98);\n      }\n\n      .route-note {\n        margin-top: 14px;\n        color: var(--muted);\n        font-size: 13px;\n      }\n

      .login-section {
        min-height: 720px;
        display: grid;
        align-items: center;
        color: #fff;
        background:
          linear-gradient(130deg, rgba(9, 19, 20, 0.96), rgba(9, 19, 20, 0.76)),
          url("https://images.unsplash.com/photo-1613545325278-f24b0cae1224?auto=format&fit=crop&w=1600&q=80") center/cover;
      }

      .login-layout {
        display: grid;
        grid-template-columns: 1fr 420px;
        gap: 48px;
        align-items: center;
      }

      .login-copy h2 {
        margin: 0;
        font-family: var(--font-display);
        font-size: clamp(2.6rem, 6vw, 5.8rem);
        line-height: 0.95;
        letter-spacing: -0.055em;
      }

      .login-copy p {
        max-width: 560px;
        color: rgba(255, 255, 255, 0.76);
        font-size: 1.08rem;
        line-height: 1.8;
      }

      .login-card {
        display: grid;
        gap: 16px;
        padding: 30px;
        border: 1px solid rgba(255, 255, 255, 0.18);
        border-radius: var(--radius-xl);
        background: rgba(255, 255, 255, 0.96);
        box-shadow: var(--shadow);
      }

      .login-error {
        margin: 0;
        color: #9f1d1d;
        font-size: 13px;
        font-weight: 800;
      }

      .footer-dashboard {
        display: inline-grid;
        place-items: center;
        width: 48px;
        height: 48px;
        margin-top: 14px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 16px;
        color: #fff;
        background: rgba(201, 144, 45, 0.22);
        cursor: pointer;
      }

      .pager button:disabled {
        opacity: 0.42;
        cursor: not-allowed;
      }

      @media (max-width: 1080px) {
        .login-layout {
          grid-template-columns: 1fr;
        }
      }
`;
    document.head.appendChild(style);
  }

  function brand() {
    return `<button class="brand" type="button" data-route="home" aria-label="SuaImobiliaria"><span class="brand-mark"></span><span>SuaImobiliaria</span></button>`;
  }

  function routeAttrs(isVisible, route) {
    const visible = isVisible(route);
    return `class="route-panel" data-panel="${route}" aria-hidden="${visible ? "false" : "true"}" style="display:${visible ? "block" : "none"};"`;
  }

  function active(currentRoute, route) {
    return currentRoute === route ? "active" : "";
  }

  function favoriteIcon(isFavorite, propertyId) {
    return isFavorite(propertyId) ? "♥" : "♡";
  }

  function propertyCard(property, options) {
    const isFavorite = options.isFavorite(property.id);
    return `
      <article class="property-card fade-up">
        <button class="card-media" type="button" data-route="imovel" data-property-id="${property.id}" aria-label="Ver detalhes de ${property.title}">
          <img src="${property.image}" alt="${property.title}" loading="lazy">
          <span class="badge">${property.tag}</span>
        </button>
        <button class="heart ${isFavorite ? "active" : ""}" type="button" data-cid="${options.componentId}" data-message="toggleFavorite" data-property-id="${property.id}" aria-label="Favoritar ${property.title}">${favoriteIcon(options.isFavorite, property.id)}</button>
        <div class="property-body">
          <span class="property-type">${property.type}</span>
          <h3>${property.title}</h3>
          <div class="location">${property.city}</div>
          <div class="meta">${property.meta.map((item) => `<span>${item}</span>`).join("")}</div>
          <div class="price">${property.price}</div>
        </div>
      </article>
    `;
  }

  function listCard(property, options) {
    const isFavorite = options.isFavorite(property.id);
    return `
      <article class="list-card">
        <img src="${property.image}" alt="${property.title}" loading="lazy">
        <div class="list-info">
          <span class="property-type">${property.type}</span>
          <h3>${property.title}</h3>
          <div class="location">${property.city}</div>
          <div class="meta">${property.meta.map((item) => `<span>${item}</span>`).join("")}</div>
        </div>
        <div class="list-price">
          <button class="heart ${isFavorite ? "active" : ""}" type="button" data-cid="${options.componentId}" data-message="toggleFavorite" data-property-id="${property.id}" aria-label="Favoritar ${property.title}">${favoriteIcon(options.isFavorite, property.id)}</button>
          <strong class="price">${property.price}</strong>
          <button class="ghost-btn" type="button" data-route="imovel" data-property-id="${property.id}">Ver detalhes</button>
        </div>
      </article>
    `;
  }

  function TopbarComponent({ props }) {
    const { getRoute } = props;

    return {
      next() {
        const route = getRoute();

        return {
          done: false,
          value: `
            <header class="topbar">
              ${brand()}
              <nav class="nav" aria-label="Navegação principal">
                <a class="${active(route, "comprar")}" href="#comprar" data-route="comprar">Comprar</a>
                <a class="${active(route, "comprar")}" href="#comprar" data-route="comprar">Alugar</a>
                <a class="${active(route, "destaques")}" href="#destaques" data-route="destaques">Lançamentos</a>
                <a class="${active(route, "anuncie")}" href="#anuncie" data-route="anuncie">Anuncie seu imóvel</a>
                <a class="${active(route, "contato")}" href="#contato" data-route="contato">Contato</a>
              </nav>
              <button class="pill-btn" type="button" data-route="contato">☎ Fale conosco</button>
            </header>
          `,
        };
      },
    };
  }

  function HeroComponent() {
    let tab = "comprar";

    return {
      next(message = {}) {
        if (message.type === "setTab") {
          tab = message.value || tab;
        }

        return {
          done: false,
          value: `
            <section id="home" class="hero">
              <div class="container hero-content">
                <span class="eyebrow">Curadoria premium</span>
                <h1>Encontre o imóvel ideal para você</h1>
                <p>Casas, apartamentos e terrenos nas melhores localizações da cidade, com atendimento consultivo do primeiro clique até a entrega das chaves.</p>
                <div class="search-panel" role="search">
                  <div class="tabs">
                    <button class="tab ${tab === "comprar" ? "active" : ""}" type="button" data-cid="hero" data-message="setTab" data-value="comprar">Comprar</button>
                    <button class="tab ${tab === "alugar" ? "active" : ""}" type="button" data-cid="hero" data-message="setTab" data-value="alugar">Alugar</button>
                  </div>
                  <div class="search-grid">
                    <label class="field">
                      <span>Localização</span>
                      <input value="Buscar por cidade, bairro ou condomínio" aria-label="Localização">
                    </label>
                    <label class="field">
                      <span>Tipo de imóvel</span>
                      <select aria-label="Tipo de imóvel"><option>Todos</option><option>Casa</option><option>Apartamento</option></select>
                    </label>
                    <label class="field">
                      <span>Faixa de preço</span>
                      <select aria-label="Faixa de preço"><option>Qualquer preço</option><option>Até R$ 700 mil</option><option>Acima de R$ 1 mi</option></select>
                    </label>
                    <button class="gold-btn" type="button" data-route="comprar">Buscar imóveis</button>
                  </div>
                  <p class="route-note">A busca troca a rota visual para a tela de listagem, sem desmontar a estrutura do sistema.</p>
                </div>
              </div>
            </section>
          `,
        };
      },
    };
  }

  function StatsComponent() {
    return {
      next() {
        return {
          done: false,
          value: `
            <div class="stats-strip">
              <div class="container stats-grid">
                <div class="stat-card"><span class="icon-box">⌂</span><div><strong>+20 anos</strong><span>de experiência</span></div></div>
                <div class="stat-card"><span class="icon-box">♙</span><div><strong>Atendimento</strong><span>especializado</span></div></div>
                <div class="stat-card"><span class="icon-box">♡</span><div><strong>Imóveis</strong><span>selecionados</span></div></div>
                <div class="stat-card"><span class="icon-box">▣</span><div><strong>Segurança</strong><span>em todas as negociações</span></div></div>
              </div>
            </div>
          `,
        };
      },
    };
  }

  function FeaturedComponent({ props }) {
    const { isFavorite, toggleFavorite } = props;

    return {
      next(message = {}) {
        if (message.type === "toggleFavorite") {
          toggleFavorite(message.propertyId);
        }

        return {
          done: false,
          value: `
            <section id="destaques" class="section">
              <div class="container">
                <div class="section-title">
                  <div>
                    <span class="eyebrow">Destaques</span>
                    <h2>Imóveis em destaque</h2>
                    <p>Selecionamos as oportunidades mais fortes para quem busca conforto, localizacao e liquidez.</p>
                  </div>
                  <button class="ghost-btn" type="button" data-route="comprar">Ver todos</button>
                </div>
                <div class="property-grid">${properties.map((property) => propertyCard(property, { componentId: "featured", isFavorite })).join("")}</div>
              </div>
            </section>
          `,
        };
      },
    };
  }

  function AnnounceComponent() {
    return {
      next() {
        return {
          done: false,
          value: `
            <section id="anuncie" class="section">
              <div class="container">
                <div class="ad-banner">
                  <div class="ad-copy">
                    <h3>Anuncie seu imóvel com quem entende</h3>
                    <p>Temos um time preparado para avaliar, fotografar e divulgar seu imóvel com máxima visibilidade.</p>
                    <button class="gold-btn" type="button" data-route="contato">Quero anunciar</button>
                  </div>
                  <img src="https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=1100&q=82" alt="Sala elegante com vista para jardim" loading="lazy">
                </div>

                <div class="phone-strip" aria-label="Fluxo de anúncio">
                  <article class="phone-card">
                    <h3>1. Dados do proprietário</h3>
                    <div class="mini-field"><label>Nome completo</label><input placeholder="Digite seu nome"></div>
                    <div class="mini-field"><label>Telefone</label><input placeholder="(71) 99999-0000"></div>
                    <div class="mini-field"><label>E-mail</label><input placeholder="seuemail@email.com"></div>
                  </article>
                  <article class="phone-card">
                    <h3>2. Dados do imóvel</h3>
                    <div class="mini-field"><label>Tipo</label><select><option>Casa</option><option>Apartamento</option><option>Terreno</option></select></div>
                    <div class="mini-field"><label>Bairro</label><input placeholder="Informe o bairro"></div>
                    <div class="mini-field"><label>Valor desejado</label><input placeholder="R$"></div>
                  </article>
                  <article class="phone-card">
                    <h3>3. Atendimento</h3>
                    <p class="location">Depois do cadastro, um corretor valida as informações, agenda fotos e prepara o anúncio.</p>
                    <button class="gold-btn" style="width:100%;" type="button" data-route="contato">Enviar interesse</button>
                  </article>
                </div>
              </div>
            </section>
          `,
        };
      },
    };
  }

  function ListingComponent({ props }) {
    const { isFavorite, toggleFavorite } = props;
    let viewMode = "grid";
    let page = 1;
    const pageSize = 3;
    const filters = {
      kinds: new Set(),
      city: "Todos",
      neighborhood: "Todos",
      maxPrice: 2500000,
      bedrooms: "Qualquer",
    };

    const filterProperties = () =>
      properties.filter((property) => {
        const matchesKind = filters.kinds.size === 0 || filters.kinds.has(property.kind);
        const matchesCity = filters.city === "Todos" || property.cityName === filters.city;
        const matchesNeighborhood = filters.neighborhood === "Todos" || property.neighborhood === filters.neighborhood;
        const matchesPrice = property.priceNumber <= Number(filters.maxPrice);
        const minBedrooms = filters.bedrooms === "Qualquer" ? 0 : Number(filters.bedrooms.replace("+", ""));
        const matchesBedrooms = minBedrooms === 0 || property.bedrooms >= minBedrooms;
        return matchesKind && matchesCity && matchesNeighborhood && matchesPrice && matchesBedrooms;
      });

    const resetFilters = () => {
      filters.kinds.clear();
      filters.city = "Todos";
      filters.neighborhood = "Todos";
      filters.maxPrice = 2500000;
      filters.bedrooms = "Qualquer";
      page = 1;
    };

    const option = (value, selected) => `<option value="${value}" ${selected === value ? "selected" : ""}>${value}</option>`;

    return {
      next(message = {}) {
        if (message.type === "toggleFavorite") {
          toggleFavorite(message.propertyId);
        }
        if (message.type === "setView") {
          viewMode = message.value || viewMode;
        }
        if (message.type === "filter") {
          if (message.name === "kind") {
            if (message.checked) filters.kinds.add(message.value);
            else filters.kinds.delete(message.value);
          } else if (message.name && message.name in filters) {
            filters[message.name] = message.value;
            if (message.name === "city") filters.neighborhood = "Todos";
          }
          page = 1;
        }
        if (message.type === "clearFilters") {
          resetFilters();
        }
        if (message.type === "setPage") {
          page = Number(message.value) || 1;
        }

        const filtered = filterProperties();
        const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
        page = Math.min(Math.max(page, 1), totalPages);
        const start = (page - 1) * pageSize;
        const visibleProperties = filtered.slice(start, start + pageSize);
        const neighborhoods = ["Todos", ...new Set(properties.filter((property) => filters.city === "Todos" || property.cityName === filters.city).map((property) => property.neighborhood))];
        const pager = Array.from({ length: totalPages }, (_, index) => index + 1)
          .map((item) => `<button class="${item === page ? "active" : ""}" type="button" data-cid="listing" data-message="setPage" data-value="${item}">${item}</button>`)
          .join("");

        return {
          done: false,
          value: `
            <section id="comprar" class="section listing-section">
              <div class="container">
                <div class="section-title">
                  <div>
                    <span class="eyebrow">Comprar</span>
                    <h2>Imóveis à venda</h2>
                    <p>Encontramos ${filtered.length} ${filtered.length === 1 ? "imóvel" : "imóveis"}. Ajuste os filtros para chegar mais rápido ao que combina com você.</p>
                  </div>
                </div>

                <div class="listing-layout">
                  <aside class="filter-box" aria-label="Filtros">
                    <div class="filter-head"><strong>Filtros</strong><button type="button" data-cid="listing" data-message="clearFilters">Limpar filtros</button></div>
                    <div class="filter-stack">
                      <div class="mini-field">
                        <label>Tipo de imóvel</label>
                        <div class="check-list">
                          ${["Casa", "Apartamento", "Terreno", "Cobertura", "Sala comercial"].map((kind) => `
                            <label><input type="checkbox" data-cid="listing" data-message="filter" data-name="kind" value="${kind}" ${filters.kinds.has(kind) ? "checked" : ""}> ${kind}</label>
                          `).join("")}
                        </div>
                      </div>
                      <div class="mini-field"><label>Cidade</label><select data-cid="listing" data-message="filter" data-name="city">${["Todos", "Salvador", "Camaçari", "Lauro de Freitas"].map((city) => option(city, filters.city)).join("")}</select></div>
                      <div class="mini-field"><label>Bairro</label><select data-cid="listing" data-message="filter" data-name="neighborhood">${neighborhoods.map((neighborhood) => option(neighborhood, filters.neighborhood)).join("")}</select></div>
                      <div class="mini-field"><label>Preço máximo: R$ ${Number(filters.maxPrice).toLocaleString("pt-BR")}</label><input type="range" min="290000" max="2500000" step="50000" value="${filters.maxPrice}" data-cid="listing" data-message="filter" data-name="maxPrice"></div>
                      <div class="mini-field"><label>Quartos</label><select data-cid="listing" data-message="filter" data-name="bedrooms">${["Qualquer", "1+", "2+", "3+", "4+"].map((bedrooms) => option(bedrooms, filters.bedrooms)).join("")}</select></div>
                      <button class="gold-btn" type="button" data-cid="listing" data-message="clearFilters">Resetar busca</button>
                    </div>
                  </aside>

                  <div>
                    <div class="list-toolbar">
                      <strong>Página ${page} de ${totalPages}</strong>
                      <div class="view-toggle">
                        <button class="square-btn ${viewMode === "grid" ? "active" : ""}" type="button" data-cid="listing" data-message="setView" data-value="grid">▦</button>
                        <button class="square-btn ${viewMode === "list" ? "active" : ""}" type="button" data-cid="listing" data-message="setView" data-value="list">☰</button>
                      </div>
                    </div>
                    <div class="list-stack">
                      ${visibleProperties.length ? visibleProperties.map((property) => listCard(property, { componentId: "listing", isFavorite })).join("") : `<article class="list-card"><div class="list-info"><h3>Nenhum imóvel encontrado</h3><div class="location">Tente limpar filtros ou ampliar o preço máximo.</div></div></article>`}
                    </div>
                    <div class="pager">
                      <button type="button" data-cid="listing" data-message="setPage" data-value="${page - 1}" ${page === 1 ? "disabled" : ""}>‹</button>
                      ${pager}
                      <button type="button" data-cid="listing" data-message="setPage" data-value="${page + 1}" ${page === totalPages ? "disabled" : ""}>›</button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          `,
        };
      },
    };
  }

  function DetailComponent({ props }) {
    const { getSelectedProperty } = props;

    return {
      next() {
        const property = getSelectedProperty();

        return {
          done: false,
          value: `
            <section id="imovel" class="section detail-section">
              <div class="container detail-layout">
                <div>
                  <div class="gallery">
                    <div class="gallery-main"><img src="${property.image}" alt="${property.title}"></div>
                    ${properties.map((item, index) => `
                      <div class="gallery-thumb">
                        <img src="${item.image}" alt="${item.title}" loading="lazy">
                        ${index === 3 ? `<span class="gallery-more">+18 fotos</span>` : ""}
                      </div>
                    `).join("")}
                  </div>
                  <div class="detail-copy">
                    <span class="eyebrow">Sobre o imóvel</span>
                    <h2>${property.title} com arquitetura contemporânea</h2>
                    <p>Projeto moderno, com ambientes integrados, área gourmet, piscina com deck e acabamento de alto padrão. Uma casa feita para receber bem, viver com conforto e manter privacidade.</p>
                    <ul class="feature-list">
                      <li>Sala ampla com pé-direito duplo</li>
                      <li>Cozinha integrada com área gourmet</li>
                      <li>Piscina com deck molhado</li>
                      <li>Suite master com closet e varanda</li>
                      <li>Energia solar e aquecimento de água</li>
                    </ul>
                  </div>
                </div>

                <aside class="detail-panel">
                  <span class="property-type">${property.type}</span>
                  <h3>${property.title}</h3>
                  <div class="location">⌖ ${property.city}</div>
                  <div class="meta">${property.meta.map((item) => `<span>${item}</span>`).join("")}</div>
                  <strong class="price">${property.price}</strong>
                  <span class="financing">Condomínio R$ 780</span>
                  <div class="action-stack">
                    <button class="gold-btn" type="button" data-route="contato">Quero agendar uma visita</button>
                    <button class="ghost-btn whatsapp" type="button" data-route="contato">Falar no WhatsApp</button>
                    <button class="ghost-btn" type="button" data-route="contato">Ligar agora</button>
                  </div>
                  <div class="broker-card">
                    <strong>Fale com o corretor</strong>
                    <div class="broker-person">
                      <img class="avatar" src="${brokers[0][2]}" alt="${brokers[0][0]}">
                      <div><strong>${brokers[0][0]}</strong><div class="location">CRECI 12345</div></div>
                    </div>
                    <button class="ghost-btn" type="button" data-route="comprar">Ver todos os imóveis</button>
                  </div>
                </aside>
              </div>
            </section>
          `,
        };
      },
    };
  }

  function BrokersComponent() {
    return {
      next() {
        return {
          done: false,
          value: `
            <section class="section brokers">
              <div class="container">
                <div class="section-title" style="justify-content:center;text-align:center;">
                  <div>
                    <span class="eyebrow">Atendimento humano</span>
                    <h2>Conte com nossos corretores</h2>
                    <p>Especialistas prontos para encontrar o imóvel ideal e acompanhar cada etapa da negociação.</p>
                  </div>
                </div>
                <div class="broker-grid">
                  ${brokers.map(([name, phone, photo]) => `
                    <article class="broker-tile">
                      <img src="${photo}" alt="${name}" loading="lazy">
                      <strong>${name}</strong>
                      <div class="location">☎ ${phone}</div>
                    </article>
                  `).join("")}
                </div>
              </div>
            </section>
          `,
        };
      },
    };
  }

  function DashboardComponent({ props }) {
    const { favoriteIcon } = props;

    return {
      next() {
        return {
          done: false,
          value: `
            <section id="dashboard" class="section dashboard-section">
              <div class="container">
                <div class="section-title">
                  <div>
                    <span class="eyebrow">Área interna</span>
                    <h2>Dashboard administrativo</h2>
                    <p>Visão de gestão com leads, visitas, atividades recentes e os imóveis mais acessados.</p>
                  </div>
                </div>
                <div class="dashboard-grid">
                  <aside class="dashboard-nav">
                    ${brand()}
                    <div class="dash-menu">
                      <button class="active" type="button">⌂ Dashboard</button>
                      <button type="button" data-route="comprar">▦ Imóveis</button>
                      <button type="button">◎ Leads</button>
                      <button type="button">♙ Clientes</button>
                      <button type="button">▤ Agendamentos</button>
                      <button type="button">✉ Mensagens</button>
                      <button type="button">◷ Relatórios</button>
                      <button type="button">⚙ Configurações</button>
                    </div>
                  </aside>
                  <div class="dashboard-board">
                    <div class="dashboard-head">
                      <h2>Dashboard</h2>
                      <div class="broker-person"><img class="avatar" src="${brokers[1][2]}" alt="Admin"><strong>Admin</strong></div>
                    </div>
                    <div class="metric-grid">
                      <div class="metric"><small>Total de imóveis</small><strong>56</strong></div>
                      <div class="metric"><small>Imóveis ativos</small><strong style="color:#1f9b61;">42</strong></div>
                      <div class="metric"><small>Leads</small><strong>128</strong></div>
                      <div class="metric"><small>Visitas este mês</small><strong>1.245</strong></div>
                    </div>
                    <div class="dashboard-columns">
                      <article class="dashboard-card">
                        <h3>Atividades recentes</h3>
                        <div class="activity">
                          <div class="activity-row"><span class="dot">A</span><div><strong>Novo lead recebido</strong><div class="location">Apartamento no Jardim Armação</div></div><small>Hoje, 10:23</small></div>
                          <div class="activity-row"><span class="dot" style="background:#24a45a;">G</span><div><strong>Agendamento confirmado</strong><div class="location">Visita - Casa no Vilarejo</div></div><small>Hoje, 09:15</small></div>
                          <div class="activity-row"><span class="dot" style="background:#d48a1d;">N</span><div><strong>Novo imóvel publicado</strong><div class="location">Casa em Alphaville</div></div><small>Ontem</small></div>
                        </div>
                      </article>
                      <article class="dashboard-card">
                        <h3>Imóveis mais acessados</h3>
                        <div class="popular">
                          ${properties.slice(0, 3).map((property, index) => `
                            <div class="popular-row"><img src="${property.image}" alt="${property.title}" loading="lazy"><div><strong>${property.title}</strong><div class="location">${1250 - index * 230} visualizações</div></div><small>#${index + 1}</small></div>
                          `).join("")}
                        </div>
                      </article>
                    </div>
                  </div>
                </div>

                <div class="phone-strip" aria-label="Cenas mobile inspiradas na referência">
                  <article class="phone-card">
                    <h3>Favoritos</h3>
                    ${properties.map((property) => `<div class="mini-property"><img src="${property.image}" alt="${property.title}" loading="lazy"><div><strong>${property.title}</strong><div class="location">${property.price}</div></div><span>${favoriteIcon(property.id)}</span></div>`).join("")}
                  </article>
                  <article class="phone-card">
                    <h3>Anuncie seu imóvel</h3>
                    <div class="mini-field"><label>Nome completo</label><input placeholder="Digite seu nome"></div>
                    <div class="mini-field"><label>Telefone</label><input placeholder="(71) 99999-0000"></div>
                    <div class="mini-field"><label>E-mail</label><input placeholder="seuemail@email.com"></div>
                    <button class="gold-btn" style="width:100%;margin-top:14px;" type="button" data-route="anuncie">Continuar</button>
                  </article>
                  <article class="phone-card">
                    <h3>Quiz - Ache seu imóvel</h3>
                    <p class="location">Qual é a finalidade?</p>
                    <div class="quiz-option active">● Comprar</div>
                    <div class="quiz-option">○ Alugar</div>
                    <div class="quiz-option">○ Investir</div>
                    <div class="progress"><span></span></div>
                    <button class="gold-btn" style="width:100%;" type="button" data-route="comprar">Próxima</button>
                  </article>
                </div>
              </div>
            </section>
          `,
        };
      },
    };
  }

  function DashboardComponentStateful({ props }) {
    const { favoriteIcon } = props;
    let activeTab = "overview";
    const tabs = [
      { id: "overview", label: "Dashboard", icon: "⌂" },
      { id: "properties", label: "Imoveis", icon: "▦" },
      { id: "leads", label: "Leads", icon: "◎" },
      { id: "clients", label: "Clientes", icon: "♙" },
      { id: "appointments", label: "Agendamentos", icon: "▤" },
      { id: "messages", label: "Mensagens", icon: "✉" },
      { id: "reports", label: "Relatorios", icon: "◷" },
      { id: "settings", label: "Configuracoes", icon: "⚙" },
    ];
    const dashboardState = {
      metrics: [
        { label: "Total de imoveis", value: "56" },
        { label: "Imoveis ativos", value: "42", color: "#1f9b61" },
        { label: "Leads", value: "128" },
        { label: "Visitas este mes", value: "1.245" },
      ],
      activities: [
        { icon: "A", title: "Novo lead recebido", detail: "Apartamento no Jardim Armacao", time: "Hoje, 10:23", color: "var(--gold)" },
        { icon: "G", title: "Agendamento confirmado", detail: "Visita - Casa no Vilarejo", time: "Hoje, 09:15", color: "#24a45a" },
        { icon: "N", title: "Novo imovel publicado", detail: "Casa em Alphaville", time: "Ontem", color: "#d48a1d" },
        { icon: "C", title: "Cliente reativado", detail: "Juliana Oliveira pediu retorno", time: "Ontem, 17:40", color: "#4d7bd6" },
      ],
      leads: [
        { name: "Lucas Andrade", source: "Landing page home", interest: "Casa em Condominio Alphaville", stage: "Quente" },
        { name: "Patricia Souza", source: "WhatsApp", interest: "Apartamento no Jardim Armacao", stage: "Em visita" },
        { name: "Rafael Lima", source: "Formulario de anuncio", interest: "Casa no Vilarejo", stage: "Qualificando" },
        { name: "Helena Prado", source: "Quiz mobile", interest: "Terreno em Busca Vida", stage: "Novo" },
      ],
      clients: [
        { name: "Mariana Costa", profile: "Compradora", focus: "3 quartos em Salvador", owner: "Joao Almeida" },
        { name: "Eduardo Nunes", profile: "Investidor", focus: "Imoveis acima de R$ 1,2 mi", owner: "Carlos Mendes" },
        { name: "Bianca Ramos", profile: "Locataria", focus: "Apartamento compacto", owner: "Juliana Oliveira" },
        { name: "Fernando Pires", profile: "Proprietario", focus: "Captacao no litoral", owner: "Mariana Santos" },
      ],
      appointments: [
        { date: "19/06 - 09:30", client: "Lucas Andrade", property: "Casa em Condominio Alphaville", broker: "Joao Almeida" },
        { date: "19/06 - 14:00", client: "Patricia Souza", property: "Apartamento no Jardim Armacao", broker: "Mariana Santos" },
        { date: "20/06 - 11:00", client: "Eduardo Nunes", property: "Casa no Vilarejo", broker: "Carlos Mendes" },
        { date: "20/06 - 16:30", client: "Helena Prado", property: "Terreno em Busca Vida", broker: "Juliana Oliveira" },
      ],
      messages: [
        { from: "Site institucional", subject: "Pedido de retorno comercial", status: "Nao lida" },
        { from: "WhatsApp", subject: "Cliente quer simular financiamento", status: "Respondida" },
        { from: "Formulario de anuncio", subject: "Novo imovel para avaliacao", status: "Triagem" },
        { from: "Instagram", subject: "Pergunta sobre taxa de corretagem", status: "Nao lida" },
      ],
      reports: [
        { title: "Conversao de leads", value: "18%", note: "Alta de 3 pontos na semana" },
        { title: "Tempo medio ate visita", value: "2,4 dias", note: "Melhor janela em 30 dias" },
        { title: "Imoveis com maior intencao", value: "Casas premium", note: "Alphaville e Busca Vida lideram" },
        { title: "Canal com melhor custo", value: "WhatsApp", note: "Maior taxa de resposta organica" },
      ],
      settings: [
        { label: "Aprovacao manual de novos anuncios", value: "Ativada" },
        { label: "Aviso de lead quente por e-mail", value: "Ativado" },
        { label: "Sincronizacao com CRM externo", value: "Planejada" },
        { label: "Relatorio semanal para diretoria", value: "Toda segunda, 08:00" },
      ],
    };

    function getCurrentTab() {
      return tabs.find((tab) => tab.id === activeTab) || tabs[0];
    }

    function renderCollection(title, items) {
      return `
        <article class="dashboard-card">
          <h3>${title}</h3>
          <div class="activity">
            ${items.map((item) => `
              <div class="activity-row">
                <span class="dot" style="background:${item.color || "var(--gold)"};">${item.icon || "•"}</span>
                <div>
                  <strong>${item.title || item.name || item.label || item.from || item.date}</strong>
                  <div class="location">${item.detail || item.note || item.subject || item.focus || item.property || item.value || item.stage}</div>
                </div>
                <small>${item.time || item.status || item.owner || item.broker || item.source || ""}</small>
              </div>
            `).join("")}
          </div>
        </article>
      `;
    }

    function renderPropertiesPanel() {
      return `
        <div class="dashboard-columns">
          <article class="dashboard-card">
            <h3>Carteira de imoveis</h3>
            <div class="popular">
              ${properties.slice(0, 5).map((property, index) => `
                <div class="popular-row">
                  <img src="${property.image}" alt="${property.title}" loading="lazy">
                  <div>
                    <strong>${property.title}</strong>
                    <div class="location">${property.kind} · ${property.city}</div>
                  </div>
                  <small>#${index + 1}</small>
                </div>
              `).join("")}
            </div>
          </article>
          <article class="dashboard-card">
            <h3>Resumo comercial</h3>
            <div class="activity">
              ${properties.slice(0, 4).map((property) => `
                <div class="activity-row">
                  <span class="dot">R</span>
                  <div>
                    <strong>${property.price}</strong>
                    <div class="location">${property.title}</div>
                  </div>
                  <small>${property.area}</small>
                </div>
              `).join("")}
            </div>
          </article>
        </div>
      `;
    }

    function renderTabPanel() {
      if (activeTab === "overview") {
        return `
          <div class="metric-grid">
            ${dashboardState.metrics.map((metric) => `
              <div class="metric">
                <small>${metric.label}</small>
                <strong${metric.color ? ` style="color:${metric.color};"` : ""}>${metric.value}</strong>
              </div>
            `).join("")}
          </div>
          <div class="dashboard-columns">
            ${renderCollection("Atividades recentes", dashboardState.activities)}
            <article class="dashboard-card">
              <h3>Imoveis mais acessados</h3>
              <div class="popular">
                ${properties.slice(0, 3).map((property, index) => `
                  <div class="popular-row">
                    <img src="${property.image}" alt="${property.title}" loading="lazy">
                    <div>
                      <strong>${property.title}</strong>
                      <div class="location">${1250 - index * 230} visualizacoes</div>
                    </div>
                    <small>#${index + 1}</small>
                  </div>
                `).join("")}
              </div>
            </article>
          </div>
        `;
      }

      if (activeTab === "properties") return renderPropertiesPanel();
      if (activeTab === "leads") return renderCollection("Pipeline de leads", dashboardState.leads);
      if (activeTab === "clients") return renderCollection("Base de clientes", dashboardState.clients);
      if (activeTab === "appointments") return renderCollection("Agenda comercial", dashboardState.appointments);
      if (activeTab === "messages") return renderCollection("Caixa de mensagens", dashboardState.messages);
      if (activeTab === "reports") return renderCollection("Indicadores e leitura", dashboardState.reports);
      return renderCollection("Configuracoes operacionais", dashboardState.settings);
    }

    return {
      next(message = {}) {
        if (message.type === "setTab" && message.value) {
          activeTab = message.value;
        }

        const currentTab = getCurrentTab();

        return {
          done: false,
          value: `
            <section id="dashboard" class="section dashboard-section">
              <div class="container">
                <div class="section-title">
                  <div>
                    <span class="eyebrow">Area interna</span>
                    <h2>Dashboard administrativo</h2>
                    <p>Visao de gestao com leads, visitas, clientes, agenda comercial e leitura de performance.</p>
                  </div>
                </div>
                <div class="dashboard-grid">
                  <aside class="dashboard-nav">
                    ${brand()}
                    <div class="dash-menu">
                      ${tabs.map((tab) => `
                        <button class="${tab.id === activeTab ? "active" : ""}" type="button" data-cid="dashboard" data-message="setTab" data-value="${tab.id}">${tab.icon} ${tab.label}</button>
                      `).join("")}
                    </div>
                  </aside>
                  <div class="dashboard-board">
                    <div class="dashboard-head">
                      <h2>${currentTab.label}</h2>
                      <div class="broker-person"><img class="avatar" src="${brokers[1][2]}" alt="Admin"><strong>Admin</strong></div>
                    </div>
                    ${renderTabPanel()}
                  </div>
                </div>

                <div class="phone-strip" aria-label="Cenas mobile inspiradas na referencia">
                  <article class="phone-card">
                    <h3>Favoritos</h3>
                    ${properties.map((property) => `<div class="mini-property"><img src="${property.image}" alt="${property.title}" loading="lazy"><div><strong>${property.title}</strong><div class="location">${property.price}</div></div><span>${favoriteIcon(property.id)}</span></div>`).join("")}
                  </article>
                  <article class="phone-card">
                    <h3>Anuncie seu imovel</h3>
                    <div class="mini-field"><label>Nome completo</label><input placeholder="Digite seu nome"></div>
                    <div class="mini-field"><label>Telefone</label><input placeholder="(71) 99999-0000"></div>
                    <div class="mini-field"><label>E-mail</label><input placeholder="seuemail@email.com"></div>
                    <button class="gold-btn" style="width:100%;margin-top:14px;" type="button" data-route="anuncie">Continuar</button>
                  </article>
                  <article class="phone-card">
                    <h3>Quiz - Ache seu imovel</h3>
                    <p class="location">Qual e a finalidade?</p>
                    <div class="quiz-option active">● Comprar</div>
                    <div class="quiz-option">○ Alugar</div>
                    <div class="quiz-option">○ Investir</div>
                    <div class="progress"><span></span></div>
                    <button class="gold-btn" style="width:100%;" type="button" data-route="comprar">Proxima</button>
                  </article>
                </div>
              </div>
            </section>
          `,
        };
      },
    };
  }

  function LoginComponent({ props }) {
    const { login } = props;
    let error = "";

    return {
      next(message = {}) {
        if (message.type === "login") {
          const ok = login(message.email, message.password);
          error = ok ? "" : "Use admin@suaimobiliaria.com.br e senha admin123.";
        }

        return {
          done: false,
          value: `
            <section id="login" class="section login-section">
              <div class="container login-layout">
                <div class="login-copy">
                  <span class="eyebrow">Área restrita</span>
                  <h2>Entrar no dashboard</h2>
                  <p>Acesse indicadores, leads, imóveis mais acessados e atividades recentes da operação.</p>
                </div>
                <form class="login-card" data-cid="login" data-message="login">
                  <label class="mini-field">
                    <span>E-mail</span>
                    <input name="email" type="email" value="admin@suaimobiliaria.com.br" autocomplete="username">
                  </label>
                  <label class="mini-field">
                    <span>Senha</span>
                    <input name="password" type="password" value="admin123" autocomplete="current-password">
                  </label>
                  ${error ? `<p class="login-error">${error}</p>` : `<p class="route-note">Demonstração: admin@suaimobiliaria.com.br / admin123</p>`}
                  <button class="gold-btn" type="submit">Acessar dashboard</button>
                </form>
              </div>
            </section>
          `,
        };
      },
    };
  }

  function FooterComponent() {
    return {
      next() {
        return {
          done: false,
          value: `
            <footer id="contato" class="site-footer">
              <div class="container footer-grid">
                <div>
                  ${brand()}
                  <p>Conectando pessoas aos melhores imóveis e oportunidades.</p>
                  <p>Instagram · Facebook · WhatsApp · YouTube</p>
                  <a class="footer-dashboard" href="#dashboard" data-route="dashboard" aria-label="Acessar dashboard">Dashboard</a>
                </div>
                <div><h4>Institucional</h4><div class="footer-links"><a>Sobre nós</a><a>Trabalhe conosco</a><a>Política de privacidade</a><a>Termos de uso</a></div></div>
                <div><h4>Imóveis</h4><div class="footer-links"><a>Comprar</a><a>Alugar</a><a>Lançamentos</a><a>Anuncie seu imóvel</a></div></div>
                <div><h4>Ajuda</h4><div class="footer-links"><a>Perguntas frequentes</a><a>Como funciona</a><a>Dicas imobiliárias</a><a>Fale conosco</a></div></div>
                <div><h4>Contato</h4><p>☎ (71) 99999-0000<br>✉ contato@suaimobiliaria.com.br<br>Rua das Acácias, 129<br>Caminho das Árvores, Salvador/BA</p></div>
              </div>
            </footer>
          `,
        };
      },
    };
  }

  function FloatingWhatsComponent() {
    return {
      next() {
        return {
          done: false,
          value: `<button class="float-whats" type="button" data-route="contato" aria-label="WhatsApp">☎</button>`,
        };
      },
    };
  }

  class System {
    constructor(root = "#app") {
      this.root = typeof root === "string" ? document.querySelector(root) : root;

      if (!this.root) {
        this.root = document.createElement("div");
        this.root.id = "app";
        this.root.className = "app-shell";
        document.body.appendChild(this.root);
      }

      this.root.classList.add("app-shell");
      this.route = this.parseRoute();
      this.state = {
        route: this.route,
        selectedPropertyId: properties[0].id,
        favorites: new Set(),
        authenticated: false,
      };
      if (this.route === "dashboard" && !this.state.authenticated) {
        this.route = "login";
        this.state.route = "login";
      }
      this.components = new Map();
      this.actions = this.createActions();

      injectStyle();
      this.installComponents();
      this.bindEvents();
      this.render();
    }

    parseRoute() {
      const hash = window.location.hash.replace("#", "").trim();
      return ROUTES.includes(hash) ? hash : "home";
    }

    installComponents() {
      const routeTools = {
        getRoute: () => this.route,
        isVisible: (route) => this.visible(route),
        goTo: (route, options) => this.setRoute(route, options),
      };

      const propertyTools = {
        isFavorite: (propertyId) => this.state.favorites.has(propertyId),
        toggleFavorite: this.actions.toggleFavorite,
        favoriteIcon: (propertyId) => favoriteIcon((id) => this.state.favorites.has(id), propertyId),
        getSelectedProperty: this.actions.getSelectedProperty,
      };
      const authTools = {
        login: this.actions.login,
      };

      this.add("topbar", TopbarComponent, routeTools);
      this.add("hero", HeroComponent, routeTools);
      this.add("stats", StatsComponent);
      this.add("featured", FeaturedComponent, propertyTools);
      this.add("announce", AnnounceComponent, routeTools);
      this.add("listing", ListingComponent, propertyTools);
      this.add("detail", DetailComponent, propertyTools);
      this.add("brokers", BrokersComponent);
      this.add("dashboard", DashboardComponentStateful, propertyTools);
      this.add("login", LoginComponent, authTools);
      this.add("footer", FooterComponent);
      this.add("floating-whats", FloatingWhatsComponent);
    }

    add(id, createComponent, props = {}) {
      const component = createComponent({ id, props });
      if (!component || typeof component.next !== "function") {
        throw new Error(`Component "${id}" must return an iterator-like object with next(message).`);
      }
      this.components.set(id, component);
      return component;
    }

    createActions() {
      return {
        getSelectedProperty: () =>
          properties.find((property) => property.id === this.state.selectedPropertyId) ?? properties[0],
        toggleFavorite: (propertyId) => {
          if (!propertyId) return;
          if (this.state.favorites.has(propertyId)) this.state.favorites.delete(propertyId);
          else this.state.favorites.add(propertyId);
        },
        login: (email, password) => {
          const ok = email === "admin@suaimobiliaria.com.br" && password === "admin123";
          if (ok) {
            this.state.authenticated = true;
            this.setRoute("dashboard");
          }
          return ok;
        },
      };
    }

    setRoute(route, options = {}) {
      if (!ROUTES.includes(route)) route = "home";
      if (route === "dashboard" && !this.state.authenticated) route = "login";

      this.route = route;
      this.state.route = route;

      if (options.propertyId) this.state.selectedPropertyId = options.propertyId;
      if (options.syncHash !== false) window.history.pushState({ route }, "", `#${route}`);

      this.render();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    visible(route) {
      if (Array.isArray(route)) return route.includes(this.route);
      return this.route === route;
    }

    panel(route, html) {
      return `<div ${routeAttrs((value) => this.visible(value), route)}>${html}</div>`;
    }

    renderComponent(id) {
      const component = this.components.get(id);
      if (!component) return "";
      const result = component.next();
      if (result?.done) {
        this.components.delete(id);
        return "";
      }
      return result?.value ?? "";
    }

    dispatchComponentMessage(target, event) {
      const component = this.components.get(target.dataset.cid);
      if (!component) return;

      let email = "";
      let password = "";
      if (target.tagName === "FORM") {
        const data = new FormData(target);
        email = data.get("email") || "";
        password = data.get("password") || "";
      }

      component.next({
        type: target.dataset.message,
        name: target.dataset.name || target.name,
        propertyId: target.dataset.propertyId,
        value: target.dataset.value ?? target.value,
        checked: target.checked,
        email,
        password,
        target,
        event,
      });
      this.render();
    }

    render() {
      this.root.innerHTML = `
        ${this.renderComponent("topbar")}
        <main>
          ${this.panel("home", `
            ${this.renderComponent("hero")}
            ${this.renderComponent("stats")}
            ${this.renderComponent("featured")}
            ${this.renderComponent("announce")}
            ${this.renderComponent("brokers")}
          `)}

          ${this.panel("destaques", `
            ${this.renderComponent("featured")}
          `)}

          ${this.panel("comprar", `
            ${this.renderComponent("listing")}
          `)}

          ${this.panel("imovel", `
            ${this.renderComponent("detail")}
            ${this.renderComponent("brokers")}
          `)}

          ${this.panel("anuncie", `
            ${this.renderComponent("announce")}
          `)}

          ${this.panel("login", `
            ${this.renderComponent("login")}
          `)}

          ${this.panel("dashboard", `
            ${this.renderComponent("dashboard")}
          `)}

          ${this.panel("contato", `
            <section class="section detail-section">
              <div class="container">
                <div class="section-title">
                  <div>
                    <span class="eyebrow">Contato</span>
                    <h2>Fale com a imobiliária</h2>
                    <p>Use esta rota para concentrar atendimento, WhatsApp, ligação, agendamento e envio de interesse.</p>
                  </div>
                </div>
                <div class="phone-strip">
                  <article class="phone-card"><h3>WhatsApp</h3><p class="location">☎ (71) 99999-0000</p><button class="gold-btn" type="button">Iniciar conversa</button></article>
                  <article class="phone-card"><h3>E-mail</h3><p class="location">✉ contato@suaimobiliaria.com.br</p><button class="ghost-btn" type="button">Enviar mensagem</button></article>
                  <article class="phone-card"><h3>Endereço</h3><p class="location">Rua das Acácias, 129<br>Caminho das Árvores, Salvador/BA</p><button class="ghost-btn" type="button">Ver mapa</button></article>
                </div>
              </div>
            </section>
          `)}
        </main>
        ${this.renderComponent("footer")}
        ${this.renderComponent("floating-whats")}
      `;
    }

    bindEvents() {
      this.root.addEventListener("click", (event) => {
        const routeTarget = event.target.closest("[data-route]");
        if (routeTarget) {
          event.preventDefault();
          this.setRoute(routeTarget.dataset.route, {
            propertyId: routeTarget.dataset.propertyId || undefined,
          });
          return;
        }

        const actionTarget = event.target.closest("[data-cid][data-message]");
        if (actionTarget) {
          if (actionTarget.tagName === "FORM") return;
          this.dispatchComponentMessage(actionTarget, event);
        }
      });

      this.root.addEventListener("change", (event) => {
        const actionTarget = event.target.closest("[data-cid][data-message]");
        if (actionTarget) this.dispatchComponentMessage(actionTarget, event);
      });

      this.root.addEventListener("submit", (event) => {
        const actionTarget = event.target.closest("form[data-cid][data-message]");
        if (!actionTarget) return;
        event.preventDefault();
        this.dispatchComponentMessage(actionTarget, event);
      });

      window.addEventListener("popstate", () => {
        this.route = this.parseRoute();
        this.state.route = this.route;
        this.render();
      });

      window.addEventListener("hashchange", () => {
        const route = this.parseRoute();
        if (route !== this.route) this.setRoute(route, { syncHash: false });
      });
    }
  }

  window.SuaImobiliariaSystem = System;

  document.addEventListener("DOMContentLoaded", () => {
    new System("#app");
  });
})();
