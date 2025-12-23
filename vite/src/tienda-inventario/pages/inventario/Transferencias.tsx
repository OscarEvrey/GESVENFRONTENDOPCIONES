'use client';

import { useMemo, useState } from 'react';
import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle,
  Clock,
  Package,
  Plus,
  Send,
  Trash2,
  Truck,
} from 'lucide-react';
import { useContextoInstalacion, useInstalacionActivaObligatoria } from '../../context/ContextoInstalacion';
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
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// ============ TIPOS ============
interface ProductoDisponible {
  id: string;
  codigo: string;
  nombre: string;
  stockActual: number;
  unidad: string;
}

interface LineaTransferencia {
  productoId: string;
  productoCodigo: string;
  productoNombre: string;
  cantidad: number;
  unidad: string;
}

interface TransferenciaRegistrada {
  id: string;
  folio: string;
  instalacionOrigen: string;
  instalacionDestino: string;
  fechaEnvio: string;
  fechaRecepcion: string | null;
  estatus: 'En Tránsito' | 'Recibida';
  totalArticulos: number;
}

// ============ DATOS FICTICIOS ============
const productosDisponiblesAlmacen: ProductoDisponible[] = [
  { id: 'p1', codigo: 'REF-001', nombre: 'Coca-Cola 600ml', stockActual: 2500, unidad: 'Pza' },
  { id: 'p2', codigo: 'REF-002', nombre: 'Pepsi 600ml', stockActual: 1800, unidad: 'Pza' },
  { id: 'p3', codigo: 'SNK-001', nombre: 'Sabritas Original 45g', stockActual: 1500, unidad: 'Pza' },
  { id: 'p4', codigo: 'SNK-002', nombre: 'Doritos Nacho 62g', stockActual: 800, unidad: 'Pza' },
  { id: 'p5', codigo: 'REF-005', nombre: 'Agua Ciel 1L', stockActual: 3200, unidad: 'Pza' },
];

const productosDisponiblesOficinas: ProductoDisponible[] = [
  { id: 'p6', codigo: 'PAP-001', nombre: 'Hojas Blancas Carta (500)', stockActual: 85, unidad: 'Paq' },
  { id: 'p7', codigo: 'PAP-002', nombre: 'Plumas BIC Azul (12)', stockActual: 45, unidad: 'Cja' },
  { id: 'p8', codigo: 'CON-001', nombre: 'Toner HP 85A', stockActual: 12, unidad: 'Pza' },
  { id: 'p9', codigo: 'CON-004', nombre: 'Café Nescafé Clásico 200g', stockActual: 15, unidad: 'Fco' },
];

const transferenciasEnTransito: TransferenciaRegistrada[] = [
  {
    id: 'tr-001',
    folio: 'TRF-2024-0001',
    instalacionOrigen: 'Almacen-SCC-MTY',
    instalacionDestino: 'Oficinas-SCC-MTY',
    fechaEnvio: '2024-01-10',
    fechaRecepcion: null,
    estatus: 'En Tránsito',
    totalArticulos: 50,
  },
  {
    id: 'tr-002',
    folio: 'TRF-2024-0002',
    instalacionOrigen: 'Almacen-Vaxsa-MTY',
    instalacionDestino: 'Oficinas-Vaxsa-MTY',
    fechaEnvio: '2024-01-12',
    fechaRecepcion: '2024-01-13',
    estatus: 'Recibida',
    totalArticulos: 25,
  },
];

