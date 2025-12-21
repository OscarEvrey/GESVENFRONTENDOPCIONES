import {
  CalendarDays,
  FileEdit,
  Filter,
  LayoutGrid,
  Settings2,
  Table2,
} from 'lucide-react';
import { MenuConfig } from './types';

export const MENU_SIDEBAR: MenuConfig = [
  {
    title: 'Inicio',
    icon: LayoutGrid,
    children: [
      { title: 'Tablero', path: '/tienda-inventario/tablero' },
    ],
  },
  { heading: 'Librería de Prototipos Gesven' },
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
