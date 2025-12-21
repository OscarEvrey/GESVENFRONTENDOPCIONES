'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, ChevronRight, Package, ShoppingCart, User } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardHeading,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
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
  Stepper,
  StepperContent,
  StepperIndicator,
  StepperItem,
  StepperNav,
  StepperPanel,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from '@/components/ui/stepper';
import { Textarea } from '@/components/ui/textarea';

// ============ FORMULARIO #1: VERTICAL - ALTA DE ARTÍCULO ============
const esquemaAltaArticulo = z.object({
  codigo: z.string().min(3, 'El código debe tener al menos 3 caracteres'),
  nombre: z.string().min(5, 'El nombre debe tener al menos 5 caracteres'),
  descripcion: z.string().optional(),
  categoria: z.string().min(1, 'Seleccione una categoría'),
  unidadMedida: z.string().min(1, 'Seleccione una unidad de medida'),
  precioCompra: z.string().min(1, 'Ingrese el precio de compra'),
  precioVenta: z.string().min(1, 'Ingrese el precio de venta'),
  stockMinimo: z.string().min(1, 'Ingrese el stock mínimo'),
  stockMaximo: z.string().optional(),
  ubicacionAlmacen: z.string().optional(),
  codigoBarras: z.string().optional(),
  proveedor: z.string().optional(),
});

type DatosAltaArticulo = z.infer<typeof esquemaAltaArticulo>;

