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
  Box,
  CheckCircle,
  Edit2,
  Package,
  Plus,
  Search,
  Tag,
  Zap,
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
import { Textarea } from '@/components/ui/textarea';
import { useContextoInstalacion } from '../../context/ContextoInstalacion';

// ============ TIPOS ============
interface Articulo {
  id: string;
  codigo: string;
  nombre: string;
  descripcion: string;
  categoria: string;
  unidadMedida: string;
  precioCompra: number;
  precioVenta: number;
  stockMinimo: number;
  stockActual: number;
  esInventariable: boolean;
  activo: boolean;
  fechaCreacion: string;
}

// ============ CONSTANTES ============
const CATEGORIAS = [
  'Refrescos',
  'Snacks',
  'Agua',
  'Jugos',
  'Lácteos',
  'Papelería',
  'Consumibles de Oficina',
  'Servicios',
  'Limpieza',
  'Electrónicos',
];

const UNIDADES_MEDIDA = [
  'Pieza',
  'Paquete',
  'Caja',
  'Litro',
  'Kilogramo',
  'Metro',
  'Servicio',
  'Mes',
];

// ============ DATOS FICTICIOS ============
const datosIniciales: Articulo[] = [
  // Productos de Almacén (Inventariables)
  {
    id: 'art-a01',
    codigo: 'REF-001',
    nombre: 'Coca-Cola 600ml',
    descripcion: 'Refresco de cola en presentación de 600ml',
    categoria: 'Refrescos',
    unidadMedida: 'Pieza',
    precioCompra: 12.5,
    precioVenta: 18.0,
    stockMinimo: 100,
    stockActual: 450,
    esInventariable: true,
    activo: true,
    fechaCreacion: '2023-01-10',
  },
  {
    id: 'art-a02',
    codigo: 'REF-002',
    nombre: 'Pepsi 600ml',
    descripcion: 'Refresco de cola en presentación de 600ml',
    categoria: 'Refrescos',
    unidadMedida: 'Pieza',
    precioCompra: 11.8,
    precioVenta: 17.0,
    stockMinimo: 100,
    stockActual: 320,
    esInventariable: true,
    activo: true,
    fechaCreacion: '2023-01-10',
  },
  {
    id: 'art-a03',
    codigo: 'SNK-001',
    nombre: 'Sabritas Original 45g',
    descripcion: 'Papas fritas sabor original',
    categoria: 'Snacks',
    unidadMedida: 'Pieza',
    precioCompra: 9.5,
    precioVenta: 15.0,
    stockMinimo: 50,
    stockActual: 180,
    esInventariable: true,
    activo: true,
    fechaCreacion: '2023-02-15',
  },
  {
    id: 'art-a04',
    codigo: 'SNK-002',
    nombre: 'Doritos Nacho 62g',
    descripcion: 'Tortilla chips sabor nacho',
    categoria: 'Snacks',
    unidadMedida: 'Pieza',
    precioCompra: 12.0,
    precioVenta: 18.5,
    stockMinimo: 50,
    stockActual: 150,
    esInventariable: true,
    activo: true,
    fechaCreacion: '2023-02-15',
  },
  {
    id: 'art-a05',
    codigo: 'AGU-001',
    nombre: 'Agua Ciel 1L',
    descripcion: 'Agua purificada en botella de 1 litro',
    categoria: 'Agua',
    unidadMedida: 'Pieza',
    precioCompra: 8.0,
    precioVenta: 12.0,
    stockMinimo: 200,
    stockActual: 600,
    esInventariable: true,
    activo: true,
    fechaCreacion: '2023-01-10',
  },
  // Productos de Oficina (Inventariables)
  {
    id: 'art-o01',
    codigo: 'PAP-001',
    nombre: 'Hojas Blancas Carta (500)',
    descripcion: 'Paquete de 500 hojas tamaño carta',
    categoria: 'Papelería',
    unidadMedida: 'Paquete',
    precioCompra: 75.0,
    precioVenta: 95.0,
    stockMinimo: 20,
    stockActual: 85,
    esInventariable: true,
    activo: true,
    fechaCreacion: '2023-03-01',
  },
  {
    id: 'art-o02',
    codigo: 'PAP-002',
    nombre: 'Plumas BIC Azul (12)',
    descripcion: 'Caja de 12 plumas azules',
    categoria: 'Papelería',
    unidadMedida: 'Caja',
    precioCompra: 36.0,
    precioVenta: 48.0,
    stockMinimo: 10,
    stockActual: 42,
    esInventariable: true,
    activo: true,
    fechaCreacion: '2023-03-01',
  },
  {
    id: 'art-o03',
    codigo: 'CON-001',
    nombre: 'Toner HP 85A',
    descripcion: 'Cartucho de toner para impresoras HP LaserJet',
    categoria: 'Consumibles de Oficina',
    unidadMedida: 'Pieza',
    precioCompra: 520.0,
    precioVenta: 680.0,
    stockMinimo: 3,
    stockActual: 12,
    esInventariable: true,
    activo: true,
    fechaCreacion: '2023-03-15',
  },
  {
    id: 'art-o04',
    codigo: 'PAP-003',
    nombre: 'Folders Carta (25)',
    descripcion: 'Paquete de 25 folders tamaño carta',
    categoria: 'Papelería',
    unidadMedida: 'Paquete',
    precioCompra: 65.0,
    precioVenta: 85.0,
    stockMinimo: 10,
    stockActual: 38,
    esInventariable: true,
    activo: true,
    fechaCreacion: '2023-03-01',
  },
  // Servicios (No Inventariables)
  {
    id: 'art-s01',
    codigo: 'SRV-001',
    nombre: 'Servicio de Internet 100 Mbps',
    descripcion: 'Servicio mensual de internet empresarial',
    categoria: 'Servicios',
    unidadMedida: 'Mes',
    precioCompra: 1200.0,
    precioVenta: 0.0,
    stockMinimo: 0,
    stockActual: 0,
    esInventariable: false,
    activo: true,
    fechaCreacion: '2023-04-01',
  },
  {
    id: 'art-s02',
    codigo: 'SRV-002',
    nombre: 'Servicio de Limpieza',
    descripcion: 'Servicio de limpieza general de instalaciones',
    categoria: 'Servicios',
    unidadMedida: 'Servicio',
    precioCompra: 3500.0,
    precioVenta: 0.0,
    stockMinimo: 0,
    stockActual: 0,
    esInventariable: false,
    activo: true,
    fechaCreacion: '2023-04-01',
  },
  {
    id: 'art-s03',
    codigo: 'SRV-003',
    nombre: 'Mantenimiento de Equipo',
    descripcion: 'Servicio de mantenimiento preventivo de equipos de cómputo',
    categoria: 'Servicios',
    unidadMedida: 'Servicio',
    precioCompra: 800.0,
    precioVenta: 0.0,
    stockMinimo: 0,
    stockActual: 0,
    esInventariable: false,
    activo: false,
    fechaCreacion: '2023-04-15',
  },
];

