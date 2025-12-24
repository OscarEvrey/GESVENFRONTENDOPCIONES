# modernizedone

This folder contains the **modernized target structure** for GESVEN.

## Structure

- `cross-cuttings/`: shared building blocks used across the modular monolith (security, error handling, logging, validation, etc.)
- `src/`: the future modular monolith source code (feature modules + shared kernel)
- `tests/`: unit/integration tests for the modernized solution
- `docs/`: modernization-specific notes

## Key decision: Hybrid Identity

- **Authentication**: Microsoft Entra ID (Production) only.
- **Authorization**: Local database is the source of truth (roles, permissions, installation assignments).
- **Development**: uses a Mock/Development auth strategy so teams can work without an active Entra tenant.

See [docs/modernization-plan.md](../docs/modernization-plan.md) for the migration plan.
