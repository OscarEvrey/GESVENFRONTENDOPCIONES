# Cross-cuttings — análisis

## Wrapper de respuesta API

Backend usa un wrapper consistente tipo `RespuestaApi<T>`:

- `exito`
- `mensaje`
- `datos`
- `errores`

Esto impacta al frontend: debe manejar errores de negocio vs errores HTTP.

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
