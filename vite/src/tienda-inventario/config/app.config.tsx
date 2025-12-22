import {
  Ban,
  Banknote,
  Building2,
  CalendarDays,
  ClipboardCheck,
  ClipboardList,
  CloudUpload,
  FileEdit,
  Filter,
  LayoutGrid,
  Package,
  Settings2,
  ShoppingBag,
  ShoppingCart,
  Table2,
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
    path: '/tienda-inventario/selector-instalacion',
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
  // ============ LIBRERÍA DEL TEMPLATE ============
  { heading: 'Librería del Template' },
  {
    title: 'Inicio',
    icon: LayoutGrid,
    children: [
      { title: 'Tablero', path: '/tienda-inventario/tablero' },
    ],
  },
  {
    title: 'Tablas Maestras',
    icon: Table2,
    children: [
      {
        title: 'Ejemplos de Tablas',
        path: '/tienda-inventario/libreria-gesven/tablas-maestras',
      },
    ],
  },
  {
    title: 'Formularios de Captura',
    icon: FileEdit,
    children: [
      {
        title: 'Ejemplos de Formularios',
        path: '/tienda-inventario/libreria-gesven/formularios-captura',
      },
    ],
  },
  {
    title: 'Selectores y Filtros',
    icon: Filter,
    children: [
      {
        title: 'Ejemplos de Selectores',
        path: '/tienda-inventario/libreria-gesven/selectores-filtros',
      },
    ],
  },
  {
    title: 'Calendarios y Fechas',
    icon: CalendarDays,
    children: [
      {
        title: 'Ejemplos de Calendarios',
        path: '/tienda-inventario/libreria-gesven/calendarios-fechas',
      },
    ],
  },
  {
    title: 'Componentes de Control',
    icon: Settings2,
    children: [
      {
        title: 'Ejemplos de Controles',
        path: '/tienda-inventario/libreria-gesven/componentes-control',
      },
    ],
  },
];
