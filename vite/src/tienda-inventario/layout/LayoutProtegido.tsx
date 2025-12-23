import { Navigate, Outlet } from 'react-router-dom';
import { useContextoInstalacion } from '../context/ContextoInstalacion';

export function LayoutProtegido() {
  const { instalacionActiva } = useContextoInstalacion();

  if (!instalacionActiva) {
    return <Navigate to="/selector-instalacion" replace />;
  }

  return <Outlet />;
}
