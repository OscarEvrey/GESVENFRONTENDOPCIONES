/**
 * Configuración de la API de Gesven
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Tipos de respuesta de la API
 */
export interface RespuestaApi<T> {
  exito: boolean;
  mensaje: string;
  datos: T | null;
  errores: string[];
}

/**
 * DTO de Instalación
 */
export interface InstalacionApiDto {
  instalacionId: number;
  nombre: string;
  tipo: string;
  empresa: string;
  sucursal: string;
  descripcion: string;
}

/**
 * DTO de Producto de Inventario
 */
export interface ProductoInventarioApiDto {
  productoId: number;
  codigo: string;
  nombre: string;
  categoria: string;
  unidad: string;
  stockActual: number;
  stockMinimo: number;
  precioUnitario: number;
  estado: 'disponible' | 'bajo_stock' | 'agotado';
  ubicacion: string;
}

/**
 * DTO de Proveedor
 */
export interface ProveedorApiDto {
  proveedorId: number;
  nombre: string;
  rfc: string | null;
}

/**
 * DTO de Producto Simple (para selectores)
 */
export interface ProductoSimpleApiDto {
  productoId: number;
  nombre: string;
  costoSugerido: number;
}

/**
 * DTO para crear una orden de compra
 */
export interface CrearOrdenCompraDto {
  instalacionId: number;
  proveedorId: number;
  comentarios?: string;
  lineas: LineaOrdenCompraDto[];
}

/**
 * DTO de línea de orden de compra
 */
export interface LineaOrdenCompraDto {
  productoId: number;
  cantidad: number;
  costoUnitario: number;
}

/**
 * DTO de respuesta de orden de compra
 */
export interface OrdenCompraRespuestaDto {
  ordenCompraId: number;
  instalacionId: number;
  instalacionNombre: string;
  proveedorId: number;
  proveedorNombre: string;
  estatus: string;
  montoTotal: number;
  comentarios: string | null;
  creadoEn: string;
  detalles: DetalleOrdenCompraDto[];
}

/**
 * DTO de detalle de orden de compra
 */
export interface DetalleOrdenCompraDto {
  detalleId: number;
  productoId: number;
  productoNombre: string;
  cantidadSolicitada: number;
  costoUnitario: number;
  subtotal: number;
}

/**
 * Cliente de la API de Gesven
 */
export const gesvenApi = {
  /**
   * Obtiene las instalaciones disponibles para el usuario
   */
  async obtenerInstalaciones(): Promise<InstalacionApiDto[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/instalaciones`);
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      const data: RespuestaApi<InstalacionApiDto[]> = await response.json();
      if (!data.exito) {
        throw new Error(data.mensaje);
      }
      return data.datos ?? [];
    } catch (error) {
      console.error('Error al obtener instalaciones:', error);
      throw error;
    }
  },

  /**
   * Obtiene el inventario de una instalación
   */
  async obtenerInventario(instalacionId: number): Promise<ProductoInventarioApiDto[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/inventario/${instalacionId}`);
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      const data: RespuestaApi<ProductoInventarioApiDto[]> = await response.json();
      if (!data.exito) {
        throw new Error(data.mensaje);
      }
      return data.datos ?? [];
    } catch (error) {
      console.error('Error al obtener inventario:', error);
      throw error;
    }
  },

  /**
   * Obtiene los productos disponibles para compra de una instalación
   */
  async obtenerProductosParaCompra(instalacionId: number): Promise<ProductoSimpleApiDto[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/inventario/${instalacionId}/productos`);
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      const data: RespuestaApi<ProductoSimpleApiDto[]> = await response.json();
      if (!data.exito) {
        throw new Error(data.mensaje);
      }
      return data.datos ?? [];
    } catch (error) {
      console.error('Error al obtener productos:', error);
      throw error;
    }
  },

  /**
   * Obtiene la lista de proveedores
   */
  async obtenerProveedores(): Promise<ProveedorApiDto[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/compras/proveedores`);
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      const data: RespuestaApi<ProveedorApiDto[]> = await response.json();
      if (!data.exito) {
        throw new Error(data.mensaje);
      }
      return data.datos ?? [];
    } catch (error) {
      console.error('Error al obtener proveedores:', error);
      throw error;
    }
  },

  /**
   * Crea una orden de compra
   */
  async crearOrdenCompra(orden: CrearOrdenCompraDto): Promise<OrdenCompraRespuestaDto> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/compras`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orden),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.mensaje || `Error HTTP: ${response.status}`);
      }
      const data: RespuestaApi<OrdenCompraRespuestaDto> = await response.json();
      if (!data.exito) {
        throw new Error(data.mensaje);
      }
      if (!data.datos) {
        throw new Error('No se recibieron datos de la orden creada');
      }
      return data.datos;
    } catch (error) {
      console.error('Error al crear orden de compra:', error);
      throw error;
    }
  },

  /**
   * Obtiene las órdenes de compra, opcionalmente filtradas por instalación
   */
  async obtenerOrdenesCompra(instalacionId?: number): Promise<OrdenCompraRespuestaDto[]> {
    try {
      const url = instalacionId
        ? `${API_BASE_URL}/api/compras?instalacionId=${instalacionId}`
        : `${API_BASE_URL}/api/compras`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      const data: RespuestaApi<OrdenCompraRespuestaDto[]> = await response.json();
      if (!data.exito) {
        throw new Error(data.mensaje);
      }
      return data.datos ?? [];
    } catch (error) {
      console.error('Error al obtener órdenes de compra:', error);
      throw error;
    }
  },
};

export default gesvenApi;
