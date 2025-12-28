# Frontend (Vite + React) — análisis

## Estructura

- `vite/src/App.tsx`: composición de providers y router.
- `vite/src/providers/modules-provider.tsx`: define rutas de alto nivel:
  - `/selector-instalacion` (selector)
  - `/tienda-inventario/*` (módulo principal)
  - `/libreria-gesven/*` (librería/prototipos)

## Sesión y “usuario”

- `vite/src/providers/auth-provider.tsx`: sesión mock en localStorage.
- `vite/src/tienda-inventario/services/core/apiClient.ts`: cliente HTTP base que envía `X-Gesven-UsuarioId` en requests.

## Arquitectura de Servicios

El módulo de servicios está modularizado por dominio:

```
vite/src/tienda-inventario/services/
├── core/
│   └── apiClient.ts          # Cliente HTTP base, headers, manejo de respuestas
├── index.ts                  # Barrel export de servicios individuales
├── securityService.ts        # Endpoints de seguridad/usuarios/roles/accesos
├── inventoryService.ts       # Endpoints de inventario/movimientos/ajustes
├── salesService.ts           # Endpoints de ventas/clientes
├── purchasingService.ts      # Endpoints de compras/proveedores/OC
└── commonService.ts          # Endpoints comunes (instalaciones, dashboard)
```

**Uso:** Importar servicios individuales por dominio:

```typescript
import { inventoryService, securityService } from '@/tienda-inventario/services';

// Ejemplos de uso
const inventario = await inventoryService.obtenerInventarioActual(instalacionId);
const menu = await securityService.obtenerMenuUsuario(instalacionId);
```

## Tipos de API

Los tipos se han organizado por dominio:

```
vite/src/tienda-inventario/types/
├── index.ts                  # Tipos de UI y exportaciones
└── api/
    ├── commonTypes.ts        # RespuestaApi<T>, tipos base
    ├── inventoryTypes.ts     # Tipos de inventario/movimientos
    ├── salesTypes.ts         # Tipos de ventas/clientes
    ├── purchasingTypes.ts    # Tipos de compras/proveedores
    └── securityTypes.ts      # Tipos de seguridad/usuarios
```

## Contrato API (puntos a tener en cuenta)

- Respuestas: el backend usa un wrapper consistente `RespuestaApi<T>` (`exito`, `mensaje`, `datos`, `errores`).
- IDs: algunos identificadores pueden provenir como `bigint` desde SQL Server (p. ej. `MovimientoId`), por lo que el frontend no debe asumir `int32`.
- Evolución de DTOs: el mapeo Entidad→DTO está centralizado en AutoMapper; al integrar pantallas, tomar los DTOs como fuente de verdad del shape.

## Instalación activa

- `vite/src/tienda-inventario/context/ContextoInstalacion.tsx`:
  - Carga instalaciones del backend.
  - Persiste `gesven.instalacionActivaId`.
- `vite/src/tienda-inventario/layout/LayoutProtegido.tsx`: guard de rutas.

## Data fetching

- `vite/src/tienda-inventario/services/core/apiClient.ts`: cliente fetch central con manejo estándar de respuestas.
- `vite/src/tienda-inventario/hooks/useGesvenApi.ts`: hooks con `useEffect/useState`.

## Estado actual: integración real vs mock

- Integrado a backend: selector de instalación; creación de OC; cargas de proveedores/productos para compra.
- Mayormente mock: dashboard, ventas/finanzas, transferencias, ajustes, kardex, aprobaciones, catálogos, administración.

## Deuda técnica destacada

- Mezcla de fuentes de verdad (mock + backend) en algunas rutas.
- Stack incluye TanStack Query, pero los hooks actuales no lo usan (o lo usan mínimamente).
