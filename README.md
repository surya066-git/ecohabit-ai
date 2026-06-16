# EcoHabit AI

EcoHabit AI is a production-oriented carbon footprint awareness platform. It is intentionally more than a calculator: users log footprint periods, track behavior habits, receive AI recommendations, monitor weekly/monthly reports, set reduction goals, earn badges, and watch an Eco Score change over time.

## Architecture Decisions

1. **Monorepo with separated apps**: `apps/web` owns the Next.js App Router experience, `apps/api` owns secure business APIs, and `packages/shared` owns schemas, scoring, and emissions logic. This prevents credential leakage and keeps domain rules consistent.
2. **Express API as source of truth**: reports, achievements, scoring updates, Gemini calls, and MongoDB writes happen server-side where they can be authenticated, validated, rate-limited, and audited.
3. **Firebase Authentication plus Firebase Admin verification**: the client signs users in; the API verifies ID tokens on every protected route. User IDs are never trusted from request bodies.
4. **Behavior-first data model**: footprints, habits, goals, reports, recommendations, and achievements are separate collections so the product can support streaks, progress history, gamification, and coaching.
5. **Shared Zod contracts**: request validation and TypeScript types come from `@ecohabit/shared` to reduce API/frontend drift.
6. **Mobile-first accessible UI**: the first screen is the dashboard workflow, not a marketing page. Controls use labels, focus states, semantic sections, reduced-motion handling, and keyboard-friendly primitives.

## Folder Structure

```text
.
├── apps
│   ├── api
│   │   ├── src/config
│   │   ├── src/middleware
│   │   ├── src/models
│   │   ├── src/routes
│   │   ├── src/services
│   │   ├── src/tests
│   │   └── src/utils
│   └── web
│       ├── src/app
│       ├── src/components
│       ├── src/lib
│       └── src/providers
├── packages
│   └── shared
│       └── src
└── docs
```

## Quick Start

```bash
npm install
cp .env.example .env
npm run dev
```

The web app runs on `http://localhost:3000`. The API runs on `http://localhost:4000/api/v1`.

Until Firebase, MongoDB Atlas, and Gemini environment variables are configured, the frontend shows realistic demo data for review while protected API calls fail safely.

## Environment Variables

Copy `.env.example` to `.env`. Required for a live deployment:

- `MONGODB_URI`: MongoDB Atlas connection string.
- `FIREBASE_SERVICE_ACCOUNT_BASE64`: base64 service account JSON for Firebase Admin, preferred in production.
- `NEXT_PUBLIC_FIREBASE_*`: Firebase web app config for client authentication.
- `GEMINI_API_KEY`: Gemini API key for AI recommendations.
- `CORS_ORIGIN`: comma-separated allowed frontend origins.

## Scripts

```bash
npm run dev        # API and web concurrently
npm run build      # shared, API, then web
npm run test       # shared and API tests
npm run lint       # API and web lint
npm run typecheck  # strict TypeScript checks
```

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [Database Schema](docs/DATABASE_SCHEMA.md)
- [API Architecture](docs/API.md)
- [Component Hierarchy](docs/COMPONENT_HIERARCHY.md)
- [UI Wireframes](docs/WIREFRAMES.md)
- [Authentication Flow](docs/AUTHENTICATION.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [Testing Strategy](docs/TESTING.md)
- [Security Checklist](docs/SECURITY.md)
- [Performance Strategy](docs/PERFORMANCE.md)

## Official References Checked

- Next.js App Router route handlers: https://nextjs.org/docs/app/getting-started/route-handlers
- Firebase Authentication for web: https://firebase.google.com/docs/auth/web/start
- Gemini API docs: https://ai.google.dev/gemini-api/docs
- Mongoose TypeScript docs: https://mongoosejs.com/docs/typescript.html
