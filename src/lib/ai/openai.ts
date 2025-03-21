import OpenAI from 'openai';
import { TrafficInfo } from '@/types';

function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY environment variable is missing');
  }
  return new OpenAI({ apiKey });
}

export async function generateDelayMessage(
  customerName: string,
  origin: string,
  destination: string,
  trafficInfo: TrafficInfo
): Promise<string> {
  try {
    const openai = getOpenAIClient();
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that generates personalized delay notifications for freight deliveries. Generate ONLY the message body, not the subject line or signature. Do not include placeholders like [Your Name] or [Your Company]."
        },
        {
          role: "user",
          content: `Generate a brief, professional message body for ${customerName} about a delivery delay. 
          The route is from ${origin} to ${destination}. 
          The delay is ${trafficInfo.delayInMinutes} minutes due to traffic conditions.
          
          Important:
          1. Do NOT include a subject line
          2. Do NOT include placeholders like [Your Name] or [Your Company]
          3. Sign the message with the customer's name (${customerName})
          4. Keep it concise and informative`
        }
      ],
      temperature: 0.7,
    });

    return response.choices[0].message.content || "We're experiencing a delivery delay due to traffic conditions.";
  } catch (error) {
    console.error("Error generating delay message:", error);
    
    // Provide a fallback message when API fails
    return `Dear ${customerName},\n\nWe wanted to inform you that your delivery from ${origin} to ${destination} is experiencing a delay of approximately ${trafficInfo.delayInMinutes} minutes due to traffic conditions.\n\nWe appreciate your understanding and will keep you updated on the status.\n\nBest regards,\n${customerName}`;
  }
} 