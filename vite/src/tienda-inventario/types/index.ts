import type { Column } from '@tanstack/react-table';

// ==========================================
// TIPOS EXISTENTES (TU CÓDIGO ACTUAL)
// ==========================================

export type TipoInstalacion = 'almacen' | 'oficinas';

export interface Instalacion {
  instalacionId: number;
  id: string;
  nombre: string;
  tipo: TipoInstalacion;
  empresa: string;
  ubicacion: string;
  descripcion: string;
}

export interface FiltroColumnaProps<TData, TValue> {
  column: Column<TData, TValue>;
}

export interface DatosStockActual {
  id: string;
  productInfo: {
    image: string;
    title: string;
    label: string;
  };
  stock: number;
  rsvd: number;
  tlvl: number;
  delta: {
    label: string;
    variant: string;
  };
  sum: string;
  lastMoved: string;
  handler: string;
  trend: {
    label: string;
    variant: string;
  };
}

export interface AvatarGrupoItem {
  path?: string;
  filename?: string;
  fallback?: string;
  variant?: string;
}

export type Avatares = Array<AvatarGrupoItem>;

export interface AvatarGrupoProps {
  size?: string;
  group: AvatarGrupoItem[];
  more?: { variant?: string; number?: number | string; label?: string };
  className?: string;
}

export interface DropdownAppsItem {
  logo: string;
  title: string;
  description: string;
  checkbox: boolean;
}

// ==========================================
// NUEVOS TIPOS PARA SEGURIDAD Y MENÚ DINÁMICO
// (Agregados para la nueva arquitectura RBAC)
// ==========================================

export interface Modulo {
  moduloId: number;
  nombre: string;
  ruta: string | null;
  icono: string | null; // Nombre del icono de Lucide (ej: 'LayoutDashboard')
  orden: number;
  padreId: number | null;
  hijos?: Modulo[]; // Para menús anidados (recursivo)
  estadoDesarrollo?: 'Disponible' | 'EnDesarrollo' | 'Oculto';
  contenidoAyuda?: string | null;
}

export interface UsuarioConRol {
  usuarioId: number;
  nombreCompleto: string;
  email: string;
  rolId: number;
  rolNombre: string;
}

// Estructura de respuesta del endpoint /api/seguridad/menu
export interface MenuResponse {
  usuario: UsuarioConRol;
  menu: Modulo[];
  permisos: string[]; // Array de claves (ej: ['VENTAS_ACCESS', 'COMPRAS_AUTH'])
}