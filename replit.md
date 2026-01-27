# DraftGenius AI - League of Legends Draft Assistant

## Overview

DraftGenius AI is a League of Legends draft assistant application that provides AI-powered pick/ban recommendations, team composition analysis, and win probability calculations. The application simulates a 5v5 draft with ban and pick phases, offering real-time suggestions based on champion statistics, synergies, and counter-picks.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite with custom plugin support for Replit integration
- **Routing**: Wouter (lightweight React router)
- **State Management**: React Context API for draft state, TanStack Query for server state
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom gaming-inspired dark theme, CSS variables for theming

### Backend Architecture
- **Framework**: Express 5 with TypeScript
- **API Pattern**: RESTful endpoints under `/api/*`
- **AI Integration**: OpenAI API (via Replit AI Integrations) for draft recommendations
- **Build Process**: Custom esbuild script for production bundling, Vite dev server for development

### Data Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Location**: `shared/schema.ts` for shared types between client/server
- **Champion Data**: In-memory storage with mock data (comprehensive champion database with stats, counters, synergies)
- **Session Storage**: connect-pg-simple for session management

### Key Design Patterns
- **Shared Types**: TypeScript schemas in `shared/` directory used by both client and server
- **Component Structure**: Feature-based organization under `client/src/components/draft/`
- **Path Aliases**: `@/` for client source, `@shared/` for shared code
- **Draft Logic**: Context-based state management with turn ordering, timer, and phase tracking

### Application Features
- Draft simulation with 10 bans and 10 picks (alternating blue/red sides)
- AI recommendations for optimal bans/picks based on team composition
- Real-time analytics including early/mid/late game strength meters
- Win probability calculations
- Champion search and role filtering
- Gaming-inspired dark UI with blue team/red team visual distinction

## External Dependencies

### AI Services
- **OpenAI API**: Used for generating draft recommendations (accessed via Replit AI Integrations)
  - Environment variables: `AI_INTEGRATIONS_OPENAI_API_KEY`, `AI_INTEGRATIONS_OPENAI_BASE_URL`

### Database
- **PostgreSQL**: Primary database for user data and sessions
  - Environment variable: `DATABASE_URL`
  - Migrations stored in `/migrations` directory

### External Data Sources
- **Riot Data Dragon CDN**: Champion portrait images (`https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/`)

### Key NPM Packages
- `drizzle-orm` / `drizzle-kit`: Database ORM and migrations
- `@tanstack/react-query`: Server state management
- `@radix-ui/*`: Accessible UI primitives
- `zod`: Runtime type validation
- `openai`: OpenAI API client