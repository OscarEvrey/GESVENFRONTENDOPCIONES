'use client';

import { useMemo, useState } from 'react';
import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  AlertCircle,
  Building2,
  CheckCircle,
  Clock,
  Edit2,
  Key,
  Lock,
  Plus,
  Search,
  Shield,
  Trash2,
  UserCheck,
  Users,
} from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { Alert, AlertDescription, AlertIcon, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTable,
  CardTitle,
} from '@/components/ui/card';
import { DataGrid } from '@/components/ui/data-grid';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { DataGridTable } from '@/components/ui/data-grid-table';
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useContextoInstalacion } from '../../context/ContextoInstalacion';

// ============ TIPOS ============
type RolAcceso = 'Administrador' | 'Ventas' | 'Inventario' | 'Facturación' | 'Pagos';

interface PermisoModulo {
  compras: boolean;
  ventas: boolean;
  inventario: boolean;
  facturacion: boolean;
  pagos: boolean;
  auditoria: boolean;
  catalogos: boolean;
}

interface AccesoUsuario {
  id: string;
  usuarioId: string;
  nombreUsuario: string;
  emailUsuario: string;
  departamento: string;
  instalacionId: string;
  instalacionNombre: string;
  rol: RolAcceso;
  permisos: PermisoModulo;
  activo: boolean;
  fechaAsignacion: string;
  asignadoPor: string;
}

interface RegistroAuditoria {
  id: string;
  fecha: string;
  hora: string;
  usuario: string;
  accion: string;
  detalle: string;
}

// ============ DATOS DE USUARIOS SIMULADOS (Active Directory) ============
const usuariosActiveDirectory = [
  { id: 'usr-001', nombre: 'Juan Pérez García', email: 'jperez@empresa.com', departamento: 'Operaciones' },
  { id: 'usr-002', nombre: 'María López Sánchez', email: 'mlopez@empresa.com', departamento: 'Contabilidad' },
  { id: 'usr-003', nombre: 'Carlos Rodríguez Vega', email: 'crodriguez@empresa.com', departamento: 'Almacén' },
  { id: 'usr-004', nombre: 'Ana Martínez Luna', email: 'amartinez@empresa.com', departamento: 'Ventas' },
  { id: 'usr-005', nombre: 'Roberto Hernández Díaz', email: 'rhernandez@empresa.com', departamento: 'Compras' },
  { id: 'usr-006', nombre: 'Laura González Torres', email: 'lgonzalez@empresa.com', departamento: 'Finanzas' },
  { id: 'usr-007', nombre: 'Pedro Ramírez Soto', email: 'pramirez@empresa.com', departamento: 'Almacén' },
  { id: 'usr-008', nombre: 'Diana Flores Mendoza', email: 'dflores@empresa.com', departamento: 'Administración' },
];

const ROLES: RolAcceso[] = ['Administrador', 'Ventas', 'Inventario', 'Facturación', 'Pagos'];

// ============ PERMISOS POR ROL (predeterminados) ============
const permisosPorRol: Record<RolAcceso, PermisoModulo> = {
  Administrador: {
    compras: true,
    ventas: true,
    inventario: true,
    facturacion: true,
    pagos: true,
    auditoria: true,
    catalogos: true,
  },
  Ventas: {
    compras: false,
    ventas: true,
    inventario: true,
    facturacion: false,
    pagos: false,
    auditoria: false,
    catalogos: true,
  },
  Inventario: {
    compras: true,
    ventas: false,
    inventario: true,
    facturacion: false,
    pagos: false,
    auditoria: false,
    catalogos: true,
  },
  Facturación: {
    compras: false,
    ventas: false,
    inventario: false,
    facturacion: true,
    pagos: false,
    auditoria: false,
    catalogos: false,
  },
  Pagos: {
    compras: false,
    ventas: false,
    inventario: false,
    facturacion: false,
    pagos: true,
    auditoria: false,
    catalogos: false,
  },
};

