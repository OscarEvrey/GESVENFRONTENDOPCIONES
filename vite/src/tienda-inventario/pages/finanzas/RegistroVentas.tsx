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
  CheckCircle,
  DollarSign,
  Minus,
  Package,
  Plus,
  ShoppingBag,
  Trash2,
  User,
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
import { useContextoInstalacion } from '../../context/ContextoInstalacion';

// ============ TIPOS ============
interface Cliente {
  id: string;
  nombre: string;
  rfc: string;
  email: string;
  telefono: string;
  saldo: number;
}

interface ProductoDisponible {
  id: string;
  codigo: string;
  nombre: string;
  categoria: string;
  stockActual: number;
  precioVenta: number;
}

interface LineaVenta {
  productoId: string;
  productoCodigo: string;
  productoNombre: string;
  cantidad: number;
  precioUnitario: number;
  descuento: number;
  subtotal: number;
}

// ============ DATOS FICTICIOS - CLIENTES ============
const clientesFicticios: Cliente[] = [
  {
    id: 'cli-001',
    nombre: 'Comercializadora del Norte SA de CV',
    rfc: 'CNO920815AB0',
    email: 'compras@comnorte.com',
    telefono: '81-1234-5678',
    saldo: 15000.0,
  },
  {
    id: 'cli-002',
    nombre: 'Distribuidora Regio Express',
    rfc: 'DRE881023CD5',
    email: 'ventas@regioexpress.mx',
    telefono: '81-8765-4321',
    saldo: 8500.0,
  },
  {
    id: 'cli-003',
    nombre: 'Tiendas Don Manuel',
    rfc: 'TDM950612GH3',
    email: 'pedidos@donmanuel.com',
    telefono: '81-2468-1357',
    saldo: 0,
  },
  {
    id: 'cli-004',
    nombre: 'Abarrotes La Esperanza',
    rfc: 'ALE870430JK7',
    email: 'contacto@laesperanza.mx',
    telefono: '81-1357-2468',
    saldo: 3200.0,
  },
  {
    id: 'cli-005',
    nombre: 'Supermercados Familia Unida',
    rfc: 'SFU910215LM9',
    email: 'compras@familiaunida.com',
    telefono: '81-9876-5432',
    saldo: 0,
  },
];

// ============ DATOS FICTICIOS - PRODUCTOS POR TIPO DE INSTALACIÓN ============
const productosAlmacenConStock: ProductoDisponible[] = [
  {
    id: 'pa-001',
    codigo: 'REF-001',
    nombre: 'Coca-Cola 600ml',
    categoria: 'Refrescos',
    stockActual: 2500,
    precioVenta: 18.5,
  },
  {
    id: 'pa-002',
    codigo: 'REF-002',
    nombre: 'Pepsi 600ml',
    categoria: 'Refrescos',
    stockActual: 1800,
    precioVenta: 17.5,
  },
  {
    id: 'pa-003',
    codigo: 'REF-003',
    nombre: 'Sprite 600ml',
    categoria: 'Refrescos',
    stockActual: 150,
    precioVenta: 17.0,
  },
  // REF-004 Fanta Naranja tiene stock 0, NO debe aparecer
  {
    id: 'pa-005',
    codigo: 'REF-005',
    nombre: 'Agua Ciel 1L',
    categoria: 'Agua',
    stockActual: 3200,
    precioVenta: 12.0,
  },
  {
    id: 'pa-006',
    codigo: 'SNK-001',
    nombre: 'Sabritas Original 45g',
    categoria: 'Snacks',
    stockActual: 1500,
    precioVenta: 15.0,
  },
  {
    id: 'pa-007',
    codigo: 'SNK-002',
    nombre: 'Doritos Nacho 62g',
    categoria: 'Snacks',
    stockActual: 800,
    precioVenta: 18.5,
  },
  {
    id: 'pa-008',
    codigo: 'SNK-003',
    nombre: 'Cheetos Flamin Hot 52g',
    categoria: 'Snacks',
    stockActual: 50,
    precioVenta: 16.0,
  },
  {
    id: 'pa-009',
    codigo: 'SNK-004',
    nombre: 'Ruffles Queso 45g',
    categoria: 'Snacks',
    stockActual: 650,
    precioVenta: 15.5,
  },
  {
    id: 'pa-010',
    codigo: 'SNK-005',
    nombre: 'Takis Fuego 68g',
    categoria: 'Snacks',
    stockActual: 420,
    precioVenta: 19.0,
  },
  {
    id: 'pa-011',
    codigo: 'REF-006',
    nombre: 'Jumex Mango 335ml',
    categoria: 'Jugos',
    stockActual: 980,
    precioVenta: 14.5,
  },
  // REF-007 Del Valle Naranja tiene stock 0, NO debe aparecer
];

