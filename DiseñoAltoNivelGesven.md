# Diseño de Alto Nivel: Sistema Gesven

## 1. Introducción

**Gesven** surge como la solución para centralizar el control operativo y administrativo de las empresas **Vaxsa** y **SCC**. El sistema gestionará el ciclo completo de adquisiciones, inventarios y ventas en las sucursales de Monterrey, Saltillo y San Luis Potosí. Todo el desarrollo se alinea con la política de desarrollo seguro de **Grupo Lomex**, incluyendo pruebas de penetración y cumplimiento normativo.

---

## 2. Acceso y Seguridad

* 
**Autenticación**: Integración con **Office 365** y servicios de **DUO Security** para autenticación multifactor (MFA) vía celular.


* 
**Gestión de Cuentas**: Los usuarios y contraseñas residirán exclusivamente en el **Active Directory**; el sistema no almacenará credenciales locales.


* 
**Infraestructura**: Uso obligatorio de certificados **SSL** y las últimas versiones seguras de frameworks de desarrollo.



---

## 3. Perfilamiento y Contexto de Trabajo

El sistema utiliza un modelo de permisos basado en **Instalaciones**, que consolidan la relación **Empresa + Sucursal + Departamento** (Almacén u Oficina).

### 3.1 Pantalla: Configuración de Accesos (Administración)

| Campo | Tipo | Proceso |
| --- | --- | --- |
| **Usuario** | ListBox | Selección de cuentas activas desde el Active Directory.

 |
| **Instalación** | ListBox | Selección de la unidad operativa (Ej: Almacen-Vaxsa-MTY). |
| **Rol/Permisos** | Switch | Activación de módulos: Ventas, Compras, Facturas, Pagos, Inventario, Admin.

 |
| **Guardar** | Botón | Almacena la relación y registra auditoría de quién realizó el cambio y en qué fecha.

 |

### 3.2 Pantalla: Selector de Contexto (Home)

Al ingresar, el usuario debe seleccionar la **Instalación** en la que operará.

* **Lógica**: Toda la información mostrada (existencias, órdenes de compra, ventas) se filtrará automáticamente por este contexto. Para cambiar de instalación, el usuario deberá cerrar el contexto actual.

---

## 4. Módulo de Compras (Ciclo de Gasto)

Este módulo asegura que ningún egreso ocurra sin autorización previa.

### 4.1 Pantalla: Creación de Orden de Compra (OC)

| Campo | Tipo | Proceso |
| --- | --- | --- |
| **ID OC** | Entero | Identificador único autogenerado e inmodificable. |
| **Fecha Solicitud** | Date | Fecha de registro, por defecto la actual. |
| **Proveedor** | ListBox | Catálogo de proveedores activos. |
| **Comentarios** | Texto | Justificación de la compra o detalles adicionales. |
| **Artículo** | ListBox | Productos o servicios del catálogo. |
| **Costo Unitario** | Numérico | Precio pactado con el proveedor. |
| **Agregar** | Botón | Inserta el artículo a la lista temporal de la OC. |
| **Guardar** | Botón | Envía la OC para aprobación en estatus **"Pendiente"**. |

### 4.2 Pantalla: Aprobación de Compras

Solo visible para usuarios con rol de **Administración** en la instalación solicitante.

* **Lógica**: El administrador visualiza el detalle de la OC y decide su destino.
* **Acciones**:
* **Aprobar**: Cambia estatus a "Aprobada", notificando al solicitante.
* **Rechazar**: Requiere ingresar obligatoriamente un **Motivo de Rechazo**. La OC queda cerrada.



---

## 5. Módulo de Inventario y Recepción

### 5.1 Pantalla: Recepción de Mercancía (Entrada)

Utilizada para ingresar físicamente lo comprado.

* **Campos**: OC Aprobada (Selección), Factura Proveedor (Texto), Cantidad Recibida.
* **Lógica de Negocio**:
* 
**Inventariables**: Aumenta el stock físico y registra el movimiento de entrada.


* **Gastos/Servicios**: Registra la recepción administrativa (Ej. servicio de luz recibido) para liberar el pago, sin afectar el stock físico.



### 5.2 Consultas de Inventario

* 
**Inventario Actual**: Lista de productos disponibles con existencia mayor a cero en la instalación.


* 
**Kardex**: Historial de movimientos (Entradas/Salidas) ordenados del más reciente al más antiguo.



---

## 6. Módulo de Ventas y Finanzas

### 6.1 Pantalla: Registro de Ventas

Permite la salida de mercancía por concepto de comercialización.

* 
**Campos**: Cliente, Artículo, Cantidad, Precio de Venta, Descuento.


* 
**Lógica**: Solo se muestran artículos con stock positivo en la instalación activa. Al guardar, se notifica automáticamente a Facturación.



### 6.2 Pantalla: Facturación (Carga de Archivos)

| Campo | Tipo | Proceso |
| --- | --- | --- |
| **Referencia** | Texto | ID de la Venta o Recepción de Compra. |
| **XML** | Archivo | Carga obligatoria del archivo XML de la factura.

 |
| **PDF** | Archivo | Carga obligatoria del archivo PDF de la factura.

 |
| **Finalizar** | Botón | Cierra el ciclo de facturación y cambia el estatus a "Facturada".

 |

### 6.3 Módulo de Pagos

Permite gestionar los saldos pendientes de clientes.

* 
**Lógica**: Las facturas se agrupan por antigüedad. Se permiten pagos totales o parciales.



---

## 7. Lógica de Cancelaciones y Auditoría

* 
**Ventas**: Solo cancelables si no tienen factura cargada ni pago aplicado.


* **Compras (OC)**: Solo cancelables si aún no han sido recibidas en almacén.
* 
**Auditoría**: Toda transacción almacena la fecha, hora y el usuario que realizó la acción, así como el usuario que la canceló en su caso.



---

## 8. Catálogos Maestros

* 
**Clientes/Proveedores**: Validación estricta de RFC y Nombre Corto para evitar duplicidades. No se permiten eliminaciones, solo desactivaciones.


* 
**Artículos**: Validación de nombre único. Incluye el atributo **"Inventariable"** (Bit) para definir si afecta stock físico o es un gasto administrativo.

