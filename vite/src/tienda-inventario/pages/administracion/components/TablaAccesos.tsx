import { Edit, UserX, UserCheck, Loader2 } from 'lucide-react';
import type { AccesoInstalacionApiDto } from '../../../types/api/securityTypes';

interface TablaAccesosProps {
  accesos: AccesoInstalacionApiDto[];
  cargando: boolean;
  onEditar: (acceso: AccesoInstalacionApiDto) => void;
  onRevocar: (acceso: AccesoInstalacionApiDto) => void;
}

export function TablaAccesos({ accesos, cargando, onEditar, onRevocar }: TablaAccesosProps) {
  if (cargando) {
    return (
      <div className="p-12 flex justify-center items-center bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (accesos.length === 0) {
    return (
      <div className="p-12 text-center text-gray-500 bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700">
        No se encontraron accesos registrados.
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-900/50 text-xs uppercase text-gray-500 dark:text-gray-400 font-semibold border-b dark:border-gray-700">
              <th className="px-6 py-4">Usuario</th>
              <th className="px-6 py-4">Rol Asignado</th>
              <th className="px-6 py-4 text-center">Estado</th>
              <th className="px-6 py-4 text-center">Última Act.</th>
              <th className="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {accesos.map((acceso) => (
              <tr key={acceso.accesoId} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {acceso.usuarioNombreCompleto}
                    </span>
                    <span className="text-xs text-gray-500">{acceso.usuarioEmail}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                    {acceso.rolNombre}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  {acceso.esActivo ? (
                    <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded-full">Activo</span>
                  ) : (
                    <span className="text-xs font-medium text-red-700 bg-red-100 px-2 py-1 rounded-full">Inactivo</span>
                  )}
                </td>
                <td className="px-6 py-4 text-center text-xs text-gray-500">
                  {new Date(acceso.actualizadoEn).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => onEditar(acceso)} className="p-1.5 hover:bg-blue-50 text-gray-500 hover:text-blue-600 rounded">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button onClick={() => onRevocar(acceso)} className="p-1.5 hover:bg-red-50 text-gray-500 hover:text-red-600 rounded">
                      {acceso.esActivo ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}