const productosOficinasConStock: ProductoDisponible[] = [
  {
    id: 'po-001',
    codigo: 'PAP-001',
    nombre: 'Hojas Blancas Carta (500)',
    categoria: 'Papelería',
    stockActual: 85,
    precioVenta: 95.0,
  },
  {
    id: 'po-002',
    codigo: 'PAP-002',
    nombre: 'Plumas BIC Azul (12)',
    categoria: 'Papelería',
    stockActual: 45,
    precioVenta: 48.0,
  },
  {
    id: 'po-003',
    codigo: 'PAP-003',
    nombre: 'Lápices #2 (12)',
    categoria: 'Papelería',
    stockActual: 8,
    precioVenta: 35.0,
  },
  {
    id: 'po-004',
    codigo: 'PAP-004',
    nombre: 'Folders Carta (25)',
    categoria: 'Papelería',
    stockActual: 32,
    precioVenta: 85.0,
  },
  // PAP-005 Clips tiene stock 0, NO debe aparecer
  {
    id: 'po-006',
    codigo: 'CON-001',
    nombre: 'Toner HP 85A',
    categoria: 'Consumibles',
    stockActual: 12,
    precioVenta: 650.0,
  },
  {
    id: 'po-007',
    codigo: 'CON-002',
    nombre: 'Cartucho Canon PG-245',
    categoria: 'Consumibles',
    stockActual: 3,
    precioVenta: 380.0,
  },
  {
    id: 'po-008',
    codigo: 'CON-003',
    nombre: 'Cinta para Empaque (6)',
    categoria: 'Consumibles',
    stockActual: 28,
    precioVenta: 120.0,
  },
  {
    id: 'po-009',
    codigo: 'PAP-006',
    nombre: 'Post-it Colores (5)',
    categoria: 'Papelería',
    stockActual: 22,
    precioVenta: 75.0,
  },
  {
    id: 'po-010',
    codigo: 'CON-004',
    nombre: 'Café Nescafé Clásico 200g',
    categoria: 'Consumibles',
    stockActual: 15,
    precioVenta: 145.0,
  },
  {
    id: 'po-011',
    codigo: 'CON-005',
    nombre: 'Azúcar 1kg',
    categoria: 'Consumibles',
    stockActual: 6,
    precioVenta: 35.0,
  },
  // CON-006 Vasos Desechables tiene stock 0, NO debe aparecer
];

