'use client';

import { useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  FileText,
  Package,
  PackageCheck,
  Search,
  Truck,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';
import { useInstalacionActivaObligatoria } from '../../context/ContextoInstalacion';
import { useOrdenesCompra } from '../../context/ContextoOrdenesCompra';

// ============ TIPOS ============
interface LineaRecepcion {
  articuloId: string;
  articuloNombre: string;
  cantidadOrdenada: number;
  costoUnitario: number;
  esInventariable: boolean;
  // Campos para inventariables
  cantidadRecibida: number;
  lote: string;
  fechaCaducidad: string;
  // Campos para servicios
  confirmado: boolean;
}

// ============ SCHEMA DE VALIDACIÓN ============
const recepcionSchema = z.object({
  numeroFactura: z.string().min(1, 'El número de factura es obligatorio'),
});

// ============ COMPONENTE PRINCIPAL ============
export function RecepcionMercanciaPage() {
  const instalacionActiva = useInstalacionActivaObligatoria();
  const { ordenes } = useOrdenesCompra();
  const [ordenSeleccionada, setOrdenSeleccionada] = useState<string>('');
  const [lineasRecepcion, setLineasRecepcion] = useState<LineaRecepcion[]>([]);

  const form = useForm<z.infer<typeof recepcionSchema>>({
    resolver: zodResolver(recepcionSchema),
    defaultValues: {
      numeroFactura: '',
    },
  });

  // Obtener órdenes aprobadas de la instalación activa
  const ordenesAprobadas = useMemo(() => {
    return ordenes.filter(
      (orden) =>
        orden.instalacionId === instalacionActiva.id &&
        orden.estatus === 'aprobada'
    );
  }, [ordenes, instalacionActiva]);

  // Datos ficticios que indican si un artículo es inventariable o servicio
  const articulosInventariables: Record<string, boolean> = useMemo(() => {
    return {
      // Almacén - Todos son inventariables
      'art-a01': true, // Coca-Cola
      'art-a02': true, // Pepsi
      'art-a03': true, // Sabritas
      'art-a04': true, // Doritos
      'art-a05': true, // Agua Ciel
      'art-a06': true, // Gatorade
      'art-a07': true, // Galletas
      'art-a08': true, // Cacahuates
      // Oficinas - Mixto
      'art-o01': true, // Hojas Blancas - Inventariable
      'art-o02': true, // Plumas - Inventariable
      'art-o03': true, // Toner - Inventariable
      'art-o04': true, // Folders - Inventariable
      'art-o05': true, // Post-it - Inventariable
      'art-o06': true, // Clips - Inventariable
      'art-o07': true, // Café - Inventariable
      'art-o08': true, // Azúcar - Inventariable
      // Servicios ficticios
      'serv-001': false, // Servicio de Internet
      'serv-002': false, // Mantenimiento de equipo
      'serv-003': false, // Limpieza de oficinas
    };
  }, []);

  // Manejar selección de orden
  const handleOrdenChange = (ordenId: string) => {
    setOrdenSeleccionada(ordenId);
    const orden = ordenesAprobadas.find((o) => o.id === ordenId);
    if (orden) {
      const lineas: LineaRecepcion[] = orden.lineas.map((linea) => ({
        articuloId: linea.articuloId,
        articuloNombre: linea.articuloNombre,
        cantidadOrdenada: linea.cantidad,
        costoUnitario: linea.costoUnitario,
        esInventariable: articulosInventariables[linea.articuloId] ?? true,
        cantidadRecibida: linea.cantidad,
        lote: '',
        fechaCaducidad: '',
        confirmado: false,
      }));
      setLineasRecepcion(lineas);
    } else {
      setLineasRecepcion([]);
    }
  };

  // Actualizar cantidad recibida
  const actualizarCantidadRecibida = (articuloId: string, cantidad: number) => {
    setLineasRecepcion((prev) =>
      prev.map((linea) =>
        linea.articuloId === articuloId
          ? { ...linea, cantidadRecibida: cantidad }
          : linea
      )
    );
  };

  // Actualizar lote
  const actualizarLote = (articuloId: string, lote: string) => {
    setLineasRecepcion((prev) =>
      prev.map((linea) =>
        linea.articuloId === articuloId ? { ...linea, lote } : linea
      )
    );
  };

  // Actualizar fecha de caducidad
  const actualizarFechaCaducidad = (articuloId: string, fecha: string) => {
    setLineasRecepcion((prev) =>
      prev.map((linea) =>
        linea.articuloId === articuloId
          ? { ...linea, fechaCaducidad: fecha }
          : linea
      )
    );
  };

  // Actualizar confirmación de servicio
  const actualizarConfirmacion = (articuloId: string, confirmado: boolean) => {
    setLineasRecepcion((prev) =>
      prev.map((linea) =>
        linea.articuloId === articuloId ? { ...linea, confirmado } : linea
      )
    );
  };

  // Verificar si la recepción está completa
  const recepcionCompleta = useMemo(() => {
    if (lineasRecepcion.length === 0) return false;
    return lineasRecepcion.every((linea) => {
      if (linea.esInventariable) {
        return linea.cantidadRecibida > 0 && linea.lote.trim() !== '';
      } else {
        return linea.confirmado;
      }
    });
  }, [lineasRecepcion]);

  // Obtener orden seleccionada
  const ordenActual = useMemo(() => {
    return ordenesAprobadas.find((o) => o.id === ordenSeleccionada);
  }, [ordenesAprobadas, ordenSeleccionada]);

  // Finalizar recepción
  const finalizarRecepcion = (datos: z.infer<typeof recepcionSchema>) => {
    const inventariables = lineasRecepcion.filter((l) => l.esInventariable);
    const servicios = lineasRecepcion.filter((l) => !l.esInventariable);

    const mensajes: string[] = [];

    if (inventariables.length > 0) {
      const totalUnidades = inventariables.reduce(
        (acc, l) => acc + l.cantidadRecibida,
        0
      );
      mensajes.push(
        `Stock actualizado: ${totalUnidades} unidades de ${inventariables.length} artículo(s)`
      );
    }

    if (servicios.length > 0) {
      mensajes.push(
        `Gastos registrados: ${servicios.length} servicio(s) confirmado(s)`
      );
    }

    toast.success(
      <div className="space-y-1">
        <p className="font-semibold">Recepción finalizada exitosamente</p>
        <p className="text-sm">Factura: {datos.numeroFactura}</p>
        {mensajes.map((msg, idx) => (
          <p key={idx} className="text-sm">
            {msg}
          </p>
        ))}
      </div>
    );

    // Limpiar formulario
    setOrdenSeleccionada('');
    setLineasRecepcion([]);
    form.reset();
  };

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
                  <Truck className="size-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">
                    Recepción de Mercancía
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Registrar entrada de mercancía de órdenes de compra aprobadas
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

        {/* Selector de Orden de Compra y Factura */}
        <Card>
          <CardHeader>
            <CardTitle>Seleccionar Orden de Compra</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <div className="grid gap-6 md:grid-cols-2">
                {/* Selector de OC */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Orden de Compra Aprobada *
                  </label>
                  <Select
                    value={ordenSeleccionada}
                    onValueChange={handleOrdenChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar orden de compra..." />
                    </SelectTrigger>
                    <SelectContent>
                      {ordenesAprobadas.length === 0 ? (
                        <div className="p-3 text-sm text-muted-foreground text-center">
                          No hay órdenes aprobadas disponibles
                        </div>
                      ) : (
                        ordenesAprobadas.map((orden) => (
                          <SelectItem key={orden.id} value={orden.id}>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{orden.id}</span>
                              <span className="text-muted-foreground">-</span>
                              <span>{orden.proveedorNombre}</span>
                              <span className="text-muted-foreground">
                                ($
                                {orden.total.toLocaleString('es-MX', {
                                  minimumFractionDigits: 2,
                                })}
                                )
                              </span>
                            </div>
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {/* Número de Factura */}
                <FormField
                  control={form.control}
                  name="numeroFactura"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número de Factura del Proveedor *</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <FileText className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                          <Input
                            placeholder="Ej: FAC-2024-001234"
                            className="pl-9"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </Form>

            {/* Información de la OC seleccionada */}
            {ordenActual && (
              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <div className="grid gap-4 md:grid-cols-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Proveedor</p>
                    <p className="font-medium">{ordenActual.proveedorNombre}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Fecha Solicitud
                    </p>
                    <p className="font-medium">
                      {new Date(ordenActual.fechaSolicitud).toLocaleDateString(
                        'es-MX'
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Fecha Aprobación
                    </p>
                    <p className="font-medium">
                      {ordenActual.fechaAprobacion
                        ? new Date(
                            ordenActual.fechaAprobacion
                          ).toLocaleDateString('es-MX')
                        : '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Total</p>
                    <p className="font-medium text-primary">
                      $
                      {ordenActual.total.toLocaleString('es-MX', {
                        minimumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tabla de Recepción */}
        {lineasRecepcion.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="size-5" />
                Artículos a Recibir
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40px]">Tipo</TableHead>
                    <TableHead>Artículo</TableHead>
                    <TableHead className="text-right">Ordenado</TableHead>
                    <TableHead className="text-right">Costo Unit.</TableHead>
                    <TableHead>Cantidad Recibida / Confirmación</TableHead>
                    <TableHead>Lote</TableHead>
                    <TableHead>Fecha Caducidad</TableHead>
                    <TableHead className="w-[100px]">Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lineasRecepcion.map((linea) => (
                    <TableRow
                      key={linea.articuloId}
                      className={!linea.esInventariable ? 'bg-blue-50/50' : ''}
                    >
                      <TableCell>
                        {linea.esInventariable ? (
                          <PackageCheck className="size-5 text-primary" />
                        ) : (
                          <FileText className="size-5 text-blue-500" />
                        )}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{linea.articuloNombre}</p>
                          <p className="text-xs text-muted-foreground">
                            {linea.esInventariable
                              ? 'Producto Inventariable'
                              : 'Servicio / Gasto'}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {linea.cantidadOrdenada.toLocaleString('es-MX')}
                      </TableCell>
                      <TableCell className="text-right">
                        $
                        {linea.costoUnitario.toLocaleString('es-MX', {
                          minimumFractionDigits: 2,
                        })}
                      </TableCell>
                      <TableCell>
                        {linea.esInventariable ? (
                          <Input
                            type="number"
                            min="0"
                            max={linea.cantidadOrdenada}
                            value={linea.cantidadRecibida}
                            onChange={(e) =>
                              actualizarCantidadRecibida(
                                linea.articuloId,
                                parseInt(e.target.value) || 0
                              )
                            }
                            className="w-24"
                          />
                        ) : (
                          <div className="flex items-center gap-2">
                            <Checkbox
                              checked={linea.confirmado}
                              onCheckedChange={(checked) =>
                                actualizarConfirmacion(
                                  linea.articuloId,
                                  checked as boolean
                                )
                              }
                            />
                            <span className="text-sm">
                              Confirmar Prestación de Servicio
                            </span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {linea.esInventariable ? (
                          <Input
                            placeholder="Ej: LOT-2024-001"
                            value={linea.lote}
                            onChange={(e) =>
                              actualizarLote(linea.articuloId, e.target.value)
                            }
                            className="w-36"
                          />
                        ) : (
                          <span className="text-muted-foreground">N/A</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {linea.esInventariable ? (
                          <Input
                            type="date"
                            value={linea.fechaCaducidad}
                            onChange={(e) =>
                              actualizarFechaCaducidad(
                                linea.articuloId,
                                e.target.value
                              )
                            }
                            className="w-36"
                          />
                        ) : (
                          <span className="text-muted-foreground">N/A</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {linea.esInventariable ? (
                          linea.cantidadRecibida > 0 &&
                          linea.lote.trim() !== '' ? (
                            <Badge variant="success" appearance="light">
                              <Check className="size-3 mr-1" />
                              Listo
                            </Badge>
                          ) : (
                            <Badge variant="warning" appearance="light">
                              Pendiente
                            </Badge>
                          )
                        ) : linea.confirmado ? (
                          <Badge variant="success" appearance="light">
                            <Check className="size-3 mr-1" />
                            Confirmado
                          </Badge>
                        ) : (
                          <Badge variant="warning" appearance="light">
                            Pendiente
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex justify-between items-center border-t">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <PackageCheck className="size-4 text-primary" />
                  <span className="text-sm">
                    Inventariables:{' '}
                    {lineasRecepcion.filter((l) => l.esInventariable).length}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="size-4 text-blue-500" />
                  <span className="text-sm">
                    Servicios:{' '}
                    {lineasRecepcion.filter((l) => !l.esInventariable).length}
                  </span>
                </div>
              </div>
              <Button
                onClick={form.handleSubmit(finalizarRecepcion)}
                size="lg"
                disabled={
                  !recepcionCompleta || !form.getValues('numeroFactura')
                }
                className="gap-2"
              >
                <CheckCircle2 className="size-5" />
                Finalizar Recepción
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* Mensaje cuando no hay orden seleccionada */}
        {ordenesAprobadas.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <AlertTriangle className="size-12 text-amber-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                No hay órdenes aprobadas disponibles
              </h3>
              <p className="text-muted-foreground">
                No existen órdenes de compra aprobadas para la instalación{' '}
                <strong>{instalacionActiva.nombre}</strong>.
              </p>
              <p className="text-muted-foreground mt-2">
                Primero debe crear y aprobar una orden de compra.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Mensaje cuando hay órdenes pero no se ha seleccionado */}
        {ordenesAprobadas.length > 0 && !ordenSeleccionada && (
          <Card>
            <CardContent className="py-12 text-center">
              <Search className="size-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Seleccione una Orden de Compra
              </h3>
              <p className="text-muted-foreground">
                Hay <strong>{ordenesAprobadas.length}</strong> orden(es)
                aprobada(s) disponible(s) para recepción.
              </p>
              <p className="text-muted-foreground mt-2">
                Seleccione una orden en el campo superior para comenzar el
                proceso de recepción.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
