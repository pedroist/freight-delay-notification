import { fetchApi } from './client';
import { RouteData, MonitoringResult } from '@/types';

// Route monitoring endpoint
export async function monitorRoute(routeData: RouteData): Promise<MonitoringResult> {
  return fetchApi<RouteData, MonitoringResult>('/api/monitor-route', 'POST', routeData);
}