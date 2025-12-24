# Dashboard

## Propósito

Mostrar KPIs y métricas por instalación (ventas, compras, stock, alertas).

## Archivos analizados

### Backend

- `GesvenApi/Controladores/DashboardController.cs`

### Frontend

- `vite/src/tienda-inventario/services/gesvenApi.ts` (endpoint dashboard)
- `vite/src/tienda-inventario/pages/tablero/Dashboard.tsx` (UI mock)

## Contratos API

- `GET /api/dashboard/resumen?instalacionId=...`

## Estado actual (madurez)

- Endpoint backend existe.
- Pantalla actual muestra datos ficticios (aún no consume API).

## Recomendaciones (modernización)

- Conectar UI al endpoint real; definir un DTO estable para KPIs.
- Estandarizar rangos de fecha/filtros (si aplica) para evitar múltiples variantes.
