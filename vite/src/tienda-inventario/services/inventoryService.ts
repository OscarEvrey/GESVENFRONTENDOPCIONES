import { apiClient } from './core/apiClient';
import type {
  ProductoApiDto,
  ProductoInventarioApiDto,
  ProductoSimpleApiDto,
  CrearProductoApiDto,
  ActualizarProductoApiDto,
  MovimientoApiDto,
  AjusteApiDto,
  CrearAjusteApiDto,
  TransferenciaApiDto,
  CrearTransferenciaApiDto,
  RecibirTransferenciaApiDto
} from '../types/api/inventoryTypes';

export const inventoryService = {
  // --- CONSULTAS DE INVENTARIO ---
  obtenerInventarioActual: (instalacionId: number) => {
    return apiClient.get<ProductoInventarioApiDto[]>(`/api/inventario/${instalacionId}`);
  },

  obtenerProductosParaCompra: (instalacionId: number) => {
    return apiClient.get<ProductoSimpleApiDto[]>(`/api/inventario/${instalacionId}/productos`);
  },

  // --- CATÁLOGO DE PRODUCTOS ---
  obtenerProductos: (instalacionId?: number) => {
    const params = instalacionId ? { instalacionId } : undefined;
    return apiClient.get<ProductoApiDto[]>('/api/productos', params);
  },

  obtenerProducto: (id: number) => {
    return apiClient.get<ProductoApiDto>(`/api/productos/${id}`);
  },

  crearProducto: (dto: CrearProductoApiDto) => {
    return apiClient.post<ProductoApiDto>('/api/productos', dto);
  },

  actualizarProducto: (id: number, dto: ActualizarProductoApiDto) => {
    return apiClient.put<ProductoApiDto>(`/api/productos/${id}`, dto);
  },

  cambiarEstatusProducto: (id: number, activo: boolean) => {
    return apiClient.patch<void>(`/api/productos/${id}/estatus`, { activo }); // Ajuste: Enviar como body o query según tu backend. 
    // Si tu backend espera query string como antes:
    // return apiClient.patch<void>(`/api/productos/${id}/estatus?activo=${activo}`);
  },

  // --- MOVIMIENTOS Y AJUSTES ---
  obtenerMovimientos: (filtros: { instalacionId?: number; productoId?: number; desde?: string; hasta?: string }) => {
    return apiClient.get<MovimientoApiDto[]>('/api/movimientos', filtros);
  },

  obtenerAjustes: (instalacionId?: number) => {
    const params = instalacionId ? { instalacionId } : undefined;
    return apiClient.get<AjusteApiDto[]>('/api/ajustes', params);
  },

  crearAjuste: (dto: CrearAjusteApiDto) => {
    return apiClient.post<AjusteApiDto>('/api/ajustes', dto);
  },

  // --- TRANSFERENCIAS ---
  obtenerTransferencias: (filtros: { instalacionId?: number; estatus?: string }) => {
    return apiClient.get<TransferenciaApiDto[]>('/api/transferencias', filtros);
  },

  obtenerTransferencia: (id: number) => {
    return apiClient.get<TransferenciaApiDto>(`/api/transferencias/${id}`);
  },

  crearTransferencia: (dto: CrearTransferenciaApiDto) => {
    return apiClient.post<TransferenciaApiDto>('/api/transferencias', dto);
  },

  recibirTransferencia: (id: number, dto: RecibirTransferenciaApiDto) => {
    return apiClient.post<void>(`/api/transferencias/${id}/recibir`, dto);
  },

  cancelarTransferencia: (id: number) => {
    return apiClient.post<void>(`/api/transferencias/${id}/cancelar`);
  }
};