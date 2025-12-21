'use client';

import { Link, useLocation } from 'react-router';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const StockNavbar = () => {
  const location = useLocation();
  const pathname = location.pathname;

  // Determine the current active tab based on pathname
  const getCurrentTab = () => {
    if (pathname.includes('/todo-el-stock')) return 'todo-el-stock';
    if (pathname.includes('/stock-actual')) return 'stock-actual';
    if (pathname.includes('/stock-entrante')) return 'stock-entrante';
    if (pathname.includes('/stock-saliente')) return 'stock-saliente';

    return 'todo-el-stock'; // default fallback
  };

  return (
    <div className="container-fluid border-b border-border mb-10">
      <Tabs value={getCurrentTab()} className="text-sm text-muted-foreground">
        <TabsList variant="line" className="border-0 gap-2.5">
          <TabsTrigger value="todo-el-stock" asChild className="px-2.5 py-5">
            <Link to="/tienda-inventario/todo-el-stock">Todo el Stock</Link>
          </TabsTrigger>
          <TabsTrigger value="stock-actual" asChild className="px-2.5 py-5">
            <Link to="/tienda-inventario/stock-actual">Stock Actual</Link>
          </TabsTrigger>
          <TabsTrigger value="stock-entrante" asChild className="px-2.5 py-5">
            <Link to="/tienda-inventario/stock-entrante">Stock Entrante</Link>
          </TabsTrigger>
          <TabsTrigger value="stock-saliente" asChild className="px-2.5 py-5">
            <Link to="/tienda-inventario/stock-saliente">Stock Saliente</Link>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};
