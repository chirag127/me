// AI Chat
import { chatWithHistory, getResumeContext, type ChatMessage } from '../../core/puter';

export default async function AI(c: HTMLElement): Promise<void> {
  c.innerHTML = `<div class="page animate-fade-in"><header class="page-header"><h1 class="page-title">Ask Chirag AI</h1><p class="page-subtitle">Chat with my AI digital twin (powered by Puter.js)</p></header><div class="chat-container glass-panel"><div id="chat-messages" class="chat-messages"><div class="message ai">Hi! I'm an AI representation of Chirag. Ask me anything about my skills, experience, projects, or interests!</div></div><form id="chat-form" class="chat-input-container"><input type="text" id="chat-input" class="chat-input" placeholder="Ask about my experience, skills, projects..."><button type="submit" class="btn btn-primary">Send</button></form></div></div><style>.chat-container{padding:var(--space-6);height:60vh;display:flex;flex-direction:column}.chat-messages{flex:1;overflow-y:auto;margin-bottom:var(--space-4);display:flex;flex-direction:column;gap:var(--space-3)}.message{padding:var(--space-3) var(--space-4);border-radius:var(--radius-lg);max-width:80%}.message.user{background:var(--accent-blue);color:white;align-self:flex-end}.message.ai{background:var(--glass-bg);align-self:flex-start}.chat-input-container{display:flex;gap:var(--space-3)}.chat-input{flex:1;padding:var(--space-3);background:var(--glass-bg);border:1px solid var(--glass-border);border-radius:var(--radius-md);color:var(--text-primary);outline:none}.chat-input:focus{border-color:var(--accent-blue)}</style>`;
  const form = document.getElementById('chat-form') as HTMLFormElement;
  const input = document.getElementById('chat-input') as HTMLInputElement;
  const messagesEl = document.getElementById('chat-messages')!;
  const history: ChatMessage[] = [{ role: 'system', content: getResumeContext() }];
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const q = input.value.trim();
    if (!q) return;
    input.value = '';
    messagesEl.innerHTML += `<div class="message user">${q}</div>`;
    messagesEl.scrollTop = messagesEl.scrollHeight;
    // Add user message to history
    history.push({ role: 'user', content: q });
    try {
      const response = await chatWithHistory(history);
      messagesEl.innerHTML += `<div class="message ai">${response}</div>`;
      // Add assistant response to history
      history.push({ role: 'assistant', content: response });
    } catch { messagesEl.innerHTML += `<div class="message ai">Sorry, I couldn't process that. Puter.js AI might not be available.</div>`; }
    messagesEl.scrollTop = messagesEl.scrollHeight;
  });
}
