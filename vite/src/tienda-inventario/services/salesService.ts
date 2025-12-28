import { apiClient } from './core/apiClient';
// Importa aquí tus tipos de Venta y Cliente (CrearVentaApiDto, ClienteApiDto, etc.)
// Asumimos que los moviste a '../types/api/salesTypes'
import type { 
  VentaApiDto, 
  CrearVentaApiDto, 
  ClienteApiDto, 
  CrearClienteApiDto, 
  ActualizarClienteApiDto 
} from '../types/api/salesTypes';

export const salesService = {
  // --- VENTAS ---
  obtenerVentas: (filtros: { instalacionId?: number; desde?: string; hasta?: string }) => {
    return apiClient.get<VentaApiDto[]>('/api/ventas', filtros);
  },

  obtenerVenta: (id: number) => {
    return apiClient.get<VentaApiDto>(`/api/ventas/${id}`);
  },

  crearVenta: (dto: CrearVentaApiDto) => {
    return apiClient.post<VentaApiDto>('/api/ventas', dto);
  },

  cancelarVenta: (id: number, motivo?: string) => {
    return apiClient.post<void>(`/api/ventas/${id}/cancelar`, motivo || '');
  },

  // --- CLIENTES ---
  obtenerClientes: () => {
    return apiClient.get<ClienteApiDto[]>('/api/clientes');
  },

  obtenerCliente: (id: number) => {
    return apiClient.get<ClienteApiDto>(`/api/clientes/${id}`);
  },

  crearCliente: (dto: CrearClienteApiDto) => {
    return apiClient.post<ClienteApiDto>('/api/clientes', dto);
  },

  actualizarCliente: (id: number, dto: ActualizarClienteApiDto) => {
    return apiClient.put<ClienteApiDto>(`/api/clientes/${id}`, dto);
  },

  cambiarEstatusCliente: (id: number, activo: boolean) => {
    return apiClient.patch<void>(`/api/clientes/${id}/estatus`, { activo });
    // O si tu backend usa query params: `/api/clientes/${id}/estatus?activo=${activo}`
  }
};