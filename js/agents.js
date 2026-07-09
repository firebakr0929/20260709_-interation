window.App = window.App || {};

App.Agents = {
  rafId: null,
  phase: 0,
  stepIndex: -1,
  reportGenerated: false,
  nodes: [],
  activeEdges: [],

  init() {
    this.canvas = document.getElementById('agents-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.consoleEl = document.getElementById('agentConsoleLogs');
    this.reportBody = document.getElementById('reportBody');
    this.reportMeta = document.getElementById('reportMeta');
    this.resize();
    this.setupNodes();
    this.setupButtons();
    this.startAnimation();
  },

  resize() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.canvas.width = rect.width || 500;
    this.canvas.height = 200;
  },

  setupNodes() {
    const w = this.canvas.width;
    const h = this.canvas.height;
    const labels = ['Sensor', 'Ingestion', 'EEW', 'ShakeMap', 'Advisory', 'LLM'];
    this.nodes = labels.map((label, i) => ({
      label,
      x: w * (0.08 + i * 0.16),
      y: h * 0.5,
      active: false,
      done: false,
    }));
  },

  setupButtons() {
    const runBtn = document.getElementById('btnTriggerAgents');
    if (runBtn) runBtn.addEventListener('click', () => this.runPipeline());

    const clearBtn = document.getElementById('btnClearLog');
    if (clearBtn) clearBtn.addEventListener('click', () => {
      if (this.consoleEl) this.consoleEl.innerHTML = '<div class="log-line system">[SYSTEM] Log cleared</div>';
    });
  },

  runPipeline() {
    this.resetPipeline();
    this.stepIndex = 0;
    this.reportGenerated = false;
    this.nextStep();
  },

  nextStep() {
    if (this.stepIndex >= App.AGENTS_STEPS.length) {
      this.generateReport();
      return;
    }

    const step = App.AGENTS_STEPS[this.stepIndex];
    const node = this.nodes[this.stepIndex];
    if (node) node.active = true;

    this.addLogs(step.lines, step.step.toLowerCase());

    this.activeEdges = [];
    for (let i = 0; i < this.stepIndex; i++) {
      this.activeEdges.push({ from: i, to: i + 1 });
    }

    setTimeout(() => {
      if (node) { node.active = false; node.done = true; }
      this.stepIndex++;
      this.nextStep();
    }, 800 + Math.random() * 400);
  },

  addLogs(lines, cls) {
    if (!this.consoleEl) return;
    lines.forEach((line, i) => {
      setTimeout(() => {
        const div = document.createElement('div');
        div.className = `log-line ${cls}`;
        div.textContent = line;
        this.consoleEl.appendChild(div);
        this.consoleEl.scrollTop = this.consoleEl.scrollHeight;
      }, i * 250);
    });
  },

  generateReport() {
    if (this.reportGenerated) return;
    this.reportGenerated = true;

    setTimeout(() => {
      if (!this.reportBody || !this.reportMeta) return;
      const r = App.AGENTS_STEPS.find(s => s.step === 'Report');
      if (!r) return;
      this.reportMeta.textContent = `Earthquake Event Report - ${new Date().toLocaleDateString()}`;
      this.reportBody.innerHTML = r.lines.slice(1).map(l => {
        if (l.startsWith('---')) return '';
        if (l.includes(':')) {
          const [k, ...v] = l.split(': ');
          return `<div class="report-item"><strong>${k.replace('|', '').trim()}:</strong> ${v.join(': ')}</div>`;
        }
        return `<p>${l}</p>`;
      }).filter(Boolean).join('');
    }, 500);
  },

  resetPipeline() {
    this.stepIndex = -1;
    this.reportGenerated = false;
    this.activeEdges = [];
    this.nodes.forEach(n => { n.active = false; n.done = false; });
    if (this.consoleEl) this.consoleEl.innerHTML = '<div class="log-line system">[SYSTEM] Ready</div>';
    if (this.reportMeta) this.reportMeta.textContent = 'Awaiting simulation...';
    if (this.reportBody) this.reportBody.innerHTML = '<p style="color:var(--muted);font-size:0.85rem;">Press "Start Simulation" to see the multi-agent EEW workflow.</p>';
  },

  startAnimation() {
    const loop = () => {
      this.phase += 0.03;
      this.drawCanvas();
      this.rafId = requestAnimationFrame(loop);
    };
    loop();
  },

  drawCanvas() {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    ctx.clearRect(0, 0, w, h);

    this.nodes.forEach((node, i) => {
      if (i < this.nodes.length - 1) {
        const next = this.nodes[i + 1];
        const active = this.activeEdges.some(e => e.from === i);
        ctx.beginPath();
        ctx.moveTo(node.x + 22, node.y);
        ctx.lineTo(next.x - 22, next.y);
        ctx.strokeStyle = active ? App.P_WAVE_COLOR : 'rgba(255,255,255,0.08)';
        ctx.lineWidth = active ? 2 : 1;
        ctx.stroke();

        if (active) {
          const t = (Math.sin(this.phase * 2 + i) + 1) / 2;
          const fx = node.x + 22 + t * (next.x - node.x - 44);
          ctx.beginPath();
          ctx.arc(fx, node.y, 3, 0, Math.PI * 2);
          ctx.fillStyle = App.P_WAVE_COLOR;
          ctx.fill();
        }
      }
    });

    this.nodes.forEach((node, i) => {
      const hue = i * 40;
      ctx.beginPath();
      ctx.arc(node.x, node.y, 20, 0, Math.PI * 2);

      if (node.active) {
        ctx.fillStyle = `hsla(${hue}, 80%, 60%, 0.3)`;
        ctx.fill();
        ctx.strokeStyle = `hsl(${hue}, 80%, 60%)`;
        ctx.lineWidth = 2.5;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(node.x, node.y, 20 + Math.sin(this.phase * 3) * 4, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(${hue}, 80%, 60%, 0.2)`;
        ctx.lineWidth = 2;
        ctx.stroke();
      } else if (node.done) {
        ctx.fillStyle = `hsla(${hue}, 60%, 40%, 0.2)`;
        ctx.fill();
        ctx.strokeStyle = `hsl(${hue}, 60%, 50%)`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      } else {
        ctx.fillStyle = 'rgba(255,255,255,0.03)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,0.1)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      ctx.fillStyle = node.active || node.done ? '#fff' : 'rgba(255,255,255,0.4)';
      ctx.font = 'bold 9px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(node.label, node.x, node.y + 3.5);
      ctx.textAlign = 'start';
    });
  },

  destroy() {
    if (this.rafId) cancelAnimationFrame(this.rafId);
  }
};
