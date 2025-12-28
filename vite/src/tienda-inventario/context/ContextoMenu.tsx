'use client';

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo
} from 'react';

// Importamos el servicio unificado desde tienda-inventario
import gesvenApi from '@/tienda-inventario/services';

// Importamos tipos del API (usamos los DTOs directamente para evitar conversiones)
import type { ModuloApiDto, UsuarioConRolApiDto } from '@/tienda-inventario/types/api/securityTypes';

// Importamos el contexto de instalación (está en la misma carpeta)
import { useContextoInstalacion } from './ContextoInstalacion';

// Definición de qué datos expone este contexto
interface ContextoMenuValor {
  menu: ModuloApiDto[];
  permisos: string[];
  usuario: UsuarioConRolApiDto | null;
  cargandoMenu: boolean;
  recargarMenu: () => Promise<void>;
}

const ContextoMenu = createContext<ContextoMenuValor | undefined>(undefined);

export function ContextoMenuProvider({ children }: { children: ReactNode }) {
  // Necesitamos saber en qué instalación estamos para pedir el menú correcto
  const { instalacionActiva } = useContextoInstalacion();

  const [menu, setMenu] = useState<ModuloApiDto[]>([]);
  const [permisos, setPermisos] = useState<string[]>([]);
  const [usuario, setUsuario] = useState<UsuarioConRolApiDto | null>(null);
  const [cargandoMenu, setCargandoMenu] = useState(false);

  const cargarMenu = useCallback(async () => {
    // Si no hay instalación seleccionada, limpiamos el menú
    if (!instalacionActiva) {
      setMenu([]);
      setPermisos([]);
      setUsuario(null);
      return;
    }

    try {
      setCargandoMenu(true);
      // Llamamos al nuevo endpoint del Backend
      const datos = await gesvenApi.obtenerMenuUsuario(instalacionActiva.instalacionId);
      
      // El backend nos devuelve la estructura lista
      setMenu(datos.menu);
      setPermisos(datos.permisos);
      setUsuario(datos.usuario);
      
    } catch (error) {
      console.error('Error cargando menú dinámico:', error);
      // En caso de error, limpiamos para no mostrar menú viejo
      setMenu([]); 
      setPermisos([]);
    } finally {
      setCargandoMenu(false);
    }
  }, [instalacionActiva]); // Se ejecuta cada vez que cambia la instalación

  // Efecto: Cargar menú automáticamente al montar o cambiar instalación
  useEffect(() => {
    cargarMenu();
  }, [cargarMenu]);

  const valor = useMemo<ContextoMenuValor>(() => ({
    menu,
    permisos,
    usuario,
    cargandoMenu,
    recargarMenu: cargarMenu
  }), [menu, permisos, usuario, cargandoMenu, cargarMenu]);

  return (
    <ContextoMenu.Provider value={valor}>
      {children}
    </ContextoMenu.Provider>
  );
}

// Hook personalizado para usar el contexto
export function useContextoMenu() {
  const context = useContext(ContextoMenu);
  if (context === undefined) {
    throw new Error('useContextoMenu debe usarse dentro de un ContextoMenuProvider');
  }
  return context;
}