import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ScreenLoader } from '@/components/screen-loader';

const LazyTiendaInventarioModule = lazy(() => import('@/tienda-inventario'));

export function ModulesProvider() {
  return (
    <Routes>
      {/* Rutas principales del sistema Gesven */}
      <Route
        path="/selector-instalacion/*"
        element={
          <Suspense fallback={<ScreenLoader />}>
            <LazyTiendaInventarioModule routeType="selector" />
          </Suspense>
        }
      />
      <Route
        path="/tienda-inventario/*"
        element={
          <Suspense fallback={<ScreenLoader />}>
            <LazyTiendaInventarioModule routeType="main" />
          </Suspense>
        }
      />
      {/* Librería del Template - acceso solo por URL directa */}
      <Route
        path="/libreria-gesven/*"
        element={
          <Suspense fallback={<ScreenLoader />}>
            <LazyTiendaInventarioModule routeType="libreria" />
          </Suspense>
        }
      />
      {/* Redirect raíz a selector-instalacion (Default/Home) */}
      <Route path="/" element={<Navigate to="/selector-instalacion" replace />} />
      {/* Otras rutas redirigen a selector-instalacion */}
      <Route path="*" element={<Navigate to="/selector-instalacion" replace />} />
    </Routes>
  );
}
