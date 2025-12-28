# Instrucciones para agentes (GESVENFRONTENDOPCIONES)

## Estructura del repo (monorepo)
- Backend ASP.NET Core (.NET 9): `GesvenApi/` (controllers en `GesvenApi/Controllers/`, EF Core en `GesvenApi/Data/GesvenDbContext.cs`).
- Frontend Vite + React + TS: `vite/` (módulo principal `vite/src/tienda-inventario/`).

## Workflows locales (comandos reales del repo)
- API:
  - Ejecutar: `dotnet run --project GesvenApi/GesvenApi.csproj` (por `GesvenApi/Properties/launchSettings.json` usa `http://localhost:5022`).
  - Configurar DB por env var: `ConnectionStrings__GesvenDb` (ver validación en `GesvenApi/Program.cs`).
  - OpenAPI solo en Development: `app.MapOpenApi()` (ver `GesvenApi/Program.cs`).
- Frontend:
  - Instalar: `cd vite` y `npm install --force` (README del template + React 19).
  - Ejecutar: `npm run dev` (`http://localhost:5173`).
  - API base URL: `VITE_API_URL`; fallback `http://localhost:5022` (ver `vite/src/tienda-inventario/services/core/apiClient.ts`).

## Contrato API y sesión (muy importante)
- Wrapper estándar: todas las respuestas usan `RespuestaApi<T>` con `{ exito, mensaje, datos, errores }` (definición en `GesvenApi/Models/Dtos/Responses/RespuestaApi.cs`).
- Header de usuario: el backend lee `X-Gesven-UsuarioId` y cae a `UsuarioSistemaId = 1` (ver `GesvenApi/Controllers/InstalacionesController.cs` y `GesvenApi/ConstantesGesven.cs`).
- El frontend siempre envía `X-Gesven-UsuarioId` desde la sesión mock (ver `vite/src/providers/auth-provider.tsx` y `vite/src/tienda-inventario/services/core/apiClient.ts`).

## “Instalación activa” como scope transversal
- La mayoría de endpoints y pantallas están scoped por `instalacionId` (route/query/body).
- Frontend persiste `gesven.instalacionActivaId` y protege rutas (ver `docs/frontend/README.md` y `vite/src/providers/modules-provider.tsx`).

## Reglas de dominio que afectan implementación
- Inventario es un ledger: `Inv.Movimiento` guarda `SaldoFinal`; compras/ventas/ajustes/transferencias deben materializarse como movimientos (ejemplo: recepción en `GesvenApi/Controllers/ComprasController.cs`).
- Estatus normalizados por lookup: `IEstatusLookupService` consulta `Aud.EstatusGeneral` (ver `GesvenApi/Services/Implementations/EstatusLookupService.cs` y `GesvenApi/Models/Auditoria/EstatusGeneral.cs`).

## Convenciones del frontend
- Rutas "top-level": `/selector-instalacion`, `/tienda-inventario/*`, `/libreria-gesven/*` (ver `vite/src/providers/modules-provider.tsx`).
- Servicios modularizados por dominio en `vite/src/tienda-inventario/services/`:
  - `core/apiClient.ts`: cliente HTTP base con headers y manejo de respuestas.
  - `securityService.ts`, `inventoryService.ts`, `salesService.ts`, `purchasingService.ts`, `commonService.ts`: endpoints por área.
  - `index.ts`: barrel export de los servicios individuales.
- Tipos de API organizados en `vite/src/tienda-inventario/types/api/` por dominio.
- Para llamadas al backend, usa siempre los servicios modulares individuales; no crees un segundo cliente HTTP sin motivo.

## Planes de refactor (no ejecutar salvo que lo pidan)
- Existe un plan de Clean Architecture: `docs/PlanRefactorGesvenApi.md` y `plan/refactor-gesvenapi-clean-architecture-1.md`.
- No renombres carpetas/namespaces ni muevas capas solo “porque sí”; el backend actual aún usa controllers + EF directo.

## Seguridad (estado actual del repo)
- `GesvenApi/appsettings.json` contiene credenciales de SQL Server en texto plano: no las copies a logs, issues o documentación y evita propagarlas a nuevos archivos.
