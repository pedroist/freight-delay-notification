import { useEffect, useState } from 'react';
import { Autocomplete, TextField, CircularProgress } from '@mui/material';
import { useLoadScript } from '@react-google-maps/api';

interface GooglePlacesAutocompleteProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  error?: boolean;
  helperText?: string;
}

const libraries: ("places")[] = ["places"];

const GooglePlacesAutocomplete = ({
  label,
  value,
  onChange,
  required = false,
  error = false,
  helperText = '',
}: GooglePlacesAutocompleteProps) => {
  const [inputValue, setInputValue] = useState(value);
  const [options, setOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    libraries,
  });

  useEffect(() => {
    let autoCompleteService: google.maps.places.AutocompleteService | null = null;
    let active = true;

    if (!isLoaded || loadError) return;

    if (inputValue === '') {
      setOptions([]);
      return;
    }

    autoCompleteService = new google.maps.places.AutocompleteService();
    setLoading(true);

    autoCompleteService.getPlacePredictions(
      { input: inputValue },
      (predictions, status) => {
        if (active) {
          let newOptions: string[] = [];

          if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
            newOptions = predictions.map((prediction) => prediction.description);
          }

          setOptions(newOptions);
          setLoading(false);
        }
      }
    );

    // Cleanup function to prevent memory leaks and race conditions on input change
    return () => {
      active = false;
    };
  }, [inputValue, isLoaded, loadError]);

  if (!isLoaded) return <TextField label={label} disabled />;
  if (loadError) return <TextField label={label} error helperText="Error loading Google Maps" />;

  return (
    <Autocomplete
      freeSolo
      options={options}
      loading={loading}
      value={value}
      inputValue={inputValue}
      onInputChange={(_, newInputValue) => {
        setInputValue(newInputValue);
      }}
      onChange={(_, newValue) => {
        onChange(newValue || '');
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          required={required}
          error={error}
          helperText={helperText}
          slotProps={{
            input: {
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }
          }}
        />
      )}
    />
  );
};

export default GooglePlacesAutocomplete; 