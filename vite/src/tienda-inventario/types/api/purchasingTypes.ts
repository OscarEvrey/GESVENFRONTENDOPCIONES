export interface ProveedorApiDto {
  proveedorId: number;
  nombre: string;
  rfc: string | null;
}

export interface LineaOrdenCompraDto {
  productoId: number;
  cantidad: number;
  costoUnitario: number;
}

export interface CrearOrdenCompraDto {
  instalacionId: number;
  proveedorId: number;
  comentarios?: string;
  lineas: LineaOrdenCompraDto[];
}

export interface DetalleOrdenCompraDto {
  detalleId: number;
  productoId: number;
  productoNombre: string;
  cantidadSolicitada: number;
  costoUnitario: number;
  subtotal: number;
}

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

export interface RecepcionOrdenCompraApiDto {
  lineas: {
    detalleId: number;
    cantidadRecibida: number;
    lote?: string;
    fechaCaducidad?: string;
  }[];
}