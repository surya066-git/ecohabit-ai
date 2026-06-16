# Deployment Guide

## Recommended Topology

- **Web**: Vercel or another Next.js-capable hosting provider.
- **API**: Render, Fly.io, Railway, Google Cloud Run, AWS ECS, or Kubernetes.
- **Database**: MongoDB Atlas.
- **Authentication**: Firebase Authentication.
- **AI**: Gemini API.

## Build Commands

Root build:

```bash
npm ci
npm run build
```

Web only:

```bash
npm run build -w @ecohabit/web
npm run start -w @ecohabit/web
```

API only:

```bash
npm run build -w @ecohabit/api
npm run start -w @ecohabit/api
```

## Deployment Steps

1. Create a Firebase project and enable Email/Password plus optional Google sign-in.
2. Create a MongoDB Atlas cluster and database user.
3. Create a Gemini API key.
4. Deploy the API with `MONGODB_URI`, Firebase Admin credentials, `GEMINI_API_KEY`, and `CORS_ORIGIN`.
5. Deploy the web app with `NEXT_PUBLIC_FIREBASE_*` and `NEXT_PUBLIC_API_URL`.
6. Add the web domain to Firebase authorized domains.
7. Set `CORS_ORIGIN` to the deployed web origin.
8. Run smoke tests:
   - `GET /api/v1/health`
   - Sign in
   - Save footprint
   - Generate report
   - Generate recommendations

## CI

The included GitHub Actions workflow installs dependencies, typechecks, tests, lints, and builds on pull requests and pushes to `main`.