// ============ COMPONENTE PRINCIPAL ============
export function TransferenciasPage() {
  const instalacionActiva = useInstalacionActivaObligatoria();
  const { instalaciones } = useContextoInstalacion();

  const [tabActiva, setTabActiva] = useState<string>('nueva');
  const [instalacionDestinoId, setInstalacionDestinoId] = useState<string>('');
  const [productoId, setProductoId] = useState<string>('');
  const [cantidad, setCantidad] = useState<number>(1);
  const [lineasTransferencia, setLineasTransferencia] = useState<LineaTransferencia[]>([]);
  const [mensajeExito, setMensajeExito] = useState<string>('');
  const [folioCounter, setFolioCounter] = useState<number>(3);

  // Productos disponibles según la instalación activa
  const productosDisponibles = useMemo(() => {
    return instalacionActiva.tipo === 'almacen'
      ? productosDisponiblesAlmacen
      : productosDisponiblesOficinas;
  }, [instalacionActiva]);

  // Instalaciones destino (todas menos la activa)
  const instalacionesDestino = useMemo(() => {
    return instalaciones.filter((i) => i.id !== instalacionActiva.id);
  }, [instalaciones, instalacionActiva]);

  // Producto seleccionado
  const productoSeleccionado = useMemo(() => {
    return productosDisponibles.find((p) => p.id === productoId);
  }, [productosDisponibles, productoId]);

  // Agregar línea de transferencia
  const agregarLinea = () => {
    if (!productoSeleccionado || cantidad <= 0) return;

    // Verificar que no exceda el stock
    const cantidadYaEnTransferencia = lineasTransferencia
      .filter((l) => l.productoId === productoId)
      .reduce((sum, l) => sum + l.cantidad, 0);

    if (cantidadYaEnTransferencia + cantidad > productoSeleccionado.stockActual) {
      alert(`Stock insuficiente. Disponible: ${productoSeleccionado.stockActual - cantidadYaEnTransferencia}`);
      return;
    }

    const nuevaLinea: LineaTransferencia = {
      productoId: productoSeleccionado.id,
      productoCodigo: productoSeleccionado.codigo,
      productoNombre: productoSeleccionado.nombre,
      cantidad,
      unidad: productoSeleccionado.unidad,
    };

    setLineasTransferencia((prev) => [...prev, nuevaLinea]);
    setProductoId('');
    setCantidad(1);
  };

  // Eliminar línea
  const eliminarLinea = (index: number) => {
    setLineasTransferencia((prev) => prev.filter((_, i) => i !== index));
  };

  // Generar salida
  const generarSalida = () => {
    if (!instalacionDestinoId || lineasTransferencia.length === 0) {
      alert('Debe seleccionar una instalación destino y agregar al menos un producto.');
      return;
    }

    const folio = `TRF-2024-${String(folioCounter).padStart(4, '0')}`;
    setFolioCounter((prev) => prev + 1);

    setMensajeExito(
      `Transferencia ${folio} generada exitosamente. Estatus: En Tránsito.`
    );

    setInstalacionDestinoId('');
    setLineasTransferencia([]);

    setTimeout(() => {
      setMensajeExito('');
    }, 5000);
  };

  // Columnas de la tabla de líneas
  const columnasLineas = useMemo<ColumnDef<LineaTransferencia>[]>(
    () => [
      {
        accessorKey: 'productoCodigo',
        header: ({ column }) => (
          <DataGridColumnHeader title="Código" column={column} />
        ),
        size: 100,
      },
      {
        accessorKey: 'productoNombre',
        header: ({ column }) => (
          <DataGridColumnHeader title="Producto" column={column} />
        ),
        size: 250,
      },
      {
        accessorKey: 'cantidad',
        header: ({ column }) => (
          <DataGridColumnHeader title="Cantidad" column={column} />
        ),
        cell: (info) => info.getValue<number>().toLocaleString(),
        size: 100,
      },
      {
        accessorKey: 'unidad',
        header: ({ column }) => (
          <DataGridColumnHeader title="Unidad" column={column} />
        ),
        size: 80,
      },
      {
        id: 'acciones',
        header: 'Acciones',
        cell: (info) => (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => eliminarLinea(info.row.index)}
          >
            <Trash2 className="size-4 text-destructive" />
          </Button>
        ),
        size: 80,
      },
    ],
    []
  );

  // Columnas de la tabla de transferencias
  const columnasTransferencias = useMemo<ColumnDef<TransferenciaRegistrada>[]>(
    () => [
      {
        accessorKey: 'folio',
        header: ({ column }) => (
          <DataGridColumnHeader title="Folio" column={column} />
        ),
        cell: (info) => (
          <span className="font-mono font-medium">{info.getValue<string>()}</span>
        ),
        size: 150,
      },
      {
        accessorKey: 'instalacionOrigen',
        header: ({ column }) => (
          <DataGridColumnHeader title="Origen" column={column} />
        ),
        size: 180,
      },
      {
        accessorKey: 'instalacionDestino',
        header: ({ column }) => (
          <DataGridColumnHeader title="Destino" column={column} />
        ),
        size: 180,
      },
      {
        accessorKey: 'fechaEnvio',
        header: ({ column }) => (
          <DataGridColumnHeader title="Fecha Envío" column={column} />
        ),
        size: 120,
      },
      {
        accessorKey: 'estatus',
        header: ({ column }) => (
          <DataGridColumnHeader title="Estatus" column={column} />
        ),
        cell: (info) => {
          const estatus = info.getValue<string>();
          return (
            <Badge variant={estatus === 'En Tránsito' ? 'warning' : 'success'} appearance="light">
              {estatus === 'En Tránsito' && <Truck className="size-3 me-1" />}
              {estatus === 'Recibida' && <CheckCircle className="size-3 me-1" />}
              {estatus}
            </Badge>
          );
        },
        size: 130,
      },
      {
        accessorKey: 'totalArticulos',
        header: ({ column }) => (
          <DataGridColumnHeader title="Artículos" column={column} />
        ),
        cell: (info) => info.getValue<number>().toLocaleString(),
        size: 100,
      },
      {
        id: 'acciones',
        header: 'Acciones',
        cell: (info) => {
          const row = info.row.original;
          if (row.estatus === 'En Tránsito') {
            return (
              <Button variant="outline" size="sm">
                <CheckCircle className="size-4 me-1" />
                Confirmar Recepción
              </Button>
            );
          }
          return <span className="text-muted-foreground text-sm">-</span>;
        },
        size: 160,
      },
    ],
    []
  );

  const tablaLineas = useReactTable({
    data: lineasTransferencia,
    columns: columnasLineas,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const tablaTransferencias = useReactTable({
    data: transferenciasEnTransito,
    columns: columnasTransferencias,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
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
                  <Truck className="size-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Transferencias entre Instalaciones</h2>
                  <p className="text-sm text-muted-foreground">
                    Instalación Origen: {instalacionActiva.nombre}
                  </p>
                </div>
              </div>
              <Badge variant="primary" appearance="light" size="lg">
                {instalacionActiva.empresa} - {instalacionActiva.ubicacion}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Mensaje de éxito */}
        {mensajeExito && (
          <Alert variant="success">
            <AlertIcon>
              <CheckCircle className="size-4" />
            </AlertIcon>
            <AlertTitle>¡Transferencia Generada!</AlertTitle>
            <AlertDescription>{mensajeExito}</AlertDescription>
          </Alert>
        )}

        {/* Tabs */}
        <Tabs value={tabActiva} onValueChange={setTabActiva}>
          <TabsList className="w-full justify-start">
            <TabsTrigger value="nueva" className="gap-2">
              <Plus className="size-4" />
              Nueva Transferencia
            </TabsTrigger>
            <TabsTrigger value="transito" className="gap-2">
              <Clock className="size-4" />
              En Tránsito / Historial
            </TabsTrigger>
          </TabsList>

          {/* Tab: Nueva Transferencia */}
          <TabsContent value="nueva" className="space-y-5 mt-5">
            <div className="grid lg:grid-cols-3 gap-5">
              {/* Selección de Destino */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ArrowRight className="size-5" />
                    Instalación Destino
                  </CardTitle>
                  <CardDescription>
                    Seleccione la sede que recibirá la mercancía
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Destino *</Label>
                    <Select value={instalacionDestinoId} onValueChange={setInstalacionDestinoId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar instalación destino..." />
                      </SelectTrigger>
                      <SelectContent>
                        {instalacionesDestino.map((inst) => (
                          <SelectItem key={inst.id} value={inst.id}>
                            {inst.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Agregar Productos */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="size-5" />
                    Agregar Artículos
                  </CardTitle>
                  <CardDescription>
                    Solo productos con stock disponible en la instalación origen
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4 items-end">
                    <div className="md:col-span-2 space-y-2">
                      <Label>Artículo *</Label>
                      <Select value={productoId} onValueChange={setProductoId}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar artículo..." />
                        </SelectTrigger>
                        <SelectContent>
                          {productosDisponibles.map((p) => (
                            <SelectItem key={p.id} value={p.id}>
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-xs">{p.codigo}</span>
                                <span>{p.nombre}</span>
                                <Badge variant="outline" size="sm">
                                  Stock: {p.stockActual}
                                </Badge>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Cantidad *</Label>
                      <Input
                        type="number"
                        min={1}
                        max={productoSeleccionado?.stockActual ?? 1}
                        value={cantidad}
                        onChange={(e) => setCantidad(parseInt(e.target.value) || 1)}
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Button onClick={agregarLinea} disabled={!productoId || cantidad <= 0}>
                      <Plus className="size-4 me-2" />
                      Agregar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tabla de Líneas */}
            <DataGrid table={tablaLineas} recordCount={lineasTransferencia.length}>
              <Card>
                <CardHeader>
                  <CardTitle>Detalle de la Transferencia</CardTitle>
                  <CardDescription>
                    {lineasTransferencia.length} artículo(s) a transferir
                  </CardDescription>
                </CardHeader>
                {lineasTransferencia.length > 0 ? (
                  <>
                    <CardTable>
                      <ScrollArea>
                        <DataGridTable />
                        <ScrollBar orientation="horizontal" />
                      </ScrollArea>
                    </CardTable>
                    <CardContent>
                      <Separator className="my-4" />
                      <div className="flex justify-end">
                        <p className="text-sm text-muted-foreground">
                          Total de unidades:{' '}
                          <span className="font-bold">
                            {lineasTransferencia.reduce((sum, l) => sum + l.cantidad, 0).toLocaleString()}
                          </span>
                        </p>
                      </div>
                    </CardContent>
                  </>
                ) : (
                  <CardContent>
                    <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                      <Package className="size-12 mb-4 opacity-30" />
                      <p>No hay artículos agregados</p>
                    </div>
                  </CardContent>
                )}
                <CardFooter className="justify-between">
                  <div>
                    {!instalacionDestinoId && lineasTransferencia.length > 0 && (
                      <div className="flex items-center gap-2 text-amber-600">
                        <AlertCircle className="size-4" />
                        <span className="text-sm">
                          Seleccione una instalación destino
                        </span>
                      </div>
                    )}
                  </div>
                  <Button
                    size="lg"
                    onClick={generarSalida}
                    disabled={!instalacionDestinoId || lineasTransferencia.length === 0}
                  >
                    <Send className="size-4 me-2" />
                    Generar Salida (En Tránsito)
                  </Button>
                </CardFooter>
              </Card>
            </DataGrid>
          </TabsContent>

          {/* Tab: En Tránsito / Historial */}
          <TabsContent value="transito" className="space-y-5 mt-5">
            <DataGrid table={tablaTransferencias} recordCount={transferenciasEnTransito.length}>
              <Card>
                <CardHeader>
                  <CardTitle>Transferencias en Tránsito e Historial</CardTitle>
                  <CardDescription>
                    Listado de transferencias pendientes de recepción y recientes
                  </CardDescription>
                </CardHeader>
                <CardTable>
                  <ScrollArea>
                    <DataGridTable />
                    <ScrollBar orientation="horizontal" />
                  </ScrollArea>
                </CardTable>
                <CardFooter className="text-sm text-muted-foreground">
                  Total: {transferenciasEnTransito.length} transferencias
                </CardFooter>
              </Card>
            </DataGrid>

            <Alert variant="mono">
              <AlertIcon>
                <AlertCircle className="size-4" />
              </AlertIcon>
              <AlertTitle>Información</AlertTitle>
              <AlertDescription>
                Las transferencias &quot;En Tránsito&quot; disminuyen el stock del origen pero
                no aumentan el del destino hasta que este último confirme la recepción física.
              </AlertDescription>
            </Alert>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
