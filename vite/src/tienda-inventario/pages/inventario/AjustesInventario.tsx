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
  ArrowDown,
  ArrowUp,
  CheckCircle,
  Clock,
  Package,
  Save,
} from 'lucide-react';
import { useInstalacionActivaObligatoria } from '../../context/ContextoInstalacion';
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
import { Textarea } from '@/components/ui/textarea';

// ============ TIPOS ============
type TipoAjuste = 'entrada' | 'salida';

interface ProductoInventario {
  id: string;
  codigo: string;
  nombre: string;
  stockActual: number;
  unidad: string;
}

interface AjusteRegistrado {
  id: string;
  fecha: string;
  producto: string;
  tipoAjuste: TipoAjuste;
  cantidad: number;
  stockAnterior: number;
  stockNuevo: number;
  motivo: string;
  usuario: string;
}

// ============ CONSTANTES ============
const MOTIVOS_AJUSTE = [
  'Hallazgo en toma física',
  'Merma por daño',
  'Merma por caducidad',
  'Extravío o robo',
  'Error en conteo anterior',
  'Donación',
  'Uso interno no registrado',
  'Otro (especificar en observaciones)',
];

// ============ DATOS FICTICIOS ============
const productosInventarioAlmacen: ProductoInventario[] = [
  { id: 'p1', codigo: 'REF-001', nombre: 'Coca-Cola 600ml', stockActual: 2500, unidad: 'Pza' },
  { id: 'p2', codigo: 'REF-002', nombre: 'Pepsi 600ml', stockActual: 1800, unidad: 'Pza' },
  { id: 'p3', codigo: 'SNK-001', nombre: 'Sabritas Original 45g', stockActual: 1500, unidad: 'Pza' },
  { id: 'p4', codigo: 'SNK-002', nombre: 'Doritos Nacho 62g', stockActual: 800, unidad: 'Pza' },
  { id: 'p5', codigo: 'REF-005', nombre: 'Agua Ciel 1L', stockActual: 3200, unidad: 'Pza' },
];

const productosInventarioOficinas: ProductoInventario[] = [
  { id: 'p6', codigo: 'PAP-001', nombre: 'Hojas Blancas Carta (500)', stockActual: 85, unidad: 'Paq' },
  { id: 'p7', codigo: 'PAP-002', nombre: 'Plumas BIC Azul (12)', stockActual: 45, unidad: 'Cja' },
  { id: 'p8', codigo: 'CON-001', nombre: 'Toner HP 85A', stockActual: 12, unidad: 'Pza' },
  { id: 'p9', codigo: 'CON-004', nombre: 'Café Nescafé Clásico 200g', stockActual: 15, unidad: 'Fco' },
];

const ajustesRecientes: AjusteRegistrado[] = [
  {
    id: 'aj-001',
    fecha: '2024-01-10 09:30',
    producto: 'Coca-Cola 600ml',
    tipoAjuste: 'salida',
    cantidad: 50,
    stockAnterior: 2550,
    stockNuevo: 2500,
    motivo: 'Merma por daño',
    usuario: 'Usuario Sistema',
  },
  {
    id: 'aj-002',
    fecha: '2024-01-09 14:15',
    producto: 'Hojas Blancas Carta (500)',
    tipoAjuste: 'entrada',
    cantidad: 10,
    stockAnterior: 75,
    stockNuevo: 85,
    motivo: 'Hallazgo en toma física',
    usuario: 'Usuario Sistema',
  },
  {
    id: 'aj-003',
    fecha: '2024-01-08 11:45',
    producto: 'Toner HP 85A',
    tipoAjuste: 'salida',
    cantidad: 3,
    stockAnterior: 15,
    stockNuevo: 12,
    motivo: 'Extravío o robo',
    usuario: 'Usuario Sistema',
  },
];

