# Togethr

An anonymous AI-moderated group therapy platform designed to provide safe mental health support through virtual group sessions.

## 🧪 Live Demo
Try the project live: [togethr-iso.vercel.app](https://togethr-iso.vercel.app)

## Features

### 🎭 Anonymous Participation
Join sessions with complete anonymity using nicknames and custom avatars

### 🤖 AI-Powered Moderation
- **CategoryAwareModerator**: Intelligent AI moderators with category-specific behaviors
- **Dual Mode Support**: Both structured therapy sessions and casual community chat
- **Real-time Analysis**: Message analysis, distress detection, and safety interventions
- **Smart Timing**: Silence detection and context-aware check-ins

### 🧠 Mental Health Focus
Support for 10+ mental health areas: anxiety, depression, grief, trauma, loneliness, self-esteem, and more

### 💬 Two Types of Support
- **Scheduled Group Therapy**: 45-60 minute structured sessions with active moderation
- **Community Chat**: 24/7 always-active support communities (Reddit-style)

### 🎮 Gamification
XP system and achievement badges to encourage engagement and progress

### 🔗 Real-time Communication
Live chat and video capabilities for authentic connection

### 🎨 Personalization
Choose from 12 unique avatars with distinct personalities

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI with shadcn/ui
- **State Management**: Zustand
- **Real-time**: WebRTC for video/audio
- **Validation**: Zod schemas

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/isoguv/togethr.git
cd togethr
```

2. Install dependencies
```bash
npm install
```

3. Run the development server
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
src/
├── app/                    # Next.js app router
├── components/             # React components
│   ├── community/          # Community chat interface
│   ├── dashboard/          # Dashboard views
│   ├── feedback/           # Session feedback
│   ├── moderator/          # AI moderator components
│   ├── onboarding/         # User onboarding flow
│   ├── profile/            # User profile management
│   ├── session/            # Live session interface
│   └── ui/                 # Reusable UI components
├── data/                   # Static data and configurations
│   ├── avatars.ts          # Avatar definitions
│   ├── badges.ts           # Gamification badges
│   └── topics.ts           # Mental health topics
├── lib/                    # Utilities and store
│   ├── moderator/          # AI moderator system
│   └── store.ts            # Zustand state management
└── types/                  # TypeScript type definitions
```

## Key Components

### CategoryAwareModerator System
- **Dual Mode AI**: Adapts behavior for therapy sessions vs. community chat
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
- **Scheduled Sessions**: Structured 45-60 minute group therapy
- **Community Chat**: 24/7 Reddit-style support groups
- Real-time chat with AI moderation
- Video participant grid for sessions
- Anonymous participation with avatars

### Feedback & Analytics
- Multi-step rating interface
- Detailed feedback collection
- AI-generated session summaries
- Participation analytics and insights

## Contributing

This project follows conventional commit standards:

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation updates
- `style:` Code formatting
- `refactor:` Code restructuring
- `test:` Testing improvements

## License

This project is private and proprietary.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
