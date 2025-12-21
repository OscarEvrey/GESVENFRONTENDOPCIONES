'use client';

import { useMemo, useState } from 'react';
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
  ArrowDownCircle,
  ArrowUpCircle,
  Calendar,
  ClipboardList,
  Search,
  User,
} from 'lucide-react';
import { Navigate } from 'react-router-dom';
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
import { Input } from '@/components/ui/input';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useContextoInstalacion } from '../../context/ContextoInstalacion';

// ============ TIPOS ============
interface MovimientoKardex {
  id: string;
  fecha: string;
  tipo: 'entrada' | 'salida';
  producto: string;
  codigoProducto: string;
  cantidad: number;
  saldoFinal: number;
  lote: string;
  referencia: string;
  tipoReferencia: 'compra' | 'venta' | 'ajuste' | 'transferencia';
  usuario: string;
  esServicio: boolean;
}

// ============ DATOS FICTICIOS - ALMACÉN ============
const movimientosAlmacen: MovimientoKardex[] = [
  {
    id: 'MOV-001',
    fecha: '2024-12-21T14:30:00.000Z',
    tipo: 'entrada',
    producto: 'Coca-Cola 600ml',
    codigoProducto: 'REF-001',
    cantidad: 500,
    saldoFinal: 2500,
    lote: 'LOT-2024-045',
    referencia: 'OC-2024-0002',
    tipoReferencia: 'compra',
    usuario: 'Juan Pérez',
    esServicio: false,
  },
  {
    id: 'MOV-002',
    fecha: '2024-12-21T12:15:00.000Z',
    tipo: 'salida',
    producto: 'Pepsi 600ml',
    codigoProducto: 'REF-002',
    cantidad: 200,
    saldoFinal: 1800,
    lote: 'LOT-2024-038',
    referencia: 'VTA-2024-0125',
    tipoReferencia: 'venta',
    usuario: 'María García',
    esServicio: false,
  },
  {
    id: 'MOV-003',
    fecha: '2024-12-20T16:45:00.000Z',
    tipo: 'entrada',
    producto: 'Agua Ciel 1L',
    codigoProducto: 'REF-005',
    cantidad: 400,
    saldoFinal: 3200,
    lote: 'LOT-2024-052',
    referencia: 'OC-2024-0002',
    tipoReferencia: 'compra',
    usuario: 'Juan Pérez',
    esServicio: false,
  },
  {
    id: 'MOV-004',
    fecha: '2024-12-20T10:00:00.000Z',
    tipo: 'salida',
    producto: 'Sabritas Original 45g',
    codigoProducto: 'SNK-001',
    cantidad: 150,
    saldoFinal: 1500,
    lote: 'LOT-2024-041',
    referencia: 'VTA-2024-0122',
    tipoReferencia: 'venta',
    usuario: 'Carlos López',
    esServicio: false,
  },
  {
    id: 'MOV-005',
    fecha: '2024-12-19T15:30:00.000Z',
    tipo: 'entrada',
    producto: 'Doritos Nacho 62g',
    codigoProducto: 'SNK-002',
    cantidad: 300,
    saldoFinal: 800,
    lote: 'LOT-2024-048',
    referencia: 'OC-2024-0001',
    tipoReferencia: 'compra',
    usuario: 'Juan Pérez',
    esServicio: false,
  },
  {
    id: 'MOV-006',
    fecha: '2024-12-19T11:20:00.000Z',
    tipo: 'salida',
    producto: 'Coca-Cola 600ml',
    codigoProducto: 'REF-001',
    cantidad: 350,
    saldoFinal: 2000,
    lote: 'LOT-2024-032',
    referencia: 'VTA-2024-0118',
    tipoReferencia: 'venta',
    usuario: 'María García',
    esServicio: false,
  },
  {
    id: 'MOV-007',
    fecha: '2024-12-18T09:00:00.000Z',
    tipo: 'entrada',
    producto: 'Takis Fuego 68g',
    codigoProducto: 'SNK-005',
    cantidad: 200,
    saldoFinal: 420,
    lote: 'LOT-2024-055',
    referencia: 'OC-2024-0001',
    tipoReferencia: 'compra',
    usuario: 'Juan Pérez',
    esServicio: false,
  },
  {
    id: 'MOV-008',
    fecha: '2024-12-18T08:30:00.000Z',
    tipo: 'salida',
    producto: 'Sprite 600ml',
    codigoProducto: 'REF-003',
    cantidad: 100,
    saldoFinal: 150,
    lote: 'LOT-2024-025',
    referencia: 'VTA-2024-0115',
    tipoReferencia: 'venta',
    usuario: 'Ana Martínez',
    esServicio: false,
  },
  {
    id: 'MOV-009',
    fecha: '2024-12-17T14:00:00.000Z',
    tipo: 'salida',
    producto: 'Jumex Mango 335ml',
    codigoProducto: 'REF-006',
    cantidad: 50,
    saldoFinal: 980,
    lote: 'LOT-2024-030',
    referencia: 'VTA-2024-0110',
    tipoReferencia: 'venta',
    usuario: 'Carlos López',
    esServicio: false,
  },
  {
    id: 'MOV-010',
    fecha: '2024-12-17T10:30:00.000Z',
    tipo: 'entrada',
    producto: 'Ruffles Queso 45g',
    codigoProducto: 'SNK-004',
    cantidad: 250,
    saldoFinal: 650,
    lote: 'LOT-2024-049',
    referencia: 'OC-2024-0001',
    tipoReferencia: 'compra',
    usuario: 'Juan Pérez',
    esServicio: false,
  },
  {
    id: 'MOV-011',
    fecha: '2024-12-16T16:00:00.000Z',
    tipo: 'salida',
    producto: 'Cheetos Flamin Hot 52g',
    codigoProducto: 'SNK-003',
    cantidad: 80,
    saldoFinal: 50,
    lote: 'LOT-2024-028',
    referencia: 'VTA-2024-0105',
    tipoReferencia: 'venta',
    usuario: 'María García',
    esServicio: false,
  },
  {
    id: 'MOV-012',
    fecha: '2024-12-16T09:45:00.000Z',
    tipo: 'salida',
    producto: 'Fanta Naranja 600ml',
    codigoProducto: 'REF-004',
    cantidad: 120,
    saldoFinal: 0,
    lote: 'LOT-2024-022',
    referencia: 'VTA-2024-0102',
    tipoReferencia: 'venta',
    usuario: 'Ana Martínez',
    esServicio: false,
  },
];

