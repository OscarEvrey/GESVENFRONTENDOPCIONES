# Ventas y Finanzas (ventas, facturación, pagos)

## Propósito

- Ventas: registrar salidas de inventario y generar documentos de venta.
- Facturación: adjuntar XML/PDF de CFDI o documentos.
- Pagos: cuentas por cobrar y aplicación de pagos.

## Archivos analizados

### Backend

- `GesvenApi/Controllers/VentasController.cs`
- `GesvenApi/Models/Ventas/Venta.cs`
- `GesvenApi/Models/Ventas/VentaDetalle.cs`
- `GesvenApi/Models/Inventario/Movimiento.cs` (salida por venta)

### Frontend

- `vite/src/tienda-inventario/services/salesService.ts` (ventas reales disponibles)
- `vite/src/tienda-inventario/pages/finanzas/RegistroVentas.tsx` (mock)
- `vite/src/tienda-inventario/pages/finanzas/CargaFacturas.tsx` (mock)
- `vite/src/tienda-inventario/pages/finanzas/GestionPagos.tsx` (mock)

## Contratos API

### Ventas

- `GET /api/ventas?instalacionId=...`
- `GET /api/ventas/{id}`
- `POST /api/ventas`
- `POST /api/ventas/{id}/cancelar`

**Nota**: No se identificaron endpoints backend para “carga de facturas” o “gestión de pagos”; esas pantallas parecen ser prototipo UI.

**Nota de contrato**: evita asumir que IDs son `int32`. Algunos identificadores pueden venir como `bigint` desde SQL Server (por ejemplo IDs de movimientos generados por ventas).

## Estado actual (madurez)

- Cliente API para ventas existe.
- Pantallas de finanzas actuales usan datos ficticios y no llaman backend.

## Recomendaciones (modernización)

- Definir el modelo de facturación/pagos (entidades, endpoints, storage de archivos) antes de integrar esas pantallas.
- Integrar registro de ventas a backend y asegurar impacto en inventario (movimientos).
