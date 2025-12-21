'use client';


import { useState } from 'react';
import { Circle, CircleCheck, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
// import type { OrderListData } from '../tables/order-list';
import { Badge, BadgeDot } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Stepper,
  StepperItem,
  StepperNav,
  StepperTitle,
  StepperTrigger,
} from '@/components/ui/stepper';
import { toAbsoluteUrl } from '@/lib/helpers';

interface TrackShippingSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: Record<string, any>; // Generic data type for flexibility
}

export function TrackShippingSheet({
  open,
  onOpenChange,
}: TrackShippingSheetProps) {
  const steps = [
    { title: 'Recolección' },
    { title: 'Empacado' },
    { title: 'Envío' },
    { title: 'Entregado' },
  ];

  const [currentStep] = useState(2);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:w-[720px] sm:max-w-none inset-3.5 border start-auto h-auto rounded-lg p-0 [&_[data-slot=sheet-close]]:top-4.5 [&_[data-slot=sheet-close]]:end-5">
        <SheetHeader className="border-b py-3.5 px-5 border-border">
          <SheetTitle className="font-medium">
            Seguimiento de envío
          </SheetTitle>
        </SheetHeader>
        <SheetBody className="p-0 lg:pt-2">
          <ScrollArea className="h-[calc(100dvh-11.75rem)] px-5 me-1">
            <div className="flex items-center justify-between flex-wrap gap-2 mb-7">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2.5">
                  <h3 className="lg:text-[22px] font-semibold text-foreground">
                    SHP-3827462
                  </h3>
                  <Badge size="sm" variant="success" appearance="light">
                    Enviado
                  </Badge>
                </div>
                <div className="flex items-center flex-wrap gap-1.5 text-2sm">
                  <span className="font-normal text-muted-foreground">
                    Creado
                  </span>
                  <span className="font-medium text-foreground/80">
                    2022-01-01
                  </span>
                  <BadgeDot className="bg-muted-foreground/60 size-1 mx-1" />
                  <span className="font-normal text-muted-foreground">
                    ID de pedido
                  </span>
                  <Link
                    to="#"
                    className="font-medium text-foreground underline"
                  >
                    SO-AMS-4620
                  </Link>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <Button variant="ghost">Cancelar pedido</Button>
                <Button variant="outline">Notificar cliente</Button>
              </div>
            </div>

            {/* Shipping Status */}
            <Card className="rounded-md mb-5">
              <CardContent className="p-0">
                <div className="flex items-start flex-wrap gap-5 justify-between bg-accent/50 p-5">
                  <div className="relative">
                    <div className="flex items-center space-x-2">
                      <BadgeDot className="bg-secondary-foreground size-1.5 shrink-0" />
                      <span className="font-medium text-2sm text-secondary-foreground leading-3">
                        1234 Industrial Way, Dallas, TX 75201
                      </span>
                    </div>

                    <Separator
                      className="min-h-3.5 ml-[2px] top-0 bottom-0 bg-muted-foreground/30 w-0.5 mt-px"
                      orientation="vertical"
                    />

                    <div className="flex items-center space-x-2">
                      <BadgeDot className="bg-secondary-foreground size-1.5 shrink-0" />
                      <span className="font-medium text-2sm text-secondary-foreground leading-3">
                        8458 Sunset Blvd #209, Los Angeles, CA 90069
                      </span>
                    </div>
                  </div>

                  <Button variant="outline" className="shrink-0">
                    <img
                      src={toAbsoluteUrl('/media/brand-logos/ups.svg')}
                      alt="UPS"
                      className="h-4 w-4"
                    />{' '}
                    UPS Global
                  </Button>
                </div>

                <Stepper defaultValue={currentStep} className="w-full p-5 pt-3">
                  <StepperNav className="flex w-full flex-wrap gap-2">
                    {steps.map((step, index) => {
                      const stepNumber = index + 1;
                      const isCompleted = stepNumber < currentStep;
                      const isActive = stepNumber === currentStep;

                      return (
                        <StepperItem
                          key={index}
                          step={stepNumber}
                          className="relative flex-1 flex items-center"
                        >
                          <StepperTrigger className="flex flex-col items-center w-full">
                            <div className="h-1.5 w-full mt-2 rounded-full bg-border relative">
                              {index === steps.length - 2 ? (
                                <div className="h-full w-1/2 bg-green-500 absolute top-0 left-0 rounded-l-full mb-5" />
                              ) : index < steps.length - 2 ? (
                                <div className="h-full w-full bg-green-500 absolute top-0 left-0 rounded-full" />
                              ) : null}
                            </div>

                            {/* Ikonka */}
                            <div className="flex items-center gap-0.5 w-full -ms-1">
                              <div className="flex items-center gap-1">
                                {index === steps.length - 2 ? (
                                  <CircleCheck
                                    className="text-green-500 border-background border-2"
                                    size={18}
                                  />
                                ) : index < steps.length - 2 ? (
                                  <CircleCheck
                                    className="fill-green-500 text-background"
                                    size={18}
                                  />
                                ) : isActive ? (
                                  <CircleCheck
                                    className="fill-green-500 text-background"
                                    size={18}
                                  />
                                ) : (
                                  <Circle
                                    className="text-muted-foreground border-background border-2"
                                    size={18}
                                  />
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <StepperTitle
                                  className={`font-medium ${
                                    isCompleted || isActive
                                      ? 'text-secondary-foreground/80 text-2sm'
                                      : 'text-secondary-foreground text-2sm'
                                  }`}
                                >
                                  {step.title}
                                </StepperTitle>
                              </div>
                            </div>
                          </StepperTrigger>
                        </StepperItem>
                      );
                    })}
                  </StepperNav>
                </Stepper>
              </CardContent>
            </Card>

            {/* Shipping Data */}
            <Card className="rounded-md mb-5">
              <CardHeader className="min-h-[34px] bg-accent/50">
                <CardTitle className="text-2sm">Datos de envío</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-4 gap-5">
                  {[
                    { label: 'Tiempo total', value: '19 días, 7 horas' },
                    { label: 'Hora de salida', value: '01 Ago, 2025 09:17' },
                    { label: 'Llegada estimada', value: '17 Abr, 2025 12:00' },
                    { label: 'Nº de seguimiento', value: '1Z999AA10123456784' },
                  ].map((item) => (
                    <div key={item.label} className="flex flex-col gap-1.5">
                      <span className="text-2sm font-normal text-muted-foreground">
                        {item.label}
                      </span>
                      <span className="text-2sm font-medium text-foreground">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Shipping Log */}
            <Card className="rounded-md">
              <CardHeader className="min-h-[34px] bg-accent/50">
                <CardTitle className="text-2sm">Bitácora de envío</CardTitle>
              </CardHeader>
              <CardContent>
                {[
                  {
                    order: 'Pedido creado',
                    date: '28 jul, 2025 10:02',
                    description: 'Información de envío recibida por el vendedor',
                  },
                  {
                    order: 'Recolección',
                    date: '28 jul, 2025 11:02',
                    description: 'Artículos siendo recolectados del inventario',
                  },
                  {
                    order: 'Empacado',
                    date: '28 jul, 2025 12:27',
                    description: 'Información de envío recibida por el vendedor',
                  },
                  {
                    order: 'Enviado',
                    date: '28 jul, 2025 14:27',
                    description: 'Paquete entregado a la paquetería',
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2 relative mb-3.5"
                  >
                    <div className="flex flex-col items-center gap-2 h-full mt-1">
                      <BadgeDot className="bg-secondary-foreground size-1.5 shrink-0 z-1" />
                      {index < 3 && (
                        <Separator
                          className="h-full absolute w-0.5 bg-muted-foreground/30 rounded-t-full rounded-b-full top-3.5"
                          orientation="vertical"
                        />
                      )}
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2.5">
                        <span className="text-2sm font-medium text-foreground">
                          {item.order}
                        </span>
                        <span className="text-xs text-muted-foreground font-normal">
                          {item.date}
                        </span>
                      </div>

                      <span className="text-xs font-normal text-muted-foreground">
                        {item.description}
                      </span>

                      {index === 0 && (
                        <div className="flex items-center gap-1 mt-1">
                          <MapPin className="size-3.5 text-muted-foreground" />
                          <span className="text-2xs font-normal text-muted-foreground">
                            Silicon Valley, CA
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </ScrollArea>
        </SheetBody>

        <SheetFooter className="flex items-center not-only-of-type:justify-between border-t py-4 px-5 border-border">
          <Button
            className="w-full"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cerrar
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
