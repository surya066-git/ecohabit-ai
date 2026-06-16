# API Architecture

Base path: `/api/v1`

All routes except `/health` require:

```http
Authorization: Bearer <firebase-id-token>
```

## Routes

| Method | Route | Purpose |
| --- | --- | --- |
| GET | `/health` | Service health |
| GET | `/me` | Get or create current user profile |
| PATCH | `/me` | Update preferences |
| GET | `/footprints` | List footprint entries |
| POST | `/footprints/calculate` | Validate calculator input, calculate breakdown, save entry |
| GET | `/habits` | List active habits |
| POST | `/habits` | Create habit |
| PATCH | `/habits/:id` | Update/archive habit |
| POST | `/habits/:id/logs` | Log habit completion |
| GET | `/goals` | List goals |
| POST | `/goals` | Create goal |
| PATCH | `/goals/:id` | Update progress/status |
| DELETE | `/goals/:id` | Pause goal |
| GET | `/recommendations` | List non-dismissed recommendations |
| POST | `/recommendations/generate` | Generate and save Gemini recommendations |
| PATCH | `/recommendations/:id` | Accept or dismiss recommendation |
| GET | `/reports?period=weekly` | List reports |
| POST | `/reports/generate?period=monthly` | Generate weekly/monthly report |
| GET | `/achievements` | List unlocked badges |
| GET | `/analytics/dashboard` | Dashboard aggregate |

## Design Choices

- **Zod validation at route boundaries** rejects malformed requests before model operations.
- **User scoping in every query** prevents access to another user's documents even when IDs are guessed.
- **Rate limiting and Helmet** are global middleware.
- **Report generation is idempotent per period** using upsert behavior.
- **Gemini output is parsed and validated** before persistence.
