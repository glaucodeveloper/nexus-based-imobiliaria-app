const StatsComponent = () => ({
  next: () => ({
    done: false,
    value: /*html*/`
      <div class="stats-strip">
        <div class="container stats-grid stats-grid--proposal">
          <div class="stat-card stat-card--proposal">
            <span class="icon-box">20</span>
            <div><strong>+20 anos</strong><span>de experiencia</span></div>
          </div>
          <div class="stat-card stat-card--proposal">
            <span class="icon-box">CR</span>
            <div><strong>CRECI ativo</strong><span>operacao regular</span></div>
          </div>
          <div class="stat-card stat-card--proposal">
            <span class="icon-box">At</span>
            <div><strong>Atendimento</strong><span>especializado</span></div>
          </div>
          <div class="stat-card stat-card--proposal">
            <span class="icon-box">Ok</span>
            <div><strong>Seguranca</strong><span>em todas as negociacoes</span></div>
          </div>
        </div>
      </div>
    `,
  }),
});
