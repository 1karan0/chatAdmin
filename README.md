# BotAgent - AI Chatbot Platform

A modern, full-stack chatbot platform for creating and deploying AI-powered chatbots, built with Next.js and TypeScript.

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
- **URL Integration**: Connect your website content
- **File Upload**: Support for multiple document formats
- **Text Input**: Direct content input
- **Smart Processing**: Automated content extraction
- **Knowledge Management**: Organized content storage

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

### Database
- **PostgreSQL** - Primary database with Prisma ORM

## Getting Started

### Prerequisites
- Node.js 18+
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

5. **Start the development server**

Frontend:
```bash
npm run dev
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
│   ├── settings/        # Settings components
│   └── skeletons/       # Loading skeletons
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
The platform handles:
- URL content extraction
- File processing for multiple formats
- Text content management
- Knowledge base organization
- Content indexing for bot training

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

## Deployment

### Frontend (Vercel/Netlify)
1. Connect your repository
2. Set environment variables
3. Deploy

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
