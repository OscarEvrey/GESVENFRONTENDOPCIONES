'use client';

import { useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, ShoppingCart, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Navigate } from 'react-router-dom';
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
import { useContextoInstalacion } from '../../context/ContextoInstalacion';
import { useOrdenesCompra } from '../../context/ContextoOrdenesCompra';

// ============ TIPOS ============
interface LineaOrden {
  id: string;
  articuloId: string;
  articuloNombre: string;
  cantidad: number;
  costoUnitario: number;
  subtotal: number;
}

// ============ PROVEEDORES FICTICIOS ============
const PROVEEDORES = [
  { id: 'prov-001', nombre: 'Aceros del Norte SA' },
  { id: 'prov-002', nombre: 'Distribuidora de Papelería Omega' },
  { id: 'prov-003', nombre: 'Comercializadora de Bebidas del Golfo' },
  { id: 'prov-004', nombre: 'Suministros Industriales MTY' },
  { id: 'prov-005', nombre: 'Alimentos y Snacks del Pacífico' },
];

// ============ ARTÍCULOS FICTICIOS SEGÚN TIPO DE INSTALACIÓN ============
const ARTICULOS_ALMACEN = [
  { id: 'art-a01', nombre: 'Coca-Cola 600ml', costoSugerido: 12.5 },
  { id: 'art-a02', nombre: 'Pepsi 600ml', costoSugerido: 11.8 },
  { id: 'art-a03', nombre: 'Sabritas Original 45g', costoSugerido: 9.5 },
  { id: 'art-a04', nombre: 'Doritos Nacho 62g', costoSugerido: 12.0 },
  { id: 'art-a05', nombre: 'Agua Ciel 1L', costoSugerido: 8.0 },
  { id: 'art-a06', nombre: 'Gatorade 600ml', costoSugerido: 18.5 },
  { id: 'art-a07', nombre: 'Galletas Marías 170g', costoSugerido: 14.0 },
  { id: 'art-a08', nombre: 'Cacahuates Japoneses 110g', costoSugerido: 16.5 },
];

const ARTICULOS_OFICINAS = [
  { id: 'art-o01', nombre: 'Hojas Blancas Carta (500)', costoSugerido: 75.0 },
  { id: 'art-o02', nombre: 'Plumas BIC Azul (12)', costoSugerido: 36.0 },
  { id: 'art-o03', nombre: 'Toner HP 85A', costoSugerido: 520.0 },
  { id: 'art-o04', nombre: 'Folders Carta (25)', costoSugerido: 65.0 },
  { id: 'art-o05', nombre: 'Post-it Colores (5)', costoSugerido: 55.0 },
  { id: 'art-o06', nombre: 'Clips Jumbo (100)', costoSugerido: 18.0 },
  { id: 'art-o07', nombre: 'Café Nescafé Clásico 200g', costoSugerido: 115.0 },
  { id: 'art-o08', nombre: 'Azúcar 1kg', costoSugerido: 28.0 },
];

// ============ SCHEMA DE VALIDACIÓN ============
const lineaSchema = z.object({
  articuloId: z.string().min(1, 'Seleccione un artículo'),
  cantidad: z.number().min(1, 'La cantidad debe ser mayor a 0'),
  costoUnitario: z.number().min(0.01, 'El costo debe ser mayor a 0'),
});

// ============ COMPONENTE PRINCIPAL ============
export function NuevaOrdenCompraPage() {
  const { instalacionActiva } = useContextoInstalacion();
  const { agregarOrden, generarIdOrden } = useOrdenesCompra();
  const [lineas, setLineas] = useState<LineaOrden[]>([]);
  const [proveedorId, setProveedorId] = useState<string>('');
  const [comentarios, setComentarios] = useState<string>('');

  // Formulario para agregar líneas
  const form = useForm<z.infer<typeof lineaSchema>>({
    resolver: zodResolver(lineaSchema),
    defaultValues: {
      articuloId: '',
      cantidad: 1,
      costoUnitario: 0,
    },
  });

  // ID de la orden (generado automáticamente)
  const idOrden = useMemo(() => generarIdOrden(), [generarIdOrden]);

  // Fecha actual
  const fechaHoy = new Date().toLocaleDateString('es-MX', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  // Artículos según tipo de instalación
  const articulos = useMemo(() => {
    if (!instalacionActiva) return [];
    return instalacionActiva.tipo === 'almacen'
      ? ARTICULOS_ALMACEN
      : ARTICULOS_OFICINAS;
  }, [instalacionActiva]);

  // Total de la orden
  const totalOrden = useMemo(() => {
    return lineas.reduce((acc, linea) => acc + linea.subtotal, 0);
  }, [lineas]);

  // Protección de ruta
  if (!instalacionActiva) {
    return <Navigate to="/tienda-inventario/selector-instalacion" replace />;
  }

  // Manejar selección de artículo
  const handleArticuloChange = (articuloId: string) => {
    const articulo = articulos.find((a) => a.id === articuloId);
    if (articulo) {
      form.setValue('articuloId', articuloId);
      form.setValue('costoUnitario', articulo.costoSugerido);
    }
  };

  // Agregar línea
  const agregarLinea = (datos: z.infer<typeof lineaSchema>) => {
    const articulo = articulos.find((a) => a.id === datos.articuloId);
    if (!articulo) return;

    const nuevaLinea: LineaOrden = {
      id: `linea-${Date.now()}`,
      articuloId: datos.articuloId,
      articuloNombre: articulo.nombre,
      cantidad: datos.cantidad,
      costoUnitario: datos.costoUnitario,
      subtotal: datos.cantidad * datos.costoUnitario,
    };

    setLineas((prev) => [...prev, nuevaLinea]);
    form.reset();
  };

  // Eliminar línea
  const eliminarLinea = (id: string) => {
    setLineas((prev) => prev.filter((l) => l.id !== id));
  };

  // Guardar orden
  const guardarOrden = () => {
    if (!proveedorId) {
      toast.error('Por favor seleccione un proveedor');
      return;
    }
    if (lineas.length === 0) {
      toast.error('Agregue al menos un artículo a la orden');
      return;
    }

    const proveedor = PROVEEDORES.find((p) => p.id === proveedorId);

    agregarOrden({
      id: idOrden,
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

    toast.success(`Orden de Compra ${idOrden} creada exitosamente`);

    // Limpiar formulario
    setLineas([]);
    setProveedorId('');
    setComentarios('');
    form.reset();
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
                <Select value={proveedorId} onValueChange={setProveedorId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar proveedor" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROVEEDORES.map((prov) => (
                      <SelectItem key={prov.id} value={prov.id}>
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
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar artículo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {articulos.map((art) => (
                            <SelectItem key={art.id} value={art.id}>
                              {art.nombre}
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
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value) || 0)
                          }
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
              disabled={lineas.length === 0 || !proveedorId}
            >
              Guardar Orden (Pendiente)
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
