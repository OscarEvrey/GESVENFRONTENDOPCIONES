'use client';

import { JSX, useCallback, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { icons, Loader2, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

// Contexto del Menú Dinámico
import { useContextoMenu } from '@/tienda-inventario/context/ContextoMenu';

// Tipos del API de seguridad
import type { ModuloApiDto } from '@/tienda-inventario/types/api/securityTypes';

// Componentes UI
import {
  AccordionMenu,
  AccordionMenuClassNames,
  AccordionMenuGroup,
  AccordionMenuItem,
  AccordionMenuLabel,
  AccordionMenuSeparator,
  AccordionMenuSub,
  AccordionMenuSubContent,
  AccordionMenuSubTrigger,
} from '@/components/ui/accordion-menu';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

// ============ UTILIDADES ============

/**
 * Obtiene el componente de icono de Lucide por nombre
 */
function getIconComponent(iconName: string | null): LucideIcon | null {
  if (!iconName) return null;
  const IconComponent = icons[iconName as keyof typeof icons];
  return IconComponent || null;
}

/**
 * Construye la ruta completa para un módulo
 */
function buildPath(ruta: string | null): string {
  if (!ruta) return '#';
  return ruta.startsWith('/') ? ruta : `/${ruta}`;
}

function buildPathByValue(menu: ModuloApiDto[]): Map<string, string> {
  const map = new Map<string, string>();

  const walk = (nodes: ModuloApiDto[]) => {
    for (const node of nodes) {
      map.set(String(node.moduloId), buildPath(node.ruta));
      if (node.hijos && node.hijos.length > 0) {
        walk(node.hijos);
      }
    }
  };

  walk(menu);
  return map;
}

// ============ ESTILOS ============

const sidebarMenuClassNames: AccordionMenuClassNames = {
  root: 'space-y-1',
  group: 'space-y-1 mb-5',
  label: 'uppercase text-muted-foreground font-medium text-2sm px-2.5 py-2',
  separator: '-mx-2 mb-2.5',
  item: 'menu-item',
  sub: 'menu-accordion',
  subTrigger:
    'menu-link grow cursor-pointer border-0 bg-transparent flex items-center justify-between gap-2 py-2.5 px-2.5 rounded-md text-foreground hover:bg-muted/50',
  subContent: 'menu-accordion-content ps-2.5',
  indicator: 'menu-arrow w-4 h-4 transition-transform duration-200',
};

// ============ COMPONENTE PRINCIPAL ============

export function SidebarMenu(): JSX.Element {
  const { menu, cargandoMenu } = useContextoMenu();
  const location = useLocation();
  const navigate = useNavigate();

  const pathByValue = useMemo(() => buildPathByValue(menu ?? []), [menu]);

  /**
   * Verifica si una ruta coincide con la ubicación actual
   */
  const matchPath = useCallback(
    (valueOrHref: string): boolean => {
      if (!valueOrHref || valueOrHref === '#') return false;

      // El template a veces llama matchPath con el "value" del item (ej: "23"),
      // así que resolvemos value -> ruta usando el mapa.
      const resolvedPath = valueOrHref.startsWith('/')
        ? valueOrHref
        : pathByValue.get(valueOrHref);

      if (!resolvedPath || resolvedPath === '#') return false;
      return (
        location.pathname === resolvedPath ||
        location.pathname.startsWith(resolvedPath + '/')
      );
    },
    [location.pathname, pathByValue]
  );

  const onMenuItemClick = useCallback(
    (value: string) => {
      const path = pathByValue.get(value);
      if (!path || path === '#') return;
      navigate(path);
    },
    [navigate, pathByValue]
  );

  /**
   * Renderiza un item de menú individual (sin hijos)
   */
  const renderMenuItem = useCallback(
    (modulo: ModuloApiDto): JSX.Element => {
      const Icon = getIconComponent(modulo.icono);
      const path = buildPath(modulo.ruta);
      const value = String(modulo.moduloId);
      const isActive = matchPath(value);

      return (
        <AccordionMenuItem key={modulo.moduloId} value={value} asChild>
          {path === '#' ? (
            <div
              className={cn(
                'menu-link flex items-center gap-2.5 py-2.5 px-2.5 rounded-md text-muted-foreground cursor-not-allowed',
                isActive && 'bg-muted text-primary font-medium'
              )}
            >
              {Icon && <Icon className="h-4 w-4 shrink-0" />}
              <span className="menu-title text-sm grow">{modulo.nombre}</span>
            </div>
          ) : (
            <Link
              to={path}
              className={cn(
                'menu-link flex items-center gap-2.5 py-2.5 px-2.5 rounded-md text-foreground hover:bg-muted/50 transition-colors',
                isActive && 'bg-muted text-primary font-medium'
              )}
            >
              {Icon && <Icon className="h-4 w-4 shrink-0" />}
              <span className="menu-title text-sm grow">{modulo.nombre}</span>
              {modulo.estadoDesarrollo === 'EnDesarrollo' && (
                <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">
                  Dev
                </span>
              )}
            </Link>
          )}
        </AccordionMenuItem>
      );
    },
    [matchPath]
  );

  /**
   * Renderiza un submenú (módulo con hijos)
   */
  const renderSubMenu = useCallback(
    (modulo: ModuloApiDto): JSX.Element => {
      const Icon = getIconComponent(modulo.icono);
      const hijos = modulo.hijos || [];

      return (
        <AccordionMenuSub
          key={modulo.moduloId}
          value={String(modulo.moduloId)}
        >
          <AccordionMenuSubTrigger>
            {Icon && <Icon className="h-4 w-4 shrink-0" />}
            <span className="menu-title text-sm grow">{modulo.nombre}</span>
          </AccordionMenuSubTrigger>
          <AccordionMenuSubContent type="multiple" parentValue={String(modulo.moduloId)}>
            {hijos.map((hijo) =>
              hijo.hijos && hijo.hijos.length > 0
                ? renderSubMenu(hijo)
                : renderMenuItem(hijo)
            )}
          </AccordionMenuSubContent>
        </AccordionMenuSub>
      );
    },
    [renderMenuItem]
  );

  const menuAgrupado = useMemo(() => menu, [menu]);

  if (cargandoMenu) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        <span className="ml-2 text-sm text-muted-foreground">Cargando menú...</span>
      </div>
    );
  }

  if (!menu || menu.length === 0) {
    return (
      <div className="px-4 py-8 text-center text-sm text-muted-foreground">
        No hay módulos disponibles para tu rol.
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-200px)]">
      <AccordionMenu
        type="multiple"
        classNames={sidebarMenuClassNames}
        matchPath={matchPath}
        onItemClick={(value) => onMenuItemClick(value)}
      >
        <AccordionMenuGroup>
          <AccordionMenuLabel>Menú Principal</AccordionMenuLabel>
          <AccordionMenuSeparator />
          {menuAgrupado.map((modulo) =>
            modulo.hijos && modulo.hijos.length > 0
              ? renderSubMenu(modulo)
              : renderMenuItem(modulo)
          )}
        </AccordionMenuGroup>
      </AccordionMenu>
      <ScrollBar />
    </ScrollArea>
  );
}

export default SidebarMenu;
