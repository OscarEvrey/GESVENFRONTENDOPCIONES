import { Outlet } from 'react-router-dom';
import { useContextoInstalacion } from '../context/ContextoInstalacion';
import { DefaultLayout } from './index';

export function SelectorLayout() {
  const { instalacionActiva } = useContextoInstalacion();

  // Si no hay instalación activa, mostramos el selector en pantalla completa (sin sidebar/header)
  if (!instalacionActiva) {
    return (
      <div className="fixed inset-0 z-[100] bg-white dark:bg-neutral-950 overflow-y-auto flex flex-col items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-7xl mx-auto animate-in fade-in zoom-in duration-500 py-10">
          <Outlet />
        </div>
      </div>
    );
  }

  // Si ya hay una instalación activa, usamos el layout normal (con sidebar/header)
  // para que el usuario pueda navegar de regreso si lo desea.
  return <DefaultLayout />;
}
