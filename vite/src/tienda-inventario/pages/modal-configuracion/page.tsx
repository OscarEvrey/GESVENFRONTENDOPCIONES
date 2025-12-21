'use client';
import { Upload, ChevronDown, BarChart3, User, Trash2, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SettingsSheet } from '../components/settings-sheet';
import { ProductListTable } from '../tables/product-list';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useState } from 'react';


export function SettingsModal() {  
  const [settingsSheetOpen, setSettingsSheetOpen] = useState(true);

  // Debug log
  console.log('SettingsSheet open state:', settingsSheetOpen);

  // Handle settings sheet open
  const handleSettingsSheetOpen = () => {
    setSettingsSheetOpen(true);
  };

  // Handle edit click
  const handleEditClick = () => {
    console.log('Edit clicked');
  };

  return (
    <div className="container-fluid space-y-5 lg:space-y-9">
      <div className="flex items-center flex-wrap gap-2 justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-bold text-foreground">Configuraciones - Ajustes generales</h1>
          <span className="text-sm text-muted-foreground">
            1,234 productos encontrados. 89% están en stock
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2 shrink-0">
            <Upload className="h-4 w-4" />
            Exportar configuraciones
          </Button>

          {/* Dropdown Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-[130px] justify-between">
                Más acciones
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <BarChart3  />
                Analítica de producto
              </DropdownMenuItem>
              <DropdownMenuItem>
                <User  />
                Ver detalles del producto
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive">
                <Trash2  />
                Eliminar seleccionados
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="mono" onClick={handleSettingsSheetOpen}>
            <Settings/>
            Abrir configuraciones
          </Button>
        </div>
      </div>
    
      {/* Product List Table */}
      <ProductListTable />

      {/* Settings Sheet */}
      {settingsSheetOpen && (
        <SettingsSheet
          open={settingsSheetOpen}
          onOpenChange={setSettingsSheetOpen}
          onEditClick={handleEditClick}
        />
      )}
    </div>
  );
}
