'use client';

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import type { Instalacion } from '../types';

export type { Instalacion } from '../types';

// ============ TIPOS ============
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

  const claveLocalStorage = 'gesven.instalacionActivaId';

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const idGuardado = window.localStorage.getItem(claveLocalStorage);
    if (!idGuardado) return;

    const instalacionEncontrada = INSTALACIONES_BASE.find((i) => i.id === idGuardado) ?? null;
    if (!instalacionEncontrada) {
      window.localStorage.removeItem(claveLocalStorage);
      return;
    }

    setInstalacionActiva(instalacionEncontrada);
  }, []);

  const seleccionarInstalacion = useCallback((instalacion: Instalacion) => {
    setInstalacionActiva(instalacion);

    if (typeof window !== 'undefined') {
      window.localStorage.setItem(claveLocalStorage, instalacion.id);
    }
  }, []);

  const limpiarInstalacion = useCallback(() => {
    setInstalacionActiva(null);

    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(claveLocalStorage);
    }
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

export function useInstalacionActivaObligatoria(): Instalacion {
  const { instalacionActiva } = useContextoInstalacion();

  if (!instalacionActiva) {
    throw new Error(
      'No hay instalación activa. Este componente requiere una instalación seleccionada.',
    );
  }

  return instalacionActiva;
}
