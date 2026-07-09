window.App = window.App || {};

App.EEWPrinciple = {
  rafId: null,
  phase: 0,

  init() {
    this.canvas = document.getElementById('principle-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.resize();
    this.startAnimation();
  },

  resize() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.canvas.width = rect.width || 600;
    this.canvas.height = 280;
    this.earthquake = { x: this.canvas.width * 0.25, y: this.canvas.height * 0.65 };
  },

  startAnimation() {
    const loop = () => {
      this.phase += 0.02;
      this.drawCanvas();
      this.rafId = requestAnimationFrame(loop);
    };
    loop();
  },

  drawCanvas() {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;
    const eq = this.earthquake;

    ctx.clearRect(0, 0, w, h);

    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 40) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
    for (let y = 0; y < h; y += 40) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }

    const pRadius = this.phase * 15 % 300;
    this.drawRing(ctx, eq.x, eq.y, pRadius, App.P_WAVE_COLOR, 0.5);

    const sPhase = this.phase * 0.7;
    const sRadius = sPhase * 15 % 300;
    this.drawRing(ctx, eq.x, eq.y, sRadius, App.S_WAVE_COLOR, 0.5);

    const blindRadius = 25;
    ctx.beginPath();
    ctx.arc(eq.x, eq.y, blindRadius, 0, Math.PI * 2);
    ctx.fillStyle = App.BLIND_COLOR;
    ctx.fill();
    ctx.strokeStyle = App.S_WAVE_COLOR;
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.stroke();
    ctx.setLineDash([]);

    const warnRadius = Math.min(this.phase * 20 % 350, 300);
    ctx.beginPath();
    ctx.arc(w * 0.85, 30, warnRadius, 0, Math.PI * 2);
    ctx.fillStyle = App.WARN_COLOR;
    ctx.fill();
    ctx.strokeStyle = App.P_WAVE_COLOR;
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.beginPath();
    ctx.arc(eq.x, eq.y, 6, 0, Math.PI * 2);
    ctx.fillStyle = App.EPI_COLOR;
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();

    const glow = ctx.createRadialGradient(eq.x, eq.y, 0, eq.x, eq.y, 20);
    glow.addColorStop(0, 'rgba(255,107,53,0.4)');
    glow.addColorStop(1, 'rgba(255,107,53,0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(eq.x, eq.y, 20, 0, Math.PI * 2);
    ctx.fill();

    const cities = [
      { x: w * 0.75, y: h * 0.2, name: 'Taipei', warned: warnRadius > 60 },
      { x: w * 0.65, y: h * 0.45, name: 'Taichung', warned: warnRadius > 80 },
      { x: w * 0.55, y: h * 0.75, name: 'Kaohsiung', warned: warnRadius > 120 },
    ];
    cities.forEach(c => {
      ctx.beginPath();
      ctx.arc(c.x, c.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = c.warned ? App.WARN_COLOR : App.CITY_COLOR;
      ctx.fill();
      ctx.fillStyle = c.warned ? App.P_WAVE_COLOR : App.CITY_COLOR;
      ctx.font = '10px sans-serif';
      ctx.fillText(c.name, c.x + 8, c.y + 4);
      if (c.warned) {
        ctx.fillStyle = 'rgba(0,212,255,0.3)';
        ctx.font = '9px sans-serif';
        ctx.fillText('\u26A0 WARNING', c.x + 8, c.y + 16);
      }
    });

    ctx.fillStyle = App.EPI_COLOR;
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText('Epicenter', eq.x - 30, eq.y - 18);

    ctx.fillStyle = App.S_WAVE_COLOR;
    ctx.font = '10px sans-serif';
    ctx.fillText('Blind Zone', eq.x - 24, eq.y - blindRadius - 8);

    ctx.fillStyle = App.P_WAVE_COLOR;
    ctx.font = '10px sans-serif';
    ctx.fillText('P-wave', eq.x + pRadius + 8, eq.y - 6);

    ctx.fillStyle = App.S_WAVE_COLOR;
    ctx.font = '10px sans-serif';
    ctx.fillText('S-wave', eq.x + sRadius + 8, eq.y + 6);

    ctx.fillStyle = App.P_WAVE_COLOR;
    ctx.font = '10px sans-serif';
    ctx.fillText('Warning Broadcast', w * 0.75, 20);

    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.font = '9px sans-serif';
    ctx.fillText('P-wave detected -> system locates quake -> warning sent -> arrives before S-wave',
      w * 0.1, h - 8);
  },

  drawRing(ctx, x, y, radius, color, alpha) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.globalAlpha = alpha;
    ctx.stroke();
    ctx.globalAlpha = 1;

    if (radius > 20) {
      ctx.beginPath();
      ctx.arc(x, y, radius - 10, 0, Math.PI * 2);
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.globalAlpha = alpha * 0.3;
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
  },

  destroy() {
    if (this.rafId) cancelAnimationFrame(this.rafId);
  }
};
