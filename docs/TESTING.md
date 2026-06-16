# Testing Strategy

## Unit Tests

- Shared scoring and emissions calculations.
- Zod schemas for request contracts.
- Recommendation parsing fallback behavior.

## API Tests

- Health route.
- Auth middleware rejects missing/invalid tokens.
- Route validation rejects malformed payloads.
- User-scoped queries never return another user's documents.
- Report generation aggregates footprints and habit logs correctly.

## Frontend Tests

Recommended additions:

- Component tests for forms and dashboard cards.
- Accessibility checks with axe.
- Playwright flows:
  - register/login
  - save footprint
  - create/log habit
  - create goal
  - generate report
  - generate recommendations

## Manual QA Checklist

- Keyboard-only navigation works.
- Focus indicators are visible.
- Mobile navigation scrolls horizontally without clipping.
- Charts render with meaningful labels.
- API error states do not expose secrets.
- Demo data fallback is clearly labeled.
