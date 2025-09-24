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
      include: {
        theme: true,
        knowledgeBase: true,
      },
    });
    console.log(bot)

    if (!bot || bot.status !== 'DEPLOYED') {
      return new NextResponse('Bot not found or not deployed', { status: 404 });
    }

    // Parse config if it's a string
    let config: any = bot.config || {};
    if (typeof config === "string") {
      try {
        config = JSON.parse(config);
      } catch {
        config = {};
      }
    }
    const theme = bot.theme || {};

    const widgetScript = `
(function() {
    // Prevent multiple widget loads
    if (window.BotpressWidget) return;
    
    const botId = '${params.botId}';
    const config = ${JSON.stringify(config)};
    const theme = ${JSON.stringify(theme)};
    
    // Widget state
    let isOpen = false;
    let sessionId = 'session_' + Math.random().toString(36).substring(2, 15);
    
    // Create widget HTML
    function createWidget() {
        const widgetHTML = \`
            <div id="bp-widget" style="
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 10000;
                font-family: \${theme.fontFamily || 'Inter, sans-serif'};
            ">
                <!-- Chat Button -->
                <div id="bp-chat-button" style="
                    width: 60px;
                    height: 60px;
                    background: \${theme.primaryColor || '#0ea5e9'};
                    border-radius: 50%;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    transition: transform 0.2s;
                ">
                    <svg width="24" height="24" fill="white" viewBox="0 0 24 24">
                        <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
                    </svg>
                </div>
                
                <!-- Chat Window -->
                <div id="bp-chat-window" style="
                    position: absolute;
                    bottom: 80px;
                    right: 0;
                    width: 350px;
                    height: 500px;
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 8px 32px rgba(0,0,0,0.12);
                    display: none;
                    flex-direction: column;
                    overflow: hidden;
                ">
                    <!-- Header -->
                    <div style="
                        background: \${theme.primaryColor || '#0ea5e9'};
                        color: white;
                        padding: 16px;
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                    ">
                        <div>
                            <h3 style="margin: 0; font-size: 16px; font-weight: 600;">\${bot.name || 'Chat Bot'}</h3>
                            <p style="margin: 0; font-size: 12px; opacity: 0.9;">Online now</p>
                        </div>
                        <button id="bp-close-button" style="
                            background: none;
                            border: none;
                            color: white;
                            cursor: pointer;
                            padding: 4px;
                            border-radius: 4px;
                        ">
                            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                            </svg>
                        </button>
                    </div>
                    
                    <!-- Messages -->
                    <div id="bp-messages" style="
                        flex: 1;
                        padding: 16px;
                        overflow-y: auto;
                        display: flex;
                        flex-direction: column;
                        gap: 12px;
                    ">
                        <div class="bp-message bp-bot-message">
                            \${config.welcomeMessage || 'Hello! How can I help you today?'}
                        </div>
                    </div>
                    
                    <!-- Input -->
                    <div style="
                        padding: 16px;
                        border-top: 1px solid #e2e8f0;
                        display: flex;
                        gap: 8px;
                    ">
                        <input id="bp-message-input" type="text" placeholder="Type your message..." style="
                            flex: 1;
                            padding: 8px 12px;
                            border: 1px solid #e2e8f0;
                            border-radius: 20px;
                            outline: none;
                            font-size: 14px;
                        ">
                        <button id="bp-send-button" style="
                            background: \${theme.primaryColor || '#0ea5e9'};
                            color: white;
                            border: none;
                            padding: 8px 16px;
                            border-radius: 20px;
                            cursor: pointer;
                            font-size: 14px;
                        ">Send</button>
                    </div>
                </div>
            </div>
            
            <style>
                .bp-message {
                    max-width: 80%;
                    padding: 8px 12px;
                    border-radius: 12px;
                    word-wrap: break-word;
                    font-size: 14px;
                    line-height: 1.4;
                }
                
                .bp-user-message {
                    background: \${theme.primaryColor || '#0ea5e9'};
                    color: white;
                    align-self: flex-end;
                    border-bottom-right-radius: 4px;
                }
                
                .bp-bot-message {
                    background: #f1f5f9;
                    color: #334155;
                    align-self: flex-start;
                    border-bottom-left-radius: 4px;
                }
                
                #bp-chat-button:hover {
                    transform: scale(1.05);
                }
                
                #bp-message-input:focus {
                    border-color: \${theme.primaryColor || '#0ea5e9'};
                }
                
                #bp-send-button:hover {
                    opacity: 0.9;
                }
            </style>
        \`;
        
        document.body.insertAdjacentHTML('beforeend', widgetHTML);
        
        // Add event listeners
        document.getElementById('bp-chat-button').addEventListener('click', toggleChat);
        document.getElementById('bp-close-button').addEventListener('click', closeChat);
        document.getElementById('bp-send-button').addEventListener('click', sendMessage);
        document.getElementById('bp-message-input').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
    
    function toggleChat() {
        const chatWindow = document.getElementById('bp-chat-window');
        isOpen = !isOpen;
        chatWindow.style.display = isOpen ? 'flex' : 'none';
        
        if (isOpen) {
            document.getElementById('bp-message-input').focus();
        }
    }
    
    function closeChat() {
        const chatWindow = document.getElementById('bp-chat-window');
        isOpen = false;
        chatWindow.style.display = 'none';
    }
    
    function addMessage(text, isUser = false) {
        const messagesContainer = document.getElementById('bp-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = \`bp-message \${isUser ? 'bp-user-message' : 'bp-bot-message'}\`;
        messageDiv.textContent = text;
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    async function sendMessage() {
        const input = document.getElementById('bp-message-input');
        const message = input.value.trim();
        if (!message) return;
        
        input.value = '';
        addMessage(message, true);
        
        try {
            const response = await fetch(\`\${window.location.origin}/api/chat/\${botId}\`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message,
                    sessionId,
                }),
            });
            
            const data = await response.json();
            
            if (data.response) {
                addMessage(data.response.text, false);
            }
        } catch (error) {
            addMessage('Sorry, something went wrong. Please try again.', false);
        }
    }
    
    // Initialize widget when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createWidget);
    } else {
        createWidget();
    }
    
    // Expose widget API
    window.BotpressWidget = {
        open: function() {
            if (!isOpen) toggleChat();
        },
        close: function() {
            if (isOpen) closeChat();
        },
        toggle: toggleChat,
        sendMessage: function(text) {
            document.getElementById('bp-message-input').value = text;
            sendMessage();
        }
    };
})();`;

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