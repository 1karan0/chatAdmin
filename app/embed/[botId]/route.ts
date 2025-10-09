import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

interface EmbedRouteContext {
    params: Promise<{ botId: string }>;
}

const prisma = new PrismaClient();

export async function GET(request: NextRequest, context: EmbedRouteContext) {
    const { botId } = await context.params;
    try {
        const bot = await prisma.bot.findUnique({
            where: { id: botId },
            include: {
                theme: true,
                knowledgeBase: true,
                user: true,
            },
        });

        if (!bot || bot.status !== 'DEPLOYED') {
            return new NextResponse('Bot not found or not deployed', { status: 404 });
        }

        let config: any = bot.config || {};
        if (typeof config === 'string') {
            try {
                config = JSON.parse(config);
            } catch {
                config = {};
            }
        }

        const theme = bot.theme || {};
        const user = bot.user;
        const tenantId = user?.tenantId || '';

        const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${bot.name} - Chatbot</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: ${bot?.theme?.fontFamily || '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'};
      background: #f5f6fa;
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .chat-container {
      width: ${bot?.theme?.chatWidth || '380px'};
      max-width: calc(100vw - 40px);
      height: ${bot?.theme?.chatHeight || '600px'};
      max-height: calc(100vh - 40px);
      border-radius: ${bot?.theme?.borderRadius || '16px'};
      overflow: hidden;
      display: flex;
      flex-direction: column;
      background: ${bot?.theme?.backgroundColor || '#ffffff'};
      box-shadow: 0 8px 32px rgba(0,0,0,0.12), 0 20px 60px rgba(0,0,0,0.08);
      backdrop-filter: blur(10px);
    }

    .chat-header {
      background: linear-gradient(135deg, ${bot?.theme?.primaryColor || '#667eea'}, ${bot?.theme?.primaryColor ? 'color-mix(in srgb, ' + bot?.theme?.primaryColor + ' 80%, #000)' : '#764ba2'});
      padding: 20px 24px;
      display: flex;
      align-items: center;
      gap: 12px;
      color: ${bot?.theme?.yourtextColor || '#ffffff'};
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }

    .name {
      width: 40px;
      height: 40px;
      background: rgba(255,255,255,0.2);
      backdrop-filter: blur(10px);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 16px;
    }

    .chat-header .info {
      flex: 1;
    }

    .chat-header .info h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
      letter-spacing: -0.2px;
    }

    .chat-header .status {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      margin-top: 2px;
      opacity: 0.9;
    }

    .status-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #4ade80;
      animation: pulse-dot 2s infinite;
    }

    @keyframes pulse-dot {
      0%, 100% { 
        transform: scale(1); 
        opacity: 1;
        box-shadow: 0 0 0 0 rgba(74, 222, 128, 0.7);
      }
      50% { 
        transform: scale(1.1); 
        opacity: 0.8;
        box-shadow: 0 0 0 4px rgba(74, 222, 128, 0);
      }
    }

    .chat-messages {
      flex: 1;
      padding: 20px;
      overflow-y: auto;
      background: ${bot?.theme?.backgroundColor || '#f8f9fa'};
      display: flex;
      flex-direction: column;
      gap: 14px;
      scroll-behavior: smooth;
    }

    .message {
      max-width: 75%;
      padding: 12px 16px;
      border-radius: 16px;
      font-size: ${bot?.theme?.fontSize || '14px'};
      line-height: 1.5;
      word-wrap: break-word;
      animation: slide-in 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
      position: relative;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    }

    @keyframes slide-in {
      from { opacity: 0; transform: translateY(15px) scale(0.95); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }

    .message.bot {
      background: ${bot?.theme?.secondaryColor || '#ffffff'};
      color: ${bot?.theme?.chattextColor || '#1a1a1a'};
      align-self: flex-start;
      border-bottom-left-radius: 4px;
      border: 1px solid rgba(0,0,0,0.06);
    }

    .message.user {
      background: linear-gradient(135deg, ${bot?.theme?.primaryColor || '#667eea'}, ${bot?.theme?.primaryColor ? 'color-mix(in srgb, ' + bot?.theme?.primaryColor + ' 90%, #000)' : '#764ba2'});
      color: ${bot?.theme?.yourtextColor || '#ffffff'};
      align-self: flex-end;
      border-bottom-right-radius: 4px;
      box-shadow: 0 2px 12px rgba(102, 126, 234, 0.2);
    }

    .chat-input {
      padding: 16px 20px 20px;
      background: ${bot?.theme?.backgroundColor || '#ffffff'};
      border-top: 1px solid rgba(0,0,0,0.06);
    }

    .input-wrapper {
      display: flex;
      gap: 10px;
      align-items: flex-end;
      background: ${bot?.theme?.secondaryColor || '#f1f3f5'};
      padding: 8px;
      border-radius: 24px;
      transition: all 0.3s ease;
      box-shadow: 0 2px 8px rgba(0,0,0,0.04);
    }

    .chat-input textarea {
      flex: 1;
      padding: 10px 16px;
      border: none;
      border-radius: 18px;
      outline: none;
      font-size: ${bot?.theme?.fontSize || '14px'};
      font-family: inherit;
      background: transparent;
      color: ${bot?.theme?.chattextColor || '#1a1a1a'};
      resize: none;
      max-height: 120px;
      line-height: 1.5;
      scrollbar-width: thin;
      scrollbar-color: rgba(0,0,0,0.2) transparent;
    }

    .chat-input textarea::-webkit-scrollbar {
      width: 4px;
    }

    .chat-input textarea::-webkit-scrollbar-thumb {
      background: rgba(0,0,0,0.2);
      border-radius: 10px;
    }

    .send-button {
      background: linear-gradient(135deg, ${bot?.theme?.primaryColor || '#667eea'}, ${bot?.theme?.primaryColor ? 'color-mix(in srgb, ' + bot?.theme?.primaryColor + ' 80%, #000)' : '#764ba2'});
      color: ${bot?.theme?.yourtextColor || '#ffffff'};
      border: none;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }

    .send-button:hover:not(:disabled) {
      transform: scale(1.1) rotate(5deg);
      box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
    }

    .send-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .powered {
      margin-top: 8px;
      font-size: 11px;
      color: rgba(0,0,0,0.4);
      text-align: center;
    }

    .typing-indicator {
      display: none;
      margin-left: 20px;
      gap: 4px;
      align-items: center;
      background: ${bot?.theme?.secondaryColor || '#ffffff'};
      color: ${bot?.theme?.chattextColor || '#1a1a1a'};
      width: 60px;
      height: 40px;
      justify-content: center;
      border: 1px solid rgba(0,0,0,0.06);
      padding: 12px 16px;
      border-radius: 16px;
      border-bottom-left-radius: 4px;
      align-self: flex-start;
      max-width: 75%;
    }

    .typing-dot {
      width: 8px;
      height: 8px;
      background: ${bot?.theme?.primaryColor || '#667eea'};
      border-radius: 50%;
      animation: bounce 1.4s infinite ease-in-out both;
    }

    .typing-dot:nth-child(1) { animation-delay: -0.32s; }
    .typing-dot:nth-child(2) { animation-delay: -0.16s; }

    @keyframes bounce {
      0%, 80%, 100% { transform: translateY(0); }
      40% { transform: translateY(-8px); }
    }

    /* Custom Scrollbar */
    .chat-messages::-webkit-scrollbar {
      width: 6px;
    }

    .chat-messages::-webkit-scrollbar-track {
      background: transparent;
    }

    .chat-messages::-webkit-scrollbar-thumb {
      background: rgba(0,0,0,0.2);
      border-radius: 10px;
    }

    .chat-messages::-webkit-scrollbar-thumb:hover {
      background: rgba(0,0,0,0.3);
    }

    /* Mobile Responsive */
    @media (max-width: 480px) {
      .chat-container {
        width: 100vw;
        height: 100vh;
        max-width: 100vw;
        max-height: 100vh;
        border-radius: 0;
      }
    }
  </style>
</head>
<body>
  <div class="chat-container">
    <div class="chat-header">
      <div class="name">${bot.name.charAt(0).toUpperCase()}</div>
      <div class="info">
        <h3>${bot.name}</h3>
        <div class="status">
          <div class="status-dot"></div>
          <span>Online</span>
        </div>
      </div>
    </div>

    <div class="chat-messages" id="messages">
      <div class="message bot">${config.welcomeMessage || 'Hey! How can I help you today?'}</div>
    </div>

    <div class="typing-indicator" id="typing">
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
    </div>

    <div class="chat-input">
      <div class="input-wrapper">
        <textarea id="messageInput" placeholder="Type your message..." rows="1"></textarea>
        <button class="send-button" id="sendButton">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
          </svg>
        </button>
      </div>
      <div class="powered">Powered by AI • Press Enter to send</div>
    </div>
  </div>

  <script>
    const tenantId = "${tenantId}";
    const messagesContainer = document.getElementById('messages');
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');
    const typingIndicator = document.getElementById('typing');

    const sessionId = 'session_' + Math.random().toString(36).substring(2, 15);

    // Auto-resize textarea
    messageInput.addEventListener('input', function() {
      this.style.height = 'auto';
      this.style.height = Math.min(this.scrollHeight, 120) + 'px';
    });

    function addMessage(text, isUser = false) {
      const messageDiv = document.createElement('div');
      messageDiv.className = 'message ' + (isUser ? 'user' : 'bot');
      messageDiv.textContent = text;
      messagesContainer.appendChild(messageDiv);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function showTyping() {
      typingIndicator.style.display = 'flex';
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function hideTyping() {
      typingIndicator.style.display = 'none';
    }

    async function sendMessage(text = null) {
      const message = text || messageInput.value.trim();
      if (!message) return;

      addMessage(message, true);
      messageInput.value = '';
      messageInput.style.height = 'auto';
      sendButton.disabled = true;
      showTyping();

      try {
        const response = await fetch('http://localhost:8000/chat/ask', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            question: message,
            tenant_id: tenantId
          }),
        });

        const data = await response.json();
        hideTyping();
        if (data.answer) addMessage(data.answer);
        else addMessage(data.detail || 'Something went wrong.');
      } catch (err) {
        hideTyping();
        addMessage('⚠️ Network error, please try again.');
      }

      sendButton.disabled = false;
      messageInput.focus();
    }

    sendButton.addEventListener('click', () => sendMessage());
    messageInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });
  </script>
</body>
</html>`;

        return new NextResponse(html, { headers: { 'Content-Type': 'text/html' } });
    } catch (err) {
        console.error('Error serving bot embed:', err);
        return new NextResponse('Internal server error', { status: 500 });
    }
}