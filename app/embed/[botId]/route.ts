import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';


interface EmbedRouteContext {
  params: Promise<{
    botId: string;
  }>;
}

const prisma = new PrismaClient();

// GET /embed/[botId] - Serve bot embed page
export async function GET(
  request: NextRequest,
  context: EmbedRouteContext
) {
  const { botId } = await context.params;
  try {
    const bot = await prisma.bot.findUnique({
      where: { id: botId },
      include: {
        theme: true,
        knowledgeBase: true,
      },

    });

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
    const theme = bot.theme ;

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${bot.name} - Chat Bot</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: ${theme?.fontFamily || 'Inter, sans-serif'};
            background: ${theme?.secondaryColor + '20' || '#f0f4f8'};
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .chat-container {
            width: 400px;
            height: 600px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            display: flex;
            flex-direction: column;
            overflow: hidden;
            background: ${theme?.backgroundColor || '#ffffff'};
        }
        
        .chat-header {
            background: ${theme?.primaryColor || '#0ea5e9'};
            color: white;
            padding: 20px;
            text-align: center;
        }
        
        .chat-header h1 {
            font-size: 18px;
            font-weight: 600;
        }
        
        .chat-messages {
            flex: 1;
            padding: 20px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 12px;
            background: ${theme?.secondaryColor+'20' || '#ffffff'};
        }
        
        .message {
            max-width: 80%;
            padding: 12px 16px;
            border-radius: 18px;
            word-wrap: break-word;
        }
        
        .message.user {
            background: ${theme?.primaryColor || '#0ea5e9'};
            color: white;
            align-self: flex-end;
            border-bottom-right-radius: 4px;
        }
        
        .message.bot {
            background: #f1f5f9;
            color: #334155;
            align-self: flex-start;
            border-bottom-left-radius: 4px;
        }
        
        .quick-replies {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 8px;
        }
        
        .quick-reply {
            background: white;
            border: 1px solid ${theme?.primaryColor || '#0ea5e9'};
            color: ${theme?.primaryColor || '#0ea5e9'};
            padding: 6px 12px;
            border-radius: 16px;
            font-size: 12px;
            cursor: pointer;
            transition: all 0.2s;
        }
        
        .quick-reply:hover {
            background: ${theme?.primaryColor || '#0ea5e9'};
            color: white;
        }
        
        .chat-input {
            padding: 20px;
            border-top: 1px solid #e2e8f0;
            display: flex;
            gap: 12px;
        }
        
        .chat-input input {
            flex: 1;
            padding: 12px 16px;
            border: 1px solid #e2e8f0;
            border-radius: 24px;
            outline: none;
            font-size: 14px;
        }
        
        .chat-input input:focus {
            border-color: ${theme?.primaryColor || '#0ea5e9'};
        }
        
        .send-button {
            background: ${theme?.primaryColor || '#0ea5e9'};
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 24px;
            cursor: pointer;
            font-weight: 500;
            transition: opacity 0.2s;
        }
        
        .send-button:hover {
            opacity: 0.9;
        }
        
        .send-button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
        
        .typing-indicator {
            display: none;
            align-items: center;
            gap: 4px;
            padding: 12px 16px;
            background: #f1f5f9;
            border-radius: 18px;
            border-bottom-left-radius: 4px;
            align-self: flex-start;
            max-width: 80px;
        }
        
        .typing-dot {
            width: 6px;
            height: 6px;
            background: #94a3b8;
            border-radius: 50%;
            animation: typing 1.4s infinite;
        }
        
        .typing-dot:nth-child(2) { animation-delay: 0.2s; }
        .typing-dot:nth-child(3) { animation-delay: 0.4s; }
        
        @keyframes typing {
            0%, 60%, 100% { transform: translateY(0); }
            30% { transform: translateY(-10px); }
        }
    </style>
</head>
<body>
    <div class="chat-container">
        <div class="chat-header">
            <h1>${bot.name}</h1>
        </div>
        
        <div class="chat-messages" id="messages">
            <div class="message bot">
                ${config.welcomeMessage || "Hello! How can I help you today?"}
            </div>
        </div>
        
        <div class="typing-indicator" id="typing">
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        </div>
        
        <div class="chat-input">
            <input type="text" id="messageInput" placeholder="Type your message..." />
            <button class="send-button" id="sendButton">Send</button>
        </div>
    </div>

    <script>
        const messagesContainer = document.getElementById('messages');
        const messageInput = document.getElementById('messageInput');
        const sendButton = document.getElementById('sendButton');
        const typingIndicator = document.getElementById('typing');
        
        const sessionId = 'session_' + Math.random().toString(36).substring(2, 15);
        
        function addMessage(text, isUser = false, quickReplies = []) {
            const messageDiv = document.createElement('div');
            messageDiv.className = \`message \${isUser ? 'user' : 'bot'}\`;
            messageDiv.textContent = text;
            
            if (quickReplies && quickReplies.length > 0) {
                const repliesDiv = document.createElement('div');
                repliesDiv.className = 'quick-replies';
                
                quickReplies.forEach(reply => {
                    const replyButton = document.createElement('button');
                    replyButton.className = 'quick-reply';
                    replyButton.textContent = reply;
                    replyButton.onclick = () => sendMessage(reply);
                    repliesDiv.appendChild(replyButton);
                });
                
                messageDiv.appendChild(repliesDiv);
            }
            
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
            
            if (!text) {
                messageInput.value = '';
            }
            
            addMessage(message, true);
            sendButton.disabled = true;
            showTyping();
            
            try {
                const response = await fetch('/api/chat/${botId}', {
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
                    hideTyping();
                    addMessage(data.response.text, false, data.response.quickReplies);
                }
            } catch (error) {
                hideTyping();
                addMessage('Sorry, something went wrong. Please try again.', false);
            }
            
            sendButton.disabled = false;
        }
        
        sendButton.addEventListener('click', sendMessage);
        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
        
        // Focus input on load
        messageInput.focus();
    </script>
</body>
</html>`;

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } catch (error) {
    console.error('Error serving bot embed:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}