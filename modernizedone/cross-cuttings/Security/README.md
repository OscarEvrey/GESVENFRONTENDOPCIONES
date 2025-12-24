# Security (cross-cuttings)

This folder contains security-related cross-cutting building blocks.

## Hybrid identity model

- **Authentication** is delegated to an Identity Provider (Microsoft Entra ID in Production).
- **Authorization** uses the local database as source of truth for:
  - user activation status
  - role and permissions
  - assigned installations

Development uses Mock/Development authentication to avoid blocking feature work. In Development the `ICurrentUserService` reads the optional headers `X-Dev-Email`, `X-Dev-DisplayName`, `X-Dev-Oid` and `X-Dev-UsuarioId` (or the `DevAuthentication` defaults from configuration) to provide a consistent identity contract without Entra.

Authorization context: `/api/current-user/context` consumes a dev-only resolver seeded by `DevAuthorization.Users` to return local `UsuarioId`, roles e instalaciones. Production resolver to be implemented once database wiring is available.