// ============ DATOS FICTICIOS - OFICINAS ============
const movimientosOficinas: MovimientoKardex[] = [
  {
    id: 'MOV-O01',
    fecha: '2024-12-21T11:00:00.000Z',
    tipo: 'entrada',
    producto: 'Hojas Blancas Carta (500)',
    codigoProducto: 'PAP-001',
    cantidad: 50,
    saldoFinal: 85,
    lote: 'LOT-2024-P12',
    referencia: 'OC-2024-0001',
    tipoReferencia: 'compra',
    usuario: 'Roberto Sánchez',
    esServicio: false,
  },
  {
    id: 'MOV-O02',
    fecha: '2024-12-21T09:30:00.000Z',
    tipo: 'salida',
    producto: 'Plumas BIC Azul (12)',
    codigoProducto: 'PAP-002',
    cantidad: 5,
    saldoFinal: 45,
    lote: 'LOT-2024-P08',
    referencia: 'REQ-2024-0045',
    tipoReferencia: 'ajuste',
    usuario: 'Laura Díaz',
    esServicio: false,
  },
  {
    id: 'MOV-O03',
    fecha: '2024-12-20T15:20:00.000Z',
    tipo: 'entrada',
    producto: 'Toner HP 85A',
    codigoProducto: 'CON-001',
    cantidad: 5,
    saldoFinal: 12,
    lote: 'LOT-2024-C22',
    referencia: 'OC-2024-0001',
    tipoReferencia: 'compra',
    usuario: 'Roberto Sánchez',
    esServicio: false,
  },
  {
    id: 'MOV-O04',
    fecha: '2024-12-20T10:00:00.000Z',
    tipo: 'entrada',
    producto: 'Servicio de Internet - Diciembre',
    codigoProducto: 'SERV-001',
    cantidad: 1,
    saldoFinal: 0,
    lote: 'N/A',
    referencia: 'OC-2024-0005',
    tipoReferencia: 'compra',
    usuario: 'Roberto Sánchez',
    esServicio: true,
  },
  {
    id: 'MOV-O05',
    fecha: '2024-12-19T14:45:00.000Z',
    tipo: 'salida',
    producto: 'Folders Carta (25)',
    codigoProducto: 'PAP-004',
    cantidad: 3,
    saldoFinal: 32,
    lote: 'LOT-2024-P15',
    referencia: 'REQ-2024-0042',
    tipoReferencia: 'ajuste',
    usuario: 'Patricia Ruiz',
    esServicio: false,
  },
  {
    id: 'MOV-O06',
    fecha: '2024-12-19T11:30:00.000Z',
    tipo: 'salida',
    producto: 'Café Nescafé Clásico 200g',
    codigoProducto: 'CON-004',
    cantidad: 2,
    saldoFinal: 15,
    lote: 'LOT-2024-C18',
    referencia: 'REQ-2024-0040',
    tipoReferencia: 'ajuste',
    usuario: 'Laura Díaz',
    esServicio: false,
  },
  {
    id: 'MOV-O07',
    fecha: '2024-12-18T16:00:00.000Z',
    tipo: 'entrada',
    producto: 'Post-it Colores (5)',
    codigoProducto: 'PAP-006',
    cantidad: 10,
    saldoFinal: 22,
    lote: 'LOT-2024-P18',
    referencia: 'OC-2024-0003',
    tipoReferencia: 'compra',
    usuario: 'Roberto Sánchez',
    esServicio: false,
  },
  {
    id: 'MOV-O08',
    fecha: '2024-12-18T09:15:00.000Z',
    tipo: 'entrada',
    producto: 'Mantenimiento de Impresoras',
    codigoProducto: 'SERV-002',
    cantidad: 1,
    saldoFinal: 0,
    lote: 'N/A',
    referencia: 'OC-2024-0006',
    tipoReferencia: 'compra',
    usuario: 'Roberto Sánchez',
    esServicio: true,
  },
  {
    id: 'MOV-O09',
    fecha: '2024-12-17T13:00:00.000Z',
    tipo: 'salida',
    producto: 'Cartucho Canon PG-245',
    codigoProducto: 'CON-002',
    cantidad: 2,
    saldoFinal: 3,
    lote: 'LOT-2024-C10',
    referencia: 'REQ-2024-0035',
    tipoReferencia: 'ajuste',
    usuario: 'Patricia Ruiz',
    esServicio: false,
  },
  {
    id: 'MOV-O10',
    fecha: '2024-12-17T10:30:00.000Z',
    tipo: 'salida',
    producto: 'Lápices #2 (12)',
    codigoProducto: 'PAP-003',
    cantidad: 4,
    saldoFinal: 8,
    lote: 'LOT-2024-P05',
    referencia: 'REQ-2024-0033',
    tipoReferencia: 'ajuste',
    usuario: 'Laura Díaz',
    esServicio: false,
  },
  {
    id: 'MOV-O11',
    fecha: '2024-12-16T15:45:00.000Z',
    tipo: 'salida',
    producto: 'Clips Jumbo (100)',
    codigoProducto: 'PAP-005',
    cantidad: 5,
    saldoFinal: 0,
    lote: 'LOT-2024-P03',
    referencia: 'REQ-2024-0030',
    tipoReferencia: 'ajuste',
    usuario: 'Patricia Ruiz',
    esServicio: false,
  },
  {
    id: 'MOV-O12',
    fecha: '2024-12-16T08:00:00.000Z',
    tipo: 'entrada',
    producto: 'Limpieza de Oficinas - Semanal',
    codigoProducto: 'SERV-003',
    cantidad: 1,
    saldoFinal: 0,
    lote: 'N/A',
    referencia: 'OC-2024-0007',
    tipoReferencia: 'compra',
    usuario: 'Roberto Sánchez',
    esServicio: true,
  },
];

