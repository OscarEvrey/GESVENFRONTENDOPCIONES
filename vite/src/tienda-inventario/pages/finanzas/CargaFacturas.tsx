'use client';

import { useCallback, useMemo, useState } from 'react';
import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  AlertCircle,
  CheckCircle,
  CloudUpload,
  File,
  FileText,
  FileUp,
  XCircle,
} from 'lucide-react';
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
import { DataGridPagination } from '@/components/ui/data-grid-pagination';
import { DataGridTable } from '@/components/ui/data-grid-table';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { useInstalacionActivaObligatoria } from '../../context/ContextoInstalacion';

// ============ TIPOS ============
interface DocumentoPendiente {
  id: string;
  tipo: 'venta' | 'recepcion';
  referencia: string;
  fecha: string;
  monto: number;
  cliente?: string;
  proveedor?: string;
  archivoXML: string | null;
  archivoPDF: string | null;
  estatus: 'pendiente' | 'parcial' | 'completo';
}

// ============ DATOS FICTICIOS ============
const documentosPendientesFicticios: DocumentoPendiente[] = [
  {
    id: 'doc-001',
    tipo: 'venta',
    referencia: 'VTA-2024-0001',
    fecha: '2024-12-20',
    monto: 4580.0,
    cliente: 'Comercializadora del Norte SA de CV',
    archivoXML: null,
    archivoPDF: null,
    estatus: 'pendiente',
  },
  {
    id: 'doc-002',
    tipo: 'venta',
    referencia: 'VTA-2024-0002',
    fecha: '2024-12-19',
    monto: 2150.0,
    cliente: 'Distribuidora Regio Express',
    archivoXML: null,
    archivoPDF: null,
    estatus: 'pendiente',
  },
  {
    id: 'doc-003',
    tipo: 'recepcion',
    referencia: 'REC-2024-0015',
    fecha: '2024-12-18',
    monto: 12990.0,
    proveedor: 'Comercializadora de Bebidas del Golfo',
    archivoXML: 'factura_bebidas.xml',
    archivoPDF: null,
    estatus: 'parcial',
  },
  {
    id: 'doc-004',
    tipo: 'venta',
    referencia: 'VTA-2024-0003',
    fecha: '2024-12-17',
    monto: 875.5,
    cliente: 'Abarrotes La Esperanza',
    archivoXML: null,
    archivoPDF: null,
    estatus: 'pendiente',
  },
  {
    id: 'doc-005',
    tipo: 'recepcion',
    referencia: 'REC-2024-0016',
    fecha: '2024-12-16',
    monto: 4470.0,
    proveedor: 'Distribuidora de Papelería Omega',
    archivoXML: null,
    archivoPDF: null,
    estatus: 'pendiente',
  },
  {
    id: 'doc-006',
    tipo: 'venta',
    referencia: 'VTA-2024-0004',
    fecha: '2024-12-15',
    monto: 3200.0,
    cliente: 'Tiendas Don Manuel',
    archivoXML: null,
    archivoPDF: 'nota_tiendas.pdf',
    estatus: 'parcial',
  },
];

