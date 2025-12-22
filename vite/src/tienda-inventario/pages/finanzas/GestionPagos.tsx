'use client';

import { useMemo, useState } from 'react';
import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import {
  AlertCircle,
  Banknote,
  CheckCircle,
  CreditCard,
  DollarSign,
  Search,
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
  CardToolbar,
} from '@/components/ui/card';
import { DataGrid } from '@/components/ui/data-grid';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { DataGridPagination } from '@/components/ui/data-grid-pagination';
import { DataGridTable } from '@/components/ui/data-grid-table';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useContextoInstalacion } from '../../context/ContextoInstalacion';

// ============ TIPOS ============
interface Factura {
  id: string;
  numero: string;
  fecha: string;
  monto: number;
  saldoPendiente: number;
  diasVencido: number;
  rangoAntiguedad: '0-30' | '31-60' | '61-90' | '90+';
}

interface ClienteConSaldo {
  id: string;
  nombre: string;
  rfc: string;
  saldoTotal: number;
  facturasPendientes: Factura[];
}

// ============ DATOS FICTICIOS - CLIENTES CON SALDOS ============
const clientesConSaldosFicticios: ClienteConSaldo[] = [
  {
    id: 'cli-001',
    nombre: 'Comercializadora del Norte SA de CV',
    rfc: 'CNO920815AB0',
    saldoTotal: 28500.0,
    facturasPendientes: [
      {
        id: 'fac-001',
        numero: 'FAC-2024-0125',
        fecha: '2024-10-15',
        monto: 12000.0,
        saldoPendiente: 12000.0,
        diasVencido: 67,
        rangoAntiguedad: '61-90',
      },
      {
        id: 'fac-002',
        numero: 'FAC-2024-0156',
        fecha: '2024-11-10',
        monto: 8500.0,
        saldoPendiente: 8500.0,
        diasVencido: 41,
        rangoAntiguedad: '31-60',
      },
      {
        id: 'fac-003',
        numero: 'FAC-2024-0189',
        fecha: '2024-12-05',
        monto: 8000.0,
        saldoPendiente: 8000.0,
        diasVencido: 16,
        rangoAntiguedad: '0-30',
      },
    ],
  },
  {
    id: 'cli-002',
    nombre: 'Distribuidora Regio Express',
    rfc: 'DRE881023CD5',
    saldoTotal: 15750.0,
    facturasPendientes: [
      {
        id: 'fac-004',
        numero: 'FAC-2024-0098',
        fecha: '2024-09-20',
        monto: 6500.0,
        saldoPendiente: 6500.0,
        diasVencido: 92,
        rangoAntiguedad: '90+',
      },
      {
        id: 'fac-005',
        numero: 'FAC-2024-0167',
        fecha: '2024-11-25',
        monto: 9250.0,
        saldoPendiente: 9250.0,
        diasVencido: 26,
        rangoAntiguedad: '0-30',
      },
    ],
  },
  {
    id: 'cli-004',
    nombre: 'Abarrotes La Esperanza',
    rfc: 'ALE870430JK7',
    saldoTotal: 4200.0,
    facturasPendientes: [
      {
        id: 'fac-006',
        numero: 'FAC-2024-0145',
        fecha: '2024-11-01',
        monto: 4200.0,
        saldoPendiente: 4200.0,
        diasVencido: 50,
        rangoAntiguedad: '31-60',
      },
    ],
  },
  {
    id: 'cli-006',
    nombre: 'Mayoristas del Pacífico',
    rfc: 'MDP900312NP4',
    saldoTotal: 35000.0,
    facturasPendientes: [
      {
        id: 'fac-007',
        numero: 'FAC-2024-0089',
        fecha: '2024-09-10',
        monto: 15000.0,
        saldoPendiente: 15000.0,
        diasVencido: 102,
        rangoAntiguedad: '90+',
      },
      {
        id: 'fac-008',
        numero: 'FAC-2024-0134',
        fecha: '2024-10-25',
        monto: 12000.0,
        saldoPendiente: 12000.0,
        diasVencido: 57,
        rangoAntiguedad: '31-60',
      },
      {
        id: 'fac-009',
        numero: 'FAC-2024-0178',
        fecha: '2024-12-01',
        monto: 8000.0,
        saldoPendiente: 8000.0,
        diasVencido: 20,
        rangoAntiguedad: '0-30',
      },
    ],
  },
  {
    id: 'cli-007',
    nombre: 'Cadena de Tiendas El Sol',
    rfc: 'CTS850628QR8',
    saldoTotal: 22300.0,
    facturasPendientes: [
      {
        id: 'fac-010',
        numero: 'FAC-2024-0112',
        fecha: '2024-10-05',
        monto: 10800.0,
        saldoPendiente: 10800.0,
        diasVencido: 77,
        rangoAntiguedad: '61-90',
      },
      {
        id: 'fac-011',
        numero: 'FAC-2024-0185',
        fecha: '2024-12-10',
        monto: 11500.0,
        saldoPendiente: 11500.0,
        diasVencido: 11,
        rangoAntiguedad: '0-30',
      },
    ],
  },
];

