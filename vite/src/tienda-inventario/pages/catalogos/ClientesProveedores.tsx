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
  CheckCircle,
  Clock,
  Edit2,
  Mail,
  Phone,
  Plus,
  Search,
  Truck,
  User,
  Users,
} from 'lucide-react';
 
import { Alert, AlertDescription, AlertIcon, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTable,
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
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useInstalacionActivaObligatoria } from '../../context/ContextoInstalacion';

// ============ TIPOS ============
type TipoEntidad = 'cliente' | 'proveedor';

interface ClienteProveedor {
  id: string;
  tipo: TipoEntidad;
  rfc: string;
  nombreCorto: string;
  razonSocial: string;
  email: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  codigoPostal: string;
  contacto: string;
  activo: boolean;
  fechaCreacion: string;
}

// ============ DATOS FICTICIOS ============
const datosIniciales: ClienteProveedor[] = [
  // Clientes
  {
    id: 'cli-001',
    tipo: 'cliente',
    rfc: 'CNO920815AB0',
    nombreCorto: 'COM NORTE',
    razonSocial: 'Comercializadora del Norte SA de CV',
    email: 'compras@comnorte.com',
    telefono: '81-1234-5678',
    direccion: 'Av. Constitución 1500, Col. Centro',
    ciudad: 'Monterrey, NL',
    codigoPostal: '64000',
    contacto: 'Lic. Carlos Méndez',
    activo: true,
    fechaCreacion: '2023-01-15',
  },
  {
    id: 'cli-002',
    tipo: 'cliente',
    rfc: 'DRE881023CD5',
    nombreCorto: 'REGIO EXPRESS',
    razonSocial: 'Distribuidora Regio Express SA',
    email: 'ventas@regioexpress.mx',
    telefono: '81-8765-4321',
    direccion: 'Blvd. Díaz Ordaz 234, Col. Santa María',
    ciudad: 'San Pedro Garza García, NL',
    codigoPostal: '66220',
    contacto: 'Ing. María González',
    activo: true,
    fechaCreacion: '2023-03-22',
  },
  {
    id: 'cli-003',
    tipo: 'cliente',
    rfc: 'TDM950612GH3',
    nombreCorto: 'DON MANUEL',
    razonSocial: 'Tiendas Don Manuel S de RL',
    email: 'admin@donmanuel.com',
    telefono: '81-2345-6789',
    direccion: 'Calle Morelos 567, Col. Obrera',
    ciudad: 'Monterrey, NL',
    codigoPostal: '64010',
    contacto: 'Manuel Rodríguez',
    activo: true,
    fechaCreacion: '2023-05-10',
  },
  {
    id: 'cli-004',
    tipo: 'cliente',
    rfc: 'ALE780930JK1',
    nombreCorto: 'LA ESPERANZA',
    razonSocial: 'Abarrotes La Esperanza SA',
    email: 'compras@laesperanza.mx',
    telefono: '81-3456-7890',
    direccion: 'Av. Ruiz Cortines 890, Col. Cumbres',
    ciudad: 'Monterrey, NL',
    codigoPostal: '64610',
    contacto: 'Sra. Patricia López',
    activo: false,
    fechaCreacion: '2022-11-05',
  },
  // Proveedores
  {
    id: 'prov-001',
    tipo: 'proveedor',
    rfc: 'CBG870420XY9',
    nombreCorto: 'BEBIDAS GOLFO',
    razonSocial: 'Comercializadora de Bebidas del Golfo SA de CV',
    email: 'ventas@bebidasgolfo.com',
    telefono: '81-4567-8901',
    direccion: 'Parque Industrial Apodaca, Nave 15',
    ciudad: 'Apodaca, NL',
    codigoPostal: '66600',
    contacto: 'Lic. Roberto Sánchez',
    activo: true,
    fechaCreacion: '2022-08-12',
  },
  {
    id: 'prov-002',
    tipo: 'proveedor',
    rfc: 'DPO910530QR7',
    nombreCorto: 'PAPELERIA OMEGA',
    razonSocial: 'Distribuidora de Papelería Omega SA',
    email: 'pedidos@papeleriaomega.com',
    telefono: '81-5678-9012',
    direccion: 'Av. Chapultepec 450, Col. Roma',
    ciudad: 'Monterrey, NL',
    codigoPostal: '64700',
    contacto: 'C.P. Ana Martínez',
    activo: true,
    fechaCreacion: '2022-09-28',
  },
  {
    id: 'prov-003',
    tipo: 'proveedor',
    rfc: 'ASP850715MN4',
    nombreCorto: 'SNACKS PACIFICO',
    razonSocial: 'Alimentos y Snacks del Pacífico SA de CV',
    email: 'ventas@snackspacifico.mx',
    telefono: '81-6789-0123',
    direccion: 'Carr. Miguel Alemán Km 15, Col. Industrial',
    ciudad: 'San Nicolás, NL',
    codigoPostal: '66420',
    contacto: 'Ing. Luis Hernández',
    activo: true,
    fechaCreacion: '2023-02-14',
  },
  {
    id: 'prov-004',
    tipo: 'proveedor',
    rfc: 'SIT990620PQ2',
    nombreCorto: 'TELNOR',
    razonSocial: 'Servicios de Internet TelNor SA',
    email: 'empresarial@telnor.mx',
    telefono: '81-7890-1234',
    direccion: 'Torre Comercial, Piso 12, Av. Lázaro Cárdenas',
    ciudad: 'Monterrey, NL',
    codigoPostal: '64630',
    contacto: 'Lic. Fernando Garza',
    activo: true,
    fechaCreacion: '2023-04-18',
  },
  {
    id: 'prov-005',
    tipo: 'proveedor',
    rfc: 'DAN860305LM8',
    nombreCorto: 'ABARROTES NORTE',
    razonSocial: 'Distribuidora de Abarrotes del Norte SA',
    email: 'ventas@abarrotesnorte.com',
    telefono: '81-8901-2345',
    direccion: 'Parque Logístico Santa Catarina, Bodega 8',
    ciudad: 'Santa Catarina, NL',
    codigoPostal: '66350',
    contacto: 'Ing. Pedro Ramírez',
    activo: false,
    fechaCreacion: '2021-12-01',
  },
];

