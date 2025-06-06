# Togethr

An anonymous AI-moderated group therapy platform designed to provide safe mental health support through virtual group sessions.

## Features

- **Anonymous Participation**: Join sessions with complete anonymity using nicknames
- **AI-Powered Moderation**: Intelligent AI moderators facilitate therapeutic conversations
- **Mental Health Focus Areas**: Support for anxiety, depression, grief, trauma, and more
- **Flexible Participation**: Chat-only or video-enabled session modes
- **Gamification**: XP system and achievement badges to encourage engagement
- **Real-time Communication**: Live chat and video capabilities for authentic connection

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
│   ├── dashboard/          # Dashboard views
│   ├── feedback/           # Session feedback
│   ├── onboarding/         # User onboarding flow
│   ├── profile/            # User profile management
│   ├── session/            # Live session interface
│   └── ui/                 # Reusable UI components
├── data/                   # Static data and configurations
├── lib/                    # Utilities and store
└── types/                  # TypeScript type definitions
```

## Key Components

### Onboarding Flow
- Welcome introduction
- Nickname selection
- Mental health topic selection
- Session preferences
- Avatar customization

### Dashboard
- User statistics and progress
- Session queue management
- Quick access to profile settings

### Live Sessions
- Real-time chat interface
- Video participant grid
- AI moderator interactions
- Session controls

### Feedback System
- Multi-step rating interface
- Detailed feedback collection
- AI-generated session summaries

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