// ============ COMPONENTE PRINCIPAL ============
export function CargaFacturasPage() {
  const instalacionActiva = useInstalacionActivaObligatoria();
  const [documentos, setDocumentos] = useState<DocumentoPendiente[]>(
    documentosPendientesFicticios,
  );
  const [tabActivo, setTabActivo] = useState<string>('todos');
  const [mensajeExito, setMensajeExito] = useState<string>('');

  // Filtrar documentos según tab
  const documentosFiltrados = useMemo(() => {
    const pendientes = documentos.filter((d) => d.estatus !== 'completo');
    if (tabActivo === 'ventas') {
      return pendientes.filter((d) => d.tipo === 'venta');
    }
    if (tabActivo === 'recepciones') {
      return pendientes.filter((d) => d.tipo === 'recepcion');
    }
    return pendientes;
  }, [documentos, tabActivo]);

  // Estadísticas
  const estadisticas = useMemo(() => {
    const pendientes = documentos.filter((d) => d.estatus === 'pendiente');
    const parciales = documentos.filter((d) => d.estatus === 'parcial');
    const ventas = documentos.filter(
      (d) => d.tipo === 'venta' && d.estatus !== 'completo',
    );
    const recepciones = documentos.filter(
      (d) => d.tipo === 'recepcion' && d.estatus !== 'completo',
    );
    return {
      pendientes: pendientes.length,
      parciales: parciales.length,
      ventas: ventas.length,
      recepciones: recepciones.length,
    };
  }, [documentos]);

  // Simular carga de archivo
  const simularCargaArchivo = useCallback((docId: string, tipoArchivo: 'xml' | 'pdf') => {
    const nombreArchivo =
      tipoArchivo === 'xml' ? `factura_${docId}.xml` : `factura_${docId}.pdf`;

    setDocumentos((prev) =>
      prev.map((doc) => {
        if (doc.id === docId) {
          const nuevoDoc = {
            ...doc,
            [tipoArchivo === 'xml' ? 'archivoXML' : 'archivoPDF']: nombreArchivo,
          };
          // Verificar si ambos archivos están cargados
          if (
            (tipoArchivo === 'xml' && nuevoDoc.archivoPDF) ||
            (tipoArchivo === 'pdf' && nuevoDoc.archivoXML)
          ) {
            nuevoDoc.estatus = 'completo';
          } else {
            nuevoDoc.estatus = 'parcial';
          }
          return nuevoDoc;
        }
        return doc;
      }),
    );
  }, []);

  // Finalizar documento
  const finalizarDocumento = useCallback((docId: string) => {
    const doc = documentos.find((d) => d.id === docId);
    if (!doc || !doc.archivoXML || !doc.archivoPDF) {
      alert('Debe cargar ambos archivos (XML y PDF) para finalizar.');
      return;
    }

    setDocumentos((prev) =>
      prev.map((d) =>
        d.id === docId ? { ...d, estatus: 'completo' as const } : d,
      ),
    );

    setMensajeExito(
      `Documento ${doc.referencia} facturado exitosamente. Se ha ocultado de la lista.`,
    );

    setTimeout(() => {
      setMensajeExito('');
    }, 5000);
  }, [documentos]);

  // Columnas de la tabla
  const columns = useMemo<ColumnDef<DocumentoPendiente>[]>(
    () => [
      {
        accessorKey: 'referencia',
        header: ({ column }) => (
          <DataGridColumnHeader title="Referencia" column={column} />
        ),
        cell: (info) => (
          <span className="font-mono font-medium">
            {info.getValue<string>()}
          </span>
        ),
        size: 140,
      },
      {
        accessorKey: 'tipo',
        header: ({ column }) => (
          <DataGridColumnHeader title="Tipo" column={column} />
        ),
        cell: (info) => {
          const tipo = info.getValue<string>();
          return (
            <Badge
              variant={tipo === 'venta' ? 'primary' : 'success'}
              appearance="light"
            >
              {tipo === 'venta' ? 'Venta' : 'Recepción'}
            </Badge>
          );
        },
        size: 100,
      },
      {
        accessorKey: 'fecha',
        header: ({ column }) => (
          <DataGridColumnHeader title="Fecha" column={column} />
        ),
        cell: (info) => {
          const fecha = new Date(info.getValue<string>());
          return fecha.toLocaleDateString('es-MX', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          });
        },
        size: 120,
      },
      {
        id: 'tercero',
        header: 'Cliente/Proveedor',
        cell: (info) => {
          const row = info.row.original;
          return row.cliente || row.proveedor || '-';
        },
        size: 220,
      },
      {
        accessorKey: 'monto',
        header: ({ column }) => (
          <DataGridColumnHeader title="Monto" column={column} />
        ),
        cell: (info) => (
          <span className="font-semibold">
            ${info.getValue<number>().toLocaleString('es-MX', {
              minimumFractionDigits: 2,
            })}
          </span>
        ),
        size: 120,
      },
      {
        id: 'archivoXML',
        header: 'XML',
        cell: (info) => {
          const row = info.row.original;
          if (row.archivoXML) {
            return (
              <div className="flex items-center gap-1 text-green-600">
                <CheckCircle className="size-4" />
                <span className="text-xs truncate max-w-[100px]">
                  {row.archivoXML}
                </span>
              </div>
            );
          }
          return (
            <Button
              variant="outline"
              size="sm"
              onClick={() => simularCargaArchivo(row.id, 'xml')}
            >
              <FileUp className="size-4 me-1" />
              Subir XML
            </Button>
          );
        },
        size: 150,
      },
      {
        id: 'archivoPDF',
        header: 'PDF',
        cell: (info) => {
          const row = info.row.original;
          if (row.archivoPDF) {
            return (
              <div className="flex items-center gap-1 text-green-600">
                <CheckCircle className="size-4" />
                <span className="text-xs truncate max-w-[100px]">
                  {row.archivoPDF}
                </span>
              </div>
            );
          }
          return (
            <Button
              variant="outline"
              size="sm"
              onClick={() => simularCargaArchivo(row.id, 'pdf')}
            >
              <FileUp className="size-4 me-1" />
              Subir PDF
            </Button>
          );
        },
        size: 150,
      },
      {
        accessorKey: 'estatus',
        header: ({ column }) => (
          <DataGridColumnHeader title="Estatus" column={column} />
        ),
        cell: (info) => {
          const estatus = info.getValue<string>();
          const variantes: Record<string, 'destructive' | 'warning' | 'success'> =
            {
              pendiente: 'destructive',
              parcial: 'warning',
              completo: 'success',
            };
          const etiquetas: Record<string, string> = {
            pendiente: 'Sin archivos',
            parcial: 'Incompleto',
            completo: 'Completo',
          };
          return (
            <Badge variant={variantes[estatus]} appearance="light">
              {etiquetas[estatus]}
            </Badge>
          );
        },
        size: 120,
      },
      {
        id: 'acciones',
        header: 'Acciones',
        cell: (info) => {
          const row = info.row.original;
          const puedeFinalizar = row.archivoXML && row.archivoPDF;
          return (
            <Button
              size="sm"
              disabled={!puedeFinalizar}
              onClick={() => finalizarDocumento(row.id)}
            >
              <CheckCircle className="size-4 me-1" />
              Finalizar
            </Button>
          );
        },
        size: 120,
      },
    ],
    [finalizarDocumento, simularCargaArchivo],
  );

  const table = useReactTable({
    data: documentosFiltrados,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
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
                  <CloudUpload className="size-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Carga de Facturas</h2>
                  <p className="text-sm text-muted-foreground">
                    Subir archivos XML y PDF para ventas y recepciones
                  </p>
                </div>
              </div>
              <Badge
                variant={instalacionActiva.tipo === 'almacen' ? 'success' : 'primary'}
                appearance="light"
                size="lg"
              >
                {instalacionActiva.nombre}
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
            <AlertTitle>¡Facturación completada!</AlertTitle>
            <AlertDescription>{mensajeExito}</AlertDescription>
          </Alert>
        )}

        {/* Estadísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="py-4 text-center">
              <div className="flex items-center justify-center gap-2 text-destructive">
                <XCircle className="size-5" />
                <p className="text-2xl font-bold">{estadisticas.pendientes}</p>
              </div>
              <p className="text-xs text-muted-foreground">Sin Archivos</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4 text-center">
              <div className="flex items-center justify-center gap-2 text-amber-600">
                <File className="size-5" />
                <p className="text-2xl font-bold">{estadisticas.parciales}</p>
              </div>
              <p className="text-xs text-muted-foreground">Incompletos</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4 text-center">
              <div className="flex items-center justify-center gap-2 text-primary">
                <FileText className="size-5" />
                <p className="text-2xl font-bold">{estadisticas.ventas}</p>
              </div>
              <p className="text-xs text-muted-foreground">Ventas Pendientes</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4 text-center">
              <div className="flex items-center justify-center gap-2 text-green-600">
                <FileText className="size-5" />
                <p className="text-2xl font-bold">{estadisticas.recepciones}</p>
              </div>
              <p className="text-xs text-muted-foreground">
                Recepciones Pendientes
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabla de Documentos */}
        <DataGrid table={table} recordCount={documentosFiltrados.length}>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <CardTitle>Documentos Pendientes de Facturación</CardTitle>
                  <CardDescription>
                    Cargue XML y PDF para cada documento
                  </CardDescription>
                </div>
                <Tabs value={tabActivo} onValueChange={setTabActivo}>
                  <TabsList>
                    <TabsTrigger value="todos">Todos</TabsTrigger>
                    <TabsTrigger value="ventas">Ventas</TabsTrigger>
                    <TabsTrigger value="recepciones">Recepciones</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            {documentosFiltrados.length > 0 ? (
              <>
                <CardTable>
                  <ScrollArea>
                    <DataGridTable />
                    <ScrollBar orientation="horizontal" />
                  </ScrollArea>
                </CardTable>
                <CardFooter>
                  <DataGridPagination />
                </CardFooter>
              </>
            ) : (
              <CardContent>
                <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                  <CheckCircle className="size-12 mb-4 text-green-500 opacity-50" />
                  <p className="text-lg font-medium">
                    ¡Todos los documentos están facturados!
                  </p>
                  <p className="text-sm">No hay documentos pendientes en esta categoría.</p>
                </div>
              </CardContent>
            )}
          </Card>
        </DataGrid>

        {/* Información */}
        <Alert variant="mono">
          <AlertIcon>
            <AlertCircle className="size-4" />
          </AlertIcon>
          <AlertTitle>Requisitos de Facturación</AlertTitle>
          <AlertDescription>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>
                Cada documento requiere <strong>ambos archivos</strong>: XML y PDF
              </li>
              <li>
                El XML debe corresponder al CFDI emitido por el SAT
              </li>
              <li>
                El PDF debe ser la representación impresa del CFDI
              </li>
              <li>
                Al finalizar, el documento se marcará como facturado y desaparecerá de la lista
              </li>
            </ul>
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