// ============ COMPONENTE PRINCIPAL ============
export function RegistroVentasPage() {
  const { instalacionActiva } = useContextoInstalacion();

  // Estados del formulario
  const [clienteId, setClienteId] = useState<string>('');
  const [productoId, setProductoId] = useState<string>('');
  const [cantidad, setCantidad] = useState<number>(1);
  const [precioVenta, setPrecioVenta] = useState<number>(0);
  const [descuento, setDescuento] = useState<number>(0);
  const [lineasVenta, setLineasVenta] = useState<LineaVenta[]>([]);
  const [mensajeExito, setMensajeExito] = useState<string>('');
  const [ventaId, setVentaId] = useState<number>(1);

  // Obtener productos con stock > 0 según la instalación
  const productosDisponibles = useMemo(() => {
    if (!instalacionActiva) return [];
    const productos =
      instalacionActiva.tipo === 'almacen'
        ? productosAlmacenConStock
        : productosOficinasConStock;
    // Filtrar solo productos con stock > 0
    return productos.filter((p) => p.stockActual > 0);
  }, [instalacionActiva]);

  // Producto seleccionado
  const productoSeleccionado = useMemo(() => {
    return productosDisponibles.find((p) => p.id === productoId);
  }, [productosDisponibles, productoId]);

  // Cliente seleccionado
  const clienteSeleccionado = useMemo(() => {
    return clientesFicticios.find((c) => c.id === clienteId);
  }, [clienteId]);

  // Total de la venta
  const totalVenta = useMemo(() => {
    return lineasVenta.reduce((sum, linea) => sum + linea.subtotal, 0);
  }, [lineasVenta]);

  // Cuando cambia el producto, actualizar el precio de venta
  const handleProductoChange = (id: string) => {
    setProductoId(id);
    const producto = productosDisponibles.find((p) => p.id === id);
    if (producto) {
      setPrecioVenta(producto.precioVenta);
    } else {
      setPrecioVenta(0);
    }
    setCantidad(1);
    setDescuento(0);
  };

  // Agregar línea de venta
  const agregarLinea = () => {
    if (!productoSeleccionado || cantidad <= 0 || precioVenta < 1) {
      return;
    }

    // Verificar que no exceda el stock
    const cantidadYaEnVenta = lineasVenta
      .filter((l) => l.productoId === productoId)
      .reduce((sum, l) => sum + l.cantidad, 0);

    if (cantidadYaEnVenta + cantidad > productoSeleccionado.stockActual) {
      alert(
        `Stock insuficiente. Disponible: ${productoSeleccionado.stockActual - cantidadYaEnVenta}`,
      );
      return;
    }

    const subtotal = cantidad * precioVenta * (1 - descuento / 100);

    const nuevaLinea: LineaVenta = {
      productoId: productoSeleccionado.id,
      productoCodigo: productoSeleccionado.codigo,
      productoNombre: productoSeleccionado.nombre,
      cantidad,
      precioUnitario: precioVenta,
      descuento,
      subtotal,
    };

    setLineasVenta((prev) => [...prev, nuevaLinea]);

    // Limpiar campos
    setProductoId('');
    setCantidad(1);
    setPrecioVenta(0);
    setDescuento(0);
  };

  // Eliminar línea
  const eliminarLinea = (index: number) => {
    setLineasVenta((prev) => prev.filter((_, i) => i !== index));
  };

  // Guardar venta
  const guardarVenta = () => {
    if (!clienteId || lineasVenta.length === 0) {
      alert('Debe seleccionar un cliente y agregar al menos un producto.');
      return;
    }

    const idVenta = `VTA-2024-${String(ventaId).padStart(4, '0')}`;
    setVentaId((prev) => prev + 1);

    // Simular guardado
    setMensajeExito(
      `Venta ${idVenta} registrada exitosamente. Pendiente de facturación.`,
    );

    // Limpiar formulario
    setClienteId('');
    setLineasVenta([]);

    // Ocultar mensaje después de 5 segundos
    setTimeout(() => {
      setMensajeExito('');
    }, 5000);
  };

  // Columnas de la tabla
  const columns = useMemo<ColumnDef<LineaVenta>[]>(
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
        size: 200,
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
        accessorKey: 'precioUnitario',
        header: ({ column }) => (
          <DataGridColumnHeader title="Precio Unit." column={column} />
        ),
        cell: (info) => `$${info.getValue<number>().toFixed(2)}`,
        size: 120,
      },
      {
        accessorKey: 'descuento',
        header: ({ column }) => (
          <DataGridColumnHeader title="Descuento" column={column} />
        ),
        cell: (info) => `${info.getValue<number>()}%`,
        size: 100,
      },
      {
        accessorKey: 'subtotal',
        header: ({ column }) => (
          <DataGridColumnHeader title="Subtotal" column={column} />
        ),
        cell: (info) => (
          <span className="font-semibold">
            ${info.getValue<number>().toFixed(2)}
          </span>
        ),
        size: 120,
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
    [],
  );

  const table = useReactTable({
    data: lineasVenta,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
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
                  <ShoppingBag className="size-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Registro de Ventas</h2>
                  <p className="text-sm text-muted-foreground">
                    Instalación: {instalacionActiva.nombre}
                  </p>
                </div>
              </div>
              <Badge
                variant={instalacionActiva.tipo === 'almacen' ? 'success' : 'primary'}
                appearance="light"
                size="lg"
              >
                {instalacionActiva.tipo === 'almacen' ? 'Almacén' : 'Oficinas'}
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
            <AlertTitle>¡Venta registrada!</AlertTitle>
            <AlertDescription>{mensajeExito}</AlertDescription>
          </Alert>
        )}

        {/* Formulario de Venta */}
        <div className="grid lg:grid-cols-3 gap-5">
          {/* Selección de Cliente */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="size-5" />
                Datos del Cliente
              </CardTitle>
              <CardDescription>
                Seleccione el cliente para esta venta
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Cliente *</Label>
                <Select value={clienteId} onValueChange={setClienteId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar cliente..." />
                  </SelectTrigger>
                  <SelectContent>
                    {clientesFicticios.map((cliente) => (
                      <SelectItem key={cliente.id} value={cliente.id}>
                        {cliente.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {clienteSeleccionado && (
                <div className="space-y-2 p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm">
                    <span className="font-medium">RFC:</span>{' '}
                    {clienteSeleccionado.rfc}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Email:</span>{' '}
                    {clienteSeleccionado.email}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Teléfono:</span>{' '}
                    {clienteSeleccionado.telefono}
                  </p>
                  {clienteSeleccionado.saldo > 0 && (
                    <div className="pt-2 border-t">
                      <Badge variant="warning" appearance="light">
                        Saldo pendiente: ${clienteSeleccionado.saldo.toFixed(2)}
                      </Badge>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Agregar Productos */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="size-5" />
                Agregar Productos
              </CardTitle>
              <CardDescription>
                Solo se muestran productos con stock disponible
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-5 gap-4 items-end">
                {/* Producto */}
                <div className="md:col-span-2 space-y-2">
                  <Label>Artículo *</Label>
                  <Select value={productoId} onValueChange={handleProductoChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar artículo..." />
                    </SelectTrigger>
                    <SelectContent>
                      {productosDisponibles.map((producto) => (
                        <SelectItem key={producto.id} value={producto.id}>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs">
                              {producto.codigo}
                            </span>
                            <span>{producto.nombre}</span>
                            <Badge variant="outline" size="sm">
                              Stock: {producto.stockActual}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Cantidad */}
                <div className="space-y-2">
                  <Label>Cantidad *</Label>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCantidad((prev) => Math.max(1, prev - 1))}
                      disabled={cantidad <= 1}
                    >
                      <Minus className="size-4" />
                    </Button>
                    <Input
                      type="number"
                      min={1}
                      value={cantidad}
                      onChange={(e) => setCantidad(parseInt(e.target.value) || 1)}
                      className="text-center"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCantidad((prev) => prev + 1)}
                      disabled={
                        productoSeleccionado
                          ? cantidad >= productoSeleccionado.stockActual
                          : true
                      }
                    >
                      <Plus className="size-4" />
                    </Button>
                  </div>
                </div>

                {/* Precio Venta */}
                <div className="space-y-2">
                  <Label>Precio (mín. $1.00) *</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      type="number"
                      min={1}
                      step={0.01}
                      value={precioVenta}
                      onChange={(e) => setPrecioVenta(parseFloat(e.target.value) || 0)}
                      className="pl-9"
                    />
                  </div>
                </div>

                {/* Descuento */}
                <div className="space-y-2">
                  <Label>Descuento %</Label>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={descuento}
                    onChange={(e) => setDescuento(parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <Button
                  onClick={agregarLinea}
                  disabled={
                    !productoId || cantidad <= 0 || precioVenta < 1
                  }
                >
                  <Plus className="size-4 me-2" />
                  Agregar a la Venta
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabla de Líneas de Venta */}
        <DataGrid table={table} recordCount={lineasVenta.length}>
          <Card>
            <CardHeader>
              <CardTitle>Detalle de la Venta</CardTitle>
              <CardDescription>
                {lineasVenta.length} producto(s) agregado(s)
              </CardDescription>
            </CardHeader>
            {lineasVenta.length > 0 ? (
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
                    <div className="space-y-2 text-right">
                      <p className="text-sm text-muted-foreground">
                        Total de productos:{' '}
                        {lineasVenta.reduce((sum, l) => sum + l.cantidad, 0)}
                      </p>
                      <p className="text-2xl font-bold">
                        Total: ${totalVenta.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </>
            ) : (
              <CardContent>
                <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                  <Package className="size-12 mb-4 opacity-30" />
                  <p>No hay productos agregados a la venta</p>
                  <p className="text-sm">
                    Seleccione un artículo y presione &quot;Agregar a la Venta&quot;
                  </p>
                </div>
              </CardContent>
            )}
            <CardFooter className="justify-between">
              <div>
                {!clienteId && lineasVenta.length > 0 && (
                  <div className="flex items-center gap-2 text-amber-600">
                    <AlertCircle className="size-4" />
                    <span className="text-sm">
                      Debe seleccionar un cliente para guardar la venta
                    </span>
                  </div>
                )}
              </div>
              <Button
                size="lg"
                onClick={guardarVenta}
                disabled={!clienteId || lineasVenta.length === 0}
              >
                <CheckCircle className="size-4 me-2" />
                Guardar Venta
              </Button>
            </CardFooter>
          </Card>
        </DataGrid>

        {/* Nota informativa */}
        <Alert variant="mono">
          <AlertIcon>
            <AlertCircle className="size-4" />
          </AlertIcon>
          <AlertTitle>Información</AlertTitle>
          <AlertDescription>
            Las ventas registradas quedarán pendientes de facturación. Puede
            generar la factura desde el módulo de &quot;Carga de Facturas&quot;.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
