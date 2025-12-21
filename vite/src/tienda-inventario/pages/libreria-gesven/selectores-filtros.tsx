'use client';

import { useCallback, useMemo, useState } from 'react';
import {
  Building2,
  Check,
  ChevronDown,
  FileText,
  Search,
  Upload,
  X,
} from 'lucide-react';
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
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
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
import { Separator } from '@/components/ui/separator';

// ============ DATOS FICTICIOS ============
interface Empresa {
  id: string;
  nombre: string;
  rfc: string;
}

interface Sucursal {
  id: string;
  empresaId: string;
  nombre: string;
  direccion: string;
}

interface Departamento {
  id: string;
  sucursalId: string;
  nombre: string;
  responsable: string;
}

const empresas: Empresa[] = [
  {
    id: 'emp1',
    nombre: 'Comercializadora del Norte SA de CV',
    rfc: 'CNO850101AB1',
  },
  {
    id: 'emp2',
    nombre: 'Distribuidora del Centro SA de CV',
    rfc: 'DCE900515CD2',
  },
  {
    id: 'emp3',
    nombre: 'Servicios Industriales del Sur SA de CV',
    rfc: 'SIS950720EF3',
  },
];

const sucursales: Sucursal[] = [
  {
    id: 'suc1',
    empresaId: 'emp1',
    nombre: 'Sucursal Monterrey Centro',
    direccion: 'Av. Constitución 1500, Centro',
  },
  {
    id: 'suc2',
    empresaId: 'emp1',
    nombre: 'Sucursal Monterrey Sur',
    direccion: 'Av. Revolución 2300, Valle',
  },
  {
    id: 'suc3',
    empresaId: 'emp1',
    nombre: 'Sucursal Saltillo',
    direccion: 'Blvd. Carranza 450, Centro',
  },
  {
    id: 'suc4',
    empresaId: 'emp2',
    nombre: 'Sucursal Guadalajara',
    direccion: 'Av. Vallarta 1800, Providencia',
  },
  {
    id: 'suc5',
    empresaId: 'emp2',
    nombre: 'Sucursal León',
    direccion: 'Blvd. López Mateos 3200',
  },
  {
    id: 'suc6',
    empresaId: 'emp3',
    nombre: 'Sucursal Mérida',
    direccion: 'Paseo Montejo 450, Centro',
  },
  {
    id: 'suc7',
    empresaId: 'emp3',
    nombre: 'Sucursal Cancún',
    direccion: 'Av. Tulum 200, Zona Hotelera',
  },
];

const departamentos: Departamento[] = [
  {
    id: 'dep1',
    sucursalId: 'suc1',
    nombre: 'Almacén General',
    responsable: 'Juan Pérez García',
  },
  {
    id: 'dep2',
    sucursalId: 'suc1',
    nombre: 'Ventas',
    responsable: 'María López Hernández',
  },
  {
    id: 'dep3',
    sucursalId: 'suc1',
    nombre: 'Compras',
    responsable: 'Carlos Ramírez Torres',
  },
  {
    id: 'dep4',
    sucursalId: 'suc2',
    nombre: 'Almacén',
    responsable: 'Ana González Ruiz',
  },
  {
    id: 'dep5',
    sucursalId: 'suc2',
    nombre: 'Logística',
    responsable: 'Pedro Martínez Luna',
  },
  {
    id: 'dep6',
    sucursalId: 'suc3',
    nombre: 'Almacén',
    responsable: 'Laura Sánchez Vega',
  },
  {
    id: 'dep7',
    sucursalId: 'suc4',
    nombre: 'Ventas',
    responsable: 'Roberto Díaz Mora',
  },
  {
    id: 'dep8',
    sucursalId: 'suc5',
    nombre: 'Almacén',
    responsable: 'Elena Flores Ramos',
  },
];

