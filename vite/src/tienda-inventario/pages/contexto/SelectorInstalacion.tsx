'use client';

import { Building2, MapPin, Package, Warehouse } from 'lucide-react';
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
  const { instalaciones, seleccionarInstalacion } = useContextoInstalacion();
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

  const obtenerColorBorde = (tipo: 'almacen' | 'oficinas') => {
    return tipo === 'almacen'
      ? 'hover:border-green-500'
      : 'hover:border-blue-500';
  };

  return (
    <div className="container-fluid">
      <div className="grid gap-6">
        {/* Encabezado */}
        <div className="text-center py-8">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-primary/10 rounded-full">
              <Package className="size-12 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2">
            Seleccionar Instalación
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Seleccione la instalación con la que desea trabajar. El inventario y
            las operaciones se filtrarán según su selección.
          </p>
        </div>

        {/* Cuadrícula de Instalaciones */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {instalaciones.map((instalacion) => (
            <Card
              key={instalacion.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] ${obtenerColorBorde(instalacion.tipo)}`}
              onClick={() => handleSeleccionar(instalacion)}
            >
              <CardHeader className="text-center pb-2">
                <div className="flex justify-center mb-3">
                  <div className="p-3 bg-muted rounded-full">
                    {obtenerIcono(instalacion.tipo)}
                  </div>
                </div>
                <CardTitle className="text-lg">{instalacion.nombre}</CardTitle>
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
                <p className="text-xs text-muted-foreground">
                  {instalacion.descripcion}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Información adicional */}
        <div className="mt-6 p-4 bg-muted/50 rounded-lg border text-center">
          <p className="text-sm text-muted-foreground">
            <strong>Usuario ID:</strong> 1 • Puede cambiar de instalación en
            cualquier momento desde el encabezado de la aplicación.
          </p>
        </div>
      </div>
    </div>
  );
}
