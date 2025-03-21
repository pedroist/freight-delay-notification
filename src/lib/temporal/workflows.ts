import { proxyActivities } from '@temporalio/workflow';
import { TrafficInfo, NotificationData, RouteData } from '@/types';

// Activity interfaces
export interface Activities {
  checkTraffic(origin: string, destination: string): Promise<TrafficInfo>;
  generateMessage(
    customerName: string,
    origin: string,
    destination: string,
    trafficInfo: TrafficInfo
  ): Promise<string>;
  sendNotification(notificationData: NotificationData): Promise<boolean>;
}

// Create activities proxy
const { checkTraffic, generateMessage, sendNotification } = proxyActivities<Activities>({
  startToCloseTimeout: '1 minute',
});

// Workflow implementation
export async function MonitorRouteWorkflow(routeData: RouteData): Promise<{
  trafficInfo: TrafficInfo;
  notification?: NotificationData;
}> {
  const trafficInfo = await checkTraffic(routeData.origin, routeData.destination);
  
  const message = await generateMessage(
    routeData.customerName,
    routeData.origin,
    routeData.destination,
    trafficInfo
  );

  const notification: NotificationData = {
    customerName: routeData.customerName,
    customerEmail: routeData.customerEmail,
    origin: routeData.origin,
    destination: routeData.destination,
    message,
    delayInMinutes: trafficInfo.delayInMinutes,
    sent: false  // Initially false, will be updated by the notification service
  };
  
  await sendNotification(notification);

  return { trafficInfo, notification };
} 