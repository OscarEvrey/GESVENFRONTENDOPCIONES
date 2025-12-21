import { Navigate, Route, Routes } from 'react-router-dom';
import { DefaultLayout } from './layout';
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

export default function TiendaInventarioModule() {
  return (
    <Routes>
      <Route element={<DefaultLayout />}>
        <Route index element={<Navigate to="tablero" replace />} />
        <Route path="tablero" element={<TableroPage />} />
        <Route path="dark-sidebar" element={<TableroPage />} />
        {/* Rutas de Librería de Prototipos Gesven */}
        <Route
          path="libreria-gesven/tablas-maestras"
          element={<TablasMaestrasPage />}
        />
        <Route
          path="libreria-gesven/formularios-captura"
          element={<FormulariosCapturaPage />}
        />
        <Route
          path="libreria-gesven/selectores-filtros"
          element={<SelectoresFiltrosPage />}
        />
        <Route
          path="libreria-gesven/calendarios-fechas"
          element={<CalendariosFechasPage />}
        />
        <Route
          path="libreria-gesven/componentes-control"
          element={<ComponentesControlPage />}
        />
        {/* Rutas existentes */}
        <Route path="todo-el-stock" element={<AllStock />} />
        <Route path="stock-actual" element={<CurrentStock />} />
        <Route path="stock-entrante" element={<InboundStock />} />
        <Route path="stock-saliente" element={<OutboundStock />} />
        <Route path="planificador-stock" element={<StockPlanner />} />
        <Route path="lista-productos" element={<ListaProductosPage />} />
        <Route path="detalles-producto" element={<ProductDetailsPage />} />
        <Route path="crear-producto" element={<CrearProductoPage />} />
        <Route path="editar-producto" element={<EditarProductoPage />} />
        <Route path="stock-por-producto" element={<PerProductStockPage />} />
        <Route path="rastrear-envio" element={<TrackShippingPage />} />
        <Route path="info-producto" element={<ProductInfoPage />} />
        <Route path="lista-clientes" element={<CustomerList />} />
        <Route path="detalles-lista-clientes" element={<CustomerListDetails />} />
        <Route path="modal-configuracion" element={<SettingsModal />} />
        <Route
          path="crear-etiqueta-envio"
          element={<CreateShippingLabelPage />}
        />
        <Route path="gestionar-variantes" element={<ManageVariantsPage />} />
        <Route path="lista-categorias" element={<CategoryList />} />
        <Route path="crear-categoria" element={<CreateCategoryPage />} />
        <Route path="editar-categoria" element={<EditarCategoriaPage />} />
        <Route path="detalles-categoria" element={<CategoryDetails />} />
        <Route path="lista-pedidos" element={<OrderList />} />
        <Route path="productos-lista-pedidos" element={<OrderListProducts />} />
        <Route path="detalles-pedido" element={<OrderDetailsPage />} />
        <Route path="seguimiento-pedido" element={<OrderTrackingPage />} />
      </Route>
    </Routes>
  );
}
