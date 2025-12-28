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
import { AlertTriangle, Package, Search } from 'lucide-react';
 
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
import { useInstalacionActivaObligatoria } from '../../context/ContextoInstalacion';
import { useInventarioApi } from '../../hooks/useGesvenApi';

// ============ TIPOS ============
interface ProductoInventario {
  id: string;
  codigo: string;
  nombre: string;
  categoria: string;
  unidad: string;
  stockActual: number;
  stockMinimo: number;
  precioUnitario: number;
  estado: 'disponible' | 'bajo_stock' | 'agotado';
  ubicacion: string;
}

// ============ DATOS FICTICIOS - ALMACÉN (Refrescos y Snacks) ============
// TODO: Datos de ejemplo para desarrollo - eliminar cuando se conecte al backend
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _productosAlmacen: ProductoInventario[] = [
  {
    id: '1',
    codigo: 'REF-001',
    nombre: 'Coca-Cola 600ml',
    categoria: 'Refrescos',
    unidad: 'Pieza',
    stockActual: 2500,
    stockMinimo: 500,
    precioUnitario: 18.5,
    estado: 'disponible',
    ubicacion: 'A-01-01',
  },
  {
    id: '2',
    codigo: 'REF-002',
    nombre: 'Pepsi 600ml',
    categoria: 'Refrescos',
    unidad: 'Pieza',
    stockActual: 1800,
    stockMinimo: 400,
    precioUnitario: 17.5,
    estado: 'disponible',
    ubicacion: 'A-01-02',
  },
  {
    id: '3',
    codigo: 'REF-003',
    nombre: 'Sprite 600ml',
    categoria: 'Refrescos',
    unidad: 'Pieza',
    stockActual: 150,
    stockMinimo: 300,
    precioUnitario: 17.0,
    estado: 'bajo_stock',
    ubicacion: 'A-01-03',
  },
  {
    id: '4',
    codigo: 'REF-004',
    nombre: 'Fanta Naranja 600ml',
    categoria: 'Refrescos',
    unidad: 'Pieza',
    stockActual: 0,
    stockMinimo: 200,
    precioUnitario: 17.0,
    estado: 'agotado',
    ubicacion: 'A-01-04',
  },
  {
    id: '5',
    codigo: 'REF-005',
    nombre: 'Agua Ciel 1L',
    categoria: 'Agua',
    unidad: 'Pieza',
    stockActual: 3200,
    stockMinimo: 800,
    precioUnitario: 12.0,
    estado: 'disponible',
    ubicacion: 'A-02-01',
  },
  {
    id: '6',
    codigo: 'SNK-001',
    nombre: 'Sabritas Original 45g',
    categoria: 'Snacks',
    unidad: 'Pieza',
    stockActual: 1500,
    stockMinimo: 300,
    precioUnitario: 15.0,
    estado: 'disponible',
    ubicacion: 'B-01-01',
  },
  {
    id: '7',
    codigo: 'SNK-002',
    nombre: 'Doritos Nacho 62g',
    categoria: 'Snacks',
    unidad: 'Pieza',
    stockActual: 800,
    stockMinimo: 200,
    precioUnitario: 18.5,
    estado: 'disponible',
    ubicacion: 'B-01-02',
  },
  {
    id: '8',
    codigo: 'SNK-003',
    nombre: 'Cheetos Flamin Hot 52g',
    categoria: 'Snacks',
    unidad: 'Pieza',
    stockActual: 50,
    stockMinimo: 150,
    precioUnitario: 16.0,
    estado: 'bajo_stock',
    ubicacion: 'B-01-03',
  },
  {
    id: '9',
    codigo: 'SNK-004',
    nombre: 'Ruffles Queso 45g',
    categoria: 'Snacks',
    unidad: 'Pieza',
    stockActual: 650,
    stockMinimo: 200,
    precioUnitario: 15.5,
    estado: 'disponible',
    ubicacion: 'B-01-04',
  },
  {
    id: '10',
    codigo: 'SNK-005',
    nombre: 'Takis Fuego 68g',
    categoria: 'Snacks',
    unidad: 'Pieza',
    stockActual: 420,
    stockMinimo: 150,
    precioUnitario: 19.0,
    estado: 'disponible',
    ubicacion: 'B-02-01',
  },
  {
    id: '11',
    codigo: 'REF-006',
    nombre: 'Jumex Mango 335ml',
    categoria: 'Jugos',
    unidad: 'Pieza',
    stockActual: 980,
    stockMinimo: 200,
    precioUnitario: 14.5,
    estado: 'disponible',
    ubicacion: 'A-03-01',
  },
  {
    id: '12',
    codigo: 'REF-007',
    nombre: 'Del Valle Naranja 1L',
    categoria: 'Jugos',
    unidad: 'Pieza',
    stockActual: 0,
    stockMinimo: 100,
    precioUnitario: 28.0,
    estado: 'agotado',
    ubicacion: 'A-03-02',
  },
];

