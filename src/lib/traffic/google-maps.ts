import axios from 'axios';
import { TrafficInfo } from '@/types';

export async function getTrafficInfo(origin: string, destination: string): Promise<TrafficInfo> {
  try {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY as string;
    const baseUrl = 'https://routes.googleapis.com/directions/v2:computeRoutes';
    
    // Get route with traffic
    const trafficResponse = await axios.post(
      baseUrl,
      {
        origin: {
          address: origin
        },
        destination: {
          address: destination
        },
        travelMode: 'DRIVE',
        routingPreference: 'TRAFFIC_AWARE',
        computeAlternativeRoutes: false,
        departureTime: new Date().toISOString()
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': apiKey,
          'X-Goog-FieldMask': 'routes.duration,routes.distanceMeters'
        }
      }
    );

    // Get route without traffic
    const noTrafficResponse = await axios.post(
      baseUrl,
      {
        origin: {
          address: origin
        },
        destination: {
          address: destination
        },
        travelMode: 'DRIVE',
        routingPreference: 'TRAFFIC_UNAWARE',
        computeAlternativeRoutes: false
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': apiKey,
          'X-Goog-FieldMask': 'routes.duration,routes.distanceMeters'
        }
      }
    );

    if (
      !trafficResponse.data.routes || trafficResponse.data.routes.length === 0 ||
      !noTrafficResponse.data.routes || noTrafficResponse.data.routes.length === 0
    ) {
      throw new Error('Failed to get routes');
    }

    const trafficRoute = trafficResponse.data.routes[0];
    const noTrafficRoute = noTrafficResponse.data.routes[0];

    // Parse duration strings like "1234s" to get seconds
    const durationWithTraffic = parseInt(trafficRoute.duration.replace('s', ''), 10);
    const durationWithoutTraffic = parseInt(noTrafficRoute.duration.replace('s', ''), 10);
    
    const delay = durationWithTraffic - durationWithoutTraffic;
    const delayInMinutes = Math.round(delay / 60);
    const thresholdInMinutes = parseInt(process.env.DELAY_THRESHOLD_MINUTES || '30', 10);

    return {
      durationWithoutTraffic,
      durationWithTraffic,
      distance: parseInt(trafficRoute.distanceMeters.toString(), 10),
      delay,
      delayInMinutes,
      exceedsThreshold: delayInMinutes >= thresholdInMinutes,
    };
  } catch (error) {
    console.error('Error getting traffic info:', error);
    throw error;
  }
} 