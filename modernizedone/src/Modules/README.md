# Modules

Approved modular monolith boundaries based on the modernization plan:

- Catalogos: productos, unidades, marcas, clientes, proveedores.
- Inventario: existencias, movimientos y cálculo de stock.
- Compras: órdenes de compra y recepción.
- Ventas: pedidos, ventas y liquidación.
- Transferencias: traslados entre instalaciones.
- Organizacion: empresa, sucursal e instalación.
- Seguridad: usuarios, roles, permisos y accesos a instalación.
- Auditoria: estatus y seguimiento de cambios.

Each module will own its endpoints, application services, domain and infrastructure slices. This folder will host those vertical slices as they are implemented.
