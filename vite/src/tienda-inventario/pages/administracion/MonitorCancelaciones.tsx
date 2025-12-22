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
  AlertTriangle,
  Ban,
  CheckCircle,
  FileText,
  History,
  Package,
  Search,
  ShoppingBag,
  ShoppingCart,
  User,
  XCircle,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useInstalacionActivaObligatoria } from '../../context/ContextoInstalacion';

// ============ TIPOS ============
type TipoDocumento = 'venta' | 'orden_compra';
type EstatusDocumento =
  | 'pendiente'
  | 'facturada'
  | 'pagada'
  | 'aprobada'
  | 'recibida'
  | 'rechazada'
  | 'cancelada';

interface Documento {
  id: string;
  tipo: TipoDocumento;
  instalacionId: string;
  instalacionNombre: string;
  fecha: string;
  referencia: string;
  cliente?: string;
  proveedor?: string;
  monto: number;
  estatus: EstatusDocumento;
  tieneFactura: boolean;
  tienePago: boolean;
  fueRecibida: boolean;
}

interface RegistroAuditoria {
  id: string;
  documentoId: string;
  tipoDocumento: TipoDocumento;
  accion: string;
  fecha: string;
  usuario: string;
  motivo: string;
  detalles: string;
}

// ============ DATOS FICTICIOS ============
const generarDocumentosFicticios = (instalacionId: string): Documento[] => {
  const esAlmacen = instalacionId.includes('almacen');
  const instalacionNombre = esAlmacen
    ? instalacionId.includes('scc')
      ? 'Almacen-SCC-MTY'
      : 'Almacen-Vaxsa-MTY'
    : instalacionId.includes('scc')
      ? 'Oficinas-SCC-MTY'
      : 'Oficinas-Vaxsa-MTY';

  const documentos: Documento[] = [];

  // Ventas
  const clientes = [
    'Comercializadora del Norte SA',
    'Distribuidora Regio Express',
    'Tiendas Don Manuel',
    'Abarrotes La Esperanza',
  ];

  for (let i = 1; i <= 6; i++) {
    const tieneFactura = i <= 3;
    const tienePago = i === 1;
    documentos.push({
      id: `VTA-${instalacionId.substring(0, 3).toUpperCase()}-2024-${String(i).padStart(4, '0')}`,
      tipo: 'venta',
      instalacionId,
      instalacionNombre,
      fecha: new Date(Date.now() - i * 86400000 * 2).toISOString(),
      referencia: `VTA-${String(i).padStart(4, '0')}`,
      cliente: clientes[i % clientes.length],
      monto: Math.round(Math.random() * 50000 + 5000),
      estatus: tienePago ? 'pagada' : tieneFactura ? 'facturada' : 'pendiente',
      tieneFactura,
      tienePago,
      fueRecibida: false,
    });
  }

  // Órdenes de Compra
  const proveedores = esAlmacen
    ? [
        'Comercializadora de Bebidas del Golfo',
        'Alimentos y Snacks del Pacífico',
        'Distribuidora de Abarrotes del Norte',
      ]
    : [
        'Distribuidora de Papelería Omega',
        'Servicios de Internet TelNor',
        'Suministros de Oficina MX',
      ];

  for (let i = 1; i <= 5; i++) {
    const estatus: EstatusDocumento =
      i === 1
        ? 'recibida'
        : i === 2
          ? 'aprobada'
          : i <= 4
            ? 'pendiente'
            : 'rechazada';
    documentos.push({
      id: `OC-${instalacionId.substring(0, 3).toUpperCase()}-2024-${String(i).padStart(4, '0')}`,
      tipo: 'orden_compra',
      instalacionId,
      instalacionNombre,
      fecha: new Date(Date.now() - i * 86400000 * 3).toISOString(),
      referencia: `OC-${String(i).padStart(4, '0')}`,
      proveedor: proveedores[i % proveedores.length],
      monto: Math.round(Math.random() * 80000 + 10000),
      estatus,
      tieneFactura: estatus === 'recibida',
      tienePago: false,
      fueRecibida: estatus === 'recibida',
    });
  }

  return documentos;
};

