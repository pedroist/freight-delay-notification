import sgMail from '@sendgrid/mail';
import { NotificationData } from '@/types';

export async function sendDelayNotification(notificationData: NotificationData): Promise<boolean> {
  try {
    // 1. Check environment variables
    const apiKey = process.env.SENDGRID_API_KEY;
    if (!apiKey) {
      console.error('ERROR: SENDGRID_API_KEY environment variable is missing');
      return false;
    }
    
    const fromEmail = process.env.SENDGRID_FROM_EMAIL;
    if (!fromEmail) {
      console.error('ERROR: SENDGRID_FROM_EMAIL environment variable is missing');
      return false;
    }
    
    // 2. Log partial API key for debugging (first 5 chars only)
    console.log(`Using SendGrid API key: ${apiKey.substring(0, 5)}...${apiKey.substring(apiKey.length - 4)}`);
    console.log(`Using sender email: ${fromEmail}`);
    
    // 3. Set API key
    try {
      sgMail.setApiKey(apiKey);
    } catch (error) {
      console.error('ERROR: Failed to set SendGrid API key:', error);
      return false;
    }
    
    // 4. Prepare email message
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
    
    // 5. Log email details
    console.log('Preparing to send email:');
    console.log(`- To: ${notificationData.customerEmail}`);
    console.log(`- From: ${fromEmail}`);
    console.log(`- Subject: Freight Delivery Delay Notification`);
    
    // 6. Send email with detailed error handling
    try {
      const [response] = await sgMail.send(msg);
      console.log(`Email sent successfully! Status code: ${response.statusCode}`);
      return true;
    } catch (error: any) {
      console.error('ERROR: Failed to send email via SendGrid');
      
      // 7. Detailed error logging
      if (error.response) {
        console.error(`Status code: ${error.response.statusCode}`);
        console.error(`Body: ${JSON.stringify(error.response.body)}`);
        console.error(`Headers: ${JSON.stringify(error.response.headers)}`);
      } else {
        console.error(error.toString());
      }
      
      // 8. Check for common errors
      if (error.code === 401 || (error.response && error.response.statusCode === 401)) {
        console.error('UNAUTHORIZED: Your SendGrid API key appears to be invalid or revoked');
      } else if (error.code === 403 || (error.response && error.response.statusCode === 403)) {
        console.error('FORBIDDEN: Your account may be suspended or the sender email is not verified');
      }
      
      // During development, you might want to return true to continue workflow
      return false;
    }
  } catch (error) {
    console.error('Unexpected error in sendDelayNotification function:', error);
    return false;
  }
} 