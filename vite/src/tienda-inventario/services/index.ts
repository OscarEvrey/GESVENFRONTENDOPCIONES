// Exportamos el cliente base por si se necesita suelto
export * from './core/apiClient';

// Exportamos servicios individuales
export * from './securityService';
export * from './inventoryService';
export * from './salesService';
export * from './purchasingService';
export * from './commonService';

// Importamos para agrupar
import { securityService } from './securityService';
import { inventoryService } from './inventoryService';
import { salesService } from './salesService';
import { purchasingService } from './purchasingService';
import { commonService } from './commonService';

/**
 * API UNIFICADA DE GESVEN
 * * Agrupa todos los micro-servicios en un solo objeto para mantener
 * compatibilidad con el código existente que importa 'gesvenApi'.
 */
const gesvenApi = {
  ...securityService,
  ...inventoryService,
  ...salesService,
  ...purchasingService,
  ...commonService,
};

export default gesvenApi;