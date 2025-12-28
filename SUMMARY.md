# SUMMARY

## Tech stack

- Backend: ASP.NET Core (.NET 9), EF Core, SQL Server
- Frontend: Vite + React, React Router, Tailwind

## Documentation entrypoints

- `docs/README.md`
- `docs/proposito-y-stakeholders.md`
- `docs/frontend/README.md`
- `docs/cross-cuttings/README.md`
- `docs/step-7-validacion.md`

## Note

Security risk identified: SQL credentials exist in `GesvenApi/appsettings.json` and the file is not ignored by `.gitignore`.

## Backend notes (actual)

- DTO mapping: los controllers ahora centralizan el mapeo a DTOs usando AutoMapper (proyecciones tipo `ProjectTo`), para reducir proyecciones manuales y mantener consistencia.
- IDs: algunos identificadores pueden venir desde SQL Server como `bigint` (p. ej., `MovimientoId`); los consumidores no deben asumir `int32`.
