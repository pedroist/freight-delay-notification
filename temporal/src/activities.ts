import { TrafficInfo, NotificationData } from '@app/types';
import { getTrafficInfo } from '@app/lib/traffic/google-maps';
import { generateDelayMessage } from '@app/lib/ai/openai';
import { sendDelayNotification } from '@app/lib/notification/email';

export async function checkTraffic(origin: string, destination: string): Promise<TrafficInfo> {
  console.log(`Checking traffic from ${origin} to ${destination}`);
  return await getTrafficInfo(origin, destination);
}

export async function generateMessage(
  customerName: string,
  origin: string,
  destination: string,
  trafficInfo: TrafficInfo
): Promise<string> {
  console.log(`Generating delay message for ${customerName}`);
  return await generateDelayMessage(customerName, origin, destination, trafficInfo);
}

export async function sendNotification(notificationData: NotificationData): Promise<boolean> {
  console.log(`Sending notification to ${notificationData.customerEmail}`);
  return await sendDelayNotification(notificationData);
} 