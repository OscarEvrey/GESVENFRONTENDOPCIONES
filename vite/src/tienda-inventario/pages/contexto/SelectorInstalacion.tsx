'use client';

import { Building2, Lock, MapPin, Package, Warehouse } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Instalacion,
  useContextoInstalacion,
} from '../../context/ContextoInstalacion';

export function SelectorInstalacionPage() {
  const { instalaciones, cargandoInstalaciones, errorInstalaciones, seleccionarInstalacion, instalacionActiva } = useContextoInstalacion();
  const navigate = useNavigate();

  const handleSeleccionar = (instalacion: Instalacion) => {
    seleccionarInstalacion(instalacion);
    navigate('/tienda-inventario/inventario-actual');
  };

  const obtenerIcono = (tipo: 'almacen' | 'oficinas') => {
    return tipo === 'almacen' ? (
      <Warehouse className="size-10 text-primary" />
    ) : (
      <Building2 className="size-10 text-primary" />
    );
  };

  const obtenerColorBorde = (tipo: 'almacen' | 'oficinas', conAcceso: boolean) => {
    if (!conAcceso) {
      return 'opacity-60 cursor-not-allowed';
    }
    return tipo === 'almacen'
      ? 'hover:border-green-500'
      : 'hover:border-blue-500';
  };

  return (
    <div className="w-full mx-auto px-4">
      <div className="flex flex-col gap-8">
        {/* Encabezado */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-5 bg-primary/10 rounded-2xl shadow-sm">
              <Package className="size-14 text-primary" />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
              Seleccionar Instalación
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Seleccione la instalación con la que desea trabajar. El inventario y
              las operaciones se filtrarán según su selección.
            </p>
          </div>
        </div>

        {/* Cuadrícula de Instalaciones */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {cargandoInstalaciones ? (
            <div className="col-span-full text-center text-sm text-muted-foreground">
              Cargando instalaciones...
            </div>
          ) : errorInstalaciones ? (
            <div className="col-span-full text-center text-sm text-destructive">
              {errorInstalaciones}
            </div>
          ) : instalaciones.length === 0 ? (
            <div className="col-span-full text-center text-sm text-muted-foreground">
              No hay instalaciones disponibles.
            </div>
          ) : (
            instalaciones.map((instalacion) => {
              const conAcceso = true; // La API ya filtra por permisos del usuario
            return (
              <Card
                key={instalacion.id}
                className={`transition-all duration-200 ${
                  conAcceso
                    ? 'cursor-pointer hover:shadow-lg hover:scale-[1.02]'
                    : 'opacity-60 cursor-not-allowed'
                } ${obtenerColorBorde(instalacion.tipo, conAcceso)}`}
                onClick={() => handleSeleccionar(instalacion)}
              >
                <CardHeader className="text-center pb-2">
                  <div className="flex justify-center mb-3 relative">
                    <div className={`p-3 rounded-full ${conAcceso ? 'bg-muted' : 'bg-muted/50'}`}>
                      {obtenerIcono(instalacion.tipo)}
                    </div>
                    {/* Candado para instalaciones sin acceso */}
                    {!conAcceso && (
                      <div className="absolute -top-1 -right-1 p-1.5 bg-red-100 rounded-full">
                        <Lock className="size-4 text-red-600" />
                      </div>
                    )}
                  </div>
                  <CardTitle className={`text-lg ${!conAcceso ? 'text-muted-foreground' : ''}`}>
                    {instalacion.nombre}
                  </CardTitle>
                  <CardDescription className="flex flex-col gap-2">
                    <div className="flex items-center justify-center gap-1">
                      <MapPin className="size-3" />
                      <span>{instalacion.ubicacion}</span>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-3">
                  <div className="flex justify-center gap-2">
                    <Badge
                      variant={instalacion.tipo === 'almacen' ? 'success' : 'primary'}
                      appearance="light"
                    >
                      {instalacion.tipo === 'almacen' ? 'Almacén' : 'Oficinas'}
                    </Badge>
                    <Badge variant="secondary" appearance="light">
                      {instalacion.empresa}
                    </Badge>
                  </div>
                  {conAcceso ? (
                    <p className="text-xs text-muted-foreground">
                      {instalacion.descripcion}
                    </p>
                  ) : (
                    <p className="text-xs text-red-500">
                      Sin acceso asignado. Contacte al administrador.
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })
          )}
        </div>

        {/* Información adicional */}
        <div className="mt-6 p-4 bg-muted/50 rounded-lg border text-center">
          <p className="text-sm text-muted-foreground">
            <strong>Usuario ID:</strong> 1 • {instalacionActiva 
              ? 'Puede cambiar de instalación en cualquier momento desde el encabezado.' 
              : 'Seleccione una instalación para comenzar a trabajar.'}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Las instalaciones se obtienen desde el backend según permisos.
          </p>
        </div>
      </div>
    </div>
  );
}
