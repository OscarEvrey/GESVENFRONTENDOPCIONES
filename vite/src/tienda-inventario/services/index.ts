/**
 * Servicios de API de GESVEN - Arquitectura Modular
 * 
 * Cada servicio maneja un dominio específico del sistema:
 * - securityService: usuarios, roles, accesos, menú dinámico
 * - inventoryService: productos, movimientos, ajustes, transferencias
 * - salesService: ventas, clientes
 * - purchasingService: compras, proveedores, órdenes de compra
 * - commonService: instalaciones, dashboard
 * 
 * Uso:
 *   import { securityService, inventoryService } from '@/tienda-inventario/services';
 *   const menu = await securityService.obtenerMenuUsuario(instalacionId);
 */

// Exportamos el cliente base por si se necesita suelto
export * from './core/apiClient';

// Exportamos servicios individuales (named exports)
export { securityService } from './securityService';
export { inventoryService } from './inventoryService';
export { salesService } from './salesService';
export { purchasingService } from './purchasingService';
export { commonService } from './commonService';
