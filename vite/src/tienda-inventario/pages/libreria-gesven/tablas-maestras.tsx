'use client';

import { useMemo, useState } from 'react';
import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  RowSelectionState,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { Building2, ChevronDown, Pencil, Save, X } from 'lucide-react';
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
import {
  DataGridTable,
  DataGridTableRowSelect,
  DataGridTableRowSelectAll,
} from '@/components/ui/data-grid-table';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// ============ SELECTOR DE INSTALACIÓN ============
interface SelectorInstalacionProps {
  empresaSeleccionada: string;
  sucursalSeleccionada: string;
  onEmpresaChange: (value: string) => void;
  onSucursalChange: (value: string) => void;
}

const empresas = [
  { id: 'emp1', nombre: 'Comercializadora del Norte SA' },
  { id: 'emp2', nombre: 'Distribuidora del Centro SA' },
  { id: 'emp3', nombre: 'Servicios del Sur SA' },
];

const sucursalesPorEmpresa: Record<string, { id: string; nombre: string }[]> = {
  emp1: [
    { id: 'suc1', nombre: 'Sucursal Monterrey' },
    { id: 'suc2', nombre: 'Sucursal Saltillo' },
    { id: 'suc3', nombre: 'Sucursal Torreón' },
  ],
  emp2: [
    { id: 'suc4', nombre: 'Sucursal Guadalajara' },
    { id: 'suc5', nombre: 'Sucursal León' },
  ],
  emp3: [
    { id: 'suc6', nombre: 'Sucursal Mérida' },
    { id: 'suc7', nombre: 'Sucursal Cancún' },
    { id: 'suc8', nombre: 'Sucursal Villahermosa' },
  ],
};

