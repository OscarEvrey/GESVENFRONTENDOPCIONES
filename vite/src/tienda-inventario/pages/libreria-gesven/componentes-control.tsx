'use client';

import { useState } from 'react';
import {
  AlertCircle,
  Check,
  Download,
  Eye,
  EyeOff,
  Info,
  Loader2,
  Lock,
  Mail,
  Printer,
  RefreshCw,
  Save,
  Send,
  Settings,
  Trash2,
  Upload,
  User,
  X,
} from 'lucide-react';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
} from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardHeading,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

// ============ CONTROL #1: BOTONES Y VARIANTES ============
function ControlBotones() {
  const [cargando, setCargando] = useState<Record<string, boolean>>({});

  const simularCarga = (id: string) => {
    setCargando((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setCargando((prev) => ({ ...prev, [id]: false }));
    }, 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardHeading>
          <CardTitle>Control #1 - Botones y Variantes</CardTitle>
          <CardDescription>
            Diferentes estilos y estados de botones disponibles en el sistema
          </CardDescription>
        </CardHeading>
        <Badge variant="secondary">Botones</Badge>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Variantes Principales */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-muted-foreground">
            Variantes Principales
          </h4>
          <div className="flex flex-wrap gap-3">
            <Button variant="primary">Primario</Button>
            <Button variant="secondary">Secundario</Button>
            <Button variant="outline">Contorno</Button>
            <Button variant="ghost">Fantasma</Button>
            <Button variant="destructive">Destructivo</Button>
            <Button variant="mono">Mono</Button>
          </div>
        </div>

        {/* Con Íconos */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-muted-foreground">
            Botones con Íconos
          </h4>
          <div className="flex flex-wrap gap-3">
            <Button variant="primary">
              <Save className="size-4" />
              Guardar
            </Button>
            <Button variant="outline">
              <Printer className="size-4" />
              Imprimir
            </Button>
            <Button variant="secondary">
              <Download className="size-4" />
              Descargar
            </Button>
            <Button variant="ghost">
              <RefreshCw className="size-4" />
              Actualizar
            </Button>
            <Button variant="destructive">
              <Trash2 className="size-4" />
              Eliminar
            </Button>
          </div>
        </div>

        {/* Tamaños */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-muted-foreground">Tamaños</h4>
          <div className="flex flex-wrap items-center gap-3">
            <Button size="sm">Pequeño</Button>
            <Button size="md">Mediano</Button>
            <Button size="lg">Grande</Button>
            <Button mode="icon" size="sm">
              <Settings className="size-4" />
            </Button>
            <Button mode="icon">
              <Settings className="size-4" />
            </Button>
            <Button mode="icon" size="lg">
              <Settings className="size-4" />
            </Button>
          </div>
        </div>

        {/* Estados */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-muted-foreground">Estados</h4>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="primary"
              onClick={() => simularCarga('btn1')}
              disabled={cargando['btn1']}
            >
              {cargando['btn1'] ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Procesando...
                </>
              ) : (
                <>
                  <Send className="size-4" />
                  Enviar
                </>
              )}
            </Button>
            <Button variant="outline" disabled>
              Deshabilitado
            </Button>
            <Button
              variant="secondary"
              onClick={() => simularCarga('btn2')}
              disabled={cargando['btn2']}
            >
              {cargando['btn2'] ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Cargando...
                </>
              ) : (
                <>
                  <Upload className="size-4" />
                  Subir
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Grupo de Acciones */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-muted-foreground">
            Grupo de Acciones Típico
          </h4>
          <div className="flex justify-end gap-3 p-4 bg-muted/50 rounded-lg border">
            <Button variant="outline">Cancelar</Button>
            <Button variant="secondary">Guardar Borrador</Button>
            <Button variant="primary">
              <Check className="size-4" />
              Confirmar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============ CONTROL #2: SWITCHES Y CHECKBOXES ============
function ControlSwitchesCheckboxes() {
  const [notificaciones, setNotificaciones] = useState({
    email: true,
    push: false,
    sms: false,
  });
  const [permisos, setPermisos] = useState<string[]>(['ver', 'crear']);
  const [metodoEnvio, setMetodoEnvio] = useState('local');

  const togglePermiso = (permiso: string) => {
    setPermisos((prev) =>
      prev.includes(permiso)
        ? prev.filter((p) => p !== permiso)
        : [...prev, permiso],
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardHeading>
          <CardTitle>Control #2 - Switches, Checkboxes y Radios</CardTitle>
          <CardDescription>
            Controles de selección y alternancia para configuraciones
          </CardDescription>
        </CardHeading>
        <Badge variant="secondary">Selección</Badge>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Switches */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-muted-foreground">
            Interruptores (Switches)
          </h4>
          <div className="space-y-4 p-4 bg-muted/50 rounded-lg border">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="flex items-center gap-2">
                  <Mail className="size-4 text-muted-foreground" />
                  Notificaciones por Email
                </Label>
                <p className="text-xs text-muted-foreground">
                  Recibir alertas de stock bajo por correo
                </p>
              </div>
              <Switch
                checked={notificaciones.email}
                onCheckedChange={(checked) =>
                  setNotificaciones((prev) => ({ ...prev, email: checked }))
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="flex items-center gap-2">
                  <AlertCircle className="size-4 text-muted-foreground" />
                  Notificaciones Push
                </Label>
                <p className="text-xs text-muted-foreground">
                  Alertas en tiempo real en el navegador
                </p>
              </div>
              <Switch
                checked={notificaciones.push}
                onCheckedChange={(checked) =>
                  setNotificaciones((prev) => ({ ...prev, push: checked }))
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="flex items-center gap-2">
                  <Send className="size-4 text-muted-foreground" />
                  Notificaciones SMS
                </Label>
                <p className="text-xs text-muted-foreground">
                  Mensajes de texto para alertas críticas
                </p>
              </div>
              <Switch
                checked={notificaciones.sms}
                onCheckedChange={(checked) =>
                  setNotificaciones((prev) => ({ ...prev, sms: checked }))
                }
              />
            </div>
          </div>
        </div>

        {/* Checkboxes */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-muted-foreground">
            Casillas de Verificación (Checkboxes)
          </h4>
          <div className="p-4 bg-muted/50 rounded-lg border">
            <p className="text-sm mb-3">Permisos del Usuario:</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { id: 'ver', label: 'Ver registros' },
                { id: 'crear', label: 'Crear nuevos' },
                { id: 'editar', label: 'Editar existentes' },
                { id: 'eliminar', label: 'Eliminar registros' },
              ].map((permiso) => (
                <div key={permiso.id} className="flex items-center gap-2">
                  <Checkbox
                    id={permiso.id}
                    checked={permisos.includes(permiso.id)}
                    onCheckedChange={() => togglePermiso(permiso.id)}
                  />
                  <Label htmlFor={permiso.id} className="text-sm font-normal">
                    {permiso.label}
                  </Label>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Permisos seleccionados: {permisos.join(', ') || 'Ninguno'}
            </p>
          </div>
        </div>

        {/* Radio Groups */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-muted-foreground">
            Grupos de Radio
          </h4>
          <div className="p-4 bg-muted/50 rounded-lg border">
            <p className="text-sm mb-3">Método de Envío:</p>
            <RadioGroup value={metodoEnvio} onValueChange={setMetodoEnvio}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2 p-3 border rounded-lg">
                  <RadioGroupItem value="local" id="local" />
                  <Label htmlFor="local" className="flex-1 cursor-pointer">
                    <span className="font-medium">Entrega Local</span>
                    <p className="text-xs text-muted-foreground">
                      1-2 días hábiles
                    </p>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-lg">
                  <RadioGroupItem value="express" id="express" />
                  <Label htmlFor="express" className="flex-1 cursor-pointer">
                    <span className="font-medium">Envío Express</span>
                    <p className="text-xs text-muted-foreground">
                      Mismo día (+$150)
                    </p>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-lg">
                  <RadioGroupItem value="recoger" id="recoger" />
                  <Label htmlFor="recoger" className="flex-1 cursor-pointer">
                    <span className="font-medium">Recoger en Tienda</span>
                    <p className="text-xs text-muted-foreground">Sin costo</p>
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============ CONTROL #3: ALERTAS Y NOTIFICACIONES ============
function ControlAlertas() {
  return (
    <Card>
      <CardHeader>
        <CardHeading>
          <CardTitle>Control #3 - Alertas y Notificaciones</CardTitle>
          <CardDescription>
            Diferentes tipos de mensajes de retroalimentación al usuario
          </CardDescription>
        </CardHeading>
        <Badge variant="secondary">Alertas</Badge>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Alertas */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-muted-foreground">
            Alertas del Sistema
          </h4>
          <div className="space-y-3">
            <Alert variant="default" icon="info">
              <AlertIcon>
                <Info />
              </AlertIcon>
              <AlertTitle>Información</AlertTitle>
              <AlertDescription>
                El inventario será actualizado automáticamente cada 15 minutos.
              </AlertDescription>
            </Alert>

            <Alert variant="success" icon="success">
              <AlertIcon>
                <Check />
              </AlertIcon>
              <AlertTitle>Operación Exitosa</AlertTitle>
              <AlertDescription>
                La orden de compra OC-2024-0125 ha sido procesada correctamente.
              </AlertDescription>
            </Alert>

            <Alert variant="warning" icon="warning">
              <AlertIcon>
                <AlertCircle />
              </AlertIcon>
              <AlertTitle>Atención Requerida</AlertTitle>
              <AlertDescription>
                5 productos están por debajo del stock mínimo. Revise el
                planificador de compras.
              </AlertDescription>
            </Alert>

            <Alert variant="destructive" icon="destructive">
              <AlertIcon>
                <X />
              </AlertIcon>
              <AlertTitle>Error en la Operación</AlertTitle>
              <AlertDescription>
                No se pudo conectar con el servidor de facturación. Intente
                nuevamente.
              </AlertDescription>
            </Alert>
          </div>
        </div>

        {/* Badges */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-muted-foreground">
            Badges de Estado
          </h4>
          <div className="flex flex-wrap gap-3">
            <Badge variant="default">Por Defecto</Badge>
            <Badge variant="primary">Primario</Badge>
            <Badge variant="secondary">Secundario</Badge>
            <Badge variant="success">Éxito</Badge>
            <Badge variant="warning">Advertencia</Badge>
            <Badge variant="destructive">Error</Badge>
            <Badge variant="outline">Contorno</Badge>
          </div>
          <div className="flex flex-wrap gap-3">
            <Badge variant="success" appearance="light">
              Activo
            </Badge>
            <Badge variant="warning" appearance="light">
              Pendiente
            </Badge>
            <Badge variant="destructive" appearance="light">
              Cancelado
            </Badge>
            <Badge variant="primary" appearance="light">
              En Proceso
            </Badge>
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-muted-foreground">
            Indicadores de Progreso
          </h4>
          <div className="space-y-4 p-4 bg-muted/50 rounded-lg border">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Carga de inventario</span>
                <span className="font-medium">75%</span>
              </div>
              <Progress value={75} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Sincronización de pedidos</span>
                <span className="font-medium">45%</span>
              </div>
              <Progress value={45} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Exportación completada</span>
                <span className="font-medium">100%</span>
              </div>
              <Progress value={100} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============ CONTROL #4: MODALES Y DIÁLOGOS ============
function ControlModales() {
  const [dialogoConfirmacion, setDialogoConfirmacion] = useState(false);
  const [dialogoFormulario, setDialogoFormulario] = useState(false);
  const [mostrarPassword, setMostrarPassword] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardHeading>
          <CardTitle>Control #4 - Modales y Diálogos</CardTitle>
          <CardDescription>
            Ventanas emergentes para confirmaciones y formularios
          </CardDescription>
        </CardHeading>
        <Badge variant="secondary">Modales</Badge>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-muted-foreground">
            Tipos de Diálogos
          </h4>
          <div className="flex flex-wrap gap-3">
            {/* Diálogo de Confirmación */}
            <Dialog
              open={dialogoConfirmacion}
              onOpenChange={setDialogoConfirmacion}
            >
              <DialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="size-4" />
                  Eliminar Producto
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>¿Confirmar eliminación?</DialogTitle>
                  <DialogDescription>
                    Esta acción no se puede deshacer. El producto será eliminado
                    permanentemente del catálogo y de todos los registros
                    asociados.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setDialogoConfirmacion(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      setDialogoConfirmacion(false);
                      alert('Producto eliminado');
                    }}
                  >
                    Sí, Eliminar
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Diálogo con Formulario */}
            <Dialog
              open={dialogoFormulario}
              onOpenChange={setDialogoFormulario}
            >
              <DialogTrigger asChild>
                <Button variant="primary">
                  <User className="size-4" />
                  Nuevo Usuario
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Crear Nuevo Usuario</DialogTitle>
                  <DialogDescription>
                    Complete los datos para registrar un nuevo usuario en el
                    sistema.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre Completo</Label>
                    <Input id="nombre" placeholder="Ingrese nombre" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Correo Electrónico</Label>
                    <Input id="email" type="email" placeholder="usuario@empresa.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Contraseña</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={mostrarPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        mode="icon"
                        size="sm"
                        className="absolute right-1 top-1/2 -translate-y-1/2"
                        onClick={() => setMostrarPassword(!mostrarPassword)}
                      >
                        {mostrarPassword ? (
                          <EyeOff className="size-4" />
                        ) : (
                          <Eye className="size-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setDialogoFormulario(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => {
                      setDialogoFormulario(false);
                      alert('Usuario creado');
                    }}
                  >
                    Crear Usuario
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Tooltips */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-muted-foreground">
            Tooltips Informativos
          </h4>
          <div className="flex flex-wrap gap-3">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline">
                    <Info className="size-4" />
                    Información
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Este botón muestra información adicional</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline">
                    <Lock className="size-4" />
                    Bloqueado
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>No tiene permisos para esta acción</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" mode="icon">
                    <Settings className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Configuración del sistema</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============ CONTROL #5: TABS Y NAVEGACIÓN ============
function ControlTabs() {
  return (
    <Card>
      <CardHeader>
        <CardHeading>
          <CardTitle>Control #5 - Tabs y Navegación</CardTitle>
          <CardDescription>
            Componentes para organizar contenido en pestañas
          </CardDescription>
        </CardHeading>
        <Badge variant="secondary">Navegación</Badge>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Tabs Estándar */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-muted-foreground">
            Pestañas Estándar
          </h4>
          <Tabs defaultValue="general" className="w-full">
            <TabsList>
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="inventario">Inventario</TabsTrigger>
              <TabsTrigger value="precios">Precios</TabsTrigger>
              <TabsTrigger value="imagenes">Imágenes</TabsTrigger>
            </TabsList>
            <TabsContent value="general" className="p-4 border rounded-lg mt-2">
              <h5 className="font-semibold mb-2">Información General</h5>
              <p className="text-sm text-muted-foreground">
                Aquí se muestra la información básica del producto como nombre,
                descripción, categoría y proveedor.
              </p>
            </TabsContent>
            <TabsContent value="inventario" className="p-4 border rounded-lg mt-2">
              <h5 className="font-semibold mb-2">Control de Inventario</h5>
              <p className="text-sm text-muted-foreground">
                Gestione el stock actual, stock mínimo, ubicaciones de almacén y
                movimientos de inventario.
              </p>
            </TabsContent>
            <TabsContent value="precios" className="p-4 border rounded-lg mt-2">
              <h5 className="font-semibold mb-2">Configuración de Precios</h5>
              <p className="text-sm text-muted-foreground">
                Defina precios de compra, venta, márgenes y descuentos
                aplicables.
              </p>
            </TabsContent>
            <TabsContent value="imagenes" className="p-4 border rounded-lg mt-2">
              <h5 className="font-semibold mb-2">Galería de Imágenes</h5>
              <p className="text-sm text-muted-foreground">
                Suba y administre las fotografías del producto para el catálogo.
              </p>
            </TabsContent>
          </Tabs>
        </div>

        {/* Tabs con Íconos */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-muted-foreground">
            Pestañas con Íconos
          </h4>
          <Tabs defaultValue="config" className="w-full">
            <TabsList>
              <TabsTrigger value="config" className="flex items-center gap-1.5">
                <Settings className="size-4" />
                Configuración
              </TabsTrigger>
              <TabsTrigger value="usuarios" className="flex items-center gap-1.5">
                <User className="size-4" />
                Usuarios
              </TabsTrigger>
              <TabsTrigger value="seguridad" className="flex items-center gap-1.5">
                <Lock className="size-4" />
                Seguridad
              </TabsTrigger>
            </TabsList>
            <TabsContent value="config" className="p-4 border rounded-lg mt-2">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Settings className="size-5 text-primary" />
                </div>
                <div>
                  <h5 className="font-semibold">Configuración General</h5>
                  <p className="text-xs text-muted-foreground">
                    Ajustes del sistema y preferencias
                  </p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Configure los parámetros generales del sistema, moneda, idioma y
                zona horaria.
              </p>
            </TabsContent>
            <TabsContent value="usuarios" className="p-4 border rounded-lg mt-2">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <User className="size-5 text-primary" />
                </div>
                <div>
                  <h5 className="font-semibold">Gestión de Usuarios</h5>
                  <p className="text-xs text-muted-foreground">
                    Administrar cuentas y permisos
                  </p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Cree, edite y elimine usuarios del sistema. Asigne roles y
                permisos específicos.
              </p>
            </TabsContent>
            <TabsContent value="seguridad" className="p-4 border rounded-lg mt-2">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Lock className="size-5 text-primary" />
                </div>
                <div>
                  <h5 className="font-semibold">Seguridad</h5>
                  <p className="text-xs text-muted-foreground">
                    Políticas y auditoría
                  </p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Configure políticas de contraseñas, autenticación de dos factores
                y revise registros de auditoría.
              </p>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
}

// ============ PÁGINA PRINCIPAL ============
export function ComponentesControlPage() {
  return (
    <div className="container-fluid">
      <div className="grid gap-5 lg:gap-7.5">
        {/* Descripción */}
        <Card>
          <CardContent className="py-4">
            <h2 className="text-xl font-semibold mb-2">
              Módulo de Componentes de Control
            </h2>
            <p className="text-muted-foreground">
              Esta sección contiene componentes interactivos esenciales: botones,
              switches, checkboxes, alertas, modales, tooltips y tabs para la
              construcción de interfaces de usuario.
            </p>
          </CardContent>
        </Card>

        {/* Control #1: Botones */}
        <ControlBotones />

        {/* Control #2: Switches y Checkboxes */}
        <ControlSwitchesCheckboxes />

        {/* Control #3: Alertas */}
        <ControlAlertas />

        {/* Control #4: Modales */}
        <ControlModales />

        {/* Control #5: Tabs */}
        <ControlTabs />
      </div>
    </div>
  );
}
