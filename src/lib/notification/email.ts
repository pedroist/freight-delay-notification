import sgMail from '@sendgrid/mail';
import { NotificationData } from '@/types';

// Initialize SendGrid with API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

export async function sendDelayNotification(notificationData: NotificationData): Promise<boolean> {
  try {
    const msg = {
      to: notificationData.customerEmail,
      from: process.env.SENDGRID_FROM_EMAIL as string,
      subject: 'Freight Delivery Delay Notification',
      text: notificationData.message,
      html: `<div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <p>${notificationData.message}</p>
        <p style="color: #666; font-size: 0.9em;">
          Route: ${notificationData.origin} to ${notificationData.destination}<br>
          Estimated delay: ${notificationData.delayInMinutes} minutes
        </p>
      </div>`,
    };

    await sgMail.send(msg);
    return true;
  } catch (error) {
    console.error('Error sending email notification:', error);
    return false;
  }
} 