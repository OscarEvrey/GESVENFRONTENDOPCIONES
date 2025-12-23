import type { ReactElement } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ContextoInstalacionProvider } from './context/ContextoInstalacion';
import { ContextoOrdenesCompraProvider } from './context/ContextoOrdenesCompra';
import { DefaultLayout } from './layout';
import { LayoutProtegido } from './layout/LayoutProtegido';
import { AllStock } from './pages/todo-el-stock/page';
import { CategoryDetails } from './pages/detalles-categoria/page';
import { CategoryList } from './pages/lista-categorias/page';
import { CreateCategoryPage } from './pages/crear-categoria/page';
import { CrearProductoPage } from './pages/crear-producto/page';
import { CreateShippingLabelPage } from './pages/crear-etiqueta-envio/page';
import { CurrentStock } from './pages/stock-actual/page';
import { TableroPage } from './pages/tablero/page';
import { InboundStock } from './pages/stock-entrante/page';
import { ManageVariantsPage } from './pages/gestionar-variantes/page';
import { OrderList } from './pages/lista-pedidos/page';
import { OrderDetailsPage } from './pages/detalles-pedido/page';
import { OrderTrackingPage } from './pages/seguimiento-pedido/page';
import { OutboundStock } from './pages/stock-saliente/page';
import { PerProductStockPage } from './pages/stock-por-producto/page';
import { ProductDetailsPage } from './pages/detalles-producto/page';
import { ListaProductosPage } from './pages/lista-productos/page';
import { StockPlanner } from './pages/planificador-stock/page';
import { TrackShippingPage } from './pages/rastrear-envio/page';
import { EditarCategoriaPage } from './pages/editar-categoria/page';
import { EditarProductoPage } from './pages/editar-producto/page';
import { ProductInfoPage } from './pages/info-producto/page';
import { CustomerList } from './pages/lista-clientes/page';
import { CustomerListDetails } from './pages/detalles-lista-clientes/page';
import { OrderListProducts } from './pages/productos-lista-pedidos/page';
import { SettingsModal } from './pages/modal-configuracion/page';
// Librería de Prototipos Gesven
import { TablasMaestrasPage } from './pages/libreria-gesven/tablas-maestras';
import { FormulariosCapturaPage } from './pages/libreria-gesven/formularios-captura';
import { SelectoresFiltrosPage } from './pages/libreria-gesven/selectores-filtros';
import { CalendariosFechasPage } from './pages/libreria-gesven/calendarios-fechas';
import { ComponentesControlPage } from './pages/libreria-gesven/componentes-control';
// Nuevas páginas de Contexto e Inventario
import { SelectorInstalacionPage } from './pages/contexto/SelectorInstalacion';
import { InventarioActualPage } from './pages/inventario/InventarioActual';
import { RecepcionMercanciaPage } from './pages/inventario/RecepcionMercancia';
import { KardexMovimientosPage } from './pages/inventario/KardexMovimientos';
import { TransferenciasPage } from './pages/inventario/Transferencias';
import { AjustesInventarioPage } from './pages/inventario/AjustesInventario';
// Dashboard
import { DashboardPage } from './pages/tablero/Dashboard';
// Páginas de Compras
import { NuevaOrdenCompraPage } from './pages/compras/NuevaOrdenCompra';
import { AprobacionComprasPage } from './pages/compras/AprobacionCompras';
// Páginas de Finanzas
import { RegistroVentasPage } from './pages/finanzas/RegistroVentas';
import { CargaFacturasPage } from './pages/finanzas/CargaFacturas';
import { GestionPagosPage } from './pages/finanzas/GestionPagos';
// Páginas de Administración
import { MonitorCancelacionesPage } from './pages/administracion/MonitorCancelaciones';
import { GestionAccesosPage } from './pages/administracion/GestionAccesos';
// Páginas de Catálogos
import { ClientesProveedoresPage } from './pages/catalogos/ClientesProveedores';
import { ArticulosPage } from './pages/catalogos/Articulos';

interface TiendaInventarioModuleProps {
  routeType?: 'main' | 'selector' | 'libreria';
}

type RouteConfig = {
  path: string;
  element: ReactElement;
};

const libreriaRoutes: RouteConfig[] = [
  { path: 'tablas-maestras', element: <TablasMaestrasPage /> },
  { path: 'formularios-captura', element: <FormulariosCapturaPage /> },
  { path: 'selectores-filtros', element: <SelectoresFiltrosPage /> },
  { path: 'calendarios-fechas', element: <CalendariosFechasPage /> },
  { path: 'componentes-control', element: <ComponentesControlPage /> },
];

