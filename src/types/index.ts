// Route information
export interface RouteData {
  origin: string;
  destination: string;
  customerEmail: string;
  customerName: string;
}

// Traffic information
export interface TrafficInfo {
  durationWithoutTraffic: number; // in seconds
  durationWithTraffic: number; // in seconds
  distance: number; // in meters
  delay: number; // in seconds (durationWithTraffic - durationWithoutTraffic)
  delayInMinutes: number; // delay converted to minutes
  exceedsThreshold: boolean;
}

// Notification data
export interface NotificationData {
  customerName: string;
  customerEmail: string;
  message: string;
  origin: string;
  destination: string;
  delayInMinutes: number;
  sent: boolean;
  error?: string;
}

// API response format
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Monitoring result
export interface MonitoringResult {
  trafficInfo: TrafficInfo;
  notification?: NotificationData;
}
