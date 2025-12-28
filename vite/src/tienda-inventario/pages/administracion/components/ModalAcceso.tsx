import { useState, useEffect } from 'react';
import { X, Save, Loader2, UserCheck, Shield, AlertCircle } from 'lucide-react';
import type { 
  AccesoInstalacionApiDto, 
  RolSeguridadApiDto, 
  UsuarioSeguridadApiDto 
} from '../../../types/api/securityTypes';

interface ModalAccesoProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (usuarioId: number, rolId: number, esEdicion: boolean, accesoId?: number) => Promise<void>;
  roles: RolSeguridadApiDto[];
  usuarios: UsuarioSeguridadApiDto[];
  accesoInicial: AccesoInstalacionApiDto | null;
}

export function ModalAcceso({ isOpen, onClose, onSave, roles, usuarios, accesoInicial }: ModalAccesoProps) {
  const [usuarioId, setUsuarioId] = useState(0);
  const [rolId, setRolId] = useState(0);
  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (accesoInicial) {
        setUsuarioId(accesoInicial.usuarioId);
        setRolId(accesoInicial.rolId);
      } else {
        setUsuarioId(0);
        setRolId(roles[0]?.rolId || 0);
      }
      setError(null);
    }
  }, [isOpen, accesoInicial, roles]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rolId <= 0) return;
    if (!accesoInicial && usuarioId <= 0) {
      setError('Selecciona un usuario');
      return;
    }

    try {
      setProcesando(true);
      await onSave(usuarioId, rolId, !!accesoInicial, accesoInicial?.accesoId);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar');
    } finally {
      setProcesando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            {accesoInicial ? 'Editar Rol' : 'Nuevo Acceso'}
          </h3>
          <button onClick={onClose}><X className="h-5 w-5 text-gray-400" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {!accesoInicial ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Usuario</label>
              <select 
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 outline-none"
                value={usuarioId} 
                onChange={e => setUsuarioId(Number(e.target.value))}
              >
                <option value={0}>-- Seleccionar --</option>
                {usuarios.map(u => <option key={u.usuarioId} value={u.usuarioId}>{u.nombreCompleto} ({u.email})</option>)}
              </select>
            </div>
          ) : (
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg flex gap-3">
              <UserCheck className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100">{accesoInicial.usuarioNombreCompleto}</p>
                <p className="text-xs text-blue-700 dark:text-blue-300">Editando permisos</p>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rol</label>
            <div className="relative">
              <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select 
                className="w-full pl-9 pr-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 outline-none"
                value={rolId} 
                onChange={e => setRolId(Number(e.target.value))}
              >
                {roles.map(r => <option key={r.rolId} value={r.rolId}>{r.nombre}</option>)}
              </select>
            </div>
          </div>

          {error && <div className="text-sm text-red-600 bg-red-50 p-2 rounded flex gap-2"><AlertCircle className="h-4 w-4"/> {error}</div>}

          <div className="flex justify-end gap-3 pt-4 border-t dark:border-gray-700">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg">Cancelar</button>
            <button type="submit" disabled={procesando} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50">
              {procesando ? <Loader2 className="h-4 w-4 animate-spin"/> : <Save className="h-4 w-4"/>} Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}