'use client';

import { useMemo, useState } from 'react';
import { addDays, format, isBefore, isWithinInterval } from 'date-fns';
import { es } from 'date-fns/locale';
import { AlertTriangle, Calendar as CalendarIcon, FileText, X } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardHeading,
  CardTitle,
} from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// ============ CALENDARIO #1: SELECTOR DE RANGO PARA REPORTES ============
function SelectorRangoReportes() {
  const hoy = new Date();
  const [rangoFechas, setRangoFechas] = useState<DateRange | undefined>({
    from: addDays(hoy, -30),
    to: hoy,
  });
  const [rangoTemporal, setRangoTemporal] = useState<DateRange | undefined>(rangoFechas);
  const [abierto, setAbierto] = useState(false);
  const [tipoReporte, setTipoReporte] = useState('ventas');

  const rangosPreconfigurados = [
    { id: 'hoy', label: 'Hoy', desde: hoy, hasta: hoy },
    { id: 'ayer', label: 'Ayer', desde: addDays(hoy, -1), hasta: addDays(hoy, -1) },
    { id: 'semana', label: 'Últimos 7 días', desde: addDays(hoy, -7), hasta: hoy },
    { id: 'quincena', label: 'Últimos 15 días', desde: addDays(hoy, -15), hasta: hoy },
    { id: 'mes', label: 'Últimos 30 días', desde: addDays(hoy, -30), hasta: hoy },
    { id: 'trimestre', label: 'Últimos 90 días', desde: addDays(hoy, -90), hasta: hoy },
  ];

  const aplicarRangoPreconfigurado = (desde: Date, hasta: Date) => {
    setRangoTemporal({ from: desde, to: hasta });
  };

  const aplicarRango = () => {
    setRangoFechas(rangoTemporal);
    setAbierto(false);
  };

  const cancelar = () => {
    setRangoTemporal(rangoFechas);
    setAbierto(false);
  };

  const formatearRango = (rango: DateRange | undefined): string => {
    if (!rango?.from) return 'Seleccionar fechas';
    if (!rango.to) return format(rango.from, "d 'de' MMMM, yyyy", { locale: es });
    return `${format(rango.from, "d MMM", { locale: es })} - ${format(rango.to, "d MMM, yyyy", { locale: es })}`;
  };

  const diasSeleccionados = useMemo(() => {
    if (!rangoFechas?.from || !rangoFechas?.to) return 0;
    return Math.ceil(
      (rangoFechas.to.getTime() - rangoFechas.from.getTime()) / (1000 * 60 * 60 * 24)
    ) + 1;
  }, [rangoFechas]);

  return (
    <Card>
      <CardHeader>
        <CardHeading>
          <CardTitle>Calendario #1 - Selector de Rango para Reportes</CardTitle>
          <CardDescription>
            Seleccione un rango de fechas para generar reportes con rangos preconfigurados
          </CardDescription>
        </CardHeading>
        <Badge variant="primary" appearance="light">Reportes</Badge>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          {/* Tipo de Reporte */}
          <div className="space-y-2">
            <Label>Tipo de Reporte</Label>
            <Select value={tipoReporte} onValueChange={setTipoReporte}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ventas">Reporte de Ventas</SelectItem>
                <SelectItem value="compras">Reporte de Compras</SelectItem>
                <SelectItem value="inventario">Movimientos de Inventario</SelectItem>
                <SelectItem value="cuentas">Estado de Cuentas</SelectItem>
                <SelectItem value="cartera">Cartera de Clientes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Selector de Rango */}
          <div className="space-y-2">
            <Label>Período del Reporte</Label>
            <Popover open={abierto} onOpenChange={setAbierto}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  mode="input"
                  className="w-full justify-start"
                >
                  <CalendarIcon className="size-4 text-muted-foreground" />
                  {formatearRango(rangoFechas)}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start" side="bottom">
                <div className="flex">
                  {/* Panel de Rangos Preconfigurados */}
                  <div className="border-r p-3 space-y-1">
                    <p className="text-xs font-medium text-muted-foreground mb-2 px-2">
                      Rangos Rápidos
                    </p>
                    {rangosPreconfigurados.map((rango) => (
                      <Button
                        key={rango.id}
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => aplicarRangoPreconfigurado(rango.desde, rango.hasta)}
                      >
                        {rango.label}
                      </Button>
                    ))}
                  </div>

                  {/* Calendario */}
                  <div>
                    <Calendar
                      autoFocus
                      mode="range"
                      defaultMonth={rangoTemporal?.from}
                      selected={rangoTemporal}
                      onSelect={setRangoTemporal}
                      numberOfMonths={2}
                      locale={es}
                    />
                    <div className="flex items-center justify-between border-t p-3">
                      <Button variant="outline" onClick={cancelar}>
                        Cancelar
                      </Button>
                      <Button onClick={aplicarRango}>
                        Aplicar
                      </Button>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Resumen del Rango */}
        {rangoFechas?.from && rangoFechas?.to && (
          <div className="p-4 bg-muted/50 rounded-lg border">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-xs text-muted-foreground">Fecha Inicio</p>
                <p className="font-semibold">
                  {format(rangoFechas.from, "d 'de' MMMM", { locale: es })}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Fecha Fin</p>
                <p className="font-semibold">
                  {format(rangoFechas.to, "d 'de' MMMM", { locale: es })}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Días Incluidos</p>
                <p className="font-semibold">{diasSeleccionados} días</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Tipo de Reporte</p>
                <p className="font-semibold capitalize">{tipoReporte}</p>
              </div>
            </div>
          </div>
        )}

        {/* Botones de Acción */}
        <div className="flex justify-end gap-3">
          <Button variant="outline">
            <FileText className="size-4" />
            Vista Previa
          </Button>
          <Button variant="primary">
            Generar Reporte
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ============ CALENDARIO #2: PRÓXIMAS CADUCIDADES ============
interface ProductoCaducidad {
  id: string;
  nombre: string;
  lote: string;
  fechaCaducidad: Date;
  cantidad: number;
  ubicacion: string;
}

