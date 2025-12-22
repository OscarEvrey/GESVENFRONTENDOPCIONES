import type { Column } from '@tanstack/react-table';

export type TipoInstalacion = 'almacen' | 'oficinas';

export interface Instalacion {
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
