import { apiClient } from './core/apiClient';
import type { 
  OrdenCompraRespuestaDto, 
  CrearOrdenCompraDto, 
  ProveedorApiDto, 
  RecepcionOrdenCompraApiDto 
} from '../types/api/purchasingTypes';

export const purchasingService = {
  // --- PROVEEDORES ---
  obtenerProveedores: () => {
    return apiClient.get<ProveedorApiDto[]>('/api/proveedores');
  },

  // --- ORDENES DE COMPRA ---
  obtenerOrdenesCompra: (instalacionId?: number) => {
    const params = instalacionId ? { instalacionId } : undefined;
    return apiClient.get<OrdenCompraRespuestaDto[]>('/api/compras', params);
  },

  crearOrdenCompra: (dto: CrearOrdenCompraDto) => {
    return apiClient.post<OrdenCompraRespuestaDto>('/api/compras', dto);
  },

  obtenerOrdenesPendientes: (instalacionId?: number) => {
    const params = instalacionId ? { instalacionId } : undefined;
    return apiClient.get<OrdenCompraRespuestaDto[]>('/api/compras/pendientes', params);
  },

  obtenerOrdenesAprobadas: (instalacionId?: number) => {
    const params = instalacionId ? { instalacionId } : undefined;
    return apiClient.get<OrdenCompraRespuestaDto[]>('/api/compras/aprobadas', params);
  },

  aprobarOrdenCompra: (id: number) => {
    return apiClient.post<void>(`/api/compras/${id}/aprobar`);
  },

  rechazarOrdenCompra: (id: number, motivo: string) => {
    return apiClient.post<void>(`/api/compras/${id}/rechazar`, motivo);
  },

  recibirOrdenCompra: (id: number, recepcion: RecepcionOrdenCompraApiDto) => {
    return apiClient.post<void>(`/api/compras/${id}/recibir`, recepcion);
  }
};