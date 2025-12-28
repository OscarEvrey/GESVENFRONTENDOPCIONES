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

// --- IMPORTACIONES CORREGIDAS (Usando rutas correctas) ---

// 1. Tipos del módulo tienda-inventario
import type { Instalacion } from '@/tienda-inventario/types';

// 2. Servicios API del módulo tienda-inventario
import { commonService } from '@/tienda-inventario/services';

export type { Instalacion } from '@/tienda-inventario/types';

// ============ TIPOS LOCALES DEL CONTEXTO ============
interface ContextoInstalacionValor {
  instalacionActiva: Instalacion | null;
  instalaciones: Instalacion[];
  cargandoInstalaciones: boolean;
  errorInstalaciones: string | null;
  seleccionarInstalacion: (instalacion: Instalacion) => void;
  limpiarInstalacion: () => void;
}

function normalizarTipo(tipoApi: string): Instalacion['tipo'] {
  const t = (tipoApi || '').toLowerCase();
  if (t === 'almacen') return 'almacen';
  return 'oficinas';
}

function slugInstalacion(nombre: string): string {
  return (nombre || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-');
}

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
  const [instalaciones, setInstalaciones] = useState<Instalacion[]>([]);
  const [cargandoInstalaciones, setCargandoInstalaciones] = useState(true);
  const [errorInstalaciones, setErrorInstalaciones] = useState<string | null>(null);

  const claveLocalStorage = 'gesven.instalacionActivaId';

  useEffect(() => {
    if (typeof window === 'undefined') return;
    let cancelado = false;

    async function cargarInstalaciones() {
      try {
        setCargandoInstalaciones(true);
        setErrorInstalaciones(null);

        // Llamada a la API
        const instalacionesApi = await commonService.obtenerInstalaciones();
        
        // Mapeo de datos (API DTO -> Frontend Model)
        const instalacionesNormalizadas: Instalacion[] = instalacionesApi.map((i) => ({
          instalacionId: i.instalacionId,
          id: slugInstalacion(i.nombre),
          nombre: i.nombre,
          tipo: normalizarTipo(i.tipo),
          empresa: i.empresa,
          ubicacion: i.sucursal,
          descripcion: i.descripcion,
        }));

        if (cancelado) return;
        setInstalaciones(instalacionesNormalizadas);

        // Lógica de recuperación de sesión (localStorage)
        const idGuardado = window.localStorage.getItem(claveLocalStorage);
        if (!idGuardado) return;

        const instalacionIdGuardado = Number(idGuardado);
        if (!Number.isFinite(instalacionIdGuardado)) {
          window.localStorage.removeItem(claveLocalStorage);
          return;
        }

        const instalacionEncontrada =
          instalacionesNormalizadas.find((x) => x.instalacionId === instalacionIdGuardado) ?? null;

        if (!instalacionEncontrada) {
          window.localStorage.removeItem(claveLocalStorage);
          return;
        }

        setInstalacionActiva(instalacionEncontrada);
      } catch (err) {
        if (cancelado) return;
        setErrorInstalaciones(err instanceof Error ? err.message : 'Error desconocido');
        setInstalaciones([]);
        setInstalacionActiva(null);
      } finally {
        if (cancelado) return;
        setCargandoInstalaciones(false);
      }
    }

    cargarInstalaciones();

    return () => {
      cancelado = true;
    };
  }, []);

  const seleccionarInstalacion = useCallback((instalacion: Instalacion) => {
    setInstalacionActiva(instalacion);

    if (typeof window !== 'undefined') {
      window.localStorage.setItem(claveLocalStorage, String(instalacion.instalacionId));
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
      instalaciones,
      cargandoInstalaciones,
      errorInstalaciones,
      seleccionarInstalacion,
      limpiarInstalacion,
    }),
    [instalacionActiva, instalaciones, cargandoInstalaciones, errorInstalaciones, seleccionarInstalacion, limpiarInstalacion],
  );

  return (
    <ContextoInstalacion.Provider value={valor}>
      {children}
    </ContextoInstalacion.Provider>
  );
}

// ============ HOOKS ============
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