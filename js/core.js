window.App = window.App || {};

App.Core = {
  currentTab: 'home',
  runningModules: {},

  init() {
    this.setupNavigation();
    this.setupThemeToggle();
    this.switchTab('home');
  },

  setupNavigation() {
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        if (tab) this.switchTab(tab);
      });
    });

    document.querySelectorAll('.entrance-card').forEach(card => {
      card.addEventListener('click', () => {
        const tab = card.dataset.tabTarget;
        if (tab) this.switchTab(tab);
      });
    });
  },

  setupThemeToggle() {
    const btn = document.getElementById('themeToggle');
    if (btn) {
      btn.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        btn.textContent = document.body.classList.contains('light-theme') ? '&#9728;' : '&#9790;';
      });
    }
  },

  switchTab(tabId) {
    if (tabId === this.currentTab && tabId === 'home') return;

    if (this.runningModules[this.currentTab]) {
      const mod = this.runningModules[this.currentTab];
      if (mod.destroy) mod.destroy();
      delete this.runningModules[this.currentTab];
    }

    this.currentTab = tabId;

    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabId);
    });

    document.querySelectorAll('.content-panel').forEach(panel => {
      panel.classList.toggle('active', panel.id === `panel-${tabId}`);
    });

    this.initModule(tabId);
  },

  initModule(tabId) {
    switch (tabId) {
      case 'knowledge':
        this.runningModules.knowledge = App.Knowledge;
        App.Knowledge.init();
        break;
      case 'principle':
        this.runningModules.principle = App.EEWPrinciple;
        App.EEWPrinciple.init();
        break;
      case 'simulator':
        this.runningModules.simulator = App.Simulator;
        App.Simulator.init();
        break;
      case 'history':
        App.History.init();
        break;
      case 'agents':
        this.runningModules.agents = App.Agents;
        App.Agents.init();
        break;
      case 'chatbot':
        App.Chatbot.init();
        break;
      default:
        break;
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  App.Core.init();
});
