import { useState, useEffect, useCallback } from 'react';

// Importamos el servicio de seguridad desde el barril de servicios
import { securityService } from '../../../services'; 
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
  const [mostrarInactivos, setMostrarInactivos] = useState(true);

  const cargarDatos = useCallback(async () => {
    if (!instalacionActiva) return;
    try {
      setCargando(true);
      setError(null);

      const [listaAccesos, listaRoles, listaUsuarios] = await Promise.all([
        securityService.obtenerAccesos(instalacionActiva.instalacionId, undefined, mostrarInactivos),
        securityService.obtenerRoles(),
        securityService.obtenerUsuarios()
      ]);

      setAccesos(listaAccesos);
      setRoles(listaRoles.filter((r) => r.esActivo));
      setUsuarios(listaUsuarios);
    } catch {
      setError('Error al cargar datos de seguridad');
    } finally {
      setCargando(false);
    }
  }, [instalacionActiva, mostrarInactivos]);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  const guardarAcceso = async (usuarioId: number, rolId: number, esEdicion: boolean, accesoId?: number) => {
    if (!instalacionActiva) return;
    try {
      if (esEdicion && accesoId) {
        await securityService.actualizarAcceso(accesoId, { rolId, esActivo: true });
      } else {
        await securityService.crearAcceso({
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
      await securityService.revocarAcceso(accesoId);
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
    recargar: cargarDatos,
    mostrarInactivos,
    setMostrarInactivos
  };
}