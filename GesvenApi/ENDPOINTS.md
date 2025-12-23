# Endpoints — GesvenApi

Base URL (dev): `http://localhost:5022`

> Convención de respuesta: casi todos los endpoints devuelven un objeto tipo `RespuestaApi<T>` con:

> - `exito`: boolean
> - `mensaje`: string
> - `datos`: payload (si aplica)
> - `errores`: string[] (si aplica)

---

## Salud / raíz

### `GET /`

**Para qué sirve**: Health-check rápido para confirmar que la API está levantada. También devuelve un resumen (texto) de endpoints.

---

## Instalaciones (`InstalacionesController`)

Ruta base: `/api/instalaciones`

### `GET /api/instalaciones`

**Para qué sirve**: Lista las instalaciones permitidas para el usuario “actual” (en el código está fijo como `UsuarioActualId = 1`).

**Uso típico (frontend)**: poblar selector de instalación.

### `GET /api/instalaciones/{id}`

**Para qué sirve**: Obtiene el detalle de una instalación por su `instalacionId`.

---

## Inventario (`InventarioController`)

Ruta base: `/api/inventario`

### `GET /api/inventario/{instalacionId}`

**Para qué sirve**: Devuelve el inventario (productos) de una instalación, incluyendo stock actual calculado con base en el último movimiento.

**Notas**:

- Si la instalación no existe, responde `404`.
- El campo `estado` se calcula con la lógica: `agotado | bajo_stock | disponible`.

### `GET /api/inventario/{instalacionId}/productos`

**Para qué sirve**: Devuelve una lista simplificada de productos para selectores (ej. alta de compras): `productoId`, `nombre`, `costoSugerido`.

---

## Compras (`ComprasController`)

Ruta base: `/api/compras`

### `POST /api/compras`

**Para qué sirve**: Crea una Orden de Compra de forma transaccional (encabezado + detalle).

**Valida**:

- Que existan líneas.
- Que exista la instalación.
- Que exista el proveedor.
- Que exista cada producto de las líneas.

**Body esperado**: `CrearOrdenCompraDto`

- `instalacionId`: number
- `proveedorId`: number
- `comentarios`: string | null
- `lineas`: array
  - `productoId`: number
  - `cantidad`: number
  - `costoUnitario`: number

**Respuesta**: `OrdenCompraRespuestaDto` con:

- `ordenCompraId`
- `instalacionId` + `instalacionNombre`
- `proveedorId` + `proveedorNombre`
- `estatus`
- `montoTotal`
- `comentarios`
- `creadoEn`
- `detalles[]`

### `GET /api/compras/proveedores`

**Para qué sirve**: Lista proveedores (`proveedorId`, `nombre`, `rfc`).

**Uso típico (frontend)**: selector de proveedor en compras.

### `GET /api/compras?instalacionId={id}`

**Para qué sirve**: Lista órdenes de compra. Si se manda `instalacionId`, filtra por instalación.

**Incluye**: instalación, proveedor, estatus y detalles con nombre de producto.

---

## OpenAPI

### `GET /openapi/v1.json` (solo en `Development`)

**Para qué sirve**: Documento OpenAPI generado por `AddOpenApi()`/`MapOpenApi()`.

> Nota: La ruta exacta puede variar según la configuración de OpenAPI, pero en este proyecto se habilita únicamente en `Development`.
