// DTOs de Inventario y Catálogos de Productos

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

export interface ProductoSimpleApiDto {
  productoId: number;
  nombre: string;
  costoSugerido: number;
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

// --- MOVIMIENTOS Y AJUSTES ---

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

// --- TRANSFERENCIAS ---

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