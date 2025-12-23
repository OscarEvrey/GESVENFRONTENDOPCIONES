'use client';

import { useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, ShoppingCart, Trash2 } from 'lucide-react';
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
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useInstalacionActivaObligatoria } from '../../context/ContextoInstalacion';
import { useOrdenesCompra } from '../../context/ContextoOrdenesCompra';
import {
  useCrearOrdenCompra,
  useInstalacionesApi,
  useProductosParaCompraApi,
  useProveedoresApi,
} from '../../hooks/useGesvenApi';

// ============ TIPOS ============
interface LineaOrden {
  id: string;
  articuloId: string;
  articuloNombre: string;
  cantidad: number;
  costoUnitario: number;
  subtotal: number;
}

// ============ SCHEMA DE VALIDACIÓN ============
const lineaSchema = z.object({
  articuloId: z.string().min(1, 'Seleccione un artículo'),
  cantidad: z.number().min(1, 'La cantidad debe ser mayor a 0'),
  costoUnitario: z.number().min(0.01, 'El costo debe ser mayor a 0'),
});

// ============ COMPONENTE PRINCIPAL ============
export function NuevaOrdenCompraPage() {
  const instalacionActiva = useInstalacionActivaObligatoria();
  const { agregarOrden, generarIdOrden } = useOrdenesCompra();
  const [lineas, setLineas] = useState<LineaOrden[]>([]);
  const [proveedorId, setProveedorId] = useState<string>('');
  const [comentarios, setComentarios] = useState<string>('');

  const { instalaciones: instalacionesApi } = useInstalacionesApi();
  const { proveedores, cargando: cargandoProveedores, error: errorProveedores } = useProveedoresApi();
  const { crearOrden, creando } = useCrearOrdenCompra();

  // Formulario para agregar líneas
  const form = useForm<z.infer<typeof lineaSchema>>({
    resolver: zodResolver(lineaSchema),
    defaultValues: {
      articuloId: '',
      cantidad: 1,
      costoUnitario: 0,
    },
  });

  // Estado para alerta de costo elevado
  const [alertaCosto, setAlertaCosto] = useState<string>('');

  // ID de la orden (referencia local)
  const [idOrden, setIdOrden] = useState(() => generarIdOrden());

  // Fecha actual
  const fechaHoy = new Date().toLocaleDateString('es-MX', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  // Resolver InstalacionId numérico del backend
  const instalacionApiId = useMemo(() => {
    const match = instalacionesApi.find(
      (i) => i.nombre.toLowerCase() === instalacionActiva.nombre.toLowerCase(),
    );
    return match?.instalacionId ?? null;
  }, [instalacionesApi, instalacionActiva.nombre]);

  const {
    productos: productosParaCompra,
    cargando: cargandoProductos,
    error: errorProductos,
  } = useProductosParaCompraApi(instalacionApiId);

  // Total de la orden
  const totalOrden = useMemo(() => {
    return lineas.reduce((acc, linea) => acc + linea.subtotal, 0);
  }, [lineas]);

  // Validar si el costo excede el 15% del costo promedio histórico
  const validarCostoContraPromedio = (productoId: string, costoCapturado: number): { excede: boolean; mensaje: string; porcentajeExceso: number } => {
    const producto = productosParaCompra.find((p) => String(p.productoId) === productoId);
    if (!producto || !producto.costoSugerido) {
      return { excede: false, mensaje: '', porcentajeExceso: 0 };
    }
    
    const costoPromedio = Number(producto.costoSugerido);
    const limiteSuperior = costoPromedio * 1.15; // 15% arriba del promedio
    
    if (costoCapturado > limiteSuperior) {
      const porcentajeExceso = ((costoCapturado - costoPromedio) / costoPromedio) * 100;
      return {
        excede: true,
        mensaje: `⚠️ ALERTA: El costo capturado ($${costoCapturado.toFixed(2)}) es ${porcentajeExceso.toFixed(1)}% superior al costo promedio histórico ($${costoPromedio.toFixed(2)}). Por favor verifique el precio con el proveedor.`,
        porcentajeExceso,
      };
    }
    
    return { excede: false, mensaje: '', porcentajeExceso: 0 };
  };

  // Manejar selección de artículo
  const handleArticuloChange = (articuloId: string) => {
    const producto = productosParaCompra.find(
      (p) => String(p.productoId) === articuloId,
    );
    if (!producto) return;

    form.setValue('articuloId', articuloId);
    form.setValue('costoUnitario', Number(producto.costoSugerido));
    setAlertaCosto(''); // Limpiar alerta al cambiar artículo
  };

  // Manejar cambio de costo unitario con validación
  const handleCostoChange = (costo: number) => {
    form.setValue('costoUnitario', costo);
    const articuloId = form.getValues('articuloId');
    if (articuloId) {
      const validacion = validarCostoContraPromedio(articuloId, costo);
      if (validacion.excede) {
        setAlertaCosto(validacion.mensaje);
      } else {
        setAlertaCosto('');
      }
    }
  };

  // Agregar línea
  const agregarLinea = (datos: z.infer<typeof lineaSchema>) => {
    const producto = productosParaCompra.find(
      (p) => String(p.productoId) === datos.articuloId,
    );
    if (!producto) return;

    // Validar costo contra promedio histórico (alerta visual pero no bloquea)
    const validacion = validarCostoContraPromedio(datos.articuloId, datos.costoUnitario);
    if (validacion.excede) {
      // Mostrar toast de advertencia pero permitir continuar
      toast.warning(`Costo ${validacion.porcentajeExceso.toFixed(1)}% arriba del promedio`, {
        description: `El artículo "${producto.nombre}" tiene un costo capturado significativamente superior al histórico.`,
        duration: 5000,
      });
    }

    const nuevaLinea: LineaOrden = {
      id: `linea-${Date.now()}`,
      articuloId: datos.articuloId,
      articuloNombre: producto.nombre,
      cantidad: datos.cantidad,
      costoUnitario: datos.costoUnitario,
      subtotal: datos.cantidad * datos.costoUnitario,
    };

    setLineas((prev) => [...prev, nuevaLinea]);
    setAlertaCosto('');
    form.reset();
  };

  // Eliminar línea
  const eliminarLinea = (id: string) => {
    setLineas((prev) => prev.filter((l) => l.id !== id));
  };

  // Guardar orden (API)
  const guardarOrden = async () => {
    if (!instalacionApiId) {
      toast.error('No se pudo resolver la instalación en el backend');
      return;
    }
    if (!proveedorId) {
      toast.error('Por favor seleccione un proveedor');
      return;
    }
    if (lineas.length === 0) {
      toast.error('Agregue al menos un artículo a la orden');
      return;
    }

    if (errorProveedores || errorProductos) {
      toast.error('Error cargando catálogos. Revise conexión al backend');
      return;
    }

    const proveedor = proveedores.find(
      (p) => String(p.proveedorId) === proveedorId,
    );

    const resultado = await crearOrden({
      instalacionId: instalacionApiId,
      proveedorId: Number(proveedorId),
      comentarios,
      lineas: lineas.map((l) => ({
        productoId: Number(l.articuloId),
        cantidad: l.cantidad,
        costoUnitario: l.costoUnitario,
      })),
    });

    if (!resultado) {
      toast.error('No se pudo crear la orden de compra');
      return;
    }

    // Mantener el contexto actual (mock) sincronizado para pantallas que aún lo usan
    agregarOrden({
      id: `OC-${resultado.ordenCompraId}`,
      instalacionId: instalacionActiva.id,
      instalacionNombre: instalacionActiva.nombre,
      proveedorId,
      proveedorNombre: proveedor?.nombre || '',
      fechaSolicitud: new Date().toISOString(),
      comentarios,
      lineas: lineas.map((l) => ({
        articuloId: l.articuloId,
        articuloNombre: l.articuloNombre,
        cantidad: l.cantidad,
        costoUnitario: l.costoUnitario,
        subtotal: l.subtotal,
      })),
      total: totalOrden,
      estatus: 'pendiente',
    });

    toast.success(`Orden de compra ${resultado.ordenCompraId} creada exitosamente`);

    // Limpiar formulario
    setLineas([]);
    setProveedorId('');
    setComentarios('');
    form.reset();

    // Generar nueva referencia local para una siguiente orden
    setIdOrden(generarIdOrden());
  };

  return (
    <div className="container-fluid">
      <div className="grid gap-5 lg:gap-7.5">
        {/* Encabezado */}
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <ShoppingCart className="size-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Nueva Orden de Compra</h2>
                  <p className="text-sm text-muted-foreground">
                    Crear una nueva orden de compra para la instalación activa
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

        {/* Formulario de Cabecera */}
        <Card>
          <CardHeader>
            <CardTitle>Datos de la Orden</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {/* ID OC (Lectura) */}
              <div className="space-y-2">
                <label className="text-sm font-medium">ID Orden de Compra</label>
                <Input value={idOrden} disabled className="bg-muted" />
              </div>

              {/* Instalación Actual (Lectura) */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Instalación Actual</label>
                <Input
                  value={instalacionActiva.nombre}
                  disabled
                  className="bg-muted"
                />
              </div>

              {/* Fecha Solicitud (Hoy) */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Fecha Solicitud</label>
                <Input value={fechaHoy} disabled className="bg-muted" />
              </div>

              {/* Proveedor (SelectBox) */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Proveedor *</label>
                <Select
                  value={proveedorId}
                  onValueChange={setProveedorId}
                  disabled={cargandoProveedores}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar proveedor" />
                  </SelectTrigger>
                  <SelectContent>
                    {proveedores.map((prov) => (
                      <SelectItem key={prov.proveedorId} value={String(prov.proveedorId)}>
                        {prov.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Comentarios */}
            <div className="mt-6 space-y-2">
              <label className="text-sm font-medium">Comentarios</label>
              <Textarea
                placeholder="Notas adicionales para la orden de compra..."
                value={comentarios}
                onChange={(e) => setComentarios(e.target.value)}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Línea de Captura */}
        <Card>
          <CardHeader>
            <CardTitle>Agregar Artículos</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(agregarLinea)}
                className="flex flex-wrap items-end gap-4"
              >
                {/* Artículo */}
                <FormField
                  control={form.control}
                  name="articuloId"
                  render={({ field }) => (
                    <FormItem className="flex-1 min-w-[200px]">
                      <FormLabel>Artículo *</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={handleArticuloChange}
                        disabled={cargandoProductos}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar artículo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {productosParaCompra.map((p) => (
                            <SelectItem key={p.productoId} value={String(p.productoId)}>
                              {p.nombre}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Cantidad */}
                <FormField
                  control={form.control}
                  name="cantidad"
                  render={({ field }) => (
                    <FormItem className="w-32">
                      <FormLabel>Cantidad *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value) || 0)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Costo Unitario */}
                <FormField
                  control={form.control}
                  name="costoUnitario"
                  render={({ field }) => (
                    <FormItem className="w-40">
                      <FormLabel>Costo Unitario *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          min="0.01"
                          className={alertaCosto ? 'border-amber-500' : ''}
                          {...field}
                          onChange={(e) => {
                            const valor = parseFloat(e.target.value) || 0;
                            field.onChange(valor);
                            handleCostoChange(valor);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Botón Agregar */}
                <Button type="submit" className="gap-2">
                  <Plus className="size-4" />
                  Agregar
                </Button>
              </form>
            </Form>

            {/* Alerta de costo elevado */}
            {alertaCosto && (
              <div className="mt-4 p-3 bg-amber-50 border border-amber-300 rounded-lg">
                <p className="text-sm text-amber-800 font-medium">{alertaCosto}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tabla de Líneas */}
        <Card>
          <CardHeader>
            <CardTitle>Detalle de la Orden</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Artículo</TableHead>
                  <TableHead className="text-right">Cantidad</TableHead>
                  <TableHead className="text-right">Costo Unitario</TableHead>
                  <TableHead className="text-right">Subtotal</TableHead>
                  <TableHead className="w-16">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lineas.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <p className="text-muted-foreground">
                        No hay artículos agregados. Use el formulario superior para
                        agregar artículos.
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  lineas.map((linea) => (
                    <TableRow key={linea.id}>
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
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => eliminarLinea(linea.id)}
                        >
                          <Trash2 className="size-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="flex justify-between items-center border-t">
            <div className="text-lg font-semibold">
              Total de la Orden:{' '}
              <span className="text-primary">
                ${totalOrden.toLocaleString('es-MX', {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
            <Button
              onClick={guardarOrden}
              size="lg"
              disabled={lineas.length === 0 || !proveedorId || creando}
            >
              Guardar Orden (Pendiente)
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
