import {
  Ban,
  Banknote,
  Building2,
  ClipboardCheck,
  ClipboardList,
  CloudUpload,
  Key,
  Package,
  ShoppingBag,
  ShoppingCart,
  Tag,
  Truck,
  Users,
} from 'lucide-react';
import { MenuConfig } from './types';

export const MENU_SIDEBAR: MenuConfig = [
  // ============ ÍTEMS PRINCIPALES DE NIVEL SUPERIOR ============
  {
    title: 'Seleccionar Instalación',
    icon: Building2,
    path: '/selector-instalacion',
  },
  {
    title: 'Inventario Actual',
    icon: Package,
    path: '/tienda-inventario/inventario-actual',
  },
  {
    title: 'Nueva Orden de Compra',
    icon: ShoppingCart,
    path: '/tienda-inventario/nueva-orden-compra',
  },
  {
    title: 'Aprobación de Compras',
    icon: ClipboardCheck,
    path: '/tienda-inventario/aprobacion-compras',
  },
  {
    title: 'Recepción de Mercancía',
    icon: Truck,
    path: '/tienda-inventario/recepcion-mercancia',
  },
  {
    title: 'Kardex de Movimientos',
    icon: ClipboardList,
    path: '/tienda-inventario/kardex-movimientos',
  },
  {
    title: 'Registro de Ventas',
    icon: ShoppingBag,
    path: '/tienda-inventario/registro-ventas',
  },
  {
    title: 'Carga de Facturas',
    icon: CloudUpload,
    path: '/tienda-inventario/carga-facturas',
  },
  {
    title: 'Gestión de Pagos',
    icon: Banknote,
    path: '/tienda-inventario/gestion-pagos',
  },
  {
    title: 'Cancelaciones y Auditoría',
    icon: Ban,
    path: '/tienda-inventario/monitor-cancelaciones',
  },
  {
    title: 'Catálogo de Clientes y Proveedores',
    icon: Users,
    path: '/tienda-inventario/clientes-proveedores',
  },
  {
    title: 'Catálogo de Artículos',
    icon: Tag,
    path: '/tienda-inventario/articulos',
  },
  {
    title: 'Administración de Accesos',
    icon: Key,
    path: '/tienda-inventario/gestion-accesos',
  },
  // Nota: La "Librería del Template" ha sido eliminada del sidebar.
  // El acceso a estas páginas solo es posible vía URL directa en /libreria-gesven/...
];
