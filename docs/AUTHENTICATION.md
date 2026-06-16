# Authentication Flow

1. User signs in with Firebase Authentication in `apps/web`.
2. Firebase returns a client user session.
3. Before each API call, the frontend calls `currentUser.getIdToken()`.
4. The token is sent as `Authorization: Bearer <token>`.
5. Express middleware verifies the token with Firebase Admin.
6. The decoded `uid` is attached to `req.auth`.
7. Every model query scopes by `firebaseUid: req.auth.uid`.

## Why Firebase Auth

- Mature email/password and federated provider support.
- Client SDK handles session persistence and refresh.
- Admin SDK provides server-side verification without storing passwords.
- MongoDB documents can be keyed by immutable Firebase UID.

## Production Notes

- Enable only required providers in Firebase Console.
- Configure authorized domains.
- Use `FIREBASE_SERVICE_ACCOUNT_BASE64` instead of storing a JSON file on disk.
- Never expose Firebase Admin credentials to `NEXT_PUBLIC_*` variables.
