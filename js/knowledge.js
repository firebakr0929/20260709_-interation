window.App = window.App || {};

App.Knowledge = {
  rafId: null,
  phase: 0,

  init() {
    this.canvas = document.getElementById('knowledge-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.pBar = document.getElementById('pWaveBar');
    this.sBar = document.getElementById('sWaveBar');
    this.resize();
    this.startAnimation();
  },

  resize() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.canvas.width = rect.width || 600;
    this.canvas.height = 220;
  },

  startAnimation() {
    const loop = () => {
      this.phase += 0.02;
      const p = (Math.sin(this.phase) + 1) / 2;
      const s = (Math.sin(this.phase * 0.7) + 1) / 2;

      if (this.pBar) this.pBar.style.width = `${p * 100}%`;
      if (this.sBar) this.sBar.style.width = `${s * 100}%`;

      this.drawCanvas(p, s);
      this.rafId = requestAnimationFrame(loop);
    };
    loop();
  },

  drawCanvas(p, s) {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    ctx.clearRect(0, 0, w, h);

    for (let i = 0; i < 4; i++) {
      const y = h - 40 + i * 12;
      ctx.fillStyle = `rgba(255,255,255,${0.03 + i * 0.02})`;
      ctx.fillRect(0, y, w, 8);
    }

    ctx.beginPath();
    ctx.strokeStyle = App.P_WAVE_COLOR;
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.7;
    const offsetP = this.phase * 3;
    for (let x = 0; x < w; x += 2) {
      const y = h / 2 - 40 + Math.sin((x / w) * Math.PI * 12 + offsetP) * 15 * p;
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle = App.S_WAVE_COLOR;
    ctx.lineWidth = 2.5;
    ctx.globalAlpha = 0.7;
    const offsetS = this.phase * 2.1;
    for (let x = 0; x < w; x += 2) {
      const y = h / 2 + 40 + Math.sin((x / w) * Math.PI * 8 + offsetS) * 22 * s;
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();

    ctx.globalAlpha = 1;

    ctx.fillStyle = App.P_WAVE_COLOR;
    ctx.font = '11px sans-serif';
    ctx.fillText('P-Wave  ~6.0 km/s', 10, h / 2 - 60);

    ctx.fillStyle = App.S_WAVE_COLOR;
    ctx.fillText('S-Wave  ~3.5 km/s', 10, h / 2 + 75);
  },

  destroy() {
    if (this.rafId) cancelAnimationFrame(this.rafId);
  }
};