const productosCaducidad: ProductoCaducidad[] = [
  {
    id: '1',
    nombre: 'Sellador Acrílico Blanco',
    lote: 'LOT-2024-001',
    fechaCaducidad: addDays(new Date(), 5),
    cantidad: 25,
    ubicacion: 'A-01-03',
  },
  {
    id: '2',
    nombre: 'Adhesivo Epóxico Industrial',
    lote: 'LOT-2024-015',
    fechaCaducidad: addDays(new Date(), 8),
    cantidad: 12,
    ubicacion: 'B-02-01',
  },
  {
    id: '3',
    nombre: 'Pintura Esmalte Rojo',
    lote: 'LOT-2024-022',
    fechaCaducidad: addDays(new Date(), 15),
    cantidad: 8,
    ubicacion: 'C-01-05',
  },
  {
    id: '4',
    nombre: 'Barniz Marino Transparente',
    lote: 'LOT-2024-030',
    fechaCaducidad: addDays(new Date(), 22),
    cantidad: 15,
    ubicacion: 'A-03-02',
  },
  {
    id: '5',
    nombre: 'Impermeabilizante 3 Años',
    lote: 'LOT-2024-041',
    fechaCaducidad: addDays(new Date(), 30),
    cantidad: 42,
    ubicacion: 'D-01-01',
  },
  {
    id: '6',
    nombre: 'Resina Poliéster',
    lote: 'LOT-2024-052',
    fechaCaducidad: addDays(new Date(), 45),
    cantidad: 6,
    ubicacion: 'B-04-03',
  },
  {
    id: '7',
    nombre: 'Catalizador MEK',
    lote: 'LOT-2024-063',
    fechaCaducidad: addDays(new Date(), 60),
    cantidad: 18,
    ubicacion: 'E-02-01',
  },
  {
    id: '8',
    nombre: 'Masilla Automotriz',
    lote: 'LOT-2024-074',
    fechaCaducidad: addDays(new Date(), -3), // Ya vencido
    cantidad: 4,
    ubicacion: 'C-03-04',
  },
  {
    id: '9',
    nombre: 'Thinner Estándar 4L',
    lote: 'LOT-2024-085',
    fechaCaducidad: addDays(new Date(), 90),
    cantidad: 35,
    ubicacion: 'F-01-02',
  },
];

