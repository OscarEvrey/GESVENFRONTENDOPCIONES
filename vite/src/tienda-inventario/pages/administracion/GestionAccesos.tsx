import { useEffect, useState } from 'react';
import { Shield, Plus, Search, CheckCircle, XCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import type { AccesoInstalacionApiDto } from '../../types/api/securityTypes';

// Componentes Refactorizados
import { useAccesos } from './hooks/useAccesos'; // Ojo con la ruta donde pusiste el hook
import { TablaAccesos } from './components/TablaAccesos';
import { ModalAcceso } from './components/ModalAcceso';

export function GestionAccesosPage() {
  // Lógica extraída al Hook
  const { 
    instalacionActiva, accesos, roles, usuarios, cargando, 
    guardarAcceso, revocarAcceso, mostrarInactivos, setMostrarInactivos,
    rolFiltro, setRolFiltro, usuarioFiltro, setUsuarioFiltro,
    busqueda, setBusqueda,
    pagina, setPagina,
    tamanoPagina, setTamanoPagina,
    totalCount
  } = useAccesos();

  // Estado Local (UI)
  const [modalOpen, setModalOpen] = useState(false);
  const [accesoEditar, setAccesoEditar] = useState<AccesoInstalacionApiDto | null>(null);
  const [mensajeOk, setMensajeOk] = useState<string | null>(null);

  useEffect(() => {
    if (mensajeOk) {
      const id = setTimeout(() => setMensajeOk(null), 3000);
      return () => clearTimeout(id);
    }
  }, [mensajeOk]);

  // Handlers UI
  const handleCrear = () => {
    setAccesoEditar(null);
    setModalOpen(true);
  };

  const handleEditar = (acceso: AccesoInstalacionApiDto) => {
    setAccesoEditar(acceso);
    setModalOpen(true);
  };

  // Filtrado
  useEffect(() => {
    setPagina(1);
  }, [busqueda, rolFiltro, usuarioFiltro, mostrarInactivos, setPagina]);

  const totalResultados = totalCount;
  const totalPaginas = Math.max(1, Math.ceil(totalResultados / tamanoPagina));

  if (!instalacionActiva) return <div className="p-8 text-center">Selecciona una instalación.</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 dark:text-white">
            <Shield className="h-6 w-6 text-blue-600" /> Gestión de Accesos
          </h1>
          <p className="text-sm text-gray-500 mt-1">Administra accesos a <strong>{instalacionActiva.nombre}</strong>.</p>
        </div>
        <button onClick={handleCrear} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
          <Plus className="h-4 w-4" /> Nuevo Acceso
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar usuario o rol"
              className="w-full pl-10 pr-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-700 dark:text-gray-300">Rol</label>
            <select
              className="px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
              value={rolFiltro}
              onChange={(e) => setRolFiltro(Number(e.target.value))}
            >
              <option value={0}>Todos</option>
              {roles.map(r => (
                <option key={r.rolId} value={r.rolId}>{r.nombre}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-700 dark:text-gray-300">Usuario</label>
            <select
              className="px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
              value={usuarioFiltro}
              onChange={(e) => setUsuarioFiltro(Number(e.target.value))}
            >
              <option value={0}>Todos</option>
              {usuarios.map(u => (
                <option key={u.usuarioId} value={u.usuarioId}>{u.nombreCompleto}</option>
              ))}
            </select>
          </div>
          <label className="inline-flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              className="rounded border-gray-300 dark:border-gray-600"
              checked={mostrarInactivos}
              onChange={(e) => setMostrarInactivos(e.target.checked)}
            />
            Mostrar inactivos
          </label>
          <div className="flex items-center gap-2 ml-auto">
            <label className="text-sm text-gray-700 dark:text-gray-300">Tamaño página</label>
            <select
              className="px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
              value={tamanoPagina}
              onChange={(e) => { setTamanoPagina(Number(e.target.value)); setPagina(1); }}
            >
              {[10, 20, 50].map(sz => <option key={sz} value={sz}>{sz}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Tabla */}
      <TablaAccesos 
        accesos={accesos} 
        cargando={cargando} 
        onEditar={handleEditar} 
        onRevocar={(a) => {
          if(window.confirm(`¿Revocar acceso a ${a.usuarioNombreCompleto}?`)) { 
            revocarAcceso(a.accesoId).then(() => setMensajeOk('Acceso revocado exitosamente')); 
          }
        }}
      />

      {/* Paginación */}
      {totalResultados > 0 && (
        <div className="flex items-center justify-between mt-4 text-sm text-gray-600 dark:text-gray-300">
          <div>
            Mostrando {(Math.min(pagina * tamanoPagina, totalResultados))} de {totalResultados}
          </div>
          <div className="flex items-center gap-2">
            <button
              className="px-2 py-1 border rounded-md disabled:opacity-50"
              onClick={() => setPagina(p => Math.max(1, p - 1))}
              disabled={pagina <= 1}
              aria-label="Anterior"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span>Página {pagina} / {totalPaginas}</span>
            <button
              className="px-2 py-1 border rounded-md disabled:opacity-50"
              onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))}
              disabled={pagina >= totalPaginas}
              aria-label="Siguiente"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Modal */}
      <ModalAcceso 
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={async (uid, rid, isEdit, aid) => {
          await guardarAcceso(uid, rid, isEdit, aid); // El hook maneja la recarga
          setMensajeOk(isEdit ? 'Acceso actualizado exitosamente' : 'Acceso creado exitosamente');
        }}
        roles={roles}
        usuarios={usuarios}
        accesoInicial={accesoEditar}
      />

      {/* Toast de éxito */}
      {mensajeOk && (
        <div className="fixed bottom-6 right-6 z-50">
          <div className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm">{mensajeOk}</span>
            <button className="ml-2" onClick={() => setMensajeOk(null)} aria-label="Cerrar">
              <XCircle className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}