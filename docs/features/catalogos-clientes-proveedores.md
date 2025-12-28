# Catálogos: Clientes y Proveedores

## Propósito

- Clientes: alta y mantenimiento para ventas, cuentas por cobrar, facturación.
- Proveedores: alta y mantenimiento para compras y recepción.

## Archivos analizados

### Backend

- `GesvenApi/Controllers/ClientesController.cs`
- `GesvenApi/Controllers/ProveedoresController.cs`
- `GesvenApi/Models/Ventas/Cliente.cs`
- `GesvenApi/Models/Compras/Proveedor.cs`

### Frontend

- `vite/src/tienda-inventario/services/salesService.ts` (clientes CRUD real)
- `vite/src/tienda-inventario/services/purchasingService.ts` (proveedores CRUD real)
- `vite/src/tienda-inventario/pages/catalogos/ClientesProveedores.tsx` (UI actualmente mock)

## Contratos API

### Clientes

- `GET /api/clientes?instalacionId=...`
- `GET /api/clientes/{id}`
- `POST /api/clientes`
- `PUT /api/clientes/{id}`
- `POST /api/clientes/{id}/estatus`

### Proveedores

- `GET /api/proveedores`

## Estado actual (madurez)

- Backend: endpoints implementados.
- Frontend: la pantalla de clientes/proveedores aplica validaciones locales (RFC/uniquidad) con datos ficticios.

## Recomendaciones (modernización)

- Conectar UI a endpoints reales y mover reglas de unicidad/validación crítica al backend.
