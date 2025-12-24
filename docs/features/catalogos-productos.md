# Catálogos: Productos

## Propósito

Administración de productos (altas/cambios) y su estatus (activo/inactivo). Productos son la base para compras, ventas, inventario y movimientos.

## Archivos analizados

### Backend

- `GesvenApi/Controladores/ProductosController.cs`
- `GesvenApi/Modelos/Inventario/Producto.cs`
- `GesvenApi/Modelos/Auditoria/EstatusGeneral.cs`

### Frontend

- `vite/src/tienda-inventario/services/gesvenApi.ts` (CRUD real disponible)
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

- Conectar `Articulos` al `gesvenApi` y eliminar datos ficticios.
- Alinear validaciones UI con backend (campos requeridos, unicidad, estatus).
