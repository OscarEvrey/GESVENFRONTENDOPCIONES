# Cómo levantar el proyecto Gesven

Este documento describe los pasos mínimos para arrancar el backend y frontend desde cero. Incluye rutas y comandos exactos para que cualquier persona sin contexto pueda validar la aplicación al completo.

## 1. Prerrequisitos

- Instala .NET 9 SDK (https://dotnet.microsoft.com/download/dotnet/9.0).
- Instala Node.js 20+ (LTS recomendado) y npm.
- Asegúrate de que el SQL Server indicado en `GesvenApi/appsettings.json` (servidor `10.0.31.37`, base `Gesven`) esté accesible desde tu máquina.
- Opcional: un editor de solicitudes HTTP (Postman, HTTPie, curl) para los smoke tests.

## 2. Backend (GesvenApi)

1. Abre una terminal PowerShell o cmd y sitúate en la raíz del repo:

   ```powershell
   cd C:\Users\oscar\source\repos\Gesven\GESVENFRONTENDOPCIONES
   ```

2. Ajusta (si es necesario) las credenciales de `GesvenApi/appsettings.json` o usa variables de entorno según tu entorno (la configuración default apunta a `10.0.31.37`).

3. Ejecuta el backend:

   ```powershell
   dotnet run --project GesvenApi/GesvenApi.csproj
   ```

   - Esto desplegará la API en `http://localhost:5022`.
   - El backend espera el header `X-Gesven-UsuarioId` para determinar accesos a instalaciones.
   - El mapeo Entity→DTO está centralizado en AutoMapper (profiles en `GesvenApi/Mapping/`).

4. (Opcional) Haz una prueba rápida con curl/Invoke-RestMethod para verificar el endpoint principal:

   ```powershell
   Invoke-RestMethod http://localhost:5022/api/instalaciones -Headers @{ 'X-Gesven-UsuarioId' = '1' }
   ```

## 3. Frontend (Vite + React)

1. En otra terminal, cambia al directorio del frontend:

   ```powershell
   cd C:\Users\oscar\source\repos\Gesven\GESVENFRONTENDOPCIONES\vite
   ```

2. Instala dependencias si no lo hiciste antes (de preferencia con `--force` si existen conflictos):

   ```powershell
   npm install --force
   ```

3. Levanta el servidor de desarrollo:

   ```powershell
   npm run dev
   ```

   - El frontend estará disponible en `http://localhost:5173`.
   - Usa el valor `VITE_API_URL` si necesitas apuntar a otra URL del backend; por defecto ya apunta a `http://localhost:5022`.
   - El cliente `apiClient.ts` (en `services/core/`) agrega automáticamente el header `X-Gesven-UsuarioId` y maneja respuestas estándar.

## 4. Validación final (smoke test)

1. Asegúrate de que ambos servidores estén corriendo (backend en 5022, frontend en 5173).
2. Usa el navegador o curl para probar algunos endpoints clave:
   - `GET http://localhost:5022/api/instalaciones` (pone `X-Gesven-UsuarioId: 1`).
   - `GET http://localhost:5022/api/movimientos?instalacionId=1` (para confirmar que los IDs tipo bigint se serializan bien).
   - Carga http://localhost:5173 en el navegador; el frontend cargará datos usando los servicios modulares.
3. Si necesitas resets de datos, consulta los scripts en `GesvenApi/Scripts/GesvenSQLServer.sql`.

## 5. Notas útiles

- Todas las respuestas del backend usan el wrapper `RespuestaApi<T>` con `exito`, `mensaje`, `datos` y `errores`.
- Los IDs en las respuestas pueden ser `long`/`bigint` (por ejemplo `MovimientoId`). Evita asumir `int32` en el frontend.
- Para agregar campos nuevos a una respuesta, actualiza `GesvenApi/Mapping/GesvenMappingProfile.cs` y asegúrate de que el DTO también incluya la propiedad.

> Consejo: si dejas una terminal con el backend, puedes volver a ejecutar `dotnet run` tras `Ctrl+C` y mantendrá la conexión a SQL. Para parar todo, presiona `Ctrl+C` en cada terminal.
