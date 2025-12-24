# Inventario (ledger por movimientos)

## Propósito

Inventario se modela como un **ledger**: cada operación crea **movimientos** que ajustan existencias y dejan trazabilidad. El stock actual se obtiene a partir de la secuencia de movimientos (no de un “campo stock” aislado).

## Archivos analizados

### Backend

- `GesvenApi/Controladores/InventarioController.cs`
- `GesvenApi/Controladores/MovimientosController.cs`
- `GesvenApi/Controladores/AjustesController.cs`
- `GesvenApi/Controladores/TransferenciasController.cs`
- `GesvenApi/Modelos/Inventario/Movimiento.cs`
- `GesvenApi/Modelos/Inventario/AjusteInventario.cs`
- `GesvenApi/Modelos/Inventario/Transferencia.cs`
- `GesvenApi/Modelos/Inventario/TransferenciaDetalle.cs`
- `GesvenApi/Modelos/Inventario/Producto.cs`
- `GesvenApi/Datos/GesvenDbContext.cs`

### Frontend

- `vite/src/tienda-inventario/services/gesvenApi.ts`
- `vite/src/tienda-inventario/hooks/useGesvenApi.ts`
- `vite/src/tienda-inventario/pages/inventario/InventarioActual.tsx` (parcialmente mock)
- `vite/src/tienda-inventario/pages/inventario/KardexMovimientos.tsx` (mock)
- `vite/src/tienda-inventario/pages/inventario/AjustesInventario.tsx` (mock)
- `vite/src/tienda-inventario/pages/inventario/Transferencias.tsx` (mock)
- `vite/src/tienda-inventario/pages/inventario/RecepcionMercancia.tsx` (mock; usa contexto local)

## Reglas de negocio clave

- Las existencias se derivan de **entradas/salidas** (compras, ventas, ajustes, transferencias).
- La entidad `Movimiento` contiene `SaldoFinal` (resultado acumulado), evitando recomputar desde cero en cada consulta.
- Transferencias generan movimientos de salida/origen y entrada/destino.

## Contratos API principales

### Inventario

- `GET /api/inventario/{instalacionId}`
- `GET /api/inventario/{instalacionId}/productos` (productos habilitados para comprar/recibir)

### Movimientos / Kardex

- `GET /api/movimientos?instalacionId=...&desde=...&hasta=...` (según implementación)

### Ajustes

- `GET /api/ajustes?instalacionId=...`
- `POST /api/ajustes` (crea ajuste y su movimiento asociado)

### Transferencias

- `GET /api/transferencias?instalacionId=...`
- `POST /api/transferencias` (crea solicitud)
- `POST /api/transferencias/{id}/recibir` (entrada en destino)
- `POST /api/transferencias/{id}/cancelar`

## Estado actual (madurez)

- Cliente API (`gesvenApi.ts`) y hooks existen para inventario/movimientos/ajustes/transferencias.
- Varias pantallas siguen mostrando **datasets ficticios** y lógica UI-only.

## Riesgos y deuda técnica

- UX puede mostrar datos que no coinciden con backend si hay mezcla de mock + API.
- Falta estandarizar el modelo de “stock disponible” en frontend (debería venir del backend/ledger).

## Recomendaciones (modernización)

- Migrar pantallas mock a consumo real de `gesvenApi` y eliminar datasets ficticios.
- Consolidar data-fetching en React Query (ya está en stack), con cache por `instalacionId` y invalidación por mutaciones.