// ============ SELECTOR #1: INSTALACIÓN COMPLETA ============
function SelectorInstalacion() {
  const [empresaId, setEmpresaId] = useState<string>('');
  const [sucursalId, setSucursalId] = useState<string>('');
  const [departamentoId, setDepartamentoId] = useState<string>('');

  const sucursalesFiltradas = useMemo(() => {
    return sucursales.filter((s) => s.empresaId === empresaId);
  }, [empresaId]);

  const departamentosFiltrados = useMemo(() => {
    return departamentos.filter((d) => d.sucursalId === sucursalId);
  }, [sucursalId]);

  const handleEmpresaChange = (value: string) => {
    setEmpresaId(value);
    setSucursalId('');
    setDepartamentoId('');
  };

  const handleSucursalChange = (value: string) => {
    setSucursalId(value);
    setDepartamentoId('');
  };

  const empresaSeleccionada = empresas.find((e) => e.id === empresaId);
  const sucursalSeleccionada = sucursales.find((s) => s.id === sucursalId);
  const departamentoSeleccionado = departamentos.find(
    (d) => d.id === departamentoId,
  );

  return (
    <Card>
      <CardHeader>
        <CardHeading>
          <CardTitle>
            Selector #1 - Instalación (Empresa-Sucursal-Departamento)
          </CardTitle>
          <CardDescription>
            Selector jerárquico para contexto de operación en el sistema
          </CardDescription>
        </CardHeading>
        <Badge variant="primary" appearance="light">
          Jerárquico
        </Badge>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Selector Principal */}
        <div className="p-4 bg-muted/50 rounded-lg border border-border">
          <div className="flex items-center gap-3 mb-4">
            <Building2 className="size-5 text-primary" />
            <span className="font-semibold">Contexto de Instalación</span>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {/* Empresa */}
            <div className="space-y-2">
              <Label>Empresa</Label>
              <Select value={empresaId} onValueChange={handleEmpresaChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar empresa" />
                </SelectTrigger>
                <SelectContent>
                  {empresas.map((empresa) => (
                    <SelectItem key={empresa.id} value={empresa.id}>
                      <div className="flex flex-col items-start">
                        <span>{empresa.nombre}</span>
                        <span className="text-xs text-muted-foreground">
                          RFC: {empresa.rfc}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sucursal */}
            <div className="space-y-2">
              <Label>Sucursal</Label>
              <Select
                value={sucursalId}
                onValueChange={handleSucursalChange}
                disabled={!empresaId}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      empresaId
                        ? 'Seleccionar sucursal'
                        : 'Primero seleccione empresa'
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {sucursalesFiltradas.map((sucursal) => (
                    <SelectItem key={sucursal.id} value={sucursal.id}>
                      <div className="flex flex-col items-start">
                        <span>{sucursal.nombre}</span>
                        <span className="text-xs text-muted-foreground">
                          {sucursal.direccion}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Departamento */}
            <div className="space-y-2">
              <Label>Departamento</Label>
              <Select
                value={departamentoId}
                onValueChange={setDepartamentoId}
                disabled={!sucursalId}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      sucursalId
                        ? 'Seleccionar departamento'
                        : 'Primero seleccione sucursal'
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {departamentosFiltrados.map((dep) => (
                    <SelectItem key={dep.id} value={dep.id}>
                      <div className="flex flex-col items-start">
                        <span>{dep.nombre}</span>
                        <span className="text-xs text-muted-foreground">
                          Resp: {dep.responsable}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Resumen de Selección */}
        {(empresaSeleccionada ||
          sucursalSeleccionada ||
          departamentoSeleccionado) && (
          <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
            <h4 className="font-semibold text-sm mb-3">
              Instalación Seleccionada:
            </h4>
            <div className="flex flex-wrap gap-2">
              {empresaSeleccionada && (
                <Badge variant="outline">
                  Empresa: {empresaSeleccionada.nombre}
                </Badge>
              )}
              {sucursalSeleccionada && (
                <Badge variant="outline">
                  Sucursal: {sucursalSeleccionada.nombre}
                </Badge>
              )}
              {departamentoSeleccionado && (
                <Badge variant="outline">
                  Depto: {departamentoSeleccionado.nombre}
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ============ SELECTOR #2: BÚSQUEDA EN VIVO ============
interface Articulo {
  id: string;
  codigo: string;
  nombre: string;
  categoria: string;
  precio: number;
  stock: number;
}

const catalogoArticulos: Articulo[] = [
  {
    id: '1',
    codigo: 'ART-001',
    nombre: 'Tornillo Hexagonal M8x20',
    categoria: 'Ferretería',
    precio: 2.5,
    stock: 1500,
  },
  {
    id: '2',
    codigo: 'ART-002',
    nombre: 'Tuerca de Seguridad M8',
    categoria: 'Ferretería',
    precio: 1.75,
    stock: 800,
  },
  {
    id: '3',
    codigo: 'ART-003',
    nombre: 'Cable Eléctrico 12 AWG Rojo',
    categoria: 'Eléctrico',
    precio: 15.0,
    stock: 500,
  },
  {
    id: '4',
    codigo: 'ART-004',
    nombre: 'Cable Eléctrico 12 AWG Negro',
    categoria: 'Eléctrico',
    precio: 15.0,
    stock: 450,
  },
  {
    id: '5',
    codigo: 'ART-005',
    nombre: 'Interruptor Termomagnético 20A',
    categoria: 'Eléctrico',
    precio: 185.0,
    stock: 25,
  },
  {
    id: '6',
    codigo: 'ART-006',
    nombre: 'Cemento Gris 50kg',
    categoria: 'Construcción',
    precio: 165.0,
    stock: 250,
  },
  {
    id: '7',
    codigo: 'ART-007',
    nombre: 'Varilla Corrugada 3/8"',
    categoria: 'Construcción',
    precio: 89.0,
    stock: 120,
  },
  {
    id: '8',
    codigo: 'ART-008',
    nombre: 'Pintura Vinílica Blanca 19L',
    categoria: 'Pinturas',
    precio: 450.0,
    stock: 35,
  },
  {
    id: '9',
    codigo: 'ART-009',
    nombre: 'Pintura Vinílica Azul 19L',
    categoria: 'Pinturas',
    precio: 480.0,
    stock: 20,
  },
  {
    id: '10',
    codigo: 'ART-010',
    nombre: 'Llave Stillson 14"',
    categoria: 'Herramientas',
    precio: 320.0,
    stock: 15,
  },
];

function SelectorBusquedaVivo() {
  const [open, setOpen] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [articulosSeleccionados, setArticulosSeleccionados] = useState<
    Articulo[]
  >([]);

  const articulosFiltrados = useMemo(() => {
    if (!busqueda) return catalogoArticulos;
    const termino = busqueda.toLowerCase();
    return catalogoArticulos.filter(
      (a) =>
        a.nombre.toLowerCase().includes(termino) ||
        a.codigo.toLowerCase().includes(termino) ||
        a.categoria.toLowerCase().includes(termino),
    );
  }, [busqueda]);

  const toggleSeleccion = (articulo: Articulo) => {
    setArticulosSeleccionados((prev) => {
      const existe = prev.find((a) => a.id === articulo.id);
      if (existe) {
        return prev.filter((a) => a.id !== articulo.id);
      }
      return [...prev, articulo];
    });
  };

  const quitarArticulo = (id: string) => {
    setArticulosSeleccionados((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <Card>
      <CardHeader>
        <CardHeading>
          <CardTitle>Selector #2 - Búsqueda en Vivo de Artículos</CardTitle>
          <CardDescription>
            Selector con búsqueda instantánea y selección múltiple
          </CardDescription>
        </CardHeading>
        <Badge variant="primary" appearance="light">
          Búsqueda Viva
        </Badge>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Buscador */}
        <div className="space-y-2">
          <Label>Buscar y Seleccionar Artículos</Label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                mode="input"
                className="w-full justify-start"
              >
                <Search className="size-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  Buscar por código, nombre o categoría...
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[500px] p-0" align="start">
              <Command>
                <CommandInput
                  placeholder="Escriba para buscar..."
                  value={busqueda}
                  onValueChange={setBusqueda}
                />
                <CommandList>
                  <CommandEmpty>No se encontraron artículos.</CommandEmpty>
                  <CommandGroup>
                    {articulosFiltrados.map((articulo) => {
                      const estaSeleccionado = articulosSeleccionados.some(
                        (a) => a.id === articulo.id,
                      );
                      return (
                        <CommandItem
                          key={articulo.id}
                          value={`${articulo.codigo} ${articulo.nombre}`}
                          onSelect={() => toggleSeleccion(articulo)}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`size-5 border rounded flex items-center justify-center ${estaSeleccionado ? 'bg-primary border-primary' : 'border-input'}`}
                            >
                              {estaSeleccionado && (
                                <Check className="size-3 text-primary-foreground" />
                              )}
                            </div>
                            <div>
                              <div className="font-medium">
                                {articulo.nombre}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {articulo.codigo} • {articulo.categoria} •
                                Stock: {articulo.stock}
                              </div>
                            </div>
                          </div>
                          <span className="font-semibold text-primary">
                            ${articulo.precio.toFixed(2)}
                          </span>
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* Artículos Seleccionados */}
        {articulosSeleccionados.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Artículos Seleccionados ({articulosSeleccionados.length})</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setArticulosSeleccionados([])}
              >
                Limpiar todo
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {articulosSeleccionados.map((articulo) => (
                <Badge
                  key={articulo.id}
                  variant="secondary"
                  className="flex items-center gap-1 pr-1"
                >
                  <span>
                    {articulo.codigo} - {articulo.nombre}
                  </span>
                  <Button
                    variant="ghost"
                    mode="icon"
                    size="sm"
                    className="size-5 hover:bg-destructive/20"
                    onClick={() => quitarArticulo(articulo.id)}
                  >
                    <X className="size-3" />
                  </Button>
                </Badge>
              ))}
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total estimado:</span>
                <span className="font-semibold">
                  $
                  {articulosSeleccionados
                    .reduce((sum, a) => sum + a.precio, 0)
                    .toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ============ SELECTOR #3: CLIENTES CON BÚSQUEDA ============
interface Cliente {
  id: string;
  nombre: string;
  rfc: string;
  ciudad: string;
  telefono: string;
  saldo: number;
}

const catalogoClientes: Cliente[] = [
  {
    id: 'c1',
    nombre: 'Constructora del Valle SA de CV',
    rfc: 'CVA850101AB1',
    ciudad: 'Monterrey',
    telefono: '81 1234 5678',
    saldo: 45000,
  },
  {
    id: 'c2',
    nombre: 'Mantenimiento Industrial MX',
    rfc: 'MIM900515CD2',
    ciudad: 'Guadalajara',
    telefono: '33 2345 6789',
    saldo: 0,
  },
  {
    id: 'c3',
    nombre: 'Desarrollos Habitacionales del Norte',
    rfc: 'DHN920720EF3',
    ciudad: 'Monterrey',
    telefono: '81 3456 7890',
    saldo: 125000,
  },
  {
    id: 'c4',
    nombre: 'Servicios Eléctricos Profesionales',
    rfc: 'SEP880310GH4',
    ciudad: 'Saltillo',
    telefono: '84 4567 8901',
    saldo: 8500,
  },
  {
    id: 'c5',
    nombre: 'Instalaciones y Proyectos SA',
    rfc: 'IPS950825IJ5',
    ciudad: 'León',
    telefono: '47 5678 9012',
    saldo: 0,
  },
];

function SelectorClientes() {
  const [open, setOpen] = useState(false);
  const [clienteSeleccionado, setClienteSeleccionado] =
    useState<Cliente | null>(null);

  const handleSeleccionar = (cliente: Cliente) => {
    setClienteSeleccionado(cliente);
    setOpen(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardHeading>
          <CardTitle>Selector #3 - Búsqueda de Clientes</CardTitle>
          <CardDescription>
            Selector con búsqueda para selección única de clientes
          </CardDescription>
        </CardHeading>
        <Badge variant="primary" appearance="light">
          Selección Única
        </Badge>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Seleccionar Cliente</Label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                mode="input"
                className="w-full justify-between"
              >
                {clienteSeleccionado ? (
                  <span>{clienteSeleccionado.nombre}</span>
                ) : (
                  <span className="text-muted-foreground">
                    Buscar cliente...
                  </span>
                )}
                <ChevronDown className="size-4 text-muted-foreground" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[450px] p-0" align="start">
              <Command>
                <CommandInput placeholder="Buscar por nombre, RFC o ciudad..." />
                <CommandList>
                  <CommandEmpty>No se encontraron clientes.</CommandEmpty>
                  <CommandGroup>
                    {catalogoClientes.map((cliente) => (
                      <CommandItem
                        key={cliente.id}
                        value={`${cliente.nombre} ${cliente.rfc} ${cliente.ciudad}`}
                        onSelect={() => handleSeleccionar(cliente)}
                        className="flex items-center justify-between"
                      >
                        <div>
                          <div className="font-medium">{cliente.nombre}</div>
                          <div className="text-xs text-muted-foreground">
                            RFC: {cliente.rfc} • {cliente.ciudad}
                          </div>
                        </div>
                        {cliente.saldo > 0 && (
                          <Badge variant="warning" size="sm">
                            Saldo: ${cliente.saldo.toLocaleString()}
                          </Badge>
                        )}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* Información del Cliente Seleccionado */}
        {clienteSeleccionado && (
          <div className="p-4 bg-muted/50 rounded-lg border space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">Información del Cliente</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setClienteSeleccionado(null)}
              >
                <X className="size-4" /> Cambiar
              </Button>
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Nombre:</span>
                <p className="font-medium">{clienteSeleccionado.nombre}</p>
              </div>
              <div>
                <span className="text-muted-foreground">RFC:</span>
                <p className="font-medium">{clienteSeleccionado.rfc}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Ciudad:</span>
                <p className="font-medium">{clienteSeleccionado.ciudad}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Teléfono:</span>
                <p className="font-medium">{clienteSeleccionado.telefono}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Saldo Pendiente:</span>
                <p
                  className={`font-medium ${clienteSeleccionado.saldo > 0 ? 'text-amber-600' : 'text-green-600'}`}
                >
                  ${clienteSeleccionado.saldo.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ============ SELECTOR #4: ARCHIVOS XML/PDF ============
interface ArchivoSubido {
  id: string;
  nombre: string;
  tipo: 'xml' | 'pdf';
  tamaño: string;
  fecha: string;
}

function SelectorArchivos() {
  const [archivos, setArchivos] = useState<ArchivoSubido[]>([]);
  const [arrastrando, setArrastrando] = useState(false);

  const handleDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (!arrastrando) setArrastrando(true);
    },
    [arrastrando],
  );

  const handleDragLeave = useCallback(() => {
    setArrastrando(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setArrastrando(false);

    const files = Array.from(e.dataTransfer.files);
    procesarArchivos(files);
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const files = Array.from(e.target.files);
        procesarArchivos(files);
      }
    },
    [],
  );

  const procesarArchivos = (files: File[]) => {
    const nuevosArchivos: ArchivoSubido[] = files
      .filter((file) => {
        const extension = file.name.split('.').pop()?.toLowerCase();
        return extension === 'xml' || extension === 'pdf';
      })
      .map((file) => ({
        id: Math.random().toString(36).substring(2, 11),
        nombre: file.name,
        tipo: file.name.toLowerCase().endsWith('.xml') ? 'xml' : 'pdf',
        tamaño: formatearTamaño(file.size),
        fecha: new Date().toLocaleDateString('es-MX'),
      }));

    setArchivos((prev) => [...prev, ...nuevosArchivos]);
  };

  const formatearTamaño = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const eliminarArchivo = (id: string) => {
    setArchivos((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <Card>
      <CardHeader>
        <CardHeading>
          <CardTitle>Selector #4 - Carga de Archivos XML/PDF</CardTitle>
          <CardDescription>
            Zona de arrastre para cargar facturas electrónicas y documentos
          </CardDescription>
        </CardHeading>
        <Badge variant="primary" appearance="light">
          Archivos
        </Badge>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Zona de Arrastre */}
        <div
          className={`
            border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer
            ${arrastrando ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById('file-input')?.click()}
        >
          <input
            id="file-input"
            type="file"
            accept=".xml,.pdf"
            multiple
            className="hidden"
            onChange={handleFileInput}
          />
          <Upload className="size-10 text-muted-foreground mx-auto mb-4" />
          <h4 className="font-semibold mb-1">
            Arrastre archivos aquí o haga clic para seleccionar
          </h4>
          <p className="text-sm text-muted-foreground">
            Formatos permitidos: XML, PDF (Facturas electrónicas CFDI)
          </p>
        </div>

        {/* Lista de Archivos */}
        {archivos.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Archivos Cargados ({archivos.length})</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setArchivos([])}
              >
                Eliminar todos
              </Button>
            </div>
            <div className="space-y-2">
              {archivos.map((archivo) => (
                <div
                  key={archivo.id}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded ${archivo.tipo === 'xml' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}
                    >
                      <FileText className="size-5" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{archivo.nombre}</p>
                      <p className="text-xs text-muted-foreground">
                        {archivo.tamaño} • {archivo.fecha}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        archivo.tipo === 'xml' ? 'success' : 'destructive'
                      }
                      appearance="light"
                    >
                      {archivo.tipo.toUpperCase()}
                    </Badge>
                    <Button
                      variant="ghost"
                      mode="icon"
                      size="sm"
                      onClick={() => eliminarArchivo(archivo.id)}
                    >
                      <X className="size-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ============ PÁGINA PRINCIPAL ============
export function SelectoresFiltrosPage() {
  return (
    <div className="container-fluid">
      <div className="grid gap-5 lg:gap-7.5">
        {/* Descripción */}
        <Card>
          <CardContent className="py-4">
            <h2 className="text-xl font-semibold mb-2">
              Módulo de Selectores y Filtros
            </h2>
            <p className="text-muted-foreground">
              Esta sección contiene ejemplos de selectores avanzados para
              diferentes escenarios: selectores jerárquicos de instalación,
              búsqueda en vivo de artículos y clientes, y carga de archivos
              XML/PDF.
            </p>
          </CardContent>
        </Card>

        {/* Selector #1: Instalación */}
        <SelectorInstalacion />

        {/* Selector #2: Búsqueda Viva */}
        <SelectorBusquedaVivo />

        {/* Selector #3: Clientes */}
        <SelectorClientes />

        {/* Selector #4: Archivos */}
        <SelectorArchivos />
      </div>
    </div>
  );
}
