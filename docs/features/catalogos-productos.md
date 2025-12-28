# Catálogos: Productos

## Propósito

Administración de productos (altas/cambios) y su estatus (activo/inactivo). Productos son la base para compras, ventas, inventario y movimientos.

## Archivos analizados

### Backend

- `GesvenApi/Controllers/ProductosController.cs`
- `GesvenApi/Models/Inventario/Producto.cs`
- `GesvenApi/Models/Auditoria/EstatusGeneral.cs`

### Frontend

- `vite/src/tienda-inventario/services/inventoryService.ts` (CRUD real disponible)
- `vite/src/tienda-inventario/pages/catalogos/Articulos.tsx` (UI actualmente mock)

## Contratos API

- `GET /api/productos?instalacionId=...`
- `GET /api/productos/{id}`
- `POST /api/productos`
- `PUT /api/productos/{id}`
- `POST /api/productos/{id}/estatus` (activar/desactivar)

## Estado actual (madurez)

- Backend: CRUD implementado.
- Frontend: pantalla `Articulos` usa estado local y datos ficticios (aún no consume API).

## Recomendaciones (modernización)

- Conectar `Articulos` a los servicios modulares (`inventoryService`) y eliminar datos ficticios.
- Alinear validaciones UI con backend (campos requeridos, unicidad, estatus).