// ============ DATOS FICTICIOS - OFICINAS (Papelería y Consumibles) ============
// TODO: Datos de ejemplo para desarrollo - eliminar cuando se conecte al backend
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _productosOficinas: ProductoInventario[] = [
  {
    id: '1',
    codigo: 'PAP-001',
    nombre: 'Hojas Blancas Carta (500)',
    categoria: 'Papelería',
    unidad: 'Paquete',
    stockActual: 85,
    stockMinimo: 20,
    precioUnitario: 95.0,
    estado: 'disponible',
    ubicacion: 'E-01-01',
  },
  {
    id: '2',
    codigo: 'PAP-002',
    nombre: 'Plumas BIC Azul (12)',
    categoria: 'Papelería',
    unidad: 'Caja',
    stockActual: 45,
    stockMinimo: 10,
    precioUnitario: 48.0,
    estado: 'disponible',
    ubicacion: 'E-01-02',
  },
  {
    id: '3',
    codigo: 'PAP-003',
    nombre: 'Lápices #2 (12)',
    categoria: 'Papelería',
    unidad: 'Caja',
    stockActual: 8,
    stockMinimo: 15,
    precioUnitario: 35.0,
    estado: 'bajo_stock',
    ubicacion: 'E-01-03',
  },
  {
    id: '4',
    codigo: 'PAP-004',
    nombre: 'Folders Carta (25)',
    categoria: 'Papelería',
    unidad: 'Paquete',
    stockActual: 32,
    stockMinimo: 10,
    precioUnitario: 85.0,
    estado: 'disponible',
    ubicacion: 'E-01-04',
  },
  {
    id: '5',
    codigo: 'PAP-005',
    nombre: 'Clips Jumbo (100)',
    categoria: 'Papelería',
    unidad: 'Caja',
    stockActual: 0,
    stockMinimo: 5,
    precioUnitario: 25.0,
    estado: 'agotado',
    ubicacion: 'E-02-01',
  },
  {
    id: '6',
    codigo: 'CON-001',
    nombre: 'Toner HP 85A',
    categoria: 'Consumibles',
    unidad: 'Pieza',
    stockActual: 12,
    stockMinimo: 5,
    precioUnitario: 650.0,
    estado: 'disponible',
    ubicacion: 'F-01-01',
  },
  {
    id: '7',
    codigo: 'CON-002',
    nombre: 'Cartucho Canon PG-245',
    categoria: 'Consumibles',
    unidad: 'Pieza',
    stockActual: 3,
    stockMinimo: 5,
    precioUnitario: 380.0,
    estado: 'bajo_stock',
    ubicacion: 'F-01-02',
  },
  {
    id: '8',
    codigo: 'CON-003',
    nombre: 'Cinta para Empaque (6)',
    categoria: 'Consumibles',
    unidad: 'Paquete',
    stockActual: 28,
    stockMinimo: 10,
    precioUnitario: 120.0,
    estado: 'disponible',
    ubicacion: 'F-02-01',
  },
  {
    id: '9',
    codigo: 'PAP-006',
    nombre: 'Post-it Colores (5)',
    categoria: 'Papelería',
    unidad: 'Paquete',
    stockActual: 22,
    stockMinimo: 8,
    precioUnitario: 75.0,
    estado: 'disponible',
    ubicacion: 'E-02-02',
  },
  {
    id: '10',
    codigo: 'CON-004',
    nombre: 'Café Nescafé Clásico 200g',
    categoria: 'Consumibles',
    unidad: 'Frasco',
    stockActual: 15,
    stockMinimo: 5,
    precioUnitario: 145.0,
    estado: 'disponible',
    ubicacion: 'G-01-01',
  },
  {
    id: '11',
    codigo: 'CON-005',
    nombre: 'Azúcar 1kg',
    categoria: 'Consumibles',
    unidad: 'Bolsa',
    stockActual: 6,
    stockMinimo: 3,
    precioUnitario: 35.0,
    estado: 'disponible',
    ubicacion: 'G-01-02',
  },
  {
    id: '12',
    codigo: 'CON-006',
    nombre: 'Vasos Desechables (50)',
    categoria: 'Consumibles',
    unidad: 'Paquete',
    stockActual: 0,
    stockMinimo: 4,
    precioUnitario: 45.0,
    estado: 'agotado',
    ubicacion: 'G-02-01',
  },
];

