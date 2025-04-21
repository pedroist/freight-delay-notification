import { proxyActivities } from '@temporalio/workflow';
import { Activities } from './types';
import { RouteData, NotificationData, MonitoringResult } from '@app/types';

// Create activities proxy
const activities = proxyActivities<Activities>({
  startToCloseTimeout: '10 seconds',
  retry: {
    maximumAttempts: 3,
  },
});

export async function monitorRouteWorkflow(routeData: RouteData): Promise<MonitoringResult> {
  console.log(`Starting route monitoring workflow for ${routeData.origin} to ${routeData.destination}`);
  
  // Step 1: Check traffic conditions
  const trafficInfo = await activities.checkTraffic(routeData.origin, routeData.destination);
  console.log(`Traffic check complete. Delay: ${trafficInfo.delayInMinutes} minutes`);
  
  // Step 2: Check if delay exceeds threshold
  if (!trafficInfo.exceedsThreshold) {
    console.log('Delay does not exceed threshold. No notification needed.');
    return { trafficInfo };
  }
  
  // Step 3: Generate delay message
  const message = await activities.generateMessage(
    routeData.customerName,
    routeData.origin,
    routeData.destination,
    trafficInfo
  );
  console.log('Generated delay message');
  
  // Step 4: Send notification
  const notificationData: NotificationData = {
    customerName: routeData.customerName,
    customerEmail: routeData.customerEmail,
    message,
    origin: routeData.origin,
    destination: routeData.destination,
    delayInMinutes: trafficInfo.delayInMinutes,
    sent: false,
  };
  
  const sent = await activities.sendNotification(notificationData);
  notificationData.sent = sent;
  
  if (!sent) {
    notificationData.error = 'Failed to send notification';
    console.log('Failed to send notification');
  } else {
    console.log('Notification sent successfully');
  }
  
  return {
    trafficInfo,
    notification: notificationData,
  };
} 