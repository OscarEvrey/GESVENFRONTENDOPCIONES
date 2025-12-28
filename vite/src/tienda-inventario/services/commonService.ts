import { apiClient } from './core/apiClient';
import type { 
  InstalacionApiDto, 
  DashboardResumenApiDto 
} from '../types/api/commonTypes';

export const commonService = {
  obtenerInstalaciones: () => {
    return apiClient.get<InstalacionApiDto[]>('/api/instalaciones');
  },

  obtenerDashboardResumen: (instalacionId?: number) => {
    const params = instalacionId ? { instalacionId } : undefined;
    return apiClient.get<DashboardResumenApiDto>('/api/dashboard/resumen', params);
  }
};