# Modernization plan

Approved targets:

- Backend: .NET 9
- Architecture: Modular Monolith (feature modules / vertical slices)
- Frontend: Vite + React with TanStack Query for server state
- Identity: Microsoft Entra ID (Production), with Development Mock Auth
- Authorization: local database as source of truth (roles/permissions/installations)

## Phase 0 — Foundation (cross-cuttings first)

### 0.1 Create the modernized working area

- Create the new structure in [modernizedone/README.md](../modernizedone/README.md).
- Treat `modernizedone/` as the target codebase to migrate into.

### 0.2 Hybrid Identity pattern (Authentication vs Authorization)

Goal: **Entra validates identity**, then the app maps the external identity to a local `Usuarios` row to compute permissions and installation access.

#### Authentication

- Production: Entra ID OpenID Connect / JWT Bearer.
- Development: Mock authentication to avoid blocking work before the Entra tenant is enabled.

#### Authorization

- Local database remains the source of truth:
  - `Usuarios` activation/status
  - role assignments
  - permissions / screen access
  - installation assignments

#### Required abstraction: `ICurrentUserService`

- Cross-cutting contract and baseline implementations live under:
  - [modernizedone/cross-cuttings/Security/CurrentUser](../modernizedone/cross-cuttings/Security/CurrentUser)

Design intent:

- `ICurrentUserService` provides **identity** (claims or mock)
- A separate application service maps identity → local `Usuarios` and loads authorization data

Suggested application-layer services to add later:

- `IUserDirectoryService`: resolves an external identity (email/OID) to local `UsuarioId`
- `IAuthorizationContextService`: returns the set of role/permission/installation grants

#### Dev Mock Auth (recommendation)

- Keep it explicit and environment-scoped:
  - only enabled in `Development`
  - supports selecting a known dev user (config-based) or reading a dev header (e.g., `X-Dev-Email`)

This preserves the Production model while keeping development unblocked.

#### Production Entra Auth (recommendation)

- Validate the Entra token
- Extract claims (`oid`, `preferred_username`, `name`)
- Map to local user and deny if:
  - no local user exists
  - user is inactive
  - user has no installation access

### 0.3 Error handling and API contract

- Keep the existing business-error semantics from `RespuestaApi<T>` where it’s already depended upon.
- Long-term recommendation: introduce RFC7807 ProblemDetails for HTTP-level errors, while still supporting the existing wrapper for business flows.

### 0.4 Auditing

- Replace constant user stamping with real user context once the hybrid identity flow is in place.
- Preserve existing fields (`CreadoEn/Por`, `ActualizadoEn/Por`) and keep them consistent across modules.

### 0.5 Secrets management

- Remove/avoid committed secrets in config files.
- Use environment variables / secret manager for connection strings.

## Phase 1 — Backend modular monolith structure

### 1.1 Target module boundaries

Keep the current ubiquitous language and split into modules (each with its own endpoints, application services, domain, persistence mapping as needed):

- Inventario (ledger + stock calculations)
- Compras (ordenes, recepción)
- Ventas
- Transferencias
- Catálogos (productos, clientes, proveedores, marcas, unidades)
- Organización (empresa/sucursal/instalación)
- Seguridad (usuarios, roles, accesos a instalación)
- Auditoría / Estatus

Reference docs:

- [docs/features/inventario.md](features/inventario.md)
- [docs/features/compras-ordenes-compra.md](features/compras-ordenes-compra.md)
- [docs/features/ventas-y-finanzas.md](features/ventas-y-finanzas.md)
- [docs/features/catalogos-productos.md](features/catalogos-productos.md)
- [docs/features/catalogos-clientes-proveedores.md](features/catalogos-clientes-proveedores.md)
- [docs/features/contexto-instalacion-y-sesion.md](features/contexto-instalacion-y-sesion.md)

### 1.2 Endpoint organization

- Prefer vertical slices:
  - `Modules/<ModuleName>/Endpoints/*`
  - `Modules/<ModuleName>/Application/*`
  - `Modules/<ModuleName>/Domain/*`
  - `Modules/<ModuleName>/Infrastructure/*`

Keep controllers if you prefer, but group by module (not “all controllers in one folder”).

### 1.3 Data access

- EF Core remains.
- Consider:
  - keeping a single DbContext initially (fast migration)
  - moving to per-module configuration gradually

## Phase 2 — Frontend modernization (TanStack Query)

### 2.1 Single API client and types

- Use a typed API client layer (fetch wrapper) that:
  - always sends the current user header only in Development if needed
  - normalizes `RespuestaApi<T>`

### 2.2 TanStack Query adoption path

- Replace `useEffect/useState` server calls in feature hooks with `useQuery/useMutation`.
- Standardize:
  - query keys
  - error normalization
  - loading states

Reference: [docs/frontend/README.md](frontend/README.md)

### 2.3 Mock vs real data cleanup

- Remove mock data sources feature-by-feature as backend endpoints are migrated.

## Phase 3 — Migration order (minimize risk)

1. Contexto instalación + seguridad (hybrid identity mapping)
2. Catálogos base (productos, unidades, marcas, clientes, proveedores)
3. Inventario ledger (movimientos, stock)
4. Compras (OC + recepción)
5. Ventas
6. Transferencias
7. Dashboard

## Testing strategy (incremental)

- Backend:
  - unit tests for domain invariants (ledger calculations)
  - integration tests for endpoints + DbContext
  - auth mapping tests (entra identity → local usuario)
- Frontend:
  - test critical flows: installation selection, OC create/receive, sale creation

## Deliverables for Step 9

- `/modernizedone/` created with cross-cutting security scaffolding.
- This plan document added at [docs/modernization-plan.md](modernization-plan.md).