function FormularioAltaArticulo() {
  const form = useForm<DatosAltaArticulo>({
    resolver: zodResolver(esquemaAltaArticulo),
    defaultValues: {
      codigo: '',
      nombre: '',
      descripcion: '',
      categoria: '',
      unidadMedida: '',
      precioCompra: '',
      precioVenta: '',
      stockMinimo: '',
      stockMaximo: '',
      ubicacionAlmacen: '',
      codigoBarras: '',
      proveedor: '',
    },
  });

  const onSubmit = (datos: DatosAltaArticulo) => {
    console.log('Datos del artículo:', datos);
    alert('Artículo registrado correctamente');
  };

  return (
    <Card>
      <CardHeader>
        <CardHeading>
          <CardTitle>Formulario #1 - Alta de Artículo (Vertical)</CardTitle>
          <CardDescription>
            Formulario de captura vertical para registro de nuevos artículos en
            el catálogo
          </CardDescription>
        </CardHeading>
        <Badge variant="secondary">Vertical</Badge>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Información Básica */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Información Básica
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="codigo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Código del Artículo *</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: ART-001" {...field} />
                      </FormControl>
                      <FormDescription>
                        Código único de identificación
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="codigoBarras"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Código de Barras</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: 7501234567890" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="nombre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre del Artículo *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ingrese el nombre completo del artículo"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="descripcion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Descripción detallada del artículo..."
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Clasificación */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Clasificación
              </h3>
              <div className="grid gap-4 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="categoria"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoría *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="ferreteria">Ferretería</SelectItem>
                          <SelectItem value="electrico">Eléctrico</SelectItem>
                          <SelectItem value="plomeria">Plomería</SelectItem>
                          <SelectItem value="construccion">
                            Construcción
                          </SelectItem>
                          <SelectItem value="herramientas">
                            Herramientas
                          </SelectItem>
                          <SelectItem value="pinturas">Pinturas</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="unidadMedida"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unidad de Medida *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="pieza">Pieza</SelectItem>
                          <SelectItem value="metro">Metro</SelectItem>
                          <SelectItem value="kilogramo">Kilogramo</SelectItem>
                          <SelectItem value="litro">Litro</SelectItem>
                          <SelectItem value="rollo">Rollo</SelectItem>
                          <SelectItem value="saco">Saco</SelectItem>
                          <SelectItem value="caja">Caja</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="proveedor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Proveedor Principal</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="prov1">
                            Aceros del Norte SA
                          </SelectItem>
                          <SelectItem value="prov2">
                            Eléctricos Industriales
                          </SelectItem>
                          <SelectItem value="prov3">
                            Ferretería Universal
                          </SelectItem>
                          <SelectItem value="prov4">
                            Pinturas Premium SA
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Precios */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Precios
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="precioCompra"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Precio de Compra *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="precioVenta"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Precio de Venta *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Inventario */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Control de Inventario
              </h3>
              <div className="grid gap-4 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="stockMinimo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stock Mínimo *</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} />
                      </FormControl>
                      <FormDescription>Punto de reorden</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="stockMaximo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stock Máximo</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="ubicacionAlmacen"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ubicación en Almacén</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: A-01-03" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline">
                Cancelar
              </Button>
              <Button type="submit">Guardar Artículo</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

// ============ FORMULARIO #2: HORIZONTAL - ORDEN DE COMPRA ============
const esquemaOrdenCompra = z.object({
  proveedor: z.string().min(1, 'Seleccione un proveedor'),
  fechaEntrega: z.string().min(1, 'Seleccione la fecha de entrega'),
  condicionPago: z.string().min(1, 'Seleccione condición de pago'),
  sucursalDestino: z.string().min(1, 'Seleccione la sucursal destino'),
  observaciones: z.string().optional(),
  moneda: z.string().min(1, 'Seleccione la moneda'),
  referencia: z.string().optional(),
});

type DatosOrdenCompra = z.infer<typeof esquemaOrdenCompra>;

function FormularioOrdenCompra() {
  const form = useForm<DatosOrdenCompra>({
    resolver: zodResolver(esquemaOrdenCompra),
    defaultValues: {
      proveedor: '',
      fechaEntrega: '',
      condicionPago: '',
      sucursalDestino: '',
      observaciones: '',
      moneda: 'MXN',
      referencia: '',
    },
  });

  const onSubmit = (datos: DatosOrdenCompra) => {
    console.log('Datos de la orden:', datos);
    alert('Orden de compra creada correctamente');
  };

  return (
    <Card>
      <CardHeader>
        <CardHeading>
          <CardTitle>Formulario #2 - Orden de Compra (Horizontal)</CardTitle>
          <CardDescription>
            Diseño horizontal optimizado para captura rápida de órdenes de
            compra
          </CardDescription>
        </CardHeading>
        <Badge variant="secondary">Horizontal</Badge>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Fila 1 */}
            <div className="grid gap-6 md:grid-cols-3">
              <FormField
                control={form.control}
                name="proveedor"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center gap-4">
                    <FormLabel className="w-24 shrink-0 text-right">
                      Proveedor *
                    </FormLabel>
                    <div className="flex-1">
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar proveedor" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="prov1">
                            Aceros del Norte SA
                          </SelectItem>
                          <SelectItem value="prov2">
                            Eléctricos Industriales
                          </SelectItem>
                          <SelectItem value="prov3">
                            Ferretería Universal
                          </SelectItem>
                          <SelectItem value="prov4">
                            Cementos del Pacífico
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="fechaEntrega"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center gap-4">
                    <FormLabel className="w-24 shrink-0 text-right">
                      Fecha Entrega *
                    </FormLabel>
                    <div className="flex-1">
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="referencia"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center gap-4">
                    <FormLabel className="w-24 shrink-0 text-right">
                      Referencia
                    </FormLabel>
                    <div className="flex-1">
                      <FormControl>
                        <Input placeholder="Ej: COT-2024-001" {...field} />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </div>

            {/* Fila 2 */}
            <div className="grid gap-6 md:grid-cols-3">
              <FormField
                control={form.control}
                name="condicionPago"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center gap-4">
                    <FormLabel className="w-24 shrink-0 text-right">
                      Condición *
                    </FormLabel>
                    <div className="flex-1">
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="contado">Contado</SelectItem>
                          <SelectItem value="credito15">
                            Crédito 15 días
                          </SelectItem>
                          <SelectItem value="credito30">
                            Crédito 30 días
                          </SelectItem>
                          <SelectItem value="credito60">
                            Crédito 60 días
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sucursalDestino"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center gap-4">
                    <FormLabel className="w-24 shrink-0 text-right">
                      Sucursal *
                    </FormLabel>
                    <div className="flex-1">
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Destino" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="suc1">
                            Sucursal Monterrey
                          </SelectItem>
                          <SelectItem value="suc2">
                            Sucursal Guadalajara
                          </SelectItem>
                          <SelectItem value="suc3">Sucursal Mérida</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="moneda"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center gap-4">
                    <FormLabel className="w-24 shrink-0 text-right">
                      Moneda *
                    </FormLabel>
                    <div className="flex-1">
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="MXN">MXN - Peso Mexicano</SelectItem>
                          <SelectItem value="USD">USD - Dólar USA</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </div>

            {/* Observaciones */}
            <FormField
              control={form.control}
              name="observaciones"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start gap-4">
                  <FormLabel className="w-24 shrink-0 text-right pt-2">
                    Observaciones
                  </FormLabel>
                  <div className="flex-1">
                    <FormControl>
                      <Textarea
                        placeholder="Notas adicionales para la orden..."
                        rows={2}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline">
                Cancelar
              </Button>
              <Button type="button" variant="secondary">
                Guardar Borrador
              </Button>
              <Button type="submit">Crear Orden</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

// ============ FORMULARIO #3: STEPPER - REGISTRO DE VENTA ============
const esquemaPaso1 = z.object({
  cliente: z.string().min(1, 'Seleccione un cliente'),
  tipoVenta: z.string().min(1, 'Seleccione el tipo de venta'),
  fechaVenta: z.string().min(1, 'Ingrese la fecha'),
});

const esquemaPaso2 = z.object({
  producto: z.string().min(1, 'Seleccione un producto'),
  cantidad: z.string().min(1, 'Ingrese la cantidad'),
  descuento: z.string().optional(),
});

const esquemaPaso3 = z.object({
  metodoPago: z.string().min(1, 'Seleccione método de pago'),
  referenciaPago: z.string().optional(),
  observaciones: z.string().optional(),
});

type DatosPaso1 = z.infer<typeof esquemaPaso1>;
type DatosPaso2 = z.infer<typeof esquemaPaso2>;
type DatosPaso3 = z.infer<typeof esquemaPaso3>;

function ContenidoPaso1({ onNext }: { onNext: (datos: DatosPaso1) => void }) {
  const form = useForm<DatosPaso1>({
    resolver: zodResolver(esquemaPaso1),
    defaultValues: {
      cliente: '',
      tipoVenta: '',
      fechaVenta: new Date().toISOString().split('T')[0],
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onNext)}
        className="space-y-6 p-6 bg-muted/30 rounded-lg"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <User className="size-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">Datos del Cliente</h3>
            <p className="text-sm text-muted-foreground">
              Seleccione el cliente y tipo de venta
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="cliente"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cliente *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar cliente" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="cli1">
                      Constructora del Valle SA
                    </SelectItem>
                    <SelectItem value="cli2">
                      Mantenimiento Industrial MX
                    </SelectItem>
                    <SelectItem value="cli3">
                      Desarrollos Habitacionales
                    </SelectItem>
                    <SelectItem value="cli4">Público General</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tipoVenta"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Venta *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="mostrador">Mostrador</SelectItem>
                    <SelectItem value="pedido">Pedido</SelectItem>
                    <SelectItem value="cotizacion">Cotización</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="fechaVenta"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fecha de Venta *</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit">
            Siguiente <ChevronRight className="size-4" />
          </Button>
        </div>
      </form>
    </Form>
  );
}

function ContenidoPaso2({
  onNext,
  onBack,
}: {
  onNext: (datos: DatosPaso2) => void;
  onBack: () => void;
}) {
  const form = useForm<DatosPaso2>({
    resolver: zodResolver(esquemaPaso2),
    defaultValues: {
      producto: '',
      cantidad: '',
      descuento: '0',
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onNext)}
        className="space-y-6 p-6 bg-muted/30 rounded-lg"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Package className="size-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">Productos</h3>
            <p className="text-sm text-muted-foreground">
              Agregue los productos a la venta
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <FormField
            control={form.control}
            name="producto"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Producto *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Buscar producto" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="prod1">
                      Tornillo Hexagonal M8x20
                    </SelectItem>
                    <SelectItem value="prod2">
                      Cable Eléctrico 12 AWG
                    </SelectItem>
                    <SelectItem value="prod3">Cemento Gris 50kg</SelectItem>
                    <SelectItem value="prod4">
                      Pintura Vinílica 19L
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="cantidad"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cantidad *</FormLabel>
                <FormControl>
                  <Input type="number" min="1" placeholder="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="descuento"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descuento (%)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="0"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="p-4 bg-background rounded-lg border">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              Subtotal estimado:
            </span>
            <span className="font-semibold">$2,500.00 MXN</span>
          </div>
        </div>

        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={onBack}>
            Anterior
          </Button>
          <Button type="submit">
            Siguiente <ChevronRight className="size-4" />
          </Button>
        </div>
      </form>
    </Form>
  );
}

function ContenidoPaso3({
  onSubmit,
  onBack,
}: {
  onSubmit: (datos: DatosPaso3) => void;
  onBack: () => void;
}) {
  const form = useForm<DatosPaso3>({
    resolver: zodResolver(esquemaPaso3),
    defaultValues: {
      metodoPago: '',
      referenciaPago: '',
      observaciones: '',
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 p-6 bg-muted/30 rounded-lg"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <ShoppingCart className="size-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">Método de Pago</h3>
            <p className="text-sm text-muted-foreground">
              Complete la información de pago
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="metodoPago"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Método de Pago *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="efectivo">Efectivo</SelectItem>
                    <SelectItem value="tarjeta">
                      Tarjeta de Crédito/Débito
                    </SelectItem>
                    <SelectItem value="transferencia">Transferencia</SelectItem>
                    <SelectItem value="credito">Crédito Cliente</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="referenciaPago"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Referencia de Pago</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: Número de autorización" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="observaciones"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observaciones</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Notas adicionales..."
                  rows={2}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
          <div className="flex justify-between items-center">
            <span className="font-medium">Total a Pagar:</span>
            <span className="text-xl font-bold text-primary">
              $2,500.00 MXN
            </span>
          </div>
        </div>

        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={onBack}>
            Anterior
          </Button>
          <Button type="submit" variant="primary">
            <Check className="size-4" /> Completar Venta
          </Button>
        </div>
      </form>
    </Form>
  );
}

function FormularioRegistroVenta() {
  const [pasoActual, setPasoActual] = useState(1);
  const [, setDatosVenta] = useState<{
    paso1?: DatosPaso1;
    paso2?: DatosPaso2;
    paso3?: DatosPaso3;
  }>({});

  const handlePaso1 = (datos: DatosPaso1) => {
    setDatosVenta((prev) => ({ ...prev, paso1: datos }));
    setPasoActual(2);
  };

  const handlePaso2 = (datos: DatosPaso2) => {
    setDatosVenta((prev) => ({ ...prev, paso2: datos }));
    setPasoActual(3);
  };

  const handlePaso3 = (datos: DatosPaso3) => {
    setDatosVenta((prev) => ({ ...prev, paso3: datos }));
    alert('¡Venta registrada correctamente!');
    // Reiniciar
    setPasoActual(1);
    setDatosVenta({});
  };

  return (
    <Card>
      <CardHeader>
        <CardHeading>
          <CardTitle>
            Formulario #3 - Registro de Venta (Stepper)
          </CardTitle>
          <CardDescription>
            Formulario por pasos para el proceso completo de registro de ventas
          </CardDescription>
        </CardHeading>
        <Badge variant="secondary">Stepper</Badge>
      </CardHeader>
      <CardContent>
        <Stepper value={pasoActual} onValueChange={setPasoActual}>
          <StepperNav className="mb-8">
            <StepperItem step={1}>
              <StepperTrigger>
                <StepperIndicator>1</StepperIndicator>
                <StepperTitle>Cliente</StepperTitle>
              </StepperTrigger>
              <StepperSeparator />
            </StepperItem>
            <StepperItem step={2}>
              <StepperTrigger>
                <StepperIndicator>2</StepperIndicator>
                <StepperTitle>Productos</StepperTitle>
              </StepperTrigger>
              <StepperSeparator />
            </StepperItem>
            <StepperItem step={3}>
              <StepperTrigger>
                <StepperIndicator>3</StepperIndicator>
                <StepperTitle>Pago</StepperTitle>
              </StepperTrigger>
            </StepperItem>
          </StepperNav>

          <StepperPanel>
            <StepperContent value={1}>
              <ContenidoPaso1 onNext={handlePaso1} />
            </StepperContent>
            <StepperContent value={2}>
              <ContenidoPaso2
                onNext={handlePaso2}
                onBack={() => setPasoActual(1)}
              />
            </StepperContent>
            <StepperContent value={3}>
              <ContenidoPaso3
                onSubmit={handlePaso3}
                onBack={() => setPasoActual(2)}
              />
            </StepperContent>
          </StepperPanel>
        </Stepper>
      </CardContent>
    </Card>
  );
}

// ============ PÁGINA PRINCIPAL ============
export function FormulariosCapturaPage() {
  return (
    <div className="container-fluid">
      <div className="grid gap-5 lg:gap-7.5">
        {/* Descripción */}
        <Card>
          <CardContent className="py-4">
            <h2 className="text-xl font-semibold mb-2">
              Módulo de Formularios de Captura
            </h2>
            <p className="text-muted-foreground">
              Esta sección contiene 3 diseños de formularios para diferentes
              escenarios de captura de datos. Cada formulario demuestra un patrón
              de diseño diferente que puede adaptarse según las necesidades.
            </p>
          </CardContent>
        </Card>

        {/* Formulario #1: Vertical */}
        <FormularioAltaArticulo />

        {/* Formulario #2: Horizontal */}
        <FormularioOrdenCompra />

        {/* Formulario #3: Stepper */}
        <FormularioRegistroVenta />
      </div>
    </div>
  );
}
