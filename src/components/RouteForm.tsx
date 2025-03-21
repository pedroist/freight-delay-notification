import { useState } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Paper, 
  CircularProgress 
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { monitorRoute } from '@/api/endpoints';
import { RouteData, MonitoringResult } from '@/types';
import GooglePlacesAutocomplete from '@/components/GooglePlacesAutocomplete';

interface RouteFormProps {
  onSuccess: (result: MonitoringResult) => void;
}

const RouteForm = ({ onSuccess }: RouteFormProps) => {
  const [formData, setFormData] = useState<RouteData
  >({
    origin: '',
    destination: '',
    customerName: '',
    customerEmail: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const { mutate, isPending } = useMutation({
    mutationFn: monitorRoute,
    onSuccess: (data) => {
      onSuccess(data);
    },
  });

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.origin) newErrors.origin = 'Origin is required';
    if (!formData.destination) newErrors.destination = 'Destination is required';
    if (!formData.customerName) newErrors.customerName = 'Customer name is required';
    
    if (!formData.customerEmail) {
      newErrors.customerEmail = 'Customer email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.customerEmail)) {
      newErrors.customerEmail = 'Invalid email format';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      mutate(formData);
    }
  };

  const handleChange = (field: keyof RouteData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    
    // Clear error when field is updated
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Monitor Freight Route
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <GooglePlacesAutocomplete
          label="Origin"
          value={formData.origin}
          onChange={(value) => handleChange('origin', value)}
          required
          error={!!errors.origin}
          helperText={errors.origin}
        />
        
        <Box sx={{ mt: 2 }}>
          <GooglePlacesAutocomplete
            label="Destination"
            value={formData.destination}
            onChange={(value) => handleChange('destination', value)}
            required
            error={!!errors.destination}
            helperText={errors.destination}
          />
        </Box>
        
        <Box sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Customer Name"
            value={formData.customerName}
            onChange={(e) => handleChange('customerName', e.target.value)}
            required
            error={!!errors.customerName}
            helperText={errors.customerName}
          />
        </Box>
        
        <Box sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Customer Email"
            type="email"
            value={formData.customerEmail}
            onChange={(e) => handleChange('customerEmail', e.target.value)}
            required
            error={!!errors.customerEmail}
            helperText={errors.customerEmail}
          />
        </Box>
        
        <Box sx={{ mt: 3 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={isPending}
            startIcon={isPending ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {isPending ? 'Checking Route...' : 'Check Route'}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default RouteForm;