import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ScreenLoader } from '@/components/screen-loader';

const LazyTiendaInventarioModule = lazy(() => import('@/tienda-inventario'));

export function ModulesProvider() {
  return (
    <Routes>
      <Route
        path="/tienda-inventario/*"
        element={
          <Suspense fallback={<ScreenLoader />}>
            <LazyTiendaInventarioModule />
          </Suspense>
        }
      />
      {/* Redirect to tienda-inventario by default */}
      <Route path="*" element={<Navigate to="/tienda-inventario" replace />} />
    </Routes>
  );
}
