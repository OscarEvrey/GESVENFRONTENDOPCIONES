/**
 * Configuración de la API de Gesven
 * El puerto por defecto 5022 coincide con launchSettings.json del backend
 */
import { getCurrentUserId } from '@/lib/gesven-session';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5022';

function buildHeaders(extra?: Record<string, string>): HeadersInit {
  const userId = getCurrentUserId();
  const base: Record<string, string> = {
    ...(userId !== null ? { 'X-Gesven-UsuarioId': String(userId) } : {}),
  };

  return {
    ...base,
    ...(extra ?? {}),
  };
}

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

export interface ProductoApiDto {
  productoId: number;
  instalacionId: number | null;
  nombre: string;
  codigo: string | null;
  categoria: string | null;
  esInventariable: boolean;
  precioUnitario: number;
  stockMinimo: number;
  marcaId: number | null;
  marcaNombre: string | null;
  unidadId: number | null;
  unidadNombre: string | null;
  estatusId: number | null;
  estatusNombre: string;
}

export interface CrearProductoApiDto {
  instalacionId: number;
  nombre: string;
  marcaId?: number;
  unidadId?: number;
  esInventariable: boolean;
  precioUnitario: number;
  stockMinimo: number;
  codigo?: string;
  categoria?: string;
}

export interface ActualizarProductoApiDto {
  nombre: string;
  marcaId?: number;
  unidadId?: number;
  esInventariable: boolean;
  precioUnitario: number;
  stockMinimo: number;
  codigo?: string;
  categoria?: string;
  activo: boolean;
}

export interface ClienteApiDto {
  clienteId: number;
  rfc: string;
  nombreCorto: string;
  razonSocial: string;
  email: string | null;
  telefono: string | null;
  direccion: string | null;
  ciudad: string | null;
  codigoPostal: string | null;
  contacto: string | null;
  saldo: number;
  activo: boolean;
}

export interface CrearClienteApiDto {
  rfc: string;
  nombreCorto: string;
  razonSocial: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  ciudad?: string;
  codigoPostal?: string;
  contacto?: string;
}

export interface ActualizarClienteApiDto extends CrearClienteApiDto {
  activo: boolean;
}

export interface VentaLineaApiDto {
  productoId: number;
  cantidad: number;
  precioUnitario: number;
  descuento: number;
}

export interface CrearVentaApiDto {
  instalacionId: number;
  clienteId: number;
  comentarios?: string;
  lineas: VentaLineaApiDto[];
}

export interface DetalleVentaApiDto {
  detalleId: number;
  productoId: number;
  productoNombre: string;
  cantidad: number;
  precioUnitario: number;
  descuento: number;
  subtotal: number;
}

export interface VentaApiDto {
  ventaId: number;
  folio: string;
  instalacionId: number;
  instalacionNombre: string;
  clienteId: number;
  clienteNombre: string;
  montoTotal: number;
  estatus: string;
  fechaVenta: string;
  comentarios: string | null;
  detalles: DetalleVentaApiDto[];
}

export interface CrearTransferenciaApiDto {
  instalacionOrigenId: number;
  instalacionDestinoId: number;
  comentarios?: string;
  lineas: { productoId: number; cantidad: number }[];
}

export interface TransferenciaDetalleApiDto {
  detalleId: number;
  productoId: number;
  productoNombre: string;
  cantidadEnviada: number;
  cantidadRecibida: number | null;
}

export interface TransferenciaApiDto {
  transferenciaId: number;
  folio: string;
  instalacionOrigenId: number;
  instalacionOrigenNombre: string;
  instalacionDestinoId: number;
  instalacionDestinoNombre: string;
  fechaEnvio: string;
  fechaRecepcion: string | null;
  estatus: string;
  comentarios: string | null;
  detalles: TransferenciaDetalleApiDto[];
}

export interface RecibirTransferenciaApiDto {
  lineas: { detalleId: number; cantidadRecibida: number }[];
}

export interface CrearAjusteApiDto {
  instalacionId: number;
  productoId: number;
  tipoAjuste: 'E' | 'S';
  cantidad: number;
  motivo: string;
  observaciones?: string;
}

