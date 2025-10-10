import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

interface EmbedRouteContext {
  params: Promise<{
    botId: string;
  }>;
}

const prisma = new PrismaClient();

// GET /embed/[botId]/widget.js - Serve bot widget script
export async function GET(
  request: NextRequest,
  context: EmbedRouteContext
) {
  const params = await context.params;
  try {
    const bot = await prisma.bot.findUnique({
      where: { id: params.botId },
      include: { theme: true, user: true, knowledgeBase: true },
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
    const tenantId = bot.user?.tenantId || '';
    const botName = bot.name || 'Chat Bot';

    const widgetScript = `
(function() {
  if (window.BotpressWidget) return;

  const botId = '${params.botId}';
  const config = ${JSON.stringify(config)};
  const theme = ${JSON.stringify(theme)};
  const botName = ${JSON.stringify(botName)};
  const tenantId = "${tenantId}";

  let isOpen = false;
  let hasInteracted = false;

  function createWidget() {
    const position = theme.chatPosition === 'bottom-left' ? 'left: 20px;' : 'right: 20px;';
    const chatAlign = theme.chatPosition === 'bottom-left' ? 'left: 0;' : 'right: 0;';

    const widgetHTML = \`
      <div id="bp-widget" style="
        position: fixed;
        bottom: 20px;
        \${position}
        z-index: 999999;
        font-family: \${theme.fontFamily || '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'};
      ">
        <!-- Chat Toggle Button with Notification Badge -->
        <div id="bp-chat-button-wrapper" style="position: relative;">
          
          <div id="bp-chat-button" style="
            width: 64px;
            height: 64px;
            background: linear-gradient(135deg, \${theme.primaryColor || '#667eea'}, \${theme.primaryColor ? 'color-mix(in srgb, ' + theme.primaryColor + ' 80%, #000)' : '#764ba2'});
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15), 0 8px 40px rgba(102, 126, 234, 0.25);
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
          ">
            <!-- Ripple effect background -->
            <div class="bp-ripple" style="
              position: absolute;
              width: 100%;
              height: 100%;
              top: 0;
              left: 0;
              opacity: 0;
            "></div>
            
            <svg id="bp-chat-icon" width="28" height="28" fill="\${theme.yourtextColor || '#ffffff'}" viewBox="0 0 24 24" style="transition: all 0.3s ease; position: relative; z-index: 1;">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
              <circle cx="12" cy="11" r="1"/>
              <circle cx="8" cy="11" r="1"/>
              <circle cx="16" cy="11" r="1"/>
            </svg>
            
            <svg id="bp-close-icon" width="24" height="24" fill="\${theme.yourtextColor || '#ffffff'}" viewBox="0 0 24 24" style="display: none; transition: all 0.3s ease; position: absolute; z-index: 1;">
              <path stroke="\${theme.yourtextColor || '#ffffff'}" stroke-width="2" stroke-linecap="round" d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </div>
        </div>

        <!-- Chat Window -->
        <div id="bp-chat-window" style="
          position: absolute;
          bottom: 84px;
          \${chatAlign}
          width: \${theme.chatWidth || '380px'};
          max-width: calc(100vw - 40px);
          height: \${theme.chatHeight || '600px'};
          max-height: calc(100vh - 120px);
          background: \${theme.backgroundColor || '#ffffff'};
          border-radius: \${theme.borderRadius || '16px'};
          box-shadow: 0 8px 32px rgba(0,0,0,0.12), 0 20px 60px rgba(0,0,0,0.08);
          transform: translateY(20px) scale(0.95);
          opacity: 0;
          pointer-events: none;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          backdrop-filter: blur(10px);
        ">

          <!-- Header with Gradient -->
          <div style="
            background: linear-gradient(135deg, \${theme.primaryColor || '#667eea'}, \${theme.primaryColor ? 'color-mix(in srgb, ' + theme.primaryColor + ' 80%, #000)' : '#764ba2'});
            color: \${theme.yourtextColor || '#ffffff'};
            padding: 20px 24px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          ">
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="
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
              ">\${botName.charAt(0).toUpperCase()}</div>
              <div>
                <h3 style="margin: 0; font-size: 16px; font-weight: 600; letter-spacing: -0.2px;">\${botName}</h3>
                <div style="display: flex; align-items: center; gap: 6px; margin-top: 2px;">
                  <span style="
                    width: 6px;
                    height: 6px;
                    background: #4ade80;
                    border-radius: 50%;
                    display: inline-block;
                    animation: bp-pulse-dot 2s infinite;
                  "></span>
                  <p style="margin: 0; font-size: 12px; opacity: 0.9;">Online</p>
                </div>
              </div>
            </div>
            <button id="bp-minimize-button" style="
              background: rgba(255,255,255,0.15);
              backdrop-filter: blur(10px);
              border: none;
              color: \${theme.yourtextColor || '#ffffff'};
              cursor: pointer;
              width: 32px;
              height: 32px;
              border-radius: 8px;
              display: flex;
              align-items: center;
              justify-content: center;
              transition: all 0.2s ease;
            ">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <path d="M19 9l-7 7-7-7"/>
              </svg>
            </button>
          </div>

          <!-- Messages Container with Custom Scrollbar -->
          <div id="bp-messages" style="
            flex: 1;
            padding: 20px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 14px;
            scroll-behavior: smooth;
            background: \${theme.backgroundColor || '#f8f9fa'};
          ">
            <!-- Welcome message will be added here -->
          </div>

          <!-- Input Area with Enhanced Design -->
          <div style="
            padding: 16px 20px 20px;
            background: \${theme.backgroundColor || '#ffffff'};
            border-top: 1px solid rgba(0,0,0,0.06);
          ">
            <div style="
              display: flex;
              gap: 10px;
              align-items: flex-end;
              background: \${theme.secondaryColor || '#f1f3f5'};
              padding: 8px;
              border-radius: 24px;
              transition: all 0.3s ease;
              box-shadow: 0 2px 8px rgba(0,0,0,0.04);
            ">
              <textarea id="bp-message-input" placeholder="Type your message..." style="
                flex: 1;
                padding: 10px 16px;
                border: none;
                border-radius: 18px;
                outline: none;
                font-size: \${theme.fontSize || '14px'};
                font-family: inherit;
                background: transparent;
                color: \${theme.chattextColor || '#1a1a1a'};
                resize: none;
                max-height: 120px;
                line-height: 1.5;
              " rows="1"></textarea>
              <button id="bp-send-button" style="
                background: linear-gradient(135deg, \${theme.primaryColor || '#667eea'}, \${theme.primaryColor ? 'color-mix(in srgb, ' + theme.primaryColor + ' 80%, #000)' : '#764ba2'});
                color: \${theme.yourtextColor || '#ffffff'};
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
              ">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
                </svg>
              </button>
            </div>
            <div style="
              margin-top: 8px;
              font-size: 11px;
              color: rgba(0,0,0,0.4);
              text-align: center;
            ">Powered by AI • Press Enter to send</div>
          </div>
        </div>
      </div>

      <style>
        @keyframes bp-pulse-dot {
          0%, 100% { 
            transform: scale(1); 
            opacity: 1;
            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
          }
          50% { 
            transform: scale(1.1); 
            opacity: 0.8;
            box-shadow: 0 0 0 4px rgba(16, 185, 129, 0);
          }
        }

        @keyframes bp-ripple-effect {
          0% { transform: scale(0); opacity: 0.6; }
          100% { transform: scale(2); opacity: 0; }
        }

        .bp-ripple.active {
          background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%);
          animation: bp-ripple-effect 0.6s ease-out;
        }

        .bp-message {
          max-width: 75%;
          padding: 12px 16px;
          border-radius: 16px;
          word-wrap: break-word;
          font-size: \${theme.fontSize || '14px'};
          line-height: 1.5;
          animation: bp-slide-in 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          position: relative;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }

        .bp-user-message {
          background: linear-gradient(135deg, \${theme.primaryColor || '#667eea'}, \${theme.primaryColor ? 'color-mix(in srgb, ' + theme.primaryColor + ' 90%, #000)' : '#764ba2'});
          color: \${theme.yourtextColor || '#ffffff'};
          align-self: flex-end;
          border-bottom-right-radius: 4px;
          box-shadow: 0 2px 12px rgba(102, 126, 234, 0.2);
        }

        .bp-bot-message {
          background: \${theme.secondaryColor || '#ffffff'};
          color: \${theme.chattextColor || '#1a1a1a'};
          align-self: flex-start;
          border-bottom-left-radius: 4px;
          border: 1px solid rgba(0,0,0,0.06);
        }

        .typing-indicator {
          display: flex;
          gap: 4px;
          align-items: center;
          background: \${theme.secondaryColor || '#ffffff'};
          color: \${theme.chattextColor || '#1a1a1a'};
          width: 60px;
          height: 40px;
          justify-content: center;
          border: 1px solid rgba(0,0,0,0.06);
        }

        .typing-indicator .dot {
          width: 8px;
          height: 8px;
          background: \${theme.primaryColor || '#667eea'};
          border-radius: 50%;
          animation: bp-bounce 1.4s infinite ease-in-out both;
        }

        .typing-indicator .dot:nth-child(1) { animation-delay: -0.32s; }
        .typing-indicator .dot:nth-child(2) { animation-delay: -0.16s; }

        @keyframes bp-bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-8px); }
        }

        @keyframes bp-slide-in {
          from { opacity: 0; transform: translateY(15px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* Custom Scrollbar */
        #bp-messages::-webkit-scrollbar {
          width: 6px;
        }

        #bp-messages::-webkit-scrollbar-track {
          background: transparent;
        }

        #bp-messages::-webkit-scrollbar-thumb {
          background: rgba(0,0,0,0.2);
          border-radius: 10px;
        }

        #bp-messages::-webkit-scrollbar-thumb:hover {
          background: rgba(0,0,0,0.3);
        }

        /* Hover Effects */
        #bp-chat-button:hover {
          transform: scale(1.08) translateY(-2px);
          box-shadow: 0 6px 24px rgba(0,0,0,0.2), 0 12px 48px rgba(102, 126, 234, 0.35);
        }

        #bp-send-button:hover:not(:disabled) {
          transform: scale(1.1) rotate(5deg);
          box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
        }

        #bp-send-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        #bp-minimize-button:hover {
          background: rgba(255,255,255,0.25);
          transform: scale(1.05);
        }

        /* Textarea auto-resize */
        #bp-message-input {
          scrollbar-width: thin;
          scrollbar-color: rgba(0,0,0,0.2) transparent;
        }

        #bp-message-input::-webkit-scrollbar {
          width: 4px;
        }

        #bp-message-input::-webkit-scrollbar-thumb {
          background: rgba(0,0,0,0.2);
          border-radius: 10px;
        }

        /* Mobile Responsive */
        @media (max-width: 480px) {
          #bp-chat-window {
            width: calc(100vw - 20px) !important;
            height: calc(100vh - 100px) !important;
            bottom: 10px !important;
            left: 10px !important;
            right: 10px !important;
            border-radius: 12px !important;
          }
        }
      </style>
    \`;

    document.body.insertAdjacentHTML('beforeend', widgetHTML);

    // Initialize
    const chatButton = document.getElementById('bp-chat-button');
    const minimizeBtn = document.getElementById('bp-minimize-button');
    const sendBtn = document.getElementById('bp-send-button');
    const input = document.getElementById('bp-message-input');

    chatButton.addEventListener('click', toggleChat);
    minimizeBtn.addEventListener('click', closeChat);
    sendBtn.addEventListener('click', sendMessage);
    
    input.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });

    input.addEventListener('input', autoResize);

    // Add welcome message with delay
    setTimeout(() => {
      addMessage(config.welcomeMessage || 'Hey! How can I help you today?', false, true);
      if (!hasInteracted) {
        showNotificationBadge();
      }
    }, 800);

    // Add ripple effect on button click
    chatButton.addEventListener('click', function() {
      const ripple = this.querySelector('.bp-ripple');
      ripple.classList.add('active');
      setTimeout(() => ripple.classList.remove('active'), 600);
    });
  }

  function autoResize() {
    const input = document.getElementById('bp-message-input');
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 120) + 'px';
  }

  function showNotificationBadge() {
    const badge = document.getElementById('bp-notification-badge');
    if (badge && !isOpen) {
      badge.style.opacity = '1';
      badge.style.transform = 'scale(1)';
    }
  }

  function hideNotificationBadge() {
    const badge = document.getElementById('bp-notification-badge');
    if (badge) {
      badge.style.opacity = '0';
      badge.style.transform = 'scale(0)';
    }
  }

  function toggleChat() {
    const chatWindow = document.getElementById('bp-chat-window');
    const chatIcon = document.getElementById('bp-chat-icon');
    const closeIcon = document.getElementById('bp-close-icon');
    
    isOpen = !isOpen;
    hasInteracted = true;
    hideNotificationBadge();
    
    if (isOpen) {
      chatWindow.style.opacity = '1';
      chatWindow.style.pointerEvents = 'auto';
      chatWindow.style.transform = 'translateY(0) scale(1)';
      chatIcon.style.display = 'none';
      closeIcon.style.display = 'block';
      document.getElementById('bp-message-input').focus();
    } else {
      chatWindow.style.opacity = '0';
      chatWindow.style.pointerEvents = 'none';
      chatWindow.style.transform = 'translateY(20px) scale(0.95)';
      chatIcon.style.display = 'block';
      closeIcon.style.display = 'none';
    }
  }

  function closeChat() {
    const chatWindow = document.getElementById('bp-chat-window');
    const chatIcon = document.getElementById('bp-chat-icon');
    const closeIcon = document.getElementById('bp-close-icon');
    
    chatWindow.style.opacity = '0';
    chatWindow.style.pointerEvents = 'none';
    chatWindow.style.transform = 'translateY(20px) scale(0.95)';
    chatIcon.style.display = 'block';
    closeIcon.style.display = 'none';
    isOpen = false;
  }

  function addMessage(text, isUser = false, isWelcome = false) {
    const messagesContainer = document.getElementById('bp-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = \`bp-message \${isUser ? 'bp-user-message' : 'bp-bot-message'}\`;
    messageDiv.textContent = text;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    if (!isUser && !isWelcome && !hasInteracted) {
      showNotificationBadge();
    }
  }

  async function sendMessage() {
    const input = document.getElementById('bp-message-input');
    const sendBtn = document.getElementById('bp-send-button');
    const message = input.value.trim();
    if (!message) return;

    input.value = '';
    input.style.height = 'auto';
    sendBtn.disabled = true;
    addMessage(message, true);

    const messagesContainer = document.getElementById('bp-messages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'bp-message typing-indicator';
    typingDiv.innerHTML = '<span class="dot"></span><span class="dot"></span><span class="dot"></span>';
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    try {
      const response = await fetch('https://chatbotbackend-grm3.onrender.com/chat/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: message, tenant_id: tenantId }),
      });

      const data = await response.json();
      typingDiv.remove();
      addMessage(data.answer || data.detail || 'No response received.', false);
    } catch (error) {
      typingDiv.remove();
      addMessage('Sorry, something went wrong. Please try again.', false);
    } finally {
      sendBtn.disabled = false;
      input.focus();
    }
  }

  if (document.readyState === 'loading')
    document.addEventListener('DOMContentLoaded', createWidget);
  else createWidget();

  window.BotpressWidget = { open: toggleChat, close: closeChat, toggle: toggleChat };
})();
`;

    return new NextResponse(widgetScript, {
      headers: {
        'Content-Type': 'application/javascript',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Error serving widget script:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}