const generarAuditoriaFicticia = (instalacionId: string): RegistroAuditoria[] => {
  return [
    {
      id: 'aud-001',
      documentoId: `VTA-${instalacionId.substring(0, 3).toUpperCase()}-2024-0010`,
      tipoDocumento: 'venta',
      accion: 'Cancelación',
      fecha: new Date(Date.now() - 86400000 * 5).toISOString(),
      usuario: 'Usuario 1',
      motivo: 'Cliente solicitó cancelación',
      detalles: 'Venta cancelada antes de facturar por solicitud del cliente.',
    },
    {
      id: 'aud-002',
      documentoId: `OC-${instalacionId.substring(0, 3).toUpperCase()}-2024-0008`,
      tipoDocumento: 'orden_compra',
      accion: 'Cancelación',
      fecha: new Date(Date.now() - 86400000 * 8).toISOString(),
      usuario: 'Usuario 1',
      motivo: 'Proveedor no disponible',
      detalles: 'OC cancelada porque el proveedor no pudo surtir el pedido.',
    },
    {
      id: 'aud-003',
      documentoId: `VTA-${instalacionId.substring(0, 3).toUpperCase()}-2024-0015`,
      tipoDocumento: 'venta',
      accion: 'Cancelación',
      fecha: new Date(Date.now() - 86400000 * 12).toISOString(),
      usuario: 'Usuario 1',
      motivo: 'Error en captura',
      detalles: 'Venta cancelada por error en los productos capturados.',
    },
  ];
};

// ============ COMPONENTE PRINCIPAL ============
export function MonitorCancelacionesPage() {
  return <MonitorCancelacionesContenido />;
}

