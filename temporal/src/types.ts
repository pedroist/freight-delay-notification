import { TrafficInfo, NotificationData, RouteData } from '@app/types';

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