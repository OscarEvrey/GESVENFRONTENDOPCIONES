# Cross-cuttings — análisis

## Wrapper de respuesta API

Backend usa un wrapper consistente tipo `RespuestaApi<T>`:

- `exito`
- `mensaje`
- `datos`
- `errores`

Esto impacta al frontend: debe manejar errores de negocio vs errores HTTP.

## Mapeo de DTOs (AutoMapper)

- El backend centraliza el mapeo Entidad→DTO usando AutoMapper (profiles en `GesvenApi/Mapping/`).
- Implicación práctica: si se agregan/renombran campos en DTOs de respuesta, se debe actualizar el profile correspondiente para que el campo salga en la API.

## Tipos de IDs (SQL Server)

- No asumir que los IDs son `int32`. Algunos IDs pueden venir como `bigint` desde la BD (por ejemplo `MovimientoId`).
- En frontend (TypeScript), tratar IDs como `number` y evitar operaciones que dependan de 32 bits (p. ej., bitwise) sobre IDs.

## Estatus por lookup

- Existe un servicio de lookup de estatus por `(módulo, nombre)` con caching.
- Permite mantener estados normalizados para entidades (OC, ventas, productos, etc.).

## Auditoría

- Las entidades auditable heredan de base auditable.
- Se “stampean” campos de auditoría desde el `DbContext` usando un `UsuarioSistemaId` y/o el usuario enviado.

## Inventario ledger

- El dominio de inventario se apoya en movimientos con `SaldoFinal` como acumulado.
- Compras/ventas/ajustes/transferencias deben materializarse como movimientos.

## Riesgo de secretos

- `GesvenApi/appsettings.json` contiene credenciales de SQL Server en texto plano.
- `.gitignore` no excluye ese archivo, por lo que existe riesgo de commit accidental.

Recomendación mínima: mover secrets a `appsettings.Development.json` local no versionado o a variables de entorno / secret manager.
