# GESVEN — documentación (análisis)

## Propósito del sistema

GESVEN modela operaciones típicas de una tienda/almacén: compras, inventario (ledger), transferencias, ventas y catálogos, con operación **scoped por instalación**.

Documento de contexto: [Propósito y stakeholders](proposito-y-stakeholders.md).

## Stack (detectado)

- Backend: ASP.NET Core (.NET 9) + EF Core + SQL Server.
- Frontend: Vite + React (Router) + Tailwind, con un módulo principal `tienda-inventario`.

## Índice de features

- [Contexto de instalación y sesión](features/contexto-instalacion-y-sesion.md)
- [Inventario](features/inventario.md)
- [Compras (OC)](features/compras-ordenes-compra.md)
- [Catálogo de productos](features/catalogos-productos.md)
- [Clientes y proveedores](features/catalogos-clientes-proveedores.md)
- [Ventas y finanzas](features/ventas-y-finanzas.md)
- [Dashboard](features/dashboard.md)
- [Administración (prototipo)](features/administracion-accesos-y-auditoria.md)

## Documentos transversales

- Frontend: `docs/frontend/README.md`
- Cross-cuttings: `docs/cross-cuttings/README.md`

## Notas recientes del backend (para integración frontend)

- Mapeo DTOs: los controllers centralizan el mapeo Entidad→DTO con AutoMapper (profiles en `GesvenApi/Mapping/`).
- Tipos de IDs: algunos IDs pueden ser `bigint` en BD (p. ej., `MovimientoId`), así que evita suposiciones de 32 bits en frontend.
- Script de base de datos: `GesvenApi/Scripts/DBGESVENFULL.sql` contiene el esquema completo de la base de datos.

## Estructura del backend refactorizada

- Controllers: `GesvenApi/Controllers/` (antes `Controladores/`)
- Models: `GesvenApi/Models/` (antes `Modelos/`)
- DTOs: `GesvenApi/Models/Dtos/` con subdirectorios `Requests/` y `Responses/`
- Services: `GesvenApi/Services/` con subdirectorios `Implementations/` e `Interfaces/`
- Data: `GesvenApi/Data/` (antes `Datos/`)

## Nota sobre madurez

Varias pantallas del frontend todavía operan con datos ficticios; los servicios modulares en `vite/src/tienda-inventario/services/` ya tienen gran parte del mapa de endpoints para completar la integración.
