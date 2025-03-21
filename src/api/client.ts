import { ApiResponse } from '@/types';

// Base API client with common fetch logic
export async function fetchApi<T, R>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  data?: T
): Promise<R> {
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(endpoint, options);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || `API error: ${response.status}`);
  }

  const responseData: ApiResponse<R> = await response.json();
  
  if (!responseData.success || !responseData.data) {
    throw new Error(responseData.error || 'Unknown API error');
  }
  
  return responseData.data;
} 