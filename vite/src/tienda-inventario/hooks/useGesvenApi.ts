import { useEffect, useState } from 'react';
import gesvenApi, { 
  InstalacionApiDto, 
  ProductoInventarioApiDto,
  ProveedorApiDto,
  ProductoSimpleApiDto,
  CrearOrdenCompraDto,
  OrdenCompraRespuestaDto
} from '../services/gesvenApi';

/**
 * Hook para obtener las instalaciones desde la API
 */
export function useInstalacionesApi() {
  const [instalaciones, setInstalaciones] = useState<InstalacionApiDto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelado = false;

    async function cargarInstalaciones() {
      try {
        setCargando(true);
        setError(null);
        const datos = await gesvenApi.obtenerInstalaciones();
        if (!cancelado) {
          setInstalaciones(datos);
        }
      } catch (err) {
        if (!cancelado) {
          setError(err instanceof Error ? err.message : 'Error desconocido');
        }
      } finally {
        if (!cancelado) {
          setCargando(false);
        }
      }
    }

    cargarInstalaciones();

    return () => {
      cancelado = true;
    };
  }, []);

  return { instalaciones, cargando, error };
}

/**
 * Hook para obtener el inventario de una instalación
 */
export function useInventarioApi(instalacionId: number | null) {
  const [productos, setProductos] = useState<ProductoInventarioApiDto[]>([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!instalacionId) {
      setProductos([]);
      return;
    }

    let cancelado = false;

    async function cargarInventario() {
      try {
        setCargando(true);
        setError(null);
        const datos = await gesvenApi.obtenerInventario(instalacionId);
        if (!cancelado) {
          setProductos(datos);
        }
      } catch (err) {
        if (!cancelado) {
          setError(err instanceof Error ? err.message : 'Error desconocido');
        }
      } finally {
        if (!cancelado) {
          setCargando(false);
        }
      }
    }

    cargarInventario();

    return () => {
      cancelado = true;
    };
  }, [instalacionId]);

  const recargar = async () => {
    if (!instalacionId) return;
    try {
      setCargando(true);
      setError(null);
      const datos = await gesvenApi.obtenerInventario(instalacionId);
      setProductos(datos);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setCargando(false);
    }
  };

  return { productos, cargando, error, recargar };
}

/**
 * Hook para obtener proveedores
 */
export function useProveedoresApi() {
  const [proveedores, setProveedores] = useState<ProveedorApiDto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelado = false;

    async function cargarProveedores() {
      try {
        setCargando(true);
        setError(null);
        const datos = await gesvenApi.obtenerProveedores();
        if (!cancelado) {
          setProveedores(datos);
        }
      } catch (err) {
        if (!cancelado) {
          setError(err instanceof Error ? err.message : 'Error desconocido');
        }
      } finally {
        if (!cancelado) {
          setCargando(false);
        }
      }
    }

    cargarProveedores();

    return () => {
      cancelado = true;
    };
  }, []);

  return { proveedores, cargando, error };
}

/**
 * Hook para obtener productos de una instalación (para selectores)
 */
export function useProductosParaCompraApi(instalacionId: number | null) {
  const [productos, setProductos] = useState<ProductoSimpleApiDto[]>([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!instalacionId) {
      setProductos([]);
      return;
    }

    let cancelado = false;

    async function cargarProductos() {
      try {
        setCargando(true);
        setError(null);
        const datos = await gesvenApi.obtenerProductosParaCompra(instalacionId);
        if (!cancelado) {
          setProductos(datos);
        }
      } catch (err) {
        if (!cancelado) {
          setError(err instanceof Error ? err.message : 'Error desconocido');
        }
      } finally {
        if (!cancelado) {
          setCargando(false);
        }
      }
    }

    cargarProductos();

    return () => {
      cancelado = true;
    };
  }, [instalacionId]);

  return { productos, cargando, error };
}

/**
 * Hook para crear órdenes de compra
 */
export function useCrearOrdenCompra() {
  const [creando, setCreando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const crearOrden = async (orden: CrearOrdenCompraDto): Promise<OrdenCompraRespuestaDto | null> => {
    try {
      setCreando(true);
      setError(null);
      const resultado = await gesvenApi.crearOrdenCompra(orden);
      return resultado;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      return null;
    } finally {
      setCreando(false);
    }
  };

  return { crearOrden, creando, error };
}

/**
 * Hook para obtener órdenes de compra
 */
export function useOrdenesCompraApi(instalacionId?: number) {
  const [ordenes, setOrdenes] = useState<OrdenCompraRespuestaDto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelado = false;

    async function cargarOrdenes() {
      try {
        setCargando(true);
        setError(null);
        const datos = await gesvenApi.obtenerOrdenesCompra(instalacionId);
        if (!cancelado) {
          setOrdenes(datos);
        }
      } catch (err) {
        if (!cancelado) {
          setError(err instanceof Error ? err.message : 'Error desconocido');
        }
      } finally {
        if (!cancelado) {
          setCargando(false);
        }
      }
    }

    cargarOrdenes();

    return () => {
      cancelado = true;
    };
  }, [instalacionId]);

  const recargar = async () => {
    try {
      setCargando(true);
      setError(null);
      const datos = await gesvenApi.obtenerOrdenesCompra(instalacionId);
      setOrdenes(datos);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setCargando(false);
    }
  };

  return { ordenes, cargando, error, recargar };
}
