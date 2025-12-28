import { useState, useEffect, useCallback } from 'react';

// Importamos desde el barril de servicios (ajusta los ../ según tu estructura real)
import gesvenApi from '../../../services'; 
import { useContextoInstalacion } from '../../../context/ContextoInstalacion';
import type { 
  AccesoInstalacionApiDto, 
  RolSeguridadApiDto, 
  UsuarioSeguridadApiDto 
} from '../../../types/api/securityTypes';

export function useAccesos() {
  const { instalacionActiva } = useContextoInstalacion();
  
  const [accesos, setAccesos] = useState<AccesoInstalacionApiDto[]>([]);
  const [roles, setRoles] = useState<RolSeguridadApiDto[]>([]);
  const [usuarios, setUsuarios] = useState<UsuarioSeguridadApiDto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargarDatos = useCallback(async () => {
    if (!instalacionActiva) return;
    try {
      setCargando(true);
      setError(null);

      const [listaAccesos, listaRoles, listaUsuarios] = await Promise.all([
        // CORRECCIÓN 1: Pasamos el ID directamente, no como objeto
        gesvenApi.obtenerAccesos(instalacionActiva.instalacionId),
        gesvenApi.obtenerRoles(),
        gesvenApi.obtenerUsuarios()
      ]);

      setAccesos(listaAccesos);
      setRoles(listaRoles.filter((r) => r.esActivo));
      setUsuarios(listaUsuarios);
    } catch {
      setError('Error al cargar datos de seguridad');
    } finally {
      setCargando(false);
    }
  }, [instalacionActiva]);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  const guardarAcceso = async (usuarioId: number, rolId: number, esEdicion: boolean, accesoId?: number) => {
    if (!instalacionActiva) return;
    try {
      if (esEdicion && accesoId) {
        // CORRECCIÓN 2: Usamos el nombre nuevo 'actualizarAcceso'
        await gesvenApi.actualizarAcceso(accesoId, { rolId, esActivo: true });
      } else {
        // CORRECCIÓN 3: Usamos el nombre nuevo 'crearAcceso'
        await gesvenApi.crearAcceso({
          instalacionId: instalacionActiva.instalacionId,
          usuarioId,
          rolId,
          esActivo: true
        });
      }
      await cargarDatos(); // Recargar tabla
      return true;
    } catch (err) {
      throw err;
    }
  };

  const revocarAcceso = async (accesoId: number) => {
    try {
      // CORRECCIÓN 4: Usamos el nombre nuevo 'revocarAcceso'
      await gesvenApi.revocarAcceso(accesoId);
      await cargarDatos();
    } catch {
      alert('Error al revocar acceso');
    }
  };

  return {
    instalacionActiva,
    accesos,
    roles,
    usuarios,
    cargando,
    error,
    guardarAcceso,
    revocarAcceso,
    recargar: cargarDatos
  };
}