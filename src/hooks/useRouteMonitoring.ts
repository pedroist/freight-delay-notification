import { useMutation } from '@tanstack/react-query';
import { RouteData, MonitoringResult } from '@/types';
import { monitorRoute } from '@/api/endpoints';

export function useRouteMonitoring() {
  return useMutation({
    mutationFn: (routeData: RouteData) => monitorRoute(routeData),
    onError: (error) => {
      console.error('Error monitoring route:', error);
    },
  });
} 