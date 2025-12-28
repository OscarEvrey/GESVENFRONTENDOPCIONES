# Contexto de instalación y sesión (frontend↔backend)

## Propósito

Este feature define:

- Cómo el usuario elige una **instalación activa** (almacén/oficinas).
- Cómo el frontend identifica al usuario hacia el backend (header **`X-Gesven-UsuarioId`**).
- Cómo se protegen rutas para evitar operar sin instalación activa.

## Archivos analizados

### Frontend

- `vite/src/providers/modules-provider.tsx` (rutas y módulos)
- `vite/src/providers/auth-provider.tsx` (sesión mock)
- `vite/src/tienda-inventario/layout/LayoutProtegido.tsx` (guard de rutas)
- `vite/src/tienda-inventario/context/ContextoInstalacion.tsx` (estado instalación)
- `vite/src/tienda-inventario/pages/contexto/SelectorInstalacion.tsx` (UI selector)
- `vite/src/tienda-inventario/services/core/apiClient.ts` (inyección header usuario)
- `vite/src/tienda-inventario/services/securityService.ts` (endpoints de instalaciones)

### Backend

- `GesvenApi/Controllers/InstalacionesController.cs`
- `GesvenApi/Models/Organizacion/Instalacion.cs`
- `GesvenApi/Data/GesvenDbContext.cs` (filtros/auditoría por usuario)

## Flujo principal

### 1) Inicialización de “sesión” en el frontend

- `AuthProvider` crea una sesión **mock** (sin login real), y define un `userId` actual.
- `apiClient.ts` (en `services/core/`) inyecta `X-Gesven-UsuarioId` en cada request.

**Observación**: esta sesión es una estrategia temporal (útil para prototipado), pero no provee autenticación real.

### 2) Selección de instalación

- El selector carga instalaciones desde backend (fetch real):
  - `GET /api/instalaciones`
- La instalación elegida se persiste en `localStorage` (`gesven.instalacionActivaId`).

### 3) Protección de rutas

- `LayoutProtegido` redirige a `/selector-instalacion` si no hay instalación activa.

## Contratos API

- `GET /api/instalaciones`
  - Devuelve un `RespuestaApi<List<InstalacionDto>>` (wrapper de éxito/mensaje/errores).

## Estado actual (madurez)

- Selector de instalación: **integrado a backend**.
- Sesión/identidad de usuario: **mock**, basada en localStorage.

## Riesgos y deuda técnica

- No hay autenticación/autorización real en frontend ni enforcement server-side más allá del `X-Gesven-UsuarioId`.
- El header `X-Gesven-UsuarioId` es trivial de falsificar si se expone públicamente.

## Recomendaciones (modernización)

- Reemplazar sesión mock por auth real (JWT/cookies, refresh tokens) y autorización en backend.
- Mantener el concepto de instalación activa como un “scope” de operación (muy útil), pero validar server-side.
