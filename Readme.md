# DraftGenius AI - League of Legends Draft Assistant

> **Built for the [Cloud9 x JetBrains Hackathon](https://cloud9.devpost.com/)** - Sky's the Limit  
> *Reimagine the future. Make it happen. With code.*

[![Live Demo](https://img.shields.io/badge/Live-Demo-blue)](https://draftgenius-ai.replit.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Hackathon](https://img.shields.io/badge/Cloud9%20x%20JetBrains-Hackathon-orange)](https://cloud9.devpost.com/)

## 🎯 Overview

DraftGenius AI is an AI-powered League of Legends draft assistant that provides real-time pick/ban recommendations, team composition analysis, and win probability predictions. Built for esports teams, coaches, and players, this tool helps optimize the draft phase with data-driven insights.

**Live Application:** [https://draftgenius-ai.replit.app](https://draftgenius-ai.replit.app)

## 🏆 Hackathon Category

**Category 1 - Draft & Pick/Ban Analysis**  
This project addresses one of the most critical phases in competitive League of Legends: the draft. By leveraging AI and comprehensive champion data, DraftGenius AI helps teams make better strategic decisions during pick/ban phases.

## ✨ Key Features

- **AI-Powered Recommendations**: Get intelligent ban and pick suggestions based on current game state
- **Real-Time Draft Simulation**: Full 5v5 draft experience with 10 bans and 10 picks
- **Team Composition Analysis**: Visual analytics showing early/mid/late game strength
- **Win Probability Calculations**: Data-driven predictions based on team compositions
- **Champion Database**: Comprehensive stats including counters, synergies, and role classifications
- **Smart Search & Filtering**: Find champions quickly by name or role
- **Gaming-Inspired UI**: Dark theme with blue/red team visual distinction

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for blazing-fast development
- **Tailwind CSS** with custom gaming theme
- **shadcn/ui** component library (Radix UI primitives)
- **Wouter** for lightweight routing
- **TanStack Query** for server state management

### Backend
- **Express 5** with TypeScript
- **OpenAI API** for AI-powered recommendations
- **PostgreSQL** with Drizzle ORM
- **RESTful API** architecture

### Development Tools
- **TypeScript** for type safety
- **esbuild** for production bundling
- **Zod** for runtime validation
- Custom path aliases for clean imports

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- OpenAI API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/mja2001/DraftGenius-AI.git
cd DraftGenius-AI
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Create a .env file with:
DATABASE_URL=your_postgresql_connection_string
AI_INTEGRATIONS_OPENAI_API_KEY=your_openai_api_key
AI_INTEGRATIONS_OPENAI_BASE_URL=https://api.openai.com/v1
```

4. Run database migrations:
```bash
npm run db:push
```

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:5000](http://localhost:5000) in your browser

## 📊 How It Works

1. **Ban Phase**: Each team alternates banning champions (3 bans per side, twice)
2. **Pick Phase**: Teams alternate picking champions following standard League of Legends draft order
3. **AI Analysis**: After each action, the AI analyzes the current state and provides recommendations
4. **Team Analytics**: Real-time visualization of team composition strengths across game phases
5. **Win Probability**: Dynamic calculation based on champion matchups and synergies

## 🎮 Draft Flow

```
Blue Ban 1 → Red Ban 1 → Blue Ban 2 → Red Ban 2 → Blue Ban 3 → Red Ban 3
↓
Blue Pick 1 → Red Pick 1 → Red Pick 2 → Blue Pick 2 → Blue Pick 3
↓
Red Ban 4 → Blue Ban 4 → Red Ban 5 → Blue Ban 5
↓
Red Pick 3 → Blue Pick 4 → Blue Pick 5 → Red Pick 4 → Red Pick 5
```

## 🧠 AI Integration

The application uses OpenAI's API to provide intelligent draft recommendations by:
- Analyzing current team compositions
- Evaluating champion synergies and counter-picks
- Considering early/mid/late game power spikes
- Factoring in role balance and team needs

## 📁 Project Structure

```
DraftGenius-AI/
├── client/              # React frontend
│   └── src/
│       ├── components/  # UI components
│       ├── hooks/       # Custom React hooks
│       └── lib/         # Utilities
├── server/              # Express backend
│   ├── routes.ts        # API endpoints
│   └── ai.ts           # OpenAI integration
├── shared/              # Shared types & schemas
│   └── schema.ts
└── migrations/          # Database migrations
```

## 🎨 Design Philosophy

DraftGenius AI features a gaming-inspired dark interface with:
- Blue team (left) vs Red team (right) visual separation
- Real-time status indicators and timers
- Smooth animations and transitions
- Responsive design for all screen sizes
- Accessible UI components

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run db:push` - Push database schema changes
- `npm run db:studio` - Open Drizzle Studio

## 🏅 Hackathon Highlights

This project demonstrates:
- **Quality Software Development**: Clean architecture with TypeScript, proper separation of concerns, and production-ready code
- **AI Integration**: Practical use of OpenAI API for real-world esports applications
- **User Experience**: Thoughtful UI/UX design tailored for competitive gaming
- **Potential Impact**: Addresses a real need in the esports coaching and analysis space

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Cloud9** and **JetBrains** for hosting this amazing hackathon
- **GRID** for providing esports data APIs
- **Riot Games** for champion data and imagery (via Data Dragon CDN)
- The League of Legends esports community

## 📧 Contact

For questions or feedback about this project, please open an issue on GitHub.

---

**Built for the Cloud9 x JetBrains Hackathon**  