// ============ DATOS FICTICIOS DE ACCESOS ============
const datosIniciales: AccesoUsuario[] = [
  {
    id: 'acc-001',
    usuarioId: 'usr-001',
    nombreUsuario: 'Juan Pérez García',
    emailUsuario: 'jperez@empresa.com',
    departamento: 'Operaciones',
    instalacionId: 'almacen-scc-mty',
    instalacionNombre: 'Almacen-SCC-MTY',
    rol: 'Administrador',
    permisos: permisosPorRol.Administrador,
    activo: true,
    fechaAsignacion: '2024-01-15',
    asignadoPor: 'Usuario 1',
  },
  {
    id: 'acc-002',
    usuarioId: 'usr-002',
    nombreUsuario: 'María López Sánchez',
    emailUsuario: 'mlopez@empresa.com',
    departamento: 'Contabilidad',
    instalacionId: 'oficinas-scc-mty',
    instalacionNombre: 'Oficinas-SCC-MTY',
    rol: 'Facturación',
    permisos: permisosPorRol.Facturación,
    activo: true,
    fechaAsignacion: '2024-02-20',
    asignadoPor: 'Usuario 1',
  },
  {
    id: 'acc-003',
    usuarioId: 'usr-003',
    nombreUsuario: 'Carlos Rodríguez Vega',
    emailUsuario: 'crodriguez@empresa.com',
    departamento: 'Almacén',
    instalacionId: 'almacen-scc-mty',
    instalacionNombre: 'Almacen-SCC-MTY',
    rol: 'Inventario',
    permisos: permisosPorRol.Inventario,
    activo: true,
    fechaAsignacion: '2024-03-10',
    asignadoPor: 'Usuario 1',
  },
  {
    id: 'acc-004',
    usuarioId: 'usr-004',
    nombreUsuario: 'Ana Martínez Luna',
    emailUsuario: 'amartinez@empresa.com',
    departamento: 'Ventas',
    instalacionId: 'almacen-vaxsa-mty',
    instalacionNombre: 'Almacen-Vaxsa-MTY',
    rol: 'Ventas',
    permisos: permisosPorRol.Ventas,
    activo: true,
    fechaAsignacion: '2024-04-05',
    asignadoPor: 'Usuario 1',
  },
  {
    id: 'acc-005',
    usuarioId: 'usr-005',
    nombreUsuario: 'Roberto Hernández Díaz',
    emailUsuario: 'rhernandez@empresa.com',
    departamento: 'Compras',
    instalacionId: 'oficinas-vaxsa-mty',
    instalacionNombre: 'Oficinas-Vaxsa-MTY',
    rol: 'Administrador',
    permisos: permisosPorRol.Administrador,
    activo: true,
    fechaAsignacion: '2024-01-20',
    asignadoPor: 'Usuario 1',
  },
  {
    id: 'acc-006',
    usuarioId: 'usr-006',
    nombreUsuario: 'Laura González Torres',
    emailUsuario: 'lgonzalez@empresa.com',
    departamento: 'Finanzas',
    instalacionId: 'oficinas-scc-mty',
    instalacionNombre: 'Oficinas-SCC-MTY',
    rol: 'Pagos',
    permisos: permisosPorRol.Pagos,
    activo: true,
    fechaAsignacion: '2024-05-12',
    asignadoPor: 'Usuario 1',
  },
];

// ============ HISTORIAL DE AUDITORÍA ============
const historialAuditoriaInicial: RegistroAuditoria[] = [
  {
    id: 'aud-001',
    fecha: '2024-12-22',
    hora: '09:15:32',
    usuario: 'Usuario 1',
    accion: 'Asignación de acceso',
    detalle: 'Se asignó rol Administrador a Juan Pérez en Almacen-SCC-MTY',
  },
  {
    id: 'aud-002',
    fecha: '2024-12-21',
    hora: '14:30:45',
    usuario: 'Usuario 1',
    accion: 'Modificación de permisos',
    detalle: 'Se modificaron permisos de María López en Oficinas-SCC-MTY',
  },
  {
    id: 'aud-003',
    fecha: '2024-12-20',
    hora: '11:22:18',
    usuario: 'Usuario 1',
    accion: 'Revocación de acceso',
    detalle: 'Se revocó acceso de Pedro Ramírez a Almacen-SCC-MTY',
  },
];