export interface AjusteApiDto {
  ajusteId: number;
  instalacionId: number;
  instalacionNombre: string;
  productoId: number;
  productoNombre: string;
  tipoAjuste: 'E' | 'S';
  cantidad: number;
  stockAnterior: number;
  stockNuevo: number;
  motivo: string;
  observaciones: string | null;
  fechaAjuste: string;
}

export interface MovimientoApiDto {
  movimientoId: number;
  instalacionId: number;
  productoId: number;
  productoNombre: string;
  tipoMovimiento: 'E' | 'S';
  cantidad: number;
  saldoFinal: number;
  costoUnitario: number | null;
  lote: string | null;
  fechaCaducidad: string | null;
  creadoEn: string;
}

export interface RecepcionOrdenCompraApiDto {
  lineas: {
    detalleId: number;
    cantidadRecibida: number;
    lote?: string;
    fechaCaducidad?: string;
  }[];
}

export interface DashboardResumenApiDto {
  productosBajoStock: number;
  ordenesPendientes: number;
  ventasMes: number;
  ventasPendientesFacturar: number;
}

// =====================
// Seguridad / Accesos
// =====================

export interface UsuarioSeguridadApiDto {
  usuarioId: number;
  email: string;
  nombreCompleto: string;
  numeroEmpleado: string | null;
  puesto: string | null;
}

export interface RolSeguridadApiDto {
  rolId: number;
  nombre: string;
  descripcion: string | null;
  esActivo: boolean;
}

export interface PermisosModuloApiDto {
  compras: boolean;
  ventas: boolean;
  inventario: boolean;
  facturacion: boolean;
  pagos: boolean;
  auditoria: boolean;
  catalogos: boolean;
}

export interface AccesoInstalacionApiDto {
  accesoId: number;
  usuarioId: number;
  usuarioNombreCompleto: string;
  usuarioEmail: string;
  usuarioPuesto: string | null;
  instalacionId: number;
  instalacionNombre: string;
  rolId: number;
  rolNombre: string;
  esActivo: boolean;
  permisos: PermisosModuloApiDto;
  creadoEn: string;
  creadoPor: number | null;
  actualizadoEn: string;
  actualizadoPor: number | null;
}

export interface CrearAccesoInstalacionApiDto {
  usuarioId: number;
  instalacionId: number;
  rolId: number;
  esActivo: boolean;
  permisoCompras: boolean;
  permisoVentas: boolean;
  permisoInventario: boolean;
  permisoFacturacion: boolean;
  permisoPagos: boolean;
  permisoAuditoria: boolean;
  permisoCatalogos: boolean;
}

export type ActualizarAccesoInstalacionApiDto = Omit<
  CrearAccesoInstalacionApiDto,
  'usuarioId' | 'instalacionId'
>;

/**
 * Cliente de la API de Gesven
 */