function SelectorInstalacion({
  empresaSeleccionada,
  sucursalSeleccionada,
  onEmpresaChange,
  onSucursalChange,
}: SelectorInstalacionProps) {
  const sucursales = sucursalesPorEmpresa[empresaSeleccionada] || [];

  return (
    <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg border border-border mb-6">
      <Building2 className="size-5 text-muted-foreground" />
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">
            Empresa:
          </span>
          <Select value={empresaSeleccionada} onValueChange={onEmpresaChange}>
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Seleccionar empresa" />
            </SelectTrigger>
            <SelectContent>
              {empresas.map((empresa) => (
                <SelectItem key={empresa.id} value={empresa.id}>
                  {empresa.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">
            Sucursal:
          </span>
          <Select
            value={sucursalSeleccionada}
            onValueChange={onSucursalChange}
            disabled={!empresaSeleccionada}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Seleccionar sucursal" />
            </SelectTrigger>
            <SelectContent>
              {sucursales.map((sucursal) => (
                <SelectItem key={sucursal.id} value={sucursal.id}>
                  {sucursal.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

// ============ DATOS FICTICIOS ============
interface ArticuloInventario {
  id: string;
  codigo: string;
  nombre: string;
  categoria: string;
  unidad: string;
  precioUnitario: number;
  stockActual: number;
  stockMinimo: number;
  estado: 'disponible' | 'bajo_stock' | 'agotado';
}

const datosInventario: ArticuloInventario[] = [
  {
    id: '1',
    codigo: 'ART-001',
    nombre: 'Tornillo Hexagonal M8x20',
    categoria: 'Ferretería',
    unidad: 'Pieza',
    precioUnitario: 2.5,
    stockActual: 1500,
    stockMinimo: 200,
    estado: 'disponible',
  },
  {
    id: '2',
    codigo: 'ART-002',
    nombre: 'Tuerca de Seguridad M8',
    categoria: 'Ferretería',
    unidad: 'Pieza',
    precioUnitario: 1.75,
    stockActual: 50,
    stockMinimo: 100,
    estado: 'bajo_stock',
  },
  {
    id: '3',
    codigo: 'ART-003',
    nombre: 'Cable Eléctrico 12 AWG',
    categoria: 'Eléctrico',
    unidad: 'Metro',
    precioUnitario: 15.0,
    stockActual: 500,
    stockMinimo: 100,
    estado: 'disponible',
  },
  {
    id: '4',
    codigo: 'ART-004',
    nombre: 'Interruptor Termomagnético 20A',
    categoria: 'Eléctrico',
    unidad: 'Pieza',
    precioUnitario: 185.0,
    stockActual: 0,
    stockMinimo: 10,
    estado: 'agotado',
  },
  {
    id: '5',
    codigo: 'ART-005',
    nombre: 'Cemento Gris 50kg',
    categoria: 'Construcción',
    unidad: 'Saco',
    precioUnitario: 165.0,
    stockActual: 250,
    stockMinimo: 50,
    estado: 'disponible',
  },
  {
    id: '6',
    codigo: 'ART-006',
    nombre: 'Varilla Corrugada 3/8"',
    categoria: 'Construcción',
    unidad: 'Pieza',
    precioUnitario: 89.0,
    stockActual: 120,
    stockMinimo: 30,
    estado: 'disponible',
  },
  {
    id: '7',
    codigo: 'ART-007',
    nombre: 'Pintura Vinílica Blanca 19L',
    categoria: 'Pinturas',
    unidad: 'Cubeta',
    precioUnitario: 450.0,
    stockActual: 25,
    stockMinimo: 15,
    estado: 'disponible',
  },
  {
    id: '8',
    codigo: 'ART-008',
    nombre: 'Llave Stillson 14"',
    categoria: 'Herramientas',
    unidad: 'Pieza',
    precioUnitario: 320.0,
    stockActual: 8,
    stockMinimo: 5,
    estado: 'disponible',
  },
  {
    id: '9',
    codigo: 'ART-009',
    nombre: 'Taladro Percutor 750W',
    categoria: 'Herramientas',
    unidad: 'Pieza',
    precioUnitario: 1850.0,
    stockActual: 3,
    stockMinimo: 5,
    estado: 'bajo_stock',
  },
  {
    id: '10',
    codigo: 'ART-010',
    nombre: 'Cinta Teflon 1/2"',
    categoria: 'Plomería',
    unidad: 'Rollo',
    precioUnitario: 12.0,
    stockActual: 200,
    stockMinimo: 50,
    estado: 'disponible',
  },
];

// ============ TABLA #1: SIMPLE DE INVENTARIO ============
function TablaSimpleInventario() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns = useMemo<ColumnDef<ArticuloInventario>[]>(
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
          <DataGridColumnHeader title="Nombre del Artículo" column={column} />
        ),
        size: 250,
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
          <DataGridColumnHeader title="Stock Actual" column={column} />
        ),
        cell: (info) => (
          <span className="font-medium">
            {info.getValue<number>().toLocaleString()}
          </span>
        ),
        size: 100,
      },
      {
        accessorKey: 'precioUnitario',
        header: ({ column }) => (
          <DataGridColumnHeader title="Precio Unitario" column={column} />
        ),
        cell: (info) => `$${info.getValue<number>().toFixed(2)}`,
        size: 120,
      },
    ],
    [],
  );

  const table = useReactTable({
    data: datosInventario,
    columns,
    state: { pagination, sorting },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <DataGrid table={table} recordCount={datosInventario.length}>
      <Card>
        <CardHeader>
          <CardHeading>
            <CardTitle>Tabla #1 - Tabla Simple de Inventario</CardTitle>
          </CardHeading>
          <CardToolbar>
            <Badge variant="secondary">Básica</Badge>
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
  );
}

// ============ TABLA #2: CON FILTROS AVANZADOS ============
function TablaConFiltrosAvanzados() {
  const [empresaFiltro, setEmpresaFiltro] = useState<string>('');
  const [sucursalFiltro, setSucursalFiltro] = useState<string>('');
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>('');
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });
  const [sorting, setSorting] = useState<SortingState>([]);

  const categorias = [
    ...new Set(datosInventario.map((item) => item.categoria)),
  ];

  const datosFiltrados = useMemo(() => {
    return datosInventario.filter((item) => {
      if (categoriaFiltro && item.categoria !== categoriaFiltro) return false;
      return true;
    });
  }, [categoriaFiltro]);

  const columns = useMemo<ColumnDef<ArticuloInventario>[]>(
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
          <DataGridColumnHeader title="Nombre" column={column} />
        ),
        size: 200,
      },
      {
        accessorKey: 'categoria',
        header: ({ column }) => (
          <DataGridColumnHeader title="Categoría" column={column} />
        ),
        size: 120,
      },
      {
        accessorKey: 'stockActual',
        header: ({ column }) => (
          <DataGridColumnHeader title="Stock" column={column} />
        ),
        cell: (info) => info.getValue<number>().toLocaleString(),
        size: 100,
      },
      {
        accessorKey: 'estado',
        header: ({ column }) => (
          <DataGridColumnHeader title="Estado" column={column} />
        ),
        cell: (info) => {
          const estado = info.getValue<string>();
          const variantes: Record<string, 'success' | 'warning' | 'destructive'> = {
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
        size: 120,
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
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <DataGrid table={table} recordCount={datosFiltrados.length}>
      <Card>
        <CardHeader>
          <CardHeading>
            <CardTitle>
              Tabla #2 - Con Filtros Avanzados (Empresa/Sucursal)
            </CardTitle>
          </CardHeading>
          <CardToolbar>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">
                  Empresa
                  {empresaFiltro && (
                    <Badge variant="outline" size="sm">
                      1
                    </Badge>
                  )}
                  <ChevronDown className="size-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-2" align="end">
                <Select value={empresaFiltro} onValueChange={setEmpresaFiltro}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas las empresas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas</SelectItem>
                    {empresas.map((emp) => (
                      <SelectItem key={emp.id} value={emp.id}>
                        {emp.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">
                  Sucursal
                  {sucursalFiltro && (
                    <Badge variant="outline" size="sm">
                      1
                    </Badge>
                  )}
                  <ChevronDown className="size-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-2" align="end">
                <Select
                  value={sucursalFiltro}
                  onValueChange={setSucursalFiltro}
                  disabled={!empresaFiltro || empresaFiltro === 'todas'}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todas las sucursales" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas</SelectItem>
                    {(sucursalesPorEmpresa[empresaFiltro] || []).map((suc) => (
                      <SelectItem key={suc.id} value={suc.id}>
                        {suc.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">
                  Categoría
                  {categoriaFiltro && (
                    <Badge variant="outline" size="sm">
                      1
                    </Badge>
                  )}
                  <ChevronDown className="size-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-2" align="end">
                <Select
                  value={categoriaFiltro}
                  onValueChange={setCategoriaFiltro}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todas las categorías" />
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
              </PopoverContent>
            </Popover>
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
  );
}

// ============ TABLA #3: CON EDICIÓN EN LÍNEA ============
function TablaEdicionEnLinea() {
  const [datos, setDatos] = useState(datosInventario);
  const [filaEditando, setFilaEditando] = useState<string | null>(null);
  const [valoresEditados, setValoresEditados] = useState<Partial<ArticuloInventario>>({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });
  const [sorting, setSorting] = useState<SortingState>([]);

  const iniciarEdicion = (fila: ArticuloInventario) => {
    setFilaEditando(fila.id);
    setValoresEditados({
      nombre: fila.nombre,
      precioUnitario: fila.precioUnitario,
      stockActual: fila.stockActual,
    });
  };

  const guardarEdicion = () => {
    if (!filaEditando) return;
    setDatos((prev) =>
      prev.map((item) =>
        item.id === filaEditando ? { ...item, ...valoresEditados } : item,
      ),
    );
    setFilaEditando(null);
    setValoresEditados({});
  };

  const cancelarEdicion = () => {
    setFilaEditando(null);
    setValoresEditados({});
  };

  const columns = useMemo<ColumnDef<ArticuloInventario>[]>(
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
          <DataGridColumnHeader title="Nombre" column={column} />
        ),
        cell: ({ row }) => {
          if (filaEditando === row.original.id) {
            return (
              <Input
                value={valoresEditados.nombre || ''}
                onChange={(e) =>
                  setValoresEditados((prev) => ({
                    ...prev,
                    nombre: e.target.value,
                  }))
                }
                className="h-8"
              />
            );
          }
          return row.original.nombre;
        },
        size: 200,
      },
      {
        accessorKey: 'stockActual',
        header: ({ column }) => (
          <DataGridColumnHeader title="Stock" column={column} />
        ),
        cell: ({ row }) => {
          if (filaEditando === row.original.id) {
            return (
              <Input
                type="number"
                value={valoresEditados.stockActual || 0}
                onChange={(e) =>
                  setValoresEditados((prev) => ({
                    ...prev,
                    stockActual: Number(e.target.value),
                  }))
                }
                className="h-8 w-24"
              />
            );
          }
          return row.original.stockActual.toLocaleString();
        },
        size: 100,
      },
      {
        accessorKey: 'precioUnitario',
        header: ({ column }) => (
          <DataGridColumnHeader title="Precio" column={column} />
        ),
        cell: ({ row }) => {
          if (filaEditando === row.original.id) {
            return (
              <Input
                type="number"
                step="0.01"
                value={valoresEditados.precioUnitario || 0}
                onChange={(e) =>
                  setValoresEditados((prev) => ({
                    ...prev,
                    precioUnitario: Number(e.target.value),
                  }))
                }
                className="h-8 w-24"
              />
            );
          }
          return `$${row.original.precioUnitario.toFixed(2)}`;
        },
        size: 100,
      },
      {
        id: 'acciones',
        header: () => 'Acciones',
        cell: ({ row }) => {
          if (filaEditando === row.original.id) {
            return (
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  mode="icon"
                  size="sm"
                  onClick={guardarEdicion}
                >
                  <Save className="size-4 text-green-600" />
                </Button>
                <Button
                  variant="ghost"
                  mode="icon"
                  size="sm"
                  onClick={cancelarEdicion}
                >
                  <X className="size-4 text-red-600" />
                </Button>
              </div>
            );
          }
          return (
            <Button
              variant="ghost"
              mode="icon"
              size="sm"
              onClick={() => iniciarEdicion(row.original)}
            >
              <Pencil className="size-4" />
            </Button>
          );
        },
        size: 100,
      },
    ],
    [filaEditando, valoresEditados],
  );

  const table = useReactTable({
    data: datos,
    columns,
    state: { pagination, sorting },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <DataGrid table={table} recordCount={datos.length}>
      <Card>
        <CardHeader>
          <CardHeading>
            <CardTitle>Tabla #3 - Con Edición en Línea</CardTitle>
          </CardHeading>
          <CardToolbar>
            <Badge variant="primary" appearance="light">
              Editable
            </Badge>
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
  );
}

// ============ TABLA #4: SELECCIÓN MÚLTIPLE PARA PAGOS ============
interface PagoProveedor {
  id: string;
  folio: string;
  proveedor: string;
  concepto: string;
  fechaVencimiento: string;
  monto: number;
  estatus: 'pendiente' | 'vencido' | 'proximo';
}

const datosPagos: PagoProveedor[] = [
  {
    id: '1',
    folio: 'FAC-2024-001',
    proveedor: 'Aceros del Norte SA',
    concepto: 'Material de construcción',
    fechaVencimiento: '15/01/2025',
    monto: 45000.0,
    estatus: 'pendiente',
  },
  {
    id: '2',
    folio: 'FAC-2024-002',
    proveedor: 'Eléctricos Industriales',
    concepto: 'Suministros eléctricos',
    fechaVencimiento: '10/01/2025',
    monto: 23500.0,
    estatus: 'vencido',
  },
  {
    id: '3',
    folio: 'FAC-2024-003',
    proveedor: 'Pinturas Premium SA',
    concepto: 'Pinturas y recubrimientos',
    fechaVencimiento: '20/01/2025',
    monto: 18750.0,
    estatus: 'proximo',
  },
  {
    id: '4',
    folio: 'FAC-2024-004',
    proveedor: 'Ferretería Universal',
    concepto: 'Herramientas varias',
    fechaVencimiento: '25/01/2025',
    monto: 12300.0,
    estatus: 'pendiente',
  },
  {
    id: '5',
    folio: 'FAC-2024-005',
    proveedor: 'Cementos del Pacífico',
    concepto: 'Cemento y agregados',
    fechaVencimiento: '05/01/2025',
    monto: 67890.0,
    estatus: 'vencido',
  },
];

function TablaSeleccionMultiplePagos() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const montoSeleccionado = useMemo(() => {
    return Object.keys(rowSelection).reduce((total, key) => {
      const index = parseInt(key);
      return total + (datosPagos[index]?.monto || 0);
    }, 0);
  }, [rowSelection]);

  const columns = useMemo<ColumnDef<PagoProveedor>[]>(
    () => [
      {
        id: 'select',
        header: () => <DataGridTableRowSelectAll />,
        cell: ({ row }) => <DataGridTableRowSelect row={row} />,
        size: 50,
      },
      {
        accessorKey: 'folio',
        header: ({ column }) => (
          <DataGridColumnHeader title="Folio" column={column} />
        ),
        size: 120,
      },
      {
        accessorKey: 'proveedor',
        header: ({ column }) => (
          <DataGridColumnHeader title="Proveedor" column={column} />
        ),
        size: 180,
      },
      {
        accessorKey: 'concepto',
        header: ({ column }) => (
          <DataGridColumnHeader title="Concepto" column={column} />
        ),
        size: 180,
      },
      {
        accessorKey: 'fechaVencimiento',
        header: ({ column }) => (
          <DataGridColumnHeader title="Vencimiento" column={column} />
        ),
        size: 120,
      },
      {
        accessorKey: 'monto',
        header: ({ column }) => (
          <DataGridColumnHeader title="Monto" column={column} />
        ),
        cell: (info) => (
          <span className="font-semibold">
            ${info.getValue<number>().toLocaleString('es-MX', { minimumFractionDigits: 2 })}
          </span>
        ),
        size: 120,
      },
      {
        accessorKey: 'estatus',
        header: ({ column }) => (
          <DataGridColumnHeader title="Estatus" column={column} />
        ),
        cell: (info) => {
          const estatus = info.getValue<string>();
          const variantes: Record<string, 'success' | 'warning' | 'destructive'> = {
            pendiente: 'success',
            proximo: 'warning',
            vencido: 'destructive',
          };
          const etiquetas: Record<string, string> = {
            pendiente: 'Pendiente',
            proximo: 'Próximo',
            vencido: 'Vencido',
          };
          return (
            <Badge variant={variantes[estatus]} appearance="light">
              {etiquetas[estatus]}
            </Badge>
          );
        },
        size: 100,
      },
    ],
    [],
  );

  const table = useReactTable({
    data: datosPagos,
    columns,
    state: { pagination, sorting, rowSelection },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <DataGrid table={table} recordCount={datosPagos.length}>
      <Card>
        <CardHeader>
          <CardHeading>
            <CardTitle>
              Tabla #4 - Selección Múltiple para Pagos a Proveedores
            </CardTitle>
          </CardHeading>
          <CardToolbar>
            {Object.keys(rowSelection).length > 0 && (
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">
                  {Object.keys(rowSelection).length} pago(s) seleccionado(s)
                </span>
                <Badge variant="primary" size="lg">
                  Total: $
                  {montoSeleccionado.toLocaleString('es-MX', {
                    minimumFractionDigits: 2,
                  })}
                </Badge>
                <Button variant="primary">Procesar Pagos</Button>
              </div>
            )}
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
  );
}

// ============ PÁGINA PRINCIPAL ============
export function TablasMaestrasPage() {
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState('emp1');
  const [sucursalSeleccionada, setSucursalSeleccionada] = useState('suc1');

  return (
    <div className="container-fluid">
      <div className="grid gap-5 lg:gap-7.5">
        {/* Selector de Instalación */}
        <SelectorInstalacion
          empresaSeleccionada={empresaSeleccionada}
          sucursalSeleccionada={sucursalSeleccionada}
          onEmpresaChange={(value) => {
            setEmpresaSeleccionada(value);
            setSucursalSeleccionada('');
          }}
          onSucursalChange={setSucursalSeleccionada}
        />

        {/* Descripción */}
        <Card>
          <CardContent className="py-4">
            <h2 className="text-xl font-semibold mb-2">
              Módulo de Tablas Maestras
            </h2>
            <p className="text-muted-foreground">
              Esta sección contiene 4 ejemplos de tablas para diferentes casos
              de uso en el sistema ERP. Cada tabla demuestra funcionalidades
              específicas que pueden ser reutilizadas en otros módulos.
            </p>
          </CardContent>
        </Card>

        {/* Tabla #1: Simple */}
        <TablaSimpleInventario />

        {/* Tabla #2: Con Filtros */}
        <TablaConFiltrosAvanzados />

        {/* Tabla #3: Edición en Línea */}
        <TablaEdicionEnLinea />

        {/* Tabla #4: Selección Múltiple */}
        <TablaSeleccionMultiplePagos />
      </div>
    </div>
  );
}
