import sgMail from '@sendgrid/mail';
import { NotificationData } from '@/types';

export async function sendDelayNotification(notificationData: NotificationData): Promise<boolean> {
  try {
    // Check environment variables
    const apiKey = process.env.SENDGRID_API_KEY;
    if (!apiKey) {
      console.error('SENDGRID_API_KEY environment variable is missing');
      return false;
    }
    
    const fromEmail = process.env.SENDGRID_FROM_EMAIL;
    if (!fromEmail) {
      console.error('SENDGRID_FROM_EMAIL environment variable is missing');
      return false;
    }
    
    // Set API key
    sgMail.setApiKey(apiKey);
    
    // Prepare email message
    const msg = {
      to: notificationData.customerEmail,
      from: fromEmail,
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
    
    // Send email
    const [response] = await sgMail.send(msg);
    return response.statusCode >= 200 && response.statusCode < 300;
  } catch (error) {
    console.error('Error sending email notification:', error);
    return false;
  }
} 