export const gesvenApi = {
  /**
   * Obtiene las instalaciones disponibles para el usuario
   */
  async obtenerInstalaciones(): Promise<InstalacionApiDto[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/instalaciones`, {
        headers: buildHeaders(),
      });
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
      const response = await fetch(`${API_BASE_URL}/api/inventario/${instalacionId}`, {
        headers: buildHeaders(),
      });
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
      const response = await fetch(
        `${API_BASE_URL}/api/inventario/${instalacionId}/productos`,
        {
          headers: buildHeaders(),
        },
      );
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
      const response = await fetch(`${API_BASE_URL}/api/proveedores`, {
        headers: buildHeaders(),
      });
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
          ...buildHeaders({ 'Content-Type': 'application/json' }),
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
      const response = await fetch(url, {
        headers: buildHeaders(),
      });
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

  /**
   * Órdenes de compra pendientes de aprobación
   */
  async obtenerOrdenesPendientes(instalacionId?: number): Promise<OrdenCompraRespuestaDto[]> {
    const url = instalacionId
      ? `${API_BASE_URL}/api/compras/pendientes?instalacionId=${instalacionId}`
      : `${API_BASE_URL}/api/compras/pendientes`;
    const response = await fetch(url, { headers: buildHeaders() });
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    const data: RespuestaApi<OrdenCompraRespuestaDto[]> = await response.json();
    if (!data.exito) {
      throw new Error(data.mensaje);
    }
    return data.datos ?? [];
  },

  /**
   * Órdenes de compra aprobadas para recepción
   */
  async obtenerOrdenesAprobadas(instalacionId?: number): Promise<OrdenCompraRespuestaDto[]> {
    const url = instalacionId
      ? `${API_BASE_URL}/api/compras/aprobadas?instalacionId=${instalacionId}`
      : `${API_BASE_URL}/api/compras/aprobadas`;
    const response = await fetch(url, { headers: buildHeaders() });
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    const data: RespuestaApi<OrdenCompraRespuestaDto[]> = await response.json();
    if (!data.exito) {
      throw new Error(data.mensaje);
    }
    return data.datos ?? [];
  },

  async aprobarOrdenCompra(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/compras/${id}/aprobar`, {
      method: 'POST',
      headers: buildHeaders(),
    });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.mensaje || `Error HTTP: ${response.status}`);
    }
  },

  async rechazarOrdenCompra(id: number, motivo: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/compras/${id}/rechazar`, {
      method: 'POST',
      headers: buildHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(motivo),
    });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.mensaje || `Error HTTP: ${response.status}`);
    }
  },

  async recibirOrdenCompra(id: number, recepcion: RecepcionOrdenCompraApiDto): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/compras/${id}/recibir`, {
      method: 'POST',
      headers: buildHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(recepcion),
    });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.mensaje || `Error HTTP: ${response.status}`);
    }
  },

  /**
   * Productos (catálogo)
   */
  async obtenerProductos(instalacionId?: number): Promise<ProductoApiDto[]> {
    const url = instalacionId
      ? `${API_BASE_URL}/api/productos?instalacionId=${instalacionId}`
      : `${API_BASE_URL}/api/productos`;
    const response = await fetch(url, { headers: buildHeaders() });
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    const data: RespuestaApi<ProductoApiDto[]> = await response.json();
    if (!data.exito) {
      throw new Error(data.mensaje);
    }
    return data.datos ?? [];
  },

  async obtenerProducto(id: number): Promise<ProductoApiDto> {
    const response = await fetch(`${API_BASE_URL}/api/productos/${id}`, { headers: buildHeaders() });
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    const data: RespuestaApi<ProductoApiDto> = await response.json();
    if (!data.exito || !data.datos) {
      throw new Error(data.mensaje || 'Producto no encontrado');
    }
    return data.datos;
  },

  async crearProducto(payload: CrearProductoApiDto): Promise<ProductoApiDto> {
    const response = await fetch(`${API_BASE_URL}/api/productos`, {
      method: 'POST',
      headers: buildHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.mensaje || `Error HTTP: ${response.status}`);
    }
    const data: RespuestaApi<ProductoApiDto> = await response.json();
    if (!data.exito || !data.datos) {
      throw new Error(data.mensaje || 'No se recibió el producto creado');
    }
    return data.datos;
  },

  async actualizarProducto(id: number, payload: ActualizarProductoApiDto): Promise<ProductoApiDto> {
    const response = await fetch(`${API_BASE_URL}/api/productos/${id}`, {
      method: 'PUT',
      headers: buildHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.mensaje || `Error HTTP: ${response.status}`);
    }
    const data: RespuestaApi<ProductoApiDto> = await response.json();
    if (!data.exito || !data.datos) {
      throw new Error(data.mensaje || 'No se recibió el producto actualizado');
    }
    return data.datos;
  },

  async cambiarEstatusProducto(id: number, activo: boolean): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/productos/${id}/estatus?activo=${activo}`, {
      method: 'PATCH',
      headers: buildHeaders(),
    });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.mensaje || `Error HTTP: ${response.status}`);
    }
  },

  /**
   * Clientes
   */
  async obtenerClientes(): Promise<ClienteApiDto[]> {
    const response = await fetch(`${API_BASE_URL}/api/clientes`, { headers: buildHeaders() });
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    const data: RespuestaApi<ClienteApiDto[]> = await response.json();
    if (!data.exito) {
      throw new Error(data.mensaje);
    }
    return data.datos ?? [];
  },

  async obtenerCliente(id: number): Promise<ClienteApiDto> {
    const response = await fetch(`${API_BASE_URL}/api/clientes/${id}`, { headers: buildHeaders() });
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    const data: RespuestaApi<ClienteApiDto> = await response.json();
    if (!data.exito || !data.datos) {
      throw new Error(data.mensaje || 'Cliente no encontrado');
    }
    return data.datos;
  },

  async crearCliente(payload: CrearClienteApiDto): Promise<ClienteApiDto> {
    const response = await fetch(`${API_BASE_URL}/api/clientes`, {
      method: 'POST',
      headers: buildHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.mensaje || `Error HTTP: ${response.status}`);
    }
    const data: RespuestaApi<ClienteApiDto> = await response.json();
    if (!data.exito || !data.datos) {
      throw new Error(data.mensaje || 'No se recibió el cliente creado');
    }
    return data.datos;
  },

  async actualizarCliente(id: number, payload: ActualizarClienteApiDto): Promise<ClienteApiDto> {
    const response = await fetch(`${API_BASE_URL}/api/clientes/${id}`, {
      method: 'PUT',
      headers: buildHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.mensaje || `Error HTTP: ${response.status}`);
    }
    const data: RespuestaApi<ClienteApiDto> = await response.json();
    if (!data.exito || !data.datos) {
      throw new Error(data.mensaje || 'No se recibió el cliente actualizado');
    }
    return data.datos;
  },

  async cambiarEstatusCliente(id: number, activo: boolean): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/clientes/${id}/estatus?activo=${activo}`, {
      method: 'PATCH',
      headers: buildHeaders(),
    });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.mensaje || `Error HTTP: ${response.status}`);
    }
  },

  /**
   * Ventas
   */
  async obtenerVentas(params?: {
    instalacionId?: number;
    desde?: string;
    hasta?: string;
  }): Promise<VentaApiDto[]> {
    const query = new URLSearchParams();
    if (params?.instalacionId) query.append('instalacionId', String(params.instalacionId));
    if (params?.desde) query.append('desde', params.desde);
    if (params?.hasta) query.append('hasta', params.hasta);
    const qs = query.toString();
    const url = qs ? `${API_BASE_URL}/api/ventas?${qs}` : `${API_BASE_URL}/api/ventas`;
    const response = await fetch(url, { headers: buildHeaders() });
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    const data: RespuestaApi<VentaApiDto[]> = await response.json();
    if (!data.exito) {
      throw new Error(data.mensaje);
    }
    return data.datos ?? [];
  },

  async obtenerVenta(id: number): Promise<VentaApiDto> {
    const response = await fetch(`${API_BASE_URL}/api/ventas/${id}`, { headers: buildHeaders() });
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    const data: RespuestaApi<VentaApiDto> = await response.json();
    if (!data.exito || !data.datos) {
      throw new Error(data.mensaje || 'Venta no encontrada');
    }
    return data.datos;
  },

  async crearVenta(payload: CrearVentaApiDto): Promise<VentaApiDto> {
    const response = await fetch(`${API_BASE_URL}/api/ventas`, {
      method: 'POST',
      headers: buildHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.mensaje || `Error HTTP: ${response.status}`);
    }
    const data: RespuestaApi<VentaApiDto> = await response.json();
    if (!data.exito || !data.datos) {
      throw new Error(data.mensaje || 'No se recibió la venta creada');
    }
    return data.datos;
  },

  async cancelarVenta(id: number, motivo?: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/ventas/${id}/cancelar`, {
      method: 'POST',
      headers: buildHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(motivo ?? ''),
    });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.mensaje || `Error HTTP: ${response.status}`);
    }
  },

  /**
   * Transferencias
   */
  async obtenerTransferencias(params?: {
    instalacionId?: number;
    estatus?: string;
  }): Promise<TransferenciaApiDto[]> {
    const query = new URLSearchParams();
    if (params?.instalacionId) query.append('instalacionId', String(params.instalacionId));
    if (params?.estatus) query.append('estatus', params.estatus);
    const qs = query.toString();
    const url = qs
      ? `${API_BASE_URL}/api/transferencias?${qs}`
      : `${API_BASE_URL}/api/transferencias`;
    const response = await fetch(url, { headers: buildHeaders() });
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    const data: RespuestaApi<TransferenciaApiDto[]> = await response.json();
    if (!data.exito) {
      throw new Error(data.mensaje);
    }
    return data.datos ?? [];
  },

  async obtenerTransferencia(id: number): Promise<TransferenciaApiDto> {
    const response = await fetch(`${API_BASE_URL}/api/transferencias/${id}`, {
      headers: buildHeaders(),
    });
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    const data: RespuestaApi<TransferenciaApiDto> = await response.json();
    if (!data.exito || !data.datos) {
      throw new Error(data.mensaje || 'Transferencia no encontrada');
    }
    return data.datos;
  },

  async crearTransferencia(payload: CrearTransferenciaApiDto): Promise<TransferenciaApiDto> {
    const response = await fetch(`${API_BASE_URL}/api/transferencias`, {
      method: 'POST',
      headers: buildHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.mensaje || `Error HTTP: ${response.status}`);
    }
    const data: RespuestaApi<TransferenciaApiDto> = await response.json();
    if (!data.exito || !data.datos) {
      throw new Error(data.mensaje || 'No se recibió la transferencia creada');
    }
    return data.datos;
  },

  async recibirTransferencia(id: number, payload: RecibirTransferenciaApiDto): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/transferencias/${id}/recibir`, {
      method: 'POST',
      headers: buildHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.mensaje || `Error HTTP: ${response.status}`);
    }
  },

  async cancelarTransferencia(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/transferencias/${id}/cancelar`, {
      method: 'POST',
      headers: buildHeaders(),
    });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.mensaje || `Error HTTP: ${response.status}`);
    }
  },

  /**
   * Ajustes de inventario
   */
  async obtenerAjustes(instalacionId?: number): Promise<AjusteApiDto[]> {
    const url = instalacionId
      ? `${API_BASE_URL}/api/ajustes?instalacionId=${instalacionId}`
      : `${API_BASE_URL}/api/ajustes`;
    const response = await fetch(url, { headers: buildHeaders() });
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    const data: RespuestaApi<AjusteApiDto[]> = await response.json();
    if (!data.exito) {
      throw new Error(data.mensaje);
    }
    return data.datos ?? [];
  },

  async crearAjuste(payload: CrearAjusteApiDto): Promise<AjusteApiDto> {
    const response = await fetch(`${API_BASE_URL}/api/ajustes`, {
      method: 'POST',
      headers: buildHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.mensaje || `Error HTTP: ${response.status}`);
    }
    const data: RespuestaApi<AjusteApiDto> = await response.json();
    if (!data.exito || !data.datos) {
      throw new Error(data.mensaje || 'No se recibió el ajuste creado');
    }
    return data.datos;
  },

  /**
   * Movimientos (Kardex)
   */
  async obtenerMovimientos(params?: {
    instalacionId?: number;
    productoId?: number;
    desde?: string;
    hasta?: string;
  }): Promise<MovimientoApiDto[]> {
    const query = new URLSearchParams();
    if (params?.instalacionId) query.append('instalacionId', String(params.instalacionId));
    if (params?.productoId) query.append('productoId', String(params.productoId));
    if (params?.desde) query.append('desde', params.desde);
    if (params?.hasta) query.append('hasta', params.hasta);
    const qs = query.toString();
    const url = qs ? `${API_BASE_URL}/api/movimientos?${qs}` : `${API_BASE_URL}/api/movimientos`;
    const response = await fetch(url, { headers: buildHeaders() });
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    const data: RespuestaApi<MovimientoApiDto[]> = await response.json();
    if (!data.exito) {
      throw new Error(data.mensaje);
    }
    return data.datos ?? [];
  },

  /**
   * Dashboard
   */
  async obtenerDashboardResumen(instalacionId?: number): Promise<DashboardResumenApiDto> {
    const url = instalacionId
      ? `${API_BASE_URL}/api/dashboard/resumen?instalacionId=${instalacionId}`
      : `${API_BASE_URL}/api/dashboard/resumen`;
    const response = await fetch(url, { headers: buildHeaders() });
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    const data: RespuestaApi<DashboardResumenApiDto> = await response.json();
    if (!data.exito || !data.datos) {
      throw new Error(data.mensaje || 'No se recibió el resumen');
    }
    return data.datos;
  },

  // =====================
  // Seguridad / Accesos
  // =====================

  async obtenerUsuariosSeguridad(q?: string): Promise<UsuarioSeguridadApiDto[]> {
    const query = q && q.trim() ? `?q=${encodeURIComponent(q.trim())}` : '';
    const response = await fetch(`${API_BASE_URL}/api/accesos/usuarios${query}`, {
      headers: buildHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data: RespuestaApi<UsuarioSeguridadApiDto[]> = await response.json();
    if (!data.exito) {
      throw new Error(data.mensaje);
    }
    return data.datos ?? [];
  },

  async obtenerRolesSeguridad(): Promise<RolSeguridadApiDto[]> {
    const response = await fetch(`${API_BASE_URL}/api/accesos/roles`, {
      headers: buildHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data: RespuestaApi<RolSeguridadApiDto[]> = await response.json();
    if (!data.exito) {
      throw new Error(data.mensaje);
    }
    return data.datos ?? [];
  },

  async obtenerAccesos(params?: {
    instalacionId?: number;
    usuarioId?: number;
    incluirInactivos?: boolean;
  }): Promise<AccesoInstalacionApiDto[]> {
    const qs = new URLSearchParams();
    if (params?.instalacionId) qs.set('instalacionId', String(params.instalacionId));
    if (params?.usuarioId) qs.set('usuarioId', String(params.usuarioId));
    if (typeof params?.incluirInactivos === 'boolean') {
      qs.set('incluirInactivos', String(params.incluirInactivos));
    }

    const query = qs.toString() ? `?${qs.toString()}` : '';
    const response = await fetch(`${API_BASE_URL}/api/accesos${query}`, {
      headers: buildHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data: RespuestaApi<AccesoInstalacionApiDto[]> = await response.json();
    if (!data.exito) {
      throw new Error(data.mensaje);
    }
    return data.datos ?? [];
  },

  async crearAccesoInstalacion(dto: CrearAccesoInstalacionApiDto): Promise<AccesoInstalacionApiDto> {
    const response = await fetch(`${API_BASE_URL}/api/accesos`, {
      method: 'POST',
      headers: {
        ...buildHeaders({ 'Content-Type': 'application/json' }),
      },
      body: JSON.stringify(dto),
    });

    const data: RespuestaApi<AccesoInstalacionApiDto> = await response.json();
    if (!response.ok || !data.exito) {
      const detalles = (data?.errores ?? []).join(' | ');
      throw new Error(detalles || data?.mensaje || `Error HTTP: ${response.status}`);
    }
    if (!data.datos) {
      throw new Error('Respuesta sin datos al crear acceso');
    }
    return data.datos;
  },

  async actualizarAccesoInstalacion(accesoId: number, dto: ActualizarAccesoInstalacionApiDto): Promise<AccesoInstalacionApiDto> {
    const response = await fetch(`${API_BASE_URL}/api/accesos/${accesoId}`, {
      method: 'PUT',
      headers: {
        ...buildHeaders({ 'Content-Type': 'application/json' }),
      },
      body: JSON.stringify(dto),
    });

    const data: RespuestaApi<AccesoInstalacionApiDto> = await response.json();
    if (!response.ok || !data.exito) {
      const detalles = (data?.errores ?? []).join(' | ');
      throw new Error(detalles || data?.mensaje || `Error HTTP: ${response.status}`);
    }
    if (!data.datos) {
      throw new Error('Respuesta sin datos al actualizar acceso');
    }
    return data.datos;
  },

  async revocarAccesoInstalacion(accesoId: number): Promise<AccesoInstalacionApiDto> {
    const response = await fetch(`${API_BASE_URL}/api/accesos/${accesoId}`, {
      method: 'DELETE',
      headers: buildHeaders(),
    });

    const data: RespuestaApi<AccesoInstalacionApiDto> = await response.json();
    if (!response.ok || !data.exito) {
      const detalles = (data?.errores ?? []).join(' | ');
      throw new Error(detalles || data?.mensaje || `Error HTTP: ${response.status}`);
    }
    if (!data.datos) {
      throw new Error('Respuesta sin datos al revocar acceso');
    }
    return data.datos;
  },
};

export default gesvenApi;
