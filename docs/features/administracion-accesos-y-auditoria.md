# Administración: accesos y auditoría (UI prototipo)

## Propósito

Pantallas administrativas de:

- Gestión de accesos (usuarios/roles/permisos).
- Monitor de cancelaciones (reglas y bitácora).

## Archivos analizados

### Backend

- `GesvenApi/Models/Seguridad/Usuario.cs`
- `GesvenApi/Models/Seguridad/Rol.cs`
- `GesvenApi/Models/Seguridad/AccesoInstalacion.cs`

### Frontend

- `vite/src/tienda-inventario/pages/administracion/GestionAccesos.tsx` (mock)
- `vite/src/tienda-inventario/pages/administracion/MonitorCancelaciones.tsx` (mock)

## Estado actual (madurez)

- UI presenta matrices de permisos y datos tipo Active Directory, pero no se encontraron endpoints equivalentes consumidos por estas pantallas.

## Recomendaciones (modernización)

- Definir modelo de autorización:
  - RBAC puro (roles) vs RBAC + permisos granulares.
  - Scope por instalación.
- Exponer endpoints seguros para administración y auditar cambios.
