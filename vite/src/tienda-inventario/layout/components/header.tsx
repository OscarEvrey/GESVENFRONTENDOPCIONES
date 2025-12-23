import { useEffect, useState } from 'react';
import { Bell, Building2, LayoutGrid, Menu, MessageCircleMore, RefreshCw, Warehouse } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toAbsoluteUrl } from '@/lib/helpers';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { useScrollPosition } from '@/hooks/use-scroll-position';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useContextoInstalacion } from '../../context/ContextoInstalacion';
import { AppsDropdownMenu } from './apps-dropdown-menu';
import { Breadcrumb } from './breadcrumb';
import { ChatSheet } from './chat-sheet';
import { NotificationsSheet } from './notifications-sheet';
import { SearchBar } from './search-bar';
import { SidebarMenu } from './sidebar-menu';
import { UserDropdownMenu } from './user-dropdown-menu';

export function Header() {
  const [isSidebarSheetOpen, setIsSidebarSheetOpen] = useState(false);
  const { instalacionActiva, limpiarInstalacion } = useContextoInstalacion();
  const navigate = useNavigate();

  const { pathname } = useLocation();
  const mobileMode = useIsMobile();

  const scrollPosition = useScrollPosition();
  const headerSticky: boolean = scrollPosition > 0;

  // Close sheet when route changes
  useEffect(() => {
    setIsSidebarSheetOpen(false);
  }, [pathname]);

  const handleCambiarInstalacion = () => {
    limpiarInstalacion();
    navigate('/selector-instalacion');
  };

  return (
    <header
      className={cn(
        'header fixed top-0 z-10 start-0 flex items-stretch shrink-0 border-b border-transparent bg-background end-0 pe-[var(--removed-body-scroll-bar-size,0px)]',
        headerSticky && 'border-b border-border',
      )}
    >
      <div className="container-fluid flex justify-between items-stretch lg:gap-4">
        {/* HeaderLogo */}
        <div className="flex lg:hidden items-center gap-2.5">
          <Link to="/tienda-inventario" className="shrink-0">
            <img
              src={toAbsoluteUrl('/media/app/mini-logo.svg')}
              className="h-[25px] w-full"
              alt="mini-logo"
            />
          </Link>
          <div className="flex items-center">
            {mobileMode && (
              <Sheet
                open={isSidebarSheetOpen}
                onOpenChange={setIsSidebarSheetOpen}
              >
                <SheetTrigger asChild>
                  <Button variant="ghost" mode="icon">
                    <Menu className="text-muted-foreground/70" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  className="p-0 gap-0 w-[275px]"
                  side="left"
                  close={false}
                >
                  <SheetHeader className="p-0 space-y-0" />
                  <SheetBody className="p-0 overflow-y-auto">
                    <SidebarMenu />
                  </SheetBody>
                </SheetContent>
              </Sheet>
            )}
          </div>
        </div>

        {/* Mega Menu */}
        {!mobileMode && <Breadcrumb />}

        {/* Instalación Activa + HeaderTopbar */}
        <div className="flex items-center gap-3">
          {/* Indicador de Instalación Activa */}
          {instalacionActiva && (
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-muted/50 rounded-lg border">
              {instalacionActiva.tipo === 'almacen' ? (
                <Warehouse className="size-4 text-green-600" />
              ) : (
                <Building2 className="size-4 text-blue-600" />
              )}
              <span className="text-sm font-medium">
                {instalacionActiva.nombre}
              </span>
              <Badge
                variant={instalacionActiva.tipo === 'almacen' ? 'success' : 'primary'}
                appearance="light"
                size="sm"
              >
                {instalacionActiva.empresa}
              </Badge>
              <Button
                variant="ghost"
                mode="icon"
                size="sm"
                className="size-6 hover:bg-primary/10"
                onClick={handleCambiarInstalacion}
                title="Cambiar instalación"
              >
                <RefreshCw className="size-3.5" />
              </Button>
            </div>
          )}
          
          <SearchBar />
          <NotificationsSheet
            trigger={
              <Button
                variant="ghost"
                mode="icon"
                shape="circle"
                className="size-9 hover:bg-primary/10 hover:[&_svg]:text-primary"
              >
                <Bell className="size-4.5!" />
              </Button>
            }
          />
          <ChatSheet
            trigger={
              <Button
                variant="ghost"
                mode="icon"
                shape="circle"
                className="size-9 hover:bg-primary/10 hover:[&_svg]:text-primary"
              >
                <MessageCircleMore className="size-4.5!" />
              </Button>
            }
          />
          <AppsDropdownMenu
            trigger={
              <Button
                variant="ghost"
                mode="icon"
                shape="circle"
                className="size-9 hover:bg-primary/10 hover:[&_svg]:text-primary"
              >
                <LayoutGrid className="size-4.5!" />
              </Button>
            }
          />
          <UserDropdownMenu />
        </div>
      </div>
    </header>
  );
}
