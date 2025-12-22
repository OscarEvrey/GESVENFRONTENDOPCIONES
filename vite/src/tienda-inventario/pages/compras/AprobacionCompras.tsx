'use client';

import { useCallback, useMemo, useState } from 'react';
import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import {
  CheckCircle,
  ChevronDown,
  ChevronUp,
  ClipboardCheck,
  Search,
  XCircle,
} from 'lucide-react';
 
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardHeading,
  CardTable,
  CardTitle,
  CardToolbar,
} from '@/components/ui/card';
import { DataGrid } from '@/components/ui/data-grid';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { DataGridPagination } from '@/components/ui/data-grid-pagination';
import { DataGridTable } from '@/components/ui/data-grid-table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useInstalacionActivaObligatoria } from '../../context/ContextoInstalacion';
import {
  OrdenCompra,
  useOrdenesCompra,
} from '../../context/ContextoOrdenesCompra';

// ============ COMPONENTE PRINCIPAL ============
export function AprobacionComprasPage() {
  const instalacionActiva = useInstalacionActivaObligatoria();
  const {
    obtenerOrdenesPendientesPorInstalacion,
    aprobarOrden,
    rechazarOrden,
  } = useOrdenesCompra();
  const [busqueda, setBusqueda] = useState('');
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [ordenExpandida, setOrdenExpandida] = useState<string | null>(null);
  const [modalRechazo, setModalRechazo] = useState<{
    abierto: boolean;
    ordenId: string;
  }>({ abierto: false, ordenId: '' });
  const [motivoRechazo, setMotivoRechazo] = useState('');

  // Obtener órdenes pendientes de la instalación activa
  const ordenesPendientes = useMemo(() => {
    return obtenerOrdenesPendientesPorInstalacion(instalacionActiva.id);
  }, [instalacionActiva, obtenerOrdenesPendientesPorInstalacion]);

  // Filtrar por búsqueda
  const ordenesFiltradas = useMemo(() => {
    if (!busqueda) return ordenesPendientes;
    const termino = busqueda.toLowerCase();
    return ordenesPendientes.filter(
      (orden) =>
        orden.id.toLowerCase().includes(termino) ||
        orden.proveedorNombre.toLowerCase().includes(termino),
    );
  }, [ordenesPendientes, busqueda]);

  // Funciones de acciones - definidas antes de useMemo para columns
  const handleAprobar = useCallback((ordenId: string) => {
    aprobarOrden(ordenId);
    toast.success(`Orden ${ordenId} aprobada exitosamente`);
  }, [aprobarOrden]);

  const abrirModalRechazo = useCallback((ordenId: string) => {
    setModalRechazo({ abierto: true, ordenId });
    setMotivoRechazo('');
  }, []);

  const cerrarModalRechazo = () => {
    setModalRechazo({ abierto: false, ordenId: '' });
    setMotivoRechazo('');
  };

  const confirmarRechazo = () => {
    if (!motivoRechazo.trim()) {
      toast.error('Debe ingresar un motivo de rechazo');
      return;
    }
    rechazarOrden(modalRechazo.ordenId, motivoRechazo);
    toast.success(`Orden ${modalRechazo.ordenId} rechazada`);
    cerrarModalRechazo();
  };

  // Columnas de la tabla
  const columns = useMemo<ColumnDef<OrdenCompra>[]>(
    () => [
      {
        id: 'expandir',
        header: () => null,
        cell: ({ row }) => (
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              setOrdenExpandida(
                ordenExpandida === row.original.id ? null : row.original.id,
              )
            }
          >
            {ordenExpandida === row.original.id ? (
              <ChevronUp className="size-4" />
            ) : (
              <ChevronDown className="size-4" />
            )}
          </Button>
        ),
        size: 50,
      },
      {
        accessorKey: 'id',
        header: ({ column }) => (
          <DataGridColumnHeader title="ID Orden" column={column} />
        ),
        size: 120,
      },
      {
        accessorKey: 'proveedorNombre',
        header: ({ column }) => (
          <DataGridColumnHeader title="Proveedor" column={column} />
        ),
        size: 250,
      },
      {
        accessorKey: 'fechaSolicitud',
        header: ({ column }) => (
          <DataGridColumnHeader title="Fecha Solicitud" column={column} />
        ),
        cell: ({ row }) => {
          const fecha = new Date(row.original.fechaSolicitud);
          return fecha.toLocaleDateString('es-MX', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          });
        },
        size: 140,
      },
      {
        accessorKey: 'total',
        header: ({ column }) => (
          <DataGridColumnHeader title="Total" column={column} />
        ),
        cell: ({ row }) => (
          <span className="font-semibold">
            ${row.original.total.toLocaleString('es-MX', {
              minimumFractionDigits: 2,
            })}
          </span>
        ),
        size: 120,
      },
      {
        accessorKey: 'estatus',
        header: ({ column }) => (
          <DataGridColumnHeader title="Estatus" column={column} />
        ),
        cell: () => (
          <Badge variant="warning" size="sm">
            Pendiente
          </Badge>
        ),
        size: 100,
      },
      {
        id: 'acciones',
        header: 'Acciones',
        cell: ({ row }) => (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1 text-green-600 border-green-600 hover:bg-green-50"
              onClick={() => handleAprobar(row.original.id)}
            >
              <CheckCircle className="size-4" />
              Aprobar
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1 text-red-600 border-red-600 hover:bg-red-50"
              onClick={() => abrirModalRechazo(row.original.id)}
            >
              <XCircle className="size-4" />
              Rechazar
            </Button>
          </div>
        ),
        size: 200,
      },
    ],
    [abrirModalRechazo, handleAprobar, ordenExpandida],
  );

  const table = useReactTable({
    data: ordenesFiltradas,
    columns,
    state: { pagination, sorting },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="container-fluid">
      <div className="grid gap-5 lg:gap-7.5">
        {/* Encabezado */}
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <ClipboardCheck className="size-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Aprobación de Compras</h2>
                  <p className="text-sm text-muted-foreground">
                    Revisar y aprobar órdenes de compra pendientes de:{' '}
                    <strong>{instalacionActiva.nombre}</strong>
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Badge variant="outline" size="lg">
                  {instalacionActiva.empresa}
                </Badge>
                <Badge
                  variant={
                    instalacionActiva.tipo === 'almacen' ? 'primary' : 'success'
                  }
                  size="lg"
                >
                  {instalacionActiva.tipo === 'almacen' ? 'Almacén' : 'Oficinas'}
                </Badge>
                <Badge variant="warning" size="lg">
                  {ordenesPendientes.length} Pendiente(s)
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabla de Órdenes */}
        <DataGrid table={table} recordCount={ordenesFiltradas.length}>
          <Card>
            <CardHeader>
              <CardHeading>
                <CardTitle>Órdenes Pendientes de Aprobación</CardTitle>
              </CardHeading>
              <CardToolbar>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por ID o proveedor..."
                    className="pl-10 w-64"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                  />
                </div>
              </CardToolbar>
            </CardHeader>
            <CardTable>
              <ScrollArea>
                <DataGridTable />
                <ScrollBar orientation="horizontal" />
              </ScrollArea>

              {/* Detalle expandido - Mostrar fuera de la tabla */}
              {ordenExpandida && (
                <div className="border-t bg-muted/30 p-4">
                  {ordenesFiltradas
                    .filter((o) => o.id === ordenExpandida)
                    .map((orden) => (
                      <div key={orden.id}>
                        <div className="mb-3">
                          <h4 className="font-semibold text-sm mb-1">
                            Comentarios:
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {orden.comentarios || 'Sin comentarios'}
                          </p>
                        </div>
                        <h4 className="font-semibold text-sm mb-2">
                          Detalle de Artículos:
                        </h4>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Artículo</TableHead>
                              <TableHead className="text-right">Cantidad</TableHead>
                              <TableHead className="text-right">
                                Costo Unitario
                              </TableHead>
                              <TableHead className="text-right">Subtotal</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {orden.lineas.map((linea, idx) => (
                              <TableRow key={idx}>
                                <TableCell>{linea.articuloNombre}</TableCell>
                                <TableCell className="text-right">
                                  {linea.cantidad.toLocaleString('es-MX')}
                                </TableCell>
                                <TableCell className="text-right">
                                  ${linea.costoUnitario.toLocaleString('es-MX', {
                                    minimumFractionDigits: 2,
                                  })}
                                </TableCell>
                                <TableCell className="text-right font-medium">
                                  ${linea.subtotal.toLocaleString('es-MX', {
                                    minimumFractionDigits: 2,
                                  })}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    ))}
                </div>
              )}
            </CardTable>
            <CardFooter className="justify-center">
              <DataGridPagination />
            </CardFooter>
          </Card>
        </DataGrid>

        {/* Mensaje cuando no hay órdenes */}
        {ordenesPendientes.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <ClipboardCheck className="size-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold">No hay órdenes pendientes</h3>
              <p className="text-muted-foreground">
                No hay órdenes de compra pendientes de aprobación para la
                instalación <strong>{instalacionActiva.nombre}</strong>.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Modal de Rechazo */}
        <Dialog open={modalRechazo.abierto} onOpenChange={cerrarModalRechazo}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Rechazar Orden de Compra</DialogTitle>
              <DialogDescription>
                Por favor ingrese el motivo del rechazo para la orden{' '}
                <strong>{modalRechazo.ordenId}</strong>. Este campo es obligatorio.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <label className="text-sm font-medium mb-2 block">
                Motivo de Rechazo *
              </label>
              <Textarea
                placeholder="Ingrese el motivo del rechazo..."
                value={motivoRechazo}
                onChange={(e) => setMotivoRechazo(e.target.value)}
                rows={4}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={cerrarModalRechazo}>
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={confirmarRechazo}
                disabled={!motivoRechazo.trim()}
              >
                Confirmar Rechazo
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
