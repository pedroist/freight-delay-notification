import { Client, TravelMode } from '@googlemaps/google-maps-services-js';
import { TrafficInfo } from '@/types';

const client = new Client({});

export async function getTrafficInfo(origin: string, destination: string): Promise<TrafficInfo> {
  try {
    // Get route with traffic
    const trafficResponse = await client.directions({
      params: {
        origin,
        destination,
        mode: TravelMode.driving,
        departure_time: 'now',
        key: process.env.GOOGLE_MAPS_API_KEY as string,
      },
    });

    // Get route without traffic
    const noTrafficResponse = await client.directions({
      params: {
        origin,
        destination,
        mode: TravelMode.driving,
        key: process.env.GOOGLE_MAPS_API_KEY as string,
      },
    });

    if (
      trafficResponse.data.status !== 'OK' ||
      noTrafficResponse.data.status !== 'OK'
    ) {
      throw new Error('Failed to get directions');
    }

    const trafficRoute = trafficResponse.data.routes[0].legs[0];
    const noTrafficRoute = noTrafficResponse.data.routes[0].legs[0];

    const durationWithTraffic = trafficRoute.duration.value;
    const durationWithoutTraffic = noTrafficRoute.duration.value;
    const delay = durationWithTraffic - durationWithoutTraffic;
    const delayInMinutes = Math.round(delay / 60);
    const thresholdInMinutes = parseInt(process.env.DELAY_THRESHOLD_MINUTES || '30', 10);

    return {
      durationWithoutTraffic,
      durationWithTraffic,
      distance: trafficRoute.distance.value,
      delay,
      delayInMinutes,
      exceedsThreshold: delayInMinutes >= thresholdInMinutes,
    };
  } catch (error) {
    console.error('Error getting traffic info:', error);
    throw error;
  }
} 