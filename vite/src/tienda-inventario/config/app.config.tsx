import {
  Boxes,
  ClipboardList,
  LayoutGrid,
  LayoutList,
  Package,
  Settings2,
  UsersRound,
} from 'lucide-react';
import { MenuConfig } from './types';

export const MENU_SIDEBAR: MenuConfig  = [
  {
    title: 'Dashboards',
    icon: LayoutGrid,
    children: [
      { title: 'Default', path: '/tienda-inventario/tablero' },
      { title: 'Dark Sidebar', path: '/tienda-inventario/dark-sidebar' },
    ],
  },
  { heading: 'Tienda Inventario' },
  {
    title: 'Inventario',
    icon: Boxes,
    children: [
      {
        title: 'Todo el Stock',
        path: '/tienda-inventario/todo-el-stock',
      },
      {
        title: 'Stock Actual',
        path: '/tienda-inventario/stock-actual',
      },
      {
        title: 'Stock Entrante',
        path: '/tienda-inventario/stock-entrante',
      },
      {
        title: 'Stock Saliente',
        path: '/tienda-inventario/stock-saliente',
      },
      {
        title: 'Planificador Stock',
        path: '/tienda-inventario/planificador-stock',
      },
      {
        title: 'Stock por Producto',
        path: '/tienda-inventario/stock-por-producto',
      },
      {
        title: 'Rastrear Envío',
        path: '/tienda-inventario/rastrear-envio',
      },
      {
        title: 'Crear Etiqueta Envío',
        path: '/tienda-inventario/crear-etiqueta-envio',
      },
    ],
  },
  {
    title: 'Productos',
    icon: Package,
    children: [
      {
        title: 'Lista Productos',
        path: '/tienda-inventario/lista-productos',
      },
      {
        title: 'Detalles Producto',
        path: '/tienda-inventario/detalles-producto',
      },
      { title: 'Crear Producto', path: '/tienda-inventario/crear-producto' },
      {
        title: 'Gestionar Variantes',
        path: '/tienda-inventario/gestionar-variantes',
      },
      {
        title: 'Editar Producto',
        path: '/tienda-inventario/editar-producto',
      },
    ],
  },
  {
    title: 'Categorías',
    icon: LayoutList,
    children: [
      {
        title: 'Lista Categorías',
        path: '/tienda-inventario/lista-categorias',
      },
      {
        title: 'Detalles Categoría',
        path: '/tienda-inventario/detalles-categoria',
      },
      {
        title: 'Crear Categoría',
        path: '/tienda-inventario/crear-categoria',
      },
      {
        title: 'Editar Categoría',
        path: '/tienda-inventario/editar-categoria',
      }
    ],
  },
  {
    title: 'Pedidos',
    icon: ClipboardList,
    children: [
      {
        title: 'Lista Pedidos',
        path: '/tienda-inventario/lista-pedidos',
      },
      {
        title: 'Lista Pedidos - Productos',
        path: '/tienda-inventario/productos-lista-pedidos',
      },
      {
        title: 'Detalles Pedido',
        path: '/tienda-inventario/detalles-pedido', 
      },
      {
        title: 'Seguimiento Pedido',
        path: '/tienda-inventario/seguimiento-pedido',
      },
    ],
  },
  {
    title: 'Cliente',
    icon: UsersRound,
    children: [
      {
        title: 'Lista Clientes',
        path: '/tienda-inventario/lista-clientes',
      },
      {
        title: 'Detalles Cliente',
        path: '/tienda-inventario/detalles-lista-clientes',
      },
    ],
  },
  {
    title: 'Configuración',
    icon: Settings2,
    children: [
      {
        title: 'Configuración (Modal)',
        path: '/tienda-inventario/modal-configuracion',
      } 
    ]
  }
];