// ============ COMPONENTE PRINCIPAL ============
export function InventarioActualPage() {
  const instalacionActiva = useInstalacionActivaObligatoria();
  const [busqueda, setBusqueda] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>('');
  const [estadoFiltro, setEstadoFiltro] = useState<string>('');
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);

  const {
    productos: productosApi,
    cargando: cargandoInventario,
    error: errorInventario,
  } = useInventarioApi(instalacionActiva.instalacionId);

  // Datos desde backend (GET /api/inventario/{instalacionId})
  const datosBase = useMemo(() => {
    return productosApi.map((p) => ({
      id: String(p.productoId),
      codigo: p.codigo,
      nombre: p.nombre,
      categoria: p.categoria,
      unidad: p.unidad,
      stockActual: p.stockActual,
      stockMinimo: p.stockMinimo,
      precioUnitario: p.precioUnitario,
      estado: p.estado,
      ubicacion: p.ubicacion,
    } satisfies ProductoInventario));
  }, [productosApi]);

  // Obtener categorías únicas
  const categorias = useMemo(() => {
    return [...new Set(datosBase.map((item) => item.categoria))];
  }, [datosBase]);

  // Filtrar datos
  const datosFiltrados = useMemo(() => {
    return datosBase.filter((item) => {
      // Filtro de búsqueda
      if (busqueda) {
        const termino = busqueda.toLowerCase();
        if (
          !item.nombre.toLowerCase().includes(termino) &&
          !item.codigo.toLowerCase().includes(termino)
        ) {
          return false;
        }
      }
      // Filtro de categoría
      if (categoriaFiltro && categoriaFiltro !== 'todas' && item.categoria !== categoriaFiltro) {
        return false;
      }
      // Filtro de estado
      if (estadoFiltro && estadoFiltro !== 'todos' && item.estado !== estadoFiltro) {
        return false;
      }
      return true;
    });
  }, [datosBase, busqueda, categoriaFiltro, estadoFiltro]);

  // Estadísticas
  const estadisticas = useMemo(() => {
    const total = datosBase.length;
    const disponibles = datosBase.filter((p) => p.estado === 'disponible').length;
    const bajoStock = datosBase.filter((p) => p.estado === 'bajo_stock').length;
    const agotados = datosBase.filter((p) => p.estado === 'agotado').length;
    return { total, disponibles, bajoStock, agotados };
  }, [datosBase]);

  const columns = useMemo<ColumnDef<ProductoInventario>[]>(
    () => [
      {
        accessorKey: 'codigo',
        header: ({ column }) => (
          <DataGridColumnHeader title="Código" column={column} />
        ),
        size: 100,
      },
      {
        accessorKey: 'nombre',
        header: ({ column }) => (
          <DataGridColumnHeader title="Producto" column={column} />
        ),
        size: 220,
      },
      {
        accessorKey: 'categoria',
        header: ({ column }) => (
          <DataGridColumnHeader title="Categoría" column={column} />
        ),
        size: 120,
      },
      {
        accessorKey: 'unidad',
        header: ({ column }) => (
          <DataGridColumnHeader title="Unidad" column={column} />
        ),
        size: 80,
      },
      {
        accessorKey: 'stockActual',
        header: ({ column }) => (
          <DataGridColumnHeader title="Stock" column={column} />
        ),
        cell: (info) => {
          const valor = info.getValue<number>();
          const stockMinimo = info.row.original.stockMinimo;
          return (
            <span
              className={`font-medium ${valor < stockMinimo ? 'text-amber-600' : ''} ${valor === 0 ? 'text-destructive' : ''}`}
            >
              {valor.toLocaleString()}
            </span>
          );
        },
        size: 100,
      },
      {
        accessorKey: 'ubicacion',
        header: ({ column }) => (
          <DataGridColumnHeader title="Ubicación" column={column} />
        ),
        size: 100,
      },
      {
        accessorKey: 'precioUnitario',
        header: ({ column }) => (
          <DataGridColumnHeader title="Precio" column={column} />
        ),
        cell: (info) => `$${info.getValue<number>().toFixed(2)}`,
        size: 100,
      },
      {
        accessorKey: 'estado',
        header: ({ column }) => (
          <DataGridColumnHeader title="Estado" column={column} />
        ),
        cell: (info) => {
          const estado = info.getValue<string>();
          const variantes: Record<string, 'success' | 'warning' | 'destructive'> =
            {
              disponible: 'success',
              bajo_stock: 'warning',
              agotado: 'destructive',
            };
          const etiquetas: Record<string, string> = {
            disponible: 'Disponible',
            bajo_stock: 'Bajo Stock',
            agotado: 'Agotado',
          };
          return (
            <Badge variant={variantes[estado]} appearance="light">
              {etiquetas[estado]}
            </Badge>
          );
        },
        size: 110,
      },
    ],
    [],
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

  return (
    <div className="container-fluid">
      <div className="grid gap-5 lg:gap-7.5">
        {/* Título Dinámico */}
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Package className="size-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">
                    Inventario de: {instalacionActiva.nombre}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {instalacionActiva.tipo === 'almacen'
                      ? 'Productos: Refrescos y Snacks'
                      : 'Productos: Papelería y Consumibles'}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Badge variant="outline" size="lg">
                  {instalacionActiva.empresa}
                </Badge>
                <Badge
                  variant={instalacionActiva.tipo === 'almacen' ? 'success' : 'primary'}
                  appearance="light"
                  size="lg"
                >
                  {instalacionActiva.tipo === 'almacen' ? 'Almacén' : 'Oficinas'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {cargandoInventario && (
          <div className="text-sm text-muted-foreground">Cargando inventario...</div>
        )}

        {errorInventario && (
          <div className="text-sm text-destructive">{errorInventario}</div>
        )}

        {/* Estadísticas Rápidas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="py-4 text-center">
              <p className="text-2xl font-bold">{estadisticas.total}</p>
              <p className="text-xs text-muted-foreground">Total Productos</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4 text-center">
              <p className="text-2xl font-bold text-green-600">
                {estadisticas.disponibles}
              </p>
              <p className="text-xs text-muted-foreground">Disponibles</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4 text-center">
              <p className="text-2xl font-bold text-amber-600">
                {estadisticas.bajoStock}
              </p>
              <p className="text-xs text-muted-foreground">Bajo Stock</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4 text-center">
              <p className="text-2xl font-bold text-destructive">
                {estadisticas.agotados}
              </p>
              <p className="text-xs text-muted-foreground">Agotados</p>
            </CardContent>
          </Card>
        </div>

        {/* Alertas si hay productos agotados */}
        {estadisticas.agotados > 0 && (
          <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <AlertTriangle className="size-5 text-destructive" />
            <p className="text-sm text-destructive">
              <strong>Atención:</strong> Hay {estadisticas.agotados} producto(s)
              agotado(s) que requieren reabastecimiento.
            </p>
          </div>
        )}

        {/* Tabla de Inventario */}
        <DataGrid table={table} recordCount={datosFiltrados.length}>
          <Card>
            <CardHeader>
              <CardHeading>
                <CardTitle>Listado de Inventario</CardTitle>
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
                      className="pl-9 w-[200px]"
                    />
                  </div>

                  {/* Filtro de Categoría */}
                  <Select value={categoriaFiltro} onValueChange={setCategoriaFiltro}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todas">Todas</SelectItem>
                      {categorias.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Filtro de Estado */}
                  <Select value={estadoFiltro} onValueChange={setEstadoFiltro}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      <SelectItem value="disponible">Disponible</SelectItem>
                      <SelectItem value="bajo_stock">Bajo Stock</SelectItem>
                      <SelectItem value="agotado">Agotado</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Botón Limpiar */}
                  {(busqueda || categoriaFiltro || estadoFiltro) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setBusqueda('');
                        setCategoriaFiltro('');
                        setEstadoFiltro('');
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
      </div>
    </div>
  );
}
