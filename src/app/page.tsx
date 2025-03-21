'use client';

import { useState } from 'react';
import { Container, Box, Typography, Button } from '@mui/material';
import RouteForm from '@/components/RouteForm';
import ResultDisplay from '@/components/MonitoringResult';
import { MonitoringResult } from '@/types';

const Home = () => {
  const [result, setResult] = useState<MonitoringResult | null>(null);
  
  const handleSuccess = (data: MonitoringResult) => {
    setResult(data);
  };
  
  const handleReset = () => {
    setResult(null);
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Freight Delay Notification System
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" paragraph>
          Monitor traffic delays on freight delivery routes and notify customers when significant delays occur.
        </Typography>
      </Box>
      
      {!result ? (
        <RouteForm onSuccess={handleSuccess} />
      ) : (
        <Box>
          <ResultDisplay result={result} />
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Button variant="outlined" onClick={handleReset}>
              Check Another Route
            </Button>
          </Box>
        </Box>
      )}
    </Container>
  );
};

export default Home;
