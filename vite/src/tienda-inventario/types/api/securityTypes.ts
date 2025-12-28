// DTOs de Seguridad, Autenticación y RBAC

// --- MENÚ DINÁMICO ---
export interface ModuloApiDto {
  moduloId: number;
  nombre: string;
  ruta: string | null;
  icono: string | null;
  orden: number;
  padreId: number | null;
  hijos?: ModuloApiDto[]; // Recursivo
  estadoDesarrollo?: string;
  contenidoAyuda?: string;
}

export interface UsuarioConRolApiDto {
  usuarioId: number;
  nombreCompleto: string;
  email: string;
  rolId: number;
  rolNombre: string;
}

export interface MenuResponseApiDto {
  usuario: UsuarioConRolApiDto;
  menu: ModuloApiDto[];
  permisos: string[]; // Lista de claves ['VENTAS_ACCESS', etc]
}

// --- GESTIÓN DE USUARIOS Y ROLES ---
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

// --- ACCESOS A INSTALACIONES ---
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
}

export interface ActualizarAccesoInstalacionApiDto {
  rolId: number;
  esActivo: boolean;
}