const protectedRoutes: RouteConfig[] = [
  { path: 'inventario-actual', element: <InventarioActualPage /> },
  { path: 'recepcion-mercancia', element: <RecepcionMercanciaPage /> },
  { path: 'kardex-movimientos', element: <KardexMovimientosPage /> },
  { path: 'transferencias', element: <TransferenciasPage /> },
  { path: 'ajustes-inventario', element: <AjustesInventarioPage /> },
  { path: 'nueva-orden-compra', element: <NuevaOrdenCompraPage /> },
  { path: 'aprobacion-compras', element: <AprobacionComprasPage /> },
  { path: 'registro-ventas', element: <RegistroVentasPage /> },
  { path: 'carga-facturas', element: <CargaFacturasPage /> },
  { path: 'gestion-pagos', element: <GestionPagosPage /> },
  { path: 'monitor-cancelaciones', element: <MonitorCancelacionesPage /> },
  { path: 'clientes-proveedores', element: <ClientesProveedoresPage /> },
  { path: 'articulos', element: <ArticulosPage /> },
  { path: 'gestion-accesos', element: <GestionAccesosPage /> },
  { path: 'dashboard', element: <DashboardPage /> },
  { path: 'tablero', element: <TableroPage /> },
  { path: 'dark-sidebar', element: <TableroPage /> },
  { path: 'todo-el-stock', element: <AllStock /> },
  { path: 'stock-actual', element: <CurrentStock /> },
  { path: 'stock-entrante', element: <InboundStock /> },
  { path: 'stock-saliente', element: <OutboundStock /> },
  { path: 'planificador-stock', element: <StockPlanner /> },
  { path: 'lista-productos', element: <ListaProductosPage /> },
  { path: 'detalles-producto', element: <ProductDetailsPage /> },
  { path: 'crear-producto', element: <CrearProductoPage /> },
  { path: 'editar-producto', element: <EditarProductoPage /> },
  { path: 'stock-por-producto', element: <PerProductStockPage /> },
  { path: 'rastrear-envio', element: <TrackShippingPage /> },
  { path: 'info-producto', element: <ProductInfoPage /> },
  { path: 'lista-clientes', element: <CustomerList /> },
  { path: 'detalles-lista-clientes', element: <CustomerListDetails /> },
  { path: 'modal-configuracion', element: <SettingsModal /> },
  { path: 'crear-etiqueta-envio', element: <CreateShippingLabelPage /> },
  { path: 'gestionar-variantes', element: <ManageVariantsPage /> },
  { path: 'lista-categorias', element: <CategoryList /> },
  { path: 'crear-categoria', element: <CreateCategoryPage /> },
  { path: 'editar-categoria', element: <EditarCategoriaPage /> },
  { path: 'detalles-categoria', element: <CategoryDetails /> },
  { path: 'lista-pedidos', element: <OrderList /> },
  { path: 'productos-lista-pedidos', element: <OrderListProducts /> },
  { path: 'detalles-pedido', element: <OrderDetailsPage /> },
  { path: 'seguimiento-pedido', element: <OrderTrackingPage /> },
];

function renderRoutes(config: RouteConfig[]) {
  return config.map(({ path, element }) => <Route key={path} path={path} element={element} />);
}

export default function TiendaInventarioModule({ routeType = 'main' }: TiendaInventarioModuleProps) {
  return (
    <ContextoInstalacionProvider>
      <ContextoOrdenesCompraProvider>
        <Routes>
          {/* Ruta raíz para selector-instalacion (cuando routeType === 'selector') */}
          {routeType === 'selector' && (
            <Route element={<DefaultLayout />}>
              <Route index element={<SelectorInstalacionPage />} />
              <Route path="*" element={<Navigate to="." replace />} />
            </Route>
          )}
          
          {/* Rutas de Librería de Prototipos Gesven (acceso solo por URL directa) */}
          {routeType === 'libreria' && (
            <Route element={<DefaultLayout />}>
              {renderRoutes(libreriaRoutes)}
              <Route index element={<Navigate to="tablas-maestras" replace />} />
              <Route path="*" element={<Navigate to="tablas-maestras" replace />} />
            </Route>
          )}

          {/* Rutas principales del sistema Gesven */}
          {routeType === 'main' && (
            <Route element={<DefaultLayout />}>
              <Route index element={<Navigate to="/selector-instalacion" replace />} />

              <Route element={<LayoutProtegido />}>
                {renderRoutes(protectedRoutes)}
                <Route path="*" element={<Navigate to="/selector-instalacion" replace />} />
              </Route>
            </Route>
          )}
        </Routes>
      </ContextoOrdenesCompraProvider>
    </ContextoInstalacionProvider>
  );
}