// ============ COMPONENTE PRINCIPAL ============
export function GestionPagosPage() {
  const { instalacionActiva } = useContextoInstalacion();
  const [clientes, setClientes] = useState<ClienteConSaldo[]>(
    clientesConSaldosFicticios,
  );
  const [busqueda, setBusqueda] = useState('');
  const [filtroAntiguedad, setFiltroAntiguedad] = useState<string>('');
  const [sorting, setSorting] = useState<SortingState>([]);

  // Modal de pago
  const [modalAbierto, setModalAbierto] = useState(false);
  const [clienteSeleccionado, setClienteSeleccionado] = useState<ClienteConSaldo | null>(
    null,
  );
  const [montoPago, setMontoPago] = useState<number>(0);
  const [mensajeExito, setMensajeExito] = useState<string>('');

  // Estadísticas por antigüedad
  const estadisticasAntiguedad = useMemo(() => {
    const stats = {
      '0-30': 0,
      '31-60': 0,
      '61-90': 0,
      '90+': 0,
    };
    clientes.forEach((cliente) => {
      cliente.facturasPendientes.forEach((factura) => {
        stats[factura.rangoAntiguedad] += factura.saldoPendiente;
      });
    });
    return stats;
  }, [clientes]);

  const totalPorCobrar = useMemo(() => {
    return clientes.reduce((sum, c) => sum + c.saldoTotal, 0);
  }, [clientes]);

  // Filtrar clientes
  const clientesFiltrados = useMemo(() => {
    let resultado = clientes.filter((c) => c.saldoTotal > 0);

    if (busqueda) {
      const termino = busqueda.toLowerCase();
      resultado = resultado.filter(
        (c) =>
          c.nombre.toLowerCase().includes(termino) ||
          c.rfc.toLowerCase().includes(termino),
      );
    }

    if (filtroAntiguedad && filtroAntiguedad !== 'todos') {
      resultado = resultado.filter((c) =>
        c.facturasPendientes.some((f) => f.rangoAntiguedad === filtroAntiguedad),
      );
    }

    return resultado;
  }, [clientes, busqueda, filtroAntiguedad]);

  // Abrir modal de pago
  const abrirModalPago = (cliente: ClienteConSaldo) => {
    setClienteSeleccionado(cliente);
    setMontoPago(0);
    setModalAbierto(true);
  };

  // Aplicar pago
  const aplicarPago = () => {
    if (!clienteSeleccionado || montoPago <= 0) return;

    let montoRestante = montoPago;

    // Ordenar facturas por antigüedad (más antiguas primero)
    const facturasOrdenadas = [...clienteSeleccionado.facturasPendientes].sort(
      (a, b) => b.diasVencido - a.diasVencido,
    );

    const facturasActualizadas: Factura[] = [];

    for (const factura of facturasOrdenadas) {
      if (montoRestante <= 0) {
        facturasActualizadas.push(factura);
        continue;
      }

      if (montoRestante >= factura.saldoPendiente) {
        montoRestante -= factura.saldoPendiente;
        // Factura pagada completamente, no se agrega
      } else {
        facturasActualizadas.push({
          ...factura,
          saldoPendiente: factura.saldoPendiente - montoRestante,
        });
        montoRestante = 0;
      }
    }

    const nuevoSaldoTotal = facturasActualizadas.reduce(
      (sum, f) => sum + f.saldoPendiente,
      0,
    );

    setClientes((prev) =>
      prev.map((c) =>
        c.id === clienteSeleccionado.id
          ? {
              ...c,
              saldoTotal: nuevoSaldoTotal,
              facturasPendientes: facturasActualizadas,
            }
          : c,
      ),
    );

    setMensajeExito(
      `Pago de $${montoPago.toFixed(2)} aplicado a ${clienteSeleccionado.nombre}. Se aplicó a las facturas más antiguas primero.`,
    );

    setModalAbierto(false);
    setClienteSeleccionado(null);
    setMontoPago(0);

    setTimeout(() => {
      setMensajeExito('');
    }, 5000);
  };

  // Columnas de la tabla
  const columns = useMemo<ColumnDef<ClienteConSaldo>[]>(
    () => [
      {
        accessorKey: 'nombre',
        header: ({ column }) => (
          <DataGridColumnHeader title="Cliente" column={column} />
        ),
        cell: (info) => (
          <div>
            <p className="font-medium">{info.getValue<string>()}</p>
            <p className="text-xs text-muted-foreground">
              {info.row.original.rfc}
            </p>
          </div>
        ),
        size: 280,
      },
      {
        accessorKey: 'saldoTotal',
        header: ({ column }) => (
          <DataGridColumnHeader title="Saldo Total" column={column} />
        ),
        cell: (info) => (
          <span className="font-bold text-lg">
            ${info.getValue<number>().toLocaleString('es-MX', {
              minimumFractionDigits: 2,
            })}
          </span>
        ),
        size: 150,
      },
      {
        id: 'facturas',
        header: 'Facturas',
        cell: (info) => {
          const facturas = info.row.original.facturasPendientes;
          return (
            <Badge variant="outline">{facturas.length} pendiente(s)</Badge>
          );
        },
        size: 120,
      },
      {
        id: 'antiguedad',
        header: 'Antigüedad',
        cell: (info) => {
          const facturas = info.row.original.facturasPendientes;
          const maxDias = Math.max(...facturas.map((f) => f.diasVencido));

          let color = 'bg-green-500';
          if (maxDias > 90) color = 'bg-red-500';
          else if (maxDias > 60) color = 'bg-orange-500';
          else if (maxDias > 30) color = 'bg-yellow-500';

          return (
            <div className="flex items-center gap-2">
              <div className={`size-3 rounded-full ${color}`} />
              <span>Hasta {maxDias} días</span>
            </div>
          );
        },
        size: 140,
      },
      {
        id: 'desglose',
        header: 'Desglose por Antigüedad',
        cell: (info) => {
          const facturas = info.row.original.facturasPendientes;
          const desglose = {
            '0-30': 0,
            '31-60': 0,
            '61-90': 0,
            '90+': 0,
          };
          facturas.forEach((f) => {
            desglose[f.rangoAntiguedad] += f.saldoPendiente;
          });

          return (
            <div className="flex gap-1 flex-wrap">
              {desglose['0-30'] > 0 && (
                <Badge variant="success" appearance="light" size="sm">
                  0-30: ${desglose['0-30'].toLocaleString()}
                </Badge>
              )}
              {desglose['31-60'] > 0 && (
                <Badge variant="warning" appearance="light" size="sm">
                  31-60: ${desglose['31-60'].toLocaleString()}
                </Badge>
              )}
              {desglose['61-90'] > 0 && (
                <Badge variant="destructive" appearance="light" size="sm">
                  61-90: ${desglose['61-90'].toLocaleString()}
                </Badge>
              )}
              {desglose['90+'] > 0 && (
                <Badge variant="destructive" size="sm">
                  90+: ${desglose['90+'].toLocaleString()}
                </Badge>
              )}
            </div>
          );
        },
        size: 300,
      },
      {
        id: 'acciones',
        header: 'Acciones',
        cell: (info) => (
          <Button
            size="sm"
            onClick={() => abrirModalPago(info.row.original)}
          >
            <Banknote className="size-4 me-1" />
            Registrar Pago
          </Button>
        ),
        size: 150,
      },
    ],
    [],
  );

  const table = useReactTable({
    data: clientesFiltrados,
    columns,
    state: { sorting },
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
                  <CreditCard className="size-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Gestión de Pagos</h2>
                  <p className="text-sm text-muted-foreground">
                    Administrar cuentas por cobrar y aplicar pagos
                  </p>
                </div>
              </div>
              <Badge
                variant={instalacionActiva.tipo === 'almacen' ? 'success' : 'primary'}
                appearance="light"
                size="lg"
              >
                {instalacionActiva.nombre}
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
            <AlertTitle>¡Pago aplicado!</AlertTitle>
            <AlertDescription>{mensajeExito}</AlertDescription>
          </Alert>
        )}

        {/* Resumen de antigüedad */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="py-4 text-center">
              <div className="flex items-center justify-center gap-2 text-primary">
                <DollarSign className="size-5" />
                <p className="text-2xl font-bold">
                  ${totalPorCobrar.toLocaleString('es-MX')}
                </p>
              </div>
              <p className="text-xs text-muted-foreground">Total Por Cobrar</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4 text-center">
              <p className="text-2xl font-bold text-green-600">
                ${estadisticasAntiguedad['0-30'].toLocaleString('es-MX')}
              </p>
              <p className="text-xs text-muted-foreground">0-30 días</p>
              <Progress
                value={
                  totalPorCobrar > 0
                    ? (estadisticasAntiguedad['0-30'] / totalPorCobrar) * 100
                    : 0
                }
                className="h-1 mt-2"
              />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4 text-center">
              <p className="text-2xl font-bold text-yellow-600">
                ${estadisticasAntiguedad['31-60'].toLocaleString('es-MX')}
              </p>
              <p className="text-xs text-muted-foreground">31-60 días</p>
              <Progress
                value={
                  totalPorCobrar > 0
                    ? (estadisticasAntiguedad['31-60'] / totalPorCobrar) * 100
                    : 0
                }
                className="h-1 mt-2"
              />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4 text-center">
              <p className="text-2xl font-bold text-orange-600">
                ${estadisticasAntiguedad['61-90'].toLocaleString('es-MX')}
              </p>
              <p className="text-xs text-muted-foreground">61-90 días</p>
              <Progress
                value={
                  totalPorCobrar > 0
                    ? (estadisticasAntiguedad['61-90'] / totalPorCobrar) * 100
                    : 0
                }
                className="h-1 mt-2"
              />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4 text-center">
              <p className="text-2xl font-bold text-red-600">
                ${estadisticasAntiguedad['90+'].toLocaleString('es-MX')}
              </p>
              <p className="text-xs text-muted-foreground">+90 días</p>
              <Progress
                value={
                  totalPorCobrar > 0
                    ? (estadisticasAntiguedad['90+'] / totalPorCobrar) * 100
                    : 0
                }
                className="h-1 mt-2"
              />
            </CardContent>
          </Card>
        </div>

        {/* Alerta de facturas vencidas */}
        {estadisticasAntiguedad['90+'] > 0 && (
          <Alert variant="destructive">
            <AlertIcon>
              <AlertCircle className="size-4" />
            </AlertIcon>
            <AlertTitle>¡Atención! Facturas con más de 90 días</AlertTitle>
            <AlertDescription>
              Existen ${estadisticasAntiguedad['90+'].toLocaleString('es-MX')} en
              facturas con más de 90 días de antigüedad. Se recomienda dar
              seguimiento urgente.
            </AlertDescription>
          </Alert>
        )}

        {/* Tabla de Clientes */}
        <DataGrid table={table} recordCount={clientesFiltrados.length}>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="size-5" />
                    Clientes con Saldos Pendientes
                  </CardTitle>
                  <CardDescription>
                    {clientesFiltrados.length} cliente(s) con saldo pendiente
                  </CardDescription>
                </div>
                <CardToolbar>
                  <div className="flex items-center gap-3 flex-wrap">
                    {/* Búsqueda */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <Input
                        placeholder="Buscar cliente..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        className="pl-9 w-[200px]"
                      />
                    </div>

                    {/* Filtro de antigüedad */}
                    <Select
                      value={filtroAntiguedad}
                      onValueChange={setFiltroAntiguedad}
                    >
                      <SelectTrigger className="w-[160px]">
                        <SelectValue placeholder="Antigüedad" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todos">Todos</SelectItem>
                        <SelectItem value="0-30">0-30 días</SelectItem>
                        <SelectItem value="31-60">31-60 días</SelectItem>
                        <SelectItem value="61-90">61-90 días</SelectItem>
                        <SelectItem value="90+">+90 días</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardToolbar>
              </div>
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

        {/* Modal de Pago */}
        <Dialog open={modalAbierto} onOpenChange={setModalAbierto}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Banknote className="size-5" />
                Registrar Pago
              </DialogTitle>
              <DialogDescription>
                El pago se aplicará a las facturas más antiguas primero.
              </DialogDescription>
            </DialogHeader>
            <DialogBody>
              {clienteSeleccionado && (
                <div className="space-y-4">
                  {/* Info del cliente */}
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="font-medium">{clienteSeleccionado.nombre}</p>
                    <p className="text-sm text-muted-foreground">
                      RFC: {clienteSeleccionado.rfc}
                    </p>
                  </div>

                  {/* Saldo actual */}
                  <div className="flex justify-between items-center p-3 bg-primary/10 rounded-lg">
                    <span>Saldo Pendiente:</span>
                    <span className="text-xl font-bold">
                      ${clienteSeleccionado.saldoTotal.toLocaleString('es-MX', {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>

                  {/* Detalle de facturas */}
                  <div className="space-y-2">
                    <Label>Facturas (ordenadas por antigüedad):</Label>
                    <div className="max-h-[200px] overflow-y-auto space-y-2">
                      {[...clienteSeleccionado.facturasPendientes]
                        .sort((a, b) => b.diasVencido - a.diasVencido)
                        .map((factura) => (
                          <div
                            key={factura.id}
                            className="flex justify-between items-center p-2 bg-muted/30 rounded text-sm"
                          >
                            <div>
                              <span className="font-mono">{factura.numero}</span>
                              <span className="text-muted-foreground ms-2">
                                ({factura.diasVencido} días)
                              </span>
                            </div>
                            <span className="font-medium">
                              ${factura.saldoPendiente.toLocaleString('es-MX', {
                                minimumFractionDigits: 2,
                              })}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Monto del pago */}
                  <div className="space-y-2">
                    <Label htmlFor="monto-pago">Monto a Aplicar *</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <Input
                        id="monto-pago"
                        type="number"
                        min={0.01}
                        step={0.01}
                        max={clienteSeleccionado.saldoTotal}
                        value={montoPago}
                        onChange={(e) =>
                          setMontoPago(parseFloat(e.target.value) || 0)
                        }
                        className="pl-9"
                        placeholder="0.00"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setMontoPago(clienteSeleccionado.saldoTotal)
                        }
                      >
                        Pago Total
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setMontoPago(
                            clienteSeleccionado.saldoTotal * 0.5,
                          )
                        }
                      >
                        50%
                      </Button>
                    </div>
                  </div>

                  {/* Saldo resultante */}
                  {montoPago > 0 && (
                    <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-900">
                      <span>Saldo Después del Pago:</span>
                      <span className="text-xl font-bold text-green-600">
                        $
                        {(
                          clienteSeleccionado.saldoTotal - montoPago
                        ).toLocaleString('es-MX', {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </DialogBody>
            <DialogFooter>
              <Button variant="outline" onClick={() => setModalAbierto(false)}>
                Cancelar
              </Button>
              <Button
                onClick={aplicarPago}
                disabled={
                  montoPago <= 0 ||
                  (clienteSeleccionado && montoPago > clienteSeleccionado.saldoTotal)
                }
              >
                <CheckCircle className="size-4 me-2" />
                Aplicar Pago
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
