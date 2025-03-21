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
          content: "You are a helpful assistant that generates personalized delay notifications for freight deliveries."
        },
        {
          role: "user",
          content: `Generate a brief, professional message for ${customerName} about a delivery delay. 
          The route is from ${origin} to ${destination}. 
          The delay is ${trafficInfo.delayInMinutes} minutes due to traffic conditions.
          Keep it concise and informative.`
        }
      ],
      temperature: 0.7,
    });

    return response.choices[0].message.content || "We're experiencing a delivery delay due to traffic conditions.";
  } catch (error) {
    console.error("Error generating delay message:", error);
    
    // Provide a fallback message when API fails
    return `Dear ${customerName}, we're experiencing a ${trafficInfo.delayInMinutes}-minute delay on your delivery from ${origin} to ${destination} due to traffic conditions. We apologize for any inconvenience.`;
  }
} 