// ============ COMPONENTE PRINCIPAL ============
export function AjustesInventarioPage() {
  const instalacionActiva = useInstalacionActivaObligatoria();

  // Estados del formulario
  const [tipoAjuste, setTipoAjuste] = useState<TipoAjuste>('entrada');
  const [productoId, setProductoId] = useState<string>('');
  const [cantidad, setCantidad] = useState<number>(1);
  const [motivoSeleccionado, setMotivoSeleccionado] = useState<string>('');
  const [observaciones, setObservaciones] = useState<string>('');
  const [mensajeExito, setMensajeExito] = useState<string>('');
  const [errores, setErrores] = useState<Record<string, string>>({});

  // Productos según la instalación
  const productosInventario = useMemo(() => {
    return instalacionActiva.tipo === 'almacen'
      ? productosInventarioAlmacen
      : productosInventarioOficinas;
  }, [instalacionActiva]);

  // Producto seleccionado
  const productoSeleccionado = useMemo(() => {
    return productosInventario.find((p) => p.id === productoId);
  }, [productosInventario, productoId]);

  // Stock nuevo después del ajuste
  const stockNuevo = useMemo(() => {
    if (!productoSeleccionado) return 0;
    if (tipoAjuste === 'entrada') {
      return productoSeleccionado.stockActual + cantidad;
    } else {
      return productoSeleccionado.stockActual - cantidad;
    }
  }, [productoSeleccionado, tipoAjuste, cantidad]);

  // Validar formulario
  const validarFormulario = (): boolean => {
    const nuevosErrores: Record<string, string> = {};

    if (!productoId) {
      nuevosErrores.producto = 'Debe seleccionar un producto';
    }

    if (cantidad <= 0) {
      nuevosErrores.cantidad = 'La cantidad debe ser mayor a 0';
    }

    if (tipoAjuste === 'salida' && productoSeleccionado && cantidad > productoSeleccionado.stockActual) {
      nuevosErrores.cantidad = `La cantidad no puede exceder el stock actual (${productoSeleccionado.stockActual})`;
    }

    // MOTIVO OBLIGATORIO PARA AUDITORÍA
    if (!motivoSeleccionado) {
      nuevosErrores.motivo = 'El motivo de ajuste es obligatorio para fines de auditoría';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  // Aplicar ajuste
  const aplicarAjuste = () => {
    if (!validarFormulario()) return;

    const tipoTexto = tipoAjuste === 'entrada' ? 'Entrada por Hallazgo' : 'Salida por Merma/Daño';
    
    setMensajeExito(
      `Ajuste aplicado correctamente. ${tipoTexto}: ${cantidad} ${productoSeleccionado?.unidad} de "${productoSeleccionado?.nombre}". Stock actualizado de ${productoSeleccionado?.stockActual} a ${stockNuevo}.`
    );

    // Limpiar formulario
    setProductoId('');
    setCantidad(1);
    setMotivoSeleccionado('');
    setObservaciones('');
    setErrores({});

    setTimeout(() => {
      setMensajeExito('');
    }, 6000);
  };

  // Columnas de la tabla de ajustes recientes
  const columnas = useMemo<ColumnDef<AjusteRegistrado>[]>(
    () => [
      {
        accessorKey: 'fecha',
        header: ({ column }) => (
          <DataGridColumnHeader title="Fecha/Hora" column={column} />
        ),
        size: 150,
      },
      {
        accessorKey: 'producto',
        header: ({ column }) => (
          <DataGridColumnHeader title="Producto" column={column} />
        ),
        size: 200,
      },
      {
        accessorKey: 'tipoAjuste',
        header: ({ column }) => (
          <DataGridColumnHeader title="Tipo" column={column} />
        ),
        cell: (info) => {
          const tipo = info.getValue<TipoAjuste>();
          return (
            <Badge variant={tipo === 'entrada' ? 'success' : 'destructive'} appearance="light">
              {tipo === 'entrada' && <ArrowUp className="size-3 me-1" />}
              {tipo === 'salida' && <ArrowDown className="size-3 me-1" />}
              {tipo === 'entrada' ? 'Entrada' : 'Salida'}
            </Badge>
          );
        },
        size: 120,
      },
      {
        accessorKey: 'cantidad',
        header: ({ column }) => (
          <DataGridColumnHeader title="Cantidad" column={column} />
        ),
        cell: (info) => {
          const row = info.row.original;
          const signo = row.tipoAjuste === 'entrada' ? '+' : '-';
          return (
            <span className={row.tipoAjuste === 'entrada' ? 'text-green-600' : 'text-red-600'}>
              {signo}{info.getValue<number>().toLocaleString()}
            </span>
          );
        },
        size: 100,
      },
      {
        id: 'cambioStock',
        header: 'Stock',
        cell: (info) => {
          const row = info.row.original;
          return (
            <span className="text-sm">
              {row.stockAnterior} → {row.stockNuevo}
            </span>
          );
        },
        size: 120,
      },
      {
        accessorKey: 'motivo',
        header: ({ column }) => (
          <DataGridColumnHeader title="Motivo" column={column} />
        ),
        size: 180,
      },
      {
        accessorKey: 'usuario',
        header: ({ column }) => (
          <DataGridColumnHeader title="Usuario" column={column} />
        ),
        size: 140,
      },
    ],
    []
  );

  const tabla = useReactTable({
    data: ajustesRecientes,
    columns: columnas,
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
                  <Package className="size-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Ajustes de Inventario (Toma Física)</h2>
                  <p className="text-sm text-muted-foreground">
                    Instalación: {instalacionActiva.nombre}
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
            <AlertTitle>¡Ajuste Aplicado!</AlertTitle>
            <AlertDescription>{mensajeExito}</AlertDescription>
          </Alert>
        )}

        {/* Alerta informativa */}
        <Alert variant="warning">
          <AlertIcon>
            <AlertCircle className="size-4" />
          </AlertIcon>
          <AlertTitle>Importante</AlertTitle>
          <AlertDescription>
            Todos los ajustes de inventario requieren un <strong>motivo obligatorio</strong> para
            fines de auditoría. El sistema registrará automáticamente el usuario, fecha y hora
            del ajuste.
          </AlertDescription>
        </Alert>

        {/* Formulario de Ajuste */}
        <Card>
          <CardHeader>
            <CardTitle>Nuevo Ajuste de Inventario</CardTitle>
            <CardDescription>
              Corrija discrepancias entre la existencia teórica y el conteo físico
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Tipo de Ajuste */}
            <div className="space-y-2">
              <Label>Tipo de Ajuste *</Label>
              <Select value={tipoAjuste} onValueChange={(v) => setTipoAjuste(v as TipoAjuste)}>
                <SelectTrigger className="w-full md:w-80">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="entrada">
                    <div className="flex items-center gap-2">
                      <ArrowUp className="size-4 text-green-600" />
                      <span>Entrada por Hallazgo</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="salida">
                    <div className="flex items-center gap-2">
                      <ArrowDown className="size-4 text-red-600" />
                      <span>Salida por Merma/Daño</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Producto y Cantidad */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Artículo *</Label>
                <Select value={productoId} onValueChange={setProductoId}>
                  <SelectTrigger className={errores.producto ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Seleccionar artículo..." />
                  </SelectTrigger>
                  <SelectContent>
                    {productosInventario.map((p) => (
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
                {errores.producto && (
                  <p className="text-xs text-red-500">{errores.producto}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Cantidad a Ajustar *</Label>
                <Input
                  type="number"
                  min={1}
                  value={cantidad}
                  onChange={(e) => setCantidad(parseInt(e.target.value) || 0)}
                  className={errores.cantidad ? 'border-red-500' : ''}
                />
                {errores.cantidad && (
                  <p className="text-xs text-red-500">{errores.cantidad}</p>
                )}
              </div>
            </div>

            {/* Información de Stock */}
            {productoSeleccionado && (
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Existencia Sistema</p>
                    <p className="text-2xl font-bold">{productoSeleccionado.stockActual}</p>
                    <p className="text-xs text-muted-foreground">{productoSeleccionado.unidad}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Cantidad Ajustada</p>
                    <p className={`text-2xl font-bold ${tipoAjuste === 'entrada' ? 'text-green-600' : 'text-red-600'}`}>
                      {tipoAjuste === 'entrada' ? '+' : '-'}{cantidad}
                    </p>
                    <p className="text-xs text-muted-foreground">{productoSeleccionado.unidad}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Stock Resultante</p>
                    <p className="text-2xl font-bold text-primary">{stockNuevo}</p>
                    <p className="text-xs text-muted-foreground">{productoSeleccionado.unidad}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Motivo de Ajuste - OBLIGATORIO */}
            <div className="space-y-2">
              <Label className="flex items-center gap-1">
                Motivo de Ajuste *
                <Badge variant="destructive" size="sm">Obligatorio</Badge>
              </Label>
              <Select value={motivoSeleccionado} onValueChange={setMotivoSeleccionado}>
                <SelectTrigger className={errores.motivo ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Seleccionar motivo..." />
                </SelectTrigger>
                <SelectContent>
                  {MOTIVOS_AJUSTE.map((motivo) => (
                    <SelectItem key={motivo} value={motivo}>
                      {motivo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errores.motivo && (
                <p className="text-xs text-red-500">{errores.motivo}</p>
              )}
            </div>

            {/* Observaciones */}
            <div className="space-y-2">
              <Label>Observaciones Adicionales</Label>
              <Textarea
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                placeholder="Detalles adicionales para fines de auditoría..."
                rows={3}
              />
            </div>

            {/* Leyenda de auditoría */}
            <div className="text-xs text-muted-foreground border-t pt-3 mt-3">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                El ajuste será registrado por Usuario 1 el {new Date().toLocaleDateString('es-MX')} a las {new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </CardContent>
          <CardFooter className="justify-end">
            <Button onClick={aplicarAjuste} size="lg">
              <Save className="size-4 me-2" />
              Aplicar Ajuste
            </Button>
          </CardFooter>
        </Card>

        {/* Tabla de Ajustes Recientes */}
        <DataGrid table={tabla} recordCount={ajustesRecientes.length}>
          <Card>
            <CardHeader>
              <CardTitle>Ajustes Recientes</CardTitle>
              <CardDescription>
                Historial de ajustes de inventario realizados en esta instalación
              </CardDescription>
            </CardHeader>
            <CardTable>
              <ScrollArea>
                <DataGridTable />
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </CardTable>
            <CardFooter className="text-sm text-muted-foreground">
              Total: {ajustesRecientes.length} ajustes registrados
            </CardFooter>
          </Card>
        </DataGrid>
      </div>
    </div>
  );
}
