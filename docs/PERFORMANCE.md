# Performance Optimization Strategy

## Frontend

- Use App Router route boundaries and client components only where interactivity is required.
- Keep dashboard charts inside fixed-height responsive containers to prevent layout shift.
- Use shared demo data fallback for review states, but prefer API data after authentication.
- Lazy-load heavier future modules such as detailed reports or onboarding surveys.
- Keep color and spacing tokens in CSS variables to avoid duplicated styles.

## Backend

- Index all user-scoped query patterns.
- Limit list endpoints and sort by indexed fields.
- Keep request payloads under `1mb`.
- Use report upserts so repeated generation is idempotent.
- Validate Gemini output before writing to MongoDB.
- Cache or queue AI recommendation generation if traffic grows.

## Database

- Use MongoDB Atlas metrics to watch read/write latency and index use.
- Add TTL or archival policies for stale dismissed recommendations if storage grows.
- Consider separating habit logs into their own collection if embedded arrays become large.

## Observability

- Pino HTTP logs are enabled in the API.
- Add request IDs and structured error reporting before production launch.
- Track core product metrics: footprint entries per user, habit completion rate, report generation, recommendation acceptance.