// ============ COMPONENTE PRINCIPAL ============
export function GestionAccesosPage() {
  const { instalacionActiva, instalaciones } = useContextoInstalacion();
  const [datos, setDatos] = useState<AccesoUsuario[]>(datosIniciales);
  const [historialAuditoria, setHistorialAuditoria] = useState<RegistroAuditoria[]>(historialAuditoriaInicial);
  const [busqueda, setBusqueda] = useState('');
  const [tabActiva, setTabActiva] = useState('accesos');
  const [filtroInstalacion, setFiltroInstalacion] = useState<string>('todas');
  const [dialogoAbierto, setDialogoAbierto] = useState(false);
  const [accesoEditando, setAccesoEditando] = useState<AccesoUsuario | null>(null);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);
  const [errores, setErrores] = useState<string[]>([]);

  // Estado del formulario
  const [formulario, setFormulario] = useState({
    usuarioId: '',
    instalacionId: '',
    rol: '' as RolAcceso | '',
    permisos: {
      compras: false,
      ventas: false,
      inventario: false,
      facturacion: false,
      pagos: false,
      auditoria: false,
      catalogos: false,
    },
    activo: true,
  });

  // Redirigir si no hay instalación activa
  if (!instalacionActiva) {
    return <Navigate to="/tienda-inventario/selector-instalacion" replace />;
  }

  // Datos filtrados
  const datosFiltrados = useMemo(() => {
    let resultado = datos;

    if (filtroInstalacion !== 'todas') {
      resultado = resultado.filter((d) => d.instalacionId === filtroInstalacion);
    }

    if (busqueda) {
      const busquedaLower = busqueda.toLowerCase();
      resultado = resultado.filter(
        (d) =>
          d.nombreUsuario.toLowerCase().includes(busquedaLower) ||
          d.emailUsuario.toLowerCase().includes(busquedaLower) ||
          d.instalacionNombre.toLowerCase().includes(busquedaLower) ||
          d.rol.toLowerCase().includes(busquedaLower)
      );
    }

    return resultado;
  }, [datos, busqueda, filtroInstalacion]);

  // Funciones de manejo
  const handleNuevo = () => {
    setAccesoEditando(null);
    setFormulario({
      usuarioId: '',
      instalacionId: '',
      rol: '',
      permisos: {
        compras: false,
        ventas: false,
        inventario: false,
        facturacion: false,
        pagos: false,
        auditoria: false,
        catalogos: false,
      },
      activo: true,
    });
    setErrores([]);
    setDialogoAbierto(true);
  };

  const handleEditar = (acceso: AccesoUsuario) => {
    setAccesoEditando(acceso);
    setFormulario({
      usuarioId: acceso.usuarioId,
      instalacionId: acceso.instalacionId,
      rol: acceso.rol,
      permisos: { ...acceso.permisos },
      activo: acceso.activo,
    });
    setErrores([]);
    setDialogoAbierto(true);
  };

  const handleRolChange = (rol: RolAcceso) => {
    setFormulario({
      ...formulario,
      rol,
      permisos: { ...permisosPorRol[rol] },
    });
  };

  const handleGuardar = () => {
    const nuevosErrores: string[] = [];

    if (!formulario.usuarioId) {
      nuevosErrores.push('Seleccione un usuario');
    }
    if (!formulario.instalacionId) {
      nuevosErrores.push('Seleccione una instalación');
    }
    if (!formulario.rol) {
      nuevosErrores.push('Seleccione un rol');
    }

    // Validar duplicados (usuario + instalación)
    if (!accesoEditando && formulario.usuarioId && formulario.instalacionId) {
      const existe = datos.find(
        (d) => d.usuarioId === formulario.usuarioId && d.instalacionId === formulario.instalacionId
      );
      if (existe) {
        nuevosErrores.push('Este usuario ya tiene acceso asignado a esta instalación');
      }
    }

    if (nuevosErrores.length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    const usuarioSeleccionado = usuariosActiveDirectory.find((u) => u.id === formulario.usuarioId);
    const instalacionSeleccionada = instalaciones.find((i) => i.id === formulario.instalacionId);
    const fechaActual = new Date().toISOString().split('T')[0];

    if (accesoEditando) {
      // Editar acceso existente
      setDatos(
        datos.map((d) =>
          d.id === accesoEditando.id
            ? {
                ...d,
                rol: formulario.rol as RolAcceso,
                permisos: formulario.permisos,
                activo: formulario.activo,
                fechaAsignacion: fechaActual,
                asignadoPor: 'Usuario 1',
              }
            : d
        )
      );

      // Registrar en auditoría
      const nuevoRegistroAuditoria: RegistroAuditoria = {
        id: `aud-${Date.now()}`,
        fecha: fechaActual,
        hora: new Date().toLocaleTimeString('es-MX'),
        usuario: 'Usuario 1',
        accion: 'Modificación de permisos',
        detalle: `Se modificaron permisos de ${accesoEditando.nombreUsuario} en ${accesoEditando.instalacionNombre}`,
      };
      setHistorialAuditoria([nuevoRegistroAuditoria, ...historialAuditoria]);

      setMensajeExito(
        `Permisos actualizados para ${accesoEditando.nombreUsuario}. Registro de auditoría guardado: Usuario 1 - ${fechaActual}`
      );
    } else {
      // Nuevo acceso
      const nuevoAcceso: AccesoUsuario = {
        id: `acc-${Date.now()}`,
        usuarioId: formulario.usuarioId,
        nombreUsuario: usuarioSeleccionado?.nombre || '',
        emailUsuario: usuarioSeleccionado?.email || '',
        departamento: usuarioSeleccionado?.departamento || '',
        instalacionId: formulario.instalacionId,
        instalacionNombre: instalacionSeleccionada?.nombre || '',
        rol: formulario.rol as RolAcceso,
        permisos: formulario.permisos,
        activo: formulario.activo,
        fechaAsignacion: fechaActual,
        asignadoPor: 'Usuario 1',
      };
      setDatos([...datos, nuevoAcceso]);

      // Registrar en auditoría
      const nuevoRegistroAuditoria: RegistroAuditoria = {
        id: `aud-${Date.now()}`,
        fecha: fechaActual,
        hora: new Date().toLocaleTimeString('es-MX'),
        usuario: 'Usuario 1',
        accion: 'Asignación de acceso',
        detalle: `Se asignó rol ${formulario.rol} a ${usuarioSeleccionado?.nombre} en ${instalacionSeleccionada?.nombre}`,
      };
      setHistorialAuditoria([nuevoRegistroAuditoria, ...historialAuditoria]);

      setMensajeExito(
        `Acceso asignado correctamente. Registro de auditoría guardado: Usuario 1 - ${fechaActual}`
      );
    }

    setDialogoAbierto(false);
    setTimeout(() => setMensajeExito(null), 5000);
  };

  const handleRevocar = (acceso: AccesoUsuario) => {
    const fechaActual = new Date().toISOString().split('T')[0];
    
    setDatos(datos.filter((d) => d.id !== acceso.id));

    // Registrar en auditoría
    const nuevoRegistroAuditoria: RegistroAuditoria = {
      id: `aud-${Date.now()}`,
      fecha: fechaActual,
      hora: new Date().toLocaleTimeString('es-MX'),
      usuario: 'Usuario 1',
      accion: 'Revocación de acceso',
      detalle: `Se revocó acceso de ${acceso.nombreUsuario} a ${acceso.instalacionNombre}`,
    };
    setHistorialAuditoria([nuevoRegistroAuditoria, ...historialAuditoria]);

    setMensajeExito(
      `Acceso revocado. Registro de auditoría guardado: Usuario 1 - ${fechaActual}`
    );
    setTimeout(() => setMensajeExito(null), 5000);
  };

  // Columnas de la tabla
  const columnas: ColumnDef<AccesoUsuario>[] = useMemo(
    () => [
      {
        accessorKey: 'nombreUsuario',
        header: ({ column }) => (
          <DataGridColumnHeader column={column} title="Usuario" />
        ),
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="font-medium">{row.original.nombreUsuario}</span>
            <span className="text-xs text-muted-foreground">{row.original.emailUsuario}</span>
          </div>
        ),
      },
      {
        accessorKey: 'departamento',
        header: ({ column }) => (
          <DataGridColumnHeader column={column} title="Departamento" />
        ),
        cell: ({ row }) => (
          <span className="text-sm">{row.original.departamento}</span>
        ),
      },
      {
        accessorKey: 'instalacionNombre',
        header: ({ column }) => (
          <DataGridColumnHeader column={column} title="Instalación" />
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{row.original.instalacionNombre}</span>
          </div>
        ),
      },
      {
        accessorKey: 'rol',
        header: ({ column }) => (
          <DataGridColumnHeader column={column} title="Rol" />
        ),
        cell: ({ row }) => {
          const rol = row.original.rol;
          const colorRol: Record<RolAcceso, string> = {
            Administrador: 'bg-purple-100 text-purple-800',
            Ventas: 'bg-green-100 text-green-800',
            Inventario: 'bg-blue-100 text-blue-800',
            Facturación: 'bg-amber-100 text-amber-800',
            Pagos: 'bg-cyan-100 text-cyan-800',
          };
          return (
            <Badge className={colorRol[rol]}>{rol}</Badge>
          );
        },
      },
      {
        accessorKey: 'activo',
        header: ({ column }) => (
          <DataGridColumnHeader column={column} title="Estatus" />
        ),
        cell: ({ row }) => {
          const activo = row.original.activo;
          return (
            <Badge className={activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
              {activo ? 'Activo' : 'Inactivo'}
            </Badge>
          );
        },
      },
      {
        accessorKey: 'fechaAsignacion',
        header: ({ column }) => (
          <DataGridColumnHeader column={column} title="Asignación" />
        ),
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="text-sm">{row.original.fechaAsignacion}</span>
            <span className="text-xs text-muted-foreground">Por: {row.original.asignadoPor}</span>
          </div>
        ),
      },
      {
        id: 'acciones',
        header: () => <span className="text-xs font-medium">Acciones</span>,
        cell: ({ row }) => (
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleEditar(row.original)}
              className="gap-1"
            >
              <Edit2 className="h-3 w-3" />
              Editar
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleRevocar(row.original)}
              className="gap-1"
            >
              <Trash2 className="h-3 w-3" />
              Revocar
            </Button>
          </div>
        ),
      },
    ],
    [],
  );

  // Tabla
  const tabla = useReactTable({
    data: datosFiltrados,
    columns: columnas,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: { pageSize: 10 },
    },
  });

  // Estadísticas
  const estadisticas = useMemo(() => {
    const activos = datos.filter((d) => d.activo);
    const porRol = ROLES.reduce((acc, rol) => {
      acc[rol] = datos.filter((d) => d.rol === rol).length;
      return acc;
    }, {} as Record<RolAcceso, number>);

    return {
      totalAccesos: datos.length,
      accesosActivos: activos.length,
      porRol,
    };
  }, [datos]);

  return (
    <div className="grow content-start p-5 lg:p-7.5 space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Administración de Accesos
          </h1>
          <p className="text-sm text-muted-foreground">
            Gestione los accesos de usuarios a instalaciones y permisos del sistema
          </p>
        </div>
        <Button onClick={handleNuevo} className="gap-2">
          <Plus className="h-4 w-4" />
          Asignar Nuevo Acceso
        </Button>
      </div>

      {/* Mensaje de éxito */}
      {mensajeExito && (
        <Alert variant="success">
          <AlertIcon>
            <CheckCircle className="h-4 w-4" />
          </AlertIcon>
          <AlertTitle>Operación Exitosa</AlertTitle>
          <AlertDescription>{mensajeExito}</AlertDescription>
        </Alert>
      )}

      {/* Estadísticas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{estadisticas.totalAccesos}</p>
                <p className="text-xs text-muted-foreground">Total Accesos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-green-600">
                <UserCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{estadisticas.accesosActivos}</p>
                <p className="text-xs text-muted-foreground">Accesos Activos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{estadisticas.porRol.Administrador}</p>
                <p className="text-xs text-muted-foreground">Administradores</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                <Key className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{instalaciones.length}</p>
                <p className="text-xs text-muted-foreground">Instalaciones</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={tabActiva} onValueChange={setTabActiva}>
        <TabsList>
          <TabsTrigger value="accesos" className="gap-2">
            <Key className="h-4 w-4" />
            Matriz de Accesos
          </TabsTrigger>
          <TabsTrigger value="auditoria" className="gap-2">
            <Clock className="h-4 w-4" />
            Historial de Auditoría
          </TabsTrigger>
        </TabsList>

        {/* Tab: Accesos */}
        <TabsContent value="accesos">
          <Card>
            <CardHeader>
              <CardTitle>Accesos Usuario-Instalación-Rol</CardTitle>
              <CardDescription>
                Lista de todos los accesos asignados en el sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filtros */}
              <div className="flex flex-col gap-4 md:flex-row md:items-center mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por usuario, email, instalación o rol..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filtroInstalacion} onValueChange={setFiltroInstalacion}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Filtrar por instalación" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas las instalaciones</SelectItem>
                    {instalaciones.map((inst) => (
                      <SelectItem key={inst.id} value={inst.id}>
                        {inst.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardTable>
              <ScrollArea className="w-full">
                <DataGrid table={tabla}>
                  <DataGridTable />
                </DataGrid>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </CardTable>
            <CardFooter className="justify-end">
              <p className="text-xs text-muted-foreground">
                Última modificación: Usuario 1 - {new Date().toLocaleDateString('es-MX')}
              </p>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Tab: Auditoría */}
        <TabsContent value="auditoria">
          <Card>
            <CardHeader>
              <CardTitle>Historial de Cambios</CardTitle>
              <CardDescription>
                Registro de todas las modificaciones en accesos y permisos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {historialAuditoria.map((registro) => (
                  <div
                    key={registro.id}
                    className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline">{registro.accion}</Badge>
                        <span className="text-xs text-muted-foreground">
                          {registro.fecha} {registro.hora}
                        </span>
                      </div>
                      <p className="text-sm">{registro.detalle}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Registrado por: {registro.usuario}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Diálogo de Asignación/Edición */}
      <Dialog open={dialogoAbierto} onOpenChange={setDialogoAbierto}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {accesoEditando ? 'Editar Acceso' : 'Asignar Nuevo Acceso'}
            </DialogTitle>
            <DialogDescription>
              {accesoEditando
                ? 'Modifique los permisos del usuario seleccionado'
                : 'Configure el acceso para un nuevo usuario'}
            </DialogDescription>
          </DialogHeader>

          <DialogBody className="space-y-5">
            {/* Errores */}
            {errores.length > 0 && (
              <Alert variant="destructive">
                <AlertIcon>
                  <AlertCircle className="h-4 w-4" />
                </AlertIcon>
                <AlertTitle>Error de Validación</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc list-inside">
                    {errores.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {/* Selector de Usuario */}
            <div className="space-y-2">
              <Label htmlFor="usuario">Usuario (Active Directory) *</Label>
              <Select
                value={formulario.usuarioId}
                onValueChange={(value) => setFormulario({ ...formulario, usuarioId: value })}
                disabled={!!accesoEditando}
              >
                <SelectTrigger id="usuario">
                  <SelectValue placeholder="Seleccionar usuario..." />
                </SelectTrigger>
                <SelectContent>
                  {usuariosActiveDirectory.map((usuario) => (
                    <SelectItem key={usuario.id} value={usuario.id}>
                      <div className="flex flex-col">
                        <span>{usuario.nombre}</span>
                        <span className="text-xs text-muted-foreground">
                          {usuario.email} • {usuario.departamento}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Selector de Instalación */}
            <div className="space-y-2">
              <Label htmlFor="instalacion">Instalación *</Label>
              <Select
                value={formulario.instalacionId}
                onValueChange={(value) => setFormulario({ ...formulario, instalacionId: value })}
                disabled={!!accesoEditando}
              >
                <SelectTrigger id="instalacion">
                  <SelectValue placeholder="Seleccionar instalación..." />
                </SelectTrigger>
                <SelectContent>
                  {instalaciones.map((inst) => (
                    <SelectItem key={inst.id} value={inst.id}>
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        <span>{inst.nombre}</span>
                        <Badge variant="outline" className="ml-2">
                          {inst.empresa}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Selector de Rol */}
            <div className="space-y-2">
              <Label htmlFor="rol">Rol *</Label>
              <Select
                value={formulario.rol}
                onValueChange={(value) => handleRolChange(value as RolAcceso)}
              >
                <SelectTrigger id="rol">
                  <SelectValue placeholder="Seleccionar rol..." />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map((rol) => (
                    <SelectItem key={rol} value={rol}>
                      {rol}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                El rol define los permisos predeterminados que se asignarán
              </p>
            </div>

            {/* Permisos Específicos */}
            {formulario.rol && (
              <div className="space-y-3">
                <Label>Permisos Específicos por Módulo</Label>
                <div className="grid grid-cols-2 gap-3 p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="perm-compras" className="text-sm">
                      Compras
                    </Label>
                    <Switch
                      id="perm-compras"
                      checked={formulario.permisos.compras}
                      onCheckedChange={(checked) =>
                        setFormulario({
                          ...formulario,
                          permisos: { ...formulario.permisos, compras: checked },
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="perm-ventas" className="text-sm">
                      Ventas
                    </Label>
                    <Switch
                      id="perm-ventas"
                      checked={formulario.permisos.ventas}
                      onCheckedChange={(checked) =>
                        setFormulario({
                          ...formulario,
                          permisos: { ...formulario.permisos, ventas: checked },
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="perm-inventario" className="text-sm">
                      Inventario
                    </Label>
                    <Switch
                      id="perm-inventario"
                      checked={formulario.permisos.inventario}
                      onCheckedChange={(checked) =>
                        setFormulario({
                          ...formulario,
                          permisos: { ...formulario.permisos, inventario: checked },
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="perm-facturacion" className="text-sm">
                      Facturación
                    </Label>
                    <Switch
                      id="perm-facturacion"
                      checked={formulario.permisos.facturacion}
                      onCheckedChange={(checked) =>
                        setFormulario({
                          ...formulario,
                          permisos: { ...formulario.permisos, facturacion: checked },
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="perm-pagos" className="text-sm">
                      Pagos
                    </Label>
                    <Switch
                      id="perm-pagos"
                      checked={formulario.permisos.pagos}
                      onCheckedChange={(checked) =>
                        setFormulario({
                          ...formulario,
                          permisos: { ...formulario.permisos, pagos: checked },
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="perm-auditoria" className="text-sm">
                      Auditoría
                    </Label>
                    <Switch
                      id="perm-auditoria"
                      checked={formulario.permisos.auditoria}
                      onCheckedChange={(checked) =>
                        setFormulario({
                          ...formulario,
                          permisos: { ...formulario.permisos, auditoria: checked },
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between col-span-2">
                    <Label htmlFor="perm-catalogos" className="text-sm">
                      Catálogos
                    </Label>
                    <Switch
                      id="perm-catalogos"
                      checked={formulario.permisos.catalogos}
                      onCheckedChange={(checked) =>
                        setFormulario({
                          ...formulario,
                          permisos: { ...formulario.permisos, catalogos: checked },
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Estatus */}
            <div className="flex items-center gap-3">
              <Switch
                id="activo"
                checked={formulario.activo}
                onCheckedChange={(checked) =>
                  setFormulario({ ...formulario, activo: checked })
                }
              />
              <Label htmlFor="activo">
                {formulario.activo ? 'Acceso Activo' : 'Acceso Inactivo'}
              </Label>
            </div>

            {/* Leyenda de auditoría */}
            <div className="text-xs text-muted-foreground border-t pt-3 mt-3">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Última modificación: Usuario 1 - {new Date().toLocaleDateString('es-MX')}
              </span>
            </div>
          </DialogBody>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button onClick={handleGuardar}>
              {accesoEditando ? 'Guardar Cambios' : 'Asignar Acceso'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
