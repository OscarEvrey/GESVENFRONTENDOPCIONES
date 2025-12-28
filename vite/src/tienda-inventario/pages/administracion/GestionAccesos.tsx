'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
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
  Plus,
  Search,
  Shield,
  Trash2,
  UserCheck,
  Users,
} from 'lucide-react';
 
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
import gesvenApi, {
  AccesoInstalacionApiDto,
  RolSeguridadApiDto,
  UsuarioSeguridadApiDto,
} from '../../services/gesvenApi';

// ============ TIPOS ============
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
  accesoId: number;
  usuarioId: number;
  nombreUsuario: string;
  emailUsuario: string;
  departamento: string;
  instalacionId: number;
  instalacionNombre: string;
  rolId: number;
  rolNombre: string;
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

const permisosVacios: PermisoModulo = {
  compras: false,
  ventas: false,
  inventario: false,
  facturacion: false,
  pagos: false,
  auditoria: false,
  catalogos: false,
};

const permisosPorRolNombre: Record<string, PermisoModulo> = {
  administrador: {
    compras: true,
    ventas: true,
    inventario: true,
    facturacion: true,
    pagos: true,
    auditoria: true,
    catalogos: true,
  },
  ventas: {
    compras: false,
    ventas: true,
    inventario: true,
    facturacion: false,
    pagos: false,
    auditoria: false,
    catalogos: true,
  },
  inventario: {
    compras: true,
    ventas: false,
    inventario: true,
    facturacion: false,
    pagos: false,
    auditoria: false,
    catalogos: true,
  },
  facturacion: {
    compras: false,
    ventas: false,
    inventario: false,
    facturacion: true,
    pagos: false,
    auditoria: false,
    catalogos: false,
  },
  facturación: {
    compras: false,
    ventas: false,
    inventario: false,
    facturacion: true,
    pagos: false,
    auditoria: false,
    catalogos: false,
  },
  pagos: {
    compras: false,
    ventas: false,
    inventario: false,
    facturacion: false,
    pagos: true,
    auditoria: false,
    catalogos: false,
  },
};

function permisosDesdeApi(dto: AccesoInstalacionApiDto): PermisoModulo {
  return {
    compras: !!dto.permisos?.compras,
    ventas: !!dto.permisos?.ventas,
    inventario: !!dto.permisos?.inventario,
    facturacion: !!dto.permisos?.facturacion,
    pagos: !!dto.permisos?.pagos,
    auditoria: !!dto.permisos?.auditoria,
    catalogos: !!dto.permisos?.catalogos,
  };
}

function fechaIsoAFecha(iso: string): string {
  if (!iso) return '';
  return iso.split('T')[0];
}

function isoAHora(iso: string): string {
  if (!iso) return '';
  const t = iso.split('T')[1] ?? '';
  return t.replace('Z', '').split('.')[0] ?? '';
}

function accesosADerivadosAuditoria(accesos: AccesoUsuario[]): RegistroAuditoria[] {
  const items: RegistroAuditoria[] = [];

  for (const a of accesos) {
    if (a.fechaAsignacion) {
      items.push({
        id: `aud-creado-${a.accesoId}`,
        fecha: a.fechaAsignacion,
        hora: '00:00:00',
        usuario: a.asignadoPor,
        accion: 'Asignación de acceso',
        detalle: `Se asignó rol ${a.rolNombre} a ${a.nombreUsuario} en ${a.instalacionNombre}`,
      });
    }
  }

  return items
    .sort((x, y) => (y.fecha + y.hora).localeCompare(x.fecha + x.hora))
    .slice(0, 50);
}