// ============ COMPONENTE PRINCIPAL ============
export function ClientesProveedoresPage() {
  return <ClientesProveedoresContenido />;
}

function ClientesProveedoresContenido() {
  const instalacionActiva = useInstalacionActivaObligatoria();
  const [tabActiva, setTabActiva] = useState<string>('todos');
  const [busqueda, setBusqueda] = useState('');
  const [datos, setDatos] = useState<ClienteProveedor[]>(datosIniciales);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [entidadEditando, setEntidadEditando] = useState<ClienteProveedor | null>(null);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);
  const [errores, setErrores] = useState<Record<string, string>>({});

  // Formulario
  const [formulario, setFormulario] = useState<Partial<ClienteProveedor>>({
    tipo: 'cliente',
    rfc: '',
    nombreCorto: '',
    razonSocial: '',
    email: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    codigoPostal: '',
    contacto: '',
    activo: true,
  });

  // Filtrar datos
  const datosFiltrados = useMemo(() => {
    let resultado = datos;

    // Filtrar por tab
    if (tabActiva === 'clientes') {
      resultado = resultado.filter((d) => d.tipo === 'cliente');
    } else if (tabActiva === 'proveedores') {
      resultado = resultado.filter((d) => d.tipo === 'proveedor');
    }

    // Filtrar por búsqueda
    if (busqueda) {
      const termino = busqueda.toLowerCase();
      resultado = resultado.filter(
        (d) =>
          d.rfc.toLowerCase().includes(termino) ||
          d.nombreCorto.toLowerCase().includes(termino) ||
          d.razonSocial.toLowerCase().includes(termino) ||
          d.email.toLowerCase().includes(termino),
      );
    }

    return resultado;
  }, [datos, tabActiva, busqueda]);

  // Validar RFC con formato SAT (12 caracteres para morales, 13 para físicas)
  const validarRFC = (rfc: string): { valido: boolean; mensaje: string } => {
    const rfcLimpio = rfc.trim().toUpperCase();
    
    // Validar que solo contenga caracteres alfanuméricos
    const regexAlfanumerico = /^[A-Z0-9]+$/;
    if (!regexAlfanumerico.test(rfcLimpio)) {
      return { valido: false, mensaje: 'El RFC solo puede contener letras y números' };
    }
    
    // Validar longitud exacta (12 para personas morales, 13 para personas físicas)
    if (rfcLimpio.length !== 12 && rfcLimpio.length !== 13) {
      return { 
        valido: false, 
        mensaje: 'El RFC debe tener exactamente 12 caracteres (persona moral) o 13 caracteres (persona física)' 
      };
    }
    
    return { valido: true, mensaje: '' };
  };

  // Validar formulario
  const validarFormulario = (): boolean => {
    const nuevosErrores: Record<string, string> = {};

    // RFC obligatorio, formato SAT válido y único
    if (!formulario.rfc?.trim()) {
      nuevosErrores.rfc = 'El RFC es obligatorio';
    } else {
      // Validar formato RFC SAT
      const validacionRFC = validarRFC(formulario.rfc);
      if (!validacionRFC.valido) {
        nuevosErrores.rfc = validacionRFC.mensaje;
      } else {
        // Validar unicidad solo si el formato es correcto
        const rfcExiste = datos.some(
          (d) =>
            d.rfc.toUpperCase() === formulario.rfc?.toUpperCase() &&
            d.id !== entidadEditando?.id,
        );
        if (rfcExiste) {
          nuevosErrores.rfc = 'Este RFC ya está registrado en el sistema';
        }
      }
    }

    // Nombre corto obligatorio y único
    if (!formulario.nombreCorto?.trim()) {
      nuevosErrores.nombreCorto = 'El nombre corto es obligatorio';
    } else {
      const nombreExiste = datos.some(
        (d) =>
          d.nombreCorto.toUpperCase() === formulario.nombreCorto?.toUpperCase() &&
          d.id !== entidadEditando?.id,
      );
      if (nombreExiste) {
        nuevosErrores.nombreCorto = 'Este nombre corto ya está registrado';
      }
    }

    // Razón social obligatoria
    if (!formulario.razonSocial?.trim()) {
      nuevosErrores.razonSocial = 'La razón social es obligatoria';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  // Abrir modal para nuevo
  const handleNuevo = (tipo: TipoEntidad) => {
    setEntidadEditando(null);
    setFormulario({
      tipo,
      rfc: '',
      nombreCorto: '',
      razonSocial: '',
      email: '',
      telefono: '',
      direccion: '',
      ciudad: '',
      codigoPostal: '',
      contacto: '',
      activo: true,
    });
    setErrores({});
    setModalAbierto(true);
  };

  // Abrir modal para editar
  const handleEditar = (entidad: ClienteProveedor) => {
    setEntidadEditando(entidad);
    setFormulario({ ...entidad });
    setErrores({});
    setModalAbierto(true);
  };

  // Guardar
  const handleGuardar = () => {
    if (!validarFormulario()) return;

    if (entidadEditando) {
      // Editar existente
      setDatos((prev) =>
        prev.map((d) =>
          d.id === entidadEditando.id
            ? { ...d, ...formulario } as ClienteProveedor
            : d,
        ),
      );
      setMensajeExito(
        `${formulario.tipo === 'cliente' ? 'Cliente' : 'Proveedor'} actualizado correctamente`,
      );
    } else {
      // Crear nuevo
      const nuevoId = `${formulario.tipo === 'cliente' ? 'cli' : 'prov'}-${String(Date.now()).slice(-6)}`;
      const nuevaEntidad: ClienteProveedor = {
        id: nuevoId,
        tipo: formulario.tipo!,
        rfc: formulario.rfc!.toUpperCase(),
        nombreCorto: formulario.nombreCorto!.toUpperCase(),
        razonSocial: formulario.razonSocial!,
        email: formulario.email || '',
        telefono: formulario.telefono || '',
        direccion: formulario.direccion || '',
        ciudad: formulario.ciudad || '',
        codigoPostal: formulario.codigoPostal || '',
        contacto: formulario.contacto || '',
        activo: formulario.activo ?? true,
        fechaCreacion: new Date().toISOString().split('T')[0],
      };
      setDatos((prev) => [...prev, nuevaEntidad]);
      setMensajeExito(
        `${formulario.tipo === 'cliente' ? 'Cliente' : 'Proveedor'} creado correctamente`,
      );
    }

    setModalAbierto(false);
    setTimeout(() => setMensajeExito(null), 4000);
  };

  // Cambiar estatus
  const handleCambiarEstatus = (id: string) => {
    setDatos((prev) =>
      prev.map((d) => (d.id === id ? { ...d, activo: !d.activo } : d)),
    );
  };

  // Columnas de la tabla
  const columnas = useMemo<ColumnDef<ClienteProveedor>[]>(
    () => [
      {
        accessorKey: 'tipo',
        header: ({ column }) => (
          <DataGridColumnHeader column={column} title="Tipo" />
        ),
        cell: ({ row }) => {
          const tipo = row.original.tipo;
          return (
            <div className="flex items-center gap-2">
              {tipo === 'cliente' ? (
                <User className="h-4 w-4 text-blue-500" />
              ) : (
                <Truck className="h-4 w-4 text-purple-500" />
              )}
              <span className="text-sm font-medium capitalize">{tipo}</span>
            </div>
          );
        },
      },
      {
        accessorKey: 'rfc',
        header: ({ column }) => (
          <DataGridColumnHeader column={column} title="RFC" />
        ),
        cell: ({ row }) => (
          <span className="font-mono text-sm">{row.original.rfc}</span>
        ),
      },
      {
        accessorKey: 'nombreCorto',
        header: ({ column }) => (
          <DataGridColumnHeader column={column} title="Nombre Corto" />
        ),
        cell: ({ row }) => (
          <span className="font-medium text-sm">{row.original.nombreCorto}</span>
        ),
      },
      {
        accessorKey: 'razonSocial',
        header: ({ column }) => (
          <DataGridColumnHeader column={column} title="Razón Social" />
        ),
        cell: ({ row }) => (
          <span className="text-sm">{row.original.razonSocial}</span>
        ),
      },
      {
        accessorKey: 'email',
        header: ({ column }) => (
          <DataGridColumnHeader column={column} title="Email" />
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Mail className="h-3 w-3 text-muted-foreground" />
            <span className="text-sm">{row.original.email || '-'}</span>
          </div>
        ),
      },
      {
        accessorKey: 'telefono',
        header: ({ column }) => (
          <DataGridColumnHeader column={column} title="Teléfono" />
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Phone className="h-3 w-3 text-muted-foreground" />
            <span className="text-sm">{row.original.telefono || '-'}</span>
          </div>
        ),
      },
      {
        accessorKey: 'activo',
        header: ({ column }) => (
          <DataGridColumnHeader column={column} title="Estatus" />
        ),
        cell: ({ row }) => {
          const activo = row.original.activo;
          return (
            <div className="flex items-center gap-2">
              <Switch
                checked={activo}
                onCheckedChange={() => handleCambiarEstatus(row.original.id)}
              />
              <Badge className={activo ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                {activo ? 'Activo' : 'Inactivo'}
              </Badge>
            </div>
          );
        },
      },
      {
        id: 'acciones',
        header: () => <span className="text-xs font-medium">Acciones</span>,
        cell: ({ row }) => (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEditar(row.original)}
            className="gap-1"
          >
            <Edit2 className="h-3 w-3" />
            Editar
          </Button>
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
    const clientes = datos.filter((d) => d.tipo === 'cliente');
    const proveedores = datos.filter((d) => d.tipo === 'proveedor');
    const activos = datos.filter((d) => d.activo);

    return {
      totalClientes: clientes.length,
      clientesActivos: clientes.filter((c) => c.activo).length,
      totalProveedores: proveedores.length,
      proveedoresActivos: proveedores.filter((p) => p.activo).length,
      totalActivos: activos.length,
    };
  }, [datos]);

  return (
    <div className="grow content-start p-5 lg:p-7.5 space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Catálogo de Clientes y Proveedores
          </h1>
          <p className="text-sm text-muted-foreground">
            Instalación: <span className="font-medium">{instalacionActiva?.nombre}</span>
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => handleNuevo('cliente')} className="gap-2">
            <Plus className="h-4 w-4" />
            Nuevo Cliente
          </Button>
          <Button onClick={() => handleNuevo('proveedor')} variant="secondary" className="gap-2">
            <Plus className="h-4 w-4" />
            Nuevo Proveedor
          </Button>
        </div>
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
                <User className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{estadisticas.totalClientes}</p>
                <p className="text-xs text-muted-foreground">
                  Clientes ({estadisticas.clientesActivos} activos)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                <Truck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{estadisticas.totalProveedores}</p>
                <p className="text-xs text-muted-foreground">
                  Proveedores ({estadisticas.proveedoresActivos} activos)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-green-600">
                <CheckCircle className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{estadisticas.totalActivos}</p>
                <p className="text-xs text-muted-foreground">Total Activos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{datos.length}</p>
                <p className="text-xs text-muted-foreground">Total Registros</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabla */}
      <DataGrid table={tabla}>
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <Tabs value={tabActiva} onValueChange={setTabActiva}>
                <TabsList>
                  <TabsTrigger value="todos" className="gap-2">
                    <Users className="h-4 w-4" />
                    Todos
                  </TabsTrigger>
                  <TabsTrigger value="clientes" className="gap-2">
                    <User className="h-4 w-4" />
                    Clientes
                  </TabsTrigger>
                  <TabsTrigger value="proveedores" className="gap-2">
                    <Truck className="h-4 w-4" />
                    Proveedores
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar por RFC, nombre o email..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="w-full pl-9 md:w-80"
                />
              </div>
            </div>
          </CardHeader>
          <CardTable>
            <ScrollArea>
              <DataGridTable />
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </CardTable>
          <CardFooter className="justify-center text-sm text-muted-foreground">
            Total: {datosFiltrados.length} registros
          </CardFooter>
        </Card>
      </DataGrid>

      {/* Modal de Formulario */}
      <Dialog open={modalAbierto} onOpenChange={setModalAbierto}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {formulario.tipo === 'cliente' ? (
                <User className="h-5 w-5 text-blue-500" />
              ) : (
                <Truck className="h-5 w-5 text-purple-500" />
              )}
              {entidadEditando
                ? `Editar ${formulario.tipo === 'cliente' ? 'Cliente' : 'Proveedor'}`
                : `Nuevo ${formulario.tipo === 'cliente' ? 'Cliente' : 'Proveedor'}`}
            </DialogTitle>
            <DialogDescription>
              Complete los datos del {formulario.tipo}. Los campos marcados con * son
              obligatorios.
            </DialogDescription>
          </DialogHeader>
          <DialogBody className="space-y-4">
            {/* Tipo (solo para nuevo) */}
            {!entidadEditando && (
              <div className="space-y-2">
                <Label>Tipo de Registro</Label>
                <Select
                  value={formulario.tipo}
                  onValueChange={(v) =>
                    setFormulario({ ...formulario, tipo: v as TipoEntidad })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cliente">Cliente</SelectItem>
                    <SelectItem value="proveedor">Proveedor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* RFC y Nombre Corto */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rfc">
                  RFC <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="rfc"
                  value={formulario.rfc}
                  onChange={(e) =>
                    setFormulario({ ...formulario, rfc: e.target.value.toUpperCase() })
                  }
                  placeholder="Ej: ABC123456XY9"
                  className={errores.rfc ? 'border-red-500' : ''}
                />
                {errores.rfc && (
                  <p className="text-xs text-red-500">{errores.rfc}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="nombreCorto">
                  Nombre Corto <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="nombreCorto"
                  value={formulario.nombreCorto}
                  onChange={(e) =>
                    setFormulario({
                      ...formulario,
                      nombreCorto: e.target.value.toUpperCase(),
                    })
                  }
                  placeholder="Ej: EMPRESA XYZ"
                  className={errores.nombreCorto ? 'border-red-500' : ''}
                />
                {errores.nombreCorto && (
                  <p className="text-xs text-red-500">{errores.nombreCorto}</p>
                )}
              </div>
            </div>

            {/* Razón Social */}
            <div className="space-y-2">
              <Label htmlFor="razonSocial">
                Razón Social <span className="text-red-500">*</span>
              </Label>
              <Input
                id="razonSocial"
                value={formulario.razonSocial}
                onChange={(e) =>
                  setFormulario({ ...formulario, razonSocial: e.target.value })
                }
                placeholder="Nombre legal completo de la empresa"
                className={errores.razonSocial ? 'border-red-500' : ''}
              />
              {errores.razonSocial && (
                <p className="text-xs text-red-500">{errores.razonSocial}</p>
              )}
            </div>

            {/* Contacto */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formulario.email}
                  onChange={(e) =>
                    setFormulario({ ...formulario, email: e.target.value })
                  }
                  placeholder="correo@empresa.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono</Label>
                <Input
                  id="telefono"
                  value={formulario.telefono}
                  onChange={(e) =>
                    setFormulario({ ...formulario, telefono: e.target.value })
                  }
                  placeholder="81-1234-5678"
                />
              </div>
            </div>

            {/* Dirección */}
            <div className="space-y-2">
              <Label htmlFor="direccion">Dirección</Label>
              <Input
                id="direccion"
                value={formulario.direccion}
                onChange={(e) =>
                  setFormulario({ ...formulario, direccion: e.target.value })
                }
                placeholder="Calle, número, colonia"
              />
            </div>

            {/* Ciudad y CP */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ciudad">Ciudad</Label>
                <Input
                  id="ciudad"
                  value={formulario.ciudad}
                  onChange={(e) =>
                    setFormulario({ ...formulario, ciudad: e.target.value })
                  }
                  placeholder="Monterrey, NL"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="codigoPostal">Código Postal</Label>
                <Input
                  id="codigoPostal"
                  value={formulario.codigoPostal}
                  onChange={(e) =>
                    setFormulario({ ...formulario, codigoPostal: e.target.value })
                  }
                  placeholder="64000"
                />
              </div>
            </div>

            {/* Contacto */}
            <div className="space-y-2">
              <Label htmlFor="contacto">Persona de Contacto</Label>
              <Input
                id="contacto"
                value={formulario.contacto}
                onChange={(e) =>
                  setFormulario({ ...formulario, contacto: e.target.value })
                }
                placeholder="Nombre del contacto principal"
              />
            </div>

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
                {formulario.activo ? 'Activo' : 'Inactivo'}
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
              {entidadEditando ? 'Guardar Cambios' : 'Crear Registro'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
