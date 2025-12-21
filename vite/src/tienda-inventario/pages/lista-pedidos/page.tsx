'use client';

import { useRef, useState } from 'react';
import { addDays, format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ChevronDown, PlusIcon, Upload } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { OrderListTable } from '../tables/order-list';
import { OrderDetailsSheet } from '../components/order-details-sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';


export function OrderList() {
  // Date range picker state
  const today = new Date();
  const rangoFechasPorDefecto: DateRange = {
    from: addDays(today, -30),
    to: today,
  };
  const [rangoFechas, setRangoFechas] = useState<DateRange | undefined>(
    rangoFechasPorDefecto,
  );
  const [rangoFechasTemporal, setRangoFechasTemporal] = useState<DateRange | undefined>(
    rangoFechasPorDefecto,
  );
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const isApplyingRef = useRef(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Date range picker handlers
  const aplicarRangoFechas = () => {
    isApplyingRef.current = true;
    if (rangoFechasTemporal) {
      setRangoFechas(rangoFechasTemporal);
    }
    setIsDatePickerOpen(false);
    setTimeout(() => {
      isApplyingRef.current = false;
    }, 100);
  };

  const restablecerRangoFechas = () => {
    isApplyingRef.current = true;
    setRangoFechasTemporal(rangoFechasPorDefecto);
    setRangoFechas(rangoFechasPorDefecto);
    setIsDatePickerOpen(false);
    setTimeout(() => {
      isApplyingRef.current = false;
    }, 100);
  };

  const cancelarRangoFechas = () => {
    isApplyingRef.current = true;
    setRangoFechasTemporal(rangoFechas);
    setIsDatePickerOpen(false);
    setTimeout(() => {
      isApplyingRef.current = false;
    }, 100);
  };

  const seleccionarRangoFechas = (selected: DateRange | undefined) => {
    setRangoFechasTemporal({
      from: selected?.from || undefined,
      to: selected?.to || undefined,
    });
  };
  
  return (
    <div className="container-fluid space-y-5 lg:space-y-9">
      <div className="flex items-center flex-wrap gap-2 justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-bold text-foreground">Lista de pedidos</h1>
          <span className="text-sm text-muted-foreground">
            435 pedidos encontrados. 62 pedidos requieren atención.
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Date Range Filter */}
          <Popover
            open={isDatePickerOpen}
            onOpenChange={(open) => {
              if (open) {
                setRangoFechasTemporal(rangoFechas);
                setIsDatePickerOpen(open);
              } else if (!isApplyingRef.current) {
                setRangoFechasTemporal(rangoFechas);
                setIsDatePickerOpen(open);
              }
            }}
          >
            <PopoverTrigger asChild>
              <Button type="button" variant="outline">
                {rangoFechas?.from ? (
                  rangoFechas.to ? (
                    <>
                      {format(rangoFechas.from, 'd MMM', { locale: es })} -{' '}
                      {format(rangoFechas.to, 'd MMM, yyyy', { locale: es })}
                    </>
                  ) : (
                    format(rangoFechas.from, 'd MMM, yyyy', { locale: es })
                  )
                ) : (
                  <span>2 jun - 9 jun</span>
                )}
                <ChevronDown className="size-4 ml-1" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                autoFocus
                mode="range"
                defaultMonth={rangoFechasTemporal?.from || rangoFechas?.from}
                showOutsideDays={false}
                selected={rangoFechasTemporal}
                onSelect={seleccionarRangoFechas}
                numberOfMonths={2}
              />
              <div className="flex items-center justify-between border-t border-border p-3">
                <Button variant="outline" onClick={restablecerRangoFechas}>
                  Restablecer
                </Button>
                <div className="flex items-center gap-1.5">
                  <Button variant="outline" onClick={cancelarRangoFechas}>
                    Cancelar
                  </Button>
                  <Button onClick={aplicarRangoFechas}>Aplicar</Button>
                </div>
              </div>
            </PopoverContent>
          </Popover> 
          
          <Button variant="outline" className="gap-2 shrink-0">
            <Upload className="h-4 w-4" />
            Exportar
          </Button>

          {/* Select */}
          <Select defaultValue="more-actions" indicatorPosition="right">
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Más acciones" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="more-actions">Más acciones</SelectItem>
              <SelectItem value="order-tracking">Seguimiento de pedido</SelectItem>
              <SelectItem value="view-shipping-label">Ver etiqueta de envío</SelectItem>
              <SelectItem value="delete">Eliminar</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="mono">
            <PlusIcon />
            Nuevo pedido
          </Button>
        </div>
      </div>
      
      <OrderListTable />

      <OrderDetailsSheet
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
      />
    </div>
  );
}
