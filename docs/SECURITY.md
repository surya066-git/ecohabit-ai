# Security Checklist

## Authentication and Authorization

- [x] API requires Firebase ID token for protected routes.
- [x] API verifies token server-side with Firebase Admin.
- [x] All database queries scope by `firebaseUid`.
- [x] Client never sends trusted user IDs in request bodies.

## API Hardening

- [x] Helmet enabled.
- [x] CORS allowlist via `CORS_ORIGIN`.
- [x] Global JSON payload limit.
- [x] Global rate limiting.
- [x] Zod validation at route boundaries.
- [x] Generic production error messages.

## Secrets

- [x] Admin credentials stay in API env only.
- [x] Gemini key stays in API env only.
- [x] `.env` ignored by Git.
- [x] Service account base64 supported for deployment platforms.

## Data Protection

- [ ] Enable MongoDB Atlas network allowlist or private networking.
- [ ] Enable MongoDB auditing where available.
- [ ] Set backup policy and retention.
- [ ] Add application-level audit log for sensitive profile changes.
- [ ] Add deletion/export workflow for privacy compliance.

## Abuse Controls

- [ ] Add per-user AI generation quota.
- [ ] Add bot protection on auth forms if abuse appears.
- [ ] Add anomaly alerts for API error spikes and token verification failures.
