import { useState } from 'react';
import { Shield, Plus, Search } from 'lucide-react';
import type { AccesoInstalacionApiDto } from '../../types/api/securityTypes';

// Componentes Refactorizados
import { useAccesos } from './hooks/useAccesos'; // Ojo con la ruta donde pusiste el hook
import { TablaAccesos } from './components/TablaAccesos';
import { ModalAcceso } from './components/ModalAcceso';

export function GestionAccesosPage() {
  // Lógica extraída al Hook
  const { 
    instalacionActiva, accesos, roles, usuarios, cargando, 
    guardarAcceso, revocarAcceso 
  } = useAccesos();

  // Estado Local (UI)
  const [busqueda, setBusqueda] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [accesoEditar, setAccesoEditar] = useState<AccesoInstalacionApiDto | null>(null);

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
  const accesosFiltrados = accesos.filter(a => 
    a.usuarioNombreCompleto.toLowerCase().includes(busqueda.toLowerCase()) ||
    a.usuarioEmail.toLowerCase().includes(busqueda.toLowerCase()) ||
    a.rolNombre.toLowerCase().includes(busqueda.toLowerCase())
  );

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

      {/* Buscador */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6 relative">
        <Search className="absolute left-7 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar..."
          className="w-full pl-10 pr-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      {/* Tabla */}
      <TablaAccesos 
        accesos={accesosFiltrados} 
        cargando={cargando} 
        onEditar={handleEditar} 
        onRevocar={(a) => {
          if(window.confirm(`¿Revocar acceso a ${a.usuarioNombreCompleto}?`)) revocarAcceso(a.accesoId);
        }}
      />

      {/* Modal */}
      <ModalAcceso 
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={async (uid, rid, isEdit, aid) => {
          await guardarAcceso(uid, rid, isEdit, aid); // El hook maneja la recarga
        }}
        roles={roles}
        usuarios={usuarios}
        accesoInicial={accesoEditar}
      />
    </div>
  );
}