// ============ COMPONENTE PRINCIPAL ============
export function KardexMovimientosPage() {
  const { instalacionActiva } = useContextoInstalacion();
  const [busqueda, setBusqueda] = useState('');
  const [tipoFiltro, setTipoFiltro] = useState<string>('');
  const [fechaDesde, setFechaDesde] = useState<string>('');
  const [fechaHasta, setFechaHasta] = useState<string>('');
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'fecha', desc: true },
  ]);

  // Seleccionar datos según el tipo de instalación
  const datosBase = useMemo(() => {
    if (!instalacionActiva) return [];
    return instalacionActiva.tipo === 'almacen'
      ? movimientosAlmacen
      : movimientosOficinas;
  }, [instalacionActiva]);

  // Filtrar datos
  const datosFiltrados = useMemo(() => {
    return datosBase
      .filter((item) => {
        // Filtro de búsqueda
        if (busqueda) {
          const termino = busqueda.toLowerCase();
          if (
            !item.producto.toLowerCase().includes(termino) &&
            !item.codigoProducto.toLowerCase().includes(termino) &&
            !item.referencia.toLowerCase().includes(termino)
          ) {
            return false;
          }
        }
        // Filtro de tipo
        if (tipoFiltro && tipoFiltro !== 'todos' && item.tipo !== tipoFiltro) {
          return false;
        }
        // Filtro de fecha desde
        if (fechaDesde) {
          const fechaItem = new Date(item.fecha);
          const desde = new Date(fechaDesde);
          desde.setHours(0, 0, 0, 0);
          if (fechaItem < desde) {
            return false;
          }
        }
        // Filtro de fecha hasta
        if (fechaHasta) {
          const fechaItem = new Date(item.fecha);
          const hasta = new Date(fechaHasta);
          hasta.setHours(23, 59, 59, 999);
          if (fechaItem > hasta) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
  }, [datosBase, busqueda, tipoFiltro, fechaDesde, fechaHasta]);

  // Estadísticas
  const estadisticas = useMemo(() => {
    const totalEntradas = datosBase
      .filter((m) => m.tipo === 'entrada')
      .reduce((acc, m) => acc + m.cantidad, 0);
    const totalSalidas = datosBase
      .filter((m) => m.tipo === 'salida')
      .reduce((acc, m) => acc + m.cantidad, 0);
    const totalMovimientos = datosBase.length;
    const totalServicios = datosBase.filter((m) => m.esServicio).length;
    return { totalEntradas, totalSalidas, totalMovimientos, totalServicios };
  }, [datosBase]);

  const columns = useMemo<ColumnDef<MovimientoKardex>[]>(
    () => [
      {
        accessorKey: 'fecha',
        header: ({ column }) => (
          <DataGridColumnHeader title="Fecha" column={column} />
        ),
        cell: (info) => {
          const fecha = new Date(info.getValue<string>());
          return (
            <div>
              <p className="font-medium">
                {fecha.toLocaleDateString('es-MX', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
              </p>
              <p className="text-xs text-muted-foreground">
                {fecha.toLocaleTimeString('es-MX', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          );
        },
        size: 130,
      },
      {
        accessorKey: 'tipo',
        header: ({ column }) => (
          <DataGridColumnHeader title="Tipo" column={column} />
        ),
        cell: (info) => {
          const tipo = info.getValue<string>();
          return (
            <div className="flex items-center gap-2">
              {tipo === 'entrada' ? (
                <ArrowDownCircle className="size-5 text-green-600" />
              ) : (
                <ArrowUpCircle className="size-5 text-red-500" />
              )}
              <Badge
                variant={tipo === 'entrada' ? 'success' : 'destructive'}
                appearance="light"
              >
                {tipo === 'entrada' ? 'Entrada' : 'Salida'}
              </Badge>
            </div>
          );
        },
        size: 120,
      },
      {
        accessorKey: 'producto',
        header: ({ column }) => (
          <DataGridColumnHeader title="Producto" column={column} />
        ),
        cell: (info) => {
          const esServicio = info.row.original.esServicio;
          const esOficina = instalacionActiva?.tipo === 'oficinas';
          return (
            <div
              className={
                esOficina && esServicio
                  ? 'bg-blue-50 -mx-4 px-4 py-1 rounded'
                  : ''
              }
            >
              <p className="font-medium">{info.getValue<string>()}</p>
              <p className="text-xs text-muted-foreground">
                {info.row.original.codigoProducto}
                {esServicio && (
                  <span className="ml-2 text-blue-600">(Servicio)</span>
                )}
              </p>
            </div>
          );
        },
        size: 220,
      },
      {
        accessorKey: 'cantidad',
        header: ({ column }) => (
          <DataGridColumnHeader title="Cantidad" column={column} />
        ),
        cell: (info) => {
          const cantidad = info.getValue<number>();
          const tipo = info.row.original.tipo;
          return (
            <span
              className={`font-medium ${tipo === 'entrada' ? 'text-green-600' : 'text-red-500'}`}
            >
              {tipo === 'entrada' ? '+' : '-'}
              {cantidad.toLocaleString('es-MX')}
            </span>
          );
        },
        size: 100,
      },
      {
        accessorKey: 'saldoFinal',
        header: ({ column }) => (
          <DataGridColumnHeader title="Saldo Final" column={column} />
        ),
        cell: (info) => {
          const saldo = info.getValue<number>();
          const esServicio = info.row.original.esServicio;
          return esServicio ? (
            <span className="text-muted-foreground">N/A</span>
          ) : (
            <span className="font-medium">{saldo.toLocaleString('es-MX')}</span>
          );
        },
        size: 100,
      },
      {
        accessorKey: 'lote',
        header: ({ column }) => (
          <DataGridColumnHeader title="Lote" column={column} />
        ),
        cell: (info) => {
          const lote = info.getValue<string>();
          return lote === 'N/A' ? (
            <span className="text-muted-foreground">N/A</span>
          ) : (
            <span className="text-sm">{lote}</span>
          );
        },
        size: 120,
      },
      {
        accessorKey: 'referencia',
        header: ({ column }) => (
          <DataGridColumnHeader title="Referencia" column={column} />
        ),
        cell: (info) => {
          const ref = info.getValue<string>();
          const tipoRef = info.row.original.tipoReferencia;
          const colores: Record<string, string> = {
            compra: 'text-blue-600',
            venta: 'text-green-600',
            ajuste: 'text-amber-600',
            transferencia: 'text-purple-600',
          };
          const etiquetas: Record<string, string> = {
            compra: 'Compra',
            venta: 'Venta',
            ajuste: 'Ajuste',
            transferencia: 'Transferencia',
          };
          return (
            <div>
              <p className={`font-medium ${colores[tipoRef]}`}>{ref}</p>
              <p className="text-xs text-muted-foreground">
                {etiquetas[tipoRef]}
              </p>
            </div>
          );
        },
        size: 140,
      },
      {
        accessorKey: 'usuario',
        header: ({ column }) => (
          <DataGridColumnHeader title="Usuario" column={column} />
        ),
        cell: (info) => (
          <div className="flex items-center gap-2">
            <User className="size-4 text-muted-foreground" />
            <span className="text-sm">{info.getValue<string>()}</span>
          </div>
        ),
        size: 140,
      },
    ],
    [instalacionActiva],
  );

  const table = useReactTable({
    data: datosFiltrados,
    columns,
    state: { pagination, sorting },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  // Protección de ruta
  if (!instalacionActiva) {
    return <Navigate to="/tienda-inventario/selector-instalacion" replace />;
  }

  return (
    <div className="container-fluid">
      <div className="grid gap-5 lg:gap-7.5">
        {/* Encabezado */}
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <ClipboardList className="size-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">
                    Kardex de Movimientos: {instalacionActiva.nombre}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Historial de entradas y salidas de inventario
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
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Estadísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="py-4 text-center">
              <p className="text-2xl font-bold">
                {estadisticas.totalMovimientos}
              </p>
              <p className="text-xs text-muted-foreground">Total Movimientos</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <ArrowDownCircle className="size-5 text-green-600" />
                <p className="text-2xl font-bold text-green-600">
                  {estadisticas.totalEntradas.toLocaleString('es-MX')}
                </p>
              </div>
              <p className="text-xs text-muted-foreground">Unidades Entrada</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <ArrowUpCircle className="size-5 text-red-500" />
                <p className="text-2xl font-bold text-red-500">
                  {estadisticas.totalSalidas.toLocaleString('es-MX')}
                </p>
              </div>
              <p className="text-xs text-muted-foreground">Unidades Salida</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4 text-center">
              <p className="text-2xl font-bold text-blue-600">
                {estadisticas.totalServicios}
              </p>
              <p className="text-xs text-muted-foreground">
                Servicios Registrados
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabla de Kardex */}
        <DataGrid table={table} recordCount={datosFiltrados.length}>
          <Card>
            <CardHeader>
              <CardHeading>
                <CardTitle>Historial de Movimientos</CardTitle>
              </CardHeading>
              <CardToolbar>
                <div className="flex items-center gap-3 flex-wrap">
                  {/* Búsqueda */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar producto..."
                      value={busqueda}
                      onChange={(e) => setBusqueda(e.target.value)}
                      className="pl-9 w-[180px]"
                    />
                  </div>

                  {/* Filtro de Tipo */}
                  <Select value={tipoFiltro} onValueChange={setTipoFiltro}>
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      <SelectItem value="entrada">Entradas</SelectItem>
                      <SelectItem value="salida">Salidas</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Fecha Desde */}
                  <div className="flex items-center gap-2">
                    <Calendar className="size-4 text-muted-foreground" />
                    <Input
                      type="date"
                      value={fechaDesde}
                      onChange={(e) => setFechaDesde(e.target.value)}
                      className="w-[150px]"
                      placeholder="Desde"
                    />
                  </div>

                  {/* Fecha Hasta */}
                  <Input
                    type="date"
                    value={fechaHasta}
                    onChange={(e) => setFechaHasta(e.target.value)}
                    className="w-[150px]"
                    placeholder="Hasta"
                  />

                  {/* Botón Limpiar */}
                  {(busqueda || tipoFiltro || fechaDesde || fechaHasta) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setBusqueda('');
                        setTipoFiltro('');
                        setFechaDesde('');
                        setFechaHasta('');
                      }}
                    >
                      Limpiar
                    </Button>
                  )}
                </div>
              </CardToolbar>
            </CardHeader>
            <CardTable>
              <ScrollArea>
                <DataGridTable />
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </CardTable>
            <CardFooter>
              <DataGridPagination />
            </CardFooter>
          </Card>
        </DataGrid>

        {/* Leyenda para Oficinas */}
        {instalacionActiva.tipo === 'oficinas' && (
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-50 border border-blue-200 rounded"></div>
              <span>Servicios y consumibles resaltados</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
