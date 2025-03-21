import OpenAI from 'openai';
import { TrafficInfo } from '@/types';

// Create a function that returns the OpenAI client instead of initializing it at module level
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
    // Get the OpenAI client when the function is called
    const openai = getOpenAIClient();
    
    const prompt = `
      You are a freight delivery notification service. Write a brief, professional message to ${customerName} 
      informing them of a delay in their delivery due to traffic conditions.
      
      Route: From ${origin} to ${destination}
      Delay: ${trafficInfo.delayInMinutes} minutes
      
      Keep the message concise, professional, and empathetic. Include the specific delay time and route information.
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 200,
    });

    return response.choices[0].message.content || 'We regret to inform you that your delivery will be delayed due to traffic conditions.';
  } catch (error) {
    console.error('Error generating delay message:', error);
    return `Dear ${customerName}, we regret to inform you that your delivery from ${origin} to ${destination} will be delayed by approximately ${trafficInfo.delayInMinutes} minutes due to traffic conditions. We apologize for any inconvenience.`;
  }
} 