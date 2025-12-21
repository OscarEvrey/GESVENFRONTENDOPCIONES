'use client';

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

// ============ TIPOS ============
export interface LineaOrdenCompra {
  articuloId: string;
  articuloNombre: string;
  cantidad: number;
  costoUnitario: number;
  subtotal: number;
}

export interface OrdenCompra {
  id: string;
  instalacionId: string;
  instalacionNombre: string;
  proveedorId: string;
  proveedorNombre: string;
  fechaSolicitud: string;
  fechaAprobacion?: string;
  fechaRechazo?: string;
  comentarios: string;
  motivoRechazo?: string;
  lineas: LineaOrdenCompra[];
  total: number;
  estatus: 'pendiente' | 'aprobada' | 'rechazada';
}

interface ContextoOrdenesCompraValor {
  ordenes: OrdenCompra[];
  agregarOrden: (orden: OrdenCompra) => void;
  aprobarOrden: (id: string) => void;
  rechazarOrden: (id: string, motivo: string) => void;
  obtenerOrdenesPorInstalacion: (instalacionId: string) => OrdenCompra[];
  obtenerOrdenesPendientesPorInstalacion: (instalacionId: string) => OrdenCompra[];
  generarIdOrden: () => string;
}

// ============ CONTEXTO ============
const ContextoOrdenesCompra = createContext<ContextoOrdenesCompraValor | undefined>(
  undefined,
);

// ============ DATOS FICTICIOS INICIALES ============
const ORDENES_INICIALES: OrdenCompra[] = [
  {
    id: 'OC-2024-0001',
    instalacionId: 'oficinas-scc-mty',
    instalacionNombre: 'Oficinas-SCC-MTY',
    proveedorId: 'prov-002',
    proveedorNombre: 'Distribuidora de Papelería Omega',
    fechaSolicitud: '2024-12-18T10:30:00.000Z',
    comentarios: 'Pedido urgente para resurtir papelería de oficina.',
    lineas: [
      {
        articuloId: 'art-o01',
        articuloNombre: 'Hojas Blancas Carta (500)',
        cantidad: 50,
        costoUnitario: 75.0,
        subtotal: 3750.0,
      },
      {
        articuloId: 'art-o02',
        articuloNombre: 'Plumas BIC Azul (12)',
        cantidad: 20,
        costoUnitario: 36.0,
        subtotal: 720.0,
      },
    ],
    total: 4470.0,
    estatus: 'pendiente',
  },
  {
    id: 'OC-2024-0002',
    instalacionId: 'almacen-scc-mty',
    instalacionNombre: 'Almacen-SCC-MTY',
    proveedorId: 'prov-003',
    proveedorNombre: 'Comercializadora de Bebidas del Golfo',
    fechaSolicitud: '2024-12-19T14:00:00.000Z',
    comentarios: 'Reposición de inventario de refrescos para temporada alta.',
    lineas: [
      {
        articuloId: 'art-a01',
        articuloNombre: 'Coca-Cola 600ml',
        cantidad: 500,
        costoUnitario: 12.5,
        subtotal: 6250.0,
      },
      {
        articuloId: 'art-a02',
        articuloNombre: 'Pepsi 600ml',
        cantidad: 300,
        costoUnitario: 11.8,
        subtotal: 3540.0,
      },
      {
        articuloId: 'art-a05',
        articuloNombre: 'Agua Ciel 1L',
        cantidad: 400,
        costoUnitario: 8.0,
        subtotal: 3200.0,
      },
    ],
    total: 12990.0,
    estatus: 'pendiente',
  },
  {
    id: 'OC-2024-0003',
    instalacionId: 'oficinas-vaxsa-mty',
    instalacionNombre: 'Oficinas-Vaxsa-MTY',
    proveedorId: 'prov-002',
    proveedorNombre: 'Distribuidora de Papelería Omega',
    fechaSolicitud: '2024-12-20T09:15:00.000Z',
    comentarios: 'Suministros para el área de contabilidad.',
    lineas: [
      {
        articuloId: 'art-o03',
        articuloNombre: 'Toner HP 85A',
        cantidad: 5,
        costoUnitario: 520.0,
        subtotal: 2600.0,
      },
      {
        articuloId: 'art-o04',
        articuloNombre: 'Folders Carta (25)',
        cantidad: 10,
        costoUnitario: 65.0,
        subtotal: 650.0,
      },
    ],
    total: 3250.0,
    estatus: 'pendiente',
  },
  {
    id: 'OC-2024-0004',
    instalacionId: 'almacen-vaxsa-mty',
    instalacionNombre: 'Almacen-Vaxsa-MTY',
    proveedorId: 'prov-005',
    proveedorNombre: 'Alimentos y Snacks del Pacífico',
    fechaSolicitud: '2024-12-20T11:45:00.000Z',
    comentarios: 'Pedido semanal de snacks.',
    lineas: [
      {
        articuloId: 'art-a03',
        articuloNombre: 'Sabritas Original 45g',
        cantidad: 200,
        costoUnitario: 9.5,
        subtotal: 1900.0,
      },
      {
        articuloId: 'art-a04',
        articuloNombre: 'Doritos Nacho 62g',
        cantidad: 150,
        costoUnitario: 12.0,
        subtotal: 1800.0,
      },
    ],
    total: 3700.0,
    estatus: 'pendiente',
  },
];

