// DTOs compartidos por varios módulos

export interface InstalacionApiDto {
  instalacionId: number;
  nombre: string;
  tipo: string;
  empresa: string;
  sucursal: string;
  descripcion: string;
}

export interface DashboardResumenApiDto {
  productosBajoStock: number;
  ordenesPendientes: number;
  ventasMes: number;
  ventasPendientesFacturar: number;
}