function MonitorCancelacionesContenido() {
  const instalacionActiva = useInstalacionActivaObligatoria();
  const [tabActiva, setTabActiva] = useState<string>('documentos');
  const [busqueda, setBusqueda] = useState('');
  const [documentos, setDocumentos] = useState<Documento[]>(() =>
    generarDocumentosFicticios(instalacionActiva.id),
  );
  const [auditorias, setAuditorias] = useState<RegistroAuditoria[]>(() =>
    generarAuditoriaFicticia(instalacionActiva.id),
  );
  const [documentoSeleccionado, setDocumentoSeleccionado] = useState<Documento | null>(
    null,
  );
  const [motivoCancelacion, setMotivoCancelacion] = useState('');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);

  // Filtrar documentos por búsqueda
  const documentosFiltrados = useMemo(() => {
    if (!busqueda) return documentos;
    const termino = busqueda.toLowerCase();
    return documentos.filter(
      (doc) =>
        doc.id.toLowerCase().includes(termino) ||
        doc.referencia.toLowerCase().includes(termino) ||
        doc.cliente?.toLowerCase().includes(termino) ||
        doc.proveedor?.toLowerCase().includes(termino),
    );
  }, [documentos, busqueda]);

  // Verificar si un documento puede ser cancelado
  const puedeSerCancelado = (doc: Documento): boolean => {
    if (doc.estatus === 'cancelada') return false;
    if (doc.tipo === 'venta') {
      // Ventas: solo si no tiene factura ni pago
      return !doc.tieneFactura && !doc.tienePago;
    } else {
      // OC: solo si no ha sido recibida
      return !doc.fueRecibida;
    }
  };

  // Manejar cancelación
  const handleCancelar = () => {
    if (!documentoSeleccionado || !motivoCancelacion.trim()) return;

    // Actualizar documento
    setDocumentos((prev) =>
      prev.map((doc) =>
        doc.id === documentoSeleccionado.id
          ? { ...doc, estatus: 'cancelada' as EstatusDocumento }
          : doc,
      ),
    );

    // Registrar auditoría
    const nuevoRegistro: RegistroAuditoria = {
      id: `aud-${Date.now()}`,
      documentoId: documentoSeleccionado.id,
      tipoDocumento: documentoSeleccionado.tipo,
      accion: 'Cancelación',
      fecha: new Date().toISOString(),
      usuario: 'Usuario 1',
      motivo: motivoCancelacion,
      detalles: `${documentoSeleccionado.tipo === 'venta' ? 'Venta' : 'Orden de Compra'} ${documentoSeleccionado.id} cancelada.`,
    };
    setAuditorias((prev) => [nuevoRegistro, ...prev]);

    // Mostrar mensaje
    setMensajeExito(
      `Cancelación registrada exitosamente. Fecha: ${new Date().toLocaleString('es-MX')}. Usuario: Usuario 1`,
    );

    // Limpiar y cerrar
    setModalAbierto(false);
    setDocumentoSeleccionado(null);
    setMotivoCancelacion('');

    // Ocultar mensaje después de 5 segundos
    setTimeout(() => setMensajeExito(null), 5000);
  };

  // Columnas de la tabla de documentos
  const columnasDocumentos = useMemo<ColumnDef<Documento>[]>(
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
              {tipo === 'venta' ? (
                <ShoppingBag className="h-4 w-4 text-blue-500" />
              ) : (
                <ShoppingCart className="h-4 w-4 text-purple-500" />
              )}
              <span className="text-sm font-medium">
                {tipo === 'venta' ? 'Venta' : 'Orden Compra'}
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: 'id',
        header: ({ column }) => (
          <DataGridColumnHeader column={column} title="Folio" />
        ),
        cell: ({ row }) => (
          <span className="font-mono text-sm">{row.original.id}</span>
        ),
      },
      {
        accessorKey: 'fecha',
        header: ({ column }) => (
          <DataGridColumnHeader column={column} title="Fecha" />
        ),
        cell: ({ row }) => (
          <span className="text-sm">
            {new Date(row.original.fecha).toLocaleDateString('es-MX')}
          </span>
        ),
      },
      {
        accessorKey: 'cliente',
        header: ({ column }) => (
          <DataGridColumnHeader column={column} title="Cliente/Proveedor" />
        ),
        cell: ({ row }) => (
          <span className="text-sm">
            {row.original.cliente || row.original.proveedor}
          </span>
        ),
      },
      {
        accessorKey: 'monto',
        header: ({ column }) => (
          <DataGridColumnHeader column={column} title="Monto" />
        ),
        cell: ({ row }) => (
          <span className="font-medium text-sm">
            ${row.original.monto.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
          </span>
        ),
      },
      {
        accessorKey: 'estatus',
        header: ({ column }) => (
          <DataGridColumnHeader column={column} title="Estatus" />
        ),
        cell: ({ row }) => {
          const estatus = row.original.estatus;
          const colores: Record<EstatusDocumento, string> = {
            pendiente: 'bg-yellow-100 text-yellow-800',
            facturada: 'bg-blue-100 text-blue-800',
            pagada: 'bg-green-100 text-green-800',
            aprobada: 'bg-cyan-100 text-cyan-800',
            recibida: 'bg-emerald-100 text-emerald-800',
            rechazada: 'bg-red-100 text-red-800',
            cancelada: 'bg-gray-100 text-gray-800',
          };
          return (
            <Badge className={colores[estatus]}>
              {estatus.charAt(0).toUpperCase() + estatus.slice(1)}
            </Badge>
          );
        },
      },
      {
        accessorKey: 'validaciones',
        header: () => <span className="text-xs font-medium">Validaciones</span>,
        cell: ({ row }) => {
          const doc = row.original;
          return (
            <div className="flex items-center gap-2">
              {doc.tipo === 'venta' ? (
                <>
                  <div
                    className="flex items-center gap-1"
                    title={doc.tieneFactura ? 'Tiene factura' : 'Sin factura'}
                  >
                    <FileText
                      className={`h-4 w-4 ${doc.tieneFactura ? 'text-green-500' : 'text-gray-300'}`}
                    />
                  </div>
                  <div
                    className="flex items-center gap-1"
                    title={doc.tienePago ? 'Con pago' : 'Sin pago'}
                  >
                    <CheckCircle
                      className={`h-4 w-4 ${doc.tienePago ? 'text-green-500' : 'text-gray-300'}`}
                    />
                  </div>
                </>
              ) : (
                <div
                  className="flex items-center gap-1"
                  title={doc.fueRecibida ? 'Recibida' : 'No recibida'}
                >
                  <Package
                    className={`h-4 w-4 ${doc.fueRecibida ? 'text-green-500' : 'text-gray-300'}`}
                  />
                </div>
              )}
            </div>
          );
        },
      },
      {
        id: 'acciones',
        header: () => <span className="text-xs font-medium">Acciones</span>,
        cell: ({ row }) => {
          const doc = row.original;
          const cancelable = puedeSerCancelado(doc);

          return (
            <Button
              variant="destructive"
              size="sm"
              disabled={!cancelable}
              onClick={() => {
                setDocumentoSeleccionado(doc);
                setModalAbierto(true);
              }}
              className="gap-1"
            >
              <Ban className="h-3 w-3" />
              Cancelar
            </Button>
          );
        },
      },
    ],
    [],
  );

  // Columnas de la tabla de auditoría
  const columnasAuditoria = useMemo<ColumnDef<RegistroAuditoria>[]>(
    () => [
      {
        accessorKey: 'fecha',
        header: ({ column }) => (
          <DataGridColumnHeader column={column} title="Fecha/Hora" />
        ),
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="text-sm font-medium">
              {new Date(row.original.fecha).toLocaleDateString('es-MX')}
            </span>
            <span className="text-xs text-muted-foreground">
              {new Date(row.original.fecha).toLocaleTimeString('es-MX')}
            </span>
          </div>
        ),
      },
      {
        accessorKey: 'tipoDocumento',
        header: ({ column }) => (
          <DataGridColumnHeader column={column} title="Tipo Doc." />
        ),
        cell: ({ row }) => {
          const tipo = row.original.tipoDocumento;
          return (
            <Badge variant="outline">
              {tipo === 'venta' ? 'Venta' : 'Orden Compra'}
            </Badge>
          );
        },
      },
      {
        accessorKey: 'documentoId',
        header: ({ column }) => (
          <DataGridColumnHeader column={column} title="Documento" />
        ),
        cell: ({ row }) => (
          <span className="font-mono text-sm">{row.original.documentoId}</span>
        ),
      },
      {
        accessorKey: 'accion',
        header: ({ column }) => (
          <DataGridColumnHeader column={column} title="Acción" />
        ),
        cell: ({ row }) => (
          <Badge variant="destructive">{row.original.accion}</Badge>
        ),
      },
      {
        accessorKey: 'usuario',
        header: ({ column }) => (
          <DataGridColumnHeader column={column} title="Usuario" />
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{row.original.usuario}</span>
          </div>
        ),
      },
      {
        accessorKey: 'motivo',
        header: ({ column }) => (
          <DataGridColumnHeader column={column} title="Motivo" />
        ),
        cell: ({ row }) => (
          <span className="text-sm">{row.original.motivo}</span>
        ),
      },
      {
        accessorKey: 'detalles',
        header: ({ column }) => (
          <DataGridColumnHeader column={column} title="Detalles" />
        ),
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">{row.original.detalles}</span>
        ),
      },
    ],
    [],
  );

  // Tablas
  const tablaDocumentos = useReactTable({
    data: documentosFiltrados,
    columns: columnasDocumentos,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: { pageSize: 10 },
    },
  });

  const tablaAuditoria = useReactTable({
    data: auditorias,
    columns: columnasAuditoria,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: { pageSize: 10 },
    },
  });

  // Estadísticas
  const estadisticas = useMemo(() => {
    const ventas = documentos.filter((d) => d.tipo === 'venta');
    const ordenes = documentos.filter((d) => d.tipo === 'orden_compra');
    const cancelables = documentos.filter(puedeSerCancelado);
    const canceladas = documentos.filter((d) => d.estatus === 'cancelada');

    return {
      totalVentas: ventas.length,
      totalOrdenes: ordenes.length,
      cancelables: cancelables.length,
      canceladas: canceladas.length,
      totalAuditorias: auditorias.length,
    };
  }, [documentos, auditorias]);

  return (
    <div className="grow content-start p-5 lg:p-7.5 space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Monitor de Cancelaciones y Auditoría
          </h1>
          <p className="text-sm text-muted-foreground">
            Instalación: <span className="font-medium">{instalacionActiva?.nombre}</span>
          </p>
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
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{estadisticas.totalVentas}</p>
                <p className="text-xs text-muted-foreground">Ventas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                <ShoppingCart className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{estadisticas.totalOrdenes}</p>
                <p className="text-xs text-muted-foreground">Órdenes Compra</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-100 text-yellow-600">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{estadisticas.cancelables}</p>
                <p className="text-xs text-muted-foreground">Cancelables</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
                <XCircle className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{estadisticas.canceladas}</p>
                <p className="text-xs text-muted-foreground">Canceladas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                <History className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{estadisticas.totalAuditorias}</p>
                <p className="text-xs text-muted-foreground">Reg. Auditoría</p>
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
        <AlertTitle>Reglas de Cancelación</AlertTitle>
        <AlertDescription>
          <strong>Ventas:</strong> Solo pueden cancelarse si no tienen factura ni pago
          registrado. <strong>Órdenes de Compra:</strong> Solo pueden cancelarse si no
          han sido recibidas en almacén.
        </AlertDescription>
      </Alert>

      {/* Tabs */}
      <Tabs value={tabActiva} onValueChange={setTabActiva}>
        <TabsList className="mb-4">
          <TabsTrigger value="documentos" className="gap-2">
            <FileText className="h-4 w-4" />
            Documentos
          </TabsTrigger>
          <TabsTrigger value="auditoria" className="gap-2">
            <History className="h-4 w-4" />
            Registro de Auditoría
          </TabsTrigger>
        </TabsList>

        <TabsContent value="documentos">
          <DataGrid table={tablaDocumentos}>
            <Card>
              <CardHeader>
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <CardTitle>Documentos de la Instalación</CardTitle>
                    <CardDescription>
                      Ventas y Órdenes de Compra disponibles para revisión y cancelación
                    </CardDescription>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Buscar por folio, cliente o proveedor..."
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
                Total: {documentosFiltrados.length} documentos
              </CardFooter>
            </Card>
          </DataGrid>
        </TabsContent>

        <TabsContent value="auditoria">
          <DataGrid table={tablaAuditoria}>
            <Card>
              <CardHeader>
                <CardTitle>Registro de Auditoría</CardTitle>
                <CardDescription>
                  Historial de todas las cancelaciones realizadas en esta instalación
                </CardDescription>
              </CardHeader>
              <CardTable>
                <ScrollArea>
                  <DataGridTable />
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </CardTable>
              <CardFooter className="justify-center text-sm text-muted-foreground">
                Total: {auditorias.length} registros
              </CardFooter>
            </Card>
          </DataGrid>
        </TabsContent>
      </Tabs>

      {/* Modal de Cancelación */}
      <Dialog open={modalAbierto} onOpenChange={setModalAbierto}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <Ban className="h-5 w-5" />
              Confirmar Cancelación
            </DialogTitle>
            <DialogDescription>
              Está a punto de cancelar el documento{' '}
              <strong>{documentoSeleccionado?.id}</strong>. Esta acción quedará
              registrada en el sistema de auditoría.
            </DialogDescription>
          </DialogHeader>
          <DialogBody className="space-y-4">
            {documentoSeleccionado && (
              <div className="rounded-lg bg-muted/50 p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tipo:</span>
                  <span className="font-medium">
                    {documentoSeleccionado.tipo === 'venta' ? 'Venta' : 'Orden de Compra'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Fecha:</span>
                  <span className="font-medium">
                    {new Date(documentoSeleccionado.fecha).toLocaleDateString('es-MX')}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Monto:</span>
                  <span className="font-medium">
                    $
                    {documentoSeleccionado.monto.toLocaleString('es-MX', {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="motivo">
                Motivo de Cancelación <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="motivo"
                placeholder="Ingrese el motivo de la cancelación..."
                value={motivoCancelacion}
                onChange={(e) => setMotivoCancelacion(e.target.value)}
                rows={3}
              />
            </div>

            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
              <div className="flex items-center gap-2 text-amber-800">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm font-medium">
                  Esta acción será registrada bajo Usuario 1
                </span>
              </div>
            </div>
          </DialogBody>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={handleCancelar}
              disabled={!motivoCancelacion.trim()}
            >
              Confirmar Cancelación
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
