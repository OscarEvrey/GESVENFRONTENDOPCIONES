import {
  Building2,
  CalendarDays,
  FileEdit,
  Filter,
  LayoutGrid,
  Package,
  Settings2,
  Table2,
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
