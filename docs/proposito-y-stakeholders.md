# Propósito y stakeholders (derivado del DAN)

## Propósito del sistema

GESVEN es un sistema de gestión empresarial para **Vaxsa** orientado a controlar de forma centralizada y eficiente procesos operativos clave:

- Compras (ciclo de solicitud → autorización → recepción).
- Inventario (existencias por instalación).
- Ventas.
- Transferencias entre instalaciones.
- Catálogos (productos, clientes, proveedores, etc.).

El objetivo principal es eliminar la falta de control “robusto, centralizado y eficiente” descrita en el documento de alto nivel.

Fuente: [DiseñoAltoNivelMarkdown.md](../Dise%C3%B1oAltoNivelMarkdown.md).

## Stakeholders

- Negocio (Vaxsa): dueños del proceso y de las reglas operativas.
- Operación por instalación:
  - Responsables de almacén.
  - Operadores de inventario.
  - Operadores de ventas.
  - Personal administrativo.
- Compras: captura y seguimiento de órdenes de compra.
- Aprobadores (administración/directivos): autorizan o rechazan OCs.
- Finanzas/contabilidad (si aplica): seguimiento de saldos, ventas y pago a proveedores (en el DAN se menciona que ciertas configuraciones alimentan finanzas).
- TI/Seguridad:
  - Mesa de ayuda (gestión de usuarios en AD según el DAN).
  - Responsables de políticas de desarrollo seguro y pruebas de seguridad (p. ej., pentest antes de liberación).

## Roles y permisos (concepto)

Del DAN se desprende un modelo de acceso basado en:

- Autenticación centralizada (menciona DUO + Office 365 + Active Directory).
- Catálogo de roles para autorización.
- Restricción de acceso por pantalla/función.
- Contexto de trabajo obligatorio por instalación (la aplicación se “bloquea” a ese contexto y filtra todas las operaciones).

Nota: en el código actual del repo, el contexto de instalación existe y la API recibe `X-Gesven-UsuarioId`, pero la integración real con AD/O365/DUO todavía no está materializada.

## Alcances y exclusiones (alto nivel)

- Entregables esperados: software funcional probado, documentación técnica y manual de usuario.
- Fuera de alcance si no se define formalmente: integraciones de terceros no identificadas y funcionalidades adicionales sin proceso de cambio.

Fuente: [DiseñoAltoNivelMarkdown.md](../Dise%C3%B1oAltoNivelMarkdown.md).