// ============ PROVIDER ============
interface ContextoOrdenesCompraProviderProps {
  children: ReactNode;
}

export function ContextoOrdenesCompraProvider({
  children,
}: ContextoOrdenesCompraProviderProps) {
  const [ordenes, setOrdenes] = useState<OrdenCompra[]>(ORDENES_INICIALES);
  const [contadorOrden, setContadorOrden] = useState(5);

  const generarIdOrden = useCallback(() => {
    const nuevoId = `OC-2024-${String(contadorOrden).padStart(4, '0')}`;
    setContadorOrden((prev) => prev + 1);
    return nuevoId;
  }, [contadorOrden]);

  const agregarOrden = useCallback((orden: OrdenCompra) => {
    setOrdenes((prev) => [...prev, orden]);
  }, []);

  const aprobarOrden = useCallback((id: string) => {
    setOrdenes((prev) =>
      prev.map((orden) =>
        orden.id === id
          ? {
              ...orden,
              estatus: 'aprobada' as const,
              fechaAprobacion: new Date().toISOString(),
            }
          : orden,
      ),
    );
  }, []);

  const rechazarOrden = useCallback((id: string, motivo: string) => {
    setOrdenes((prev) =>
      prev.map((orden) =>
        orden.id === id
          ? {
              ...orden,
              estatus: 'rechazada' as const,
              fechaRechazo: new Date().toISOString(),
              motivoRechazo: motivo,
            }
          : orden,
      ),
    );
  }, []);

  const obtenerOrdenesPorInstalacion = useCallback(
    (instalacionId: string) => {
      return ordenes.filter((orden) => orden.instalacionId === instalacionId);
    },
    [ordenes],
  );

  const obtenerOrdenesPendientesPorInstalacion = useCallback(
    (instalacionId: string) => {
      return ordenes.filter(
        (orden) =>
          orden.instalacionId === instalacionId && orden.estatus === 'pendiente',
      );
    },
    [ordenes],
  );

  const valor = useMemo<ContextoOrdenesCompraValor>(
    () => ({
      ordenes,
      agregarOrden,
      aprobarOrden,
      rechazarOrden,
      obtenerOrdenesPorInstalacion,
      obtenerOrdenesPendientesPorInstalacion,
      generarIdOrden,
    }),
    [
      ordenes,
      agregarOrden,
      aprobarOrden,
      rechazarOrden,
      obtenerOrdenesPorInstalacion,
      obtenerOrdenesPendientesPorInstalacion,
      generarIdOrden,
    ],
  );

  return (
    <ContextoOrdenesCompra.Provider value={valor}>
      {children}
    </ContextoOrdenesCompra.Provider>
  );
}

// ============ HOOK ============
export function useOrdenesCompra(): ContextoOrdenesCompraValor {
  const contexto = useContext(ContextoOrdenesCompra);
  if (contexto === undefined) {
    throw new Error(
      'useOrdenesCompra debe usarse dentro de un ContextoOrdenesCompraProvider',
    );
  }
  return contexto;
}