function CalendarioCaducidades() {
  const hoy = useMemo(() => new Date(), []);
  const [mesActual, setMesActual] = useState<Date>(hoy);
  const [filtro, setFiltro] = useState<'todos' | 'vencidos' | 'proximos' | 'seguros'>('todos');

  // Clasificar productos
  const productosClasificados = useMemo(() => {
    return productosCaducidad.map((producto) => {
      const diasRestantes = Math.ceil(
        (producto.fechaCaducidad.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24)
      );
      
      let estado: 'vencido' | 'critico' | 'proximo' | 'seguro';
      if (diasRestantes < 0) {
        estado = 'vencido';
      } else if (diasRestantes <= 7) {
        estado = 'critico';
      } else if (diasRestantes <= 30) {
        estado = 'proximo';
      } else {
        estado = 'seguro';
      }

      return { ...producto, diasRestantes, estado };
    });
  }, [hoy]);

  const productosFiltrados = useMemo(() => {
    switch (filtro) {
      case 'vencidos':
        return productosClasificados.filter((p) => p.estado === 'vencido');
      case 'proximos':
        return productosClasificados.filter((p) => 
          p.estado === 'critico' || p.estado === 'proximo'
        );
      case 'seguros':
        return productosClasificados.filter((p) => p.estado === 'seguro');
      default:
        return productosClasificados;
    }
  }, [productosClasificados, filtro]);

  // Fechas con caducidades para resaltar en el calendario
  const fechasCaducidad = useMemo(() => {
    return productosCaducidad.map((p) => p.fechaCaducidad);
  }, []);

  // Estadísticas
  const estadisticas = useMemo(() => {
    const vencidos = productosClasificados.filter((p) => p.estado === 'vencido').length;
    const criticos = productosClasificados.filter((p) => p.estado === 'critico').length;
    const proximos = productosClasificados.filter((p) => p.estado === 'proximo').length;
    const seguros = productosClasificados.filter((p) => p.estado === 'seguro').length;
    return { vencidos, criticos, proximos, seguros };
  }, [productosClasificados]);

  const obtenerVarianteBadge = (estado: string) => {
    switch (estado) {
      case 'vencido':
        return 'destructive' as const;
      case 'critico':
        return 'destructive' as const;
      case 'proximo':
        return 'warning' as const;
      default:
        return 'success' as const;
    }
  };

  const obtenerEtiquetaEstado = (estado: string) => {
    switch (estado) {
      case 'vencido':
        return 'Vencido';
      case 'critico':
        return 'Crítico';
      case 'proximo':
        return 'Próximo';
      default:
        return 'Seguro';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardHeading>
          <CardTitle>Calendario #2 - Próximas Caducidades</CardTitle>
          <CardDescription>
            Control de productos con fecha de caducidad próxima o vencida
          </CardDescription>
        </CardHeading>
        <Badge variant="warning" appearance="light">
          <AlertTriangle className="size-3" />
          {estadisticas.vencidos + estadisticas.criticos} alertas
        </Badge>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Estadísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div
            className={`p-4 rounded-lg border cursor-pointer transition-colors ${
              filtro === 'vencidos' ? 'bg-destructive/10 border-destructive' : 'bg-muted/50'
            }`}
            onClick={() => setFiltro(filtro === 'vencidos' ? 'todos' : 'vencidos')}
          >
            <p className="text-xs text-muted-foreground">Vencidos</p>
            <p className="text-2xl font-bold text-destructive">{estadisticas.vencidos}</p>
          </div>
          <div
            className={`p-4 rounded-lg border cursor-pointer transition-colors ${
              filtro === 'proximos' ? 'bg-amber-50 border-amber-500' : 'bg-muted/50'
            }`}
            onClick={() => setFiltro(filtro === 'proximos' ? 'todos' : 'proximos')}
          >
            <p className="text-xs text-muted-foreground">Por Vencer (30 días)</p>
            <p className="text-2xl font-bold text-amber-600">
              {estadisticas.criticos + estadisticas.proximos}
            </p>
          </div>
          <div
            className={`p-4 rounded-lg border cursor-pointer transition-colors ${
              filtro === 'seguros' ? 'bg-green-50 border-green-500' : 'bg-muted/50'
            }`}
            onClick={() => setFiltro(filtro === 'seguros' ? 'todos' : 'seguros')}
          >
            <p className="text-xs text-muted-foreground">Vigentes (+30 días)</p>
            <p className="text-2xl font-bold text-green-600">{estadisticas.seguros}</p>
          </div>
          <div
            className={`p-4 rounded-lg border cursor-pointer transition-colors ${
              filtro === 'todos' ? 'bg-primary/10 border-primary' : 'bg-muted/50'
            }`}
            onClick={() => setFiltro('todos')}
          >
            <p className="text-xs text-muted-foreground">Total Productos</p>
            <p className="text-2xl font-bold">{productosCaducidad.length}</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Calendario */}
          <div className="border rounded-lg p-4">
            <h4 className="font-semibold mb-4">Vista de Calendario</h4>
            <Calendar
              mode="multiple"
              month={mesActual}
              onMonthChange={setMesActual}
              selected={fechasCaducidad}
              locale={es}
              className="w-full"
              modifiers={{
                vencido: (date) => isBefore(date, hoy),
                critico: (date) => 
                  isWithinInterval(date, { start: hoy, end: addDays(hoy, 7) }),
                proximo: (date) => 
                  isWithinInterval(date, { start: addDays(hoy, 8), end: addDays(hoy, 30) }),
              }}
              modifiersClassNames={{
                vencido: 'bg-destructive/20 text-destructive font-bold',
                critico: 'bg-amber-200 text-amber-800 font-bold',
                proximo: 'bg-amber-100 text-amber-700',
              }}
            />
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
              <div className="flex items-center gap-1.5">
                <div className="size-3 rounded bg-destructive/30" />
                <span className="text-xs text-muted-foreground">Vencido</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="size-3 rounded bg-amber-200" />
                <span className="text-xs text-muted-foreground">Crítico (7 días)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="size-3 rounded bg-amber-100" />
                <span className="text-xs text-muted-foreground">Próximo (30 días)</span>
              </div>
            </div>
          </div>

          {/* Lista de Productos */}
          <div className="border rounded-lg">
            <div className="p-4 border-b flex items-center justify-between">
              <h4 className="font-semibold">
                Productos {filtro !== 'todos' && `(${obtenerEtiquetaEstado(filtro === 'vencidos' ? 'vencido' : filtro === 'proximos' ? 'proximo' : 'seguro')})`}
              </h4>
              {filtro !== 'todos' && (
                <Button variant="ghost" size="sm" onClick={() => setFiltro('todos')}>
                  <X className="size-4" /> Limpiar filtro
                </Button>
              )}
            </div>
            <div className="divide-y max-h-[400px] overflow-y-auto">
              {productosFiltrados.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  No hay productos en esta categoría
                </div>
              ) : (
                productosFiltrados.map((producto) => (
                  <div
                    key={producto.id}
                    className="p-4 flex items-center justify-between hover:bg-muted/50"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{producto.nombre}</p>
                        <Badge
                          variant={obtenerVarianteBadge(producto.estado)}
                          size="sm"
                          appearance="light"
                        >
                          {obtenerEtiquetaEstado(producto.estado)}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Lote: {producto.lote} • Ubicación: {producto.ubicacion}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        {format(producto.fechaCaducidad, "d MMM, yyyy", { locale: es })}
                      </p>
                      <p className={`text-xs ${
                        producto.diasRestantes < 0 
                          ? 'text-destructive' 
                          : producto.diasRestantes <= 7 
                            ? 'text-amber-600' 
                            : 'text-muted-foreground'
                      }`}>
                        {producto.diasRestantes < 0
                          ? `Vencido hace ${Math.abs(producto.diasRestantes)} días`
                          : producto.diasRestantes === 0
                            ? 'Vence hoy'
                            : `Vence en ${producto.diasRestantes} días`}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="text-sm text-muted-foreground">
          Última actualización: {format(hoy, "d 'de' MMMM, yyyy 'a las' HH:mm", { locale: es })}
        </p>
        <div className="flex gap-2">
          <Button variant="outline">Exportar Lista</Button>
          <Button variant="primary">Gestionar Alertas</Button>
        </div>
      </CardFooter>
    </Card>
  );
}

// ============ PÁGINA PRINCIPAL ============
export function CalendariosFechasPage() {
  return (
    <div className="container-fluid">
      <div className="grid gap-5 lg:gap-7.5">
        {/* Descripción */}
        <Card>
          <CardContent className="py-4">
            <h2 className="text-xl font-semibold mb-2">
              Módulo de Calendarios y Fechas
            </h2>
            <p className="text-muted-foreground">
              Esta sección contiene componentes de calendario para selección de rangos de fechas
              en reportes y visualización de próximas caducidades de productos.
            </p>
          </CardContent>
        </Card>

        {/* Calendario #1: Rango para Reportes */}
        <SelectorRangoReportes />

        {/* Calendario #2: Próximas Caducidades */}
        <CalendarioCaducidades />
      </div>
    </div>
  );
}
