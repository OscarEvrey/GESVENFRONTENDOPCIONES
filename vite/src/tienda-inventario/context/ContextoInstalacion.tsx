'use client';

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

// ============ TIPOS ============
export interface Instalacion {
  id: string;
  nombre: string;
  tipo: 'almacen' | 'oficinas';
  empresa: string;
  ubicacion: string;
  descripcion: string;
}

interface ContextoInstalacionValor {
  instalacionActiva: Instalacion | null;
  instalaciones: Instalacion[];
  seleccionarInstalacion: (instalacion: Instalacion) => void;
  limpiarInstalacion: () => void;
}

// ============ INSTALACIONES BASE ============
export const INSTALACIONES_BASE: Instalacion[] = [
  {
    id: 'almacen-scc-mty',
    nombre: 'Almacen-SCC-MTY',
    tipo: 'almacen',
    empresa: 'SCC',
    ubicacion: 'Monterrey',
    descripcion: 'Almacén principal de SCC en Monterrey. Productos: refrescos y snacks.',
  },
  {
    id: 'oficinas-scc-mty',
    nombre: 'Oficinas-SCC-MTY',
    tipo: 'oficinas',
    empresa: 'SCC',
    ubicacion: 'Monterrey',
    descripcion: 'Oficinas corporativas de SCC en Monterrey. Productos: papelería y consumibles.',
  },
  {
    id: 'almacen-vaxsa-mty',
    nombre: 'Almacen-Vaxsa-MTY',
    tipo: 'almacen',
    empresa: 'Vaxsa',
    ubicacion: 'Monterrey',
    descripcion: 'Almacén de Vaxsa en Monterrey. Productos: refrescos y snacks.',
  },
  {
    id: 'oficinas-vaxsa-mty',
    nombre: 'Oficinas-Vaxsa-MTY',
    tipo: 'oficinas',
    empresa: 'Vaxsa',
    ubicacion: 'Monterrey',
    descripcion: 'Oficinas de Vaxsa en Monterrey. Productos: papelería y consumibles.',
  },
];

// ============ CONTEXTO ============
const ContextoInstalacion = createContext<ContextoInstalacionValor | undefined>(
  undefined,
);

// ============ PROVIDER ============
interface ContextoInstalacionProviderProps {
  children: ReactNode;
}

export function ContextoInstalacionProvider({
  children,
}: ContextoInstalacionProviderProps) {
  const [instalacionActiva, setInstalacionActiva] = useState<Instalacion | null>(null);

  const seleccionarInstalacion = useCallback((instalacion: Instalacion) => {
    setInstalacionActiva(instalacion);
  }, []);

  const limpiarInstalacion = useCallback(() => {
    setInstalacionActiva(null);
  }, []);

  const valor = useMemo<ContextoInstalacionValor>(
    () => ({
      instalacionActiva,
      instalaciones: INSTALACIONES_BASE,
      seleccionarInstalacion,
      limpiarInstalacion,
    }),
    [instalacionActiva, seleccionarInstalacion, limpiarInstalacion],
  );

  return (
    <ContextoInstalacion.Provider value={valor}>
      {children}
    </ContextoInstalacion.Provider>
  );
}

// ============ HOOK ============
export function useContextoInstalacion(): ContextoInstalacionValor {
  const contexto = useContext(ContextoInstalacion);
  if (contexto === undefined) {
    throw new Error(
      'useContextoInstalacion debe usarse dentro de un ContextoInstalacionProvider',
    );
  }
  return contexto;
}
