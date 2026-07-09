window.App = window.App || {};

App.Chatbot = {
  init() {
    this.input = document.getElementById('chatInput');
    this.sendBtn = document.getElementById('chatSendBtn');
    this.messages = document.getElementById('chatMessages');
    this.bindEvents();
  },

  bindEvents() {
    this.sendBtn.addEventListener('click', () => this.handleSend());
    this.input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this.handleSend();
    });
  },

  handleSend() {
    const text = this.input.value.trim();
    if (!text) return;
    this.input.value = '';
    this.addMessage('user', text);
    this.respond(text);
  },

  addMessage(role, text) {
    const msg = document.createElement('div');
    msg.className = `msg ${role === 'user' ? 'user-msg' : 'agent-msg'}`;
    const bubble = document.createElement('div');
    bubble.className = 'msg-bubble';
    bubble.textContent = text;
    msg.appendChild(bubble);
    this.messages.appendChild(msg);
    this.messages.scrollTop = this.messages.scrollHeight;
  },

  respond(text) {
    const lower = text.toLowerCase();
    let best = null;
    let bestScore = 0;

    App.CHATBOT_INTENTS.forEach(intent => {
      if (intent === App.CHATBOT_DEFAULT) return;
      const score = intent.keywords.reduce((sum, kw) => sum + (lower.includes(kw) ? 1 : 0), 0);
      if (score > bestScore) { bestScore = score; best = intent; }
    });

    const reply = best ? best.response : App.CHATBOT_DEFAULT.response;
    setTimeout(() => this.addMessage('agent', reply), 400);
  }
};
