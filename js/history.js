window.App = window.App || {};

App.History = {
  init() {
    this.render();
  },

  render() {
    const container = document.getElementById('historyTimeline');
    if (!container) return;

    container.innerHTML = App.HISTORICAL_EARTHQUAKES.map(eq => {
      const isNew = eq.id >= 6;
      return `
        <div class="history-card" data-id="${eq.id}">
          <div class="history-card-header">
            <div class="history-magnitude">M ${eq.magnitude.toFixed(1)}</div>
            <div class="history-info">
              <div class="history-title">${eq.name}</div>
              <div class="history-meta">${eq.date} · Depth ${eq.depth} km · PGA ${eq.pga} m/s²${isNew ? ' <span style="color:var(--success);font-size:0.7rem;">LATEST</span>' : ''}</div>
            </div>
            <div class="history-expand">▼ Expand</div>
          </div>
          <div class="history-detail">
            <p>${eq.description}</p>
            <div class="history-detail-grid">
              <div class="history-stat"><span class="history-stat-num">${eq.casualties.toLocaleString()}</span><span class="history-stat-label">Casualties</span></div>
              <div class="history-stat"><span class="history-stat-num">${eq.injured.toLocaleString()}</span><span class="history-stat-label">Injured</span></div>
              <div class="history-stat"><span class="history-stat-num">${eq.buildings.toLocaleString()}</span><span class="history-stat-label">Buildings Affected</span></div>
              <div class="history-stat"><span class="history-stat-num">${eq.depth} km</span><span class="history-stat-label">Depth</span></div>
              <div class="history-stat"><span class="history-stat-num">${eq.pga} m/s²</span><span class="history-stat-label">Peak PGA</span></div>
              <div class="history-stat"><span class="history-stat-num">${eq.lat.toFixed(2)}°, ${eq.lon.toFixed(2)}°</span><span class="history-stat-label">Epicenter</span></div>
            </div>
          </div>
        </div>
      `;
    }).join('');

    container.querySelectorAll('.history-card').forEach(card => {
      card.addEventListener('click', () => {
        const detail = card.querySelector('.history-detail');
        const expand = card.querySelector('.history-expand');
        const open = detail.classList.toggle('open');
        expand.textContent = open ? '▲ Collapse' : '▼ Expand';
      });
    });
  }
};
