# modernizedone

This folder contains the **modernized target structure** for GESVEN.

## Structure

- `ModernizedOne.sln`: solution wiring Api + CrossCuttings.
- `cross-cuttings/`: shared building blocks used across the modular monolith (security, error handling, logging, validation, etc.).
- `src/ModernizedOne.Api`: minimal ASP.NET Core host with hybrid identity wiring.
- `src/Modules/`: feature module boundaries aligned to the modernization plan.
- `tests/`: unit/integration tests for the modernized solution.
- `docs/`: modernization-specific notes.

## Key decision: Hybrid Identity

- **Authentication**: Microsoft Entra ID (Production) only.
- **Authorization**: Local database is the source of truth (roles, permissions, installation assignments).
- **Development**: uses a Mock/Development auth strategy so teams can work without an active Entra tenant.

### Dev identity usage

- Headers (Development only): `X-Dev-Email`, `X-Dev-DisplayName`, `X-Dev-Oid`, `X-Dev-UsuarioId`.
- Config fallback: `DevAuthentication` section in `appsettings.Development.json`.
- Endpoints:
	- `/api/current-user` returns the resolved identity.
	- `/api/current-user/context` resolves local `UsuarioId`/roles/instalaciones (dev-mapped until production resolver is added).
	- `/api/current-user/ping` is a liveness check.
- Health check: `/health`.

See [docs/modernization-plan.md](../docs/modernization-plan.md) for the migration plan.
