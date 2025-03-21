import { Box, Paper, Typography, Divider, Chip, Alert } from '@mui/material';
import { MonitoringResult } from '@/types';

interface ResultDisplayProps {
  result: MonitoringResult;
}

const ResultDisplay = ({ result }: ResultDisplayProps) => {
  const { trafficInfo, notification } = result;
  
  // Format duration in minutes and seconds
  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };
  
  // Format distance in kilometers
  const formatDistance = (meters: number): string => {
    return `${(meters / 1000).toFixed(1)} km`;
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Route Monitoring Results
      </Typography>
      
      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle1" fontWeight="bold">
          Traffic Information
        </Typography>
        
        <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2">Distance:</Typography>
            <Typography variant="body2" fontWeight="medium">
              {formatDistance(trafficInfo.distanceMeters)}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2">Normal Duration:</Typography>
            <Typography variant="body2" fontWeight="medium">
              {formatDuration(trafficInfo.durationWithoutTraffic)}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2">Current Duration:</Typography>
            <Typography variant="body2" fontWeight="medium">
              {formatDuration(trafficInfo.durationWithTraffic)}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2">Delay:</Typography>
            <Typography 
              variant="body2" 
              fontWeight="medium"
              color={trafficInfo.exceedsThreshold ? 'error.main' : 'success.main'}
            >
              {trafficInfo.delayInMinutes} minutes
            </Typography>
          </Box>
          
          <Box sx={{ mt: 1 }}>
            <Chip 
              label={trafficInfo.exceedsThreshold ? 'Significant Delay' : 'Normal Traffic'} 
              color={trafficInfo.exceedsThreshold ? 'error' : 'success'}
              size="small"
            />
          </Box>
        </Box>
      </Box>
      
      {notification && (
        <>
          <Divider sx={{ my: 3 }} />
          
          <Box>
            <Typography variant="subtitle1" fontWeight="bold">
              Notification Status
            </Typography>
            
            {notification.sent ? (
              <Alert severity="success" sx={{ mt: 1 }}>
                Notification sent successfully to {notification.customerEmail}
              </Alert>
            ) : (
              <Alert severity="error" sx={{ mt: 1 }}>
                Failed to send notification: {notification.error || 'Unknown error'}
              </Alert>
            )}
            
            <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
              <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
                {notification.message}
              </Typography>
            </Box>
          </Box>
        </>
      )}
      
      {!notification && trafficInfo.exceedsThreshold && (
        <Alert severity="warning" sx={{ mt: 3 }}>
          Delay exceeds threshold but notification processing failed.
        </Alert>
      )}
      
      {!notification && !trafficInfo.exceedsThreshold && (
        <Alert severity="info" sx={{ mt: 3 }}>
          No notification sent as the delay is within normal limits.
        </Alert>
      )}
    </Paper>
  );
};

export default ResultDisplay; 