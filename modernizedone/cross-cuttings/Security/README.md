# Security (cross-cuttings)

This folder contains security-related cross-cutting building blocks.

## Hybrid identity model

- **Authentication** is delegated to an Identity Provider (Microsoft Entra ID in Production).
- **Authorization** uses the local database as source of truth for:
  - user activation status
  - role and permissions
  - assigned installations

Development uses Mock/Development authentication to avoid blocking feature work.
