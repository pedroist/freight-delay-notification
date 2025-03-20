import OpenAI from 'openai';
import { TrafficInfo } from '@/types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateDelayMessage(
  customerName: string,
  origin: string,
  destination: string,
  trafficInfo: TrafficInfo
): Promise<string> {
  try {
    const prompt = `
      Generate a friendly, professional message to a customer about a freight delivery delay.
      
      Customer name: ${customerName}
      Origin: ${origin}
      Destination: ${destination}
      Delay: ${trafficInfo.delayInMinutes} minutes
      
      The message should:
      1. Address the customer by name
      2. Explain that there's a traffic delay on their freight delivery route
      3. Specify the delay time in minutes
      4. Apologize for the inconvenience
      5. Assure them we're monitoring the situation
      6. Keep it concise (max 3-4 sentences)
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful freight delivery notification assistant.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 200,
    });

    return response.choices[0].message.content?.trim() || getFallbackMessage(customerName, trafficInfo.delayInMinutes);
  } catch (error) {
    console.error('Error generating delay message:', error);
    return getFallbackMessage(customerName, trafficInfo.delayInMinutes);
  }
}

function getFallbackMessage(customerName: string, delayInMinutes: number): string {
  return `Dear ${customerName}, we wanted to inform you that your freight delivery is currently experiencing a delay of approximately ${delayInMinutes} minutes due to traffic conditions. We apologize for any inconvenience and are monitoring the situation closely.`;
} 