import { apiClient } from './core/apiClient';
import type {
  MenuResponseApiDto,
  UsuarioSeguridadApiDto,
  RolSeguridadApiDto,
  AccesoInstalacionApiDto,
  CrearAccesoInstalacionApiDto,
  ActualizarAccesoInstalacionApiDto,
  PagedResultApiDto
} from '../types/api/securityTypes';

export const securityService = {
  // --- MENÚ DINÁMICO (Nuevo Endpoint) ---
  obtenerMenuUsuario: (instalacionId: number) => {
    return apiClient.get<MenuResponseApiDto>('/api/seguridad/menu', { instalacionId });
  },

  // --- USUARIOS Y ROLES (Para pantallas de Admin) ---
  obtenerUsuarios: (q?: string) => {
    const params = q ? { q } : undefined;
    return apiClient.get<UsuarioSeguridadApiDto[]>('/api/accesos/usuarios', params);
  },

  obtenerRoles: () => {
    return apiClient.get<RolSeguridadApiDto[]>('/api/accesos/roles');
  },

  // --- GESTIÓN DE ACCESOS (CRUD) ---
  obtenerAccesos: (
    instalacionId?: number,
    usuarioId?: number,
    incluirInactivos?: boolean,
    rolId?: number,
    page?: number,
    pageSize?: number,
    q?: string,
  ) => {
    const params: Record<string, string | number | boolean> = {};
    if (instalacionId) params.instalacionId = instalacionId;
    if (usuarioId) params.usuarioId = usuarioId;
    if (rolId) params.rolId = rolId;
    if (incluirInactivos !== undefined) params.incluirInactivos = incluirInactivos;
    if (page) params.page = page;
    if (pageSize) params.pageSize = pageSize;
    if (q) params.q = q;

    return apiClient.get<PagedResultApiDto<AccesoInstalacionApiDto>>('/api/accesos', params);
  },

  crearAcceso: (dto: CrearAccesoInstalacionApiDto) => {
    return apiClient.post<AccesoInstalacionApiDto>('/api/accesos', dto);
  },

  actualizarAcceso: (accesoId: number, dto: ActualizarAccesoInstalacionApiDto) => {
    return apiClient.put<AccesoInstalacionApiDto>(`/api/accesos/${accesoId}`, dto);
  },

  revocarAcceso: (accesoId: number) => {
    return apiClient.delete<AccesoInstalacionApiDto>(`/api/accesos/${accesoId}`);
  },
};