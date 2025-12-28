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