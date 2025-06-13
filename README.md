# unmute 🧠💚

<div align="center">

<pre>
██╗   ██╗███╗   ██╗███╗   ███╗██╗   ██╗████████╗███████╗
██║   ██║████╗  ██║████╗ ████║██║   ██║╚══██╔══╝██╔════╝
██║   ██║██╔██╗ ██║██╔████╔██║██║   ██║   ██║   █████╗  
██║   ██║██║╚██╗██║██║╚██╔╝██║██║   ██║   ██║   ██╔══╝  
╚██████╔╝██║ ╚████║██║ ╚═╝ ██║╚██████╔╝   ██║   ███████╗
 ╚═════╝ ╚═╝  ╚═══╝╚═╝     ╚═╝ ╚═════╝    ╚═╝   ╚══════╝
                                                          
    🧠 Mental Health • 💬 Community Support • 🎮 Gamification • 🔒 Anonymous
</pre>

*Your voice matters. Your story heals. Your community awaits.*

---

**A Next.js mental health platform with Supabase backend** that enables topic-based community support, real-time chat, gamification, and mood tracking for mental wellness.

[![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js%2015-black?logo=nextjs)](https://nextjs.org/)
[![Powered by Supabase](https://img.shields.io/badge/Powered%20by-Supabase-3ECF8E?logo=supabase)](https://supabase.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

</div>

## 🧪 Live Demo
Try the project live: [unmute.social](https://unmute.social)

**🚀 NEW: Now with Supabase Backend!** This version includes real-time chat, persistent data, user authentication, and mood tracking.

## Features

### 🎭 Anonymous Participation
Join sessions with complete anonymity using nicknames and custom avatars

### 🤖 AI-Powered Moderation
- **CategoryAwareModerator**: Intelligent AI moderators with category-specific behaviors
- **Dual Mode Support**: Both structured support circles and casual community chat
- **Real-time Analysis**: Message analysis, distress detection, and safety interventions
- **Smart Timing**: Silence detection and context-aware check-ins

### 🧠 Mental Health Focus
Support for 10+ mental health areas: anxiety, depression, grief, trauma, loneliness, self-esteem, and more

### 💬 Two Types of Support
- **Scheduled Support Circles**: 45-60 minute structured sessions with active moderation
- **Community Chat**: 24/7 always-active support communities (Reddit-style)

### 🎮 Gamification
XP system and achievement badges to encourage engagement and progress

### 🔗 Real-time Communication
Live chat and video capabilities for authentic connection

### 🎨 Personalization
Choose from 12 unique avatars with distinct personalities

## Tech Stack

### **Frontend**
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI with shadcn/ui
- **State Management**: Zustand
- **Real-time**: WebRTC for video/audio + Supabase Realtime
- **Validation**: Zod schemas

### **Backend & Database**
- **[Supabase](https://supabase.com/)** - PostgreSQL database with real-time features
- **[Supabase Auth](https://supabase.com/auth)** - Anonymous authentication system
- **[Supabase Realtime](https://supabase.com/realtime)** - Live chat and updates
- **Row Level Security** - Database-level access control

### **Key Features**
- **Real-time Chat** - Topic-based community chat rooms
- **Mood Tracking** - Daily mood logs with analytics
- **Gamification** - XP, levels, and achievement badges
- **Anonymous Auth** - Privacy-first user system

## Getting Started

### Prerequisites

- **Node.js 18+** and npm/yarn
- **[Supabase Account](https://supabase.com)** (free tier works great!)

### Quick Setup

1. **Clone the repository**
```bash
git clone https://github.com/isoguv/unmute.git
cd unmute
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up Supabase Backend** 🔧
   Follow our **[Supabase Setup Guide](SUPABASE_SETUP.md)** to:
   - Create your Supabase project
   - Run the database schema
   - Configure anonymous authentication
   - Enable real-time features

4. **Configure environment variables**
   Create `.env.local` in your project root:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

5. **Run the development server**
```bash
npm run dev
```

6. **Open [http://localhost:3000](http://localhost:3000)** in your browser

> 📚 **Need help?** Check out our detailed [Supabase Setup Guide](SUPABASE_SETUP.md) for step-by-step instructions!

## Project Structure

```
unmute/
├── src/
│   ├── app/                      # Next.js 15 App Router
│   │   ├── api/                  # API routes (mood trends, etc.)
│   │   ├── chat/[room]/         # Dynamic chat room pages
│   │   └── page.tsx             # Main application page
│   ├── components/              # React components
│   │   ├── ui/                  # Shadcn/ui components
│   │   ├── onboarding/          # User onboarding flow
│   │   ├── community/           # Community chat interface
│   │   ├── dashboard/           # Dashboard views
│   │   ├── mood/                # Mood tracking components
│   │   ├── session/             # Live session interface
│   │   └── profile/             # User profile management
│   ├── lib/
│   │   ├── supabase/            # 🆕 Supabase integration
│   │   │   ├── client.ts        # Supabase client setup
│   │   │   ├── queries.ts       # Database query functions
│   │   │   ├── realtime.ts      # Real-time subscriptions
│   │   │   └── types.ts         # Database type definitions
│   │   ├── store/               # 🆕 Zustand stores
│   │   │   ├── user.ts          # User authentication & profile
│   │   │   ├── chat.ts          # Real-time chat functionality
│   │   │   └── mood.ts          # Mood tracking
│   │   ├── moderator/           # AI moderator system
│   │   └── store.ts             # Legacy unified store
│   ├── types/                   # TypeScript definitions
│   └── data/                    # Static data (avatars, topics, badges)
├── supabase-schema.sql          # 🆕 Database schema setup
├── SUPABASE_SETUP.md           # 🆕 Detailed setup guide
└── public/                     # Static assets
```

### 🆕 New Supabase Integration Features
- **Real-time chat** with topic-based rooms
- **User authentication** with anonymous login
- **Persistent mood tracking** with analytics
- **Gamification system** with XP and badges
- **Row-level security** for data privacy

## Key Components

### CategoryAwareModerator System
- **Dual Mode AI**: Adapts behavior for support circles vs. community chat
- **Category-Specific Prompts**: Tailored responses for 10+ mental health topics
- **Safety-First**: Crisis detection and professional support encouragement
- **Smart Timing**: Configurable silence detection and check-in intervals

### Onboarding Flow
- Welcome introduction and privacy explanation
- Nickname selection with validation
- Mental health topic selection (10+ categories)
- Session preferences (chat/video modes)
- Avatar customization (12 unique options)

### Dashboard
- **Dual Access**: Both scheduled sessions and community chat
- User statistics and progress tracking
- Session queue management with wait times
- Quick mood tracking and crisis support access

### Live Sessions & Community Chat
- **Scheduled Sessions**: Structured 45-60 minute support circles
- **Community Chat**: 24/7 Reddit-style support groups
- Real-time chat with AI moderation
- Video participant grid for sessions
- Anonymous participation with avatars

### Feedback & Analytics
- Multi-step rating interface
- Detailed feedback collection
- AI-generated session summaries
- Participation analytics and insights

## 🗄️ Database Schema

The Supabase backend includes four main tables:

- **`users`** - User profiles with gamification data (XP, level, streaks)
- **`messages`** - Chat messages organized by topic-based rooms  
- **`badges`** - Achievement system for user engagement
- **`moods`** - Daily mood tracking with analytics and trends

All tables include **Row Level Security (RLS)** policies to ensure users can only access their own data while enabling public community chat.

## 🚀 Deployment

### Deploy to Vercel

1. **Push to GitHub** and connect your repository to Vercel
2. **Add environment variables** in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. **Update Supabase Auth settings** with your production domain
4. **Deploy** - your app will be live in minutes!

### Production Checklist
- ✅ Supabase project created and configured
- ✅ Database schema deployed
- ✅ Anonymous authentication enabled  
- ✅ Real-time features activated
- ✅ Environment variables set in Vercel
- ✅ Domain added to Supabase Auth settings

## Contributing

We welcome contributions that help improve mental health support! 

### Priority Areas
- **🧠 Mental Health Features** - Therapist feedback on user experience
- **♿ Accessibility** - Making the platform inclusive for all users  
- **🌐 Internationalization** - Multi-language support
- **📱 Mobile Experience** - Responsive design improvements
- **🔒 Security** - Privacy and security enhancements

### Commit Standards
- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation updates
- `style:` Code formatting
- `refactor:` Code restructuring
- `test:` Testing improvements

## License

This project is private and proprietary.

## ⚠️ Important Disclaimer

**unmute is designed to supplement, not replace, professional mental health care.** 

- This platform provides peer support and self-help tools
- Always consult qualified mental health professionals for serious concerns
- In crisis situations, contact emergency services immediately

### Crisis Resources
- **US National Suicide Prevention Lifeline**: 988
- **Crisis Text Line**: Text HOME to 741741
- **International Crisis Lines**: [iasp.info/resources/Crisis_Centres](https://www.iasp.info/resources/Crisis_Centres/)

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