// ============ COMPONENTE PRINCIPAL ============
export function GestionAccesosPage() {
  const { instalaciones } = useContextoInstalacion();
  const [datos, setDatos] = useState<AccesoUsuario[]>([]);
  const [historialAuditoria, setHistorialAuditoria] = useState<RegistroAuditoria[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [tabActiva, setTabActiva] = useState('accesos');
  const [filtroInstalacion, setFiltroInstalacion] = useState<string>('todas');
  const [dialogoAbierto, setDialogoAbierto] = useState(false);
  const [accesoEditando, setAccesoEditando] = useState<AccesoUsuario | null>(null);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);
  const [errores, setErrores] = useState<string[]>([]);
  const [cargando, setCargando] = useState(false);
  const [usuarios, setUsuarios] = useState<UsuarioSeguridadApiDto[]>([]);
  const [roles, setRoles] = useState<RolSeguridadApiDto[]>([]);

  // Estado del formulario
  const [formulario, setFormulario] = useState({
    usuarioId: '',
    instalacionId: '',
    rolId: '',
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

  const cargarDatos = useCallback(async () => {
    try {
      setCargando(true);
      const [usuariosApi, rolesApi, accesosApi] = await Promise.all([
        gesvenApi.obtenerUsuariosSeguridad(),
        gesvenApi.obtenerRolesSeguridad(),
        gesvenApi.obtenerAccesos({ incluirInactivos: true }),
      ]);

      setUsuarios(usuariosApi);
      setRoles(rolesApi);

      const accesos: AccesoUsuario[] = accesosApi.map((a: AccesoInstalacionApiDto) => ({
        accesoId: a.accesoId,
        usuarioId: a.usuarioId,
        nombreUsuario: a.usuarioNombreCompleto,
        emailUsuario: a.usuarioEmail,
        departamento: a.usuarioPuesto ?? '-',
        instalacionId: a.instalacionId,
        instalacionNombre: a.instalacionNombre,
        rolId: a.rolId,
        rolNombre: a.rolNombre,
        permisos: permisosDesdeApi(a),
        activo: a.esActivo,
        fechaAsignacion: fechaIsoAFecha(a.actualizadoEn || a.creadoEn),
        asignadoPor: a.actualizadoPor ? `Usuario ${a.actualizadoPor}` : a.creadoPor ? `Usuario ${a.creadoPor}` : 'Sistema',
      }));

      setDatos(accesos);
      setHistorialAuditoria(accesosADerivadosAuditoria(accesos));
    } catch (e) {
      setErrores([e instanceof Error ? e.message : 'Error desconocido al cargar accesos']);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

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
      rolId: '',
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

  const handleEditar = useCallback((acceso: AccesoUsuario) => {
    setAccesoEditando(acceso);
    setFormulario({
      usuarioId: String(acceso.usuarioId),
      instalacionId: String(acceso.instalacionId),
      rolId: String(acceso.rolId),
      permisos: { ...acceso.permisos },
      activo: acceso.activo,
    });
    setErrores([]);
    setDialogoAbierto(true);
  }, []);

  const handleRolChange = (rolId: string) => {
    const rol = roles.find((r) => String(r.rolId) === rolId);
    const nombre = (rol?.nombre ?? '').toLowerCase();
    const preset = permisosPorRolNombre[nombre] ?? permisosVacios;
    setFormulario({
      ...formulario,
      rolId,
      permisos: { ...preset },
    });
  };

  const handleGuardar = async () => {
    const nuevosErrores: string[] = [];

    if (!formulario.usuarioId) {
      nuevosErrores.push('Seleccione un usuario');
    }
    if (!formulario.instalacionId) {
      nuevosErrores.push('Seleccione una instalación');
    }
    if (!formulario.rolId) {
      nuevosErrores.push('Seleccione un rol');
    }

    // Validar duplicados (usuario + instalación)
    if (!accesoEditando && formulario.usuarioId && formulario.instalacionId) {
      const uid = Number(formulario.usuarioId);
      const iid = Number(formulario.instalacionId);
      const existe = datos.find((d) => d.usuarioId === uid && d.instalacionId === iid);
      if (existe) {
        nuevosErrores.push('Este usuario ya tiene acceso asignado a esta instalación');
      }
    }

    if (nuevosErrores.length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    const usuarioSeleccionado = usuarios.find((u) => String(u.usuarioId) === formulario.usuarioId);
    const instalacionSeleccionada = instalaciones.find((i) => String(i.instalacionId) === formulario.instalacionId);
    const fechaActual = new Date().toISOString().split('T')[0];

    try {
      setErrores([]);
      setCargando(true);

      const usuarioId = Number(formulario.usuarioId);
      const instalacionId = Number(formulario.instalacionId);
      const rolId = Number(formulario.rolId);

      if (!Number.isFinite(usuarioId) || !Number.isFinite(instalacionId) || !Number.isFinite(rolId)) {
        setErrores(['Usuario/Instalación/Rol inválidos']);
        return;
      }

      if (accesoEditando) {
        await gesvenApi.actualizarAccesoInstalacion(accesoEditando.accesoId, {
          rolId,
          esActivo: formulario.activo,
          permisoCompras: formulario.permisos.compras,
          permisoVentas: formulario.permisos.ventas,
          permisoInventario: formulario.permisos.inventario,
          permisoFacturacion: formulario.permisos.facturacion,
          permisoPagos: formulario.permisos.pagos,
          permisoAuditoria: formulario.permisos.auditoria,
          permisoCatalogos: formulario.permisos.catalogos,
        });

        setMensajeExito(`Permisos actualizados para ${accesoEditando.nombreUsuario}.`);
      } else {
        await gesvenApi.crearAccesoInstalacion({
          usuarioId,
          instalacionId,
          rolId,
          esActivo: formulario.activo,
          permisoCompras: formulario.permisos.compras,
          permisoVentas: formulario.permisos.ventas,
          permisoInventario: formulario.permisos.inventario,
          permisoFacturacion: formulario.permisos.facturacion,
          permisoPagos: formulario.permisos.pagos,
          permisoAuditoria: formulario.permisos.auditoria,
          permisoCatalogos: formulario.permisos.catalogos,
        });

        setMensajeExito(
          `Acceso asignado correctamente a ${usuarioSeleccionado?.nombreCompleto ?? 'usuario'}.`
        );
      }

      setDialogoAbierto(false);
      await cargarDatos();
      setTimeout(() => setMensajeExito(null), 5000);

      // Registrar auditoría local (vista)
      const nuevoRegistroAuditoria: RegistroAuditoria = {
        id: `aud-${Date.now()}`,
        fecha: fechaActual,
        hora: new Date().toLocaleTimeString('es-MX'),
        usuario: 'Sistema',
        accion: accesoEditando ? 'Modificación de permisos' : 'Asignación de acceso',
        detalle: accesoEditando
          ? `Se modificaron permisos de ${accesoEditando.nombreUsuario} en ${accesoEditando.instalacionNombre}`
          : `Se asignó rol ${roles.find((r) => String(r.rolId) === formulario.rolId)?.nombre ?? ''} a ${usuarioSeleccionado?.nombreCompleto ?? ''} en ${instalacionSeleccionada?.nombre ?? ''}`,
      };
      setHistorialAuditoria([nuevoRegistroAuditoria, ...historialAuditoria].slice(0, 50));
    } catch (e) {
      setErrores([e instanceof Error ? e.message : 'Error desconocido al guardar acceso']);
    } finally {
      setCargando(false);
    }
  };

  const handleRevocar = useCallback(
    async (acceso: AccesoUsuario) => {
      const fechaActual = new Date().toISOString().split('T')[0];
      try {
        setErrores([]);
        setCargando(true);
        await gesvenApi.revocarAccesoInstalacion(acceso.accesoId);
        await cargarDatos();

        const nuevoRegistroAuditoria: RegistroAuditoria = {
          id: `aud-${Date.now()}`,
          fecha: fechaActual,
          hora: new Date().toLocaleTimeString('es-MX'),
          usuario: 'Sistema',
          accion: 'Revocación de acceso',
          detalle: `Se revocó acceso de ${acceso.nombreUsuario} a ${acceso.instalacionNombre}`,
        };
        setHistorialAuditoria([nuevoRegistroAuditoria, ...historialAuditoria].slice(0, 50));

        setMensajeExito('Acceso revocado.');
        setTimeout(() => setMensajeExito(null), 5000);
      } catch (e) {
        setErrores([e instanceof Error ? e.message : 'Error desconocido al revocar acceso']);
      } finally {
        setCargando(false);
      }
    },
    [cargarDatos, historialAuditoria],
  );

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
        accessorKey: 'rolNombre',
        header: ({ column }) => (
          <DataGridColumnHeader column={column} title="Rol" />
        ),
        cell: ({ row }) => {
          const rol = row.original.rolNombre;
          const colorRol: Record<string, string> = {
            Administrador: 'bg-purple-100 text-purple-800',
            Ventas: 'bg-green-100 text-green-800',
            Inventario: 'bg-blue-100 text-blue-800',
            Facturacion: 'bg-amber-100 text-amber-800',
            Facturación: 'bg-amber-100 text-amber-800',
            Pagos: 'bg-cyan-100 text-cyan-800',
          };
          const cls = colorRol[rol] ?? '';
          return (
            <Badge className={cls || undefined} variant={cls ? undefined : 'outline'}>
              {rol}
            </Badge>
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
    [handleEditar, handleRevocar],
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
    const porRol = roles.reduce((acc, rol) => {
      acc[rol.nombre] = datos.filter((d) => d.rolNombre === rol.nombre).length;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalAccesos: datos.length,
      accesosActivos: activos.length,
      porRol,
    };
  }, [datos, roles]);

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

      {/* Error general / carga */}
      {cargando && (
        <Alert>
          <AlertIcon>
            <Clock className="h-4 w-4" />
          </AlertIcon>
          <AlertTitle>Cargando</AlertTitle>
          <AlertDescription>Sincronizando accesos con el servidor...</AlertDescription>
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
                      <SelectItem key={inst.instalacionId} value={String(inst.instalacionId)}>
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
                  {usuarios.map((usuario) => (
                    <SelectItem key={usuario.usuarioId} value={String(usuario.usuarioId)}>
                      <div className="flex flex-col">
                        <span>{usuario.nombreCompleto}</span>
                        <span className="text-xs text-muted-foreground">
                          {usuario.email}{usuario.puesto ? ` • ${usuario.puesto}` : ''}
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
                    <SelectItem key={inst.instalacionId} value={String(inst.instalacionId)}>
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
                value={formulario.rolId}
                onValueChange={(value) => handleRolChange(value)}
              >
                <SelectTrigger id="rol">
                  <SelectValue placeholder="Seleccionar rol..." />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((rol) => (
                    <SelectItem key={rol.rolId} value={String(rol.rolId)}>
                      {rol.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                El rol define los permisos predeterminados que se asignarán
              </p>
            </div>

            {/* Permisos Específicos */}
            {formulario.rolId && (
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
            <Button onClick={handleGuardar} disabled={cargando}>
              {accesoEditando ? 'Guardar Cambios' : 'Asignar Acceso'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
