'use client';

import { useMemo } from 'react';
import {
  AlertCircle,
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  CheckCircle,
  Clock,
  DollarSign,
  Package,
  ShoppingCart,
  TrendingUp,
} from 'lucide-react';
import { useInstalacionActivaObligatoria } from '../../context/ContextoInstalacion';
import { Alert, AlertDescription, AlertIcon, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

// ============ TIPOS ============
interface ProductoCritico {
  id: string;
  codigo: string;
  nombre: string;
  stockActual: number;
  stockMinimo: number;
  porcentaje: number;
}

interface OrdenPendiente {
  id: string;
  folio: string;
  proveedor: string;
  monto: number;
  fechaSolicitud: string;
}

interface VentaMensual {
  mes: string;
  total: number;
  cantidad: number;
}

// ============ DATOS FICTICIOS POR TIPO DE INSTALACIÓN ============
const stockCriticoAlmacen: ProductoCritico[] = [
  { id: 'p1', codigo: 'REF-003', nombre: 'Sprite 600ml', stockActual: 150, stockMinimo: 300, porcentaje: 50 },
  { id: 'p2', codigo: 'SNK-003', nombre: 'Cheetos Flamin Hot 52g', stockActual: 50, stockMinimo: 150, porcentaje: 33 },
  { id: 'p3', codigo: 'REF-004', nombre: 'Fanta Naranja 600ml', stockActual: 0, stockMinimo: 200, porcentaje: 0 },
];

const stockCriticoOficinas: ProductoCritico[] = [
  { id: 'p4', codigo: 'PAP-003', nombre: 'Lápices #2 (12)', stockActual: 8, stockMinimo: 15, porcentaje: 53 },
  { id: 'p5', codigo: 'CON-002', nombre: 'Cartucho Canon PG-245', stockActual: 3, stockMinimo: 5, porcentaje: 60 },
  { id: 'p6', codigo: 'PAP-005', nombre: 'Clips Jumbo (100)', stockActual: 0, stockMinimo: 5, porcentaje: 0 },
];

const ordenesPendientesAutorizar: OrdenPendiente[] = [
  { id: 'oc-001', folio: 'OC-2024-0015', proveedor: 'Bebidas del Golfo', monto: 45000.00, fechaSolicitud: '2024-01-10' },
  { id: 'oc-002', folio: 'OC-2024-0016', proveedor: 'Papelería Omega', monto: 8500.00, fechaSolicitud: '2024-01-11' },
  { id: 'oc-003', folio: 'OC-2024-0017', proveedor: 'Snacks del Pacífico', monto: 32000.00, fechaSolicitud: '2024-01-12' },
];

const ventasDelMes: VentaMensual = {
  mes: 'Enero 2024',
  total: 285750.00,
  cantidad: 4250,
};

const comparativaMesAnterior = {
  porcentajeCambio: 12.5,
  tendencia: 'up' as const,
};

// ============ COMPONENTE PRINCIPAL ============
export function DashboardPage() {
  const instalacionActiva = useInstalacionActivaObligatoria();

  // Datos según tipo de instalación
  const stockCritico = useMemo(() => {
    return instalacionActiva.tipo === 'almacen' ? stockCriticoAlmacen : stockCriticoOficinas;
  }, [instalacionActiva]);

  // Conteo de productos agotados
  const productosAgotados = useMemo(() => {
    return stockCritico.filter((p) => p.stockActual === 0).length;
  }, [stockCritico]);

  // Total de OCs pendientes
  const totalOCsPendientes = ordenesPendientesAutorizar.length;
  const montoTotalPendiente = ordenesPendientesAutorizar.reduce((sum, oc) => sum + oc.monto, 0);

  return (
    <div className="container-fluid">
      <div className="grid gap-5 lg:gap-7.5">
        {/* Encabezado */}
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <TrendingUp className="size-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Tablero de Indicadores (Dashboard)</h2>
                  <p className="text-sm text-muted-foreground">
                    Centro de control: {instalacionActiva.nombre}
                  </p>
                </div>
              </div>
              <Badge variant="primary" appearance="light" size="lg">
                {instalacionActiva.empresa} - {instalacionActiva.ubicacion}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Alertas Críticas */}
        {productosAgotados > 0 && (
          <Alert variant="destructive">
            <AlertIcon>
              <AlertTriangle className="size-4" />
            </AlertIcon>
            <AlertTitle>¡Atención! Productos Agotados</AlertTitle>
            <AlertDescription>
              Hay {productosAgotados} producto(s) con stock en cero. Revise el inventario y genere órdenes de compra urgentes.
            </AlertDescription>
          </Alert>
        )}

        {/* Tarjetas de Indicadores Principales */}
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">
          {/* Ventas del Mes */}
          <Card>
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Ventas del Mes</p>
                  <p className="text-2xl font-bold mt-1">
                    ${ventasDelMes.total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{ventasDelMes.mes}</p>
                </div>
                <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                  <DollarSign className="size-5" />
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4">
                {comparativaMesAnterior.tendencia === 'up' ? (
                  <ArrowUp className="size-4 text-green-600" />
                ) : (
                  <ArrowDown className="size-4 text-red-600" />
                )}
                <span className={`text-sm font-medium ${comparativaMesAnterior.tendencia === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {comparativaMesAnterior.porcentajeCambio}%
                </span>
                <span className="text-xs text-muted-foreground">vs mes anterior</span>
              </div>
            </CardContent>
          </Card>

          {/* Cantidad de Transacciones */}
          <Card>
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Transacciones</p>
                  <p className="text-2xl font-bold mt-1">
                    {ventasDelMes.cantidad.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Ventas registradas</p>
                </div>
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                  <ShoppingCart className="size-5" />
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <span className="text-xs text-muted-foreground">
                  Promedio: ${(ventasDelMes.total / ventasDelMes.cantidad).toFixed(2)} por venta
                </span>
              </div>
            </CardContent>
          </Card>

          {/* OCs Pendientes de Autorizar */}
          <Card className={totalOCsPendientes > 0 ? 'border-amber-200 bg-amber-50/50' : ''}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">OCs por Autorizar</p>
                  <p className="text-2xl font-bold mt-1">{totalOCsPendientes}</p>
                  <p className="text-xs text-muted-foreground mt-1">Pendientes de aprobación</p>
                </div>
                <div className={`p-2 rounded-lg ${totalOCsPendientes > 0 ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-600'}`}>
                  <Clock className="size-5" />
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <span className="text-xs text-muted-foreground">
                  Monto total: ${montoTotalPendiente.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Stock Crítico */}
          <Card className={stockCritico.length > 0 ? 'border-red-200 bg-red-50/50' : ''}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Stock Crítico</p>
                  <p className="text-2xl font-bold mt-1">{stockCritico.length}</p>
                  <p className="text-xs text-muted-foreground mt-1">Productos bajo mínimo</p>
                </div>
                <div className={`p-2 rounded-lg ${stockCritico.length > 0 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                  {stockCritico.length > 0 ? (
                    <AlertCircle className="size-5" />
                  ) : (
                    <CheckCircle className="size-5" />
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4">
                {productosAgotados > 0 ? (
                  <Badge variant="destructive" size="sm">{productosAgotados} agotado(s)</Badge>
                ) : (
                  <span className="text-xs text-muted-foreground">Sin productos agotados</span>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Secciones de Detalle */}
        <div className="grid lg:grid-cols-2 gap-5">
          {/* Stock Crítico - Detalle */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="size-5 text-red-500" />
                Productos con Stock Crítico
              </CardTitle>
              <CardDescription>
                Productos por debajo del nivel mínimo de reorden
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {stockCritico.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                  <CheckCircle className="size-12 mb-4 text-green-500" />
                  <p>Todos los productos están por encima del stock mínimo</p>
                </div>
              ) : (
                stockCritico.map((producto) => (
                  <div key={producto.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-muted-foreground">{producto.codigo}</span>
                        <span className="text-sm font-medium">{producto.nombre}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">
                          {producto.stockActual} / {producto.stockMinimo}
                        </span>
                        {producto.stockActual === 0 ? (
                          <Badge variant="destructive" size="sm">Agotado</Badge>
                        ) : (
                          <Badge variant="warning" size="sm">Bajo</Badge>
                        )}
                      </div>
                    </div>
                    <Progress 
                      value={producto.porcentaje} 
                      className={`h-2 ${producto.stockActual === 0 ? '[&>div]:bg-red-500' : '[&>div]:bg-amber-500'}`}
                    />
                  </div>
                ))
              )}
              {stockCritico.length > 0 && (
                <Button variant="outline" className="w-full mt-4">
                  Ver todos los productos con stock bajo
                </Button>
              )}
            </CardContent>
          </Card>

          {/* OCs Pendientes - Detalle */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="size-5 text-amber-500" />
                Órdenes de Compra Pendientes
              </CardTitle>
              <CardDescription>
                OCs esperando autorización administrativa
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {ordenesPendientesAutorizar.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                  <CheckCircle className="size-12 mb-4 text-green-500" />
                  <p>No hay órdenes de compra pendientes de autorizar</p>
                </div>
              ) : (
                ordenesPendientesAutorizar.map((oc) => (
                  <div key={oc.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-mono font-medium">{oc.folio}</p>
                      <p className="text-sm text-muted-foreground">{oc.proveedor}</p>
                      <p className="text-xs text-muted-foreground">Solicitada: {oc.fechaSolicitud}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">
                        ${oc.monto.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                      </p>
                      <Badge variant="warning" appearance="light" size="sm">
                        Pendiente
                      </Badge>
                    </div>
                  </div>
                ))
              )}
              {ordenesPendientesAutorizar.length > 0 && (
                <Button variant="outline" className="w-full mt-4">
                  Ir a Aprobación de Compras
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Información adicional */}
        <Alert variant="mono">
          <AlertIcon>
            <AlertCircle className="size-4" />
          </AlertIcon>
          <AlertTitle>Información del Dashboard</AlertTitle>
          <AlertDescription>
            Este tablero muestra indicadores clave de la instalación actual. Los datos se actualizan 
            automáticamente con cada operación realizada en el sistema.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
