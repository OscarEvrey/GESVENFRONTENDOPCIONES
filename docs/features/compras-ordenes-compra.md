# Compras (Órdenes de compra, aprobación y recepción)

## Propósito

Gestiona el ciclo de vida de una **Orden de Compra (OC)**:

1) Creación
2) Aprobación / Rechazo
3) Recepción (impacta inventario)

## Archivos analizados

### Backend

- `GesvenApi/Controllers/ComprasController.cs`
- `GesvenApi/Models/Compras/OrdenCompra.cs`
- `GesvenApi/Models/Compras/OrdenCompraDetalle.cs`
- `GesvenApi/Models/Compras/Proveedor.cs`
- `GesvenApi/Models/Inventario/Movimiento.cs` (entrada por recepción)

### Frontend

- `vite/src/tienda-inventario/services/purchasingService.ts` (endpoints de compras/OC)
- `vite/src/tienda-inventario/hooks/useGesvenApi.ts`
- `vite/src/tienda-inventario/context/ContextoOrdenesCompra.tsx` (**mock**)
- `vite/src/tienda-inventario/pages/compras/NuevaOrdenCompra.tsx` (**híbrido**: backend + sync al mock)
- `vite/src/tienda-inventario/pages/compras/AprobacionCompras.tsx` (mock; usa contexto local)
- `vite/src/tienda-inventario/pages/inventario/RecepcionMercancia.tsx` (mock; recepción no llama backend)

## Reglas de negocio clave (observadas)

- OC se crea para una instalación.
- Se separan estados: pendiente/aprobada/rechazada/recibida (lookup por módulo+nombre).
- Recepción de OC debe generar movimientos de entrada y actualizar saldos.
- En UI se observa una regla de alerta: costo unitario 15% mayor al “sugerido” (validación/alerta UX, no necesariamente enforcement server-side).

## Contratos API principales

- `POST /api/compras/ordenes` (crear OC)
- `GET /api/compras/ordenes?instalacionId=...`
- `GET /api/compras/ordenes/pendientes?instalacionId=...`
- `GET /api/compras/ordenes/aprobadas?instalacionId=...`
- `POST /api/compras/ordenes/{id}/aprobar`
- `POST /api/compras/ordenes/{id}/rechazar`
- `POST /api/compras/ordenes/{id}/recibir`

**Nota de contrato**: evita asumir que IDs son `int32`. Algunos identificadores pueden venir como `bigint` desde SQL Server (por ejemplo IDs de movimientos asociados a recepción).

## Estado actual (madurez)

- Crear OC: **integrado** vía `useCrearOrdenCompra`.
- Aprobación/rechazo/recepción: pantallas actuales siguen usando contexto mock (no persiste en backend).

## Riesgos y deuda técnica

- Inconsistencia: una OC creada en backend se “duplica” en contexto local para que otras pantallas mock la vean.
- Recepción mock puede divergir del ledger real de inventario.

## Recomendaciones (modernización)

- Remover `ContextoOrdenesCompra` mock y basar todas las pantallas en backend.
- Centralizar el workflow de OC con estados y transiciones validadas server-side.
