import {
  ArrowLeftRight,
  Ban,
  Banknote,
  Building2,
  ClipboardCheck,
  ClipboardEdit,
  ClipboardList,
  CloudUpload,
  Key,
  LayoutDashboard,
  Package,
  ShoppingBag,
  ShoppingCart,
  Tag,
  Truck,
  Users,
} from 'lucide-react';
import { MenuConfig } from './types';

export const MENU_SIDEBAR: MenuConfig = [
  // ============ GENERAL ============
  { heading: 'General' },
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    path: '/tienda-inventario/dashboard',
  },
  {
    title: 'Seleccionar Instalación',
    icon: Building2,
    path: '/selector-instalacion',
  },

  // ============ OPERACIÓN E INVENTARIOS ============
  { heading: 'Operación e Inventarios' },
  {
    title: 'Inventario Actual',
    icon: Package,
    path: '/tienda-inventario/inventario-actual',
  },
  {
    title: 'Gestión de Almacén',
    icon: Truck,
    children: [
      {
        title: 'Recepción',
        path: '/tienda-inventario/recepcion-mercancia',
      },
      {
        title: 'Transferencias',
        path: '/tienda-inventario/transferencias',
      },
      {
        title: 'Ajustes',
        path: '/tienda-inventario/ajustes-inventario',
      },
      {
        title: 'Kardex',
        path: '/tienda-inventario/kardex-movimientos',
      },
    ],
  },

  // ============ COMPRAS ============
  { heading: 'Compras' },
  {
    title: 'Nueva Orden (OC)',
    icon: ShoppingCart,
    path: '/tienda-inventario/nueva-orden-compra',
  },
  {
    title: 'Aprobaciones',
    icon: ClipboardCheck,
    path: '/tienda-inventario/aprobacion-compras',
  },

  // ============ VENTAS Y FINANZAS ============
  { heading: 'Ventas y Finanzas' },
  {
    title: 'Registro Ventas',
    icon: ShoppingBag,
    path: '/tienda-inventario/registro-ventas',
  },
  {
    title: 'Facturación (Carga Facturas)',
    icon: CloudUpload,
    path: '/tienda-inventario/carga-facturas',
  },
  {
    title: 'Gestión Pagos',
    icon: Banknote,
    path: '/tienda-inventario/gestion-pagos',
  },

  // ============ ADMINISTRACIÓN ============
  { heading: 'Administración' },
  {
    title: 'Catálogos',
    icon: Tag,
    children: [
      {
        title: 'Artículos',
        path: '/tienda-inventario/articulos',
      },
      {
        title: 'Clientes y Proveedores',
        path: '/tienda-inventario/clientes-proveedores',
      },
    ],
  },
  {
    title: 'Seguridad',
    icon: Key,
    children: [
      {
        title: 'Administración de Accesos',
        path: '/tienda-inventario/gestion-accesos',
      },
      {
        title: 'Monitor de Auditoría',
        path: '/tienda-inventario/monitor-cancelaciones',
      },
    ],
  },
  // Nota: La "Librería del Template" ha sido eliminada del sidebar.
  // El acceso a estas páginas solo es posible vía URL directa en /libreria-gesven/...
];