// ============ COMPONENTE PRINCIPAL ============
export function ArticulosPage() {
  const { instalacionActiva } = useContextoInstalacion();

  // Redirigir si no hay instalación activa
  if (!instalacionActiva) {
    return <Navigate to="/tienda-inventario/selector-instalacion" replace />;
  }

  return <ArticulosContenido />;
}

function ArticulosContenido() {
  const { instalacionActiva } = useContextoInstalacion();
  const [tabActiva, setTabActiva] = useState<string>('todos');
  const [busqueda, setBusqueda] = useState('');
  const [datos, setDatos] = useState<Articulo[]>(datosIniciales);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [articuloEditando, setArticuloEditando] = useState<Articulo | null>(null);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);
  const [errores, setErrores] = useState<Record<string, string>>({});

  // Formulario
  const [formulario, setFormulario] = useState<Partial<Articulo>>({
    codigo: '',
    nombre: '',
    descripcion: '',
    categoria: '',
    unidadMedida: 'Pieza',
    precioCompra: 0,
    precioVenta: 0,
    stockMinimo: 0,
    esInventariable: true,
    activo: true,
  });

  // Filtrar datos
  const datosFiltrados = useMemo(() => {
    let resultado = datos;

    // Filtrar por tab
    if (tabActiva === 'inventariables') {
      resultado = resultado.filter((d) => d.esInventariable);
    } else if (tabActiva === 'servicios') {
      resultado = resultado.filter((d) => !d.esInventariable);
    }

    // Filtrar por búsqueda
    if (busqueda) {
      const termino = busqueda.toLowerCase();
      resultado = resultado.filter(
        (d) =>
          d.codigo.toLowerCase().includes(termino) ||
          d.nombre.toLowerCase().includes(termino) ||
          d.categoria.toLowerCase().includes(termino),
      );
    }

    return resultado;
  }, [datos, tabActiva, busqueda]);

  // Validar formulario
  const validarFormulario = (): boolean => {
    const nuevosErrores: Record<string, string> = {};

    // Código obligatorio
    if (!formulario.codigo?.trim()) {
      nuevosErrores.codigo = 'El código es obligatorio';
    }

    // Nombre obligatorio y único
    if (!formulario.nombre?.trim()) {
      nuevosErrores.nombre = 'El nombre es obligatorio';
    } else {
      const nombreExiste = datos.some(
        (d) =>
          d.nombre.toLowerCase() === formulario.nombre?.toLowerCase() &&
          d.id !== articuloEditando?.id,
      );
      if (nombreExiste) {
        nuevosErrores.nombre = 'Ya existe un artículo con este nombre';
      }
    }

    // Categoría obligatoria
    if (!formulario.categoria?.trim()) {
      nuevosErrores.categoria = 'La categoría es obligatoria';
    }

    // Precio de compra
    if (formulario.precioCompra === undefined || formulario.precioCompra < 0) {
      nuevosErrores.precioCompra = 'El precio de compra debe ser mayor o igual a 0';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  // Abrir modal para nuevo
  const handleNuevo = () => {
    setArticuloEditando(null);
    setFormulario({
      codigo: '',
      nombre: '',
      descripcion: '',
      categoria: '',
      unidadMedida: 'Pieza',
      precioCompra: 0,
      precioVenta: 0,
      stockMinimo: 0,
      esInventariable: true,
      activo: true,
    });
    setErrores({});
    setModalAbierto(true);
  };

  // Abrir modal para editar
  const handleEditar = (articulo: Articulo) => {
    setArticuloEditando(articulo);
    setFormulario({ ...articulo });
    setErrores({});
    setModalAbierto(true);
  };

  // Guardar
  const handleGuardar = () => {
    if (!validarFormulario()) return;

    if (articuloEditando) {
      // Editar existente
      setDatos((prev) =>
        prev.map((d) =>
          d.id === articuloEditando.id ? ({ ...d, ...formulario } as Articulo) : d,
        ),
      );
      setMensajeExito('Artículo actualizado correctamente');
    } else {
      // Crear nuevo
      const nuevoId = `art-${String(Date.now()).slice(-6)}`;
      const nuevoArticulo: Articulo = {
        id: nuevoId,
        codigo: formulario.codigo!.toUpperCase(),
        nombre: formulario.nombre!,
        descripcion: formulario.descripcion || '',
        categoria: formulario.categoria!,
        unidadMedida: formulario.unidadMedida || 'Pieza',
        precioCompra: formulario.precioCompra || 0,
        precioVenta: formulario.precioVenta || 0,
        stockMinimo: formulario.stockMinimo || 0,
        stockActual: 0,
        esInventariable: formulario.esInventariable ?? true,
        activo: formulario.activo ?? true,
        fechaCreacion: new Date().toISOString().split('T')[0],
      };
      setDatos((prev) => [...prev, nuevoArticulo]);
      setMensajeExito('Artículo creado correctamente');
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
  const columnas = useMemo<ColumnDef<Articulo>[]>(
    () => [
      {
        accessorKey: 'codigo',
        header: ({ column }) => (
          <DataGridColumnHeader column={column} title="Código" />
        ),
        cell: ({ row }) => (
          <span className="font-mono text-sm">{row.original.codigo}</span>
        ),
      },
      {
        accessorKey: 'nombre',
        header: ({ column }) => (
          <DataGridColumnHeader column={column} title="Nombre" />
        ),
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="font-medium text-sm">{row.original.nombre}</span>
            <span className="text-xs text-muted-foreground line-clamp-1">
              {row.original.descripcion}
            </span>
          </div>
        ),
      },
      {
        accessorKey: 'categoria',
        header: ({ column }) => (
          <DataGridColumnHeader column={column} title="Categoría" />
        ),
        cell: ({ row }) => (
          <Badge variant="outline">{row.original.categoria}</Badge>
        ),
      },
      {
        accessorKey: 'esInventariable',
        header: ({ column }) => (
          <DataGridColumnHeader column={column} title="Tipo" />
        ),
        cell: ({ row }) => {
          const inventariable = row.original.esInventariable;
          return (
            <div className="flex items-center gap-2">
              {inventariable ? (
                <Box className="h-4 w-4 text-emerald-500" />
              ) : (
                <Zap className="h-4 w-4 text-blue-500" />
              )}
              <span className="text-sm">
                {inventariable ? 'Inventariable' : 'Servicio/Gasto'}
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: 'precioCompra',
        header: ({ column }) => (
          <DataGridColumnHeader column={column} title="P. Compra" />
        ),
        cell: ({ row }) => (
          <span className="text-sm">
            ${row.original.precioCompra.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
          </span>
        ),
      },
      {
        accessorKey: 'precioVenta',
        header: ({ column }) => (
          <DataGridColumnHeader column={column} title="P. Venta" />
        ),
        cell: ({ row }) => (
          <span className="text-sm font-medium">
            ${row.original.precioVenta.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
          </span>
        ),
      },
      {
        accessorKey: 'stockActual',
        header: ({ column }) => (
          <DataGridColumnHeader column={column} title="Stock" />
        ),
        cell: ({ row }) => {
          const articulo = row.original;
          if (!articulo.esInventariable) {
            return <span className="text-muted-foreground">N/A</span>;
          }
          const esBajo = articulo.stockActual <= articulo.stockMinimo;
          return (
            <Badge className={esBajo ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}>
              {articulo.stockActual}
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
            <div className="flex items-center gap-2">
              <Switch
                checked={activo}
                onCheckedChange={() => handleCambiarEstatus(row.original.id)}
              />
              <span className="text-xs">{activo ? 'Activo' : 'Inactivo'}</span>
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
    const inventariables = datos.filter((d) => d.esInventariable);
    const servicios = datos.filter((d) => !d.esInventariable);
    const stockBajo = datos.filter(
      (d) => d.esInventariable && d.stockActual <= d.stockMinimo,
    );

    return {
      totalArticulos: datos.length,
      inventariables: inventariables.length,
      servicios: servicios.length,
      stockBajo: stockBajo.length,
      activos: datos.filter((d) => d.activo).length,
    };
  }, [datos]);

  return (
    <div className="grow content-start p-5 lg:p-7.5 space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Catálogo de Artículos
          </h1>
          <p className="text-sm text-muted-foreground">
            Instalación: <span className="font-medium">{instalacionActiva?.nombre}</span>
          </p>
        </div>
        <Button onClick={handleNuevo} className="gap-2">
          <Plus className="h-4 w-4" />
          Nuevo Artículo
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
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                <Package className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{estadisticas.totalArticulos}</p>
                <p className="text-xs text-muted-foreground">Total Artículos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                <Box className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{estadisticas.inventariables}</p>
                <p className="text-xs text-muted-foreground">Inventariables</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{estadisticas.servicios}</p>
                <p className="text-xs text-muted-foreground">Servicios/Gastos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 text-red-600">
                <AlertCircle className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{estadisticas.stockBajo}</p>
                <p className="text-xs text-muted-foreground">Stock Bajo</p>
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
                <p className="text-2xl font-bold">{estadisticas.activos}</p>
                <p className="text-xs text-muted-foreground">Activos</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerta informativa */}
      <Alert variant="mono">
        <AlertIcon>
          <AlertCircle className="h-4 w-4" />
        </AlertIcon>
        <AlertTitle>Tipos de Artículos</AlertTitle>
        <AlertDescription>
          <strong>Inventariables:</strong> Productos físicos que afectan el stock
          (alimentos, papelería, etc.).{' '}
          <strong>Servicios/Gastos:</strong> Conceptos que no afectan inventario
          (internet, limpieza, mantenimiento).
        </AlertDescription>
      </Alert>

      {/* Tabla */}
      <DataGrid table={tabla}>
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <Tabs value={tabActiva} onValueChange={setTabActiva}>
                <TabsList>
                  <TabsTrigger value="todos" className="gap-2">
                    <Tag className="h-4 w-4" />
                    Todos
                  </TabsTrigger>
                  <TabsTrigger value="inventariables" className="gap-2">
                    <Box className="h-4 w-4" />
                    Inventariables
                  </TabsTrigger>
                  <TabsTrigger value="servicios" className="gap-2">
                    <Zap className="h-4 w-4" />
                    Servicios
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar por código, nombre o categoría..."
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
            Total: {datosFiltrados.length} artículos
          </CardFooter>
        </Card>
      </DataGrid>

      {/* Modal de Formulario */}
      <Dialog open={modalAbierto} onOpenChange={setModalAbierto}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-blue-500" />
              {articuloEditando ? 'Editar Artículo' : 'Nuevo Artículo'}
            </DialogTitle>
            <DialogDescription>
              Complete los datos del artículo. Los campos marcados con * son obligatorios.
            </DialogDescription>
          </DialogHeader>
          <DialogBody className="space-y-4">
            {/* Es Inventariable - Switch destacado */}
            <div className="rounded-lg border bg-muted/30 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {formulario.esInventariable ? (
                    <Box className="h-6 w-6 text-emerald-500" />
                  ) : (
                    <Zap className="h-6 w-6 text-blue-500" />
                  )}
                  <div>
                    <Label className="text-base font-medium">
                      ¿Es Inventariable? <span className="text-red-500">*</span>
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {formulario.esInventariable
                        ? 'Producto físico que afecta el stock'
                        : 'Servicio o gasto que no afecta inventario'}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={formulario.esInventariable}
                  onCheckedChange={(checked) =>
                    setFormulario({ ...formulario, esInventariable: checked })
                  }
                />
              </div>
            </div>

            {/* Código y Nombre */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="codigo">
                  Código <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="codigo"
                  value={formulario.codigo}
                  onChange={(e) =>
                    setFormulario({ ...formulario, codigo: e.target.value.toUpperCase() })
                  }
                  placeholder="Ej: REF-001"
                  className={errores.codigo ? 'border-red-500' : ''}
                />
                {errores.codigo && (
                  <p className="text-xs text-red-500">{errores.codigo}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="nombre">
                  Nombre <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="nombre"
                  value={formulario.nombre}
                  onChange={(e) =>
                    setFormulario({ ...formulario, nombre: e.target.value })
                  }
                  placeholder="Nombre del artículo"
                  className={errores.nombre ? 'border-red-500' : ''}
                />
                {errores.nombre && (
                  <p className="text-xs text-red-500">{errores.nombre}</p>
                )}
              </div>
            </div>

            {/* Descripción */}
            <div className="space-y-2">
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea
                id="descripcion"
                value={formulario.descripcion}
                onChange={(e) =>
                  setFormulario({ ...formulario, descripcion: e.target.value })
                }
                placeholder="Descripción detallada del artículo"
                rows={2}
              />
            </div>

            {/* Categoría y Unidad */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="categoria">
                  Categoría <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formulario.categoria}
                  onValueChange={(v) => setFormulario({ ...formulario, categoria: v })}
                >
                  <SelectTrigger className={errores.categoria ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIAS.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errores.categoria && (
                  <p className="text-xs text-red-500">{errores.categoria}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="unidadMedida">Unidad de Medida</Label>
                <Select
                  value={formulario.unidadMedida}
                  onValueChange={(v) => setFormulario({ ...formulario, unidadMedida: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {UNIDADES_MEDIDA.map((um) => (
                      <SelectItem key={um} value={um}>
                        {um}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Precios */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="precioCompra">
                  Precio de Compra <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="precioCompra"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formulario.precioCompra}
                  onChange={(e) =>
                    setFormulario({
                      ...formulario,
                      precioCompra: parseFloat(e.target.value) || 0,
                    })
                  }
                  className={errores.precioCompra ? 'border-red-500' : ''}
                />
                {errores.precioCompra && (
                  <p className="text-xs text-red-500">{errores.precioCompra}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="precioVenta">Precio de Venta</Label>
                <Input
                  id="precioVenta"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formulario.precioVenta}
                  onChange={(e) =>
                    setFormulario({
                      ...formulario,
                      precioVenta: parseFloat(e.target.value) || 0,
                    })
                  }
                  disabled={!formulario.esInventariable}
                />
              </div>
            </div>

            {/* Stock Mínimo (solo para inventariables) */}
            {formulario.esInventariable && (
              <div className="space-y-2">
                <Label htmlFor="stockMinimo">Stock Mínimo</Label>
                <Input
                  id="stockMinimo"
                  type="number"
                  min="0"
                  value={formulario.stockMinimo}
                  onChange={(e) =>
                    setFormulario({
                      ...formulario,
                      stockMinimo: parseInt(e.target.value) || 0,
                    })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Punto de reorden: cantidad mínima antes de generar alerta
                </p>
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
                {formulario.activo ? 'Activo' : 'Inactivo'}
              </Label>
            </div>
          </DialogBody>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button onClick={handleGuardar}>
              {articuloEditando ? 'Guardar Cambios' : 'Crear Artículo'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
