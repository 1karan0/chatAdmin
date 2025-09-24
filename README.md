# Botpress-like Chatbot Platform

A modern, full-stack chatbot platform inspired by Botpress, built with Next.js, TypeScript, and Python.

## Features

### 🤖 Bot Management
- Create and manage multiple chatbots
- Visual bot configuration with live preview
- Deploy bots with embeddable widgets
- Real-time analytics and monitoring

### 🎨 Theme Customization
- Visual theme editor with live preview
- Custom colors, fonts, and layouts
- Responsive design for all devices
- Custom CSS support

### 📚 Knowledge Base
- **URL Crawling**: Extract content from websites
- **File Upload**: Support for PDF, DOCX, TXT, CSV, JSON
- **Text Input**: Direct text content input
- **Smart Processing**: Python backend for content extraction
- **Vector Storage**: Ready for embeddings and semantic search

### 🚀 Deployment
- One-click bot deployment
- Embeddable chat widgets
- Custom domain support
- API access for integrations

## Tech Stack

### Frontend
- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Radix UI** - Component library
- **Prisma** - Database ORM
- **NextAuth.js** - Authentication

### Backend
- **PostgreSQL** - Primary database
- **Python FastAPI** - Knowledge processing
- **BeautifulSoup** - Web scraping
- **PyPDF2** - PDF processing
- **python-docx** - Word document processing

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.8+
- PostgreSQL database

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd chatbot-platform
```

2. **Install frontend dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

4. **Set up the database**
```bash
npx prisma generate
npx prisma db push
```

5. **Set up Python backend**
```bash
cd python-backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

6. **Start the development servers**

Frontend:
```bash
npm run dev
```

Python backend:
```bash
cd python-backend
python main.py
```

## Environment Variables

Create a `.env.local` file with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/chatbot_db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# OAuth Providers
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_ID="your-github-client-id"
GITHUB_SECRET="your-github-client-secret"

# Python Backend
PYTHON_BACKEND_URL="http://localhost:8000"
```

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── (dashboard)/       # Dashboard pages
│   ├── (landing)/         # Landing page
│   ├── api/              # API routes
│   └── embed/            # Bot embed pages
├── components/           # React components
│   ├── ui/              # UI components
│   ├── common/          # Common components
│   ├── layout/          # Layout components
│   └── skeletons/       # Loading skeletons
├── python-backend/      # Python processing backend
│   ├── main.py         # FastAPI application
│   └── requirements.txt # Python dependencies
├── prisma/             # Database schema and migrations
├── types/              # TypeScript type definitions
└── lib/                # Utility functions
```

## Key Features Explained

### Bot Creation Wizard
The bot creation process is divided into steps:
1. **Bot Type**: Choose the purpose of your bot
2. **Knowledge**: Add training data (URLs, files, text)
3. **Theme**: Customize appearance and behavior
4. **Review**: Final review before creation

### Knowledge Processing
The Python backend handles:
- Web scraping with BeautifulSoup
- PDF text extraction with PyPDF2
- Word document processing with python-docx
- Text chunking for better context
- Vector data preparation (ready for embeddings)

### Theme System
Comprehensive theming with:
- Color customization
- Typography settings
- Layout configuration
- Live preview
- Custom CSS support

### Database Schema
Optimized for scalability:
- User management
- Bot configuration
- Theme settings
- Knowledge base with vector support
- Analytics tracking
- Conversation history

## API Endpoints

### Frontend API
- `GET/POST /api/bots` - Bot management
- `POST /api/bots/[id]/deploy` - Bot deployment
- `POST /api/upload` - File uploads
- `POST /api/knowledge/process` - Knowledge processing
- `POST /api/chat/[botId]` - Chat interactions

### Python Backend API
- `POST /process-knowledge` - Process knowledge items
- `GET /health` - Health check

## Deployment

### Frontend (Vercel/Netlify)
1. Connect your repository
2. Set environment variables
3. Deploy

### Python Backend (Railway/Heroku)
1. Create a new service
2. Connect the `python-backend` directory
3. Set environment variables
4. Deploy

### Database (Supabase/PlanetScale)
1. Create a new database
2. Update `DATABASE_URL` in environment variables
3. Run migrations: `npx prisma db push`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
