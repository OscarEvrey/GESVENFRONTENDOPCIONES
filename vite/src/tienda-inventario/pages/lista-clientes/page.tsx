'use client';
import { Plus, Upload, ChevronDown, BarChart3, User, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CustomerListDisplaySheet, CustomerListTable } from '../tables/customer-list';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useState } from 'react';


export function CustomerList() {  
  const [displaySheet, setDisplaySheet] = useState<CustomerListDisplaySheet | undefined>(undefined);
  const [shouldOpenSheet, setShouldOpenSheet] = useState(false);

  // Handle displaySheet change
  const handleDisplaySheetChange = (newDisplaySheet: CustomerListDisplaySheet) => {
    console.log('Setting displaySheet to:', newDisplaySheet);
    setDisplaySheet(newDisplaySheet);
    setShouldOpenSheet(true); // Always set to true when opening
  };

  // Handle sheet close
  const handleSheetClose = () => {
    setShouldOpenSheet(false);
  };

  return (
    <div className="container-fluid space-y-5 lg:space-y-9">
      <div className="flex items-center flex-wrap gap-2 justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-bold text-foreground">Clientes</h1>
          <span className="text-sm text-muted-foreground">
            23,456 clientes encontrados. 83% están activos
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2 shrink-0">
            <Upload className="h-4 w-4" />
            Exportar
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
                Seguimiento de cliente
              </DropdownMenuItem>
              <DropdownMenuItem>
                <User  />
                Ver perfil del cliente
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive">
                <Trash2  />
                Eliminar seleccionados
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="mono" onClick={() => handleDisplaySheetChange("createCustomer")}>
            <Plus/> Nuevo
          </Button>
        </div>
      </div>
      
      <CustomerListTable 
        displaySheet={displaySheet} 
        shouldOpenSheet={shouldOpenSheet}
        onSheetClose={handleSheetClose}
      />
    </div>
  );
}
