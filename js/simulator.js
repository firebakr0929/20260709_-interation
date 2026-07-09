window.App = window.App || {};

App.Simulator = {
  rafId: null,
  running: false,
  time: 0,
  speed: 1,
  magnitude: 7.2,
  delay: 9,
  originTime: 0,
  epicenter: { lat: 23.9872, lon: 121.6048 },
  cities: [],
  pWaveReached: [],
  sWaveReached: [],
  stations: [],
  warningSent: false,
  warningReceivedTime: 0,
  detectionTime: 0,

  init() {
    this.canvas = document.getElementById('sim-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.resize();
    this.setupControls();
    this.setupCanvasEvents();
    this.setCities();
    this.generateStations();
    this.drawCanvas();
    this.updateCityList();
    this.updateStatus();
  },

  resize() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.canvas.width = rect.width || 400;
    this.canvas.height = Math.min(550, rect.width * 0.75);
  },

  setupControls() {
    const epicenter = document.getElementById('simEpicenter');
    const magnitude = document.getElementById('simMagnitude');
    const delay = document.getElementById('simDelay');
    const speed = document.getElementById('simSpeed');

    if (epicenter) {
      epicenter.addEventListener('change', () => {
        const map = {
          hualien: { lat: 23.9872, lon: 121.6048 },
          chiayi: { lat: 23.4865, lon: 120.4527 },
          yilan: { lat: 24.7570, lon: 121.7534 },
          tainan: { lat: 22.9997, lon: 120.2270 },
        };
        const pos = map[epicenter.value] || map.hualien;
        this.epicenter = pos;
        this.reset();
      });
    }

    if (magnitude) {
      magnitude.addEventListener('input', () => {
        this.magnitude = parseFloat(magnitude.value);
        document.getElementById('magDisplay').textContent = this.magnitude.toFixed(1);
        this.reset();
      });
    }

    if (delay) {
      delay.addEventListener('input', () => {
        this.delay = parseFloat(delay.value);
        document.getElementById('delayDisplay').textContent = this.delay.toFixed(1) + 's';
      });
    }

    if (speed) {
      speed.addEventListener('input', () => {
        this.speed = parseFloat(speed.value);
        document.getElementById('speedDisplay').textContent = this.speed.toFixed(1) + 'x';
      });
    }

    const trigger = document.getElementById('btnTriggerEq');
    if (trigger) trigger.addEventListener('click', () => this.start());

    const reset = document.getElementById('btnResetEq');
    if (reset) reset.addEventListener('click', () => this.reset());
  },

  setupCanvasEvents() {
    let dragging = false;
    this.canvas.addEventListener('mousedown', () => { if (!this.running) dragging = true; });
    this.canvas.addEventListener('mousemove', App.throttle((e) => {
      if (!dragging || this.running) return;
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const ppd = 2.2 * Math.min(this.canvas.width, this.canvas.height) / 5;
      this.epicenter.lat = 23.8 - (y - this.canvas.height / 2) / ppd;
      this.epicenter.lon = 121.0 + (x - this.canvas.width / 2) / (ppd * Math.cos(23.8 * Math.PI / 180));
      this.reset();
    }, 30));
    document.addEventListener('mouseup', () => { dragging = false; });
  },

  setCities() {
    this.cities = App.TAIWAN_CITIES.map(c => ({ ...c }));
    this.updateCityDistances();
  },

  updateCityDistances() {
    this.cities.forEach(c => {
      c.distance = App.haversine(c.lat, c.lon, this.epicenter.lat, this.epicenter.lon);
      c.pArrival = c.distance / App.P_WAVE_SPEED;
      c.sArrival = c.distance / App.S_WAVE_SPEED;
      c.pga = App.calculatePGA(this.magnitude, c.distance);
    });
  },

  generateStations() {
    this.stations = [];
    for (let i = 0; i < 20; i++) {
      this.stations.push({
        lat: this.epicenter.lat + (Math.random() - 0.5) * 0.5,
        lon: this.epicenter.lon + (Math.random() - 0.5) * 0.5,
        triggered: false,
      });
    }
  },

  start() {
    if (this.running) return;
    this.running = true;
    this.originTime = performance.now() / 1000;
    this.time = 0;
    this.warningSent = false;
    this.warningReceivedTime = 0;
    this.detectionTime = 0;
    this.pWaveReached = [];
    this.sWaveReached = [];
    this.stations.forEach(s => s.triggered = false);
    this.updateCityDistances();

    document.getElementById('btnTriggerEq').textContent = '\u23F8 Pause';

    const loop = () => {
      const dt = (performance.now() / 1000 - this.originTime) * this.speed;
      this.time = dt;
      this.update(dt);
      this.drawCanvas();
      this.rafId = requestAnimationFrame(loop);
    };
    loop();
  },

  stop() {
    this.running = false;
    if (this.rafId) cancelAnimationFrame(this.rafId);
    document.getElementById('btnTriggerEq').textContent = '\u25B6 Trigger';
  },

  reset() {
    this.stop();
    this.time = 0;
    this.warningSent = false;
    this.warningReceivedTime = 0;
    this.detectionTime = 0;
    this.pWaveReached = [];
    this.sWaveReached = [];
    this.stations.forEach(s => s.triggered = false);
    this.updateCityDistances();
    this.drawCanvas();
    this.updateCityList();
    this.updateStatus();
  },

  update(dt) {
    const triggered = this.stations.filter(s => {
      const d = App.haversine(s.lat, s.lon, this.epicenter.lat, this.epicenter.lon);
      if (d / App.P_WAVE_SPEED < dt && !s.triggered) s.triggered = true;
      return s.triggered;
    }).length;

    if (triggered >= 3 && !this.warningSent) {
      this.detectionTime = dt;
      this.warningSent = true;
      this.warningReceivedTime = dt + this.delay;
    }

    this.cities.forEach(c => {
      if (dt >= c.pArrival && this.pWaveReached.indexOf(c.name) === -1) this.pWaveReached.push(c.name);
      if (dt >= c.sArrival && this.sWaveReached.indexOf(c.name) === -1) this.sWaveReached.push(c.name);

      const hasWarning = this.warningReceivedTime > 0 && dt >= this.warningReceivedTime;
      const inBlind = c.sArrival <= this.warningReceivedTime;

      if (dt >= c.sArrival || (inBlind && hasWarning)) {
        c.status = 'shake';
        c.countdown = 0;
      } else if (hasWarning && dt >= c.pArrival) {
        c.status = 'alert';
        c.countdown = c.sArrival - dt;
      } else if (hasWarning) {
        c.status = 'detect';
        c.countdown = c.sArrival - dt;
      } else if (dt >= c.pArrival) {
        c.status = c.sArrival - dt < 5 ? 'alert' : 'detect';
        c.countdown = c.sArrival - dt;
      } else {
        c.status = 'safe';
        c.countdown = c.sArrival;
      }
    });

    this.updateStatus();
    this.updateCityList();
  },

  updateStatus() {
    const indicator = document.getElementById('simStatusIndicator');
    const timer = document.getElementById('simTimer');
    const localBox = document.getElementById('boxLocalEew');
    const regionalBox = document.getElementById('boxRegionalEew');

    if (indicator) {
      const hasShake = this.cities.some(c => c.status === 'shake');
      const hasAlert = this.cities.some(c => c.status === 'alert');
      const dot = indicator.querySelector('.indicator-dot');
      const txt = indicator.querySelector('.indicator-text');
      if (hasShake) { dot.className = 'indicator-dot shake'; txt.textContent = 'Shaking!'; }
      else if (hasAlert) { dot.className = 'indicator-dot alert'; txt.textContent = 'Warning Active'; }
      else if (this.warningSent) { dot.className = 'indicator-dot alert'; txt.textContent = 'Detected'; }
      else { dot.className = 'indicator-dot safe'; txt.textContent = 'Monitoring (Safe)'; }
    }

    if (timer) timer.textContent = this.time.toFixed(2);

    if (localBox) {
      const val = localBox.querySelector('.eew-value');
      const inBlind = this.cities.some(c => c.distance < 30);
      if (this.warningSent && inBlind) {
        val.textContent = 'Blind';
        localBox.className = 'eew-box';
      } else if (this.warningSent) {
        const remaining = Math.max(0, Math.min(...this.cities.map(c => c.sArrival - this.time)));
        val.textContent = `${remaining.toFixed(1)}s`;
        localBox.className = 'eew-box active-local';
      } else {
        val.textContent = 'Waiting...';
      }
    }

    if (regionalBox) {
      const val = regionalBox.querySelector('.eew-value');
      if (this.warningSent) {
        const remaining = Math.max(0, Math.min(...this.cities.map(c => c.sArrival - this.time)));
        val.textContent = `${remaining.toFixed(1)}s`;
        regionalBox.className = 'eew-box active';
      } else {
        val.textContent = 'Not triggered';
      }
    }
  },

  updateCityList() {
    const container = document.getElementById('simCitiesList');
    if (!container) return;
    const sorted = [...this.cities].sort((a, b) => a.sArrival - b.sArrival);
    container.innerHTML = sorted.map(c => {
      const labels = { safe: 'Safe', detect: 'P-Wave', alert: 'WARN', shake: 'SHAKE' };
      const remaining = c.status === 'shake' ? 'NOW' : c.countdown > 0 ? `T-${c.countdown.toFixed(1)}s` : '';
      return `<div class="city-row">
        <span class="city-name">${c.name}</span>
        <span class="city-status ${c.status}">${labels[c.status]}</span>
        <span class="city-countdown">${remaining}</span>
        <span class="city-pga">${c.pga.toFixed(2)} m/s<sup>2</sup></span>
      </div>`;
    }).join('');
  },

  drawCanvas() {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = App.CANVAS_BG;
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    const shape = [
      [121.0,25.3],[121.5,25.1],[121.9,24.9],[121.85,24.5],
      [121.6,24.1],[121.8,23.9],[121.6,23.5],[121.3,23.2],
      [121.2,22.8],[120.9,22.5],[120.6,22.6],[120.3,22.8],
      [120.1,23.0],[120.0,23.3],[120.2,23.7],[120.4,24.0],
      [120.3,24.3],[120.4,24.6],[120.5,24.9],[120.9,25.1],
      [121.0,25.3],
    ];
    shape.forEach((p, i) => {
      const pp = App.backProjectLonLat(this.canvas, p[0], p[1], 121.0, 23.8);
      i === 0 ? ctx.moveTo(pp.x, pp.y) : ctx.lineTo(pp.x, pp.y);
    });
    ctx.closePath();
    ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.02)';
    ctx.fill();

    this.stations.forEach(s => {
      const pp = App.backProjectLonLat(this.canvas, s.lon, s.lat, 121.0, 23.8);
      ctx.beginPath();
      ctx.arc(pp.x, pp.y, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = s.triggered ? '#22c55e' : 'rgba(255,255,255,0.15)';
      ctx.fill();
    });

    this.cities.forEach(c => {
      const pp = App.backProjectLonLat(this.canvas, c.lon, c.lat, 121.0, 23.8);
      const colors = { safe: 'rgba(255,255,255,0.4)', detect: App.P_WAVE_COLOR, alert: '#f59e0b', shake: App.S_WAVE_COLOR };
      ctx.beginPath();
      ctx.arc(pp.x, pp.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = colors[c.status] || 'rgba(255,255,255,0.4)';
      ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.6)';
      ctx.font = '8px sans-serif';
      ctx.fillText(c.name, pp.x + 6, pp.y + 3);
    });

    const ep = App.backProjectLonLat(this.canvas, this.epicenter.lon, this.epicenter.lat, 121.0, 23.8);
    ctx.beginPath();
    ctx.arc(ep.x, ep.y, 5, 0, Math.PI * 2);
    ctx.fillStyle = App.EPI_COLOR;
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    if (this.time > 0) {
      const pRad = this.time * App.P_WAVE_SPEED * 0.6;
      ctx.beginPath();
      ctx.arc(ep.x, ep.y, Math.min(pRad, 200), 0, Math.PI * 2);
      ctx.strokeStyle = App.P_WAVE_COLOR;
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.globalAlpha = 0.4;
      ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.setLineDash([]);

      const sRad = this.time * App.S_WAVE_SPEED * 0.6;
      ctx.beginPath();
      ctx.arc(ep.x, ep.y, Math.min(sRad, 200), 0, Math.PI * 2);
      ctx.strokeStyle = App.S_WAVE_COLOR;
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.globalAlpha = 0.4;
      ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.setLineDash([]);
    }

    ctx.beginPath();
    ctx.arc(ep.x, ep.y, 18, 0, Math.PI * 2);
    ctx.fillStyle = App.BLIND_COLOR;
    ctx.fill();
    ctx.fillStyle = App.S_WAVE_COLOR;
    ctx.font = '7px sans-serif';
    ctx.fillText('Blind Zone', ep.x - 14, ep.y - 22);

    if (this.warningSent) {
      ctx.beginPath();
      ctx.arc(ep.x, ep.y, 120, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,212,255,0.03)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(0,212,255,0.15)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    ctx.font = '9px sans-serif';
    const legend = [['Epicenter', App.EPI_COLOR], ['P-wave', App.P_WAVE_COLOR], ['S-wave', App.S_WAVE_COLOR], ['Station', '#22c55e']];
    legend.forEach((l, i) => {
      const y = 12 + i * 14;
      ctx.fillStyle = l[1];
      ctx.beginPath(); ctx.arc(14, y, 3, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.25)';
      ctx.fillText(l[0], 22, y + 4);
    });

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 14px monospace';
    ctx.fillText(`T + ${this.time.toFixed(1)}s`, w - 105, 20);

    if (!this.running && this.time === 0) {
      ctx.fillStyle = 'rgba(255,255,255,0.15)';
      ctx.font = '11px sans-serif';
      ctx.fillText('Drag on map to set epicenter', w / 2 - 90, h - 12);
    }
  },

  destroy() {
    this.stop();
  }
};
